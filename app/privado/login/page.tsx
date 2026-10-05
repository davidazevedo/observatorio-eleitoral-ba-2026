'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivateLoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/private/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key: String(form.get('key') || '') }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Acesso negado.');
      router.replace('/privado');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Acesso negado.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="private-login-page">
      <section className="private-login-card">
        <div className="private-seal">OE</div>
        <p className="eyebrow light">ÁREA RESERVADA · DADOS SENSÍVEIS</p>
        <h1>Painel de Inteligência</h1>
        <p>Dados consolidados de submissões, evidências, relatórios e indicadores internos. Acesso restrito.</p>
        <form onSubmit={login}>
          <label>
            Chave privada
            <input name="key" type="password" autoComplete="current-password" required autoFocus />
          </label>
          <button className="button button-gold" type="submit" disabled={busy}>
            {busy ? 'Validando…' : 'Acessar painel'}
          </button>
          {error ? <p className="status error" role="alert">{error}</p> : null}
        </form>
        <small>A sessão é armazenada em cookie HttpOnly, Secure e SameSite=Strict e expira em 12 horas.</small>
      </section>
    </main>
  );
}
