# FM-03 — Provas oficiais PNCP recuperadas em 08/10/2026

Após erros HTTP 429 nas capturas iniciais, a rotina GitHub Actions conseguiu e preservou os **JSON oficiais integrais do PNCP** de Lajedo do Tabocal e Araçás.

| Município | Controle PNCP | Data de publicação | Estimativa | Resultado no registro capturado | SHA-256 |
|---|---|---|---|---|---|
| Lajedo do Tabocal | `16434441000131-1-000026/2026` | 2026-07-13T23:55:27 | R$ 3.020.421,46 | `existeResultado=false`; valor homologado `null` | `9dc020f31916315c4103f723ed2762066686e20956e42de4434f7abddc50ca4f` |
| Araçás | `16131088000110-1-000007/2026` | 2026-07-10T10:35:56 | R$ 732.421,46 | `existeResultado=false`; valor homologado `null` | `b18f622ed010f3ec1ac5cf3450c58801c7ba098b9971741cefefb586c82671c3` |

## Delimitação
A consulta `/api/consulta/v1/orgaos/{cnpj}/compras/2026/{seq}` reflete a informação **existente no detalhe PNCP no momento da captura**. Campo `existeResultado=false` não comprova que nenhuma proposta foi classificada, adjudicada ou contratada fora desse registro e jamais substitui buscas no processo municipal completo.

São **duas corroborações de CE-052/CE-056 já catalogadas**, não novas transferências nem prova de pagamento a fornecedor.

## Artefatos
- Originais: `preservation/snapshots/fm02-lajedo-pncp-detail/2026-10-09T01-05-10Z.json` e `preservation/snapshots/fm02-aracas-pncp-detail/2026-10-09T01-01-45Z.json`;
- Fichas `data/evidence/fm03/procurement/FM03-PNCP-*.json`;
- Índice `data/investigation/fm03-pncp-official-snapshots-2026-10-08.json`;
- Teste integridade `scripts/validate-fm03-pncp-originals.mjs` no prebuild, usando hash calculado dos bytes **efetivamente armazenados**;
- API autenticada dataset `fm03-official-pncp-snapshots`.
