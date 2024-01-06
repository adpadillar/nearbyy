import { generateKey, withAuth } from "@nearbyy/auth";

import { apiKeyTypes } from "./types";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const GET = withAuth({
  handler: async ({ params }) => {
    const res = await generateKey(params.projectid);

    return { status: 200, body: { key: res } };
  },
  validators: apiKeyTypes.GET,
});
