import type { FileSearchClientResponse } from "./types";

const API_URL = "https://nearbyy.com/api";

const syncFile = async (fileUrl: string, projectId: string) => {
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

const searchFiles = async (query: string, projectId: string) => {
  const res = await fetch(`${API_URL}/file?query=${query}`, {
    headers: {
      Authorization: `Bearer ${projectId}`,
    },
  });

  const data = (await res.json()) as unknown as FileSearchClientResponse;

  return data;
};

export { syncFile, searchFiles };
