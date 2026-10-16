# PRE-BA 6E.4 — Matriz de recuperação e plano de liberação

## Estado desta entrega
Política determinística `evaluateIntakeRecovery`: compara fase do ledger com presença de original, recibo, consistência de recibo e SHA-256 do arquivo recuperado. Para divergências, encaminha a revisão humana; não modifica arquivos nem promove status. A suíte cobre 12 cenários **sintéticos**. Não são testes reais do Vercel Blob.

## Evidências mínimas antes de go-live
- [ ] PostgreSQL persistente isolado em QA, migração aplicada e role com permissões mínimas
- [ ] Adaptador de inventário PostgreSQL + Vercel Blob que obtenha bytes reais e compute SHA-256
- [ ] Detecção de operações em voo, com janela de segurança e reconciliação idempotente
- [ ] Falha injetada: Blob original antes do commit no ledger
- [ ] Falha injetada: recibo antes do commit no ledger
- [ ] Falha injetada: interrupção após reserva, antes de Blob
- [ ] Correção audível da condição `recovery_required`, sem exclusão automática
- [ ] Proteção antimalware, quarentena e leitura controlada
- [ ] Identidade individual com emissão/revogação e trilha de acesso
- [ ] Rate limiting distribuído, proteção CSRF e controle de tamanho de request por streaming
- [ ] Teste de acesso não autorizado, replay, concorrência, falhas parciais e backups restaurados
- [ ] Aprovação de segurança, evidências de homologação e plano de rollback

## Política operacional
`PREBA_INTAKE_ENABLED` deve permanecer ausente ou `false`, incluindo produção. O status `received_unverified` não equivale a validação probatória; `protocolReady` permanece falso. Revisões humanas, sem mutação automática de evidências.

## Nota de integridade
Atualmente `lib/preba-intake-audit.ts` verifica metadados de recibo, **não baixa os bytes do original para conferir SHA-256**. A política recebe `originalDigestMatches` somente de um verificador futuro confiável. Portanto, nenhum endpoint deve utilizar seus resultados como aprovação de integridade sem implementar essa verificação efetiva.
