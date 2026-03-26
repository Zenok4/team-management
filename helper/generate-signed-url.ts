"use server";

import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const cache = new Map();

export const getFileUrl = async (key: string) => {
  const cached = cache.get(key);

  if (cached && cached.expire > Date.now()) {
    return cached.url;
  }

  const command = new GetObjectCommand({
    Bucket: "task-files",
    Key: key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });

  cache.set(key, {
    url,
    expire: Date.now() + 3600 * 1000,
  });

  return url;
};
