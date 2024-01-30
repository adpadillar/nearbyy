// @vitest-environment edge-runtime
// For some reason, the `bcrypt-edge` package is not available in the test environment
// We need to go to the node_modules folder and check the package.json
// and add a `main` field to the `package.json` file

import { afterAll, describe, expect, it } from "vitest";

import { db } from "@nearbyy/db";

import { generateKey, validateKey } from "./index";

const projectid = crypto.randomUUID();

describe("key auth", () => {
  let key: string;

  it("should create a key", async () => {
    const API_KEY = await generateKey(projectid, "random-user-id");

    expect(API_KEY).toBeDefined();
    expect(API_KEY).toBeTypeOf("string");

    key = API_KEY;
  });

  it("should have the correct format", () => {
    const [project, bytes] = key.split(":");

    expect(bytes).toBeDefined();
    expect(project).toBeDefined();

    expect(project).toBe(projectid);
    expect(bytes).toBeTypeOf("string");

    expect(bytes).toHaveLength(48);
    expect(key).toHaveLength(48 + `${projectid}:`.length);
  });

  it("should validate a key", async () => {
    const { projectid: p, valid } = await validateKey(key);

    expect(valid).toBe(true);
    expect(p).toBe(projectid);
  });

  it("should not validate a key", async () => {
    const { valid, projectid: p } = await validateKey(`${projectid}:false_key`);

    expect(valid).toBe(false);
    expect(p).toBe(null);
  });
});

afterAll(async () => {
  await db.drizzle
    .delete(db.schema.keys)
    .where(db.helpers.eq(db.schema.keys.projectid, projectid));
});
