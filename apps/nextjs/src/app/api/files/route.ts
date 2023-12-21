import { z } from "zod";

import { withAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

import { syncFileBodySchema } from "./types";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const POST = withAuth(
  async ({ body, token }) => {
    // STEP 1: Download the file from the URL
    const file = await fetch(body.fileUrl);
    const fileBuffer = await file.arrayBuffer();

    // STEP 2: Check file type
    const fileMimeString = file.headers.get("Content-Type") ?? "";

    if (fileMimeString === "text/markdown") {
      const text = new TextDecoder().decode(fileBuffer);

      // STEP 3: Upload the file to Vector Database
      const embedding = (await getSingleEmbedding(text))!;

      await db.drizzle.insert(db.schema.files).values({
        embedding: embedding.map((x) => `${x}`),
        projectid: token,
        text,
        type: "markdown",
        url: body.fileUrl,
      });

      return new Response("OK", { status: 200 });
    }

    return new Response("Unsupported file type", { status: 415 });
  },
  { bodySchema: syncFileBodySchema },
);

export const GET = withAuth(
  async ({ params }) => {
    const embedding = (await getSingleEmbedding(params.query))!;

    const files = await db.vector.similarity("files", "embedding", embedding);

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
      limit: z.string().default("5"),
    }),
  },
);
