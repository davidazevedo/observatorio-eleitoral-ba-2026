import Link from 'next/link';
import DossierAccessClient from './DossierAccessClient';
import { safeVerifiedAccessPath } from '@/lib/dossier-auth';

export const metadata = {
  title: 'Acesso ao Dossiê Analítico | Observatório Eleitoral Bahia 2026',
  robots: { index: false, follow: false, nocache: true },
};

export default async function DossierAccessPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = safeVerifiedAccessPath(nextValue);

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
          <p className="eyebrow light">CONTEÚDO RESERVADO · ACESSO CONTROLADO</p>
          <h2>Uma única verificação libera a área reservada por 12 horas.</h2>
          <p>A mesma sessão verificada dá acesso ao Dossiê Analítico, Casos e Atualizações reservadas. Após a confirmação, você será levado à página solicitada.</p>
          <ul>
            <li>controle de acesso separado do canal de denúncias;</li>
            <li>e-mail usado apenas para autenticação;</li>
            <li>nenhuma inscrição automática em mailing;</li>
            <li>sessão protegida e com expiração.</li>
          </ul>
        </div>
        <DossierAccessClient nextPath={nextPath} />
      </section>
    </main>
  );
}
