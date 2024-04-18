import { describe } from "vitest";

import { it, supportedFiles, unsupportedFiles } from ".";
import {
  chunkEndpointGetResponse,
  fileEndpointDeleteResponse,
  fileEndpointPostResponse,
  NearbyyClient,
} from "..";

describe("API shape test", () => {
  const createdIds: string[] = [];

  const nearbyy = new NearbyyClient({
    API_KEY: process.env.NEARBYY_TESTING_KEY!,
    API_URL: "http://localhost:3000/api", // Test with the local server
  });

  it("/files GET shape", async () => {
    const res1 = await nearbyy.semanticSearch({
      query: "garlic",
      limit: 1,
    });

    const res2 = await nearbyy.semanticSearch({
      query: "garlic",
      limit: 101,
    });

    chunkEndpointGetResponse.parse(res1);
    chunkEndpointGetResponse.parse(res2);
  });

  it("/files POST shape", async () => {
    const res1 = await nearbyy.uploadFiles({
      fileUrls: supportedFiles,
    });
    const res2 = await nearbyy.uploadFiles({
      fileUrls: unsupportedFiles,
    });

    fileEndpointPostResponse.parse(res1);
    fileEndpointPostResponse.parse(res2);

    createdIds.push(...res1.data.ids);
  });

  it("/files DELETE shape", async () => {
    const res1 = await nearbyy.deleteFiles({
      ids: createdIds,
    });

    const res2 = await nearbyy.deleteFiles({
      ids: ["non-existant-id"],
    });

    fileEndpointDeleteResponse.parse(res1);
    fileEndpointDeleteResponse.parse(res2);
  });
});
