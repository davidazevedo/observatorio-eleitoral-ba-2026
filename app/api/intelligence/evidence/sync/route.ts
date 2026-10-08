import { NextResponse } from 'next/server';
import { verifyIntelligenceApiKey } from '@/lib/intelligence';
import { syncCentralEvidenceToPrivateBlob } from '@/lib/central-evidence-sync';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!verifyIntelligenceApiKey(request)) {
    return NextResponse.json({error:'Não autorizado.'},{status:401,headers:{'cache-control':'no-store'}});
  }
  let body: { id?: string; all?: boolean };
  try { body = await request.json(); } catch {
    return NextResponse.json({error:'Corpo JSON obrigatório.'},{status:400});
  }
  const id = typeof body?.id === 'string' ? body.id.trim().toUpperCase() : '';
  if ((!body?.all && !/^CE-\d{3}$/.test(id)) || (body?.all && id)) {
    return NextResponse.json({error:'Informe all=true ou id=CE-NNN.'},{status:400});
  }
  const result = await syncCentralEvidenceToPrivateBlob(body.all ? undefined : [id]);
  if (id && !result.requested) return NextResponse.json({error:'Evidência não encontrada.'},{status:404});
  return NextResponse.json(result,{status:result.ok?200:207,headers:{'cache-control':'no-store'}});
}
