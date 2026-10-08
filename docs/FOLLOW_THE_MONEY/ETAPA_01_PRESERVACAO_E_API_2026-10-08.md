# Follow the Money — Etapa 01: preservação e API de evidências

**Data:** 08/10/2026  
**Branch:** `feature/follow-money-stage-01-ledger`  
**Escopo:** 57 fatos centrais CE-001 a CE-057, dos 4 núcleos prioritários e do universo de monitoramento.

## Baseline (AS-IS)

A API `POST /api/intelligence/ingest` gera `INT-...` aleatório. Um reenvio não é idempotente; por isso, **não** reaplicar as mesmas 57 fichas diretamente nela. O cockpit já utiliza os manifests Wave 01, 02, 03, mas não havia um arquivo independente por CE.

## Implementação planejada/entregue nesta etapa

1. Registrar cada CE em `data/evidence/central/CE-NNN.json`, preservando integralmente o item do manifesto original e seu blob SHA do Git.
2. Publicar o índice `data/evidence/central/index-2026-10-08.json` para a API protegida, sem abrir dados de investigação para o portal público.
3. Adicionar leitura `GET /api/intelligence/evidence` com consulta por ID, município e paginação; chaves exigidas em todas as respostas.
4. Incorporar os mesmos registros ao `GET /api/intelligence/query` existente, com `recordId=CE-NNN` para evitar duplicidade na projeção do cockpit.
5. Preparar espelhamento idempotente opcional, via POST autorizado em `/api/intelligence/evidence/sync`, com destino privado e sem sobrescrever registros divergentes.
6. Registrar o status por fase no JSON `data/investigation/follow-money-roadmap-2026-10-08.json` e exibi-lo no cockpit.

## Limites de integridade

O manifesto Wave 01 contém fatos de pagamentos e licitações. Os manifests Wave 02 e 03 contêm novos fatos vinculados a documentos oficiais. Essas fichas **não são** prova criminal nem representam 57 PDFs originais guardados. O ZIP FIPLAN completo está ausente do Git: o histórico menciona hashes de extrações específicas. Exigir originais antes de qualquer imputação.

## Testes de aceite

- 57 registros únicos CE-001 a CE-057.
- Cada ficha contém fonte manifesto e SHA Git, sem acusação conclusiva.
- Build e TypeScript sem falhas.
- `GET /api/intelligence/evidence` sem chave retorna 401.
- `GET /api/intelligence/evidence?id=CE-031` com chave retorna um item.
- `GET /api/intelligence/query?recordId=CE-031` e/ou `q=CE-031` apresenta registro equivalente.
- Espelhamento Blob **somente** após chamada autenticada, com resposta individual por CE e sem recriar duplicatas.
- Não marcar `privateBlobMirroredConfirmed=57` sem recibos reais.

## Governança

Nunca misturar registros públicos com denúncias pessoais. Não registrar juízo de culpa, probabilidades de crime ou relações financeiras não demonstradas. Guardar logs de falha e relatar sincronização parcial.
