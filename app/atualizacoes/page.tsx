import Link from 'next/link';

export const metadata = {
  title: 'Atualizações | Observatório Eleitoral Bahia 2026',
  description: 'Histórico público de mudanças editoriais, técnicas e metodológicas do Observatório Eleitoral Bahia 2026.',
};

const entries = [
  {
    date: '05/10/2026',
    title: 'Nova arquitetura editorial e de acesso',
    items: [
      'Homepage reconstruída para apresentar primeiro a denúncia, os fatos públicos e o canal de evidências.',
      'Nova rota pública /denuncia para a representação completa.',
      'Dossiê dividido entre resumo público e análise autenticada.',
      'Fluxo de envio transformado em seis etapas progressivas.',
      'Taxonomia probatória revisada para L0–L4.',
      'Política de privacidade atualizada com separação entre acesso ao dossiê e submissões.',
      'Hero documental 3D leve com suporte a redução de movimento.',
    ],
  },
  {
    date: '05/10/2026',
    title: 'Registro público de casos',
    items: [
      'Criação de /casos com filtros e níveis probatórios.',
      'Nenhum relato privado é publicado automaticamente.',
      'Casos públicos iniciais usam fontes oficiais e perguntas de auditoria explícitas.',
    ],
  },
  {
    date: '05/10/2026',
    title: 'Canal de evidências e painel privado',
    items: [
      'Upload privado de documentos, imagens, áudio e vídeo.',
      'Geração de protocolo por submissão.',
      'Painel administrativo privado separado do portal público.',
    ],
  },
];

export default function UpdatesPage() {
  return (
    <main className="complaint-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <nav className="nav"><Link href="/denuncia">A denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/correcoes">Correções</Link></nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="dossier-public-hero">
        <div className="container">
          <p className="eyebrow light">TRANSPARÊNCIA EDITORIAL</p>
          <h1>O portal também precisa deixar <em>rastros das próprias mudanças.</em></h1>
          <p>Este histórico registra alterações relevantes de conteúdo, método, arquitetura, segurança e classificação probatória.</p>
        </div>
      </section>

      <section className="container updates-list">
        {entries.map((entry) => (
          <article key={entry.date + entry.title}>
            <time>{entry.date}</time>
            <div><h2>{entry.title}</h2><ul>{entry.items.map((item)=><li key={item}>{item}</li>)}</ul></div>
          </article>
        ))}
      </section>

      <footer className="political-footer"><div className="container footer-top"><div><strong>Observatório Eleitoral Bahia 2026</strong><p>Histórico público de alterações relevantes.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><Link href="/correcoes">Política de correção →</Link></div></footer>
    </main>
  );
}
