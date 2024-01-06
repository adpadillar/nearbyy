import { z } from "zod";

export const apiKeyTypes = {
  GET: {
    params: z.object({ projectid: z.string() }),
    return: z.object({ key: z.string() }),
  },
};
