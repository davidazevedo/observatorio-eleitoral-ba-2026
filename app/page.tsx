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
    date: '417',
    title: 'Municípios no escopo da matriz',
    value: '417',
    detail: 'A meta é permitir leitura município por município, sem transformar proximidade política ou gasto público em prova automática.',
    href: '/dossie',
  },
];

const investigation = [
  ['01', 'Origem do recurso', 'Identificar concedente, instrumento, empenho, liquidação, pagamento e data efetiva da transferência.'],
  ['02', 'Contratação', 'Cruzar licitação, contrato, fornecedor, sócios, aditivos, preços unitários e capacidade operacional.'],
  ['03', 'Execução física', 'Comparar pagamento com ordem de serviço, medições, cronograma, fotos, localização e estágio real da obra.'],
  ['04', 'Contexto eleitoral', 'Verificar vínculos documentados com campanhas, fornecedores eleitorais, apoiadores e eventos públicos.'],
  ['05', 'Padrão estadual', 'Consolidar ocorrências equivalentes para distinguir casos isolados de um padrão estatisticamente relevante.'],
];

const timeline = [
  {
    date: '11.06',
    title: 'R$ 1,7 bi',
    desc: 'Pacote estadual anunciado para 200 cidades.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-06/382803/investimentos-de-mais-de-r-17-bilhao-do-estado-fortalecem-municipios-e',
    label: 'Abrir anúncio oficial',
  },
  {
    date: '03.07',
    title: '≈ R$ 6 bi',
    desc: 'Novo pacote anunciado na véspera do início da vedação.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-07/383361/audio-governo-do-estado-anuncia-pacote-de-investimentos-de-cerca-de-r-6',
    label: 'Abrir anúncio oficial',
  },
  {
    date: '04.07',
    title: 'Início do defeso',
    desc: 'Começa o período de restrição às transferências voluntárias, ressalvadas as exceções legais.',
    href: 'https://www.ba.gov.br/pge/orientacoes-para-o-ano-eleitoral-2026',
    label: 'Ver orientação da PGE-BA',
  },
  {
    date: '04.10',
    title: '1º turno',
    desc: 'A eleição acontece; o dossiê passa a ter urgência processual adicional.',
    href: '/dossie#fatos',
    label: 'Ver contexto no dossiê',
  },
  {
    date: '18.12',
    title: 'Diplomação',
    desc: 'Data-limite indicada no calendário eleitoral para diplomação.',
    href: '/dossie#prazo',
    label: 'Ver contexto processual',
  },
];

export default function Home() {
  return (
    <main className="political-home">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/">
            <span className="brand-mark">OE</span>
            <span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span>
          </Link>
          <nav className="nav" aria-label="Principal">
            <Link href="/dossie">Dossiê</Link>
            <a href="#linha-do-tempo">Linha do tempo</a>
            <Link href="/fontes">Fontes</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="political-hero">
        <div className="hero-photo" aria-hidden="true">
          <img
            src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Pal%C3%A1cio_Luis_Eduardo_Magalh%C3%A3es_%286466206113%29.jpg?width=1800"
            alt=""
          />
        </div>
        <div className="hero-shade" />
        <img
          className="bahia-watermark"
          src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Brazil_white_state_maps_-_Bahia.svg"
          alt=""
          aria-hidden="true"
        />
        <div className="container political-hero-inner">
          <div className="hero-kicker"><span>BAHIA</span><b>ELEIÇÕES 2026</b><span>FISCALIZAÇÃO CIDADÃ</span></div>
          <h1>Não deixe a Bahia<br/><em>ser refém.</em></h1>
          <p className="hero-declaration">
            Vamos libertar a Bahia pela <strong>transparência</strong>, pela <strong>fiscalização</strong> e pela <strong>verdade documentada</strong>.
          </p>
          <p className="hero-explainer">
            Este observatório reúne fatos, documentos, relatos e evidências para investigar o possível uso eleitoralmente indevido de recursos, contratos, obras e estruturas públicas — sem transformar suspeita em condenação.
          </p>
          <div className="actions political-actions">
            <Link className="button button-gold" href="/enviar">Tenho um fato ou evidência</Link>
            <Link className="button button-outline-light" href="/dossie">Ler o dossiê público</Link>
          </div>
          <div className="hero-proof">
            <span>Fatos verificáveis</span><span>Fontes oficiais</span><span>Evidência preservada</span><span>Direito de resposta</span>
          </div>
        </div>
      </section>

      <section className="manifesto-band">
        <div className="container manifesto-grid">
          <p className="manifesto-label">NOSSO PRINCÍPIO</p>
          <blockquote>
            “A Bahia não pertence a governos, partidos ou grupos. <strong>Pertence ao povo baiano.</strong>”
          </blockquote>
          <p className="manifesto-copy">
            Não pedimos que ninguém acredite em nós. Pedimos que examine os documentos, refaça as consultas e cobre respostas.
          </p>
        </div>
      </section>

      <section className="container political-intro section">
        <div className="intro-title">
          <p className="eyebrow">O QUE ESTÁ EM JOGO</p>
          <h2>Não é apenas uma eleição.<br/>É o limite entre Estado e poder.</h2>
        </div>
        <div className="intro-copy">
          <p>Quando bilhões são anunciados, contratados ou transferidos em ambiente eleitoral, a sociedade tem o direito de perguntar se cada operação observou a lei, o interesse público e a igualdade da disputa.</p>
          <p><strong>Se o dinheiro é público, o caminho dele também precisa ser.</strong></p>
        </div>
      </section>

      <section className="container evidence-collage" aria-label="Bahia, poder público e fiscalização cidadã">
        <figure className="collage-main">
          <img
            src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Pal%C3%A1cio_Thom%C3%A9_de_Souza_-_Prefeitura_de_Salvador_-_panoramio.jpg?width=1600"
            alt="Palácio Thomé de Souza, sede da Prefeitura de Salvador"
          />
          <figcaption>O poder público precisa ser visível também nos seus atos, contratos e pagamentos.</figcaption>
        </figure>
        <div className="collage-statement">
          <span className="stamp">AUDITAR</span>
          <h3>Da suspeita ao documento.</h3>
          <p>Relato não é prova. Proximidade temporal não é condenação. O que muda o nível de uma ocorrência é a convergência entre documento, execução material e nexo verificável.</p>
          <Link href="/dossie">Conheça a metodologia →</Link>
        </div>
      </section>

      <section className="container section political-numbers">
        <div className="section-heading political-heading">
          <div>
            <p className="eyebrow">NÚMEROS QUE EXIGEM VIGILÂNCIA</p>
            <h2>A cronologia importa.<br/>Os documentos também.</h2>
          </div>
          <p>Os números abaixo são pontos de partida oficiais para a auditoria. Eles justificam perguntas; não substituem prova.</p>
        </div>
        <div className="source-grid political-source-grid">
          {sources.map((s) => (
            <a key={s.date + s.title} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel={s.href.startsWith('http') ? 'noreferrer' : undefined} className="source-card political-source-card">
              <span className="source-date">{s.date}</span>
              <strong className="source-value">{s.value}</strong>
              <h3>{s.title}</h3>
              <p>{s.detail}</p>
              <span className="source-link">{s.href.startsWith('http') ? 'Abrir fonte oficial ↗' : 'Ver matriz →'}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="timeline-section" id="linha-do-tempo">
        <div className="container section">
          <div className="timeline-heading">
            <p className="eyebrow light">LINHA DO TEMPO</p>
            <h2>O tempo dos fatos<br/>também é evidência.</h2>
            <p>Uma auditoria séria precisa distinguir anúncio, assinatura, empenho, liquidação, pagamento, início físico e resultado eleitoral.</p>
          </div>
          <div className="political-timeline">
            {timeline.map((item, index) => (
              <a
                className="timeline-card"
                key={item.date}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                aria-label={`${item.date} — ${item.title}. ${item.label}`}
              >
                <span className="timeline-index">0{index + 1}</span>
                <span className="timeline-dot" aria-hidden="true" />
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="timeline-action">{item.label} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container section" id="denuncia">
        <div className="section-heading political-heading">
          <div>
            <p className="eyebrow">O QUE QUEREMOS APURAR</p>
            <h2>Nem boato.<br/>Nem silêncio.</h2>
          </div>
          <p>A hipótese de trabalho é investigar possível uso eleitoralmente indevido de recursos, contratos, obras, serviços ou estruturas públicas. Só será tratado como fato o que tiver lastro verificável.</p>
        </div>
        <div className="thesis-grid political-thesis">
          <article><span className="number">01</span><h3>Dinheiro público</h3><p>Mapear transferências, pagamentos e desbloqueios, com atenção especial ao período eleitoral e às exceções legalmente documentadas.</p></article>
          <article><span className="number">02</span><h3>Contratos e execução</h3><p>Examinar preços, aditivos, medições, capacidade operacional e correspondência entre desembolso e obra ou serviço efetivamente executado.</p></article>
          <article><span className="number">03</span><h3>Nexo eleitoral</h3><p>Verificar apenas quando houver documentos: relações entre recursos públicos, agentes, fornecedores, prestadores eleitorais, apoiadores ou concessão de vantagens.</p></article>
        </div>
        <div className="political-warning">
          <b>Regra editorial:</b> correlação temporal, alinhamento político, anúncio de obra ou contratação pública não serão apresentados como prova de ilícito por si sós.
        </div>
      </section>

      <section className="dark-section political-method" id="metodo">
        <div className="container section">
          <p className="eyebrow light">MÉTODO DE AUDITORIA CIDADÃ</p>
          <h2>O poder deixa rastros.<br/>Nós seguimos os documentos.</h2>
          <div className="steps">
            {investigation.map(([n, title, desc]) => (
              <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div></article>
            ))}
          </div>
          <div className="method-motto">recurso → instrumento → transferência → contrato → fornecedor → execução → contexto eleitoral</div>
        </div>
      </section>

      <section className="representation political-representation" id="representacao">
        <div className="container section">
          <div className="section-heading political-heading">
            <div><p className="eyebrow">DOSSIÊ PÚBLICO</p><h2>Uma denúncia que possa ser conferida.</h2></div>
            <p>A força da representação não virá da retórica. Virá da capacidade de mostrar ao Ministério Público onde olhar, o que requisitar e quais documentos precisam ser confrontados.</p>
          </div>
          <div className="document-body political-document">
            <div className="document-stamp">DOCUMENTO DE TRABALHO · 2026</div>
            <h3>Objeto</h3>
            <p>Requer-se a apuração da regularidade da destinação, transferência, contratação e execução de recursos públicos estaduais e, quando aplicável, federais, destinados a municípios baianos no contexto das Eleições 2026, bem como da eventual utilização eleitoralmente indevida de bens, serviços, contratos, obras, benefícios ou estruturas financiadas com recursos públicos.</p>
            <h3>O que torna a apuração necessária</h3>
            <p>Foram localizados anúncios oficiais de pacotes de investimentos de grande materialidade em junho e em 3 de julho de 2026. A proximidade com o início do período de vedação não prova irregularidade, mas torna necessária a identificação da data efetiva de cada transferência, de seu fundamento jurídico e da execução física correspondente.</p>
            <h3>O que será separado</h3>
            <p>O dossiê distingue fatos comprovados por fonte primária, ocorrências corroboradas por múltiplas fontes, indícios documentais e hipóteses ainda pendentes de diligência. Essa separação é parte central da credibilidade do projeto.</p>
            <Link className="button secondary" href="/dossie">Acessar o dossiê completo →</Link>
          </div>
        </div>
      </section>

      <section className="container civic-callout">
        <div className="civic-callout-map">
          <img
            src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Brazil_white_state_maps_-_Bahia.svg"
            alt="Silhueta do estado da Bahia"
          />
        </div>
        <div className="civic-callout-copy">
          <p className="eyebrow light">PARTICIPE</p>
          <h2>Ajude a libertar a Bahia<br/>pela verdade documentada.</h2>
          <p>Você viu, registrou ou recebeu algo relevante? Documento, vídeo, imagem, áudio ou relato direto podem ajudar a transformar uma suspeita dispersa em uma pergunta institucional precisa.</p>
          <div className="actions">
            <Link className="button button-gold" href="/enviar">Enviar fato ou evidência</Link>
            <Link className="button button-outline-light" href="/privacidade">Como protegemos o material</Link>
          </div>
        </div>
      </section>

      <section className="container author-section">
        <div className="author-monogram">DPA</div>
        <div>
          <p className="eyebrow">RESPONSABILIDADE AUTORAL</p>
          <h2>Este projeto tem nome e responsabilidade.</h2>
          <p>O Observatório Eleitoral Bahia 2026 é uma iniciativa cívica independente, idealizada e coordenada por <strong>David Pereira de Azevedo</strong>. Não possui vínculo oficial com partido, campanha, candidatura, órgão público ou veículo de imprensa.</p>
          <p className="author-motto">“Assinar é assumir publicamente o compromisso com a verdade, a correção e a possibilidade de contraditório.”</p>
        </div>
      </section>

      <footer className="political-footer">
        <div className="container footer-top">
          <div>
            <strong>Observatório Eleitoral Bahia 2026</strong>
            <p>Fiscalização cidadã. Evidência. Transparência.</p>
          </div>
          <div className="footer-signature">
            <span>Idealização e coordenação</span>
            <strong>David Pereira de Azevedo</strong>
          </div>
          <p><Link href="/dossie">Dossiê</Link> · <Link href="/fontes">Fontes</Link> · <Link href="/privacidade">Privacidade</Link></p>
        </div>
        <div className="container visual-credits">
          Imagens: Palácio Deputado Luís Eduardo Magalhães — Fotos GOVBA/Manu Dias, via Wikimedia Commons; Palácio Thomé de Souza — Gabriel Fernandes, via Wikimedia Commons; mapa da Bahia — EPorto (WMB), CC BY-SA 4.0.
        </div>
      </footer>
    </main>
  );
}
