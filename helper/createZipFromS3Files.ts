import JSZip from "jszip";
import { downloadTaskFile } from "./dowload-file-s3";

export const createZipFromS3Files = async (
  fileUrls: string[],
  zipName = "files.zip",
) => {
  if (!fileUrls?.length) return null;

  const files = await Promise.all(
    fileUrls.map(async (url) => {
      const key = url.split("/").pop()!;
      return downloadTaskFile(key);
    }),
  );

  const zip = new JSZip();

  files
    .filter((file) => file?.buffer)
    .forEach((file) => {
      zip.file(file.filename, file.buffer!);
    });

  const zipBuffer = await zip.generateAsync({ type: "uint8array" });

  return {
    buffer: zipBuffer,
    filename: zipName,
    contentType: "application/zip",
  };
};
