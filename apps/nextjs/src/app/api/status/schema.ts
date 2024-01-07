import { z } from "zod";

export const getSchema = {
  return: z.object({
    userid: z.string(),
  }),
};
