# FM-03 — Itens e histórico PNCP: resultados da coleta

**Referência da coleta:** GitHub Actions run `37870300477`, arquivos oficiais recuperados na madrugada UTC de 09/10/2026 (no calendário local, a investigação partiu de 08/10).  
**Estado:** quatro originais versionados; dois próximos endpoints de resultado aguardam nova coleta.

| Município | Itens oficiais | Valor estimado do único item | Eventos registrados no histórico | Resultado no item |
|---|---:|---:|---:|---|
| Lajedo do Tabocal | 1 | R$ 3.020.421,46 | 3 | Não informado |
| Araçás | 1 | R$ 732.421,46 | 2 | Não informado |

## Fontes preservadas
- `FM03-PNCP-LAJEDO-ITENS-2026`: `preservation/snapshots/fm03-lajedo-pncp-items/2026-10-09T01-34-32Z.json` — SHA-256 `e68aa5376eeef36d0baa9a77d81e8b7405b159a219c20504dbe702113d20bb09`; 1 registros.
- `FM03-PNCP-LAJEDO-HISTORICO-2026`: `preservation/snapshots/fm03-lajedo-pncp-history/2026-10-09T01-34-33Z.json` — SHA-256 `bf6a9e7642e569cec40b99e0caf334a7e4f8cb46b4685b2644567a786282b5b5`; 3 registros.
- `FM03-PNCP-ARACAS-ITENS-2026`: `preservation/snapshots/fm03-aracas-pncp-items/2026-10-09T01-34-33Z.json` — SHA-256 `488d5bf5be8ab4b33915d864b1be7015986384606b1832afba06c4a3198fa097`; 1 registros.
- `FM03-PNCP-ARACAS-HISTORICO-2026`: `preservation/snapshots/fm03-aracas-pncp-history/2026-10-09T01-34-33Z.json` — SHA-256 `9f51ff6e3c0b4454a7c9e9c308f9c7b18c42d8ebe459e386d89bbfcbddc32a9f`; 2 registros.

## Resultado adicional requisitado ao PNCP
- **Lajedo do Tabocal**: item `1` identificado no JSON oficial; **GET** https://pncp.gov.br/api/pncp/v1/orgaos/16434441000131/compras/2026/26/itens/1/resultados; estado `aguardando coleta`.
- **Araçás**: item `1` identificado no JSON oficial; **GET** https://pncp.gov.br/api/pncp/v1/orgaos/16131088000110/compras/2026/7/itens/1/resultados; estado `aguardando coleta`.

## Restrições de interpretação
Os documentos de histórico apresentam exclusivamente os eventos cadastrados naquele recorte; não certificam ausência de homologação em outros sistemas ou em outra data. `temResultado=false` e `existeResultado=false` são **propriedades do registro consultado**, não absolvição ou prova de fraude.

Fornecedor eventualmente adjudicado **não significa fornecedor pago**. Para demonstrar desembolso, são indispensáveis empenho, liquidação, ordem de pagamento municipal e documentação de execução, nos termos dos pedidos LAI anteriores.

Nenhum identificador CE foi criado. O teste do repositório verifica a integridade de cada JSON original e a correspondência dos campos normalizados.
