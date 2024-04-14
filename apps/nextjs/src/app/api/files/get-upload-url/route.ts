import { withKeyAuth } from "@nearbyy/auth";
import {
  getUploadUrlEndpointGetParams,
  getUploadUrlEndpointGetResponse,
} from "@nearbyy/core";
import { db } from "@nearbyy/db";

import { getPresignedUrl } from "~/utils/server/getPresignedUrl";

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
    const countQuery = await db.drizzle
      .select({ count: db.helpers.count(db.schema.presignedUrls) })
      .from(db.schema.presignedUrls)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.presignedUrls.projectId, projectid),
          db.helpers.eq(db.schema.presignedUrls.status, "PENDING"),
        ),
      );

    const projectPendingCount = countQuery[0]?.count ?? 0;

    if (projectPendingCount + 1 > 10) {
      return {
        status: 429,
        body: {
          data: null,
          error: `There are more than 10 pending uploads for this project. To fix this, you can:
          - Fulfill the pending uploads
          - Cancel the pending uploads`,
          success: false,
        },
      } as const;
    }

    const fileId = crypto.randomUUID();
    const urlId = crypto.randomUUID();

    try {
      const { url, fields } = await getPresignedUrl(
        fileId,
        projectid,
        params.contentType,
      );

      await db.drizzle.insert(db.schema.presignedUrls).values({
        projectId: projectid,
        fileId: fileId,
        contentType: params.contentType,
        fields: fields,
        url,
        id: urlId,
      });

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
