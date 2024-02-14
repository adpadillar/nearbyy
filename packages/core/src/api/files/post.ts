import { z } from "zod";

import { createResponseSchema } from "../utils";

// POST /files
export const fileEndpointPostResponse = createResponseSchema({
  schemaIfSuccess: z.object({
    ids: z.array(z.string()),
  }),
  schemaIfError: z.object({
    ids: z.array(z.string()),
    rejectedUrls: z.array(z.string()),
  }),
});

export const fileEndpointPostBody = z.object({
  fileUrls: z.array(z.string()),
});

export type FileEndpointPostResponse = z.infer<typeof fileEndpointPostResponse>;
export type FileEndpointPostBody = z.infer<typeof fileEndpointPostBody>;
