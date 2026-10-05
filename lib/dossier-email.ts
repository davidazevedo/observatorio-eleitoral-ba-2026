export class EmailProviderUnavailableError extends Error {}

export async function sendDossierOtpEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DOSSIER_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new EmailProviderUnavailableError('Provedor transacional ainda não configurado.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Seu código de acesso — Observatório Eleitoral Bahia 2026',
      html: `<!doctype html><html><body style="margin:0;background:#f1ede4;font-family:Arial,sans-serif;color:#17211d">
        <div style="max-width:560px;margin:32px auto;background:#fff;padding:36px;border-top:6px solid #173d33">
          <div style="font-size:12px;letter-spacing:.12em;color:#6d765f">OBSERVATÓRIO ELEITORAL BAHIA 2026</div>
          <h1 style="font-size:26px;margin:22px 0 8px">Seu código de acesso</h1>
          <p>Você solicitou acesso ao Dossiê Analítico.</p>
          <div style="font-size:38px;font-weight:700;letter-spacing:.16em;margin:28px 0;color:#8b652e">${code.slice(0,3)} ${code.slice(3)}</div>
          <p>Este código expira em <strong>10 minutos</strong>.</p>
          <p style="color:#68736d;font-size:13px">Se você não fez esta solicitação, ignore esta mensagem. O endereço utilizado aqui serve somente para autenticar o dossiê e não será inscrito automaticamente em mailing.</p>
          <hr style="border:0;border-top:1px solid #ddd7cb;margin:28px 0">
          <p style="font-size:12px;color:#68736d">Idealização e coordenação: <strong>David Pereira de Azevedo</strong></p>
        </div>
      </body></html>`,
      text: `Observatório Eleitoral Bahia 2026\n\nSeu código de acesso ao Dossiê Analítico: ${code}\n\nO código expira em 10 minutos. Se você não solicitou este acesso, ignore a mensagem.\n\nIdealização e coordenação: David Pereira de Azevedo`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Falha no envio transacional: ${response.status} ${detail.slice(0, 180)}`);
  }
}
