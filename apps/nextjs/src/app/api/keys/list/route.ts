import { withAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";

import { getSchema } from "./schema";

export const GET = withAuth({
  handler: async ({ auth }) => {
    const files = await db.drizzle.query.keys.findMany({
      where: db.helpers.eq(db.schema.keys.userid, auth.userId!),
    });

    return {
      status: 200,
      body: {
        keys: files.map((f) => ({ id: f.id })),
      },
    };
  },
  schema: getSchema,
});
