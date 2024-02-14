import { z } from "zod";

import { createResponseSchema } from "../utils";

// GET /files
export const fileEndpointGetResponse = createResponseSchema({
  schemaIfSuccess: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
        type: z.string(),
        url: z.string(),
        _extras: z.object({
          distance: z.number().optional(),
          projectid: z.string(),
        }),
      }),
    ),
  }),
  schemaIfError: z.null(),
});

export const fileEndpointGetParams = z.object({
  limit: z.coerce.number().gt(0).lte(100).int().default(10),
  query: z.string().min(1),
});

export type FileEndpointGetResponse = z.infer<typeof fileEndpointGetResponse>;
export type FileEndpointGetParams = z.infer<typeof fileEndpointGetParams>;
