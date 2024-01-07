import { generateKey, withAuth } from "@nearbyy/auth";

import { getSchema } from "./schema";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const GET = withAuth({
  handler: async ({ params }) => {
    const key = await generateKey(params.projectid);

    return { status: 200, body: { key } };
  },
  schema: getSchema,
});
