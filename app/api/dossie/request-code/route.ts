import { NextResponse } from 'next/server';
import { assertSameOrigin } from '@/lib/submission-session';
import { issueOtp, normalizeEmail, persistIssuedOtp, validEmail } from '@/lib/dossier-auth';
import { EmailProviderUnavailableError, sendDossierOtpEmail } from '@/lib/dossier-email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json();
    if (body?.website) return NextResponse.json({ ok: true, message: 'Se o endereço for válido, enviaremos um código.' });

    const email = normalizeEmail(body?.email);
    if (!validEmail(email)) {
      return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }

    const issued = await issueOtp(email);
    if (!issued.ok) {
      return NextResponse.json(
        { error: issued.reason === 'cooldown' ? 'Aguarde antes de solicitar outro código.' : 'Limite temporário atingido. Tente novamente mais tarde.', retryAfter: issued.retryAfter },
        { status: 429, headers: { 'retry-after': String(issued.retryAfter), 'cache-control': 'no-store' } },
      );
    }

    await sendDossierOtpEmail(email, issued.code);
    await persistIssuedOtp(issued.record);

    return NextResponse.json({
      ok: true,
      message: 'Se o endereço puder receber mensagens, o código foi enviado.',
      maskedEmail: maskEmail(email),
      expiresIn: 600,
    }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    if (error instanceof EmailProviderUnavailableError) {
      return NextResponse.json(
        { error: 'O envio de códigos por e-mail está em configuração. Tente novamente quando o canal estiver habilitado.' },
        { status: 503, headers: { 'cache-control': 'no-store' } },
      );
    }
    return NextResponse.json({ error: 'Não foi possível processar a solicitação agora.' }, { status: 400 });
  }
}

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  const shown = local.slice(0, Math.min(3, local.length));
  return `${shown}${'•'.repeat(Math.max(3, local.length - shown.length))}@${domain}`;
}
