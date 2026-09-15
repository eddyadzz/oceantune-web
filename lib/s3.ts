// lib/s3.ts — server only. Never import from client components.
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const s3 = process.env.R2_ENDPOINT
  ? new S3Client({
      region: 'us-east-1', // required by the SDK; ignored by mvcdn.cc
      endpoint: process.env.R2_ENDPOINT, // https://mvcdn.cc/s3
      forcePathStyle: true, // REQUIRED — no virtual-host buckets
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
      },
    })
  : undefined;

const BUCKET = process.env.R2_BUCKET ?? 'oceantune-web-storage';

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  if (!s3) throw new Error('R2 storage is not configured.');
  await s3.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType })
  );
  return key;
}

export async function deleteFile(key: string): Promise<void> {
  if (!s3) throw new Error('R2 storage is not configured.');
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function listFiles(prefix = ''): Promise<string[]> {
  if (!s3) return [];
  const res = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix }));
  return (res.Contents ?? [])
    .map((o) => o.Key!)
    .filter((key) => key !== prefix);
}

export async function presignDownload(key: string, expiresIn = 3600) {
  if (!s3) throw new Error('R2 storage is not configured.');
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn });
}

/** Public bucket: files are served at <endpoint>/<bucket>/<key>. */
export function publicUrl(key: string): string {
  const endpoint = (process.env.R2_ENDPOINT ?? 'https://mvcdn.cc/s3').replace(/\/+$/, '');
  return `${endpoint}/${BUCKET}/${key.replace(/^\/+/, '')}`;
}