# Segurança e tratamento de evidências

Este projeto recebe potencialmente material sensível. O repositório público nunca deve conter tokens, arquivos recebidos, dados de contato de denunciantes ou exports de submissões.

## Regras
1. Evidências originais: Vercel Blob com `access: private`.
2. Dados identificáveis: somente quando o usuário selecionar envio identificado.
3. Publicação: sempre por cópia curada/redigida, nunca apontando diretamente para o blob bruto.
4. Não registrar IP no código da aplicação para fins de identificação do denunciante. Isso não equivale a prometer ausência de logs técnicos da infraestrutura.
5. Não coletar CPF, RG, senha ou credencial.
6. Arquivo suspeito não deve ser aberto em estação pessoal antes de quarentena/varredura.
7. Futuro: SHA-256, malware scanning, audit log append-only, segregação de dados de contato e RBAC administrativo.

## Variáveis
- `BLOB_READ_WRITE_TOKEN`: segredo. Nunca versionar.
