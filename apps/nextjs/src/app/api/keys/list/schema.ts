import { z } from "zod";

export const getSchema = {
  return: z.object({
    keys: z.array(
      z.object({
        id: z.number(),
      }),
    ),
  }),
};
