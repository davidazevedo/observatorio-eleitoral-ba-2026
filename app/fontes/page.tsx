import Link from 'next/link';
import { sourceCatalog } from '@/lib/content';

export const metadata = { title: 'Fontes | Observatório Eleitoral Bahia 2026' };

const labels = { 'fato-publico': 'Fatos públicos', eleitoral: 'Legislação e Justiça Eleitoral', dados: 'Dados públicos', institucional: 'Encaminhamento institucional' };

export default function SourcesPage() {
  return <main>
    <header className="site-header political-header"><div className="container header-inner"><Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link><nav className="nav"><Link href="/denuncia">A denúncia</Link><Link href="/casos">Casos</Link><Link href="/fontes">Fontes</Link><Link href="/dossie">Dossiê</Link></nav><Link className="button compact" href="/enviar">Enviar evidência</Link></div></header>
    <section className="container form-hero"><p className="eyebrow">CATÁLOGO DE FONTES PRIMÁRIAS E INSTITUCIONAIS</p><h1>Não aceite narrativa sem <em>o documento original.</em></h1><p className="lead">A transparência do método depende de permitir que qualquer pessoa refaça a consulta. Este catálogo privilegia fontes oficiais e registra a função de cada uma no dossiê.</p></section>
    <section className="container section sources-list">
      {Object.entries(labels).map(([group,label]) => <div className="source-group" key={group}><div><p className="eyebrow">{label}</p></div><div>{sourceCatalog.filter(s=>s.group===group).map(s=><a className="source-row" href={s.href} target="_blank" rel="noreferrer" key={s.id}><span>{s.date}</span><div><h2>{s.title}</h2><p><b>{s.organization}</b> — {s.summary}</p></div><strong>↗</strong></a>)}</div></div>)}
    </section>
    <footer className="political-footer"><div className="container footer-top"><div><strong>Regra editorial</strong><p>Quando possível, fatos do dossiê devem apontar para fonte primária oficial.</p></div><div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div><span><Link href="/correcoes">Correções</Link> · <Link href="/atualizacoes">Atualizações</Link></span></div></footer>
  </main>;
}
