import Link from 'next/link';

export const metadata = {
  title: 'Correções, contraditório e direito de resposta | Observatório Eleitoral Bahia 2026',
  description: 'Política pública para correções, contestação documental, contraditório e direito de resposta.',
};

export default function CorrectionsPage() {
  return (
    <main className="complaint-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <nav className="nav"><Link href="/denuncia">A denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/atualizacoes">Atualizações</Link></nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="privacy-hero">
        <div className="container">
          <p className="eyebrow light">POLÍTICA EDITORIAL</p>
          <h1>Investigar exige coragem.<br/><em>Corrigir exige a mesma coisa.</em></h1>
          <p>Qualquer pessoa, empresa, órgão ou agente citado pode apresentar documentos, contexto, contestação ou pedido de correção. O compromisso do projeto é com a reconstrução verificável dos fatos, não com a preservação de uma narrativa.</p>
        </div>
      </section>

      <section className="container correction-policy">
        <article><span>01</span><div><h2>Correção factual</h2><p>Erros verificáveis de data, valor, nome, vínculo, fonte ou descrição devem ser corrigidos assim que comprovados. Quando a alteração for material, ela será registrada no changelog público.</p></div></article>
        <article><span>02</span><div><h2>Contraditório documental</h2><p>Uma contestação acompanhada de documento primário ou outra fonte verificável entra no mesmo processo de análise aplicado às evidências originais. O nível probatório de um caso pode subir, cair ou retornar à triagem.</p></div></article>
        <article><span>03</span><div><h2>Direito de resposta</h2><p>Quando uma publicação individualizar pessoa, empresa ou órgão em matéria relevante, uma manifestação documental pertinente poderá ser incorporada ao registro público de modo proporcional e contextualizado.</p></div></article>
        <article><span>04</span><div><h2>O que não é removido apenas por discordância</h2><p>Fonte oficial autêntica, ato público ou documento primário não será ocultado apenas porque sua existência é inconveniente. A correção deve atingir o erro, a interpretação ou o contexto quando houver fundamento para isso.</p></div></article>
        <article><span>05</span><div><h2>Como pedir revisão</h2><p>Use o canal de evidências e selecione a categoria <strong>Correção, contraditório ou direito de resposta</strong>. Informe a página/caso a que se refere e anexe os documentos que sustentam o pedido.</p><Link className="button button-gold" href="/enviar">Solicitar revisão documental</Link></div></article>
      </section>

      <footer className="political-footer"><div className="container footer-top"><div><strong>Observatório Eleitoral Bahia 2026</strong><p>Correção, contraditório e versionamento fazem parte da metodologia.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><Link href="/atualizacoes">Ver histórico de mudanças →</Link></div></footer>
    </main>
  );
}
