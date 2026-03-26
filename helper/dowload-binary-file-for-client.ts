export const downloadBinaryFile = (
  buffer: Uint8Array,
  filename: string,
  type: string
) => {
  //ignore
  const blob = new Blob([buffer as BlobPart], { type });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};