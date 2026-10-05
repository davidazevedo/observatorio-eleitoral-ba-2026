import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { assertSameOrigin, verifySubmissionSession } from '@/lib/submission-session';

export const runtime = 'nodejs';

const allowedContentTypes = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/webm',
];

function validId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || '{}') as { submissionId?: string; sessionToken?: string };
        if (
          !validId(payload.submissionId) ||
          !verifySubmissionSession(payload.submissionId, payload.sessionToken) ||
          !pathname.startsWith(`evidence/${payload.submissionId}/`)
        ) {
          throw new Error('Sessão ou caminho de upload inválido.');
        }

        return {
          allowedContentTypes,
          maximumSizeInBytes: 1024 * 1024 * 1024,
          tokenPayload: JSON.stringify({ submissionId: payload.submissionId }),
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // O arquivo permanece privado e pendente de triagem. A consolidação ocorre em /api/submissions.
      },
    });
    return NextResponse.json(jsonResponse, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha no upload.' }, { status: 400 });
  }
}
