import { db } from "@nearbyy/db";

const FREE_REQUEST_LIMIT = 20_000;
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

// we always call this function before running a query
export const queryRatelimit = async (projectid: string) => {
  const mutationResult = await db.drizzle
    .update(db.schema.projects)
    .set({
      queryCount: db.helpers.sql`${db.schema.projects.queryCount} + 1`,
      runningQueryCount: db.helpers
        .sql`${db.schema.projects.runningQueryCount} + 1`,
    })
    .where(db.helpers.eq(db.schema.projects.id, projectid))
    .returning();

  const currentProject = mutationResult[0]!;

  // Check if the last reset was before the current date
  const now = new Date();
  const lastReset = currentProject.lastQuotaReset;
  let wasReset = false;

  // If the last reset was more than a month ago, reset the count
  if (lastReset.getTime() < now.getTime() - ONE_MONTH_MS) {
    wasReset = true;
    await db.drizzle
      .update(db.schema.projects)
      .set({
        runningQueryCount: 0,
        lastQuotaReset: now,
      })
      .where(db.helpers.eq(db.schema.projects.id, projectid))
      .execute();
  }

  return {
    wasReset,
    success: !(!wasReset && currentProject.queryCount > FREE_REQUEST_LIMIT + 1),
  } as const;
};
