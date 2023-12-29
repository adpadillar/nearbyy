import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import type { ZodSchema } from "zod";
import { genSalt, hash } from "bcryptjs";

import { db } from "@nearbyy/db";

/**
 *
 * This function takes an API key and validates it
 * The key should be in the format of `project_${projectid}:${API_KEY}`
 * It will return an object with a boolean `valid` and the `projectid`
 *
 * @param key the key to validate
 * @returns
 */
export const validateKey = async (key: string) => {
  const [project, bytes] = key.split(":");
  const keys = await db.drizzle.query.keys.findMany({
    where: db.helpers.eq(
      db.schema.keys.projectid,
      project!.replace("project_", ""),
    ),
  });

  for (const key of keys) {
    const hashed_key = await hash(bytes!, key.salt);

    if (key.key === hashed_key) {
      return {
        valid: true,
        projectid: key.projectid,
      } as const;
    }
  }

  return {
    valid: false,
    projectid: null,
  } as const;
};

/**
 * Calling this function with a projectid will generate a new key for that project
 * It will return the key to be shown to the user, but won't be stored anywhere
 *
 * The key will be in the format of `project_${projectid}:${API_KEY}`
 *
 * The key's hash will be stored in the database
 * @param projectid
 * @returns
 */
export const generateKey = async (projectid: string) => {
  const API_KEY = randomBytes(32).toString("hex");

  const salt = await genSalt(10);
  const hashedKey = await hash(API_KEY, salt);

  await db.drizzle.insert(db.schema.keys).values({
    key: hashedKey,
    salt,
    projectid,
  });

  return `project_${projectid}:${API_KEY}` as const;
};

/**
 * Converts a URLSearchParams object to a Record<string, string>
 * @param entries
 * @returns
 */
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
 * @param validators the validation options
 * @returns
 */
export const withKeyAuth = <T, U>(
  handler: (ctx: {
    /**
     * The Next.js request object
     */
    req: NextRequest;
    /**
     * The parsed body of the request. Will have the type of the passed in body schema.
     * If there is no body schema, this will be type `unknown` and will be `null`
     * @example
     * ### Valid request
     * A valid request **will** have a **JSON** body with the correct properties and types
     * specified in the body schema. The parsed body will be passed into the handler with the expected types.
     * ```ts
     * // If the validator is
     * z.object({ fileUrl: z.string().url() })
     *
     * // Then a valid request would be
     * { fileUrl: "https://example.com/file.md" }
     *
     * // This will be typed as
     * { fileUrl: string; }
     * ```
     *
     * @example
     * ### Invalid request
     * An invalid request **will not** have a **JSON** body with the correct properties and types
     * specified in the body schema. Any missing properties or properties with the wrong type will be
     * caught by the validator and will return a 400. The returned error has a message on where exactly
     * the validation failed.
     * ```ts
     * // If the validator is
     * z.object({ fileUrl: z.string().url() })
     *
     * // Then an invalid request would be
     * { fileUrl: "hello world" }
     *
     * // Even though the fileUrl is a string, it is not a valid url and the validator will catch that
     * // This will return a 400 with the message
     *
     * // Bad request
     * // {Specific error message}
     * ```
     */
    body: T;
    /**
     * The parsed params of the request. Will have the type of the passed in params schema.
     * If there is no params schema, this will be type `unknown` and will be `null`
     * @example
     * ### Valid request
     * A valid request **will** have the params specified in the params schema in the url.
     * The parsed params will be passed into the handler with the expected types.
     * ```ts
     * // If the validator is
     * z.object({ query: z.string(), limit: z.number() })
     *
     * // Then a valid request would be
     * { query: "hello", limit: 10 }
     *
     * // This will be typed as
     * { query: string; limit: number; }
     * ```
     *
     * @example
     * ### Invalid request
     * An invalid request **will not** have the params specified in the params schema in the url.
     * Any missing params or params with the wrong type will be caught by the validator and will return a 400.
     * The returned error has a message on where exactly the validation failed.
     * ```ts
     * // If the validator is
     * z.object({ query: z.string(), limit: z.number() })
     *
     * // Then an invalid request would be
     * { query: "hello" }
     *
     * // This will return a 400 with the message
     * // Bad request
     * // {Specific error message}
     * ```
     */
    params: U;
    /**
     * The projectid associated with the request's key
     */
    projectid: string;
  }) => Promise<Response> | Response,
  validators: {
    /**
     * The body zod validator. A failed validation will return a 400
     * An undefined validator will skip the validation
     * @default undefined
     */
    bodyValidator?: ZodSchema<T>;
    /**
     * The params zod validator. A failed validation will return a 400
     * An undefined validator will skip the validation
     * @default undefined
     */
    paramsValidator?: ZodSchema<U>;
  } = {},
) => {
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

    if (validators.bodyValidator) {
      try {
        const body = (await req.json()) as unknown;
        b = validators.bodyValidator.safeParse(body);

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

    if (validators.paramsValidator) {
      p = validators.paramsValidator.safeParse(
        paramsToObject(req.nextUrl.searchParams),
      );

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
