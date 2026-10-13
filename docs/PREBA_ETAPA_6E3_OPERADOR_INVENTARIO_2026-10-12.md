# Gate 6E.3 — Atribuição individual e inventário privado (12/10/2026)

Esta entrega adiciona identidade individual assinada ao upload e inventário de objetos privados.

## Autenticação
O POST exige simultaneamente sessão administrativa existente, cookie de operador `preba_operator_identity` com HMAC SHA-256, expiração de no máximo uma hora, operador presente em `PREBA_OPERATOR_IDS`, `PREBA_OPERATOR_SIGNING_SECRET` de pelo menos 32 caracteres e `PREBA_INTAKE_ENABLED=true`. O recibo de cada original preserva `actorId`, mas não se expõe URL de download. A interface de emissão de identidade ainda não existe; não habilitar em ambiente real.

## Recuperação
O inventário privado da branch lista pares de arquivo/recibo, identifica `orphan_original` e `orphan_receipt` e verifica metadados dos recibos completos. Ele não corrige, apaga nem promove qualquer documento automaticamente. `PREBA_AUDIT_INVENTORY_ENABLED` fica desativada por padrão.

## Limites e próximos gates
Este inventário **não constitui** ledger transacional append-only nem fornece garantia de atomicidade das duas operações `put`. Faltam base persistente com unique constraint/event ledger assinado, emissão e revogação auditáveis de credenciais de operador, antimalware, rate limit distribuído, testes funcionais e negativos, verificação dos bytes reais recuperados e governança de retenção. Manter PR em draft, não habilitar o upload nem enviar documentos sensíveis para o preview.

Aprovação de compilação e testes estáticos não substitui revisão de segurança.
