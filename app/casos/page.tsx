import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import CasesExplorer from './CasesExplorer';
import { publicCases } from '@/lib/cases';
import { sourceCatalog } from '@/lib/content';
import { investigationSummary } from '@/lib/investigation-summary';
import { DOSSIER_COOKIE, verifyDossierSession } from '@/lib/dossier-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = {
  title: 'Casos e ocorrências | Observatório Eleitoral Bahia 2026',
  description:
    'Registro verificado de fatos, marcos normativos e ocorrências documentadas que integram a auditoria cidadã do Observatório Eleitoral Bahia 2026.',
  robots: { index: false, follow: false, nocache: true },
};


export default async function CasesPage() {
  const store = await cookies();
  const token = store.get(DOSSIER_COOKIE)?.value || '';
  if (!verifyDossierSession(token)) redirect('/dossie/acesso?next=%2Fcasos');

  return (
    <main className="cases-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/">
            <span className="brand-mark">OE</span>
            <span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span>
          </Link>
          <nav className="nav" aria-label="Principal">
            <Link href="/denuncia">A denúncia</Link>
            <Link href="/casos">Casos</Link>
            <Link href="/fontes">Fontes</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
          <form action="/api/dossie/logout" method="post"><button className="button compact analysis-logout">Encerrar acesso</button></form>
        </div>
      </header>

      <section className="cases-hero">
        <div className="container">
          <p className="eyebrow light">REGISTRO VERIFICADO · AUDITORIA CIDADÃ</p>
          <h1>Casos, marcos e ocorrências<br/><em>que podem ser conferidos.</em></h1>
          <p>
            Este registro não é uma lista de acusados. É uma fila verificada de fatos documentados, referências normativas e prioridades de auditoria que qualquer pessoa pode conferir nas fontes associadas.
          </p>
        </div>
      </section>

      <section className="container cases-stats" aria-label="Resumo do registro">
        <article><span>UNIVERSO PRIORITÁRIO</span><strong>{investigationSummary.priorityMunicipalities}</strong><p>{investigationSummary.housingCoreMunicipalities} núcleo + {investigationSummary.expansionMunicipalities} expansão</p></article>
        <article><span>P0 CLASSIFICADOS</span><strong>{investigationSummary.p0ClassifiedMunicipalities}/{investigationSummary.p0TotalMunicipalities}</strong><p>{investigationSummary.p0ClassificationPercent}% da triagem substantiva</p></article>
        <article><span>EVIDÊNCIAS CENTRAIS</span><strong>{investigationSummary.centralEvidence}</strong><p>fatos centrais auditáveis; não número de ilícitos</p></article>
        <article><span>IRECÊ</span><strong>{investigationSummary.ireceCoveredMunicipalities}/{investigationSummary.ireceOfficialMunicipalities}</strong><p>cobertura territorial selecionada</p></article>
      </section>

      <section className="container cases-intro">
        <div>
          <p className="eyebrow">COMO LER ESTA PÁGINA</p>
          <h2>O status descreve o estágio da apuração, não a culpa de alguém.</h2>
        </div>
        <p>
          Itens L0 e L1 permanecem fora do registro público. Um item pode ser relevante para auditoria e, ao final, revelar-se totalmente regular. A publicação serve para tornar a pergunta auditável e mostrar as fontes utilizadas.
        </p>
      </section>

      <div className="container">
        <CasesExplorer cases={publicCases} sources={sourceCatalog} />
      </div>

      <section className="container cases-next">
        <div>
          <p className="eyebrow">COBERTURA TERRITORIAL</p>
          <h2>Do universo prioritário de {investigationSummary.priorityMunicipalities} para a matriz estadual de {investigationSummary.statewideMunicipalities} municípios.</h2>
          <p>O recorte atual está consolidado em {investigationSummary.housingCoreMunicipalities} municípios do núcleo original + {investigationSummary.expansionMunicipalities} da expansão. A matriz estadual poderá ser preenchida gradualmente com instrumento, pagamento, contrato, fornecedor, ordem de serviço, medição, execução física e fundamento de eventual exceção eleitoral.</p>
        </div>
        <div className="actions">
          <Link className="button" href="/dossie#analitico">Conhecer o dossiê analítico</Link>
          <Link className="button secondary" href="/enviar">Enviar fato ou evidência</Link>
        </div>
      </section>

      <footer className="political-footer">
        <div className="container footer-top">
          <div><strong>Observatório Eleitoral Bahia 2026</strong><p>Registro público sujeito a atualização, correção e contraditório.</p></div>
          <div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div>
          <p><Link href="/denuncia">Denúncia</Link> · <Link href="/dossie">Dossiê</Link> · <Link href="/correcoes">Correções</Link> · <Link href="/atualizacoes">Atualizações</Link></p>
        </div>
      </footer>
    </main>
  );
}
