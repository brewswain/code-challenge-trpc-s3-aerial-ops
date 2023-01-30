import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  apiVersion: "2006-03-1",
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});
