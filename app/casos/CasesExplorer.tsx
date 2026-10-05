'use client';

import { useMemo, useState } from 'react';
import type { PublicCase } from '@/lib/cases';
import type { SourceItem } from '@/lib/content';

type Props = {
  cases: PublicCase[];
  sources: SourceItem[];
};

const all = 'Todos';

export default function CasesExplorer({ cases, sources }: Props) {
  const [query, setQuery] = useState('');
  const [municipality, setMunicipality] = useState(all);
  const [category, setCategory] = useState(all);
  const [status, setStatus] = useState(all);
  const [level, setLevel] = useState(all);

  const municipalities = useMemo(
    () => [all, ...Array.from(new Set(cases.map((item) => item.municipality))).sort()],
    [cases],
  );
  const categories = useMemo(
    () => [all, ...Array.from(new Set(cases.map((item) => item.category))).sort()],
    [cases],
  );
  const statuses = useMemo(
    () => [all, ...Array.from(new Set(cases.map((item) => item.status))).sort()],
    [cases],
  );
  const levels = useMemo(
    () => [all, ...Array.from(new Set(cases.map((item) => item.evidenceLevel))).sort()],
    [cases],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return cases
      .filter((item) => municipality === all || item.municipality === municipality)
      .filter((item) => category === all || item.category === category)
      .filter((item) => status === all || item.status === status)
      .filter((item) => level === all || item.evidenceLevel === level)
      .filter((item) => {
        if (!normalized) return true;
        return [
          item.id,
          item.title,
          item.summary,
          item.auditQuestion,
          item.municipality,
          item.category,
          item.status,
          ...item.tags,
        ]
          .join(' ')
          .toLocaleLowerCase('pt-BR')
          .includes(normalized);
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [cases, query, municipality, category, status, level]);

  function resetFilters() {
    setQuery('');
    setMunicipality(all);
    setCategory(all);
    setStatus(all);
    setLevel(all);
  }

  function sourceById(id: string) {
    return sources.find((source) => source.id === id);
  }

  return (
    <>
      <section className="cases-filter-panel" aria-label="Filtros do registro público">
        <div className="cases-search">
          <label htmlFor="case-search">Buscar no registro</label>
          <input
            id="case-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ID, data, tema, município, valor…"
          />
        </div>

        <div className="cases-filter-grid">
          <label>
            Município / escopo
            <select value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
              {municipalities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Categoria
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {statuses.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Evidência
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              {levels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <div className="cases-filter-footer">
          <p><strong>{filtered.length}</strong> de {cases.length} ocorrências públicas exibidas</p>
          <button type="button" className="filter-reset" onClick={resetFilters}>Limpar filtros</button>
        </div>
      </section>

      <section className="case-register" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="cases-empty">
            <strong>Nenhuma ocorrência encontrada.</strong>
            <p>Altere os filtros ou limpe a busca. Relatos privados e itens L0/L1 não aparecem neste registro.</p>
            <button type="button" className="button secondary" onClick={resetFilters}>Limpar filtros</button>
          </div>
        ) : (
          filtered.map((item) => (
            <article className="case-card" key={item.id} id={item.slug}>
              <div className="case-card-rail">
                <span className="case-id">{item.id}</span>
                <time dateTime={item.date}>{item.dateLabel}</time>
                <span className={`case-level case-level-${item.evidenceLevel.toLowerCase()}`}>{item.evidenceLevel}</span>
              </div>

              <div className="case-card-main">
                <div className="case-badges">
                  <span>{item.category}</span>
                  <span>{item.status}</span>
                  <span>{item.scope}</span>
                </div>
                <h2>{item.title}</h2>
                <p className="case-summary">{item.summary}</p>

                <div className="audit-question">
                  <span>PERGUNTA DE AUDITORIA</span>
                  <p>{item.auditQuestion}</p>
                </div>

                <div className="case-tags">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>

                <div className="case-meta">
                  <div>
                    <small>Município / escopo</small>
                    <strong>{item.municipality}</strong>
                    {item.municipalityCount ? <span>{item.municipalityCount}+ municípios mencionados no anúncio público</span> : null}
                  </div>
                  <div>
                    <small>Fontes públicas associadas</small>
                    <div className="case-sources">
                      {item.sourceIds.map((sourceId) => {
                        const source = sourceById(sourceId);
                        if (!source) return null;
                        return (
                          <a key={sourceId} href={source.href} target="_blank" rel="noreferrer">
                            {source.organization} ↗
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  );
}
