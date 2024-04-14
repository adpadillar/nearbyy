import { withKeyAuth } from "@nearbyy/auth";
import {
  getUploadUrlEndpointGetParams,
  getUploadUrlEndpointGetResponse,
} from "@nearbyy/core";

import { getPresignedUrl } from "~/utils/server/getPresignedUrl";

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
    const fileId = crypto.randomUUID();

    try {
      const { url, fields } = await getPresignedUrl(
        fileId,
        projectid,
        params.contentType,
      );

      return {
        status: 200,
        body: {
          data: {
            uploadUrl: url,
            fileId: fileId,
            fields: fields,
          },
          error: null,
          success: true,
        },
      } as const;
    } catch {
      return {
        status: 500,
        body: {
          data: null,
          error: "Failed to get upload URL",
          success: false,
        },
      } as const;
    }
  },
  schema: {
    params: getUploadUrlEndpointGetParams,
    response: getUploadUrlEndpointGetResponse,
  },
});
