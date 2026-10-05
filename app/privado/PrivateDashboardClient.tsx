'use client';

import { useMemo, useState } from 'react';
import type { PublicCase } from '@/lib/cases';
import type { PrivateSubmission } from '@/lib/private-data';

type Ranking = { label: string; count: number };

type DashboardData = {
  generatedAt: string;
  metrics: {
    submissions: number;
    identified: number;
    anonymous: number;
    evidenceFiles: number;
    evidenceBytes: number;
    municipalities: number;
    categories: number;
    publicCases: number;
    withEvidence: number;
    withEventDate: number;
    missingReferencedEvidence: number;
    orphanEvidence: number;
  };
  rankings: {
    municipalities: Ranking[];
    categories: Ranking[];
    statuses: Ranking[];
    verificationLevels: Ranking[];
    dailySubmissions: Ranking[];
  };
  quality: {
    evidenceCoverage: number;
    eventDateCoverage: number;
    missingReferencedEvidence: string[];
    orphanEvidence: { pathname: string; size: number; uploadedAt: string }[];
  };
  submissions: PrivateSubmission[];
  publicCases: PublicCase[];
};

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

export default function PrivateDashboardClient({ data }: { data: DashboardData }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('Todos');

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return data.submissions.filter((item) => {
      if (mode !== 'Todos' && item.mode !== mode) return false;
      if (!normalized) return true;
      return [
        item.protocol,
        item.municipality,
        item.locality,
        item.category,
        item.peopleOrEntities,
        item.statement,
        item.sourceContext,
        item.contact?.name,
        item.contact?.email,
      ].join(' ').toLocaleLowerCase('pt-BR').includes(normalized);
    });
  }, [data.submissions, query, mode]);

  async function logout() {
    await fetch('/api/private/logout', { method: 'POST' });
    window.location.href = '/privado/login';
  }

  return (
    <>
      <header className="private-topbar">
        <div>
          <span className="private-topbar-mark">OE</span>
          <div><strong>Painel de Inteligência</strong><small>Observatório Eleitoral Bahia 2026</small></div>
        </div>
        <div className="private-topbar-actions">
          <a href="/api/private/export?format=csv">Exportar CSV</a>
          <a href="/api/private/export?format=json">Exportar JSON</a>
          <button type="button" onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="private-dashboard">
        <section className="private-dashboard-heading">
          <div>
            <p className="eyebrow">VISÃO CONSOLIDADA · NÃO PÚBLICA</p>
            <h1>Dados, evidências e inteligência analítica.</h1>
            <p>Atualizado em {formatDate(data.generatedAt)}. Estes dados incluem material não verificado e informações de contato que não devem ser publicados.</p>
          </div>
          <div className="private-security-note">
            <strong>ACESSO RESTRITO</strong>
            <span>Não compartilhar capturas contendo dados pessoais ou narrativas não corroboradas.</span>
          </div>
        </section>

        <section className="private-metrics">
          <article><span>Submissões</span><strong>{data.metrics.submissions}</strong><small>{data.metrics.anonymous} anônimas · {data.metrics.identified} identificadas</small></article>
          <article><span>Evidências</span><strong>{data.metrics.evidenceFiles}</strong><small>{formatBytes(data.metrics.evidenceBytes)} armazenados</small></article>
          <article><span>Municípios</span><strong>{data.metrics.municipalities}</strong><small>com relatos recebidos</small></article>
          <article><span>Casos públicos</span><strong>{data.metrics.publicCases}</strong><small>registro público separado</small></article>
        </section>

        <section className="private-grid-two">
          <article className="private-panel">
            <div className="private-panel-title"><div><p className="eyebrow">QUALIDADE DOS DADOS</p><h2>Cobertura documental</h2></div></div>
            <div className="quality-grid">
              <div><strong>{data.quality.evidenceCoverage}%</strong><span>submissões com ao menos uma evidência</span></div>
              <div><strong>{data.quality.eventDateCoverage}%</strong><span>submissões com data do fato informada</span></div>
              <div><strong>{data.metrics.missingReferencedEvidence}</strong><span>referências de arquivo ausentes</span></div>
              <div><strong>{data.metrics.orphanEvidence}</strong><span>arquivos sem manifesto associado</span></div>
            </div>
          </article>

          <article className="private-panel">
            <div className="private-panel-title"><div><p className="eyebrow">LEITURA ANALÍTICA</p><h2>Distribuição atual</h2></div></div>
            <div className="ranking-list">
              <h3>Municípios</h3>
              {data.rankings.municipalities.slice(0, 6).map((item) => (
                <div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>
              ))}
              <h3>Categorias</h3>
              {data.rankings.categories.slice(0, 6).map((item) => (
                <div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>
              ))}
            </div>
          </article>
        </section>

        <section className="private-panel private-report">
          <div className="private-panel-title">
            <div><p className="eyebrow">RELATÓRIO AUTOMÁTICO</p><h2>Resumo operacional</h2></div>
          </div>
          <div className="private-report-grid">
            <div><b>{data.metrics.submissions}</b><p>submissões recebidas no canal privado.</p></div>
            <div><b>{data.metrics.withEvidence}</b><p>submissões possuem material anexado.</p></div>
            <div><b>{data.metrics.identified}</b><p>submissões permitem contato posterior com o remetente.</p></div>
            <div><b>{data.metrics.publicCases}</b><p>itens constam hoje do registro público, sem publicação automática de relatos privados.</p></div>
          </div>
          <p className="private-report-note">
            A análise automática é descritiva. Ela não atribui autoria, dolo, irregularidade ou nexo eleitoral. A elevação de um relato para L2/L3/L4 exige revisão humana e corroboração documental.
          </p>
        </section>

        <section className="private-panel">
          <div className="private-panel-title submissions-heading">
            <div><p className="eyebrow">SUBMISSÕES RECEBIDAS</p><h2>Base privada</h2></div>
            <div className="private-filters">
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar protocolo, município, texto…" />
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Todos</option><option value="anonymous">anonymous</option><option value="identified">identified</option>
              </select>
            </div>
          </div>

          <div className="private-submissions">
            {visible.length === 0 ? <p>Nenhuma submissão corresponde aos filtros.</p> : visible.map((item) => (
              <details className="private-submission-card" key={item.submissionId}>
                <summary>
                  <div><strong>{item.protocol}</strong><span>{item.municipality} · {item.category}</span></div>
                  <div><span>{item.mode === 'identified' ? 'Identificada' : 'Sem identificação'}</span><time>{formatDate(item.createdAt)}</time></div>
                </summary>
                <div className="private-submission-body">
                  <div className="private-submission-meta">
                    <div><small>Localidade</small><strong>{item.locality || '—'}</strong></div>
                    <div><small>Data do fato</small><strong>{item.eventDate || '—'}</strong></div>
                    <div><small>Status</small><strong>{item.status || '—'}</strong></div>
                    <div><small>Nível</small><strong>{item.review?.verificationLevel || 'unreviewed'}</strong></div>
                  </div>

                  {item.contact ? (
                    <div className="private-contact">
                      <small>CONTATO IDENTIFICADO</small>
                      <p><strong>{item.contact.name || '—'}</strong> · {item.contact.email || '—'} · {item.contact.phone || '—'}</p>
                    </div>
                  ) : null}

                  <div className="private-text-block"><small>PESSOAS / ÓRGÃOS / EMPRESAS CITADOS</small><p>{item.peopleOrEntities || '—'}</p></div>
                  <div className="private-text-block"><small>RELATO</small><p>{item.statement || '—'}</p></div>
                  <div className="private-text-block"><small>ORIGEM / CONTEXTO</small><p>{item.sourceContext || '—'}</p></div>

                  <div className="private-evidence-list">
                    <small>EVIDÊNCIAS ({item.evidence?.length || 0})</small>
                    {(item.evidence || []).map((evidence) => (
                      <a
                        key={evidence.pathname}
                        href={`/api/private/evidence?pathname=${encodeURIComponent(evidence.pathname)}&name=${encodeURIComponent(evidence.originalName || 'evidencia')}`}
                      >
                        <span>{evidence.originalName || evidence.pathname}</span>
                        <b>{formatBytes(evidence.size)}</b>
                        <em>baixar ↓</em>
                      </a>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="private-panel">
          <div className="private-panel-title"><div><p className="eyebrow">REGISTRO PÚBLICO</p><h2>Casos publicados</h2></div></div>
          <div className="private-public-cases">
            {data.publicCases.map((item) => (
              <div key={item.id}><strong>{item.id}</strong><span>{item.dateLabel}</span><p>{item.title}</p><b>{item.evidenceLevel}</b></div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
