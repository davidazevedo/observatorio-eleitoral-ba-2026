import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { assertSameOrigin, verifySubmissionSession } from '@/lib/submission-session';

export const runtime = 'nodejs';

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const validId = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const validDate = (value: string) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value);

const categories = new Set([
  'Transferência ou convênio',
  'Licitação ou contrato',
  'Obra ou serviço público',
  'Distribuição de benefício ou vantagem',
  'Evento, publicidade ou uso de estrutura pública',
  'Fornecedor ou apoiador',
  'Outro',
]);

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json();
    const submissionId = text(body.submissionId, 40);
    if (!validId(submissionId) || !verifySubmissionSession(submissionId, body.sessionToken)) {
      throw new Error('Sessão inválida ou expirada. Recarregue o formulário e tente novamente.');
    }
    if (!body.consent) throw new Error('É necessário confirmar a declaração de boa-fé.');

    const statement = text(body.statement, 12000);
    const municipality = text(body.municipality, 120);
    const eventDate = text(body.eventDate, 20);
    const category = text(body.category, 160);
    if (statement.length < 80 || !municipality) throw new Error('Informe município e um relato factual com pelo menos 80 caracteres.');
    if (!validDate(eventDate)) throw new Error('Data inválida.');
    if (!categories.has(category)) throw new Error('Categoria inválida.');

    const identified = body.mode === 'identified';
    const name = text(body.name, 200);
    const email = text(body.email, 320);
    if (identified && (!name || !email || !/^\S+@\S+\.\S+$/.test(email))) {
      throw new Error('No modo identificado, informe nome e e-mail válidos.');
    }

    const evidence = Array.isArray(body.evidence)
      ? body.evidence.slice(0, 8).map((item: Record<string, unknown>) => ({
          pathname: text(item.pathname, 800),
          contentType: text(item.contentType, 200),
          etag: text(item.etag, 200),
          originalName: text(item.originalName, 255),
          size: Math.max(0, Math.min(Number(item.size || 0), 1024 * 1024 * 1024)),
        }))
      : [];

    for (const item of evidence) {
      if (!item.pathname.startsWith(`evidence/${submissionId}/`)) throw new Error('Referência de evidência inválida.');
    }

    const now = new Date().toISOString();
    const record = {
      schemaVersion: 2,
      submissionId,
      protocol: `BA26-${submissionId.split('-')[0].toUpperCase()}`,
      status: 'received',
      createdAt: now,
      mode: identified ? 'identified' : 'anonymous',
      municipality,
      locality: text(body.locality, 240),
      eventDate,
      category,
      peopleOrEntities: text(body.peopleOrEntities, 1200),
      statement,
      sourceContext: text(body.sourceContext, 4000),
      contact: identified
        ? { name, email, phone: text(body.phone, 80) }
        : null,
      evidence,
      review: { verificationLevel: 'unreviewed', publish: false, notes: [] },
    };

    await put(`submissions/${submissionId}/metadata.json`, JSON.stringify(record, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: false,
    });

    return NextResponse.json(
      { ok: true, protocol: record.protocol },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao registrar relato.' }, { status: 400 });
  }
}
