'use client';

import { useMemo, useState } from 'react';
import type { PublicCase } from '@/lib/cases';
import type { IntelligenceRecord } from '@/lib/intelligence';
import type { PrivateSubmission } from '@/lib/private-data';

type Ranking = { label: string; count: number };
type SourceRow = {
  id: string; name: string; organization: string; category: string; url: string;
  access: string; scope: string; capabilities: string[]; origin: string;
};
type EntityRow = { name: string; type: string; identifier?: string; mentions: number; roles: string[] };
type RelationRow = { from: string; to: string; type: string; description?: string };
type SourceArchiveRow = { sourceId:string; originalUrl:string; finalUrl:string; title?:string; publisher?:string; retrievedAt:string; httpStatus:number; contentType:string; size:number; sha256:string; etag?:string; lastModified?:string; rawBlobPath:string; manifestBlobPath:string; certificateSha256:string; certificateValid:boolean; notes?:string[] };

type DashboardData = {
  generatedAt: string;
  metrics: {
    submissions: number; identified: number; anonymous: number; evidenceFiles: number; evidenceBytes: number;
    municipalities: number; categories: number; publicCases: number; intelligenceRecords: number;
    researchFindings: number; sourceInventory: number; entities: number; relationships: number; highPriority: number;
    withEvidence: number; withEventDate: number; missingReferencedEvidence: number; orphanEvidence: number;
    archivedSources: number; archivedSourceBytes: number; validSourceCertificates: number;
  };
  rankings: {
    municipalities: Ranking[]; categories: Ranking[]; statuses: Ranking[]; verificationLevels: Ranking[];
    intelligenceKinds: Ranking[]; sourcePublishers: Ranking[]; dailySubmissions: Ranking[];
  };
  quality: {
    evidenceCoverage: number; eventDateCoverage: number; intelligenceWithSource: number; intelligenceWithMunicipality: number;
    missingReferencedEvidence: string[]; orphanEvidence: { pathname: string; size: number; uploadedAt: string }[];
  };
  financial: {
    announced: number; committed: number; liquidated: number; paid: number; contractValue: number; amendmentValue: number;
  };
  submissions: PrivateSubmission[];
  publicCases: PublicCase[];
  intelligence: IntelligenceRecord[];
  findings: IntelligenceRecord[];
  entities: EntityRow[];
  relationships: RelationRow[];
  queue: IntelligenceRecord[];
  sources: SourceRow[];
  sourceArchives: SourceArchiveRow[];
};

type Tab = 'overview' | 'submissions' | 'findings' | 'sources' | 'provenance' | 'entities' | 'relations' | 'municipalities' | 'reports' | 'api';

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
function formatDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('pt-BR');
}
function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: value >= 1_000_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value || 0);
}
function levelClass(level: string) {
  return `intel-level intel-level-${level.toLowerCase()}`;
}
function priorityClass(priority: string) {
  return `intel-priority intel-priority-${priority}`;
}

export default function PrivateDashboardClient({ data }: { data: DashboardData }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('Todos');
  const [intelQuery, setIntelQuery] = useState('');
  const [intelKind, setIntelKind] = useState('Todos');
  const [sourceQuery, setSourceQuery] = useState('');
  const [archiveUrl,setArchiveUrl]=useState('');
  const [archiveSourceId,setArchiveSourceId]=useState('');
  const [archiveTitle,setArchiveTitle]=useState('');
  const [archivePublisher,setArchivePublisher]=useState('');
  const [archiveMessage,setArchiveMessage]=useState('');
  const [archiving,setArchiving]=useState(false);

  const visibleSubmissions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return data.submissions.filter((item) => {
      if (mode !== 'Todos' && item.mode !== mode) return false;
      if (!normalized) return true;
      return [item.protocol,item.municipality,item.locality,item.category,item.peopleOrEntities,item.statement,item.sourceContext,item.contact?.name,item.contact?.email]
        .join(' ').toLocaleLowerCase('pt-BR').includes(normalized);
    });
  }, [data.submissions, query, mode]);

  const visibleIntel = useMemo(() => {
    const normalized = intelQuery.trim().toLocaleLowerCase('pt-BR');
    return data.intelligence.filter((item) => {
      if (intelKind !== 'Todos' && item.kind !== intelKind) return false;
      if (!normalized) return true;
      return [item.recordId,item.title,item.summary,item.content,item.municipality,item.provenance?.publisher,...(item.tags || []),...(item.entities || []).map((e) => e.name)]
        .join(' ').toLocaleLowerCase('pt-BR').includes(normalized);
    });
  }, [data.intelligence, intelQuery, intelKind]);

  const visibleSources = useMemo(() => {
    const normalized = sourceQuery.trim().toLocaleLowerCase('pt-BR');
    if (!normalized) return data.sources;
    return data.sources.filter((item) => [item.name,item.organization,item.category,item.scope,...(item.capabilities || [])].join(' ').toLocaleLowerCase('pt-BR').includes(normalized));
  }, [data.sources, sourceQuery]);

  async function archiveSource() {
    if (!archiveUrl.trim()) return;
    setArchiving(true); setArchiveMessage('');
    try {
      const response=await fetch('/api/private/source-archive',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url:archiveUrl,sourceId:archiveSourceId,title:archiveTitle,publisher:archivePublisher})});
      const payload=await response.json();
      if(!response.ok) throw new Error(payload?.error||'Falha ao arquivar.');
      setArchiveMessage(`Snapshot preservado: ${payload.record.sha256}`);
      window.setTimeout(()=>window.location.reload(),700);
    } catch (error) { setArchiveMessage(error instanceof Error?error.message:'Falha ao arquivar.'); }
    finally { setArchiving(false); }
  }

  async function logout() {
    await fetch('/api/private/logout', { method: 'POST' });
    window.location.href = '/privado/login';
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'submissions', label: 'Denúncias', count: data.metrics.submissions },
    { id: 'findings', label: 'Inteligência', count: data.metrics.intelligenceRecords },
    { id: 'sources', label: 'Fontes', count: data.metrics.sourceInventory },
    { id: 'provenance', label: 'Proveniência', count: data.metrics.archivedSources },
    { id: 'entities', label: 'Entidades', count: data.metrics.entities },
    { id: 'relations', label: 'Relações', count: data.metrics.relationships },
    { id: 'municipalities', label: 'Municípios', count: data.metrics.municipalities },
    { id: 'reports', label: 'Relatórios' },
    { id: 'api', label: 'Intel API' },
  ];

  return (
    <>
      <header className="private-topbar intel-topbar">
        <div>
          <span className="private-topbar-mark">OE</span>
          <div><strong>Cockpit de Inteligência</strong><small>Observatório Eleitoral Bahia 2026 · ambiente reservado</small></div>
        </div>
        <div className="private-topbar-actions">
          <a href="/api/private/export?format=csv">Denúncias CSV</a>
          <a href="/api/private/export?format=csv&scope=intelligence">Intel CSV</a>
          <a href="/api/private/export?format=json">Base completa JSON</a>
          <button type="button" onClick={logout}>Sair</button>
        </div>
      </header>

      <div className="intel-shell">
        <aside className="intel-sidebar">
          <div className="intel-sidebar-title"><span>COCKPIT</span><strong>Investigação</strong></div>
          <nav>
            {tabs.map((item) => (
              <button key={item.id} type="button" className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
                <span>{item.label}</span>{typeof item.count === 'number' ? <b>{item.count}</b> : null}
              </button>
            ))}
          </nav>
          <div className="intel-sidebar-note">
            <strong>Não público</strong>
            <span>Relatos, contatos, achados e relações ainda não corroboradas permanecem internos.</span>
          </div>
        </aside>

        <main className="private-dashboard intel-dashboard">
          <section className="private-dashboard-heading intel-heading">
            <div>
              <p className="eyebrow">INTELIGÊNCIA · PROVENIÊNCIA · CRUZAMENTOS</p>
              <h1>{tab === 'overview' ? 'Visão consolidada da investigação.' : tabs.find((item) => item.id === tab)?.label}</h1>
              <p>Atualizado em {formatDate(data.generatedAt)}. O cockpit diferencia denúncia, fonte, achado analítico, entidade, relação e caso público.</p>
            </div>
            <div className="private-security-note"><strong>ACESSO RESTRITO</strong><span>Não compartilhar dados pessoais, relações não corroboradas ou hipóteses internas.</span></div>
          </section>

          {tab === 'overview' && (
            <>
              <section className="intel-metrics-grid">
                <article><span>Denúncias</span><strong>{data.metrics.submissions}</strong><small>{data.metrics.anonymous} sem identificação · {data.metrics.identified} identificadas</small></article>
                <article><span>Registros Intel</span><strong>{data.metrics.intelligenceRecords}</strong><small>{data.metrics.researchFindings} achados analíticos</small></article>
                <article><span>Fontes</span><strong>{data.metrics.sourceInventory}</strong><small>catálogo + fontes de pesquisa + ingeridas</small></article>
                <article><span>Snapshots</span><strong>{data.metrics.archivedSources}</strong><small>{formatBytes(data.metrics.archivedSourceBytes)} preservados · {data.metrics.validSourceCertificates} certificados íntegros</small></article>
                <article><span>Municípios</span><strong>{data.metrics.municipalities}</strong><small>presentes em denúncias ou inteligência</small></article>
                <article><span>Entidades</span><strong>{data.metrics.entities}</strong><small>pessoas, empresas, órgãos e fornecedores</small></article>
                <article><span>Relações</span><strong>{data.metrics.relationships}</strong><small>vínculos registrados para análise</small></article>
                <article><span>Fila prioritária</span><strong>{data.metrics.highPriority}</strong><small>itens high/urgent em apuração</small></article>
                <article><span>Evidências</span><strong>{data.metrics.evidenceFiles}</strong><small>{formatBytes(data.metrics.evidenceBytes)} privados</small></article>
              </section>

              <section className="private-grid-two">
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">QUALIDADE DOS DADOS</p><h2>Cobertura e proveniência</h2></div></div>
                  <div className="quality-grid">
                    <div><strong>{data.quality.evidenceCoverage}%</strong><span>denúncias com evidência</span></div>
                    <div><strong>{data.quality.eventDateCoverage}%</strong><span>denúncias com data do fato</span></div>
                    <div><strong>{data.quality.intelligenceWithSource}%</strong><span>registros Intel com URL de fonte</span></div>
                    <div><strong>{data.quality.intelligenceWithMunicipality}%</strong><span>registros Intel vinculados a município</span></div>
                  </div>
                </article>

                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">ESTADO PROBATÓRIO</p><h2>Distribuição</h2></div></div>
                  <div className="intel-level-ranking">
                    {data.rankings.verificationLevels.map((item) => <div key={item.label}><span className={levelClass(item.label)}>{item.label}</span><strong>{item.count}</strong><i style={{width:`${Math.max(6,(item.count/Math.max(1,...data.rankings.verificationLevels.map((r)=>r.count)))*100)}%`}} /></div>)}
                  </div>
                </article>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">FILA DE INVESTIGAÇÃO</p><h2>Próximos itens a trabalhar</h2></div><button className="intel-link-button" onClick={()=>setTab('findings')}>Ver tudo →</button></div>
                <div className="intel-queue">
                  {data.queue.length ? data.queue.slice(0,8).map((item) => (
                    <div key={item.recordId}>
                      <span className={priorityClass(item.priority)}>{item.priority}</span>
                      <div><strong>{item.title}</strong><small>{item.recordId} · {item.kind} · {item.municipality || 'sem município'}</small></div>
                      <span className={levelClass(item.evidenceLevel)}>{item.evidenceLevel}</span>
                    </div>
                  )) : <p>Nenhum registro de inteligência aguardando apuração ainda.</p>}
                </div>
              </section>

              <section className="private-grid-two">
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">MUNICÍPIOS</p><h2>Maior volume de registros</h2></div></div>
                  <div className="ranking-list">{data.rankings.municipalities.slice(0,10).map((item)=><div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>)}</div>
                </article>
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">TIPOS DE INTELIGÊNCIA</p><h2>Composição da base</h2></div></div>
                  <div className="ranking-list">{data.rankings.intelligenceKinds.length ? data.rankings.intelligenceKinds.map((item)=><div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>) : <p>Nenhum registro externo ingerido ainda.</p>}</div>
                </article>
              </section>
            </>
          )}

          {tab === 'submissions' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading">
                <div><p className="eyebrow">DENÚNCIAS RECEBIDAS</p><h2>Base privada</h2></div>
                <div className="private-filters">
                  <input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Protocolo, município, texto…" />
                  <select value={mode} onChange={(e)=>setMode(e.target.value)}><option>Todos</option><option value="anonymous">sem identificação</option><option value="identified">identificada</option></select>
                </div>
              </div>
              <div className="private-submissions">
                {visibleSubmissions.map((item) => (
                  <details className="private-submission-card" key={item.submissionId}>
                    <summary><div><strong>{item.protocol}</strong><span>{item.municipality} · {item.category}</span></div><div><span>{item.mode==='identified'?'Identificada':'Sem identificação'}</span><time>{formatDate(item.createdAt)}</time></div></summary>
                    <div className="private-submission-body">
                      <div className="private-submission-meta"><div><small>Localidade</small><strong>{item.locality||'—'}</strong></div><div><small>Data</small><strong>{item.eventDate||'—'}</strong></div><div><small>Status</small><strong>{item.status||'—'}</strong></div><div><small>Nível</small><strong>{item.review?.verificationLevel||'L0'}</strong></div></div>
                      {item.contact?<div className="private-contact"><small>CONTATO</small><p><strong>{item.contact.name||'—'}</strong> · {item.contact.email||'—'} · {item.contact.phone||'—'}</p></div>:null}
                      <div className="private-text-block"><small>PESSOAS / ÓRGÃOS / EMPRESAS</small><p>{item.peopleOrEntities||'—'}</p></div>
                      <div className="private-text-block"><small>RELATO</small><p>{item.statement||'—'}</p></div>
                      <div className="private-text-block"><small>ORIGEM / CONTEXTO</small><p>{item.sourceContext||'—'}</p></div>
                      <div className="private-evidence-list"><small>EVIDÊNCIAS ({item.evidence?.length||0})</small>{(item.evidence||[]).map((evidence)=><a key={evidence.pathname} href={`/api/private/evidence?pathname=${encodeURIComponent(evidence.pathname)}&name=${encodeURIComponent(evidence.originalName||'evidencia')}`}><span>{evidence.originalName||evidence.pathname}</span><b>{formatBytes(evidence.size)}</b><em>baixar ↓</em></a>)}</div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {tab === 'findings' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading">
                <div><p className="eyebrow">INTELIGÊNCIA INGESTADA</p><h2>Achados, contas e registros</h2></div>
                <div className="private-filters">
                  <input type="search" value={intelQuery} onChange={(e)=>setIntelQuery(e.target.value)} placeholder="Buscar achado, entidade, município…" />
                  <select value={intelKind} onChange={(e)=>setIntelKind(e.target.value)}><option>Todos</option>{Array.from(new Set(data.intelligence.map((item)=>item.kind))).map((kind)=><option key={kind}>{kind}</option>)}</select>
                </div>
              </div>
              <div className="intel-record-list">
                {visibleIntel.length ? visibleIntel.map((item)=>(
                  <details key={item.recordId} className="intel-record">
                    <summary>
                      <span className={priorityClass(item.priority)}>{item.priority}</span>
                      <div><strong>{item.title}</strong><small>{item.recordId} · {item.kind} · {item.municipality||'sem município'}</small></div>
                      <span className={levelClass(item.evidenceLevel)}>{item.evidenceLevel}</span>
                    </summary>
                    <div className="intel-record-body">
                      <p>{item.summary}</p>
                      {item.content?<div className="private-text-block"><small>CONTEÚDO / ANÁLISE</small><p>{item.content}</p></div>:null}
                      <div className="intel-record-meta"><div><span>Status</span><b>{item.status}</b></div><div><span>Confiança analítica</span><b>{item.analyticalConfidence!==undefined?`${Math.round(item.analyticalConfidence*100)}%`:'—'}</b></div><div><span>Coletado</span><b>{formatDate(item.collectedAt)}</b></div><div><span>Fonte</span><b>{item.provenance?.publisher||'—'}</b></div></div>
                      {item.provenance?.sourceUrl?<a className="intel-source-link" href={item.provenance.sourceUrl} target="_blank" rel="noreferrer">Abrir fonte original ↗</a>:null}
                      {(item.entities||[]).length?<div className="intel-chip-list">{item.entities?.map((entity)=><span key={entity.name+entity.type}>{entity.name}<small>{entity.type}{entity.role?` · ${entity.role}`:''}</small></span>)}</div>:null}
                    </div>
                  </details>
                )):<p>Nenhum registro de inteligência ingerido ainda.</p>}
              </div>
            </section>
          )}

          {tab === 'sources' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading"><div><p className="eyebrow">INVENTÁRIO DE FONTES</p><h2>Onde pesquisar e de onde vieram os dados</h2></div><div className="private-filters"><input value={sourceQuery} onChange={(e)=>setSourceQuery(e.target.value)} placeholder="TSE, contratos, despesas…" /></div></div>
              <div className="intel-source-grid">
                {visibleSources.map((source)=>(
                  <article key={source.origin+source.id}>
                    <div><span>{source.category}</span><b>{source.access}</b></div>
                    <h3>{source.name}</h3><p>{source.organization}</p><small>{source.scope}</small>
                    <ul>{(source.capabilities||[]).slice(0,5).map((item)=><li key={item}>{item}</li>)}</ul>
                    {source.url?<a href={source.url} target="_blank" rel="noreferrer">Abrir fonte ↗</a>:null}
                  </article>
                ))}
              </div>
            </section>
          )}

          {tab === 'entities' && (
            <section className="private-panel">
              <div className="private-panel-title"><div><p className="eyebrow">ÍNDICE DE ENTIDADES</p><h2>Pessoas, empresas, órgãos e fornecedores</h2></div></div>
              <div className="intel-entity-table">
                <div className="intel-table-head"><span>Entidade</span><span>Tipo</span><span>Identificador</span><span>Menções</span><span>Papéis</span></div>
                {data.entities.map((item)=><div key={item.type+item.identifier+item.name}><strong>{item.name}</strong><span>{item.type}</span><code>{item.identifier||'—'}</code><b>{item.mentions}</b><span>{item.roles.join(', ')||'—'}</span></div>)}
              </div>
            </section>
          )}

          {tab === 'relations' && (
            <section className="private-panel">
              <div className="private-panel-title"><div><p className="eyebrow">GRAFO RELACIONAL</p><h2>Vínculos registrados para análise</h2></div></div>
              <div className="intel-relations">
                {data.relationships.length ? data.relationships.map((item,index)=><div key={index}><strong>{item.from}</strong><span>{item.type}</span><strong>{item.to}</strong><p>{item.description||''}</p></div>):<p>Nenhuma relação estruturada ingerida ainda. A Intel API já aceita relações entre entidades.</p>}
              </div>
            </section>
          )}

          {tab === 'municipalities' && (
            <section className="private-grid-two">
              <article className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">COBERTURA TERRITORIAL</p><h2>Municípios na base</h2></div></div>
                <div className="intel-municipality-list">{data.rankings.municipalities.map((item,index)=><div key={item.label}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.label}</strong><b>{item.count}</b></div>)}</div>
              </article>
              <article className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">OBJETIVO</p><h2>Matriz dos 417 municípios</h2></div></div>
                <div className="intel-coverage-number"><strong>{data.metrics.municipalities}</strong><span>com informação na base</span><i>{Math.round((data.metrics.municipalities/417)*100)}%</i></div>
                <p className="private-report-note">O número indica cobertura de dados, não suspeita nem irregularidade. A meta é completar a matriz de origem → transferência → contratação → execução → contexto.</p>
              </article>
            </section>
          )}

          {tab === 'reports' && (
            <>
              <section className="intel-metrics-grid reports">
                <article><span>Anunciado</span><strong>{money(data.financial.announced)}</strong><small>soma bruta dos valores anotados; pode haver sobreposição entre pacotes e subitens</small></article>
                <article><span>Empenhado</span><strong>{money(data.financial.committed)}</strong><small>quando disponível</small></article>
                <article><span>Liquidado</span><strong>{money(data.financial.liquidated)}</strong><small>quando disponível</small></article>
                <article><span>Pago</span><strong>{money(data.financial.paid)}</strong><small>movimentação efetiva registrada</small></article>
              </section>
              <section className="private-grid-two">
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">EDITORES / FONTES</p><h2>Publicadores mais presentes</h2></div></div>
                  <div className="ranking-list">{data.rankings.sourcePublishers.length?data.rankings.sourcePublishers.slice(0,12).map((item)=><div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>):<p>Aguardando ingestão de pesquisa externa.</p>}</div>
                </article>
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">INTEGRIDADE</p><h2>Alertas da base</h2></div></div>
                  <div className="quality-grid"><div><strong>{data.metrics.missingReferencedEvidence}</strong><span>evidências referenciadas ausentes</span></div><div><strong>{data.metrics.orphanEvidence}</strong><span>arquivos órfãos</span></div><div><strong>{100-data.quality.intelligenceWithSource}%</strong><span>Intel sem URL de fonte</span></div><div><strong>{100-data.quality.intelligenceWithMunicipality}%</strong><span>Intel sem município</span></div></div>
                </article>
              </section>
              <section className="private-panel private-report">
                <div className="private-panel-title"><div><p className="eyebrow">EXPORTAÇÃO ANALÍTICA</p><h2>Extrair por domínio</h2></div></div>
                <div className="intel-export-links"><a href="/api/private/export?format=csv">Denúncias CSV</a><a href="/api/private/export?format=csv&scope=intelligence">Inteligência CSV</a><a href="/api/private/export?format=csv&scope=sources">Fontes CSV</a><a href="/api/private/export?format=csv&scope=entities">Entidades CSV</a><a href="/api/private/export?format=csv&scope=relationships">Relações CSV</a><a href="/api/private/export?format=json">Base completa JSON</a></div>
              </section>
              <section className="private-panel private-report">
                <div className="private-panel-title"><div><p className="eyebrow">LEITURA AUTOMÁTICA</p><h2>Resumo operacional</h2></div></div>
                <p>Há <strong>{data.metrics.submissions}</strong> denúncia(s), <strong>{data.metrics.intelligenceRecords}</strong> registro(s) de inteligência, <strong>{data.metrics.sourceInventory}</strong> fonte(s) catalogada(s) e <strong>{data.metrics.entities}</strong> entidade(s) indexada(s). A fila prioritária contém <strong>{data.metrics.highPriority}</strong> item(ns).</p>
                <p className="private-report-note">Esses números descrevem a base. Eles não atribuem culpa, dolo, abuso ou irregularidade. Qualquer conclusão depende de análise documental e jurídica humana.</p>
              </section>
            </>
          )}

          {tab === 'provenance' && (
            <>
              <section className="private-panel source-archive-form">
                <div className="private-panel-title"><div><p className="eyebrow">PRESERVAÇÃO PROBATÓRIA</p><h2>Arquivar fonte pública</h2></div></div>
                <p className="private-report-note">A coleta salva uma cópia bruta em Blob privado e registra SHA-256, URL original/final, data/hora e cabeçalhos HTTP. O hash permite comprovar posteriormente que o arquivo preservado não foi alterado.</p>
                <div className="source-archive-fields"><input value={archiveUrl} onChange={(e)=>setArchiveUrl(e.target.value)} placeholder="https://fonte-oficial..." /><input value={archiveSourceId} onChange={(e)=>setArchiveSourceId(e.target.value)} placeholder="ID curto da fonte (opcional)" /><input value={archiveTitle} onChange={(e)=>setArchiveTitle(e.target.value)} placeholder="Título (opcional)" /><input value={archivePublisher} onChange={(e)=>setArchivePublisher(e.target.value)} placeholder="Órgão/publicador (opcional)" /></div>
                <button type="button" className="source-archive-button" disabled={archiving||!archiveUrl.trim()} onClick={archiveSource}>{archiving?'Preservando…':'Preservar snapshot'}</button>
                {archiveMessage?<p className="source-archive-message">{archiveMessage}</p>:null}
              </section>
              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">CADEIA DE PROVENIÊNCIA</p><h2>Snapshots preservados</h2></div><span>{data.metrics.validSourceCertificates}/{data.metrics.archivedSources} certificados íntegros</span></div>
                <div className="source-archive-list">
                  {data.sourceArchives.length?data.sourceArchives.map((item)=><article key={item.manifestBlobPath}>
                    <div className="source-archive-head"><div><strong>{item.title||item.sourceId}</strong><small>{item.publisher||new URL(item.originalUrl).hostname}</small></div><span className={item.certificateValid?'source-cert-ok':'source-cert-bad'}>{item.certificateValid?'SHA ✓':'REVISAR'}</span></div>
                    <p>{item.originalUrl}</p>
                    <div className="source-archive-meta"><span><b>Coleta</b>{formatDate(item.retrievedAt)}</span><span><b>HTTP</b>{item.httpStatus}</span><span><b>Tipo</b>{item.contentType}</span><span><b>Tamanho</b>{formatBytes(item.size)}</span></div>
                    <div className="source-hash"><small>SHA-256 DO ARQUIVO</small><code>{item.sha256}</code></div>
                    <div className="source-hash"><small>HASH DO CERTIFICADO</small><code>{item.certificateSha256}</code></div>
                    <div className="source-archive-actions"><a href={item.originalUrl} target="_blank" rel="noreferrer">Fonte original ↗</a><a href={`/api/private/source-archive/file?pathname=${encodeURIComponent(item.rawBlobPath)}&name=${encodeURIComponent(item.sourceId)}`}>Baixar cópia preservada ↓</a></div>
                  </article>):<p>Nenhum snapshot preservado ainda.</p>}
                </div>
              </section>
            </>
          )}

          {tab === 'api' && (
            <section className="private-panel api-panel">
              <div className="private-panel-title"><div><p className="eyebrow">INTEL API · V1</p><h2>Entrada para pesquisas profundas, scripts e agentes</h2></div></div>
              <p>A API é server-to-server e usa uma chave própria. A chave não é exibida pelo cockpit porque a Vercel armazena somente seu hash.</p>
              <div className="api-endpoints">
                <div><span>POST</span><code>/api/intelligence/ingest</code><p>Ingere um registro ou lote de até 100 registros.</p></div>
                <div><span>GET</span><code>/api/intelligence/query</code><p>Consulta registros por kind, município, status, nível, caso ou texto.</p></div>
              </div>
              <h3>Tipos aceitos</h3>
              <div className="intel-chip-list">{['complaint','public_source','research_finding','financial_record','electoral_account','entity','relationship','municipal_fact','legal_reference'].map((item)=><span key={item}>{item}</span>)}</div>
              <h3>Exemplo de payload</h3>
              <pre className="api-code">{JSON.stringify({
                kind:'research_finding',title:'Pagamento identificado em fonte pública',
                summary:'Resumo objetivo sem inferir ilícito.',municipality:'Irecê',
                eventDate:'2026-07-10',status:'triage',evidenceLevel:'L2',priority:'high',
                analyticalConfidence:0.82,caseIds:['OE-BA-0002'],
                provenance:{sourceUrl:'https://fonte-oficial.example/',publisher:'Órgão público',method:'web_research'}
              },null,2)}</pre>
              <p className="private-report-note">Para cruzamentos de contas eleitorais, use <code>electoral_account</code>; para pagamentos e execução financeira, <code>financial_record</code>; para relações societárias ou eleitorais documentadas, use <code>relationship</code> e identifique a fonte no campo <code>provenance</code>.</p>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
