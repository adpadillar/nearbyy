import { genSaltSync as genSalt, hashSync as hash } from "bcrypt-edge";

import { db } from "@nearbyy/db";

/**
 *
 * This function takes an API key and validates it
 * The key should be in the format of `project_${projectid}:${API_KEY}`
 * It will return an object with a boolean `valid` and the `projectid`
 *
 * @param key the key to validate in the format of `project_${projectid}:${API_KEY}`
 * @returns
 */
export const validateKey = async (key: string) => {
  const [project, bytes] = key.split(":");

  if (!project || !bytes) {
    // Invalid key format
    return {
      valid: false,
      projectid: null,
    } as const;
  }

  const keys = await db.drizzle.query.keys.findMany({
    where: db.helpers.eq(
      db.schema.keys.projectid,
      project.replace("project_", ""),
    ),
  });

  for (const key of keys) {
    // TODO: This can be sped up when there is a lot
    // of keys in a single project
    const hashed_key = hash(bytes, key.salt);

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
 * It will return the key to be shown to the user, but won't be stored anywhere.
 *
 * The key will be in the format of `project_${projectid}:${API_KEY}`.
 *
 * The key's hash will be stored in the database.
 *
 *
 * @param projectid
 * @returns
 */
export const generateKey = async (projectid: string, userid: string) => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const API_KEY = Buffer.from(bytes).toString("hex");

  const salt = genSalt(10);
  const hashedKey = hash(API_KEY, salt);

  await db.drizzle.insert(db.schema.keys).values({
    key: hashedKey,
    salt,
    projectid,
    userid,
    id: crypto.randomUUID(),
  });

  return `project_${projectid}:${API_KEY}` as const;
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
