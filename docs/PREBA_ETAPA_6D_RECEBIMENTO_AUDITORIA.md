# PRE-BA — Etapa 6D: contrato de recebimento e cadeia de custódia

**Estado:** especificação + validador offline, sem endpoint de upload nesta etapa. **Ambiente:** branch de QA. **Política:** não guardar documentos, informações pessoais, tokens nem comprovantes sensíveis no GitHub público.

## Máquina de estados

`not_requested → requested → received_unverified → verified`.

Saídas alternativas são `not_located` (busca realizada, com escopo e data), `not_applicable` (justificativa registrada) ou `rejected` para arquivo inconsistente. Recebimento não implica verificação. Uma decisão `verified` requer revisão humana, documento preservado, integridade e origem comprovada; decisões desfavoráveis ou ausência de documentos não estabelecem ilícito.

## Envelope de evento append-only

Cada evento privado deverá conter os campos `eventId`, `requestId`, `packageId`, `kind`, `createdAt`, `actorId`, `reason`, `previousEventHash` e `eventHash`; para recebimento, incluir `blobPath`, `sha256`, `mimeType`, `sizeBytes`, `sourceUrl`, `publisher`, `originalFilename`, `retrievedAt`. Para avaliação, incluir `gate` (G0-G6), `decision`, `reviewerId` e fundamentação. Campos opcionais somente quando inaplicáveis à espécie do evento.

- **Persistência:** usar Vercel Blob privado ou banco com controle de acesso, nunca export público. O registro de eventos não deve ser sobrescrito; anexos devem ser imutáveis.
- **Autenticidade:** verificar sessão e permissão administrativa no servidor, não confiar em `actorId` recebido do navegador.
- **Integridade:** computar SHA-256 sobre bytes originais e validá-lo após recuperação. `previousEventHash` deve apontar para o evento anterior da cadeia do mesmo `requestId`; recomputar `eventHash` sobre representação canônica.
- **Idempotência:** `eventId` único; reapresentação idêntica sem duplicação; mesmo ID com conteúdo diverso deve falhar.
- **Upload:** limitar extensão/MIME e tamanho, recusar executáveis e conteúdo perigoso, verificar assinaturas de arquivo, aplicar varredura de malware e não distribuir URLs públicas permanentes.
- **Privacidade:** princípio de minimização e retenção definida; remover identificadores pessoais desnecessários em cópias de trabalho sem alterar o original.
- **Validação:** revisão de fonte institucional, vinculação ao instrumento/NOB, cronologia, hipóteses alternativas e análise jurídica; não promover automaticamente `protocolReady`.
- **Exposição:** a aba privada exibe apenas estado, metadados mínimos, gates e links autenticados temporários; a Intel API pública não expõe o ledger nem arquivos brutos.
- **Auditoria:** guardar decisões, motivos e datas de recebimento, incluindo revisões reversíveis mediante novo evento e sem exclusão dos anteriores.

## Gates de liberação da implementação com escrita

1. Projeto mantém autenticação efetiva em `/privado` e protege todas as rotas de upload/download.
2. Testes adversariais cobrem sessão ausente, repetição, alteração de hash, MIME inválido, arquivo excessivo, troca de pacote e concorrência.
3. Storage privado configurado; comprovada impossibilidade de acesso anônimo ao arquivo.
4. Revisão humana obrigatória e evidenciada para avançar qualquer gate.
5. A contagem das 57 evidências CE e os quatro status `protocolReady=false` permanecem inalterados sem revisão individual.
6. Nenhuma alteração em `main` ou promoção da Vercel antes de QA completo e aceite humano.

## Próxima entrega técnica

Implementar backend autenticado de recepção, ledger append-only com lock/idempotência e operações de consulta, acompanhado de testes de segurança e upload. **Nenhum evento real é fabricado por este documento.**
