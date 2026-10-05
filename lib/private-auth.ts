import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const PRIVATE_COOKIE_NAME = 'oeba_private_session';
export const PRIVATE_SESSION_TTL_SECONDS = 12 * 60 * 60;

function accessHash() {
  const value = process.env.PRIVATE_DASHBOARD_KEY_HASH;
  if (!value || !/^[a-f0-9]{64}$/i.test(value)) {
    throw new Error('PRIVATE_DASHBOARD_KEY_HASH não configurado.');
  }
  return value.toLowerCase();
}

function sessionSecret() {
  const value = process.env.PRIVATE_DASHBOARD_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('PRIVATE_DASHBOARD_SESSION_SECRET não configurado.');
  }
  return value;
}

function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyPrivateAccessKey(key: unknown) {
  if (typeof key !== 'string' || key.length < 20 || key.length > 256) return false;
  const received = createHash('sha256').update(key, 'utf8').digest('hex');
  return safeEqualHex(received, accessHash());
}

function sign(exp: number) {
  return createHmac('sha256', sessionSecret())
    .update(String(exp))
    .digest('base64url');
}

export function createPrivateSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + PRIVATE_SESSION_TTL_SECONDS;
  return {
    token: `${exp}.${sign(exp)}`,
    exp,
  };
}

export function verifyPrivateSessionToken(token: unknown) {
  if (typeof token !== 'string') return false;
  const [expRaw, received] = token.split('.');
  const exp = Number(expRaw);
  if (!Number.isInteger(exp) || exp <= Math.floor(Date.now() / 1000)) return false;
  if (exp > Math.floor(Date.now() / 1000) + PRIVATE_SESSION_TTL_SECONDS + 60) return false;
  if (!received) return false;

  const expected = sign(exp);
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function readCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return '';
  const prefix = `${name}=`;
  const part = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : '';
}

export function isPrivateRequestAuthenticated(request: Request) {
  return verifyPrivateSessionToken(readCookie(request.headers.get('cookie'), PRIVATE_COOKIE_NAME));
}
