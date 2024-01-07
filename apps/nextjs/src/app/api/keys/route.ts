import { z } from "zod";

import { generateKey, withAuth } from "@nearbyy/auth";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const getSchema = {
  params: z.object({ projectid: z.string() }),
  return: z.object({ key: z.string() }),
};

export const GET = withAuth({
  handler: async ({ params }) => {
    const key = await generateKey(params.projectid);

    return { status: 200, body: { key } };
  },
  schema: getSchema,
});
