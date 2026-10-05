import { NextResponse } from 'next/server';
import { DOSSIER_COOKIE } from '@/lib/dossier-auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/dossie', request.url), { status: 303 });
  response.headers.set('cache-control', 'no-store');
  response.cookies.set(DOSSIER_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
