// @vitest-environment edge-runtime

import { randomBytes } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";

import { db } from "@nearbyy/db";

import { generateKey, validateKey } from "./index";

const projectid = randomBytes(4).toString("hex");

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

    expect(project).toBe(`project_${projectid}`);
    expect(bytes).toBeTypeOf("string");

    expect(bytes).toHaveLength(64);
    expect(key).toHaveLength(64 + `project_${projectid}:`.length);
  });

  it("should validate a key", async () => {
    const { projectid: p, valid } = await validateKey(key);

    expect(valid).toBe(true);
    expect(p).toBe(projectid);
  });

  it("should not validate a key", async () => {
    const { valid, projectid: p } = await validateKey(
      `project_${projectid}:false_key`,
    );

    expect(valid).toBe(false);
    expect(p).toBe(null);
  });
});

afterAll(async () => {
  await db.drizzle
    .delete(db.schema.keys)
    .where(db.helpers.eq(db.schema.keys.projectid, projectid));
});
