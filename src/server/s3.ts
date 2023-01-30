import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  apiVersion: "2006-03-1",
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
  forcePathStyle: true,
});
