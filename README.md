# Observatório Eleitoral Bahia 2026

Portal público para organização documental e auditável de fatos relacionados à aplicação de recursos públicos no contexto das Eleições 2026 na Bahia.

> O projeto não presume ilícito a partir de alinhamento político, anúncio de investimento, contrato, obra ou correlação temporal. Relato, indício, correlação e fato corroborado são categorias distintas.

## Frentes

1. **Dossiê público** — fatos oficiais, enquadramentos jurídicos a examinar, metodologia, matriz probatória e pedidos de diligência.
2. **Coleta cidadã** — relatos sem identificação no formulário ou identificados, com documentos, fotos, áudio e vídeo em armazenamento privado.
3. **Auditoria de dados** — evolução prevista para consolidar transferências, contratos, fornecedores, execução física e dados eleitorais dos 417 municípios.

## Stack
- Next.js 16 / App Router
- React 19 + TypeScript
- Vercel
- Vercel Blob privado para evidências

## Rotas
- `/` — apresentação e síntese
- `/dossie` — dossiê público completo
- `/fontes` — catálogo de fontes oficiais
- `/enviar` — coleta de fatos e evidências
- `/privacidade` — regras de privacidade e segurança

## Infraestrutura
- GitHub: `davidazevedo/observatorio-eleitoral-ba-2026`
- Vercel: projeto `observatorio-eleitoral-ba-2026`
- Região padrão das Functions: `gru1`
- Evidências: Vercel Blob privado, conectado ao projeto

## Desenvolvimento
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Variáveis
- `SUBMISSION_SIGNING_SECRET` — segredo de no mínimo 32 caracteres para sessões efêmeras.
- `BLOB_READ_WRITE_TOKEN` — credencial do Vercel Blob quando aplicável. Nunca versionar.

## Segurança
Leia [`SECURITY.md`](./SECURITY.md). Arquivos recebidos, dados de contato, tokens e exports de submissões nunca pertencem a este repositório público.

## Roadmap
Veja [`docs/ROADMAP.md`](./docs/ROADMAP.md).
