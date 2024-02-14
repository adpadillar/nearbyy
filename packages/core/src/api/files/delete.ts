import { z } from "zod";

import { createResponseSchema } from "../utils";

// DELETE /files
export const fileEndpointDeleteResponse = createResponseSchema({
  schemaIfSuccess: z.object({
    ids: z.array(z.string()),
  }),
  schemaIfError: z.object({
    ids: z.array(z.string()),
    rejectedIds: z.array(z.string()),
  }),
});

export const fileEndpointDeleteBody = z.object({
  ids: z.array(z.string()),
});

export type FileEndpointDeleteResponse = z.infer<
  typeof fileEndpointDeleteResponse
>;
export type FileEndpointDeleteBody = z.infer<typeof fileEndpointDeleteBody>;
