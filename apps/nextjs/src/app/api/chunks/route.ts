import { withKeyAuth } from "@nearbyy/auth";
import {
  chunkEndpointGetParams,
  chunkEndpointGetResponse,
} from "@nearbyy/core";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

const FREE_REQUEST_LIMIT = 20_000;
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
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

    // If the count was not reset and the count is over the limit
    if (!wasReset && currentProject.queryCount > FREE_REQUEST_LIMIT + 1) {
      return {
        status: 429,
        body: {
          data: null,
          success: false,
          error: "You have exceeded the free request limit",
        },
      } as const;
    }

    const { embedding, success } = await getSingleEmbedding(params.query);

    if (!success) {
      return {
        status: 500,
        body: {
          data: null,
          success: false,
          error: "Could not generate embedding",
        },
      } as const;
    }

    // Get the chunks that are similar to the embedding
    const chunks = await db.vector.similarity({
      table: "chunks",
      limit: params.limit,
      vector: { embedding: embedding },
      where: { projectId: projectid },
    });

    return {
      status: 200,
      body: {
        success: true,
        error: null,
        data: {
          items: chunks.map((c) => ({
            chunkId: c.id,
            tokenLength: c.tokenLength,
            text: c.text,
            order: c.order,
            _extras: {
              projectid: c.projectId,
              fileId: c.fileId,
              distance: c.distance,
            },
          })),
        },
      },
    } as const;
  },
  schema: {
    params: chunkEndpointGetParams,
    response: chunkEndpointGetResponse,
  },
});
