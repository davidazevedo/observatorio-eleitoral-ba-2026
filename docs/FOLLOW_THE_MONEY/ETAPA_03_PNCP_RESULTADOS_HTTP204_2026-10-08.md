# FM-03 — Consulta oficial de resultados PNCP, item 1

**Coleta:** GitHub Actions run 37870868523, captura UTC de 09/10/2026.  
**Situação:** as duas URLs retornaram `HTTP 204 No Content` (corpo vazio), com SHA-256 dos 0 bytes arquivado.

| Município | Item validado | HTTP | Corpo | SHA |
|---|---:|---:|---:|---|
| Lajedo do Tabocal | 1 | 204 | 0 bytes | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| Araçás | 1 | 204 | 0 bytes | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

O hash `e3b0c44298fc1c149afbf4c8996fb934ca495991b7852b855` é o SHA-256 conhecido de corpo vazio. O coletor preservou o arquivo vazio e os metadados da requisição: **esse arquivo não é JSON válido**, e não deve ser interpretado como lista vazia `[]`.

**Limite:** HTTP 204 prova apenas que o endpoint de resultados por item não forneceu corpo nesta consulta. Não demonstra que não houve adjudicação, homologação, contrato, execução ou pagamento em outros sistemas.

## Continuidade
- Priorizar contratação/homologação nos respectivos processos municipais completos, com consulta às plataformas BNC e BLL informadas nos detalhes PNCP.
- Solicitar, por SIC/LAI ou ao MP, documentos de execução e pagamentos com vinculação específica ao convênio.
- Não fazer atribuição de fornecedor pago a partir de anúncios, estimativas ou campos não preenchidos.

**Artefatos:** `data/investigation/fm03-pncp-item-results-receipts-2026-10-08.json`, duas fichas individuais e `scripts/validate-fm03-pncp-results-receipts.mjs`.
