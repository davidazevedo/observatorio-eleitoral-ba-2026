# PRE-BA 6E.3 — Ledger transacional: migração inicial

A migração `db/migrations/20261013_preba_intake_ledger.sql` define tabelas de reserva de operação e eventos com restrições de unicidade, campos de integridade e bloqueio de UPDATE/DELETE em eventos. O `operation_id` é chave primária e fornece ponto de idempotência para futura API.

## Limite técnico explícito
Esta entrega é o **schema**, não uma integração operacional. Ainda faltam provisionamento do PostgreSQL, uma transação por reserva/transição com bloqueio `SELECT ... FOR UPDATE`, algoritmo canônico para geração/verificação encadeada de SHA-256, controle do papel SQL por mínimos privilégios e integração com a gravação de objetos privados. Um trigger append-only não impede alterações por administradores do banco: a auditoria exige backup externo independente e política de retenção.

A gravação em Blob continua não transacional em relação ao banco. Após erro de upload, o serviço deve marcar `recovery_required` dentro de transação e o processo de reconciliação deve comparar inventário privado com reservas, sem apagar automaticamente dados.

**Gate de habilitação:** não configurar `PREBA_INTAKE_ENABLED=true` antes de implementar e testar o adaptador transacional, identidade com emissão/revogação auditável, malware scan, limite distribuído e testes negativos de autorização e concorrência. O esquema ainda requer revisão de migration em PostgreSQL real; o teste de prebuild verifica invariantes estáticas apenas.

Estado das 20 diligências: `not_requested`. Todos os 4 pacotes permanecem `protocolReady=false`.
