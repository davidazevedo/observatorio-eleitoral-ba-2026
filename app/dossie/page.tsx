import Link from 'next/link';
import { sourceCatalog } from '@/lib/content';
import { investigationSummary } from '@/lib/investigation-summary';

const official = (id: string) => sourceCatalog.find((s) => s.id === id)!;

export const metadata = {
  title: 'Dossiê público | Observatório Eleitoral Bahia 2026',
  description: 'Resumo público do dossiê: fatos oficiais, cronologia, fundamentos gerais, fontes e questões ainda sem resposta.',
};

export default function DossiePage() {
  return (
    <main>
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <nav className="nav"><Link href="/denuncia">A denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/dossie">Dossiê</Link></nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="dossier-public-hero">
        <div className="container">
          <p className="eyebrow light">DOSSIÊ PÚBLICO · RESUMO VERIFICÁVEL</p>
          <h1>O que já sabemos.<br/><em>O que ainda precisa ser explicado.</em></h1>
          <p>Esta página mantém públicos os fatos oficiais, a cronologia, os fundamentos gerais e as perguntas ainda sem resposta. A estratégia analítica detalhada fica em uma camada de acesso verificado.</p>
        </div>
      </section>

      <section className="container dossier-public-layout">
        <aside className="dossier-nav">
          <strong>Neste resumo</strong>
          <a href="#sumario">Sumário</a>
          <a href="#fatos">Fatos públicos</a>
          <a href="#questoes">Questões abertas</a>
          <a href="#fundamentos">Fundamentos gerais</a>
          <a href="#pedidos">O que se pede</a>
          <a href="#analitico">Dossiê analítico</a>
        </aside>

        <article className="dossier-document public-dossier-document">
          <section id="sumario">
            <p className="eyebrow">SUMÁRIO EXECUTIVO</p>
            <h2>Uma auditoria cidadã baseada em cronologia e documentos.</h2>
            <p>O projeto busca verificar a regularidade da destinação, transferência, contratação e execução de recursos públicos destinados a municípios baianos no contexto das Eleições 2026 e identificar, quando houver lastro documental, fatos que mereçam apuração pelas autoridades competentes.</p>
            <p><strong>Não partimos da culpa. Partimos da obrigação de verificar.</strong> Anúncio de investimento, celebração de convênio, obra pública ou proximidade temporal com a eleição não constituem ilícito por si sós.</p>
          </section>

          <section id="fatos">
            <p className="eyebrow">FATOS PÚBLICOS</p>
            <h2>Não começamos com uma acusação. Começamos com datas.</h2>
            <div className="public-fact-timeline">
              <article>
                <time>11 JUN 2026</time><strong>R$ 1,7 bi</strong>
                <p>Pacote estadual anunciado para aproximadamente 200 cidades, com convênios, ordens de serviço, licitações e outros atos.</p>
                <a href={official('govba-1700').href} target="_blank" rel="noreferrer">Fonte oficial ↗</a>
              </article>
              <article>
                <time>03 JUL 2026</time><strong>≈ R$ 6 bi</strong>
                <p>Mais de cem atos anunciados para mais de 160 municípios.</p>
                <a href={official('govba-6000').href} target="_blank" rel="noreferrer">Fonte oficial ↗</a>
              </article>
              <article>
                <time>04 JUL 2026</time><strong>MARCO DE AUDITORIA</strong>
                <p>Data relevante para as restrições aplicáveis às transferências voluntárias analisadas, sem generalizar esse intervalo para toda e qualquer conduta eleitoral.</p>
                <a href={official('transferegov-21').href} target="_blank" rel="noreferrer">Transferegov ↗</a>
              </article>
              <article>
                <time>04 OUT 2026</time><strong>1º TURNO</strong>
                <p>O resultado eleitoral compõe o contexto processual. Não é usado como evidência de irregularidade.</p>
                <a href={official('tse-resultado-ba').href} target="_blank" rel="noreferrer">TSE ↗</a>
              </article>
            </div>
          </section>

          <section id="questoes">
            <p className="eyebrow">QUESTÕES AINDA SEM RESPOSTA</p>
            <h2>O anúncio é só o início da trilha.</h2>
            <div className="open-questions">
              <div><span>01</span><p>Quando ocorreu a movimentação efetiva de cada recurso?</p></div>
              <div><span>02</span><p>Qual instrumento jurídico sustentou cada operação?</p></div>
              <div><span>03</span><p>Quem foi contratado, quanto recebeu e o que foi executado?</p></div>
              <div><span>04</span><p>Quando houve exceção à vedação, quais documentos demonstram seus requisitos?</p></div>
              <div><span>05</span><p>Existe algum nexo eleitoral documentável ou apenas correlação temporal?</p></div>
            </div>
            <div className="public-chain"><span>Anunciar</span><b>≠</b><span>transferir</span><b>≠</b><span>pagar</span><b>≠</b><span>executar</span><b>≠</b><span>agir com finalidade eleitoral</span></div>
          </section>

          <section id="fundamentos">
            <p className="eyebrow">FUNDAMENTOS GERAIS</p>
            <h2>Regras diferentes exigem provas diferentes.</h2>
            <p>Conforme os fatos corroborados, podem ser pertinentes as regras de condutas vedadas a agentes públicos, captação ilícita de sufrágio, abuso de poder político ou econômico e normas próprias de contratação e execução da despesa. O portal não mistura esses regimes nem trata um deles como consequência automática do outro.</p>
            <div className="inline-actions">
              <a className="button secondary" href={official('tse-lei-eleicoes').href} target="_blank" rel="noreferrer">Lei das Eleições ↗</a>
              <a className="button secondary" href={official('tse-lc64').href} target="_blank" rel="noreferrer">LC nº 64/1990 ↗</a>
              <Link className="button secondary" href="/fontes">Catálogo de fontes</Link>
            </div>
          </section>

          <section id="pedidos">
            <p className="eyebrow">O QUE SE PEDE ÀS AUTORIDADES</p>
            <h2>Apuração antes de conclusão.</h2>
            <ol className="number-list">
              <li>Auditoria das transferências, pagamentos e desbloqueios no recorte pertinente.</li>
              <li>Verificação documental das exceções legais eventualmente invocadas.</li>
              <li>Obtenção de processos, contratos, medições, ordens bancárias e registros de execução inacessíveis ao cidadão.</li>
              <li>Cruzamentos eleitorais somente quando houver pertinência documental.</li>
              <li>Encaminhamento dos fatos ao órgão competente conforme a natureza do recurso e do possível ilícito.</li>
            </ol>
            <Link className="text-link" href="/denuncia">Ler a representação pública completa →</Link>
          </section>

          <section id="analitico" className="dossier-gate-section">
            <div className="gate-visual" aria-hidden="true"><span>ANÁLISE</span><b>{investigationSummary.priorityMunicipalities}</b><small>municípios no universo prioritário</small></div>
            <div>
              <p className="eyebrow">DOSSIÊ ANALÍTICO</p>
              <h2>A investigação vai além do que publicamos nesta página.</h2>
              <p>A versão analítica reúne hoje {investigationSummary.priorityMunicipalities} municípios no universo prioritário ({investigationSummary.housingCoreMunicipalities} núcleo + {investigationSummary.expansionMunicipalities} expansão), {investigationSummary.p0ClassifiedMunicipalities}/{investigationSummary.p0TotalMunicipalities} P0 classificados, {investigationSummary.centralEvidence} evidências centrais e cobertura {investigationSummary.ireceCoveredMunicipalities}/{investigationSummary.ireceOfficialMunicipalities} em Irecê. A Bahia inteira, com {investigationSummary.statewideMunicipalities} municípios, permanece como escopo estadual potencial.</p>
              <p className="gate-privacy">Para continuar, confirme seu e-mail. Ele será usado exclusivamente para autenticação e registro da consulta; não será associado a denúncias nem utilizado para marketing.</p>
              <Link className="button button-gold large" href="/dossie/acesso">Acessar Dossiê Analítico</Link>
            </div>
          </section>
        </article>
      </section>

      <footer className="political-footer"><div className="container footer-top"><div><strong>Observatório Eleitoral Bahia 2026</strong><p>Resumo público verificável e sujeito a correção.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><p><Link href="/denuncia">Denúncia</Link> · <Link href="/casos">Casos</Link> · <Link href="/fontes">Fontes</Link> · <Link href="/correcoes">Correções</Link></p></div></footer>
    </main>
  );
}
