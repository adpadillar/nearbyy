import type {
  ChunkEndpointGetParams,
  ChunkEndpointGetResponse,
  FileEndpointDeleteBody,
  FileEndpointDeleteResponse,
  FileEndpointPostBody,
  FileEndpointPostResponse,
  GetUploadUrlEndpointGetParams,
  GetUploadUrlEndpointGetResponse,
} from "../api";

export class NearbyyClient {
  API_KEY: string;
  API_URL: string;
  CLOUDFRONT_URL: string;

  constructor(options: {
    API_KEY: string;
    API_URL?: string;
    CLOUDFRONT_URL?: string;
  }) {
    this.API_KEY = options.API_KEY;
    this.API_URL = options.API_URL ?? "https://nearbyy.com/api";
    this.CLOUDFRONT_URL =
      options.CLOUDFRONT_URL ?? "https://dzpv5o2pvfxys.cloudfront.net";
  }

  async uploadFiles(
    payload: { files: File[] } | { fileUrls: string[] },
    tag?: string,
  ): Promise<FileEndpointPostResponse> {
    if ("files" in payload) {
      const files = payload.files;

      // first, get presigned URLs
      const presignedUrlResponses = await Promise.all(
        files.map(async (file) => {
          const queryParams: GetUploadUrlEndpointGetParams = {
            contentType: file.type,
          };

          const queryString = Object.entries(queryParams)
            .map(([key, value]) => `${key}=${value}`)
            .join("&");

          const res = await fetch(
            `${this.API_URL}/files/get-upload-url?${queryString}`,
            {
              headers: {
                Authorization: `Bearer ${this.API_KEY}`,
              },
            },
          );

          const json = res.json() as unknown as GetUploadUrlEndpointGetResponse;
          return json;
        }),
      );

      // then, upload the files
      const allFileUrls = await Promise.all(
        presignedUrlResponses.map(async (presignedUrlResponse, idx) => {
          if (presignedUrlResponse.success) {
            const { fields, fileId, uploadUrl } = presignedUrlResponse.data;
            const formData = new FormData();

            Object.entries(fields).forEach(([key, value]) => {
              formData.append(key, value);
            });

            formData.append("file", files[idx]!);

            await fetch(uploadUrl, {
              method: "POST",
              body: formData,
            });

            return `${this.CLOUDFRONT_URL}/${fileId}`;
          }
        }),
      );

      const fileUrls = allFileUrls.filter(
        (url) => url !== undefined,
      ) as string[];

      const res = await fetch(`${this.API_URL}/files`, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({ fileUrls, tag } as FileEndpointPostBody),
      });

      const json = (await res.json()) as FileEndpointPostResponse;
      return json;
    }

    if ("fileUrls" in payload) {
      const res = await fetch(`${this.API_URL}/files`, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({ ...payload, tag } as FileEndpointPostBody),
      });

      const json = (await res.json()) as FileEndpointPostResponse;
      return json;
    }

    throw new Error(
      "Invalid payload. Neither 'files' nor 'fileUrls' key found.",
    );
  }

  async deleteFiles(payload: FileEndpointDeleteBody) {
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

  async semanticSearch(params: ChunkEndpointGetParams) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const res = await fetch(`${this.API_URL}/chunks?${query}`, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });

    const data = (await res.json()) as ChunkEndpointGetResponse;

    return data;
  }
}
