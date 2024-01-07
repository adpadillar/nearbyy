import { z } from "zod";

import { withAuth } from "@nearbyy/auth";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const getSchema = {
  return: z.object({
    userid: z.string(),
  }),
};

export const GET = withAuth({
  handler: async ({ auth }) => {
    return { status: 200, body: { userid: auth.userId ?? "" } };
  },
  schema: getSchema,
});
