import { z } from "zod";

export const apiStatusTypes = {
  GET: {
    return: z.object({
      userid: z.string(),
    }),
  },
};
