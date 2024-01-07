import { z } from "zod";

import { withKeyAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const postSchema = {
  body: z.object({
    fileUrl: z.string(),
  }),
};

export const POST = withKeyAuth({
  handler: async ({ body, projectid }) => {
    // We download the file from the URL
    const file = await fetch(body.fileUrl);
    const fileBuffer = await file.arrayBuffer();
    const fileMimeString = file.headers.get("Content-Type") ?? "";

    // If the file is a markdown file
    if (fileMimeString === "text/markdown") {
      // Extract the text from the markdown file
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
        type: "markdown",
        url: body.fileUrl,
      });

      return { status: 200, body: null };
    }

    // If the file is not supported
    return { status: 415, body: null };
  },
  schema: postSchema,
});

export const getSchema = {
  params: z.object({
    limit: z.coerce.number().gt(0).lte(100).int().default(10),
    query: z.string(),
  }),
  response: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
      type: z.string(),
      url: z.string(),
      _extras: z.object({
        distance: z.number().optional(),
        projectid: z.string(),
      }),
    }),
  ),
};

export const GET = withKeyAuth({
  handler: async ({ params }) => {
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
      params.limit,
    );

    return {
      status: 200,
      body: files.map((file) => {
        return {
          id: file.id!,
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
