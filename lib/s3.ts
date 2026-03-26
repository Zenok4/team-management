import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.IDRIVE_REGION,
  endpoint: process.env.IDRIVE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.IDRIVE_KEY!,
    secretAccessKey: process.env.IDRIVE_SECRET!,
  },
});