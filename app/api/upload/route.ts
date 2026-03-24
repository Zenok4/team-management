import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.IDRIVE_REGION,
  endpoint: process.env.IDRIVE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.IDRIVE_KEY!,
    secretAccessKey: process.env.IDRIVE_SECRET!,
  },
});

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;

  console.log("Received file for upload:", file.name, file.size, file.type);

  const buffer = Buffer.from(await file.arrayBuffer());

  const filename = `${Date.now()}-${file.name}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.IDRIVE_BUCKET,
      Key: filename,
      Body: buffer,
    })
  );

  const url = `${process.env.IDRIVE_ENDPOINT}/${process.env.IDRIVE_BUCKET}/${filename}`;

  return Response.json({ url });
}