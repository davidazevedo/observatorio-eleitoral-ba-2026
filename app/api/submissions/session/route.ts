import { NextResponse } from 'next/server';
import { assertSameOrigin, createSubmissionSession } from '@/lib/submission-session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const session = createSubmissionSession();
    return NextResponse.json(session, {
      headers: {
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Não foi possível iniciar a sessão.' },
      { status: 400 },
    );
  }
}
