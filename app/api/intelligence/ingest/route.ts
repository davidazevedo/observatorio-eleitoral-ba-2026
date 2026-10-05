import { NextResponse } from 'next/server';
import {
  normalizeIntelligenceRecord,
  persistIntelligenceRecord,
  verifyIntelligenceApiKey,
} from '@/lib/intelligence';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!verifyIntelligenceApiKey(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const body = await request.json();
    const rawRecords = Array.isArray(body?.records) ? body.records : body?.record ? [body.record] : [body];
    if (!rawRecords.length || rawRecords.length > 100) {
      return NextResponse.json({ error: 'Envie entre 1 e 100 registros por chamada.' }, { status: 400 });
    }

    const results = [];
    for (const raw of rawRecords) {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Registro inválido.');
      const record = normalizeIntelligenceRecord(raw as Record<string, unknown>);
      const pathname = await persistIntelligenceRecord(record);
      results.push({ recordId: record.recordId, kind: record.kind, status: record.status, pathname });
    }

    return NextResponse.json(
      { ok: true, count: results.length, records: results },
      { status: 201, headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Falha ao ingerir dados.' },
      { status: 400, headers: { 'cache-control': 'no-store' } },
    );
  }
}
