import { z } from "zod";

import { withAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

import { syncFileBodySchema } from "./types";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const POST = withAuth(
  async ({ body, token }) => {
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
        projectid: token,
        text,
        type: "markdown",
        url: body.fileUrl,
      });

      return new Response("OK", { status: 200 });
    }

    // If the file is not supported
    return new Response("Unsupported file type", { status: 415 });
  },
  { bodySchema: syncFileBodySchema },
);

export const GET = withAuth(
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
    paramsSchema: z.object({
      query: z.string(),
      limit: z.coerce.number().default(10),
    }),
  },
);
