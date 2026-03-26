"use server";

import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadToS3 = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const key = `${Date.now()}-${file.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: "task-files",
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return `${process.env.IDRIVE_ENDPOINT}/${process.env.IDRIVE_BUCKET}/${key}`;
};
