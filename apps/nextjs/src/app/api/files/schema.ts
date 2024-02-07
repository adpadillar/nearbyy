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
  body: z.object({
    fileUrl: z.string(),
  }),
};
