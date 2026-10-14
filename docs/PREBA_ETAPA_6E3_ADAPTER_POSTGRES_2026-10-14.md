# PRE-BA 6E.3 — Adaptador transacional PostgreSQL (14/10/2026)

## Implementado
`lib/preba-ledger-postgres.ts` fornece `reserveIntake` com chave UUID idempotente, conferência de identidade/fonte/hash e `INSERT ... ON CONFLICT DO NOTHING`. `recordIntakeTransition` faz transições e eventos dentro da mesma transação PostgreSQL, com `SELECT ... FOR UPDATE` para serializar alterações de cada operação. Os eventos recebem `previous_hash` e `event_hash` SHA-256 derivados de representação determinística. Falha de uma instrução causa `ROLLBACK`.

## Segurança
O adaptador falha fechado sem `PREBA_LEDGER_ENABLED=true` e `PREBA_LEDGER_DATABASE_URL`. Não recebe credenciais no código. A API de upload existente permanece desligada por `PREBA_INTAKE_ENABLED`, e o adaptador **ainda não está ligado ao fluxo Blob/recibo**.

## Restrições de entrega
- Esquema SQL anterior precisa ser migrado em banco real com permissões mínimas, TLS correto e verificações de transação/idempotência/concorrência.
- Regras de transição são preliminares e carecem de teste de recuperação após falha entre operações de Blob.
- Não se trata de auditoria à prova de administradores: hash deve ser verificado independentemente e checkpoints devem ser preservados fora do banco.
- Provisão do banco, configuração do segredo, emissão/revogação de operador, varredura antimalware, teste funcional e controle distribuído de taxa permanecem pendentes.
- Nenhuma diligência foi alterada de `not_requested`, nenhum protocolo liberado ou evidência recebida.

**Não promover nem habilitar operações reais sem esses controles.**