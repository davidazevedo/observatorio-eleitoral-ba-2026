# Preservação independente de fontes

Este diretório mantém alvos, manifestos e snapshots de fontes públicas usados pelo Observatório.

- `targets.json`: fontes monitoradas.
- `manifests/`: histórico de coleta, HTTP, SHA-256 e certificado por fonte.
- `snapshots/`: bytes brutos quando o tamanho e a natureza da fonte permitem.
- `docs/source-certificate-index.json`: estado consolidado e hash-raiz do lote.

A coleta é executada em infraestrutura do GitHub Actions. O commit resultante fornece uma trilha temporal separada do storage privado do portal. O mecanismo melhora a auditabilidade, mas não substitui ata notarial, ICP-Brasil, carimbo do tempo qualificado ou perícia quando juridicamente necessários.
