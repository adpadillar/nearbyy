import { z } from "zod";

import { createResponseSchema } from "../utils";

// GET /files
export const chunkEndpointGetResponse = createResponseSchema({
  schemaIfSuccess: z.object({
    items: z.array(
      z.object({
        chunkId: z.string(),
        order: z.number(),
        tokenLength: z.number(),
        text: z.string(),
        _extras: z.object({
          distance: z.number().optional(),
          fileId: z.string(),
          projectid: z.string(),
        }),
      }),
    ),
  }),
  schemaIfError: z.null(),
});

export const chunkEndpointGetParams = z.object({
  limit: z.coerce.number().gt(0).lte(100).int().default(10),
  query: z.string().min(1),
  tag: z.string().optional(),
  fileId: z.string().optional(),
});

export type ChunkEndpointGetResponse = z.infer<typeof chunkEndpointGetResponse>;
export type ChunkEndpointGetParams = z.infer<typeof chunkEndpointGetParams>;
