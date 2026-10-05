import Link from 'next/link';

export const metadata = {
  title: 'Privacidade e segurança | Observatório Eleitoral Bahia 2026',
  description: 'Como o Observatório trata dados pessoais, evidências, acesso ao dossiê e relatos sem identificação no formulário.',
};

export default function PrivacyPage() {
  return (
    <main>
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <nav className="nav"><Link href="/denuncia">A denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/dossie">Dossiê</Link></nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="privacy-hero">
        <div className="container">
          <p className="eyebrow light">PRIVACIDADE · SEGURANÇA · LGPD</p>
          <h1>Coragem para denunciar.<br/><em>Responsabilidade para proteger.</em></h1>
          <p>O projeto coleta o mínimo necessário para cada finalidade e mantém o acesso ao dossiê separado do envio de denúncias. Nenhum sistema comum de internet pode prometer anonimato absoluto.</p>
        </div>
      </section>

      <section className="container privacy-doc research-privacy">
        <article>
          <span>01</span><div><h2>Relato sem identificação no formulário</h2><p>Você pode enviar um fato sem informar nome, telefone ou e-mail. Nesse modo, o manifesto da submissão não inclui dados de contato. Provedores de infraestrutura podem, contudo, manter logs técnicos de operação e segurança; por isso o portal não usa a expressão “100% anônimo”.</p></div>
        </article>
        <article>
          <span>02</span><div><h2>Relato identificado</h2><p>Quando você escolhe deixar contato, nome, e-mail e telefone são usados para esclarecer o relato e a verificação. Esses dados não são publicados automaticamente e ficam na camada privada do projeto.</p></div>
        </article>
        <article>
          <span>03</span><div><h2>E-mail do Dossiê Analítico</h2><p>O e-mail usado para receber o código de acesso ao dossiê serve exclusivamente para autenticação e registro da consulta. Ele não é anexado a uma denúncia enviada sem identificação, não é usado para marketing e não gera inscrição automática em newsletter.</p></div>
        </article>
        <article>
          <span>04</span><div><h2>Retenção do acesso ao dossiê</h2><p>O registro de acesso contém e-mail, data/hora, finalidade e versão do aviso de privacidade. A configuração inicial prevê retenção operacional de até 90 dias, sujeita a revisão conforme necessidade jurídica, segurança e minimização de dados.</p></div>
        </article>
        <article>
          <span>05</span><div><h2>Evidência bruta</h2><p>Documentos, imagens, áudio e vídeo permanecem em armazenamento privado. O portal público não aponta diretamente para arquivos brutos recebidos. Qualquer publicação deve usar cópia curada, com supressão de dados pessoais quando necessária.</p></div>
        </article>
        <article>
          <span>06</span><div><h2>Dados que não queremos</h2><p>Não solicitamos CPF, RG, senha, credencial bancária ou dados de crianças, vítimas e terceiros sem relação material com o fato. Evite enviar material excessivo ou alheio à ocorrência.</p></div>
        </article>
        <article>
          <span>07</span><div><h2>Boa-fé e verificação</h2><p>O envio não significa validação nem publicação. O material entra como L0 — relato recebido — e pode avançar somente conforme elementos localizáveis, documentos primários e corroboração independente.</p></div>
        </article>
        <article>
          <span>08</span><div><h2>Segurança pessoal</h2><p>Ninguém deve confrontar agentes, invadir sistemas, acessar área restrita, violar sigilo ou se colocar em risco para produzir prova. Em situações de risco elevado, use também os canais oficiais das autoridades competentes.</p></div>
        </article>

        <div className="privacy-separation">
          <p className="eyebrow">SEPARAÇÃO DE FINALIDADES</p>
          <div><strong>dossier_access</strong><span>e-mail + data/hora + versão do aviso → controle de acesso</span></div>
          <div><strong>submission</strong><span>relato + evidência + contato somente se escolhido → verificação de fatos</span></div>
          <p>Esses domínios não são automaticamente cruzados para identificar quem optou por enviar um relato sem contato.</p>
        </div>

        <div className="legal-box">
          <strong>Canal não emergencial</strong>
          <p>Este portal não substitui polícia, Ministério Público, Justiça Eleitoral, Ouvidorias ou atendimento emergencial. Para risco imediato ou crime em curso, utilize o canal oficial adequado.</p>
        </div>
      </section>

      <footer className="political-footer"><div className="container footer-top"><div><strong>Segurança por padrão</strong><p>Segredos, submissões e arquivos recebidos nunca devem ser versionados no GitHub público.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><Link href="/enviar">Ir para o formulário →</Link></div></footer>
    </main>
  );
}
