# FM-03 — Coleta complementar PNCP: itens e histórico

**Registro:** 08/10/2026. **Estado:** alvos oficiais cadastrados; captura ainda não verificada.

## Propósito
Depois de preservar os JSON integrais de detalhe dos dois processos (Lajedo 04/2026 e Araçás 007/2026), ampliar a evidência documental para **itens** e **histórico** da contratação nos endpoints públicos oficialmente documentados pelo PNCP.

O PNCP documenta operações `GET /v1/orgaos/{cnpj}/compras/{ano}/{sequencial}/itens` e `GET /v1/orgaos/{cnpj}/compras/{ano}/{sequencial}/historico`. URLs de produção utilizam `https://pncp.gov.br/api/pncp` como base.

- **PREBA-01 / Lajedo do Tabocal / itens:** https://pncp.gov.br/api/pncp/v1/orgaos/16434441000131/compras/2026/26/itens
- **PREBA-01 / Lajedo do Tabocal / historico:** https://pncp.gov.br/api/pncp/v1/orgaos/16434441000131/compras/2026/26/historico
- **PREBA-03 / Araçás / itens:** https://pncp.gov.br/api/pncp/v1/orgaos/16131088000110/compras/2026/7/itens
- **PREBA-03 / Araçás / historico:** https://pncp.gov.br/api/pncp/v1/orgaos/16131088000110/compras/2026/7/historico

## Regras de processamento
1. O GitHub Actions `source-preservation.yml` deverá realizar GET, gravar manifesto de transporte, calcular SHA-256 dos bytes e guardar cópia integral quando a resposta for válida e dentro do limite.
2. A partir do campo `numeroItem` retornado na **consulta real dos itens**, gerar novos alvos específicos de resultados e preservá-los. Não assumir número de item.
3. Analisar histórico, objetos e resultados com origem, data e identificadores. Somente registrar empresa adjudicada quando expressamente descrita no original e acompanhada de seu CNPJ.
4. **Não** inferir que empresa contratada recebeu o pagamento; isso exige empenho/liquidação/ordem municipal.
5. Atualizar os arquivos individuais, status de captura e API após observar execução efetiva. Falhas HTTP 429 serão registradas como indisponibilidade.
6. Não aumentar a contagem das 57 CE por cópias da mesma licitação.

## Proveniência
Documentação primária PNCP: https://pncp.gov.br/manual/pt-br/latest/singlehtml/

## Critério desta entrega
Quatro destinos de coleta reproduzíveis, integrados ao workflow e API, com status **pendente** até retorno confirmado. Build/testes devem impedir publicação com nome de fornecedor inventado.
