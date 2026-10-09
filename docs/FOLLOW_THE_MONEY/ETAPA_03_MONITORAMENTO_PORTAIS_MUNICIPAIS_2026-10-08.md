# FM-03 — Inventário dos portais públicos de despesas e diligências preparadas

**Data:** 08/10/2026 — **Status:** monitoramento iniciado; despesas municipais ainda não conciliadas.

## Inovação verificável
Foram cadastrados **9 pontos de consulta fiscal**, pertencentes a quatro municípios, com URL, finalidade, identificador permanente e política de preservação. O workflow de fontes utilizará apenas **HTTP, metadados e SHA-256**, sem publicar a íntegra das tabelas de despesas no Git. Os portais são fontes de pesquisa, mas não representam pagamento a fornecedor ou financiamento eleitoral.

- **Lajedo do Tabocal · FM03-LAJ-PORTAL** — https://www.municipioonline.com.br/ba/prefeitura/lajedodotabocal/cidadao/transparencia — Portal municipal da transparência; menu de despesas/contratos.
- **Lajedo do Tabocal · FM03-LAJ-DESPESA** — https://www.municipioonline.com.br/ba/prefeitura/lajedodotabocal/cidadao/despesa — Listagem de despesas municipais; requer filtros por período/objeto.
- **Lajedo do Tabocal · FM03-LAJ-CONTRATOS** — https://www.municipioonline.com.br/ba/prefeitura/lajedodotabocal/cidadao/publicacaocontrato — Publicações de contratos do município.
- **Belo Campo · FM03-BELO-DESPESAS** — https://belocampo-ba.portaltp.com.br/ — Portal da Transparência — Empenhos/Liquidações/Pagamentos/Favorecidos.
- **Belo Campo · FM03-BELO-SIC** — https://transparencia.belocampo.ba.gov.br/ — Portal municipal de transparência e SIC.
- **Araçás · FM03-ARA-PORTAL** — https://transparencia.aracas.ba.gov.br/ — Transparência — despesas, contratos, obras e transferências estaduais.
- **Jaguaquara · FM03-JAG-DESPESA** — https://www.municipioonline.com.br/ba/prefeitura/jaguaquara/cidadao/despesa — Despesa — Empenhos, Liquidações, Pagamentos e Favorecidos; aplicar 2026.

## Registros necessários antes de fechar o fluxo financeiro
### PREBA-01 — Lajedo do Tabocal
NOB estadual: `21301.0001.26.0002162-7`, 2026-07-06. Valor: R$ 49.946,15.

1. Extrato da conta específica do convênio, ingresso e conciliação com NOB estadual
2. Empenhos, liquidações, pagamentos e identificação CNPJ/contratos relacionados ao convênio
3. Processo 015/2026 e Concorrência 04/2026: homologação, contrato/OS, AIO, medições e prestação de contas

**Estado do pedido:** minuta criada, sem protocolo. **Estado financeiro:** saída estadual verificada; fornecedor/execução não verificados.

### PREBA-02 — Belo Campo
NOB estadual: `10101.0001.26.0001454-0`, 2026-07-08. Valor: R$ 200.000,00.

1. Extrato específico de ingresso estadual e comprovante da liberação dos R$200.000,00
2. Empenhos, liquidações, contratos, notas fiscais e pagamentos da Cavalgada de 07/06/2026
3. Processo de prestação de contas, despesas anteriores/posteriores e classificação formal de eventual reembolso

**Estado do pedido:** minuta criada, sem protocolo. **Estado financeiro:** saída estadual verificada; fornecedor/execução não verificados.

### PREBA-03 — Araçás
NOB estadual: `21301.0001.26.0002296-8`, 2026-07-10. Valor: R$ 8.146,70.

1. Histórico integral de pagamentos do convênio; identificar natureza da NOB de R$8.146,70
2. Extrato municipal da conta específica, empenhos, pagamentos, CNPJ dos contratados
3. Processo 131/2026 / Concorrência 007/2026; homologação, contrato, AIO/OS e medições

**Estado do pedido:** minuta criada, sem protocolo. **Estado financeiro:** saída estadual verificada; fornecedor/execução não verificados.

### PREBA-04 — Jaguaquara
NOB estadual: `21301.0001.26.0002290-9`, 2026-07-10. Valor: R$ 518.432,07.

1. Conciliação bancária da conta do convênio do estádio com FIPLAN R$518.432,07 e rubrica municipal 242299011000
2. Processos de despesa, empenhos, liquidações, pagamentos e identificação de fornecedores do estádio
3. Convênio e processo SETRE integral, licitação, contratos, AIO/OS, medição e relatório de execução; excluir objeto do Mercado R$400.000,00

**Estado do pedido:** minuta criada, sem protocolo. **Estado financeiro:** saída estadual verificada; fornecedor/execução não verificados.


## Critérios de evidência
O próximo registro financeiro só poderá entrar nas cadeias `FM03-PREBA-0N` se houver **documento primário com número do empenho/liquidação/pagamento, data, valor, objeto, CNPJ e vínculo específico com convênio ou contrato**. Coincidências de objeto e de valor geram fila de revisão, nunca atribuição automática.

Documentos pessoais devem ser minimizados; snapshots de despesa completos são destinados ao armazenamento privado e devem exigir autenticação.

## Controle e API
- `data/investigation/fm03-municipal-source-register-2026-10-08.json` — registro principal;
- `data/evidence/fm03/municipal-portals/FM03-*.json` — sete referências individuais;
- `GET /api/intelligence/datasets?name=fm03-municipal-fiscal-portals` e `GET /api/intelligence/financial-chain` com contexto de portais oficiais;
- `scripts/validate-fm03-municipal-portals.mjs` — integridade e fronteira de privacidade;
- `docs/FOLLOW_THE_MONEY/REQUISICOES/LAI_FM03_PREBA-0N.md` — minutas documentais independentes.

Os arquivos de LAI são apenas modelos técnicos; enviar pedidos e divulgar dados exigem avaliação sobre segurança pessoal, preservação de informações e canais institucionais.

## Acesso direto confirmado após a primeira versão
- **Belo Campo:** https://transparencia.belocampo.ba.gov.br/despesa — URL pública específica de despesas.
- **Araçás:** https://transparencia.aracas.ba.gov.br/convenios — URL pública específica de convênios, com filtros por concedente, número, exercício e período.

**Atenção metodológica:** resultados vazios por filtro inicial, erro de coleta ou página sem seleção 2026 são `não conclusivos`. Não provaram ausência de pagamento, contrato, convênio ou prestação de contas.

## QA da coleta inicial — run 37867608452
- Sete canais responderam HTTP 200 com hashes SHA-256; nenhum HTML bruto de despesa foi publicado no Git.
- `FM03-BELO-SIC` e `FM03-ARA-PORTAL` retornaram bytes idênticos (SHA-256 `4438bcbad2f2d57e5440ff507f589b348d949e712ff3bb8ce1c708c29d8afb8d`) embora possuam hosts distintos. **HTTP 200 não é validação de conteúdo fiscal**.
- Duas consultas diretas seguem pendentes da coleta automatizada posterior. Nenhum fornecedor ou pagamento municipal vinculável aos convênios foi comprovado.
