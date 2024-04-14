import { z } from "zod";

import { createResponseSchema } from "../../utils";

// GET /files
export const getUploadUrlEndpointGetResponse = createResponseSchema({
  schemaIfSuccess: z.object({
    uploadUrl: z.string(),
    fileId: z.string(),
    fields: z.record(z.string()),
  }),
  schemaIfError: z.null(),
});

export const getUploadUrlEndpointGetParams = z.object({
  contentType: z.string(),
});

export type GetUploadUrlEndpointGetResponse = z.infer<
  typeof getUploadUrlEndpointGetResponse
>;
export type GetUploadUrlEndpointGetParams = z.infer<
  typeof getUploadUrlEndpointGetParams
>;
