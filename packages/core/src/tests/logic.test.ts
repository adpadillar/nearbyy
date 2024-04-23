import { describe, expect } from "vitest";

import { it, supportedFiles, unsupportedFiles } from ".";
import { NearbyyClient } from "..";

describe("SDK Core logic test", () => {
  const createdIds: string[] = [];

  const nearbyy = new NearbyyClient({
    API_KEY: process.env.NEARBYY_TESTING_KEY!,
    API_URL: "http://localhost:3000/api", // Test with the local server
  });

  describe("Uploads", () => {
    it("One supported file", async () => {
      const { success, data, error } = await nearbyy.uploadFiles({
        fileUrls: [supportedFiles[0]!],
      });

      if (success) {
        expect(data.ids).toHaveLength(1);
        createdIds.push(data.ids[0]!);
      }

      expect(error).toBe(null);
    });

    it("Multiple supported files", async () => {
      const files = supportedFiles.slice(1, supportedFiles.length);

      const { data, error, success } = await nearbyy.uploadFiles({
        fileUrls: files,
      });

      if (success) {
        expect(data.ids).toHaveLength(files.length);
        createdIds.push(...data.ids);
      }

      expect(error).toBe(null);
    });

    it("Unsupported files", async () => {
      const { data, error, success } = await nearbyy.uploadFiles({
        fileUrls: unsupportedFiles,
      });

      if (!success) {
        expect(data.rejectedUrls).toHaveLength(unsupportedFiles.length);
        expect(data.ids).toHaveLength(0);
        expect(error).toBeTypeOf("string");
      }
    });

    it("Both supported and unsupported files", async () => {
      const { data, error, success } = await nearbyy.uploadFiles({
        fileUrls: [...supportedFiles, ...unsupportedFiles],
      });

      if (!success) {
        expect(data.rejectedUrls).toHaveLength(unsupportedFiles.length);
        expect(data.ids).toHaveLength(supportedFiles.length);
        expect(error).toBeTypeOf("string");
        createdIds.push(...data.ids);
      }
    });

    it("Single tagged upload", async () => {
      const { data, error, success } = await nearbyy.uploadFiles({
        fileUrls: [supportedFiles[0]!],
        tag: "test-tag",
      });

      if (success) {
        expect(data.ids).toHaveLength(1);
      }

      expect(error).toBe(null);
    });
  });

  describe("Queries", () => {
    it("Simple Query", async () => {
      const { data, success, error } = await nearbyy.semanticSearch({
        query: "garlic",
        limit: 1,
      });

      if (success) {
        expect(data.items).toHaveLength(1);
      }

      expect(error).toBe(null);
    });
  });

  describe("Deletions", () => {
    it("A single file", async () => {
      const { success, error, data } = await nearbyy.deleteFiles({
        ids: [createdIds[0]!],
      });

      if (success) {
        expect(data.ids).toHaveLength(1);
      }

      expect(error).toBe(null);
    });

    it("Multiple files", async () => {
      const { success, error, data } = await nearbyy.deleteFiles({
        ids: createdIds.slice(1, createdIds.length),
      });

      if (success) {
        expect(data.ids).toHaveLength(createdIds.length - 1);
      }

      expect(error).toBe(null);
    });

    it("Non-existing file", async () => {
      const id = crypto.randomUUID();
      const { success, error, data } = await nearbyy.deleteFiles({ ids: [id] });

      if (!success) {
        expect(data.ids).toHaveLength(0);
        expect(data.rejectedIds).toHaveLength(1);
        expect(data.rejectedIds[0]).toBe(id);
        expect(error).toBeTypeOf("string");
      }
    });
  });
});
