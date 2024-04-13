import { withKeyAuth } from "@nearbyy/auth";
import {
  getUploadUrlEndpointGetParams,
  getUploadUrlEndpointGetResponse,
} from "@nearbyy/core";

import { getPresignedUrl } from "~/utils/server/getPresignedUrl";

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
    const fileId = crypto.randomUUID();

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
  },
  schema: {
    params: getUploadUrlEndpointGetParams,
    response: getUploadUrlEndpointGetResponse,
  },
});
