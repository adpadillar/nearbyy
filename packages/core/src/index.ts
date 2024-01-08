import type { FileSearchClientResponse } from "./types";

export class NearbyyClient {
  API_KEY: string;
  API_URL: string;

  constructor(options: { API_KEY: string }) {
    this.API_KEY = options.API_KEY;
    this.API_URL = "https://nearbyy.com/api";
  }

  async uploadFile({ fileUrl }: { fileUrl: string }) {
    await fetch(`${this.API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        fileUrl,
      }),
    });
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
