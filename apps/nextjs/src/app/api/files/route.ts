import { withKeyAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

import { getSchema, postSchema } from "./schema";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const POST = withKeyAuth({
  handler: async ({ body, projectid }) => {
    // We download the file from the URL
    const file = await fetch(body.fileUrl);
    const fileBuffer = await file.arrayBuffer();
    const fileMimeString = file.headers.get("Content-Type") ?? "";

    // If the file is a markdown file
    if (fileMimeString.startsWith("text/")) {
      // Extract the text from the text file
      const text = new TextDecoder().decode(fileBuffer);

      // Generate the embedding
      const { embedding, success } = await getSingleEmbedding(text);

      if (!success) {
        return { status: 500, body: null };
      }

      // Insert the file into the database
      await db.drizzle.insert(db.schema.files).values({
        embedding: embedding,
        projectid,
        text,
        type: fileMimeString,
        url: body.fileUrl,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      });

      return { status: 200, body: null };
    }

    // If the file is not supported
    return { status: 415, body: null };
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

    console.log(files);

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
