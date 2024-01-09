import { z } from "zod";

export const deleteSchema = {
  params: z.object({
    id: z.coerce.number(),
  }),
  return: z.object({
    message: z.string(),
    success: z.boolean(),
  }),
};
