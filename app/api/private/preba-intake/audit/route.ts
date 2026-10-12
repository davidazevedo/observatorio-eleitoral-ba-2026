import { NextResponse } from 'next/server';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';
import { listIntakeAudit, verifyIntakeReceipt } from '@/lib/preba-intake-audit';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={ 'cache-control':'no-store' };

export async function GET(request:Request) {
  if (!isPrivateRequestAuthenticated(request)) return NextResponse.json({error:'Não autorizado.'},{status:401,headers:noStore});
  if (process.env.PREBA_AUDIT_INVENTORY_ENABLED!=='true') return NextResponse.json({error:'Inventário ainda não habilitado.'},{status:503,headers:noStore});
  try {
    const inventory=await listIntakeAudit();
    // Never expose blob URLs or original document content. Only return quarantine identifiers and consistency.
    const items=await Promise.all(inventory.map(item=>verifyIntakeReceipt(item)));
    return NextResponse.json({ok:true,total:items.length,orphans:items.filter(x=>x.state!=='complete_quarantined').length,items},{headers:noStore});
  } catch {
    return NextResponse.json({error:'Falha na auditoria privada.'},{status:503,headers:noStore});
  }
}
