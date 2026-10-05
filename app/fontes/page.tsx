import Link from 'next/link';
import { sourceCatalog } from '@/lib/content';

export const metadata = { title: 'Fontes | Observatório Eleitoral Bahia 2026' };

const labels = { 'fato-publico': 'Fatos públicos', eleitoral: 'Legislação e Justiça Eleitoral', dados: 'Dados públicos', institucional: 'Encaminhamento institucional' };

export default function SourcesPage() {
  return <main>
    <header className="site-header"><div className="container header-inner"><Link className="brand" href="/">observatório<span>.</span></Link><nav className="nav"><Link href="/dossie">Dossiê</Link><Link href="/fontes">Fontes</Link><Link href="/privacidade">Privacidade</Link></nav><Link className="button compact" href="/enviar">Enviar evidência</Link></div></header>
    <section className="container form-hero"><p className="eyebrow">CATÁLOGO DE FONTES PRIMÁRIAS E INSTITUCIONAIS</p><h1>O caminho de volta até <em>o documento original.</em></h1><p className="lead">A transparência do método depende de permitir que qualquer pessoa refaça a consulta. Este catálogo privilegia fontes oficiais e registra a função de cada uma no dossiê.</p></section>
    <section className="container section sources-list">
      {Object.entries(labels).map(([group,label]) => <div className="source-group" key={group}><div><p className="eyebrow">{label}</p></div><div>{sourceCatalog.filter(s=>s.group===group).map(s=><a className="source-row" href={s.href} target="_blank" rel="noreferrer" key={s.id}><span>{s.date}</span><div><h2>{s.title}</h2><p><b>{s.organization}</b> — {s.summary}</p></div><strong>↗</strong></a>)}</div></div>)}
    </section>
    <footer><div className="container footer-inner"><div><strong>Regra editorial</strong><p>Quando possível, fatos do dossiê devem apontar para fonte primária oficial.</p></div><Link href="/dossie">Voltar ao dossiê →</Link></div></footer>
  </main>;
}
