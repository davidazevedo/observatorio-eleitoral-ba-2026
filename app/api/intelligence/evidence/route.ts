import { NextResponse } from 'next/server';
import { centralEvidenceEntries, centralEvidenceRegistryId, canonicalEvidenceHash } from '@/lib/central-evidence';
import { verifyIntelligenceApiKey } from '@/lib/intelligence';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  if (!verifyIntelligenceApiKey(request)) {
    return NextResponse.json({error:'Não autorizado.'},{status:401,headers:{'cache-control':'no-store'}});
  }
  const url = new URL(request.url);
  const id = (url.searchParams.get('id') || '').trim().toUpperCase();
  const municipality = (url.searchParams.get('municipality') || '').trim().toLocaleLowerCase('pt-BR');
  const offsetValue = Number(url.searchParams.get('offset') || 0);
  const limitValue = Number(url.searchParams.get('limit') || 57);
  const offset = Number.isFinite(offsetValue) ? Math.max(0, Math.floor(offsetValue)) : 0;
  const limit = Number.isFinite(limitValue) ? Math.min(100, Math.max(1, Math.floor(limitValue))) : 57;
  if (id && !/^CE-\d{3}$/.test(id)) {
    return NextResponse.json({error:'Identificador de evidência inválido.'},{status:400,headers:{'cache-control':'no-store'}});
  }
  const records = centralEvidenceEntries.filter(item =>
    (!id || item.evidenceId === id) &&
    (!municipality || item.documentedFact.municipality.toLocaleLowerCase('pt-BR').includes(municipality))
  );
  return NextResponse.json({
    ok:true, registryId:centralEvidenceRegistryId,
    total:records.length, offset, limit,
    origin:'git-versioned-ledger', privateBlobMirror:'not_inferred_from_this_endpoint',
    records: records.slice(offset, offset + limit).map(item => ({
      ...item, canonicalPayloadSha256:canonicalEvidenceHash(item),
    })),
  },{headers:{'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow, noarchive'}});
}
