import Link from 'next/link';

const sources = [
  {
    date: '11 JUN 2026',
    title: 'Pacote anunciado pelo Governo da Bahia',
    value: 'R$ 1,7 bi',
    detail: 'Anúncio oficial para 200 cidades, com 271 convênios, 24 ordens de serviço, 56 licitações e outros atos.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-06/382803/investimentos-de-mais-de-r-17-bilhao-do-estado-fortalecem-municipios-e',
  },
  {
    date: '03 JUL 2026',
    title: 'Novo pacote de investimentos anunciado',
    value: '≈ R$ 6 bi',
    detail: 'Anúncio oficial envolvendo mais de 160 municípios, na véspera do início do período de vedação eleitoral.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-07/383361/audio-governo-do-estado-anuncia-pacote-de-investimentos-de-cerca-de-r-6',
  },
  {
    date: '04 JUL — 04 OUT',
    title: 'Período de vedação em 2026',
    value: '3 meses',
    detail: 'A PGE-BA descreve a vedação a transferências voluntárias, com exceções legais que precisam ser verificadas caso a caso.',
    href: 'https://www.ba.gov.br/pge/orientacoes-para-o-ano-eleitoral-2026',
  },
  {
    date: 'ORIENTAÇÃO 2026',
    title: 'Transferência efetiva e exceções',
    value: 'Controle',
    detail: 'O Transferegov orienta que a análise considere a transferência/desbloqueio efetivo e os requisitos cumulativos das exceções legais.',
    href: 'https://www.gov.br/transferegov/pt-br/comunicados/comunicados-gerais/2026/comunicado-no-21-2026-orientacoes-para-gestao-das-transferencias-durante-o-periodo-de-defeso-eleitoral-e-suspensao-da-emissao-automatica-da-autorizacao-de-inicio-de-obras-aio',
  },
];

const investigation = [
  ['01', 'Origem do recurso', 'Identificar concedente, instrumento, empenho, liquidação, pagamento e data efetiva da transferência.'],
  ['02', 'Contratação', 'Cruzar licitação, contrato, fornecedor, sócios, aditivos, preços unitários e capacidade operacional.'],
  ['03', 'Execução física', 'Comparar pagamento com ordem de serviço, medições, cronograma, fotos, localização e estágio real da obra.'],
  ['04', 'Contexto eleitoral', 'Verificar vínculos documentados com campanhas, fornecedores eleitorais, apoiadores e eventos públicos.'],
  ['05', 'Padrão estadual', 'Consolidar ocorrências equivalentes para distinguir casos isolados de um padrão estatisticamente relevante.'],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" href="/">observatório<span>.</span></Link>
          <nav className="nav" aria-label="Principal">
            <Link href="/dossie">Dossiê</Link>
            <a href="#metodo">Método</a>
            <Link href="/fontes">Fontes</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
          <Link className="button compact" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">BAHIA · ELEIÇÕES 2026 · INICIATIVA INDEPENDENTE</p>
          <h1>Fatos primeiro.<br/><em>Conclusões depois.</em></h1>
          <p className="lead">
            Este portal organiza documentos e relatos sobre a destinação e a execução de recursos públicos no período eleitoral na Bahia, com o objetivo de encaminhar um dossiê verificável às autoridades competentes.
          </p>
          <div className="actions">
            <Link className="button" href="/enviar">Tenho um fato ou documento</Link>
            <Link className="text-link" href="/dossie">Ler o dossiê completo →</Link>
          </div>
          <p className="trust-note">Não somos órgão público, partido, campanha ou veículo de imprensa. Um relato recebido não é publicado como fato sem verificação.</p>
        </div>
        <div className="hero-panel" aria-label="Objetivo do projeto">
          <div className="signal">✳</div>
          <p>OBJETIVO</p>
          <h2>Construir uma trilha documental auditável.</h2>
          <div className="chain">
            <span>recurso</span><b>→</b><span>contrato</span><b>→</b><span>execução</span><b>→</b><span>contexto eleitoral</span>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="container strip-inner">
          <span>Neutralidade probatória</span>
          <span>Fontes primárias</span>
          <span>Preservação de evidências</span>
          <span>Direito de resposta</span>
        </div>
      </section>

      <section className="container section" id="denuncia">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A QUESTÃO APRESENTADA</p>
            <h2>O que se pede que seja investigado.</h2>
          </div>
          <p>
            A hipótese de trabalho é a existência de uso eleitoralmente indevido de recursos, contratos, obras, serviços ou estruturas públicas em municípios baianos. O portal não presume que essa hipótese esteja provada.
          </p>
        </div>
        <div className="thesis-grid">
          <article>
            <span className="number">01</span>
            <h3>Transferências e pagamentos</h3>
            <p>Mapear valores liberados antes e durante o período eleitoral, especialmente os pagamentos efetivos e eventuais exceções à vedação legal.</p>
          </article>
          <article>
            <span className="number">02</span>
            <h3>Superfaturamento ou execução incompatível</h3>
            <p>Examinar indícios objetivos: preço, aditivos, medições, capacidade do fornecedor e correspondência entre desembolso e execução física.</p>
          </article>
          <article>
            <span className="number">03</span>
            <h3>Uso eleitoral da estrutura</h3>
            <p>Verificar, quando houver documentação, eventual conexão entre recursos públicos, agentes, fornecedores, apoiadores, campanhas ou concessão de vantagens.</p>
          </article>
        </div>
        <div className="legal-box">
          <strong>Critério de publicação</strong>
          <p>Correlação temporal não será tratada como prova de ilícito. Alegações sobre pessoas ou empresas serão classificadas como relato, indício documentado ou fato confirmado por fonte primária, conforme o nível de evidência disponível.</p>
        </div>
      </section>

      <section className="dark-section" id="metodo">
        <div className="container section">
          <p className="eyebrow light">MÉTODO DE AUDITORIA CIDADÃ</p>
          <h2>Uma investigação reproduzível,<br/>município por município.</h2>
          <div className="steps">
            {investigation.map(([n, title, desc]) => (
              <article key={n}>
                <span>{n}</span>
                <div><h3>{title}</h3><p>{desc}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" id="fontes">
        <div className="section-heading">
          <div><p className="eyebrow">PONTOS DE PARTIDA PÚBLICOS</p><h2>O que já pode ser auditado.</h2></div>
          <p>Estes registros oficiais justificam aprofundar a análise documental. Eles não são apresentados, isoladamente, como prova de crime eleitoral.</p>
        </div>
        <div className="source-grid">
          {sources.map((s) => (
            <a key={s.date} href={s.href} target="_blank" rel="noreferrer" className="source-card">
              <span className="source-date">{s.date}</span>
              <strong className="source-value">{s.value}</strong>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
              <span className="source-link">Abrir fonte oficial ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="representation" id="representacao">
        <div className="container section">
          <div className="section-heading">
            <div><p className="eyebrow">TEXTO-BASE DA REPRESENTAÇÃO</p><h2>Objeto da notícia de fato.</h2></div>
            <p>Este texto é público e será atualizado conforme os anexos e casos sejam corroborados. A versão protocolada deverá ser congelada, numerada e acompanhada de índice de evidências.</p>
          </div>
          <div className="document-body">
            <h3>1. Objeto</h3>
            <p>Requer-se a apuração da regularidade da destinação, transferência, contratação e execução de recursos públicos estaduais e, quando aplicável, federais, destinados a municípios baianos no contexto das Eleições 2026, bem como da eventual utilização eleitoralmente indevida de bens, serviços, contratos, obras, benefícios ou estruturas financiadas com recursos públicos.</p>
            <p>A representação parte de fatos públicos e de relatos que serão individualmente classificados e corroborados. Não se afirma, por antecipação, que anúncio de investimento, celebração de convênio, realização de obra ou proximidade temporal com a eleição constituam ilícito. O objeto é verificar, documentalmente, se determinadas operações observaram a legislação eleitoral, administrativa, orçamentária e penal aplicável.</p>

            <h3>2. Recorte inicial que justifica a apuração</h3>
            <p>Foram localizados anúncios oficiais de pacotes de investimentos de grande materialidade destinados a municípios baianos em junho e em 3 de julho de 2026. O segundo anúncio ocorreu imediatamente antes do início do período de vedação indicado para 4 de julho de 2026. Esse encadeamento temporal, por si só, não comprova irregularidade, mas justifica identificar a data de cada transferência efetiva, o respectivo instrumento jurídico e a documentação que demonstre eventual enquadramento nas exceções legais.</p>

            <h3>3. Hipóteses que deverão ser testadas</h3>
            <p>O levantamento buscará verificar: transferências ou desbloqueios durante o período vedado sem suporte documental suficiente; contratos com preço ou aditivos incompatíveis com referências verificáveis; pagamentos sem execução física correspondente; concentração atípica em fornecedores ou grupos relacionados; e eventual conexão documental entre agentes, fornecedores, apoiadores, prestadores eleitorais e vantagens concedidas a eleitores.</p>

            <h3>4. Método probatório</h3>
            <p>Cada ocorrência deverá ser reconstruída da origem ao destino: instrumento, empenho, liquidação, pagamento, contrato, fornecedor, ordem de serviço, cronograma, medição e execução material. Somente depois será analisado o contexto eleitoral. Relatos de cidadãos funcionarão como pistas de investigação e serão confrontados com documentos públicos ou outras fontes independentes antes de eventual divulgação identificada.</p>

            <h3>5. Fundamentos jurídicos a serem examinados</h3>
            <p>Entre os dispositivos pertinentes está o art. 73 da Lei nº 9.504/1997, especialmente as restrições dirigidas a agentes públicos no período eleitoral e as hipóteses legais de exceção às transferências voluntárias. Havendo elementos suficientes, caberá às autoridades avaliar também eventual abuso de poder político ou econômico nos termos da legislação eleitoral, além de ilícitos administrativos ou penais que possam surgir da prova.</p>
            <p className="source-inline"><a href="https://www.tse.jus.br/legislacao/codigo-eleitoral/lei-das-eleicoes/lei-das-eleicoes-lei-nb0-9.504-de-30-de-setembro-de-1997" target="_blank" rel="noreferrer">Lei das Eleições — TSE ↗</a> · <a href="https://www.tse.jus.br/legislacao/codigo-eleitoral/lei-de-inelegibilidade/lei-de-inelegibilidade-lei-complementar-nb0-64-de-18-de-maio-de-1990" target="_blank" rel="noreferrer">Lei Complementar nº 64/1990 — TSE ↗</a></p>

            <h3>6. Providências pretendidas</h3>
            <p>Ao final da consolidação, pretende-se requerer a preservação e obtenção dos processos completos, dados de pagamento, documentos de medição e execução, registros necessários à identificação dos beneficiários finais das contratações e demais diligências que dependam de poder requisitório. O dossiê deverá indicar separadamente o que está provado por fonte primária, o que foi corroborado por múltiplas fontes e o que permanece como hipótese pendente.</p>
          </div>
        </div>
      </section>

      <section className="container section requests">
        <div>
          <p className="eyebrow">PEDIDOS QUE O DOSSIÊ PRETENDE FUNDAMENTAR</p>
          <h2>O encaminhamento não pede condenação antecipada. Pede apuração.</h2>
        </div>
        <ol>
          <li>Auditoria das transferências, pagamentos e desbloqueios de recursos no recorte eleitoral de 2026.</li>
          <li>Verificação documental das hipóteses legais de exceção aplicadas após 4 de julho de 2026.</li>
          <li>Cruzamento com contratos, fornecedores, aditivos, medições e execução física municipal.</li>
          <li>Cruzamento, quando juridicamente pertinente, com prestações de contas e fornecedores eleitorais.</li>
          <li>Preservação e requisição de documentos que cidadãos não conseguem obter diretamente.</li>
        </ol>
      </section>

      <section className="container callout">
        <div>
          <p className="eyebrow">PARTICIPAÇÃO CIDADÃ</p>
          <h2>Você presenciou um fato ou possui documento, foto ou vídeo?</h2>
          <p>Envie de forma anônima ou identificada. Descreva o que ocorreu, onde, quando e como o material foi obtido.</p>
        </div>
        <Link className="button large" href="/enviar">Enviar com segurança →</Link>
      </section>

      <footer>
        <div className="container footer-inner">
          <div><strong>Observatório Eleitoral Bahia 2026</strong><p>Iniciativa cívica independente de organização documental.</p></div>
          <p><Link href="/dossie">Dossiê completo</Link> · <Link href="/fontes">Fontes</Link> · <Link href="/privacidade">Privacidade</Link></p>
        </div>
      </footer>
    </main>
  );
}
