# FM-03 — Baseline da cadeia financeira pública (08/10/2026)

**Situação:** EM EXECUÇÃO (abertura antecipada por solicitação do usuário). FM-02 permanece EM EXECUÇÃO.

## Cadeias estruturadas
Quatro grafos independentes por município: **saída estadual FIPLAN → ingresso municipal → despesa municipal → pagamento ao fornecedor → aplicação final**. O primeiro elo é documentalmente sustentado pelo extrato FIPLAN; o portal municipal de Jaguaquara corrobora em fonte independente a rubrica de receita de R$ 518.432,07, mas ainda **não há** conciliação de conta bancária específica.

Os quatro pagamentos identificados somam R$ 776.524,92; isso é soma dos quatro pagamentos FIPLAN selecionados, **não** valor suspeito ou desviado.

## Situação por caso
- **Lajedo do Tabocal — PREBA-01:** NOB `21301.0001.26.0002162-7`, R$ 49.946,15; receita municipal: not_documented; pagamento a fornecedor: não documentado. **Próxima diligência:** Receita municipal do convênio 32/2026, processos de despesa, contratos, ordem de serviço, AIO e primeira medição.
- **Belo Campo — PREBA-02:** NOB `10101.0001.26.0001454-0`, R$ 200.000,00; receita municipal: not_documented; pagamento a fornecedor: não documentado. **Próxima diligência:** Prestação de contas do convênio 01/2026 e despesas/notas efetivamente cobertas pela contribuição estadual.
- **Araçás — PREBA-03:** NOB `21301.0001.26.0002296-8`, R$ 8.146,70; receita municipal: not_documented; pagamento a fornecedor: não documentado. **Próxima diligência:** Histórico integral do instrumento, natureza do lançamento de R$ 8.146,70, receitas, contrato, AIO e medições.
- **Jaguaquara — PREBA-04:** NOB `21301.0001.26.0002290-9`, R$ 518.432,07; receita municipal: corroborated_public_revenue_label; pagamento a fornecedor: não documentado. **Próxima diligência:** Identificação da receita municipal na conta específica, pagamentos do estádio, termo formal SETRE e medições, sem somar o mercado.

## Qualificação obrigatória
- Edital PNCP não constitui despesa, liquidação ou pagamento.
- Araçás: o lançamento de R$ 8.146,70 não deve ser confundido com primeira parcela R$ 292.514,22.
- Jaguaquara: os R$ 400.000 do mercado são instrumento separado da receita do estádio.
- Belo Campo: evento em 07/06 é fato publicado, não prova de despesas quitadas.
- Sem fluxos identificados para campanha, sem evidência de compra de votos.
- Os **23 pedidos P0** permanecem como diligências a serem feitas e não documentos já obtidos.

## Arquivos e API
- `data/investigation/fm03-financial-chain-baseline-2026-10-08.json`;
- `data/investigation/fm03/chains/PREBA-01..04.json`;
- `GET /api/intelligence/financial-chain` (chave API) e dataset `fm03-financial-chains`;
- `scripts/validate-fm03-chains.mjs`, executado no prebuild.

## Fidedignidade do pipeline
O run GitHub Actions 37856820039 finalizou com **falha na etapa de commit/push**, apesar da coleta ter sido concluída. Alterado workflow para executar apenas na `main`, com rebase e tentativas limitadas sem force-push, e teste de SHA-256 dos snapshots no prebuild. **O workflow reestruturado requer execução real para validação da escrita.**

## Critério de fechamento
Somente marcar FM-03 concluída quando existirem documentos que sustentem a destinação municipal e os pagamentos, ou resposta oficial indicando formalmente o que não foi fornecido. Relação financeira protegida só pode ser buscada por autoridade com competência legal.

## Pesquisa pública complementar
Arquivo `data/investigation/fm03-open-source-review-2026-10-08.json` registra referências oficiais e indexadores secundários. Nenhum pagamento a fornecedor foi identificado com prova primária; fontes secundárias são apenas pistas de acesso às publicações e não substituem nota fiscal, empenho, liquidação ou ordem bancária.

## Release de produção e teste de preservação
- PR #9 foi integrado pelo commit `11794fcd743e0596d0dd5f75d1375bc7387237d6` e o deploy `dpl_37QcRr2RonpeATYr6HDufMrHeeTf` está READY.
- Prebuild validou 57 CE, 4 pagamentos FIPLAN, 19 itens FM-02, snapshots preservados e os 4 grafos FM-03; compilação e TypeScript aprovados.
- O workflow corrigido **run 37859562611** terminou **SUCCESS**, passando coleta, validação SHA e push, com commit automático `aa035fd3d05ddef5bb5d3d27c37c1fbf08d352e6`.
- A nova captura da receita de Jaguaquara mudou o SHA global do HTML, mas o fragmento de convênio estadual 28/2026 com R$ 518.432,07 permaneceu textual e posicionalmente idêntico; não adicionamos novo fato CE.
- Leitura ponta a ponta autenticada da nova API e espelhamento privado da FM-01 permanecem dependentes de credenciais/sessão do usuário e **não** são contados como comprovados.
