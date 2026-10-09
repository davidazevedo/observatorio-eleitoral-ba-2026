import { NextResponse } from 'next/server';
import { verifyIntelligenceApiKey } from '@/lib/intelligence';
import registry from '@/data/investigation/fm03-financial-chain-baseline-2026-10-08.json';
import fiscalSources from '@/data/investigation/fm03-municipal-source-register-2026-10-08.json';
import captureQuality from '@/data/investigation/fm03-source-capture-quality-2026-10-08.json';

export const runtime='nodejs';
export async function GET(request:Request){
  if(!verifyIntelligenceApiKey(request)){
    return NextResponse.json({error:'Não autorizado.'},{status:401,headers:{'cache-control':'no-store'}});
  }
  const url=new URL(request.url);
  const caseId=url.searchParams.get('caseId')?.trim().toUpperCase()||'';
  if(caseId && !/^PREBA-0[1-4]$/.test(caseId)){
    return NextResponse.json({error:'caseId inválido.'},{status:400,headers:{'cache-control':'no-store'}});
  }
  const chains=registry.chains.filter(chain=>!caseId||chain.caseId===caseId);
  return NextResponse.json({
    ok:true,registryId:registry.registryId,status:registry.status,
    count:chains.length,counts:registry.counting,chains,
    municipalFiscalSources: fiscalSources.sources.filter(source=>!caseId||source.caseId===caseId),
    fiscalCaptureAssessment: { ...captureQuality.count, finding: captureQuality.interpretation },
    municipalPortalReferenceBoundary: 'Links oficiais de consulta, não comprovantes de pagamentos ou fornecedores.',
    limitations:registry.nonConclusions,
    provenance:'repository_file_versioned',privateBlobMirroring:'not_inferred',
  },{headers:{'cache-control':'private, no-store','x-robots-tag':'noindex, nofollow, noarchive'}});
}
