import { NextResponse } from 'next/server';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';
import { archivePublicSource } from '@/lib/source-archive';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isPrivateRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Origem inválida.' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const url = typeof body?.url === 'string' ? body.url.trim() : '';
    if (!url) return NextResponse.json({ error: 'URL obrigatória.' }, { status: 400 });
    const record = await archivePublicSource({
      url,
      sourceId: typeof body?.sourceId === 'string' ? body.sourceId : undefined,
      title: typeof body?.title === 'string' ? body.title : undefined,
      publisher: typeof body?.publisher === 'string' ? body.publisher : undefined,
      notes: Array.isArray(body?.notes) ? body.notes : undefined,
    });
    return NextResponse.json({ ok: true, record }, { status: 201, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao arquivar fonte.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }
}
