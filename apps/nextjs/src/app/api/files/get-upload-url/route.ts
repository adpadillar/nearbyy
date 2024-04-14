import { withKeyAuth } from "@nearbyy/auth";
import {
  getUploadUrlEndpointGetParams,
  getUploadUrlEndpointGetResponse,
} from "@nearbyy/core";
import { db } from "@nearbyy/db";

import { env } from "~/env";
import { getPresignedUrl } from "~/utils/server/getPresignedUrl";
import { FILE_QUOTA, FILE_UPLOAD_URL_TTL } from "~/utils/shared/constants";

export const GET = withKeyAuth({
  handler: async ({ params, projectid }) => {
    const oneFileTTLAgo = new Date(Date.now() - FILE_UPLOAD_URL_TTL);

    // first, update any pending urls that have been uploaded
    await db.drizzle
      .update(db.schema.presignedUrls)
      .set({ status: "EXPIRED" })
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.presignedUrls.projectId, projectid),
          db.helpers.eq(db.schema.presignedUrls.status, "PENDING"),
          db.helpers.lt(db.schema.presignedUrls.createdAt, oneFileTTLAgo),
        ),
      );

    // after this point, we know all PENDING urls can actually still be uploaded
    // because they were created within the last hour

    const fileCountQuery = await db.drizzle
      .select({ count: db.helpers.count(db.schema.files) })
      .from(db.schema.files)
      .where(db.helpers.eq(db.schema.files.projectid, projectid));

    const urlCountQuery = await db.drizzle
      .select({ count: db.helpers.count(db.schema.presignedUrls) })
      .from(db.schema.presignedUrls)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.presignedUrls.projectId, projectid),
          db.helpers.eq(db.schema.presignedUrls.status, "PENDING"),
        ),
      );

    const fileCount = fileCountQuery[0]?.count ?? 0;
    const pendingUrlCount = urlCountQuery[0]?.count ?? 0;
    const availableUrls = FILE_QUOTA - fileCount - pendingUrlCount;

    if (availableUrls <= 0) {
      return {
        status: 429,
        body: {
          data: null,
          error: "Post url limit exceeded",
          success: false,
        },
      } as const;
    }

    // here we get all of the pending urls
    const pendingUrls = await db.drizzle
      .select()
      .from(db.schema.presignedUrls)
      .where(
        db.helpers.and(
          db.helpers.eq(db.schema.presignedUrls.projectId, projectid),
          db.helpers.eq(db.schema.presignedUrls.status, "PENDING"),
        ),
      );

    let addedFileCount = 0;

    for (const url of pendingUrls) {
      // we check if they are ACTUALLY pending, by checking if the file exists
      // in S3. This is done to prevent exploitation of the system for free storage
      const cloudfrontUrl = `${env.CLOUDFRONT_URL}/${url.fileId}`;
      const res = await fetch(cloudfrontUrl, { method: "HEAD" });

      // If the file was found, update the status to SUCCESS
      // and create a file record, so it is considered in the quota
      if (res.ok) {
        const promises = [
          db.drizzle
            .update(db.schema.presignedUrls)
            .set({ status: "SUCCESS" })
            .where(db.helpers.eq(db.schema.presignedUrls.id, url.id)),
          db.drizzle.insert(db.schema.files).values({
            projectid: projectid,
            text: "",
            type: url.contentType,
            url: cloudfrontUrl,
            id: url.fileId,
            createdAt: new Date(),
          }),
        ];

        await Promise.all(promises);
        addedFileCount++;
      }

      // if the file was not found, do nothing, as it will be cleaned up
      // in the next run of this endpoint
    }

    // now, addedFileCount contains the amount of files that were successfully
    // added, so we can update our availableUrls count

    const updatedFileCount = fileCount + addedFileCount;
    const updatedPendingUrlCount = pendingUrlCount - addedFileCount;
    const updatedAvailableUrls =
      FILE_QUOTA - updatedFileCount - updatedPendingUrlCount;

    // we can now check if we have any available urls
    if (updatedAvailableUrls <= 0) {
      return {
        status: 429,
        body: {
          data: null,
          error: "Post url limit exceeded",
          success: false,
        },
      } as const;
    }

    // here we finally know that we can create a new presigned url,
    // so we do that

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
