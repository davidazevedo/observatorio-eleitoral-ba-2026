# FM-03 — Consulta de contratos e empenhos associados às compras PNCP

**Início:** 08/10/2026 (America/Bahia), status **aguardando coleta**.

## Por que este endpoint?
As consultas de `itens/1/resultados` dos dois processos retornaram `HTTP 204` e corpo vazio. A documentação **oficial** PNCP seção 13.10 prevê outra consulta por CNPJ, ano e sequencial:

`GET /v1/orgaos/{cnpj}/contratos/contratacao/{anoContratacao}/{sequencialContratacao}`

Fonte: https://pncp.gov.br/manual/pt-br/latest/contrato_empenho/consultar_contratos_ou_empenhos_de_uma_contratacao.html

## Alvos e provas existentes
- **Lajedo do Tabocal** — PNCP `16434441000131-1-000026/2026`, corrobora `CE-052`: `https://pncp.gov.br/api/pncp/v1/orgaos/16434441000131/contratos/contratacao/2026/26`; manifesto `preservation/manifests/fm03-lajedo-pncp-linked-contracts.json`.
- **Araçás** — PNCP `16131088000110-1-000007/2026`, corrobora `CE-056`: `https://pncp.gov.br/api/pncp/v1/orgaos/16131088000110/contratos/contratacao/2026/7`; manifesto `preservation/manifests/fm03-aracas-pncp-linked-contracts.json`.

## Semântica probatória
- Resposta **200 com contrato** poderá comprovar **vínculo administrativo formal**, após preservação do JSON original, SHA e conferência de identificadores; **não** significa pagamento.
- **204 sem corpo**, 404, 429 e 5xx são resultados de consulta; nunca devem ser transformados em declaração categórica de que não houve contratação.
- A cadeia financeira FM-03 só pode receber pagamentos municipais com documento de despesa/ordem bancária correspondente, não com simples valor de contrato.
- Se houver CNPJ contratado no registro original, preservar a origem e criar ficha individual **sem inferir apoio político ou ilícito**.
- O próximo passo após obter contratos é buscar arquivos vinculados, empenhos, liquidações e execução por canais oficiais.

## Integração
- Dois arquivos individuais `data/evidence/fm03/procurement/FM03-PNCP-LINKED-CONTRACTS-PREBA-0{1,3}.json`.
- Registro `data/investigation/fm03-pncp-linked-contracts-2026-10-08.json`.
- Endpoint de dataset autenticado e painel PRE-BA.
- Workflow `source-preservation.yml` disparado após `preservation/targets.json` entrar em `main`.
- O status "aguardando coleta" só pode mudar depois de retorno e manifesto SHA realmente preservado.

**Nenhum novo crime, desvio ou compra de votos foi demonstrado nesta etapa.**
