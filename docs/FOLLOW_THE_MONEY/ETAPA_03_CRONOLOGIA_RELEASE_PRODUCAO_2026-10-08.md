# FM-03 — Registro de implantação: cronologia documental (08/10/2026)

- PR #20 integrado à `main`; commit `bf3fd232d368039daf55efdecceb31574edebbd2`.
- Deploy produção Vercel `dpl_4z3kqsotFJgfwHjxPLCMMbZFKLvc` **READY**.
- **4 timelines**, **18 eventos documentais** versionados; validade dos dados confrontada em pré-build com FIPLAN e JSON bruto PNCP.
- Checks: 57/57 evidências centrais, quatro linhas FIPLAN, 19 registros FM02, fonte PNCP, teste das quatro timelines, TypeScript e Next build aprovados.
- Endpoint leitura: `GET /api/intelligence/datasets?name=fm03-evidence-timelines`; filtro por caso dentro de `GET /api/intelligence/financial-chain?caseId=PREBA-01`.
- Rotas requerem autenticação. **Não houve consulta ponta a ponta com chave nesta execução**.
- Nenhum espelhamento privado Blob adicional foi marcado como realizado; usuário continua validando FM01.
- Tratamento: a soma de evidências CE continua 57; 18 são **eventos projetados**, sem provas de pagamentos municipais a fornecedores, financiamento de campanha ou compra de votos.
- Situação FM03: **em execução** até documentos de empenho, liquidação, ordem de pagamento e execução. FM02 também permanece aberta.
