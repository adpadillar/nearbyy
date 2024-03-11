import { withKeyAuth } from "@nearbyy/auth";
import {
  chunkEndpointGetParams,
  chunkEndpointGetResponse,
} from "@nearbyy/core";
import { db } from "@nearbyy/db";
import { getSingleEmbedding } from "@nearbyy/embeddings";

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
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
      limit: 10,
      table: "chunks",
      vector: { column: "embedding", embedding },
      where: { projectId: projectid },
    });

    return {
      status: 200,
      body: {
        success: true,
        error: null,
        data: {
          items: chunks.map((c) => ({
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
