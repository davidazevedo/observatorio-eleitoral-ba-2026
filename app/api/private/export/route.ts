import { getPrivateDashboardData } from '@/lib/private-data';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';

export const runtime = 'nodejs';

function csvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function csvResponse(filename: string, header: string[], rows: unknown[][]) {
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  return new Response('\uFEFF' + csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow, noarchive',
    },
  });
}

export async function GET(request: Request) {
  if (!isPrivateRequestAuthenticated(request)) {
    return new Response('Não autorizado', { status: 401 });
  }

  const data = await getPrivateDashboardData();
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  const scope = url.searchParams.get('scope') || 'submissions';

  if (format === 'csv') {
    if (scope === 'intelligence') {
      const header = ['recordId','kind','status','title','summary','municipality','state','eventDate','collectedAt','evidenceLevel','analyticalConfidence','priority','publisher','sourceUrl','tags','caseIds','announced','committed','liquidated','paid','contractValue','amendmentValue'];
      const rows = data.intelligence.map((item) => [
        item.recordId,item.kind,item.status,item.title,item.summary,item.municipality||'',item.state||'',item.eventDate||'',
        item.collectedAt,item.evidenceLevel,item.analyticalConfidence??'',item.priority,item.provenance?.publisher||'',
        item.provenance?.sourceUrl||'',(item.tags||[]).join('|'),(item.caseIds||[]).join('|'),
        item.financial?.announced??'',item.financial?.committed??'',item.financial?.liquidated??'',item.financial?.paid??'',
        item.financial?.contractValue??'',item.financial?.amendmentValue??'',
      ]);
      return csvResponse('observatorio-intelligence.csv', header, rows);
    }

    if (scope === 'sources') {
      const header = ['id','name','organization','category','url','access','scope','origin','capabilities'];
      const rows = data.sources.map((item) => [item.id,item.name,item.organization,item.category,item.url,item.access,item.scope,item.origin,(item.capabilities||[]).join('|')]);
      return csvResponse('observatorio-fontes.csv', header, rows);
    }

    if (scope === 'entities') {
      const header = ['name','type','identifier','mentions','roles'];
      const rows = data.entities.map((item) => [item.name,item.type,item.identifier||'',item.mentions,item.roles.join('|')]);
      return csvResponse('observatorio-entidades.csv', header, rows);
    }

    if (scope === 'relationships') {
      const header = ['from','type','to','description'];
      const rows = data.relationships.map((item) => [item.from,item.type,item.to,item.description||'']);
      return csvResponse('observatorio-relacoes.csv', header, rows);
    }

    const header = [
      'protocol','createdAt','mode','municipality','locality','eventDate','category',
      'peopleOrEntities','status','verificationLevel','evidenceCount','contactName',
      'contactEmail','contactPhone','statement','sourceContext',
    ];
    const rows = data.submissions.map((item) => [
      item.protocol,item.createdAt,item.mode,item.municipality,item.locality,item.eventDate,item.category,
      item.peopleOrEntities,item.status,item.review?.verificationLevel||'L0',item.evidence?.length||0,
      item.contact?.name||'',item.contact?.email||'',item.contact?.phone||'',item.statement,item.sourceContext,
    ]);
    return csvResponse('observatorio-submissoes.csv', header, rows);
  }

  return Response.json(data, {
    headers: {
      'content-disposition': 'attachment; filename="observatorio-cockpit-completo.json"',
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow, noarchive',
    },
  });
}
