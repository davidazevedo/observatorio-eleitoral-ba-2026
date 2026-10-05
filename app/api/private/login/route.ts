import { NextResponse } from 'next/server';
import {
  createPrivateSessionToken,
  PRIVATE_COOKIE_NAME,
  PRIVATE_SESSION_TTL_SECONDS,
  verifyPrivateAccessKey,
} from '@/lib/private-auth';
import { assertSameOrigin } from '@/lib/submission-session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json();
    if (!verifyPrivateAccessKey(body?.key)) {
      return NextResponse.json({ error: 'Chave de acesso inválida.' }, { status: 401 });
    }

    const { token } = createPrivateSessionToken();
    const response = NextResponse.json({ ok: true }, {
      headers: { 'cache-control': 'no-store' },
    });
    response.cookies.set(PRIVATE_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: PRIVATE_SESSION_TTL_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Não foi possível autenticar.' }, { status: 400 });
  }
}
