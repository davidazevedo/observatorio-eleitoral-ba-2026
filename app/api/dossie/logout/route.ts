import { NextResponse } from 'next/server';
import { DOSSIER_COOKIE } from '@/lib/dossier-auth';

export async function POST() {
  const response = NextResponse.json({ ok: true }, { headers: { 'cache-control': 'no-store' } });
  response.cookies.set(DOSSIER_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
