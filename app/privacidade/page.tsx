import Link from 'next/link';

export const metadata = { title: 'Privacidade e segurança | Observatório Eleitoral Bahia 2026' };

export default function PrivacyPage(){ return <main>
  <header className="site-header political-header"><div className="container header-inner"><Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link><nav className="nav"><Link href="/dossie">Dossiê</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/privacidade">Privacidade</Link></nav><Link className="button compact" href="/enviar">Enviar evidência</Link></div></header>
  <section className="container form-hero"><p className="eyebrow">PRIVACIDADE, SEGURANÇA E TRATAMENTO DE EVIDÊNCIAS</p><h1>Coragem para denunciar. <em>Responsabilidade para proteger.</em></h1><p className="lead">O canal foi desenhado para reduzir exposição desnecessária de denunciantes e terceiros. Não prometemos anonimato absoluto de infraestrutura: provedores de hospedagem podem manter logs técnicos de operação e segurança.</p></section>
  <section className="container privacy-doc">
    <article><h2>1. Modos de envio</h2><p>No modo sem identificação, o formulário não solicita nome, e-mail ou telefone. No modo identificado, esses dados são coletados para permitir contato durante a verificação.</p></article>
    <article><h2>2. Evidência bruta</h2><p>Documentos, imagens, áudio e vídeo devem permanecer em armazenamento privado. O portal público não deve apontar diretamente para o arquivo bruto recebido. Qualquer publicação deve utilizar cópia curada, com anonimização quando necessária.</p></article>
    <article><h2>3. Dados que não queremos</h2><p>Não solicitamos CPF, RG, senha, credencial bancária ou dados de crianças e terceiros sem relação material com o fato. O denunciante deve evitar enviar material excessivo ou alheio à ocorrência.</p></article>
    <article><h2>4. Boa-fé e verificação</h2><p>O envio não significa validação nem publicação. O material entra como não verificado e deve ser confrontado com fontes independentes. Conteúdo manifestamente falso, ilícito ou irrelevante pode ser descartado.</p></article>
    <article><h2>5. Integridade</h2><p>A evolução prevista inclui hash SHA-256 no ingresso, manifesto de evidências, trilha de auditoria append-only, quarentena e varredura antimalware. O original deve ser preservado sem edição.</p></article>
    <article><h2>6. Segurança pessoal</h2><p>Ninguém deve confrontar agentes, invadir sistemas, acessar área restrita, violar sigilo ou se colocar em risco para produzir prova. O projeto trabalha com material obtido licitamente e com fontes públicas.</p></article>
    <div className="legal-box"><strong>Canal não emergencial</strong><p>Este portal não substitui polícia, Ministério Público, Justiça Eleitoral, Ouvidorias ou atendimento emergencial. Quando houver risco imediato ou crime em curso, use o canal oficial adequado.</p></div>
  </section>
  <footer className="political-footer"><div className="container footer-top"><div><strong>Segurança por padrão</strong><p>Segredos, submissões e arquivos recebidos nunca devem ser versionados no GitHub público.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><Link href="/enviar">Ir para o formulário →</Link></div></footer>
</main> }
