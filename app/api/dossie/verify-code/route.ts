import { NextResponse } from 'next/server';
import { assertSameOrigin } from '@/lib/submission-session';
import {
  createDossierSession,
  DOSSIER_COOKIE,
  DOSSIER_SESSION_SECONDS,
  normalizeEmail,
  safeVerifiedAccessPath,
  validEmail,
  verifyOtp,
  writeDossierAccessLog,
} from '@/lib/dossier-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json();
    const email = normalizeEmail(body?.email);
    const code = typeof body?.code === 'string' ? body.code.replace(/\D/g, '').slice(0, 6) : '';
    const nextPath = safeVerifiedAccessPath(body?.next);

    if (!validEmail(email) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: 'Código inválido ou expirado.' }, { status: 401 });
    }

    const result = await verifyOtp(email, code);
    if (!result.ok) {
      return NextResponse.json({ error: 'Código inválido ou expirado.', remaining: result.remaining }, { status: 401 });
    }

    await writeDossierAccessLog(result.email);
    const response = NextResponse.json({ ok: true, redirect: nextPath }, { headers: { 'cache-control': 'no-store' } });
    response.cookies.set(DOSSIER_COOKIE, createDossierSession(result.emailHash), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: DOSSIER_SESSION_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Não foi possível confirmar o acesso.' }, { status: 400 });
  }
}
