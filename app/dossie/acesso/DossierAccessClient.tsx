'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DossierAccessClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/dossie/request-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: String(data.get('email') || ''), website: String(data.get('website') || '') }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Não foi possível enviar o código.');
      setEmail(String(data.get('email') || ''));
      setMaskedEmail(body.maskedEmail || '');
      setMessage(body.message || 'Código enviado.');
      setPhase('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar o código.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/dossie/verify-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || 'Código inválido ou expirado.');
      router.replace(body.redirect || '/dossie/analise');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido ou expirado.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dossier-access-card">
      {phase === 'email' ? (
        <>
          <span className="access-lock" aria-hidden="true">⌁</span>
          <p className="eyebrow">ACESSO AO DOSSIÊ ANALÍTICO</p>
          <h1>Confirme seu e-mail para continuar.</h1>
          <p className="access-intro">
            O endereço será usado exclusivamente para autenticar o acesso e registrar a data da consulta. Ele não será associado automaticamente a denúncias e não será usado para marketing.
          </p>
          <form onSubmit={requestCode}>
            <label>E-mail
              <input name="email" type="email" autoComplete="email" required placeholder="voce@exemplo.com" />
            </label>
            <input className="honey" name="website" tabIndex={-1} autoComplete="off" />
            <button className="button button-gold large" type="submit" disabled={busy}>
              {busy ? 'Enviando…' : 'Receber código por e-mail'}
            </button>
          </form>
          <p className="access-privacy">Sem newsletter automática. Sem associação com o canal de denúncias. Sessão de acesso: 12 horas.</p>
        </>
      ) : (
        <>
          <span className="access-lock" aria-hidden="true">✉</span>
          <p className="eyebrow">VERIFIQUE SEU E-MAIL</p>
          <h1>Digite o código de 6 dígitos.</h1>
          <p className="access-intro">Enviamos um código para <strong>{maskedEmail}</strong>. Ele expira em 10 minutos.</p>
          <form onSubmit={verifyCode}>
            <label>Código de acesso
              <input
                className="otp-input"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
                placeholder="000000"
              />
            </label>
            <button className="button button-gold large" type="submit" disabled={busy || code.length !== 6}>
              {busy ? 'Confirmando…' : 'Confirmar acesso'}
            </button>
          </form>
          <button className="access-text-button" type="button" onClick={() => { setPhase('email'); setCode(''); setError(''); }}>
            Usar outro e-mail
          </button>
        </>
      )}
      {message && phase === 'code' ? <p className="status">{message}</p> : null}
      {error ? <p className="status error" role="alert">{error}</p> : null}
    </div>
  );
}
