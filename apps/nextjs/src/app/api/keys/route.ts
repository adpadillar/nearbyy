import { z } from "zod";

import { generateKey, withAuth } from "@nearbyy/auth";

export const GET = withAuth({
  handler: async ({ params }) => {
    const res = await generateKey(params.projectid);

    return new Response(
      JSON.stringify({
        key: res,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );
  },
  validators: {
    params: z.object({
      projectid: z.string(),
    }),
  },
});
