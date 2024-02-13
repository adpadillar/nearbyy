import type {
  FileEndpointPostResponse,
  FileSearchClientResponse,
} from "./types";

export class NearbyyClient {
  API_KEY: string | undefined;
  API_URL: string;

  constructor(options: { API_KEY?: string; API_URL?: string }) {
    this.API_KEY = options.API_KEY ?? process.env.NEARBYY_API_KEY ?? undefined;
    this.API_URL = options.API_URL ?? "https://nearbyy.com/api";
  }

  async deleteFile({
    fileId = undefined,
    fileIds = undefined,
  }:
    | { fileId: string; fileIds?: undefined }
    | { fileIds: string[]; fileId?: undefined }) {
    const apiIdArray = fileId ? [fileId] : fileIds!;

    const res = await fetch(`${this.API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
      method: "DELETE",
      body: JSON.stringify({ ids: apiIdArray }),
    });

    if (!res.ok) {
      return { data: null, error: res.statusText } as const;
    }

    return { success: true, error: null } as const;
  }

  async uploadFile({
    fileUrl,
    fileUrls,
  }:
    | { fileUrl: string; fileUrls?: undefined }
    | { fileUrls: string[]; fileUrl?: undefined }) {
    const filesToPost = fileUrls ?? [fileUrl];

    const res = await fetch(`${this.API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        fileUrls: filesToPost,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: res.statusText,
        data: null,
      } as const;
    }

    const json = (await res.json()) as FileEndpointPostResponse;

    if (json.success) {
      return {
        success: true,
        error: null,
        data: {
          ids: json.ids,
        },
      } as const;
    }

    return {
      success: false,
      error: json.error,
      data: {
        ids: json.ids,
        rejectedUrls: json.rejectedUrls,
      },
    };
  }

  async queryDatabase({ query, limit }: { query: string; limit?: number }) {
    const res = await fetch(
      `${this.API_URL}/files?query=${query}&limit=${limit ?? 10}`,
      {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
      },
    );

    const data = (await res.json()) as unknown as FileSearchClientResponse[];

    return data;
  }
}
