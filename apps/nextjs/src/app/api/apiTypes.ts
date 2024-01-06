import { z } from "zod";

type HTTPMethod = "GET" | "POST";

export type RouteTyping = Partial<
  Record<
    HTTPMethod,
    {
      params?: z.ZodTypeAny;
      body?: z.ZodTypeAny;
      return?: z.ZodTypeAny;
    }
  >
>;

export const apiTypes = {
  "/keys": {
    GET: {
      params: z.object({ projectid: z.string() }),
      return: z.object({ key: z.string() }),
    },
  },
  "/files": {
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
  },
  "/status": {
    GET: {
      return: z.object({
        userid: z.string(),
      }),
    },
  },
} satisfies Record<string, RouteTyping>;
