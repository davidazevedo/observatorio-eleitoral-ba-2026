# PRE-BA — decisão de GO-LIVE (19/10/2026)

**Decisão: NO-GO para habilitar o recebimento de documentos reais.**

## Verificações de infraestrutura
Na consulta de variáveis do projeto Vercel `observatorio-eleitoral-ba-2026`, havia `BLOB_READ_WRITE_TOKEN`, mas não estavam cadastradas `PREBA_LEDGER_DATABASE_URL`, `PREBA_LEDGER_ENABLED`, `PREBA_INTAKE_ENABLED`, `PREBA_OPERATOR_SIGNING_SECRET` nem `PREBA_OPERATOR_IDS`. Sem elas, a API deve falhar de forma segura.

## Requisitos impeditivos
- [ ] Provisionar PostgreSQL persistente de QA/prod com separação, TLS, migração, backups testados e credencial de mínimo privilégio.
- [ ] Implantar emissão, revogação e verificação ponta a ponta da identidade individual de operadores.
- [ ] Aplicar antimalware real em isolamento; nenhum documento deve ser acessível como evidência validada sem revisão.
- [ ] Implementar rate limiting distribuído, controles de acesso e testes negativos.
- [ ] Verificar SHA-256 dos bytes recuperados do Blob e a reconciliação real Blob/PostgreSQL sob falhas.
- [ ] Completar testes autenticados de ponta a ponta, restauração de backup, rollback e observabilidade.
- [ ] Formalizar as diligências: as 20 solicitações ainda figuram como `not_requested`; não alterá-las automaticamente.
- [ ] Aprovação documentada do gate de segurança e autorização operacional.

## Política
Não configurar `PREBA_INTAKE_ENABLED=true` até que os itens sejam testados. Não inferir que build ou testes sintéticos provam prontidão. O protocolo deve permanecer bloqueado e `received_unverified` não é evidência validada.

## Ativação futura
Executar implantação canário com operador individual, lote fictício isolado, prova de imutabilidade e recuperação, inspeção dos logs e capacidade de reverter imediatamente a flag. Só depois liberar um grupo mínimo autorizado com monitoramento.
