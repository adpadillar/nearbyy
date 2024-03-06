import type { NextRequest } from "next/server";

import { chunking } from "@nearbyy/embeddings";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as unknown;

  const parsedBody = body as { text: string };

  const chunks = chunking(parsedBody.text);

  return new Response(JSON.stringify(chunks), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};