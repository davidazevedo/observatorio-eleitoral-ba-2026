import Link from 'next/link';
import { evidenceLevels, matrixFields, redFlags, sourceCatalog } from '@/lib/content';

const official = (id: string) => sourceCatalog.find((s) => s.id === id)!;

export const metadata = {
  title: 'Dossiê | Observatório Eleitoral Bahia 2026',
  description: 'Texto-base, fatos públicos, hipóteses investigativas, fundamentos jurídicos e matriz probatória do Observatório Eleitoral Bahia 2026.',
};

export default function DossiePage() {
  return (
    <main>
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <nav className="nav"><Link href="/dossie">Dossiê</Link><Link href="/fontes">Fontes</Link><Link href="/privacidade">Privacidade</Link></nav>
          <Link className="button compact" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="container form-hero dossier-hero">
        <p className="eyebrow">DOSSIÊ PÚBLICO · BAHIA 2026 · VERSÃO DE TRABALHO</p>
        <h1>A Bahia merece respostas baseadas em <em>documentos, cronologia e nexo.</em></h1>
        <p className="lead">Este documento organiza fatos públicos, hipóteses de investigação e uma metodologia verificável. Ele não declara previamente a existência de compra de votos, fraude contratual ou abuso de poder.</p>
      </section>

      <section className="container dossier-grid">
        <aside className="dossier-nav">
          <strong>Neste dossiê</strong>
          <a href="#sumario">Sumário</a><a href="#fatos">Fatos públicos</a><a href="#questao">Questão investigativa</a>
          <a href="#direito">Enquadramentos</a><a href="#metodo">Método</a><a href="#matriz">Matriz</a>
          <a href="#alertas">Sinais de alerta</a><a href="#pedidos">Pedidos</a><a href="#prazo">Contexto processual</a>
        </aside>

        <article className="dossier-document">
          <section id="sumario">
            <p className="eyebrow">SUMÁRIO EXECUTIVO</p>
            <h2>O que se pretende apurar</h2>
            <p>Requer-se a apuração da regularidade da destinação, transferência, contratação e execução de recursos públicos estaduais e, quando aplicável, federais, destinados a municípios baianos no contexto das Eleições 2026, bem como de eventual utilização eleitoralmente indevida de bens, serviços, contratos, obras, benefícios ou estruturas custeadas com recursos públicos.</p>
            <p>O trabalho parte da hipótese de que a combinação entre transferências de grande materialidade, proximidade do período eleitoral e relatos locais pode justificar uma auditoria aprofundada. Essa hipótese <strong>não equivale a conclusão de ilícito</strong>. Cada ocorrência deve ser reconstruída documentalmente e submetida a contraditório e verificação independente.</p>
          </section>

          <section id="fatos">
            <p className="eyebrow">1. FATOS PÚBLICOS JÁ CONFIRMADOS</p>
            <h2>O ponto de partida documental</h2>
            <div className="fact-list">
              <div><strong>11/06/2026</strong><p>O Governo da Bahia anunciou mais de <b>R$ 1,7 bilhão</b> em ações para 200 cidades, incluindo 271 convênios, 24 ordens de serviço, 56 licitações e três acordos consorciais.</p><a href={official('govba-1700').href} target="_blank" rel="noreferrer">Fonte oficial ↗</a></div>
              <div><strong>03/07/2026</strong><p>O Governo da Bahia anunciou aproximadamente <b>R$ 6 bilhões</b>, mais de cem atos e benefício direto a mais de 160 municípios. O anúncio ocorreu na véspera do início do período de vedação das transferências voluntárias.</p><a href={official('govba-6000').href} target="_blank" rel="noreferrer">Fonte oficial ↗</a></div>
              <div><strong>04/07 a 04/10/2026</strong><p>A orientação eleitoral da PGE-BA registra impedimento ao repasse financeiro de transferências voluntárias do Estado aos municípios nesse período, ressalvadas as exceções previstas na legislação.</p><a href={official('pge-defeso').href} target="_blank" rel="noreferrer">PGE-BA ↗</a></div>
              <div><strong>04/10/2026</strong><p>O primeiro turno foi realizado. Em 5 de outubro, o TSE informou a reeleição de Jerônimo Rodrigues para o Governo da Bahia com 55,80% dos votos válidos. O resultado é contexto processual, não elemento probatório sobre os fatos investigados.</p><a href={official('tse-resultado-ba').href} target="_blank" rel="noreferrer">TSE ↗</a></div>
            </div>
          </section>

          <section id="questao">
            <p className="eyebrow">2. QUESTÃO INVESTIGATIVA CENTRAL</p>
            <h2>O que deve ser perguntado em cada transferência</h2>
            <p>A pergunta tecnicamente mais relevante não é apenas se um convênio foi assinado antes da eleição. É: <strong>quando ocorreu a transferência efetiva ou o desbloqueio do recurso e qual documentação demonstra a legalidade daquela movimentação?</strong></p>
            <p>O Comunicado nº 21/2026 do Transferegov registra, para as transferências federais, que a exceção no período de defeso exige cumulativamente obrigação formal preexistente, cronograma prefixado e início da execução física anterior ao período vedado. A documentação a buscar inclui instrumento, plano de trabalho, ordem de serviço, cronograma, medições, fotos georreferenciáveis e outros registros materiais.</p>
            <a className="source-link" href={official('transferegov-21').href} target="_blank" rel="noreferrer">Comunicado nº 21/2026 — Transferegov ↗</a>
          </section>

          <section id="direito">
            <p className="eyebrow">3. ENQUADRAMENTOS QUE PODEM SER EXAMINADOS</p>
            <h2>Hipóteses jurídicas permanecem separadas</h2>
            <div className="legal-theories">
              <div><h3>Condutas vedadas — art. 73</h3><p>Uso de bens, serviços, recursos e estrutura pública em situações que possam comprometer a igualdade de oportunidades. Inclui a regra sobre transferências voluntárias e suas exceções.</p></div>
              <div><h3>Captação ilícita de sufrágio — art. 41-A</h3><p>Exige vantagem pessoal oferecida, prometida ou entregue ao eleitor com finalidade de obter voto. Dinheiro, produto, serviço, emprego ou função podem ser relevantes; é indispensável demonstrar finalidade eleitoral e vínculo probatório.</p></div>
              <div><h3>Abuso de poder político/econômico — LC 64/1990</h3><p>Pode ser investigado quando recursos, prerrogativas ou posição pública são empregados de modo grave para beneficiar candidatura. O TSE exige prova robusta e nexo de benefício eleitoral.</p></div>
              <div><h3>Contratação e execução da despesa</h3><p>Superfaturamento, fraude, desvio, execução fictícia ou outras irregularidades administrativas e penais têm requisitos próprios e podem envolver órgãos de controle e ramos distintos do Ministério Público.</p></div>
            </div>
            <p className="legal-warning"><strong>Importante:</strong> obra pública, contrato administrativo, anúncio de investimento ou aumento de despesa não provam, isoladamente, abuso eleitoral. A jurisprudência selecionada do TSE exige demonstração concreta de gravidade e de como a conduta favoreceu candidatura específica.</p>
          </section>

          <section id="metodo">
            <p className="eyebrow">4. MÉTODO PROBATÓRIO</p>
            <h2>Reconstrução da origem ao resultado</h2>
            <div className="chain-large"><span>origem</span><b>→</b><span>instrumento</span><b>→</b><span>transferência</span><b>→</b><span>contrato</span><b>→</b><span>fornecedor</span><b>→</b><span>execução física</span><b>→</b><span>contexto eleitoral</span></div>
            <p>O portal separa documento primário, indicador objetivo, correlação e hipótese. Relatos de cidadãos servem como pista para busca de documentos e nunca são automaticamente convertidos em afirmação pública.</p>
            <div className="levels">
              {evidenceLevels.map(([level,title,desc]) => <div key={level}><strong>{level}</strong><h3>{title}</h3><p>{desc}</p></div>)}
            </div>
          </section>

          <section id="matriz">
            <p className="eyebrow">5. MATRIZ PROBATÓRIA</p>
            <h2>Um registro para cada município e operação</h2>
            <p>O objetivo é consolidar os 417 municípios da Bahia e permitir comparação temporal, financeira, contratual e física.</p>
            <div className="tag-cloud">{matrixFields.map((f) => <span key={f}>{f}</span>)}</div>
            <p>A prioridade inicial são pagamentos, transferências e desbloqueios ocorridos entre <strong>4 de julho e 4 de outubro de 2026</strong>, sem excluir liberações imediatamente anteriores cujo encadeamento mereça análise.</p>
          </section>

          <section id="alertas">
            <p className="eyebrow">6. SINAIS DE ALERTA — NÃO SÃO PROVA</p>
            <h2>Critérios para priorizar a auditoria</h2>
            <ul className="check-list">{redFlags.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>

          <section id="pedidos">
            <p className="eyebrow">7. PROVIDÊNCIAS A SEREM FUNDAMENTADAS</p>
            <h2>O dossiê pede apuração, não condenação antecipada</h2>
            <ol className="number-list">
              <li>Auditoria das transferências, pagamentos e desbloqueios de recursos dentro do recorte eleitoral.</li>
              <li>Identificação, operação por operação, da exceção legal eventualmente invocada e da documentação que a sustenta.</li>
              <li>Obtenção de processos completos, contratos, medições, cronogramas, ordens bancárias e registros de execução que não estejam acessíveis ao cidadão.</li>
              <li>Cruzamento de fornecedores, sócios, prestadores eleitorais, documentos fiscais e despesas de campanha quando houver pertinência documental.</li>
              <li>Verificação material das obras/serviços em casos prioritários e preservação de evidências digitais relevantes.</li>
              <li>Encaminhamento de fatos administrativos, cíveis, eleitorais ou penais ao órgão competente, sem misturar regimes jurídicos diferentes.</li>
            </ol>
          </section>

          <section id="prazo">
            <p className="eyebrow">8. CONTEXTO PROCESSUAL EM 05/10/2026</p>
            <h2>Há relevância temporal imediata</h2>
            <p>A Procuradoria Regional Eleitoral na Bahia atua perante o TRE-BA nas eleições estaduais e federais. O MPF também informa que cidadãos podem encaminhar notícias de irregularidade eleitoral pelo MPF Serviços.</p>
            <p>O Calendário Eleitoral 2026 estabelece <strong>18 de dezembro de 2026</strong> como data-limite para diplomação. Algumas medidas eleitorais possuem marcos ligados à diplomação; a definição do instrumento, legitimidade e prazo concreto deve ser feita pela autoridade ou por assessoria jurídica habilitada.</p>
            <div className="inline-actions"><a className="button secondary" href={official('pre-ba').href} target="_blank" rel="noreferrer">PRE-BA ↗</a><a className="button secondary" href={official('mpf-denuncia').href} target="_blank" rel="noreferrer">Como denunciar ao MPF ↗</a><Link className="button" href="/enviar">Enviar evidência ao projeto</Link></div>
          </section>
        </article>
      </section>

      <footer className="political-footer"><div className="container footer-top"><div><strong>Observatório Eleitoral Bahia 2026</strong><p>Dossiê público em atualização e sujeito a correção.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><Link href="/fontes">Consultar catálogo de fontes →</Link></div></footer>
    </main>
  );
}
