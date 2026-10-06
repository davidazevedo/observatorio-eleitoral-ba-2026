import { get } from '@vercel/blob';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';

export const runtime = 'nodejs';

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0,180) || 'fonte-arquivada';
}

export async function GET(request: Request) {
  if (!isPrivateRequestAuthenticated(request)) return new Response('Não autorizado', { status: 401 });
  const url = new URL(request.url);
  const pathname = url.searchParams.get('pathname') || '';
  if (!pathname.startsWith('source-archive/raw/')) return new Response('Caminho inválido', { status: 400 });
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return new Response('Arquivo não encontrado', { status: 404 });
  const requestedName = url.searchParams.get('name') || pathname.split('/').pop() || 'fonte-arquivada';
  return new Response(result.stream, {
    headers: {
      'content-type': result.blob.contentType || 'application/octet-stream',
      'content-disposition': `attachment; filename="${safeFilename(requestedName)}"`,
      'cache-control': 'private, no-store, max-age=0',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex, nofollow, noarchive',
    },
  });
}
