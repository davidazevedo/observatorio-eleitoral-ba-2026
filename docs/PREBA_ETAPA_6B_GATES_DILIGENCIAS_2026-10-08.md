# Etapa 6B — Gates documentais PRE-BA (08/10/2026)

**Natureza:** plano operacional de diligências e verificação, separado dos pacotes probatórios em validação.  
**Estado:** preparação para QA documental; nenhum novo ilícito estabelecido.  
**Branch:** `investigation/preba-diligence-gates-2026-10-08`.  
**Restrição:** não alterar `main`, datasets existentes, flags `protocolReady`, classificação ou contagem CE sem evidência primária adicional preservada.

## Estado de partida (índice do repositório)
- PREBA-01 — Lajedo do Tabocal: `public_source_exhausted_ready_for_diligence_request`; CE-031, CE-051, CE-052; `protocolReady=false`.
- PREBA-02 — Belo Campo: `draft_v1_pending_p0_diligences`; CE-019, CE-053, CE-054; `protocolReady=false`.
- PREBA-03 — Araçás: `public_source_exhausted_ready_for_diligence_request`; CE-016, CE-055, CE-056; `protocolReady=false`.
- PREBA-04 — Jaguaquara: `public_source_exhausted_ready_for_diligence_request`; CE-029, CE-029-STADIUM-SLICE, CE-057; `protocolReady=false`.

## Prioridade operacional

| Ordem | Pacote | Lacuna decisiva | Origem da requisição | Condição de avanço |
|---|---|---|---|---|
| 1 | Lajedo | Processo SEI 069.1479.2026.0002857-54; Plano/cronograma; AIO/OS; primeira medição; parecer da liberação em 06/07; publicação/errata; processo municipal 015/2026-SEMINF | SUDESB, Município, SEFAZ/FIPLAN, DOE | Origem e integridade documentadas; teste explícito das hipóteses lícitas |
| 2 | Belo Campo | Processo SEI/Plano; fundamento do pagamento de R$ 200 mil em 08/07 após evento relatado em 07/06; natureza da transferência; aplicação/prestação de contas; NOB | Concedente, Município, SEFAZ/FIPLAN | Distinguir transferência voluntária, despesa indenizatória e outras hipóteses documentalmente justificadas |
| 3 | Araçás | Natureza dos R$ 8.146,70; Plano; AIO/OS; início físico; edital/contrato da Concorrência 007/2026 | SUDESB, Município, SEFAZ/FIPLAN | Confirmar objeto, parcela e cronologia material antes de qualquer conclusão |
| 4 | Jaguaquara | SEI 069.1475.2026.0002965-01; identificação formal do convenente; Convênio 28/2026; contrato; AIO/OS; início físico; liberação R$ 518.432,07 em 10/07 | Concedente, Município, SEFAZ/FIPLAN | Conciliar NOB/FIPLAN com documento municipal e objeto correspondente |

## Resultados da verificação externa em 08/10/2026

1. O índice público de convênios esportivos da SUDESB lista, para o Convênio 32/2026 de Lajedo do Tabocal, **Termo de Convênio**, **Publicação** e **Publicação Errata**. Esse achado confirma que a errata deve ser examinada; **não confirma seu teor**. Fonte: https://www.ba.gov.br/esporte/35/construcoes-e-reformas-de-equipamentos-esportivos
2. Indexações secundárias da Concorrência Eletrônica 04/2026 apontam edital publicado em **13/07/2026**, anexo de projetos/planilhas em **14/07/2026**, objeto de reforma do estádio vinculado ao Convênio 32/2026 e estimativa de **R$ 3.020.421,46**. É necessário obter arquivo oficial e metadados no PNCP antes de converter o achado em evidência com novo hash. Fonte secundária: https://www.todaslicitacoes.com.br/licitacao/contratacao-de-empresa-especializada-em-obras-e-servicos-de-lajedo-do-tabocal-ba-16434441000131-2026-26
3. Identificador oficial de consulta: https://pncp.gov.br/app/editais/16434441000131/2026/26 . Não foi possível obter nesta verificação uma cópia integral autenticada do edital, publicação/errata ou AIO/OS.
4. A página pública de consulta da SUDESB apresentou indisponibilidade intermitente durante tentativa de abertura. **Não registrar busca negativa definitiva a partir dessa indisponibilidade.**

## Protocolo de preservação de cada novo artefato

Registrar `source_id`, `source_url`, órgão publicador, identificador administrativo, instante de obtenção em ISO 8601 com fuso, nome de arquivo original, tipo MIME, SHA-256, tamanho, data do fato, data da publicação, página/trecho, instrumento e município relacionados, limites probatórios e hipóteses alternativas. Não duplicar CE por mirrors, cópias e snapshots.

## Gates obrigatórios de QA

- **G0 — Origem:** URL e autor institucional verificáveis, distinguindo indexador secundário de fonte primária.
- **G1 — Integridade:** arquivo/snapshot preservado com SHA-256 reproduzível e manifesto.
- **G2 — Identidade:** conciliação entre convênio, instrumento, NOB, município, objeto e processo.
- **G3 — Cronologia:** discriminar assinatura, publicação, empenho, liquidação, transferência efetiva, contratação e execução física.
- **G4 — Contraditório documental:** testar atos prévios, emergências/calamidades, natureza jurídica do fluxo, erratas e documentação de execução.
- **G5 — Revisão jurídica:** aplicar art. 73, VI, a, da Lei 9.504/1997 ao caso concreto sem presumir ilícito pela ausência pública de um documento.
- **G6 — Protocolo:** `protocolReady` somente após revisão individual, índice de anexos conferido e decisão humana expressa.

## Backlog de implementação após validação humana

1. Persistir requisições de documentos em modelo `document_requests` (órgão, pacote, item, status, prazo, resposta, fonte, hash).
2. Acrescentar aba privada **Diligências e Gates** com filtros por pacote, P0/P1 e não localizado/solicitado/recebido/verificado.
3. Exibir diferenças entre documento novo e conclusões vigentes, sem alteração automática das conclusões.
4. QA: schema JSON, referências CE existentes, ausências explícitas, não duplicação de evidências, autenticação e privacidade; somente então preview e eventual merge.

**Próxima decisão:** obter e preservar publicação/errata e processo oficial de Lajedo; se indisponíveis, preparar pedidos formais de acesso a documentos, prosseguindo concomitantemente com as lacunas do Pacote 02. Não transformar ausência de localização em prova de ausência de ato.
