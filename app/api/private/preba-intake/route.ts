import { NextResponse } from 'next/server';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';
import { receiveDiligence } from '@/lib/preba-intake';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'cache-control':'no-store' };
const MAX_REQUEST_BYTES = 9 * 1024 * 1024;

export async function POST(request:Request) {
  if (!isPrivateRequestAuthenticated(request)) return NextResponse.json({error:'Não autorizado.'},{status:401,headers});
  const origin=request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return NextResponse.json({error:'Origem inválida.'},{status:403,headers});
  const declared=Number(request.headers.get('content-length')||'0');
  if (!Number.isInteger(declared) || declared < 1 || declared > MAX_REQUEST_BYTES) return NextResponse.json({error:'Tamanho da solicitação inválido.'},{status:413,headers});
  try {
    const form=await request.formData();
    const requestId=form.get('requestId');
    const packageId=form.get('packageId');
    const upload=form.get('document');
    if(typeof requestId!=='string'||typeof packageId!=='string'||!(upload instanceof File)) return NextResponse.json({error:'Dados obrigatórios ausentes.'},{status:400,headers});
    if(upload.size>8*1024*1024||upload.size<8) return NextResponse.json({error:'Arquivo fora do limite.'},{status:413,headers});
    const receipt=await receiveDiligence({requestId,packageId,filename:upload.name,contentType:upload.type,bytes:new Uint8Array(await upload.arrayBuffer())});
    // Never return an unguarded file URL or private blob token to the client.
    return NextResponse.json({ok:true,receipt:{receiptId:receipt.receiptId,requestId:receipt.requestId,packageId:receipt.packageId,receivedAt:receipt.receivedAt,sha256:receipt.sha256,status:receipt.status}},{status:201,headers});
  } catch(e) {
    const message=e instanceof Error?e.message:'Falha ao receber documento.';
    return NextResponse.json({error:message},{status:400,headers});
  }
}
