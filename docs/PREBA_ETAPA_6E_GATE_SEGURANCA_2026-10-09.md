# Etapa 6E — Gate de segurança do recebimento privado

Data de referência: 09/10/2026. Branch de revisão, sem publicação deliberada em produção.

## Contrato atual
O endpoint `POST /api/private/preba-intake` exige sessão privada, origem da aplicação e multipart válido. Aceita apenas PDF, PNG e JPG de até 8 MiB, com verificação básica de assinatura, extensão e MIME. O armazenamento Vercel Blob usa objetos privados sem sobrescrita e recibo individual com SHA-256.

## Fechamento preventivo (fail closed)
O recebimento exige **simultaneamente**:
1. `PREBA_INTAKE_ENABLED=true` configurada explicitamente no ambiente autorizado (ausência significa bloqueio).
2. Diligência com estado `requested` no tracker versionado.
3. `BLOB_READ_WRITE_TOKEN` disponível para armazenamento privado.
4. Sessão administrativa válida e mesma origem.

**Estado atual:** as 20 diligências constam `not_requested`; assim, qualquer solicitação de upload deve ser rejeitada, mesmo com a feature flag habilitada. Nenhum documento real deve ser enviado neste estágio.

## Limitações de liberação
A implementação ainda não fornece identidade individual do operador, trilha transacional append-only, reconciliação de objetos órfãos, controle distribuído de taxa/concorrência, antimalware, isolamento de arquivos com leitura segura, nem ensaios negativos e de ponta a ponta com autenticação. A assinatura de arquivo é apenas uma inspeção inicial, não uma validação de segurança do conteúdo.

O recibo tem estado obrigatório `received_unverified`; nenhuma confirmação probatória ou `protocolReady` é promovida automaticamente. Não disponibilizar upload a usuários reais nem configurar `PREBA_INTAKE_ENABLED=true` antes de fechar essas lacunas.

## QA de regressão
O script `scripts/validate-preba-intake.mjs` é executado no prebuild. Confere que 20 diligências continuam `not_requested`, os quatro pacotes permanecem `protocolReady=false` e que os mecanismos de fechamento estão presentes. Este teste é estático e **não substitui** testes funcionais, de concorrência, de malware ou de armazenamento privado.

## Gate subsequente
Implementar auditoria transacional com identificação de operador, testes funcionais negativos e recuperação de gravações parciais, seguido de teste autenticado em preview isolado. Manter PR em draft até aprovação.
