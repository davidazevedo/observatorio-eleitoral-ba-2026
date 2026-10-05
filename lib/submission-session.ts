import { createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_TTL_MS = 30 * 60 * 1000;

function secret() {
  const value = process.env.SUBMISSION_SIGNING_SECRET;
  if (!value || value.length < 32) {
    throw new Error('SUBMISSION_SIGNING_SECRET não configurado.');
  }
  return value;
}

function signature(submissionId: string, expiresAt: number) {
  return createHmac('sha256', secret())
    .update(`${submissionId}.${expiresAt}`)
    .digest('base64url');
}

export function createSubmissionSession() {
  const submissionId = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const sig = signature(submissionId, expiresAt);
  return { submissionId, sessionToken: `${expiresAt}.${sig}`, expiresAt };
}

export function verifySubmissionSession(submissionId: string, token: unknown) {
  if (typeof token !== 'string') return false;
  const [expiresRaw, received] = token.split('.');
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || expiresAt > Date.now() + SESSION_TTL_MS + 60_000) return false;
  if (!received) return false;

  const expected = signature(submissionId, expiresAt);
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return;

  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  if (!host) throw new Error('Origem inválida.');

  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error('Origem inválida.');
  }

  if (originHost !== host) throw new Error('Origem não autorizada.');
}
