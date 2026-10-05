import Link from 'next/link';
import DossierAccessClient from './DossierAccessClient';

export const metadata = {
  title: 'Acesso ao Dossiê Analítico | Observatório Eleitoral Bahia 2026',
  robots: { index: false, follow: false, nocache: true },
};

export default function DossierAccessPage() {
  return (
    <main className="dossier-access-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/">
            <span className="brand-mark">OE</span>
            <span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span>
          </Link>
          <Link className="text-link access-back" href="/dossie">← Voltar ao resumo público</Link>
        </div>
      </header>
      <section className="container dossier-access-layout">
        <div className="access-context">
          <p className="eyebrow light">DOSSIÊ ANALÍTICO · ACESSO CONTROLADO</p>
          <h2>A investigação vai além do que publicamos na página aberta.</h2>
          <p>A versão analítica reúne a matriz municipal, critérios de priorização, metodologia probatória, trilhas de recursos, sinais de alerta, cruzamentos e notas de apuração.</p>
          <ul>
            <li>controle de acesso separado do canal de denúncias;</li>
            <li>e-mail usado apenas para autenticação;</li>
            <li>nenhuma inscrição automática em mailing;</li>
            <li>sessão protegida e com expiração.</li>
          </ul>
        </div>
        <DossierAccessClient />
      </section>
    </main>
  );
}
