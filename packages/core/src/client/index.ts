import type {
  FileEndpointDeleteBody,
  FileEndpointDeleteResponse,
  FileEndpointGetParams,
  FileEndpointGetResponse,
  FileEndpointPostBody,
  FileEndpointPostResponse,
} from "../api";
import type { FileUploader } from "./uploaders";

export class NearbyyClient {
  API_KEY: string | undefined;
  API_URL: string;
  uploader: FileUploader | null;

  constructor(options: {
    API_KEY?: string;
    API_URL?: string;
    uploader?: FileUploader;
  }) {
    this.API_KEY = options.API_KEY ?? process.env.NEARBYY_API_KEY ?? undefined;
    this.API_URL = options.API_URL ?? "https://nearbyy.com/api";
    this.uploader = options.uploader ?? null;
  }

  async getFileUrl(files: File[]) {
    if (!this.uploader) {
      throw new Error(
        "No file uploader provided. Provide a file uploader in the client constructor.",
      );
    }

    const urls = await this.uploader.upload(files);
    return urls;
  }

  async deleteFile(payload: FileEndpointDeleteBody) {
    const res = await fetch(`${this.API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
      method: "DELETE",
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as FileEndpointDeleteResponse;
    return json;
  }

  async uploadFile(payload: FileEndpointPostBody) {
    const res = await fetch(`${this.API_URL}/files`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as FileEndpointPostResponse;
    return json;
  }

  async queryDatabase(params: FileEndpointGetParams) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await fetch(`${this.API_URL}/files?${query}`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });

    const data = (await res.json()) as FileEndpointGetResponse;

    return data;
  }
}
