import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { DOSSIER_COOKIE, verifyDossierSession } from '@/lib/dossier-auth';
import { evidenceLevels, matrixFields, redFlags } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata = {
  title: 'Dossiê Analítico | Observatório Eleitoral Bahia 2026',
  robots: { index: false, follow: false, nocache: true },
};

export default async function DossierAnalysisPage() {
  const store = await cookies();
  const token = store.get(DOSSIER_COOKIE)?.value || '';
  if (!verifyDossierSession(token)) redirect('/dossie/acesso');

  return (
    <main className="analysis-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/">
            <span className="brand-mark">OE</span>
            <span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span>
          </Link>
          <nav className="nav"><Link href="/denuncia">Denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link></nav>
          <form action="/api/dossie/logout" method="post"><button className="button compact analysis-logout">Encerrar acesso</button></form>
        </div>
      </header>

      <section className="analysis-hero">
        <div className="container">
          <p className="eyebrow light">DOSSIÊ ANALÍTICO · ACESSO VERIFICADO</p>
          <h1>Onde a pergunta pública vira <em>método de investigação.</em></h1>
          <p>Esta camada reúne critérios, matriz, trilhas e sinais de alerta. Nenhum indicador abaixo constitui, sozinho, prova de ilícito.</p>
        </div>
      </section>

      <section className="container analysis-layout">
        <aside className="dossier-nav analysis-nav">
          <strong>Navegação</strong>
          <a href="#metodo">Método probatório</a>
          <a href="#niveis">Níveis de evidência</a>
          <a href="#matriz">Matriz municipal</a>
          <a href="#alertas">Sinais de alerta</a>
          <a href="#trilhas">Trilhas de recursos</a>
          <a href="#cruzamentos">Cruzamentos</a>
          <a href="#limites">Limites da análise</a>
        </aside>

        <article className="dossier-document analysis-document">
          <section id="metodo">
            <p className="eyebrow">MÉTODO PROBATÓRIO</p>
            <h2>Reconstruir antes de concluir.</h2>
            <p>A unidade de análise não é o anúncio político. É a operação documentável: origem, instrumento, transferência efetiva, contratação, fornecedor, pagamento, execução física e, somente depois, eventual contexto eleitoral.</p>
            <div className="analysis-flow">
              {['RECURSO','INSTRUMENTO','TRANSFERÊNCIA','CONTRATO','FORNECEDOR','EXECUÇÃO','CONTEXTO ELEITORAL'].map((item,index)=><span key={item}><b>{String(index+1).padStart(2,'0')}</b>{item}</span>)}
            </div>
          </section>

          <section id="niveis">
            <p className="eyebrow">ESTADO PROBATÓRIO</p>
            <h2>Denunciar não transforma um relato em fato.</h2>
            <p>Verificar é o que transforma uma pista em evidência. A classificação indica o estágio da apuração e pode regredir quando surgir informação contraditória.</p>
            <div className="evidence-ladder">
              {evidenceLevels.map(([level,title,desc],index)=><div className={`ladder-step ladder-${level.toLowerCase()}`} key={level}><span>{level}</span><div><strong>{title}</strong><p>{desc}</p></div>{index < evidenceLevels.length-1 ? <i>↓</i> : null}</div>)}
            </div>
          </section>

          <section id="matriz">
            <p className="eyebrow">MATRIZ DOS 417 MUNICÍPIOS</p>
            <h2>Os campos que permitem comparar operações.</h2>
            <p>A matriz organiza informações financeiras, contratuais, físicas e eleitorais sem atribuir culpa automática a município, gestor ou fornecedor.</p>
            <div className="tag-cloud analysis-tags">{matrixFields.map((field)=><span key={field}>{field}</span>)}</div>
          </section>

          <section id="alertas">
            <p className="eyebrow">SINAIS DE ALERTA</p>
            <h2>Critérios de prioridade, não veredictos.</h2>
            <ul className="check-list">{redFlags.map((flag)=><li key={flag}>{flag}</li>)}</ul>
          </section>

          <section id="trilhas">
            <p className="eyebrow">TRILHAS DE RECURSOS</p>
            <h2>O que precisa encaixar cronologicamente.</h2>
            <div className="investigation-chain">
              <article><b>01</b><h3>Anúncio</h3><p>O que foi comunicado publicamente e em qual data.</p></article>
              <article><b>02</b><h3>Instrumento</h3><p>Convênio, termo, processo, plano de trabalho ou ato equivalente.</p></article>
              <article><b>03</b><h3>Movimentação</h3><p>Empenho, liquidação, transferência, desbloqueio e pagamento efetivo.</p></article>
              <article><b>04</b><h3>Execução</h3><p>Ordem de serviço, cronograma, medição, fotos e resultado físico.</p></article>
            </div>
          </section>

          <section id="cruzamentos">
            <p className="eyebrow">CRUZAMENTOS</p>
            <h2>Relações que merecem verificação documental.</h2>
            <p>Fornecedores públicos, quadro societário, prestadores eleitorais, documentos fiscais, doações, contratos repetidos e distribuição territorial podem ser cruzados quando houver pertinência factual. A coincidência de nomes ou relações políticas, isoladamente, não constitui prova.</p>
          </section>

          <section id="limites">
            <p className="eyebrow">LIMITES E SALVAGUARDAS</p>
            <h2>A investigação também precisa saber onde parar.</h2>
            <ul className="check-list">
              <li>Não inferir finalidade eleitoral apenas pela data de uma obra ou transferência.</li>
              <li>Não tratar alinhamento partidário como prova de irregularidade.</li>
              <li>Não publicar relatos L0/L1 com identificação acusatória.</li>
              <li>Preservar contraditório, correções e fontes primárias.</li>
              <li>Separar possíveis ilícitos eleitorais, administrativos, cíveis e penais conforme competência.</li>
            </ul>
          </section>
        </article>
      </section>
    </main>
  );
}
