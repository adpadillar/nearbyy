import { withAuth } from "@nearbyy/auth";
import { db } from "@nearbyy/db";

import { deleteSchema } from "./schema";

export const DELETE = withAuth({
  handler: async ({ auth, params }) => {
    await db.drizzle
      .delete(db.schema.keys)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.keys.userid, auth.userId!),
          db.helpers.eq(db.schema.keys.id, params.id),
        ),
      );

    return {
      status: 200,
      body: {
        message: "Key deleted",
        success: true,
      },
    };
  },
  schema: deleteSchema,
});
