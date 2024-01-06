import { z } from "zod";

export const apiFilesTypes = {
  GET: {
    params: z.object({
      query: z.string(),
      limit: z.coerce.number().lte(100).gt(0).int().default(10).optional(),
    }),
    return: z.array(
      z.object({
        id: z.string(),
        projectid: z.string(),
        text: z.string(),
        type: z.string(),
        url: z.string(),
      }),
    ),
  },
  POST: {
    params: z.undefined(),
    return: z.undefined(),
    body: z.object({ fileUrl: z.string().url() }),
  },
};
