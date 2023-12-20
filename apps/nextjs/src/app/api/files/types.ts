import { z } from "zod";

export const syncFileBodySchema = z.object({
  fileUrl: z.string().url(),
});
