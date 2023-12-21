import type { FileSearchClientResponse } from "./types";

const API_URL = "https://nearbyy.com/api";

const uploadFile = async (fileUrl: string, projectId: string) => {
  await fetch(`${API_URL}/files`, {
    headers: {
      Authorization: `Bearer ${projectId}`,
    },
    method: "POST",
    body: JSON.stringify({
      fileUrl,
    }),
  });
};

const queryDatabase = async (query: string, projectId: string) => {
  const res = await fetch(`${API_URL}/file?query=${query}`, {
    headers: {
      Authorization: `Bearer ${projectId}`,
    },
  });

  const data = (await res.json()) as unknown as FileSearchClientResponse;

  return data;
};

export { uploadFile, queryDatabase };
