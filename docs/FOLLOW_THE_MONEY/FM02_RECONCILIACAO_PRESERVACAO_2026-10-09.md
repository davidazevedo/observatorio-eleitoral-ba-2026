# FM-02 — Reconciliação de capturas e política de retenção (09/10/2026)

## Escopo e decisão

A PR histórica #26 não pode ser mesclada em bloco: seus manifests e índices são anteriores às atualizações de `main`. São **30 caminhos de snapshots** no commit auditado: **4 idênticos** à `main`, **26 ausentes da árvore atual de `main`**, mas preservados na branch histórica `feature/fm02-primary-financial-lines` e no backup imutável de referência `backup/fm02-before-reconcile-20261009`. Os arquivos ausentes não foram declarados perdidos nem reclassificados como novas evidências.

### Correção aplicada neste PR
- Restaurado o snapshot `preservation/snapshots/cipo-dou-habitacao/2026-10-08T22-58-45Z.html` a partir da branch histórica, com **Git blob SHA idêntico** ao original.
- Reintroduzida a entrada de `2026-10-08T22:58:45Z` no manifesto histórico de `cipo-dou-habitacao`, mantendo **ordem cronológica e a última captura de 09/10/2026 06:11:54Z** como atual.
- **Não** foram substituídos certificados existentes, hashes de outras capturas ou contagens CE.

### Política de retenção e conciliação
1. **Registros de eventos:** append-only por fonte, certificados historicamente rastreáveis; atualizações posteriores não podem substituir eventos anteriores.
2. **Arquivos brutos:** preservar a captura original vinculada a certificado quando exigida no dossiê ou quando houver valor probatório individual; se não estiver na árvore ativa, localizar no commit/branch de preservação e registrar caminho + SHA do Git antes de qualquer restauração.
3. **Ausência na árvore atual:** não equivale a perda de bytes, corrupção ou desaparecimento do fato, desde que objeto original acessível em commit/backup. O backup citado acima deve ser mantido até a política de arquivamento durável externo estar implementada.
4. **Restauração em `main`:** somente quando se confirmar referência necessária ao artefato, certificado único não presente no histórico ativo ou necessidade efetiva de arquivo físico no pacote. Evitar adicionar indiscriminadamente os demais 25 arquivos do snapshot histórico sem demanda de preservação probatória.
5. **Deduplicação:** capturas repetidas de mesma fonte não geram novo CE nem prova adicional de pagamento, contratação ou irregularidade.
6. **Segurança:** os snapshots públicos de páginas não podem conter dados pessoais ou credenciais extraídas de ambientes autenticados; revisar antes de mover qualquer conteúdo ao repositório.

### Pendência operacional de longo prazo
Implantar arquivo de longa duração (WORM/imutável) para históricos não presentes na árvore ativa e manifesto consolidado de certificados multiversão. Isto **não é pré-requisito para mesclar a presente correção pontual**, mas impede afirmar que todo o lote de 26 arquivos já esteja armazenado na árvore `main`.

### Gates desta correção
- [x] Origem histórica e blob SHA conferidos.
- [x] Manifesto cronológico reconciliado sem retrocesso do último evento.
- [ ] Build completo e validadores de integridade em preview.
- [ ] Merge somente após checks aprovados.
