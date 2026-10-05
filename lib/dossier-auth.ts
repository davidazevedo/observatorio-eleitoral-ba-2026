import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { get, put } from '@vercel/blob';

export const DOSSIER_COOKIE = '__Host-dossier_session';
export const DOSSIER_SESSION_SECONDS = 12 * 60 * 60;
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_MAX_REQUESTS_PER_HOUR = 5;
export const DOSSIER_NOTICE_VERSION = '2026-10-05-v1';

type OtpRecord = {
  email: string;
  emailHash: string;
  codeHash: string;
  nonce: string;
  createdAt: number;
  expiresAt: number;
  lastSentAt: number;
  attempts: number;
  hourStartedAt: number;
  hourRequests: number;
};

function secret() {
  const value = process.env.DOSSIER_AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('DOSSIER_AUTH_SECRET não configurado.');
  return value;
}

export function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.trim().toLocaleLowerCase('en-US').slice(0, 320);
}

export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function emailHash(email: string) {
  return createHmac('sha256', secret()).update(`email:${normalizeEmail(email)}`).digest('hex');
}

function otpPath(email: string) {
  return `dossier-access/otp/${emailHash(email)}.json`;
}

function codeDigest(email: string, code: string, nonce: string) {
  return createHmac('sha256', secret())
    .update(`otp:${normalizeEmail(email)}:${code}:${nonce}`)
    .digest('hex');
}

async function readOtp(email: string): Promise<OtpRecord | null> {
  try {
    const result = await get(otpPath(email), { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text()) as OtpRecord;
  } catch {
    return null;
  }
}

async function writeOtp(record: OtpRecord) {
  await put(otpPath(record.email), JSON.stringify(record), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function issueOtp(email: string) {
  const normalized = normalizeEmail(email);
  const now = Date.now();
  const previous = await readOtp(normalized);

  if (previous && now - previous.lastSentAt < OTP_RESEND_MS) {
    return { ok: false as const, reason: 'cooldown', retryAfter: Math.ceil((OTP_RESEND_MS - (now - previous.lastSentAt)) / 1000) };
  }

  let hourStartedAt = previous?.hourStartedAt || now;
  let hourRequests = previous?.hourRequests || 0;
  if (now - hourStartedAt >= 60 * 60 * 1000) {
    hourStartedAt = now;
    hourRequests = 0;
  }
  if (hourRequests >= OTP_MAX_REQUESTS_PER_HOUR) {
    return { ok: false as const, reason: 'rate_limit', retryAfter: Math.ceil((60 * 60 * 1000 - (now - hourStartedAt)) / 1000) };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const nonce = randomBytes(16).toString('hex');
  const record: OtpRecord = {
    email: normalized,
    emailHash: emailHash(normalized),
    codeHash: codeDigest(normalized, code, nonce),
    nonce,
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    lastSentAt: now,
    attempts: 0,
    hourStartedAt,
    hourRequests: hourRequests + 1,
  };
  return { ok: true as const, code, record };
}

export async function persistIssuedOtp(record: OtpRecord) {
  await writeOtp(record);
}

type RateRecord = { startedAt: number; count: number };

export async function checkDossierIpRateLimit(ip: string) {
  const now = Date.now();
  const key = createHmac('sha256', secret()).update(`ip:${ip || 'unknown'}`).digest('hex');
  const pathname = `dossier-access/rate/${key}.json`;
  let record: RateRecord = { startedAt: now, count: 0 };
  try {
    const result = await get(pathname, { access: 'private', useCache: false });
    if (result?.statusCode === 200) {
      record = JSON.parse(await new Response(result.stream).text()) as RateRecord;
    }
  } catch {}

  if (now - record.startedAt >= 60 * 60 * 1000) record = { startedAt: now, count: 0 };
  if (record.count >= 12) {
    return { ok: false as const, retryAfter: Math.ceil((60 * 60 * 1000 - (now - record.startedAt)) / 1000) };
  }
  record.count += 1;
  await put(pathname, JSON.stringify(record), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return { ok: true as const };
}

function equalHex(a: string, b: string) {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function verifyOtp(email: string, code: string) {
  const normalized = normalizeEmail(email);
  const record = await readOtp(normalized);
  const now = Date.now();
  if (!record || record.expiresAt < now || record.attempts >= OTP_MAX_ATTEMPTS) return { ok: false as const };

  const received = codeDigest(normalized, code, record.nonce);
  const valid = equalHex(received, record.codeHash);
  if (!valid) {
    record.attempts += 1;
    await writeOtp(record);
    return { ok: false as const, remaining: Math.max(0, OTP_MAX_ATTEMPTS - record.attempts) };
  }

  record.expiresAt = 0;
  await writeOtp(record);
  return { ok: true as const, email: normalized, emailHash: record.emailHash };
}

function signSession(payload: string) {
  return createHmac('sha256', secret()).update(`session:${payload}`).digest('base64url');
}

export function createDossierSession(emailHashValue: string) {
  const exp = Math.floor(Date.now() / 1000) + DOSSIER_SESSION_SECONDS;
  const nonce = randomBytes(18).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ v: 1, exp, eh: emailHashValue, n: nonce })).toString('base64url');
  return `${payload}.${signSession(payload)}`;
}

export function verifyDossierSession(token: unknown) {
  if (typeof token !== 'string') return false;
  const [payload, received] = token.split('.');
  if (!payload || !received) return false;
  const expected = signSession(payload);
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return Number.isInteger(parsed.exp) && Number(parsed.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function writeDossierAccessLog(email: string) {
  const now = new Date();
  const retention = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const eh = emailHash(email);
  const record = {
    email: normalizeEmail(email),
    emailHash: eh,
    accessedAt: now.toISOString(),
    privacyNoticeVersion: DOSSIER_NOTICE_VERSION,
    purpose: 'controle_de_acesso_dossie',
    marketing: false,
    retentionUntil: retention.toISOString(),
  };
  await put(`dossier-access/logs/${now.toISOString().replace(/[:.]/g, '-')}-${eh.slice(0, 16)}.json`, JSON.stringify(record), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
}
