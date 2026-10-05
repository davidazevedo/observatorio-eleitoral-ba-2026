# Roadmap — Observatório Eleitoral Bahia 2026

## Propósito
Construir uma plataforma pública, apartidária na metodologia e auditável para: (a) apresentar a representação/dossiê; (b) receber fatos e evidências; (c) organizar uma trilha probatória por município; e (d) preparar material tecnicamente utilizável em eventual notícia de fato ou representação perante as autoridades competentes.

## Princípios não negociáveis
- Fato, indício, relato e hipótese são categorias distintas.
- Nenhuma pessoa ou empresa será apresentada como autora de ilícito apenas por correlação temporal, vínculo político ou recebimento de recurso público.
- Prioridade para fonte primária: portais oficiais, contratos, empenhos, liquidações, ordens de pagamento, processos licitatórios, medições, Diário Oficial e dados oficiais eleitorais.
- Direito de resposta, correção e versionamento público do dossiê.
- Material bruto de denunciantes permanece privado; publicação exige curadoria e, quando necessário, anonimização.
- Preservar original e contexto de obtenção da evidência.

## Fase 0 — Fundação técnica
- [x] Next.js App Router.
- [x] Landing pública.
- [x] Formulário sem identificação no formulário ou identificado.
- [x] Sessão efêmera assinada para submissões.
- [x] Upload de documentos, imagens, áudio e vídeo preparado para Vercel Blob privado.
- [x] Separação entre upload bruto e publicação.
- [x] Protocolo de recebimento.
- [x] Repositório GitHub dedicado: `davidazevedo/observatorio-eleitoral-ba-2026`.
- [x] Projeto Vercel `observatorio-eleitoral-ba-2026` criado em `gru1`.
- [ ] Validar primeiro deploy Git integrado.
- [ ] Associar Blob privado ao projeto e validar upload fim a fim.
- [ ] Aplicar rate limiting/WAF e proteção antiautomação adicional.

## Fase 1 — Dossiê público mínimo viável
- [x] Consolidar texto-base da representação.
- [x] Criar página `/dossie` com fatos públicos, enquadramentos, matriz, pedidos e contexto processual.
- [x] Criar página `/fontes` com catálogo de fontes primárias/institucionais.
- [x] Criar página `/privacidade` com política operacional e cautelas.
- [ ] Criar página `/casos` com publicação apenas de ocorrências verificadas.
- [ ] Adicionar changelog público e data da última atualização.
- [ ] Inserir política formal de correção, contraditório e canal de contato.

## Fase 2 — Matriz probatória dos 417 municípios
Para cada município:
1. instrumento/convênio;
2. concedente e fonte do recurso;
3. valor previsto/empenhado/liquidado/pago;
4. datas-chave;
5. objeto;
6. licitação/contrato;
7. fornecedor e quadro societário;
8. aditivos;
9. ordem de serviço;
10. cronograma físico-financeiro;
11. medições e execução física;
12. eventual fundamento para exceção à vedação eleitoral;
13. fatos eleitorais correlatos documentados;
14. nível de evidência;
15. fontes e anexos.

### Priorização
- pagamentos ocorridos entre 04/07/2026 e 04/10/2026;
- liberações imediatamente anteriores ao período de vedação;
- contratos de valor materialmente elevado;
- aditivos, dispensas e fornecedores recorrentes;
- discrepância entre desembolso e execução física;
- coincidências documentadas com fornecedores/prestadores eleitorais.

## Fase 3 — Pipeline de triagem
### Estados
`received -> quarantined -> triage -> corroborating -> verified | insufficient | rejected -> publishable -> referred`

### Níveis de evidência
- L0 — relato não verificado;
- L1 — relato + material anexado, autenticidade ainda não corroborada;
- L2 — corroborado por fonte pública independente;
- L3 — documento primário e cadeia documental coerente;
- L4 — conjunto convergente de fontes primárias + execução material verificada.

Nenhum L0/L1 deve ser exibido publicamente com identificação acusatória.

## Fase 4 — Segurança e integridade
- Rate limiting e proteção antiautomação.
- Quarentena de anexos e varredura de malware.
- Hash SHA-256 no ingresso; manifesto de evidências por submissão.
- Registro de auditoria append-only para alterações de status.
- Separação dos dados de contato da narrativa/evidência.
- Retenção e descarte definidos por política.
- Backup fora do ambiente de produção.
- Painel administrativo autenticado, sem indexação.

## Fase 5 — Banco analítico
Adotar Neon Postgres via Vercel Marketplace para metadados e relações. Blob permanece como repositório de arquivos.

Entidades sugeridas: `submissions`, `evidences`, `municipalities`, `public_transfers`, `procurements`, `contracts`, `suppliers`, `measurements`, `electoral_entities`, `sources`, `relationships`, `reviews`, `audit_log`.

## Fase 6 — Coleta automatizada de dados públicos
- Transparência Bahia;
- Transferegov e dados federais relevantes;
- TCM-BA/TCE-BA conforme disponibilidade;
- Diários oficiais;
- TSE — prestação de contas, fornecedores e dados eleitorais;
- portais municipais priorizados.

Todos os coletores devem guardar: URL, timestamp, conteúdo bruto/arquivo, checksum, parser version e registro normalizado.

## Fase 7 — Análise e detecção de anomalias
- concentração temporal de liberações;
- concentração por fornecedor;
- outliers de preço unitário;
- aditivos e fracionamento;
- pagamentos incompatíveis com cronograma/medição;
- redes societárias e recorrência entre municípios;
- cruzamentos eleitorais estritamente documentais.

O algoritmo produz fila de revisão; não produz acusação automática.

## Fase 8 — Encaminhamento institucional
Gerar pacote fechado contendo:
- petição/representação;
- sumário executivo;
- metodologia;
- matriz de fatos;
- anexos numerados;
- índice e hashes;
- fontes públicas;
- pedidos de diligência;
- apêndice com casos ainda inconclusivos, separado dos fatos corroborados.

## Critério de conclusão do MVP
O MVP está concluído quando: landing pública estiver em produção; formulário aceitar os dois modos de envio; anexos grandes forem enviados ao Blob privado; submissão gerar protocolo; nenhum arquivo bruto estiver publicamente acessível; e o dossiê possuir fontes oficiais, metodologia explícita e política de privacidade.
