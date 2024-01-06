import type { NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { auth } from "@clerk/nextjs";

import { paramsToObject, validateKey } from "../utils";

/**
 *
 * This function wraps a Next.js API handler with authentication
 * It can also validate the body and params of the request depending on the
 * validation options passed in
 *
 * @param opts.handler the handler to wrap
 * @param opts.validators the validation options
 * @returns
 */
export const withKeyAuth = <T, U>(opts: {
  handler: (ctx: {
    /**
     * The Next.js request object
     */
    req: NextRequest;
    /**
     * The parsed body of the request. Will have the type of the passed in body schema.
     * If there is no body schema, this will be type `unknown` and will be `null`
     */
    body: T;
    /**
     * The parsed params of the request. Will have the type of the passed in params schema.
     * If there is no params schema, this will be type `unknown` and will be `null`
     */
    params: U;
    /**
     * The projectid associated with the request's key
     */
    projectid: string;
  }) => Promise<Response> | Response;
  validators?: {
    /**
     * The body zod validator. A failed validation will return a 400
     * An undefined validator will skip the validation
     */
    body?: ZodSchema<T>;
    /**
     * The params zod validator. A failed validation will return a 400
     * An undefined validator will skip the validation
     */
    params?: ZodSchema<U>;
  };
}) => {
  const { handler, validators } = opts;

  return async (req: NextRequest) => {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return new Response(
        `Unauthorized\nDid you forget to add the Bearer token?`,
        { status: 401 },
      );
    }

    const { valid, projectid } = await validateKey(token);

    if (!valid) {
      return new Response(
        `Unauthorized\nThis is an unvalid token. Please provide a valid one`,
        { status: 401 },
      );
    }

    let b = null;

    if (validators?.body) {
      try {
        const body = (await req.json()) as unknown;
        b = validators.body.safeParse(body);

        if (!b.success) {
          return new Response(`Bad request\n${b.error.message}`, {
            status: 400,
          });
        }
      } catch (e) {
        return new Response(`Bad request\nMissing body`, { status: 400 });
      }
    }

    let p = null;

    if (validators?.params) {
      p = validators.params.safeParse(paramsToObject(req.nextUrl.searchParams));

      if (!p.success) {
        return new Response(
          `Bad request: query parameters have the wrong format.\n${p.error.message}`,
          {
            status: 400,
          },
        );
      }
    }

    return handler({
      body: (b ? b.data : null)!,
      params: (p ? p.data : null)!,
      projectid,
      req,
    });
  };
};

export const withAuth = <T, U>(opts: {
  handler: (ctx: {
    req: NextRequest;
    body: T;
    params: U;
    auth: ReturnType<typeof auth>;
  }) => Promise<Response> | Response;
  validators?: {
    body?: ZodSchema<T>;
    params?: ZodSchema<U>;
  };
}) => {
  const { handler, validators } = opts;

  return async (req: NextRequest) => {
    let b = null;

    if (validators?.body) {
      try {
        const body = (await req.json()) as unknown;
        b = validators.body.safeParse(body);

        if (!b.success) {
          return new Response(`Bad request\n${b.error.message}`, {
            status: 400,
          });
        }
      } catch (e) {
        return new Response(`Bad request\nMissing body`, { status: 400 });
      }
    }

    let p = null;

    if (validators?.params) {
      p = validators.params.safeParse(paramsToObject(req.nextUrl.searchParams));

      if (!p.success) {
        return new Response(
          `Bad request: query parameters have the wrong format.\n${p.error.message}`,
          {
            status: 400,
          },
        );
      }
    }

    const authCtx = auth();

    if (!authCtx.userId) {
      return new Response(
        `Unauthorized\nPlease login to access this resource`,
        { status: 401 },
      );
    }

    return handler({
      body: (b ? b.data : null)!,
      params: (p ? p.data : null)!,
      req,
      auth: authCtx,
    });
  };
};
