import { describe, expect, it as internalIt } from "vitest";

import {
  fileEndpointDeleteResponse,
  fileEndpointGetResponse,
  fileEndpointPostResponse,
  NearbyyClient,
} from "../";

// This contains files .md and .txt, which are supported by the server
const supportedFiles = [
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Dependency%20Injection.md?alt=media&token=fb9a93fe-5998-46ac-b2e8-d5966e28013a",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/melisearch.md?alt=media&token=f6d8d9d6-c798-4f29-9247-71bd194ab368",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/how-to-launch-y-combinator.md?alt=media&token=55cd5731-b132-4163-8910-1a2bc9acc43d",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/home.md?alt=media&token=05c7c09e-b759-40a8-82ce-9844e4c3a114",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/garlic.txt?alt=media&token=df67d4de-ed44-4060-b2c2-205a650a8f2d",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/consentimiento-informado.md?alt=media&token=4e1aadfc-35c1-4245-9a2e-6be01979134d",
];

// This contains files .pdf, which are not supported by the server Yet
const unsupportedFiles = [
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Abstraccio%CC%81n%20de%20datos%20(ADT).pdf?alt=media&token=5bbf92c6-6276-4fcc-ba13-3a764f7294fc",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Fuerzas%20de%20la%20industria.pdf?alt=media&token=aef42c15-0d2d-437e-8843-3850126e707a",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/REGLAMENTO%20DE%20VIAJES%20PARA%20ESTUDIANTES%20(Hackathon%20Monterrey%202023).pdf?alt=media&token=6b76b1dc-c247-4f8d-abfd-326f23ee7c8e",
];

// wrap the it function to add a timeout of 30 seconds
const it = (name: string, fx: () => unknown) =>
  internalIt(name, fx, { timeout: 30 * 1000 });

describe("SDK Core test", () => {
  const createdIds: string[] = [];

  const nearbyy = new NearbyyClient({
    API_KEY: "bfcb05a68395618f4a5c7ab11f654bb8158cecc01b28e9b5",
    API_URL: "http://localhost:3000/api", // Test with the local server
  });

  it("Upload a single file", async () => {
    const res = await nearbyy.uploadFile({
      fileUrls: [supportedFiles[0]!],
    });

    const { data, error, success } = res;

    expect(success).toBe(true);
    expect(error).toBe(null);
    expect(data).toBeDefined();
    expect(data.ids).toHaveLength(1);

    fileEndpointPostResponse.parse(res); // This should not throw

    // Keep track of the created files so we can delete them later
    createdIds.push(data.ids[0]!);
  });

  it("Upload multiple files", async () => {
    const files = supportedFiles.slice(1, supportedFiles.length);

    const res = await nearbyy.uploadFile({
      fileUrls: files,
    });

    const { data, error, success } = res;

    if (success) {
      expect(success).toBe(true);
      expect(error).toBe(null);
      expect(data).toBeDefined();
      expect(data.ids).toHaveLength(files.length);
      createdIds.push(...data.ids);
    } else {
      expect("API should accept supported files").toBe("true");
    }

    fileEndpointPostResponse.parse(res); // This should not throw
  });

  it("Query the database", async () => {
    const res = await nearbyy.queryDatabase({
      query: "garlic",
      limit: 1,
    });

    const { data, success, error } = res;

    if (success) {
      expect(success).toBe(true);
      expect(error).toBe(null);
      expect(data).toBeDefined();
      expect(data).toHaveProperty("items");
      expect(data.items).toHaveLength(1);
    } else {
      expect("API should return a query").toBe("true");
    }

    fileEndpointGetResponse.parse(res); // This should not throw
  });

  it("Fail to upload unsupported files", async () => {
    const res = await nearbyy.uploadFile({
      fileUrls: unsupportedFiles,
    });

    const { data, error, success } = res;

    if (!success) {
      expect(success).toBe(false);
      expect(error).toBeTypeOf("string");
      expect(data.ids).toHaveLength(0);
      expect(data.rejectedUrls).toHaveLength(unsupportedFiles.length);
    } else {
      expect("API should not accept unsupported files").toBe("true");
    }

    fileEndpointPostResponse.parse(res); // This should not throw
  });

  it("Upload both supported and unsupported files", async () => {
    const res = await nearbyy.uploadFile({
      fileUrls: [...supportedFiles, ...unsupportedFiles],
    });

    const { data, error, success } = res;

    if (!success) {
      expect(success).toBe(false);
      expect(error).toBeTypeOf("string");
      expect(data.ids).toHaveLength(supportedFiles.length);
      expect(data.rejectedUrls).toHaveLength(unsupportedFiles.length);

      // Keep track of the created files so we can delete them later
      createdIds.push(...data.ids);
    } else {
      expect("API should accept supported files").toBe("true");
    }

    fileEndpointPostResponse.parse(res); // This should not throw
  });

  it("Delete a single created file", async () => {
    const res = await nearbyy.deleteFile({
      ids: [createdIds[0]!],
    });

    const { success, error } = res;

    expect(success).toBe(true);
    expect(error).toBe(null);

    fileEndpointDeleteResponse.parse(res); // This should not throw
  });

  it("Delete all created files", async () => {
    const res = await nearbyy.deleteFile({
      ids: createdIds.slice(1, createdIds.length),
    });

    const { success, error, data } = res;

    expect(success).toBe(true);
    expect(error).toBe(null);
    expect(data).toBeDefined();
    expect(data).toHaveProperty("ids");
    expect(data.ids).toHaveLength(createdIds.length - 1);

    fileEndpointDeleteResponse.parse(res); // This should not throw
  });

  it("Fail when deleting a non-existing file", async () => {
    const id = crypto.randomUUID();
    const res = await nearbyy.deleteFile({ ids: [id] });

    const { success, error, data } = res;

    if (!success) {
      expect(success).toBe(false);
      expect(error).toBeTypeOf("string");
      expect(data).toHaveProperty("rejectedIds");
      expect(data.rejectedIds).toHaveLength(1);
    } else {
      expect("API should not delete non-existent files").toBe("true");
    }

    fileEndpointDeleteResponse.parse(res); // This should not throw
  });
});
