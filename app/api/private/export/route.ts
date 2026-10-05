import { getPrivateDashboardData } from '@/lib/private-data';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';

export const runtime = 'nodejs';

function csvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!isPrivateRequestAuthenticated(request)) {
    return new Response('Não autorizado', { status: 401 });
  }

  const data = await getPrivateDashboardData();
  const format = new URL(request.url).searchParams.get('format') || 'json';

  if (format === 'csv') {
    const header = [
      'protocol', 'createdAt', 'mode', 'municipality', 'locality', 'eventDate', 'category',
      'peopleOrEntities', 'status', 'verificationLevel', 'evidenceCount', 'contactName',
      'contactEmail', 'contactPhone', 'statement', 'sourceContext',
    ];
    const rows = data.submissions.map((item) => [
      item.protocol,
      item.createdAt,
      item.mode,
      item.municipality,
      item.locality,
      item.eventDate,
      item.category,
      item.peopleOrEntities,
      item.status,
      item.review?.verificationLevel || 'unreviewed',
      item.evidence?.length || 0,
      item.contact?.name || '',
      item.contact?.email || '',
      item.contact?.phone || '',
      item.statement,
      item.sourceContext,
    ]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
    return new Response('\uFEFF' + csv, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="observatorio-submissoes.csv"',
        'cache-control': 'private, no-store',
        'x-robots-tag': 'noindex, nofollow, noarchive',
      },
    });
  }

  return Response.json(data, {
    headers: {
      'content-disposition': 'attachment; filename="observatorio-dados-privados.json"',
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow, noarchive',
    },
  });
}
