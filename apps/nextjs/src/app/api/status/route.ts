import { withAuth } from "@nearbyy/auth";

import { apiTypes } from "../apiTypes";

export const runtime = "edge";
export const preferredRegion = "iad1";

export const GET = withAuth({
  handler: async ({ auth }) => {
    return { status: 200, body: { userid: auth.userId } };
  },
  validators: apiTypes["/status"].GET,
});
