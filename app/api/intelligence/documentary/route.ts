import { NextResponse } from 'next/server';
import { verifyIntelligenceApiKey } from '@/lib/intelligence';
import ledger from '@/data/investigation/fm02-documentary-ledger-2026-10-08.json';
import payments from '@/data/investigation/fm02-fiplan-primary-rows-2026-10-08.json';
export const runtime='nodejs';
export async function GET(request:Request){
 if(!verifyIntelligenceApiKey(request)){
  return NextResponse.json({error:'Não autorizado.'},{status:401,headers:{'cache-control':'no-store'}});
 }
 const url=new URL(request.url);
 const id=url.searchParams.get('caseId')?.trim().toUpperCase()||'';
 if(id && !/^PREBA-0[1-4]$/.test(id)){
  return NextResponse.json({error:'caseId inválido'},{status:400,headers:{'cache-control':'no-store'}});
 }
 const cases=ledger.cases.filter(c=>!id||c.caseId===id);
 const matchedSources=ledger.sources.filter(s=>cases.some(c=>c.municipality===s.municipality));
 const lines=payments.records.filter(p=>!id||p.caseId===id);
 return NextResponse.json({
  ok:true, phase:'FM-02',status:ledger.phaseStatus,caseCount:cases.length,
  cases, fiplanOriginal:{
   source:payments.source,records:lines,
   hashBoundary:'SHA-256 dos CSV.gz e texto descompactado; PDFs originais não foram incorporados automaticamente',
  },
  sourceReferences:matchedSources,
  archiveBoundary:ledger.verifiedSourceArchiveInThisStage,
  criminalConclusion:'none',electoralPurchaseConclusion:'none',
 },{headers:{'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow, noarchive'}});
}
