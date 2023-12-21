import type { NextRequest } from "next/server";
import type { z } from "zod";
import OpenAI from "openai";

import { db } from "@nearbyy/db";

import { env } from "~/env";
import { syncFileBodySchema } from "./types";

export const runtime = "edge";
export const preferredRegion = "iad1";

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

type SyncFileBody = z.infer<typeof syncFileBodySchema>;

export const POST = async (req: NextRequest) => {
  const token = req.headers.get("Authorization");

  let body: SyncFileBody;

  try {
    const res = (await req.json()) as unknown;
    body = syncFileBodySchema.parse(res);
  } catch (error) {
    return new Response("Bad Request", { status: 400 });
  }

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  // STEP 1: Download the file from the URL
  const file = await fetch(body.fileUrl);
  const fileBuffer = await file.arrayBuffer();

  // STEP 2: Check file type
  const fileMimeString = file.headers.get("Content-Type") ?? "";

  if (fileMimeString === "text/markdown") {
    const text = new TextDecoder().decode(fileBuffer);

    // STEP 3: Upload the file to Vector Database
    const textToEmbed = [text];

    const embeddings_res = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: textToEmbed,
    });

    await db.drizzle.insert(db.schema.files).values({
      embedding: embeddings_res.data[0]?.embedding.map((x) => `${x}`),
      projectid: token,
      text,
      type: "markdown",
      url: body.fileUrl,
    });

    return new Response("OK", { status: 200 });
  }

  return new Response("Unsupported file type", { status: 415 });
};

export const GET = async (req: NextRequest) => {
  const initialTime = Date.now();

  const token = req.headers.get("Authorization");

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("query");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "5");

  if (!query) {
    return new Response("Bad Request", { status: 400 });
  }

  const embeddingStart = Date.now();

  const embeddings_res = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: [query],
  });

  const embeddings = embeddings_res.data[0]?.embedding ?? [];

  const embeddingEnd = Date.now();

  console.log("Embedding time: ", embeddingEnd - embeddingStart);

  const queryStart = Date.now();

  const res = await db.vector.similarity(
    "files",
    "embedding",
    embeddings,
    limit,
  );

  const queryEnd = Date.now();

  console.log("Query time: ", queryEnd - queryStart);

  const response = new Response(
    JSON.stringify(
      res.map((file) => ({
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

  const finalTime = Date.now();

  console.log("Total time: ", finalTime - initialTime);

  return response;
};
