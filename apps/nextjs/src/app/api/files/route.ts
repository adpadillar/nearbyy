import { withKeyAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

import { TextExtractor } from "~/utils/server/TextExtractor";
import { deleteSchema, getSchema, postSchema } from "./schema";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const DELETE = withKeyAuth({
  handler: async ({ body, projectid }) => {
    const deletionsPromises = body.ids.map((id) => {
      return db.drizzle
        .delete(db.schema.files)
        .where(
          db.helpers.and(
            db.helpers.eq(db.schema.files.projectid, projectid),
            db.helpers.eq(db.schema.files.id, id),
          ),
        );
    });

    const results = await Promise.allSettled(deletionsPromises);

    const rejectedIndexes = results
      .map((res, idx) => {
        if (res.status === "rejected") return idx;
        return -1;
      })
      .filter((idx) => idx !== -1);

    const rejectedIds = rejectedIndexes.map((idx) => body.ids[idx]!);

    if (rejectedIds.length > 0) {
      return {
        // Return status 207 to indicate that some files could not be deleted
        status: 207,
        body: {
          success: false,
          error: "Some files could not be deleted",
          rejectedIds,
        },
      };
    }

    return {
      status: 200,
      body: { success: true },
    };
  },
  schema: deleteSchema,
});

export const POST = withKeyAuth({
  handler: async ({ body, projectid }) => {
    const filesToPost = body.fileUrls ?? [body.fileUrl];

    const urlToUUID: Record<string, string> = {};

    const promises = filesToPost.map(async (fileUrl) => {
      const file = await fetch(fileUrl);
      const fileBuffer = await file.arrayBuffer();
      const fileMimeString = file.headers.get("Content-Type") ?? "";

      const textExtractor = new TextExtractor({
        buffer: fileBuffer,
        mimeType: fileMimeString,
      });

      const { error, text } = await textExtractor.extract();

      if (error) {
        return Promise.reject(new Error(error));
      }

      const { embedding, success } = await getSingleEmbedding(text);

      if (!success) {
        return Promise.reject(new Error("Could not generate embedding"));
      }

      const fileId = crypto.randomUUID();
      // store the assigned UUID to the file URL
      urlToUUID[fileUrl] = fileId;
      await db.drizzle.insert(db.schema.files).values({
        embedding: embedding,
        projectid,
        text,
        type: fileMimeString,
        url: fileUrl,
        id: fileId,
        createdAt: new Date(),
      });
    });

    const results = await Promise.allSettled(promises);

    const rejectedIndexes = results
      .map((res, idx) => {
        if (res.status === "rejected") return idx;
        return -1;
      })
      .filter((idx) => idx !== -1);

    const fulfilledIndexes = results
      .map((res, idx) => {
        if (res.status === "fulfilled") return idx;
        return -1;
      })
      .filter((idx) => idx !== -1);

    const rejectedUrls = rejectedIndexes.map((idx) => filesToPost[idx]!);
    const fulfilledIds = fulfilledIndexes.map(
      (idx) => urlToUUID[filesToPost[idx]!]!,
    );

    if (rejectedUrls.length > 0) {
      return {
        // Return status 207 to indicate that some files could not be uploaded
        status: 207,
        body: {
          ids: fulfilledIds,
          success: false,
          error: "Some files could not be uploaded",
          rejectedUrls,
        },
      };
    }

    return {
      status: 200,
      body: {
        ids: fulfilledIds,
        success: true,
        error: null,
      },
    };
  },
  schema: postSchema,
});

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
    // Get the embedding of the query
    const { embedding, success } = await getSingleEmbedding(params.query);

    if (!success) {
      return {
        status: 500,
        body: [],
      };
    }

    // Get the files that are similar to the embedding
    const files = await db.vector.similarity(
      "files",
      "embedding",
      embedding,
      projectid,
      params.limit,
    );

    return {
      status: 200,
      body: files.map((file) => {
        return {
          id: file.id,
          text: file.text,
          type: file.type,
          url: file.url,
          _extras: {
            distance: file.distance,
            projectid: file.projectid,
          },
        };
      }),
    };
  },
  schema: getSchema,
});
