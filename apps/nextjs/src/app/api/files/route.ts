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

import { TextExtractor } from "~/utils/server/TextExtractor";

export const maxDuration = 10;

export const DELETE = withKeyAuth({
  handler: async ({ body, projectid }) => {
    const deletion = await db.drizzle
      .delete(db.schema.files)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.files.projectid, projectid),
          db.helpers.inArray(db.schema.files.id, body.ids),
        ),
      )
      .returning({ id: db.schema.files.id });

    const successfulDeletionsIds = deletion.map((file) => file.id);

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

    const countQuery = await db.drizzle
      .select({ count: db.helpers.count(db.schema.files) })
      .from(db.schema.files)
      .where(db.helpers.eq(db.schema.files.projectid, projectid));

    const projectFileCount = countQuery[0]?.count ?? 0;

    if (projectFileCount + fileUrls.length > 250) {
      return {
        status: 500,
        body: {
          success: false,
          error: "Project file limit exceeded",
          data: {
            ids: [] as string[],
            rejectedUrls: fileUrls,
          },
        },
      } as const;
    }

    const urlToUUID: Record<string, string> = {};

    const promises = fileUrls.map(async (fileUrl) => {
      const file = await fetch(fileUrl);
      const fileBuffer = await file.arrayBuffer();
      const fileMimeString = file.headers.get("Content-Type") ?? "";

      const textExtractor = new TextExtractor({
        arrayBuffer: fileBuffer,
        mimeType: fileMimeString,
      });

      const { error, text } = await textExtractor.extract();

      if (error) {
        return Promise.reject(new Error(error));
      }

      const fileId = crypto.randomUUID();
      // store the assigned UUID to the file URL
      urlToUUID[fileUrl] = fileId;

      const resChunking = await chunking(text, 300, 30);
      await db.drizzle.insert(db.schema.chunks).values(
        resChunking.map((chunk) => ({
          id: crypto.randomUUID(),
          fileId: fileId,
          projectId: projectid,
          order: chunk.order,
          tokens: chunk.tokens,
          tokenLength: chunk.tokenLength,
          embedding: chunk.embedding,
          text: chunk.text,
        })),
      );

      await db.drizzle.insert(db.schema.files).values({
        projectid,
        text,
        type: fileMimeString,
        url: fileUrl,
        id: fileId,
        createdAt: new Date(),
      });
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
      (idx) => urlToUUID[fileUrls[idx]!]!,
    );

    if (rejectedIndexes.length === fileUrls.length) {
      // All files were rejected
      return {
        status: 500,
        body: {
          success: false,
          error: errors,
          data: {
            ids: fulfilledIds,
            rejectedUrls,
          },
        },
      } as const;
    }

    if (rejectedUrls.length > 0) {
      return {
        // Return status 207 to indicate that some files could not be uploaded
        status: 207,
        body: {
          success: false,
          error: "Some files could not be uploaded",
          data: {
            ids: fulfilledIds,
            rejectedUrls,
          },
        },
      } as const;
    }

    return {
      status: 200,
      body: {
        success: true,
        error: null,
        data: { ids: fulfilledIds },
      },
    } as const;
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
        success: false,
        error: "Route not implemented yet",
      },
    } as const;
  },
  schema: {
    params: fileEndpointGetParams,
    response: fileEndpointGetResponse,
  },
});
