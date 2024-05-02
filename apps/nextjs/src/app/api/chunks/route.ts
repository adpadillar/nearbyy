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

    if (params.tag && params.fileId) {
      // filter by tag and fileId
      chunks = await db.vector.similarity({
        table: "chunks",
        limit: params.limit,
        vector: { embedding: embedding },
        where: { projectId: projectid, tag: params.tag, fileId: params.fileId },
      });
    } else {
      // we know that either fileId or tag is not present
      // here we do the query based on the presence of tag
      if (params.tag) {
        chunks = await db.vector.similarity({
          table: "chunks",
          limit: params.limit,
          vector: { embedding: embedding },
          where: { projectId: projectid, tag: params.tag },
        });
      }

      // if fileId is present, we query based on fileId
      if (params.fileId) {
        chunks = await db.vector.similarity({
          table: "chunks",
          limit: params.limit,
          vector: { embedding: embedding },
          where: { projectId: projectid, fileId: params.fileId },
        });
      }

      // Here we query without any filter
      if (!params.tag && !params.fileId) {
        chunks = await db.vector.similarity({
          table: "chunks",
          limit: params.limit,
          vector: { embedding: embedding },
          where: { projectId: projectid },
        });
      }

      if (!chunks) {
        // we should never really reach here,
        // but if we do, we return an error. This also
        // narrows the type of chunks to be non-null
        return {
          status: 500,
          body: {
            success: false,
            error: "Could not find any chunks",
            data: null,
          } as const,
        };
      }
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
