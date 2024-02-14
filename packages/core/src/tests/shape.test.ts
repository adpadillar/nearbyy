import { describe } from "vitest";

import { it, supportedFiles, unsupportedFiles } from ".";
import {
  fileEndpointDeleteResponse,
  fileEndpointGetResponse,
  fileEndpointPostResponse,
  NearbyyClient,
} from "..";

describe("API shape test", () => {
  const createdIds: string[] = [];

  const nearbyy = new NearbyyClient({
    API_KEY: "bfcb05a68395618f4a5c7ab11f654bb8158cecc01b28e9b5",
    API_URL: "http://localhost:3000/api", // Test with the local server
  });

  it("/files GET shape", async () => {
    const res1 = await nearbyy.queryDatabase({
      query: "garlic",
      limit: 1,
    });

    const res2 = await nearbyy.queryDatabase({
      query: "garlic",
      limit: 101,
    });

    fileEndpointGetResponse.parse(res1);
    fileEndpointGetResponse.parse(res2);
  });

  it("/files POST shape", async () => {
    const res1 = await nearbyy.uploadFile({
      fileUrls: supportedFiles,
    });
    const res2 = await nearbyy.uploadFile({
      fileUrls: unsupportedFiles,
    });

    fileEndpointPostResponse.parse(res1);
    fileEndpointPostResponse.parse(res2);

    createdIds.push(...res1.data.ids);
  });

  it("/files DELETE shape", async () => {
    const res1 = await nearbyy.deleteFile({
      ids: createdIds,
    });

    const res2 = await nearbyy.deleteFile({
      ids: ["non-existant-id"],
    });

    fileEndpointDeleteResponse.parse(res1);
    fileEndpointDeleteResponse.parse(res2);
  });
});
