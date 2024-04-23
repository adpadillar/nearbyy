import { queryRatelimit, withKeyAuth } from "@nearbyy/auth";
import {
  chunkEndpointGetParams,
  chunkEndpointGetResponse,
} from "@nearbyy/core";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
    const { success: rateLimitSuccess } = await queryRatelimit(projectid);

    if (!rateLimitSuccess) {
      return {
        status: 429,
        body: {
          data: null,
          success: false,
          error: "Rate limit exceeded",
        },
      } as const;
    }

    const { embedding, success: embeddingSuccess } = await getSingleEmbedding(
      params.query,
    );

    if (!embeddingSuccess) {
      return {
        status: 500,
        body: {
          data: null,
          success: false,
          error: "Could not generate embedding",
        },
      } as const;
    }

    let chunks;

    if (params.tag) {
      chunks = await db.vector.similarity({
        table: "chunks",
        limit: params.limit,
        vector: { embedding: embedding },
        where: { projectId: projectid, tag: params.tag },
      });
    } else {
      // Get the chunks that are similar to the embedding
      chunks = await db.vector.similarity({
        table: "chunks",
        limit: params.limit,
        vector: { embedding: embedding },
        where: { projectId: projectid },
      });
    }

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
