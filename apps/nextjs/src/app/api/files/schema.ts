import { z } from "zod";

export const getSchema = {
  params: z.object({
    limit: z.coerce.number().gt(0).lte(100).int().default(10),
    query: z.string(),
  }),
  response: z.array(
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
};

export const postSchema = {
  body: z
    .object({
      fileUrl: z.string(),
      fileUrls: z.undefined().optional(),
    })
    .or(
      z.object({
        fileUrls: z.array(z.string()),
        fileUrl: z.undefined().optional(),
      }),
    ),
  response: z.object({
    success: z.boolean(),
    error: z.string().nullable(),
    ids: z.array(z.string()),
    rejectedUrls: z.array(z.string()).optional(),
  }),
};

export const deleteSchema = {
  body: z.object({
    ids: z.array(z.string()),
  }),
  response: z.object({
    success: z.boolean(),
    error: z.string().optional(),
    rejectedIds: z.array(z.string()).optional(),
  }),
};
