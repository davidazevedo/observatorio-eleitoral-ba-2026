import { NextResponse } from 'next/server';
import { listIntelligenceRecords, verifyIntelligenceApiKey } from '@/lib/intelligence';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!verifyIntelligenceApiKey(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  const url = new URL(request.url);
  const kind = url.searchParams.get('kind') || '';
  const municipality = (url.searchParams.get('municipality') || '').toLocaleLowerCase('pt-BR');
  const status = url.searchParams.get('status') || '';
  const level = url.searchParams.get('evidenceLevel') || '';
  const caseId = url.searchParams.get('caseId') || '';
  const q = (url.searchParams.get('q') || '').toLocaleLowerCase('pt-BR');
  const limit = Math.min(500, Math.max(1, Number(url.searchParams.get('limit') || 100)));

  let records = await listIntelligenceRecords();
  if (kind) records = records.filter((item) => item.kind === kind);
  if (municipality) records = records.filter((item) => (item.municipality || '').toLocaleLowerCase('pt-BR').includes(municipality));
  if (status) records = records.filter((item) => item.status === status);
  if (level) records = records.filter((item) => item.evidenceLevel === level);
  if (caseId) records = records.filter((item) => item.caseIds?.includes(caseId));
  if (q) {
    records = records.filter((item) => [
      item.recordId,item.title,item.summary,item.content,item.municipality,
      ...(item.tags || []),...(item.entities || []).map((entity) => entity.name),
    ].join(' ').toLocaleLowerCase('pt-BR').includes(q));
  }

  return NextResponse.json(
    { ok: true, total: records.length, records: records.slice(0, limit) },
    { headers: { 'cache-control': 'private, no-store' } },
  );
}
