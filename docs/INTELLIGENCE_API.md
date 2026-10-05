# Intel API — Observatório Eleitoral Bahia 2026

API server-to-server para ingestão de resultados de pesquisa, fontes públicas, contas, entidades, relações e denúncias externas estruturadas.

## Autenticação
Use a chave fornecida fora do repositório em:

```http
Authorization: Bearer <INTELLIGENCE_API_KEY>
```

A Vercel armazena somente o SHA-256 da chave em `INTELLIGENCE_API_KEY_HASH`.

## Endpoints

### POST /api/intelligence/ingest
Aceita um registro simples ou `{ "records": [...] }` com até 100 registros.

### GET /api/intelligence/query
Filtros disponíveis:
- `kind`
- `municipality`
- `status`
- `evidenceLevel`
- `caseId`
- `q`
- `limit` (máximo 500)

## Tipos
- `complaint`
- `public_source`
- `research_finding`
- `financial_record`
- `electoral_account`
- `entity`
- `relationship`
- `municipal_fact`
- `legal_reference`

## Estados
`ingested -> triage -> corroborating -> verified | insufficient | rejected -> publishable -> referred`

## Níveis probatórios
- L0 — relato recebido
- L1 — pista localizável
- L2 — documento primário
- L3 — corroboração independente
- L4 — conjunto robusto / pronto para encaminhamento

## Proveniência
Todo registro de pesquisa deve preencher, quando possível:
- `sourceUrl`
- `sourceTitle`
- `publisher`
- `sourceDate`
- `retrievedAt`
- `externalId`
- `checksum`
- `collector`
- `method`

## Exemplo

```json
{
  "kind": "research_finding",
  "title": "Pagamento identificado em fonte pública",
  "summary": "Resumo objetivo do achado sem inferir ilícito.",
  "municipality": "Irecê",
  "eventDate": "2026-07-10",
  "status": "triage",
  "evidenceLevel": "L2",
  "priority": "high",
  "analyticalConfidence": 0.82,
  "caseIds": ["OE-BA-0002"],
  "tags": ["pagamento", "contrato", "fornecedor"],
  "entities": [
    {
      "name": "Fornecedor exemplo Ltda.",
      "type": "supplier",
      "identifier": "00.000.000/0001-00",
      "role": "contratado"
    }
  ],
  "financial": {
    "currency": "BRL",
    "paid": 100000
  },
  "provenance": {
    "sourceUrl": "https://fonte-oficial.example/",
    "sourceTitle": "Documento oficial",
    "publisher": "Órgão público",
    "sourceDate": "2026-07-10",
    "collector": "Pesquisa Profunda",
    "method": "web_research"
  }
}
```

## Regra editorial
A API não publica conteúdo. Ingestão significa somente entrada na base privada. Publicação exige revisão humana e classificação adequada.
