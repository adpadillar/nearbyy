import { z } from "zod";

import { createResponseSchema } from "../utils";

// POST /files
export const fileEndpointPostResponse = createResponseSchema({
  schemaIfSuccess: z.object({
    files: z.array(
      z.object({
        id: z.string(),
        url: z.string(),
      }),
    ),
  }),
  schemaIfError: z.object({
    files: z.array(
      z.object({
        url: z.string(),
        id: z.string(),
      }),
    ),
    rejectedUrls: z.array(z.string()),
  }),
});

export const fileEndpointPostBody = z.object({
  fileUrls: z.array(z.string()),
  tag: z.string().optional(),
});

export type FileEndpointPostResponse = z.infer<typeof fileEndpointPostResponse>;
export type FileEndpointPostBody = z.infer<typeof fileEndpointPostBody>;
