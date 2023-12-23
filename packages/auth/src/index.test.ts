import { randomBytes } from "crypto";
import { afterAll, describe, expect, it } from "vitest";

import { db } from "@nearbyy/db";

import { generateKey, validateKey } from "./index";

const projectid = randomBytes(4).toString("hex");

describe("auth", () => {
  let key: string;

  it("should create a key", async () => {
    const API_KEY = await generateKey(projectid);

    expect(API_KEY).toBeDefined();
    expect(API_KEY).toBeTypeOf("string");

    key = API_KEY;
  });

  it("should validate a key", async () => {
    const { projectid: p, valid } = await validateKey(key);

    expect(valid).toBe(true);
    expect(p).toBe(projectid);
  });

  it("should not validate a key", async () => {
    const { valid, projectid } = await validateKey("project_1234:1234");

    expect(valid).toBe(false);
    expect(projectid).toBe(null);
  });
});

afterAll(async () => {
  await db.drizzle
    .delete(db.schema.keys)
    .where(db.helpers.eq(db.schema.keys.projectid, projectid));
});
