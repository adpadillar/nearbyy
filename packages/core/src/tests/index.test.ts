import { describe, expect, it } from "vitest";

import { NearbyyClient } from "../";

const textFiles = [
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Dependency%20Injection.md?alt=media&token=fb9a93fe-5998-46ac-b2e8-d5966e28013a",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/melisearch.md?alt=media&token=f6d8d9d6-c798-4f29-9247-71bd194ab368",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/how-to-launch-y-combinator.md?alt=media&token=55cd5731-b132-4163-8910-1a2bc9acc43d",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/home.md?alt=media&token=05c7c09e-b759-40a8-82ce-9844e4c3a114",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/garlic.txt?alt=media&token=df67d4de-ed44-4060-b2c2-205a650a8f2d",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/consentimiento-informado.md?alt=media&token=4e1aadfc-35c1-4245-9a2e-6be01979134d",
] as const;

describe("core", () => {
  const createdIds: string[] = [];

  const nearbyy = new NearbyyClient({
    API_KEY: "bfcb05a68395618f4a5c7ab11f654bb8158cecc01b28e9b5",
    API_URL: "http://localhost:3000/api", // Test with the local server
  });

  it("should upload a single file", async () => {
    const { error, data, success } = await nearbyy.uploadFile({
      fileUrl: textFiles[0],
    });

    expect(success).toBe(true);
    expect(error).toBe(null);
    expect(data).toBeDefined();
    expect(data!.ids).toHaveLength(1);
    expect(data!.rejectedUrls).toBeUndefined();

    // Keep track of the created files so we can delete them later
    createdIds.push(data!.ids[0]!);
  });

  it("should upload multiple files", async () => {
    const files = textFiles.slice(1, textFiles.length);

    const { data, error, success } = await nearbyy.uploadFile({
      fileUrls: files,
    });

    expect(success).toBe(true);
    expect(error).toBe(null);
    expect(data).toBeDefined();
    expect(data!.ids).toHaveLength(files.length);
    expect(data!.rejectedUrls).toBeUndefined();

    // Keep track of the created files so we can delete them later
    createdIds.push(...data!.ids);
  });

  it("should query the database", async () => {
    const data = await nearbyy.queryDatabase({ query: "garlic", limit: 1 });
    expect(data).toHaveLength(1);
  });

  it("should delete all created files", async () => {
    for (const id of createdIds) {
      const { success, error } = await nearbyy.deleteFile({ fileId: id });
      expect(success).toBe(true);
      expect(error).toBe(null);
    }
  });
});
