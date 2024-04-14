import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { env } from "~/env";

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

interface GetPresignedUrlResponse {
  url: string;
  fields: Record<string, string>;
}

export async function getPresignedUrl(
  fileId: string,
  projectId: string,
  contentType: string,
): Promise<GetPresignedUrlResponse> {
  const { url, fields } = await createPresignedPost(client, {
    Bucket: env.AWS_BUCKET_NAME,
    Key: fileId,
    Conditions: [
      ["content-length-range", 0, 10485760], // up to 10 MB
      ["starts-with", "$Content-Type", contentType],
    ],
    Fields: {
      "Content-Type": contentType,
      "x-nearbyy-project-id": projectId,
      "x-nearbyy-file-id": fileId,
    },
    Expires: 3600,
  });

  return { url, fields };
}