import { NextResponse } from 'next/server';
import { PRIVATE_COOKIE_NAME } from '@/lib/private-auth';

export async function POST() {
  const response = NextResponse.json({ ok: true }, {
    headers: { 'cache-control': 'no-store' },
  });
  response.cookies.set(PRIVATE_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
