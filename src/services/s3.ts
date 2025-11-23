// src/services/s3.ts
// Lightweight helper to list S3 objects for a public bucket using the REST API

export interface S3ObjectInfo {
  key: string;
  lastModified?: string;
  size?: number;
  url: string;
}

export async function listS3Objects(): Promise<S3ObjectInfo[]> {
  // Prefer a backend proxy URL for listing S3 (avoids CORS and private buckets)
  const proxyUrl = (import.meta.env.VITE_API_S3_PROXY_URL as string) || (import.meta.env.VITE_API_S3_LIST_URL as string) || '/s3/list';

  const resp = await fetch(proxyUrl, { method: 'GET' });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Proxy S3 list failed (status ${resp.status}). ${text}`);
  }

  const data = await resp.json();
  // Expecting { files: [{ key, size, lastModified, url }, ...] }
  if (!data || !Array.isArray(data.files)) {
    throw new Error('Invalid response from S3 proxy');
  }

  return data.files as S3ObjectInfo[];
}
