"use server";

import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const downloadTaskFile = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.IDRIVE_BUCKET,
    Key: key,
  });

  const res = await s3.send(command);

  const bytes = await res.Body?.transformToByteArray();

  return {
    buffer: bytes,
    filename: key,
    contentType: res.ContentType || "application/octet-stream",
  };
};