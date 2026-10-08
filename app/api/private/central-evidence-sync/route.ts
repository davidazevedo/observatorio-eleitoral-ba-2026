import { NextResponse } from 'next/server';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';
import { syncCentralEvidenceToPrivateBlob } from '@/lib/central-evidence-sync';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isPrivateRequestAuthenticated(request)) {
    return NextResponse.json({error:'Não autorizado.'},{status:401,headers:{'cache-control':'no-store'}});
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({error:'Origem inválida.'},{status:403,headers:{'cache-control':'no-store'}});
  }
  try {
    const result = await syncCentralEvidenceToPrivateBlob();
    return NextResponse.json(result,{status:result.ok?200:207,headers:{'cache-control':'no-store'}});
  } catch {
    return NextResponse.json({error:'Falha ao espelhar evidências.'},{status:500,headers:{'cache-control':'no-store'}});
  }
}
