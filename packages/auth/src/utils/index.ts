import { hashSync as hash } from "bcrypt-edge";

import { db } from "@nearbyy/db";

// This is a random salt applied to all keys.
// After thinking about or previous salting aproaches,
// turns out we don't really need a salt. Removing a dynamic
// salt allows us to O(1) key lookups, stripping out project
// information from the key, and still keeping it safe.
const GLOBAL_SALT = "$2a$10$9yZ5QsZDPRmGKbJfeSCsM.";

export const validateKey = async (key: string) => {
  const hashed_key = hash(key, GLOBAL_SALT);

  const db_key = await db.drizzle.query.keys.findFirst({
    where: db.helpers.eq(db.schema.keys.key, hashed_key),
  });

  if (!db_key) {
    return {
      valid: false,
      projectid: null,
    } as const;
  }

  return {
    valid: true,
    projectid: db_key.projectid,
  } as const;
};

export const generateKey = async (projectid: string, userid: string) => {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const API_KEY = Buffer.from(bytes).toString("hex");

  const hashedKey = hash(API_KEY, GLOBAL_SALT);

  await db.drizzle.insert(db.schema.keys).values({
    key: hashedKey,
    salt: GLOBAL_SALT,
    projectid,
    userid,
    id: crypto.randomUUID(),
  });

  return API_KEY;
};

/**
 * Converts a URLSearchParams object to a Record<string, string>
 * @param entries
 * @returns
 */
export function paramsToObject(entries: URLSearchParams) {
  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}
