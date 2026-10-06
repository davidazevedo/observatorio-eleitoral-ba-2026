# Política de preservação de fontes

O Observatório não deve depender apenas de URLs vivas. Páginas oficiais podem mudar, sair do ar ou ser temporariamente indisponibilizadas.

## Para cada fonte relevante
Registrar:
- identificador interno;
- URL original;
- órgão/publicador;
- título;
- data de publicação quando disponível;
- data/hora da consulta;
- fato objetivo sustentado;
- tipo de fonte (primária, institucional, normativa, dados);
- eventual arquivo oficial associado;
- checksum do arquivo quando houver;
- status da URL na última revisão.

## Material a preservar
Priorizar, quando juridicamente e tecnicamente possível:
1. PDF/arquivo oficial disponibilizado pelo próprio órgão;
2. metadados e conteúdo factual essencial necessário para reproduzir a citação;
3. captura de tela contextual para prova de apresentação pública;
4. checksum SHA-256 de arquivos baixados;
5. versão e data do parser quando dados estruturados forem extraídos.

## Limites
Não reproduzir integralmente obras ou matérias protegidas sem necessidade. A preservação deve servir à auditabilidade, prova da fonte e reprodutibilidade da análise.

## Armazenamento
- evidências enviadas por cidadãos: Blob privado;
- cópias de trabalho de fontes para análise: armazenamento privado;
- catálogo e metadados: repositório público quando não contiverem dados sensíveis;
- hashes e manifestos: preferencialmente públicos quando não revelarem material protegido/sensível.

## Revisão
Fontes centrais do dossiê devem ser verificadas periodicamente. Uma URL indisponível não invalida automaticamente um fato previamente documentado, mas deve ser sinalizada e substituída por outra fonte primária quando possível.


## Certificação interna de snapshots
Para fontes decisivas, o Observatório preserva a resposta HTTP bruta em Blob privado e cria um manifesto contendo URL original e final, data/hora UTC da coleta, status HTTP, Content-Type, ETag/Last-Modified quando fornecidos, tamanho e SHA-256 do arquivo. O próprio manifesto recebe um SHA-256 de certificado.

O SHA-256 demonstra integridade do arquivo preservado: qualquer alteração posterior muda o hash. O histórico de commits do GitHub deve registrar periodicamente os hashes dos snapshots centrais, fornecendo uma trilha temporal independente do storage privado. Isso não substitui ata notarial, assinatura ICP-Brasil, carimbo do tempo qualificado ou perícia quando exigidos, mas melhora materialmente a cadeia de custódia e a reprodutibilidade da investigação.

### Procedimento para fonte crítica
1. coletar por HTTPS e registrar redirecionamentos;
2. preservar bytes originais, sem reformatar;
3. calcular SHA-256;
4. registrar cabeçalhos HTTP disponíveis;
5. guardar snapshot bruto em storage privado;
6. versionar hash e metadados não sensíveis no GitHub;
7. quando possível, manter uma segunda fonte primária independente ou arquivo oficial (PDF/CSV/ZIP);
8. para material que será efetivamente encaminhado a autoridade, considerar mecanismo externo adicional de carimbo do tempo/ata notarial conforme orientação jurídica.
