import { generateKey, withAuth } from "@nearbyy/auth";

import { apiTypes } from "../apiTypes";

export const GET = withAuth({
  handler: async ({ params }) => {
    const res = await generateKey(params.projectid);

    return { status: 200, body: { key: res } };
  },
  validators: apiTypes["/keys"].GET,
});
