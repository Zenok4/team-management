export const downloadBinaryFile = (
  buffer: Uint8Array,
  filename: string,
  type: string
) => {
  const blob = new Blob([buffer], { type });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};