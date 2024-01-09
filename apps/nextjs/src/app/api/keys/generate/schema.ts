import { z } from "zod";

export const getSchema = {
  params: z.object({ projectid: z.string() }),
  return: z.object({ key: z.string() }),
};
