import { z } from "zod";

import { withKeyAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

/**
 * POST `/api/files`
 *
 * This endpoint takes a URL to a file, extracts the text from it, and stores it
 * in the vector database. It will return a 200 if the file was successfully stored
 * or a 415 if the file type is not supported
 */
export const POST = withKeyAuth(
  async ({ body, projectid }) => {
    // We download the file from the URL
    const file = await fetch(body.fileUrl);
    const fileBuffer = await file.arrayBuffer();
    const fileMimeString = file.headers.get("Content-Type") ?? "";

    // If the file is a markdown file
    if (fileMimeString === "text/markdown") {
      // Extract the text from the markdown file
      const text = new TextDecoder().decode(fileBuffer);

      // Generate the embedding
      const embedding = (await getSingleEmbedding(text))!;

      // Insert the file into the database
      await db.drizzle.insert(db.schema.files).values({
        embedding: embedding.map((x) => `${x}`),
        projectid,
        text,
        type: "markdown",
        url: body.fileUrl,
      });

      return new Response("OK", { status: 200 });
    }

    // If the file is not supported
    return new Response("Unsupported file type", { status: 415 });
  },
  {
    bodyValidator: z.object({
      fileUrl: z.string().url(),
    }),
  },
);

/**
 * GET `/api/files`
 *
 * This endpoint takes a query and returns the most similar files to that query
 * in the vector database
 */
export const GET = withKeyAuth(
  async ({ params }) => {
    // Get the embedding of the query
    const embedding = (await getSingleEmbedding(params.query))!;

    // Get the files that are similar to the embedding
    const files = await db.vector.similarity(
      "files",
      "embedding",
      embedding,
      params.limit,
    );

    // Remove the embedding from the response
    return new Response(
      JSON.stringify(
        files.map((file) => ({
          ...file,
          embedding: undefined,
          distance: undefined,
          _extras: {
            distance: file.distance,
          },
        })),
      ),
      { status: 200 },
    );
  },
  {
    paramsValidator: z.object({
      query: z.string(),
      limit: z.coerce.number().lte(100).gt(0).int().default(10),
    }),
  },
);
