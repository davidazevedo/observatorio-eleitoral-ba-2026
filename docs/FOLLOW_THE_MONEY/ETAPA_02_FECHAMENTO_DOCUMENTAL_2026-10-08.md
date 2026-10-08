# FM-02 — Fechamento documental dos quatro municípios
**Criado:** 08/10/2026  
**Estado:** em execução, em paralelo à validação FM-01.

## Avanço material desta etapa
O arquivo **`preservation/extracts/fiplan-defeso-pagamentos-2026.csv.gz`** já está preservado em Git, contém 51 linhas do recorte e foi recuperado e conferido quanto a SHA-256: compactado `c8f240e353f52ba195a842f08b154f79158e9aadc9279342bbe803a8130cbc66`, descompactado `bd3f08960b2b20467db1b7856af3aacd7c902859de4843f3117a064031a25d51`.

O arquivo **`data/investigation/fm02-fiplan-primary-rows-2026-10-08.json`** contém a reprodução literal de oito campos de cada uma das quatro linhas correspondentes aos instrumentos investigados. Um teste do prebuild descompacta a fonte, valida os dois SHA-256 e compara todos os campos exatamente.

| Núcleo | Instrumento | NOB comprovada | Data do pagamento | Valor |
|---|---|---|---|---|
| Lajedo do Tabocal | `21301.0001.26.0000299-1` | `21301.0001.26.0002162-7` | 06/07/2026 | R$ 49.946,15 |
| Belo Campo | `10101.0001.26.0000079-3` | `10101.0001.26.0001454-0` | 08/07/2026 | R$ 200.000,00 |
| Araçás | `21301.0001.26.0000276-0` | `21301.0001.26.0002296-8` | 10/07/2026 | R$ 8.146,70 |
| Jaguaquara | `21301.0001.26.0000298-1` | `21301.0001.26.0002290-9` | 10/07/2026 | R$ 518.432,07 |

**Regra de contagem:** as quatro linhas acima corroboram CE-031, CE-019, CE-016 e a fração do estádio em CE-029; **não** são quatro novos fatos independentes.

## Fontes e lacunas por município

### 1. Lajedo do Tabocal — PREBA-01
**Instrumentos e identificadores:** agreement: `Convênio SUDESB 32/2026` · seiProcess: `069.1479.2026.0002857-54` · seiDocument: `00142991035` · seiCrc: `2842D758` · fiplanInstrument: `21301.0001.26.0000299-1` · fiplanBankOrder: `21301.0001.26.0002162-7` · procurement: `Concorrência Eletrônica 04/2026` · municipalProcess: `015/2026 - SEMINF` · pncpControl: `16434441000131-1-000026/2026`.

**Cronologia documentada:**
- **2026-06-19 —** Parecerista/Procuradoria da SUDESB assinou eletronicamente o termo. _(fonte SRC-LAJ-SUDESB-TERM)_
- **2026-06-30 —** Diretor-Geral da SUDESB e representante do Município assinaram eletronicamente o Convênio 32/2026. _(fonte SRC-LAJ-SUDESB-TERM)_
- **2026-07-01 —** Publicação do instrumento registrada na base investigativa consolidada; a eficácia do convênio dependia da publicação do extrato no DOE. _(fonte SRC-LAJ-FIPLAN-PRESERVED)_
- **2026-07-04 —** Início do período de vedação às transferências voluntárias estaduais a municípios, ressalvadas as hipóteses legais. _(fonte LEGAL-TSE-23760-2026)_
- **2026-07-06 —** FIPLAN registra pagamento efetivado de R$ 49.946,15 no instrumento 21301.0001.26.0000299-1, valor idêntico à primeira parcela do Convênio 32/2026. _(fonte CE-031)_
- **2026-07-13 —** Publicação da Concorrência Eletrônica 04/2026 para contratação da empresa executora da reforma do mesmo estádio/Convênio 32/2026, conforme registro PNCP consolidado. _(fonte CE-052)_
- **2026-07-27 —** Data prevista para abertura/recebimento de propostas da Concorrência Eletrônica 04/2026. _(fonte SRC-LAJ-PNCP-CE04)_

**Fontes disponíveis/referenciadas:**
- `SRC-LAJ-FIPLAN-PRESERVED` — Governo do Estado da Bahia / SEFAZ / FIPLAN — https://dados.ba.gov.br/dataset/9079f8b9-f480-466f-8016-d03108f6420f/resource/abbd1ce3-2117-4732-9c9f-8860e11efb3a/download/conveniosparcerias.zip — **source_excerpt_preserved_and_sha256_verified**
- `SRC-LAJ-SUDESB-TERM` — SUDESB — https://www.ba.gov.br/esporte/sites/site-sudesb/files/2026-07/SEI_00142991035_Termo_de_Convenio.pdf — **official_pdf_text_reviewed_binary_pending_archival**
- `SRC-LAJ-SUDESB-INDEX` — SUDESB — https://www.ba.gov.br/esporte/35/construcoes-e-reformas-de-equipamentos-esportivos — **official_index_lists_sources_binary_pending**
- `SRC-LAJ-PNCP-CE04` — Portal Nacional de Contratações Públicas — https://pncp.gov.br/app/editais/16434441000131/2026/26 — **original_bytes_not_preserved_in_this_stage**

**Documentos prioritários não recuperados integralmente:**
- **Processo SEI integral 069.1479.2026.0002857-54** — Permite verificar motivação, pareceres, plano, cronograma, liberação, fiscalização e eventuais justificativas eleitorais.
- **Plano de Trabalho aprovado e cronograma físico-financeiro/cronograma prefixado** — Documento incorporado ao convênio e indispensável para testar a exceção legal.
- **Autorização de Início de Obra (AIO) e eventual Ordem de Serviço** — O próprio termo condiciona o início do objeto à AIO; data e conteúdo são decisivos.
- **Primeira medição, boletim de medição, diário de obra, relatório fotográfico e fiscalização de engenharia** — Permitem determinar objetivamente a data de início da execução física.
- **Processo administrativo que autorizou/liberou a primeira parcela em 06/07, inclusive parecer jurídico sobre o art. 73, VI, a** — Esclarece o fundamento concreto adotado pelo Estado para liberar o recurso já no período vedado.

**Diligências propostas:**
- **SUDESB / Governo do Estado da Bahia:** Encaminhar cópia integral do Processo SEI 069.1479.2026.0002857-54, inclusive Plano de Trabalho, cronogramas, pareceres, AIO, fiscalização, atestes, processo da liberação de 06/07 e justificativa de enquadramento no período eleitoral.
- **Município de Lajedo do Tabocal:** Encaminhar íntegra do processo 015/2026-SEMINF/Concorrência 04/2026, contrato, OS, AIO recebida, diário de obra, medições, ART/RRT, CNO e registros que indiquem a data efetiva de início físico.
- **SEFAZ/FIPLAN:** Certificar o histórico integral do instrumento 21301.0001.26.0000299-1 e da NOB 21301.0001.26.0002162-7, qualificando natureza, data de emissão, liquidação, efetivação e identificação da parcela.
- **SUDESB / DOE Bahia:** Fornecer o extrato original de publicação do Convênio 32/2026 e a errata indicada no portal oficial, com respectivas datas.

**Cautela:** O pacote documenta fatos, uma aparente incompatibilidade temporal/documental e lacunas que justificam apuração. Não afirma, por si só, ocorrência de ilícito eleitoral, abuso, dolo ou desvio de finalidade.

### 2. Belo Campo — PREBA-02
**Instrumentos e identificadores:** agreement: `Convênio SEAGRI 01/2026` · seiProcess: `010.9156.2025.0002545-71` · fiplanInstrument: `10101.0001.26.0000079-3` · fiplanBankOrder: `10101.0001.26.0001454-0` · parliamentaryAmendment: `202535680003`.

**Cronologia documentada:**
- **2026-06-02 —** Assinatura do Convênio SEAGRI 01/2026 entre o Estado da Bahia/SEAGRI e o Município de Belo Campo. _(fonte SRC-BELO-DOE-CONVENIO)_
- **2026-06-03 —** Publicação do resumo do Convênio 01/2026 no Diário Oficial do Estado, com objeto, valor, fonte e vigência. _(fonte CE-054)_
- **2026-06-03 —** A Prefeitura anunciou oficialmente a realização da Cavalgada para 07/06 e informou apoio do Governo do Estado por meio da SEAGRI. _(fonte SRC-BELO-PREFEITURA-PREVIA)_
- **2026-06-07 —** A Cavalgada - A Tradição do Vaqueiro foi realizada em Belo Campo. _(fonte CE-053)_
- **2026-06-10 —** Notícia municipal posterior registrou a realização do evento, público aproximado de 11 mil pessoas e apoio da SEAGRI. _(fonte SRC-BELO-PREFEITURA-POS)_
- **2026-07-04 —** Início do período de vedação às transferências voluntárias estaduais a municípios, ressalvadas as hipóteses legais. _(fonte LEGAL-TSE-23760-2026)_
- **2026-07-08 —** FIPLAN registra pagamento efetivado de R$ 200.000,00 no instrumento 10101.0001.26.0000079-3, correspondente à participação estadual indicada no Convênio 01/2026. _(fonte CE-019)_

**Fontes disponíveis/referenciadas:**
- `SRC-BELO-FIPLAN-PRESERVED` — Governo do Estado da Bahia / SEFAZ / FIPLAN — https://dados.ba.gov.br/dataset/9079f8b9-f480-466f-8016-d03108f6420f/resource/abbd1ce3-2117-4732-9c9f-8860e11efb3a/download/conveniosparcerias.zip — **source_excerpt_preserved_and_sha256_verified**
- `SRC-BELO-DOE-CONVENIO` — Diário Oficial do Estado da Bahia / SEAGRI — https://www.escavador.com/diarios/6686733/DOEBA/P/2026-06-03?page=13 — **original_bytes_not_preserved_in_this_stage**
- `SRC-BELO-PREFEITURA-PREVIA` — Prefeitura Municipal de Belo Campo — https://www.belocampo.ba.gov.br/Site/Noticias/noticia-030620260948572561-Cavalgada-A-Tradi-o-do-Vaqueiro-movimenta-Belo-Campo-no-pr-ximo-domingo — **official_html_content_verified_raw_snapshot_pending**
- `SRC-BELO-PREFEITURA-POS` — Prefeitura Municipal de Belo Campo — https://www.belocampo.ba.gov.br/Site/Noticias/noticia-120620262339492561-Cavalgada-A-Tradi-o-do-Vaqueiro-re-ne-cerca-de-11-mil-pessoas-e-celebra-a — **original_bytes_not_preserved_in_this_stage**

**Documentos prioritários não recuperados integralmente:**
- **Processo SEI integral 010.9156.2025.0002545-71** — Permite verificar plano de trabalho, cronograma, cláusulas de liberação, pareceres e motivação do pagamento.
- **Plano de Trabalho aprovado, cronograma de execução e cronograma de desembolso** — Define exatamente quais serviços/etapas eram financiados e se algum permanecia em andamento em 04/07.
- **Processo administrativo de liquidação/liberação dos R$ 200.000,00 em 08/07 e parecer jurídico eleitoral** — Esclarece o enquadramento adotado pela SEAGRI para efetuar o repasse no período vedado.
- **Prestação de contas parcial/final do Convênio 01/2026, notas fiscais, contratos e comprovantes de execução** — Permite identificar quando cada serviço foi executado e se o valor estadual financiou despesas anteriores, posteriores ou ambas.
- **Classificação formal da natureza jurídica do repasse Estado→Município** — É indispensável confirmar se o fluxo é transferência voluntária para fins do art. 73, VI, a ou se há fundamento legal para tratamento diverso.

**Diligências propostas:**
- **SEAGRI / Governo do Estado da Bahia:** Encaminhar cópia integral do Processo SEI 010.9156.2025.0002545-71, incluindo Convênio completo, Plano de Trabalho, cronogramas, pareceres, processo de liquidação/pagamento de 08/07 e fundamento jurídico-eleitoral da liberação.
- **Município de Belo Campo:** Encaminhar prestação de contas do Convênio 01/2026 e as contratações, notas fiscais, ordens de fornecimento/serviço e comprovantes relativos às despesas custeadas pelo aporte estadual.
- **SEFAZ/FIPLAN:** Certificar o histórico integral do instrumento 10101.0001.26.0000079-3 e da NOB 10101.0001.26.0001454-0, discriminando emissão, liquidação, efetivação e natureza do pagamento.
- **SEAGRI / Assessoria Jurídica:** Informar a classificação jurídica do repasse Estado→Município para fins do art. 73, VI, a, inclusive a relevância atribuída à origem orçamentária vinculada à transferência especial federal.

**Cautela:** O pacote documenta a cronologia do Convênio SEAGRI 01/2026, a realização do evento e o pagamento posterior ao início do defeso. Não afirma, por si só, ilícito eleitoral, abuso, dolo, desvio de finalidade ou que o repasse necessariamente se enquadre como transferência voluntária sujeita ao art. 73, VI, a.

### 3. Araçás — PREBA-03
**Instrumentos e identificadores:** agreement: `Convênio SUDESB 31/2026` · seiProcess: `069.1479.2026.0003119-33` · seiDocument: `00142985210` · seiCrc: `86E7C460` · fiplanInstrument: `21301.0001.26.0000276-0` · procurement: `Concorrência Eletrônica 007/2026` · municipalProcess: `131/2026` · pncpControl: `16131088000110-1-000007/2026`.

**Cronologia documentada:**
- **2026-06-19 —** Procuradoria da SUDESB assinou eletronicamente o Termo de Convênio 31/2026. _(fonte SRC-ARA-SUDESB-TERM)_
- **2026-06-25 —** Diretor-Geral da SUDESB e Prefeito de Araçás assinaram eletronicamente o Convênio 31/2026. _(fonte SRC-ARA-SUDESB-TERM)_
- **2026-06-26 —** Publicação do instrumento registrada na base investigativa consolidada. _(fonte SRC-ARA-SUDESB-INDEX)_
- **2026-07-04 —** Início do período de vedação às transferências voluntárias estaduais a municípios, ressalvadas as hipóteses legais. _(fonte LEGAL-TSE-23760-2026)_
- **2026-07-10 —** FIPLAN registra pagamento efetivado de R$ 8.146,70 no instrumento 21301.0001.26.0000276-0. _(fonte CE-016)_
- **2026-07-10 —** Publicação no PNCP da Concorrência Eletrônica 007/2026 para executar a implantação de grama sintética da Areninha Society, valor estimado de R$ 732.421,46. _(fonte CE-056)_
- **2026-07-27 —** Data de encerramento/abertura competitiva informada para a Concorrência 007/2026. _(fonte SRC-ARA-PNCP-007)_

**Fontes disponíveis/referenciadas:**
- `SRC-ARA-FIPLAN-PRESERVED` — Governo do Estado da Bahia / SEFAZ / FIPLAN — https://dados.ba.gov.br/dataset/9079f8b9-f480-466f-8016-d03108f6420f/resource/abbd1ce3-2117-4732-9c9f-8860e11efb3a/download/conveniosparcerias.zip — **source_excerpt_preserved_and_sha256_verified**
- `SRC-ARA-SUDESB-TERM` — SUDESB — https://www.ba.gov.br/esporte/sites/site-sudesb/files/2026-06/SEI_00142985210_Termo_de_Convenio.pdf — **official_pdf_text_reviewed_binary_pending_archival**
- `SRC-ARA-SUDESB-INDEX` — SUDESB — https://www.ba.gov.br/esporte/35/construcoes-e-reformas-de-equipamentos-esportivos — **official_index_lists_sources_binary_pending**
- `SRC-ARA-PNCP-007` — Portal Nacional de Contratações Públicas — https://pncp.gov.br/app/editais/16131088000110/2026/7 — **original_bytes_not_preserved_in_this_stage**

**Documentos prioritários não recuperados integralmente:**
- **Histórico integral FIPLAN do instrumento 21301.0001.26.0000276-0, incluindo todos os repasses anteriores e posteriores** — O pagamento localizado de R$ 8.146,70 não coincide com a primeira parcela de R$ 292.514,22; sem o histórico integral não é possível reconstruir o fluxo.
- **Processo SEI integral 069.1479.2026.0003119-33** — Permite verificar plano de trabalho, cronograma, pareceres, AIO, liberação, fiscalização e eventual fundamento de exceção.
- **Plano de Trabalho e cronograma físico-financeiro/cronograma prefixado** — É parte vinculada ao convênio e essencial para testar os requisitos da exceção eleitoral.
- **Autorização de Início de Obra (AIO), Ordem de Serviço e contrato de execução** — Fixam a possibilidade jurídica e material de início da obra e permitem comparar a data com 04/07.
- **Primeira medição, diário de obra, relatório fotográfico, ART/RRT e fiscalização de engenharia** — Permitem determinar objetivamente quando começou a execução física.
- **Processo municipal 131/2026 / Concorrência 007/2026 completo, inclusive adjudicação, homologação e contrato** — A fonte pública localizada confirma o edital, mas não forneceu, no recorte pesquisado, cadeia completa de contratação e execução.

**Diligências propostas:**
- **SUDESB / Governo do Estado da Bahia:** Encaminhar a íntegra do Processo SEI 069.1479.2026.0003119-33, incluindo Plano de Trabalho, cronogramas, AIO, pareceres, fiscalização e documentação de cada liberação financeira.
- **SEFAZ/FIPLAN:** Certificar o histórico integral do instrumento 21301.0001.26.0000276-0, identificando todas as NOBs, parcelas, datas de emissão, liquidação e efetivação, inclusive eventual repasse anterior a 04/07.
- **Município de Araçás:** Encaminhar íntegra do Processo 131/2026/Concorrência 007/2026, contrato, homologação, AIO/OS recebidas, diário de obra, medições, ART/RRT e registros do início físico.
- **SUDESB / Assessoria Jurídica:** Informar o fundamento jurídico-eleitoral aplicado a eventual repasse realizado após 04/07 e os documentos que demonstrariam os requisitos de eventual exceção.

**Cautela:** O pacote documenta o Convênio SUDESB 31/2026, suas cláusulas de liberação/início, o pagamento FIPLAN localizado no período vedado e a contratação executora publicada em 10/07. Não afirma, por si só, ilícito eleitoral, ausência de execução anterior ou que o pagamento de R$ 8.146,70 corresponda à primeira parcela de R$ 292.514,22.

### 4. Jaguaquara — PREBA-04
**Instrumentos e identificadores:** municipalRevenueLabel: `Convênio Estadual 28/2026 - Construção de Estádio Município de Jaguaquara` · seiProcess: `069.1475.2026.0002965-01` · fiplanInstrument: `21301.0001.26.0000298-1` · fiplanAgency: `SETRE` · stateAgreementNumberAsMunicipalRevenue: `28/2026`.

**Cronologia documentada:**
- **2026-07-02 —** Publicação do instrumento 21301.0001.26.0000298-1 registrada na base FIPLAN consolidada, vinculada ao objeto 'Construção de um Estádio' e ao Processo SEI 069.1475.2026.0002965-01. _(fonte SRC-JAG-FIPLAN-PRESERVED)_
- **2026-07-04 —** Início do período de vedação às transferências voluntárias estaduais a municípios, ressalvadas as hipóteses legais. _(fonte LEGAL-TSE-23760-2026)_
- **2026-07-10 —** FIPLAN registra pagamento efetivado de R$ 518.432,07 no instrumento 21301.0001.26.0000298-1. _(fonte CE-029-STADIUM-SLICE)_
- **2026-10-06 —** Portal municipal de receitas, atualizado em 06/10, identifica receita acumulada de R$ 518.432,07 como 'Convênio Estadual 28/2026 - Construção de Estádio Município de Jaguaquara'. _(fonte CE-057)_

**Fontes disponíveis/referenciadas:**
- `SRC-JAG-FIPLAN-PRESERVED` — Governo do Estado da Bahia / SEFAZ / FIPLAN — https://dados.ba.gov.br/dataset/9079f8b9-f480-466f-8016-d03108f6420f/resource/abbd1ce3-2117-4732-9c9f-8860e11efb3a/download/conveniosparcerias.zip — **source_excerpt_preserved_and_sha256_verified**
- `SRC-JAG-MUNICIPAL-REVENUE` — Prefeitura Municipal de Jaguaquara / Município Online — https://www.municipioonline.com.br/ba/prefeitura/jaguaquara/cidadao/receita — **official_html_content_verified_raw_snapshot_pending**
- `SRC-JAG-SUDESB-NUMBERING-CHECK` — SUDESB — https://www.ba.gov.br/esporte/35/construcoes-e-reformas-de-equipamentos-esportivos — **original_bytes_not_preserved_in_this_stage**

**Documentos prioritários não recuperados integralmente:**
- **Processo SEI integral 069.1475.2026.0002965-01** — É a peça central para identificar convenente estadual, número formal do convênio, termo, plano, cronograma, pareceres e liberação.
- **Termo de convênio/instrumento formal correspondente à rubrica municipal 'Convênio Estadual 28/2026'** — Resolve a cautela de numeração e identifica corretamente órgão convenente, cláusulas e parcelas.
- **Plano de Trabalho e cronograma físico-financeiro/prefixado** — Permitem testar o requisito de cronograma e a etapa financiada pelos R$ 518.432,07.
- **Contratação da empresa executora, adjudicação, homologação e contrato** — Determinam quando surgiu a obrigação executiva concreta e quem poderia iniciar a obra.
- **AIO/Ordem de Serviço** — Define a autorização formal de início da obra e sua posição temporal frente a 04/07.
- **Primeira medição, diário de obra, relatório fotográfico, ART/RRT e fiscalização** — São as melhores provas objetivas para fixar a data de início físico da construção.
- **Processo de liquidação/liberação do pagamento de R$ 518.432,07 e parecer jurídico-eleitoral** — Esclarece o fundamento administrativo e legal adotado para liberar o recurso em 10/07.

**Diligências propostas:**
- **SETRE / unidade estadual responsável pelo Processo SEI 069.1475.2026.0002965-01:** Encaminhar íntegra do processo, termo formal do convênio, Plano de Trabalho, cronogramas, pareceres, AIO/OS, fiscalização, medições e documentação da liberação financeira.
- **SEFAZ/FIPLAN:** Certificar o histórico integral do instrumento 21301.0001.26.0000298-1, com todas as NOBs, parcelas, datas de emissão, liquidação, efetivação e identificação da natureza do pagamento de R$ 518.432,07.
- **Município de Jaguaquara:** Encaminhar termo do Convênio Estadual 28/2026 referido em sua receita, processo municipal de contratação da obra, contrato, AIO/OS, medições, diário de obra, ART/RRT e prestação de contas correspondente.
- **Órgão jurídico estadual competente:** Informar o fundamento jurídico-eleitoral aplicado à liberação de 10/07 e os documentos que demonstrariam eventual enquadramento nas exceções do art. 73, VI, a.

**Cautela:** O pacote documenta o pagamento de R$ 518.432,07, seu vínculo material com a rubrica municipal do Convênio Estadual 28/2026 para construção de estádio e a proximidade temporal entre publicação do instrumento, início do defeso e pagamento. Não afirma, por si só, ilícito eleitoral, ausência de execução física anterior ou a identidade do órgão estadual convenente sem o processo integral.

## Ingestão na API
- `GET /api/intelligence/datasets?name=fm02-documentary-ledger`: registro da etapa, fontes e cronologias.
- `GET /api/intelligence/datasets?name=fm02-fiplan-primary-rows`: quatro linhas extraídas de fonte primária preservada.
- Nova área do cockpit privado mostra o progresso, as NOBs comprovadas e os itens P0 pendentes.
- Binários PDF originais SEI/PNCP ainda não arquivados nesta etapa; permanecem como referências documentais. O sistema já dispõe de arquivamento autenticado no Blob para recuperar e hashear fontes externas.

## Próximas diligências indispensáveis
1. Requisitar autos SEI íntegros, Plano de Trabalho e cronogramas.
2. Recuperar AIO/OS, contrato, primeira medição e diário de obra, quando aplicáveis.
3. Confirmar os documentos financeiros do Estado e da Prefeitura sem inferir finalidade eleitoral.
4. Priorizar certificados das fontes primárias na área privada e atualizar explicitamente a situação de arquivamento.

**Não há qualquer resultado de investigação criminal nem comprovação de compra de votos nesta etapa.**
