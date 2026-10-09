# Reconciliação controlada das três branches — 09/10/2026

## Política
Preservar evidências originais e não promover `main` antes de todas as frentes passarem por QA e revisão. A mera divergência no grafo de commits não prova ausência de conteúdo na `main`.

## Ponto de partida
`main` consultada: `8604d405fe69de87ced9a05c4a34afc8d1c620af`.

| Branch | Ahead | Behind | Backup | PR de sincronização main→branch |
|---|---:|---:|---|---|
| investigation/preba-diligence-gates-2026-10-08 | 10 | 12 | backup/preba-6d-before-reconcile-20261009 | #24 — conflito, em draft |
| feature/fm02-primary-financial-lines | 1 | 54 | backup/fm02-before-reconcile-20261009 | #22 — conflito, em draft |
| feature/fm03-capture-semantic-quality-reconciliation | 1 | 34 | backup/fm03-semantic-before-reconcile-20261009 | #23 — conflito, em draft |

## PRE-BA — resolução aplicada
Criada `integration/reconcile-preba-20261009` a partir da `main` atual, incorporando os cinco arquivos novos e mesclando as adições em `lib/private-data.ts`, `app/privado/PrivateDashboardClient.tsx` e `package.json` sem substituir as atualizações recentes da `main`. PR #25, draft. Preview de commit `9ed04d76965b9a0c8fc86070283182da495a797e` em estado READY. Logs de build: 57/57 CE, validações FM02/FM03, PRE-BA 6C/6D, compilação Next.js passaram. Teste visual autenticado não foi executado.

## FM-02 — investigação de divergência
PR #26, draft para revisão dos 50 caminhos registrados no histórico da branch; alterações automáticas de snapshots/manifests não podem sobrescrever certificados e versões preservadas mais recentes. Conferência pontual: manifesto `fm02-aracas-sudesb-term.json`, snapshot `fm02-belo-campo-pos/2026-10-08T22-59-13Z.html` e manifesto `fm02-belo-campo-pos.json` têm SHA de blob idêntico na `main` e na branch divergente. Falta conferência exaustiva dos demais caminhos antes de classificar a branch como redundante ou integrar qualquer diferença.

## FM-03 — investigação de divergência
PR #27, draft. Branch histórica contém `fm03-source-capture-quality-2026-10-08.json` com 7 capturas e 2 fontes pendentes. A `main` tem evolução posterior para outro esquema, com 9 capturas HTTP 200 e dois workflows registrados; não substituir o dataset atual pela versão anterior. As alterações de UI/API e demais registros exigem reconciliação campo a campo.

## Gates de promoção
- [x] Backups criados para três branches.
- [x] Conflitos das três sincronizações identificados sem merge forçado.
- [x] PRE-BA transplantada seletivamente sobre `main`.
- [x] Build/validação documental da integração PRE-BA aprovado.
- [ ] FM-02: verificação exaustiva dos 50 caminhos e versões preservadas.
- [ ] FM-03: análise semântica dos 14 caminhos.
- [ ] Teste visual com autenticação real e isolamento de dados.
- [ ] Reconciliar/fechar PRs redundantes, aprovar PR final.
- [ ] Merge controlado para `main` e validação pós-merge.

**Estado:** `main` não foi alterada por este trabalho. Nenhum protocolo ou upload foi realizado.
