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
export const withKeyAuth = <
  T extends ZodSchema<X>,
  U extends ZodSchema<Y>,
  X,
  Y,
>(
  handler: (ctx: {
    req: NextRequest;
    body: T extends ZodSchema<infer R> ? R : unknown;
    params: U extends ZodSchema<infer R> ? R : unknown;
    projectid: string;
  }) => Promise<Response>,
  opts: {
    bodySchema?: T;
    paramsSchema?: U;
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

    if (opts.bodySchema) {
      const body = (await req.json()) as unknown;
      b = opts.bodySchema.safeParse(body);

      if (!b.success) {
        return new Response(`Bad request\n${b.error.message}`, { status: 400 });
      }
    }

    let p = null;

    if (opts.paramsSchema) {
      p = opts.paramsSchema.safeParse(paramsToObject(req.nextUrl.searchParams));

      if (!p.success) {
        return new Response(`Bad request\n${p.error.message}`, { status: 400 });
      }
    }

    return handler({
      // @ts-expect-error typescript thinks that b.data cant satisfy the schema
      body: b ? b.data : null,
      // @ts-expect-error typescript thinks that p.data cant satisfy the schema
      params: p ? p.data : null,
      projectid,
      req,
    });
  };
};
