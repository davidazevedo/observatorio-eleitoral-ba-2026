import { createHmac, timingSafeEqual } from 'node:crypto';
import { readCookie } from '@/lib/private-auth';

const COOKIE='preba_operator_identity';
function validActor(id:string) { return /^[a-zA-Z0-9_-]{6,64}$/.test(id); }
export function verifyIntakeOperator(request:Request):string|null {
  const secret=process.env.PREBA_OPERATOR_SIGNING_SECRET;
  const allowlist=(process.env.PREBA_OPERATOR_IDS||'').split(',').map(s=>s.trim()).filter(Boolean);
  if(!secret || secret.length<32 || allowlist.length===0) return null;
  const token=readCookie(request.headers.get('cookie'),COOKIE);
  const parts=token.split('.');
  if(parts.length!==3) return null;
  const [actor,expiry,signature]=parts;
  if(!validActor(actor)|| !allowlist.includes(actor)) return null;
  const exp=Number(expiry);
  if(!Number.isSafeInteger(exp)||exp<=Date.now()/1000||exp>Date.now()/1000+3600) return null;
  const expected=createHmac('sha256',secret).update(actor+'.'+expiry).digest('base64url');
  const left=Buffer.from(signature),right=Buffer.from(expected);
  return left.length===right.length && timingSafeEqual(left,right)?actor:null;
}
