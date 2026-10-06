import { createHash } from 'node:crypto';
import { get, list, put, type ListBlobResultBlob } from '@vercel/blob';

export type SourceArchiveRecord = {
  schemaVersion: 1;
  sourceId: string;
  originalUrl: string;
  finalUrl: string;
  title?: string;
  publisher?: string;
  retrievedAt: string;
  httpStatus: number;
  contentType: string;
  size: number;
  sha256: string;
  etag?: string;
  lastModified?: string;
  responseDate?: string;
  cacheControl?: string;
  contentDisposition?: string;
  server?: string;
  rawBlobPath: string;
  manifestBlobPath: string;
  certificateSha256: string;
  retrievalAgent: string;
  notes?: string[];
};

const MAX_BYTES = 150 * 1024 * 1024;

function safeId(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'source';
}

function disallowedHost(hostname: string) {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return h === 'localhost' || h.endsWith('.local') || h === '::1' ||
    h.startsWith('127.') || h.startsWith('10.') || h.startsWith('192.168.') ||
    h.startsWith('169.254.') || h.startsWith('172.16.') || h.startsWith('172.17.') ||
    h.startsWith('172.18.') || h.startsWith('172.19.') || h.startsWith('172.2') ||
    h.startsWith('172.30.') || h.startsWith('172.31.') ||
    h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80');
}

function assertPublicUrl(value: string) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Somente URLs HTTP/HTTPS são permitidas.');
  if (disallowedHost(url.hostname)) throw new Error('Host privado/local não permitido.');
  if (url.port && !['80','443'].includes(url.port)) throw new Error('Porta não permitida.');
  return url;
}

async function fetchFollowingSafeRedirects(input: string) {
  let current = assertPublicUrl(input);
  for (let i = 0; i < 6; i += 1) {
    const response = await fetch(current, {
      redirect: 'manual',
      signal: AbortSignal.timeout(45000),
      headers: {
        'user-agent': 'Observatorio-Eleitoral-Bahia-2026-Source-Archive/1.0',
        accept: '*/*',
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Redirecionamento sem destino.');
      current = assertPublicUrl(new URL(location, current).toString());
      continue;
    }
    return response;
  }
  throw new Error('Muitos redirecionamentos.');
}

function extension(contentType: string, url: string) {
  const pathExt = new URL(url).pathname.match(/\.[a-zA-Z0-9]{1,8}$/)?.[0];
  if (pathExt) return pathExt.toLowerCase();
  if (contentType.includes('json')) return '.json';
  if (contentType.includes('html')) return '.html';
  if (contentType.includes('pdf')) return '.pdf';
  if (contentType.includes('zip')) return '.zip';
  if (contentType.includes('csv')) return '.csv';
  if (contentType.includes('xml')) return '.xml';
  return '.bin';
}

function canonicalForCertificate(record: Omit<SourceArchiveRecord,'certificateSha256'>) {
  return JSON.stringify(record);
}

export function verifySourceArchiveRecord(record: SourceArchiveRecord) {
  const { certificateSha256, ...unsigned } = record;
  const calculated = createHash('sha256').update(canonicalForCertificate(unsigned)).digest('hex');
  return calculated === certificateSha256;
}

export async function archivePublicSource(input: {
  url: string;
  sourceId?: string;
  title?: string;
  publisher?: string;
  notes?: string[];
}) {
  const original = assertPublicUrl(input.url).toString();
  const retrievedAt = new Date().toISOString();
  const stamp = retrievedAt.replace(/[:.]/g,'-');
  const id = safeId(input.sourceId || new URL(original).hostname);
  const response = await fetchFollowingSafeRedirects(original);
  if (!response.ok || !response.body) throw new Error(`Falha ao coletar fonte: HTTP ${response.status}.`);

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const declared = Number(response.headers.get('content-length') || 0);
  if (declared > MAX_BYTES) throw new Error('Fonte excede o limite de preservação de 150 MB.');

  const hash = createHash('sha256');
  let size = 0;
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      size += chunk.byteLength;
      if (size > MAX_BYTES) throw new Error('Fonte excede o limite de preservação de 150 MB.');
      hash.update(chunk);
      controller.enqueue(chunk);
    },
  });

  const rawBlobPath = `source-archive/raw/${stamp}-${id}${extension(contentType, response.url || original)}`;
  await put(rawBlobPath, response.body.pipeThrough(transform), {
    access: 'private',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: false,
  });

  const sha256 = hash.digest('hex');
  const manifestBlobPath = `source-archive/manifests/${stamp}-${id}.json`;
  const unsigned: Omit<SourceArchiveRecord,'certificateSha256'> = {
    schemaVersion: 1,
    sourceId: id,
    originalUrl: original,
    finalUrl: response.url || original,
    title: input.title?.trim().slice(0,500) || undefined,
    publisher: input.publisher?.trim().slice(0,300) || undefined,
    retrievedAt,
    httpStatus: response.status,
    contentType,
    size,
    sha256,
    etag: response.headers.get('etag') || undefined,
    lastModified: response.headers.get('last-modified') || undefined,
    responseDate: response.headers.get('date') || undefined,
    cacheControl: response.headers.get('cache-control') || undefined,
    contentDisposition: response.headers.get('content-disposition') || undefined,
    server: response.headers.get('server') || undefined,
    rawBlobPath,
    manifestBlobPath,
    retrievalAgent: 'OEBA source-archive/1.0',
    notes: (input.notes || []).slice(0,20).map((note)=>String(note).slice(0,1000)),
  };
  const certificateSha256 = createHash('sha256').update(canonicalForCertificate(unsigned)).digest('hex');
  const record: SourceArchiveRecord = { ...unsigned, certificateSha256 };

  await put(manifestBlobPath, JSON.stringify(record, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: false,
  });
  return record;
}

async function listAll(prefix: string) {
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

export async function listSourceArchives(): Promise<SourceArchiveRecord[]> {
  const blobs = await listAll('source-archive/manifests/');
  const records = await Promise.all(blobs.filter((blob)=>blob.pathname.endsWith('.json')).map(async (blob) => {
    try {
      const result = await get(blob.pathname, { access: 'private', useCache: false });
      if (!result || result.statusCode !== 200) return null;
      return JSON.parse(await new Response(result.stream).text()) as SourceArchiveRecord;
    } catch {
      return null;
    }
  }));
  return records.filter((item): item is SourceArchiveRecord => Boolean(item?.sha256 && item?.rawBlobPath))
    .sort((a,b)=>b.retrievedAt.localeCompare(a.retrievedAt));
}
