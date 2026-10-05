import Link from 'next/link';
import { sourceCatalog } from '@/lib/content';

const official = (id: string) => sourceCatalog.find((item) => item.id === id)!;

export const metadata = {
  title: 'A denúncia | Observatório Eleitoral Bahia 2026',
  description: 'Representação pública: fatos, pergunta investigativa, fundamentos gerais, fontes e pedidos de apuração.',
};

export default function ComplaintPage() {
  return (
    <main className="complaint-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/">
            <span className="brand-mark">OE</span>
            <span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span>
          </Link>
          <nav className="nav"><Link href="/denuncia">A denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/dossie">Dossiê</Link></nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="complaint-hero">
        <div className="container">
          <p className="eyebrow light">REPRESENTAÇÃO PÚBLICA · VERSÃO DE TRABALHO</p>
          <h1>Há uma pergunta que a Bahia <em>precisa responder.</em></h1>
          <p>Recursos, contratos, obras e estruturas públicas foram utilizados regularmente durante o processo eleitoral — ou existem operações em que o interesse público foi desviado para produzir vantagem política ou eleitoral?</p>
          <div className="actions"><Link className="button button-gold" href="/enviar">Tenho um fato ou evidência</Link><Link className="button button-outline-light" href="#texto">Ler a representação</Link></div>
        </div>
      </section>

      <section className="container complaint-principle">
        <strong>Nosso trabalho é reunir elementos para que essa pergunta seja respondida com documentos, não com torcida.</strong>
        <p>Em ano eleitoral, o Estado continua funcionando. Obra pública, investimento legítimo e contrato administrativo não se tornam ilícitos pela simples proximidade de uma eleição.</p>
      </section>

      <section className="container complaint-document" id="texto">
        <aside className="complaint-index">
          <strong>Representação</strong>
          <a href="#objeto">1. Objeto</a><a href="#fatos">2. Fatos públicos</a><a href="#pergunta">3. Pergunta investigativa</a><a href="#fundamentos">4. Fundamentos</a><a href="#pedidos">5. Pedidos</a><a href="#fontes">6. Fontes</a>
        </aside>
        <article className="document-body political-document">
          <div className="document-stamp">DOCUMENTO PÚBLICO · NÃO É CONCLUSÃO DE CULPA</div>

          <section id="objeto">
            <h2>1. Objeto</h2>
            <p>Requer-se a apuração da regularidade da destinação, transferência, contratação e execução de recursos públicos estaduais e, quando aplicável, federais, destinados a municípios baianos no contexto das Eleições 2026, bem como de eventual utilização eleitoralmente indevida de bens, serviços, contratos, obras, benefícios ou estruturas custeadas com recursos públicos.</p>
            <p>A representação parte de fatos públicos e relatos que devem ser individualmente classificados e corroborados. Não se afirma, por antecipação, que anúncio de investimento, celebração de convênio, realização de obra ou proximidade temporal com a eleição constituam ilícito.</p>
          </section>

          <section id="fatos">
            <h2>2. Fatos públicos que justificam auditoria</h2>
            <div className="complaint-facts">
              <div><time>11 JUN 2026</time><strong>R$ 1,7 bi</strong><p>Pacote estadual anunciado para cerca de 200 cidades, com convênios, ordens de serviço, licitações e outros atos.</p><a href={official('govba-1700').href} target="_blank" rel="noreferrer">Fonte oficial ↗</a></div>
              <div><time>03 JUL 2026</time><strong>≈ R$ 6 bi</strong><p>Mais de cem atos anunciados para mais de 160 municípios, imediatamente antes do marco de vedações relevante às transferências analisadas.</p><a href={official('govba-6000').href} target="_blank" rel="noreferrer">Fonte oficial ↗</a></div>
              <div><time>04 JUL 2026</time><strong>MARCO JURÍDICO</strong><p>Início do recorte de auditoria para transferências voluntárias, ressalvadas as exceções legalmente aplicáveis e documentadas.</p><a href={official('transferegov-21').href} target="_blank" rel="noreferrer">Transferegov ↗</a></div>
            </div>
            <p className="legal-warning"><strong>Importante:</strong> o portal não apresenta 4 de julho a 4 de outubro como um período universal aplicável a toda e qualquer conduta eleitoral. Cada operação deve ser vinculada ao fundamento jurídico pertinente.</p>
          </section>

          <section id="pergunta">
            <h2>3. O que precisa ser reconstruído</h2>
            <p>Queremos reconstruir operação por operação: quando o dinheiro foi liberado, para qual município, por qual instrumento, quem foi contratado, quanto recebeu, o que foi efetivamente executado e se existe algum nexo documentável com finalidade eleitoral.</p>
            <div className="public-chain"><span>Anunciar</span><b>≠</b><span>transferir</span><b>≠</b><span>pagar</span><b>≠</b><span>executar</span><b>≠</b><span>agir com finalidade eleitoral</span></div>
          </section>

          <section id="fundamentos">
            <h2>4. Enquadramentos a serem examinados</h2>
            <p>Conforme os fatos efetivamente corroborados, podem ser pertinentes as regras de condutas vedadas a agentes públicos, captação ilícita de sufrágio, abuso de poder político ou econômico e normas administrativas, orçamentárias e penais próprias de contratos e execução da despesa. Os regimes jurídicos não devem ser confundidos.</p>
            <p><a href={official('tse-lei-eleicoes').href} target="_blank" rel="noreferrer">Lei das Eleições — TSE ↗</a> · <a href={official('tse-lc64').href} target="_blank" rel="noreferrer">LC nº 64/1990 — TSE ↗</a></p>
          </section>

          <section id="pedidos">
            <h2>5. Providências pretendidas</h2>
            <ol className="number-list">
              <li>Auditar transferências, pagamentos e desbloqueios dentro do recorte relevante.</li>
              <li>Identificar, operação por operação, a exceção legal eventualmente invocada e a documentação que a sustenta.</li>
              <li>Obter processos, contratos, medições, cronogramas, ordens bancárias e registros físicos não acessíveis ao cidadão.</li>
              <li>Cruzar fornecedores e dados eleitorais apenas quando houver pertinência documental.</li>
              <li>Encaminhar fatos a cada órgão competente sem misturar regimes jurídicos distintos.</li>
            </ol>
          </section>

          <section id="fontes">
            <h2>6. Fontes e transparência</h2>
            <p>O projeto privilegia fontes primárias e mantém um catálogo público para que qualquer pessoa possa refazer a consulta.</p>
            <div className="inline-actions"><Link className="button secondary" href="/fontes">Abrir catálogo de fontes</Link><Link className="button" href="/dossie">Ver resumo do dossiê</Link></div>
          </section>
        </article>
      </section>

      <section className="container complaint-cta">
        <p className="eyebrow">A VERDADE PRECISA DE QUEM DECIDA NÃO SE CALAR</p>
        <h2>Se você possui um fato ou evidência, mostre onde devemos olhar.</h2>
        <p>Não precisamos de boatos. Precisamos de fatos verificáveis, contexto e material que permita reconstruir o que aconteceu.</p>
        <Link className="button button-gold large" href="/enviar">Enviar uma evidência</Link>
      </section>

      <footer className="political-footer"><div className="container footer-top"><div><strong>Observatório Eleitoral Bahia 2026</strong><p>Representação pública sujeita a atualização, correção e contraditório.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><p><Link href="/casos">Casos</Link> · <Link href="/fontes">Fontes</Link> · <Link href="/privacidade">Privacidade</Link></p></div></footer>
    </main>
  );
}
