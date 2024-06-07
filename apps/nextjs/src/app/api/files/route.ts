import { withKeyAuth } from "@nearbyy/auth";
import {
  fileEndpointDeleteBody,
  fileEndpointDeleteResponse,
  fileEndpointGetParams,
  fileEndpointGetResponse,
  fileEndpointPostBody,
  fileEndpointPostResponse,
} from "@nearbyy/core";
import { db } from "@nearbyy/db";
import { chunking } from "@nearbyy/embeddings";

import { env } from "~/env";
import { TextExtractor } from "~/utils/server/TextExtractor";
import { FILE_QUOTA } from "~/utils/shared/constants";

export const maxDuration = 60;

export const DELETE = withKeyAuth({
  handler: async ({ body, projectid }) => {
    const fileDeletion = await db.drizzle
      .delete(db.schema.files)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.files.projectid, projectid),
          db.helpers.inArray(db.schema.files.id, body.ids),
        ),
      )
      .returning({ id: db.schema.files.id });

    const chunkDeletion = await db.drizzle
      .delete(db.schema.chunks)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.chunks.projectId, projectid),
          db.helpers.inArray(db.schema.chunks.fileId, body.ids),
        ),
      )
      .returning({ id: db.schema.chunks.fileId });

    const deletions = new Set(
      [...fileDeletion, ...chunkDeletion].map((chunk) => chunk.id),
    );
    const successfulDeletionsIds = Array.from(deletions);

    const rejectedIds = body.ids.filter(
      (id) => !successfulDeletionsIds.includes(id),
    );

    if (rejectedIds.length === body.ids.length) {
      return {
        status: 500,
        body: {
          success: false,
          error: "Files could not be deleted",
          data: {
            rejectedIds,
            ids: successfulDeletionsIds,
          },
        },
      } as const;
    }

    if (rejectedIds.length > 0) {
      return {
        // Return status 207 to indicate that some files could not be deleted
        status: 207,
        body: {
          success: false,
          error: "Some files could not be deleted",
          data: {
            rejectedIds,
            ids: successfulDeletionsIds,
          },
        },
      } as const;
    }

    return {
      status: 200,
      body: {
        success: true,
        error: null,
        data: {
          ids: successfulDeletionsIds,
        },
      },
    } as const;
  },
  schema: {
    body: fileEndpointDeleteBody,
    response: fileEndpointDeleteResponse,
  },
});

export const POST = withKeyAuth({
  handler: async ({ body, projectid }) => {
    const fileUrls = body.fileUrls;
    const tag = body.tag;

    const countQuery = await db.drizzle
      .select({ count: db.helpers.count(db.schema.files) })
      .from(db.schema.files)
      .where(db.helpers.eq(db.schema.files.projectid, projectid));

    const projectFileCount = countQuery[0]?.count ?? 0;

    if (projectFileCount + fileUrls.length > FILE_QUOTA) {
      return {
        status: 500,
        body: {
          success: false as const,
          error: "Project file limit exceeded",
          data: {
            files: [],
            rejectedUrls: fileUrls,
          },
        },
      };
    }

    const urlToUUID: Record<string, string> = {};

    const promises = fileUrls.map(async (fileUrl) => {
      const file = await fetch(fileUrl);
      const fileBlob = await file.blob();
      const fileMimeString = fileBlob.type;
      const textExtractor = new TextExtractor({
        fileBlob: fileBlob,
      });

      const { error, text } = await textExtractor.extract();

      if (error) {
        return Promise.reject(new Error(error));
      }

      let fileId = "";
      if (fileUrl.startsWith(env.CLOUDFRONT_URL)) {
        // If the file corresponds to our cloudfront URL, we can extract the fileId from the URL
        // to match the fileId that was already assigned to the file
        fileId = fileUrl.split("/").pop()!;
      } else {
        // Otherwise, we generate a new fileId
        fileId = crypto.randomUUID();
      }

      // store the assigned UUID to the file URL
      urlToUUID[fileUrl] = fileId;

      const resChunking = await chunking(text, 300, 30);

      for (let i = 0; i < resChunking.length; i += 8) {
        const chunkSlice = resChunking.slice(i, i + 8);
        const chunkPromise = db.drizzle.insert(db.schema.chunks).values(
          chunkSlice.map((chunk) => ({
            id: crypto.randomUUID(),
            fileId: fileId,
            projectId: projectid,
            order: chunk.order,
            tokens: chunk.tokens,
            tokenLength: chunk.tokenLength,
            embedding: chunk.embedding,
            text: chunk.text,
            tag,
          })),
        );
        await chunkPromise;
      }

      await db.drizzle.insert(db.schema.files).values({
        projectid,
        text, // temporarily empty
        type: fileMimeString,
        url: fileUrl,
        id: fileId,
        createdAt: new Date(),
        tag,
      });

      if (fileUrl.startsWith(env.CLOUDFRONT_URL)) {
        // mark the presigned URL as SUCCESS
        await db.drizzle
          .update(db.schema.presignedUrls)
          .set({ status: "SUCCESS" })
          .where(db.helpers.eq(db.schema.presignedUrls.fileId, fileId));
      }
    });

    const results = await Promise.allSettled(promises);

    let errors = "";
    const rejectedIndexes = results
      .map((res, idx) => {
        if (res.status === "rejected") {
          errors += `Error uploading file at index ${idx}: ${res.reason}\n`;
          return idx;
        }

        return -1;
      })
      .filter((idx) => idx !== -1);

    const fulfilledIndexes = results
      .map((res, idx) => {
        if (res.status === "fulfilled") return idx;
        return -1;
      })
      .filter((idx) => idx !== -1);

    const rejectedUrls = rejectedIndexes.map((idx) => fileUrls[idx]!);
    const fulfilledIds = fulfilledIndexes.map(
      (idx) => [urlToUUID[fileUrls[idx]!]!, fileUrls[idx]!] as [string, string],
    );

    if (rejectedIndexes.length === fileUrls.length) {
      // All files were rejected
      return {
        status: 500,
        body: {
          success: false as const,
          error: errors,
          data: {
            files: [],
            rejectedUrls,
          },
        },
      };
    }

    if (rejectedUrls.length > 0) {
      return {
        // Return status 207 to indicate that some files could not be uploaded
        status: 207,
        body: {
          success: false,
          error: "Some files could not be uploaded",
          data: {
            files: fulfilledIds.map(([id, url]) => ({ id, url })),
            rejectedUrls,
          },
        },
      } as const;
    }

    return {
      status: 200,
      body: {
        success: true as const,
        error: null,
        data: {
          files: fulfilledIds.map(([id, url]) => ({ id, url })),
        },
      },
    };
  },
  schema: {
    body: fileEndpointPostBody,
    response: fileEndpointPostResponse,
  },
});

export const GET = withKeyAuth({
  handler: async () => {
    return {
      status: 500,
      body: {
        data: null,
        success: false as const,
        error: "Route not implemented yet",
      },
    };
  },
  schema: {
    params: fileEndpointGetParams,
    response: fileEndpointGetResponse,
  },
});
