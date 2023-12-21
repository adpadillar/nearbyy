import type { NextRequest } from "next/server";
import type { ZodSchema } from "zod";

/**
 *
 * This will eventually be a function that validates the key
 *
 * @param _key the key to validate
 * @returns
 */
export const validateKey = (_key: string) => {
  return true;
};

function paramsToObject(entries: URLSearchParams) {
  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

/**
 *
 * This function wraps a Next.js API handler with authentication
 * It can also validate the body and params of the request depending on the
 * validation options passed in
 *
 * @param handler the handler to wrap
 * @param opts the validation options
 * @returns
 */
export const withAuth = <T extends ZodSchema<X>, U extends ZodSchema<Y>, X, Y>(
  handler: (ctx: {
    req: NextRequest;
    body: T extends ZodSchema<infer R> ? R : unknown;
    params: U extends ZodSchema<infer R> ? R : unknown;
    token: string;
  }) => Promise<Response>,
  opts: {
    bodySchema?: T;
    paramsSchema?: U;
  } = {},
) => {
  return async (req: NextRequest) => {
    const token = req.headers.get("Authorization");

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const valid = validateKey(token);

    if (!valid) {
      return new Response("Unauthorized", { status: 401 });
    }

    let b = null;

    if (opts.bodySchema) {
      const body = (await req.json()) as unknown;
      b = opts.bodySchema.safeParse(body);

      if (!b.success) {
        return new Response("Bad Request", { status: 400 });
      }
    }

    let p = null;

    if (opts.paramsSchema) {
      p = opts.paramsSchema.safeParse(paramsToObject(req.nextUrl.searchParams));

      if (!p.success) {
        return new Response("Bad Request", { status: 400 });
      }
    }

    return handler({
      // @ts-expect-error typescript thinks that b.data cant satisfy the schema
      body: b ? b.data : null,
      // @ts-expect-error typescript thinks that p.data cant satisfy the schema
      params: p ? p.data : null,
      token,
      req,
    });
  };
};
