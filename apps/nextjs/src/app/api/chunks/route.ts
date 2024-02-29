import type { NextRequest } from "next/server";

import { chunking } from "@nearbyy/embeddings";

export const GET = async (req: NextRequest) => {
  const body = await req.text();

  console.log(body);

  return new Response(body);

  const chunks = chunking(body.text);

  console.log(chunks);

  return new Response(JSON.stringify(chunks, null, 2));
};
