# FM-03 — Linhas do tempo probatórias ligadas a documentos primários

**Data da versão:** 08/10/2026 · **Estado:** FM-03 parcialmente executada

## Resultado real
4 municípios; 18 eventos individualizados (incluindo históricos oficiais e recibos HTTP, que não são fatos financeiros adicionais).
- 4 saídas estaduais FIPLAN com NOB e extrato versionado.
- 2 publicações PNCP com valor de referência **estimado**, 5 atos em histórico, 2 itens.
- 4 recibos de API (204 sem corpo, 400 erro), os quais **não** demonstram falta de contratos.
- 1 corroboração independente de receita municipal do estádio em Jaguaquara, **sem** extrato bancário específico.

## Distinções críticas
1. Lajedo: pagamento FIPLAN em **06/07/2026**; publicação PNCP da concorrência em **13/07/2026**. Isso demonstra a cronologia documental dessas duas fontes, mas não permite concluir início físico, aprovação de pagamento municipal, fornecedor ou crime.
2. Araçás: pagamento e publicação PNCP ambos em **10/07/2026**, sendo a hora do FIPLAN **não disponível**. É errado afirmar que o pagamento necessariamente precedeu ou sucedeu a publicação.
3. PNCP Lajedo valor estimado R$3.020.421,46; Araçás R$732.421,46. **Valores de edital não são pagamentos** e não devem ser somados aos recursos transferidos.
4. Belo Campo: confirma-se desembolso estadual, mas não seus destinatários finais.
5. Jaguaquara: a rubrica municipal de receita é corroboração independente, **não conciliação de conta**.

## Proteção probatória
- Cada evento referencia `source.path` e `source.sha256`, além de chave lógica no arquivo original.
- Para respostas 204, SHA corresponde a corpo vazio; 400 possui manifesto sem comprovante de contrato.
- Não recontar evidências CE; os 18 eventos são projeções rastreáveis dos dados **já preservados**.
- Sem atribuição de fornecedor, crime, compra de votos ou financiamento eleitoral.
- A integridade das fichas e a correspondência dos eventos às fontes são testadas no prebuild.

## Integração
`GET /api/intelligence/datasets?name=fm03-evidence-timelines` protegido por chave; cockpit PRE-BA apresenta os quatro fluxos.
