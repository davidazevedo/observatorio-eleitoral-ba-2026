export type CaseStatus =
  | 'Fato público documentado'
  | 'Prioridade de auditoria'
  | 'Referência normativa'
  | 'Contexto processual';

export type CaseCategory =
  | 'Transferências e convênios'
  | 'Defeso eleitoral'
  | 'Contexto eleitoral';

export type PublicCase = {
  id: string;
  slug: string;
  title: string;
  date: string;
  dateLabel: string;
  scope: string;
  municipality: string;
  municipalityCount?: number;
  category: CaseCategory;
  status: CaseStatus;
  evidenceLevel: 'L2' | 'L3' | 'L4';
  summary: string;
  auditQuestion: string;
  sourceIds: string[];
  tags: string[];
};

export const publicCases: PublicCase[] = [
  {
    id: 'OE-BA-0001',
    slug: 'pacote-estadual-11-junho-2026',
    title: 'Pacote estadual anunciado em 11 de junho de 2026',
    date: '2026-06-11',
    dateLabel: '11 JUN 2026',
    scope: 'Estadual',
    municipality: 'Bahia — escopo estadual',
    municipalityCount: 200,
    category: 'Transferências e convênios',
    status: 'Fato público documentado',
    evidenceLevel: 'L2',
    summary:
      'O Governo da Bahia anunciou mais de R$ 1,7 bilhão em ações para 200 cidades, incluindo convênios, ordens de serviço, licitações e acordos consorciais.',
    auditQuestion:
      'Quais atos anunciados se converteram em transferência efetiva, contrato, pagamento e execução física, e em que datas isso ocorreu?',
    sourceIds: ['govba-1700'],
    tags: ['R$ 1,7 bi', '200 cidades', 'convênios', 'ordens de serviço'],
  },
  {
    id: 'OE-BA-0002',
    slug: 'pacote-estadual-03-julho-2026',
    title: 'Pacote estadual anunciado em 3 de julho de 2026',
    date: '2026-07-03',
    dateLabel: '03 JUL 2026',
    scope: 'Estadual',
    municipality: 'Bahia — escopo estadual',
    municipalityCount: 160,
    category: 'Transferências e convênios',
    status: 'Prioridade de auditoria',
    evidenceLevel: 'L3',
    summary:
      'O Governo da Bahia anunciou aproximadamente R$ 6 bilhões, mais de cem atos e benefício direto a mais de 160 municípios, na véspera do início do período de vedação.',
    auditQuestion:
      'Para cada operação vinculada ao anúncio, quando ocorreu a transferência ou o desbloqueio efetivo e qual documentação sustenta eventual exceção legal durante o defeso?',
    sourceIds: ['govba-6000', 'pge-defeso', 'transferegov-21'],
    tags: ['≈ R$ 6 bi', '160+ municípios', '03/07', 'defeso eleitoral'],
  },
  {
    id: 'OE-BA-0003',
    slug: 'defeso-eleitoral-transferencias-2026',
    title: 'Período de vedação às transferências voluntárias',
    date: '2026-07-04',
    dateLabel: '04 JUL 2026',
    scope: 'Estadual',
    municipality: 'Bahia — escopo estadual',
    category: 'Defeso eleitoral',
    status: 'Referência normativa',
    evidenceLevel: 'L3',
    summary:
      'A orientação da PGE-BA e fontes federais registram restrições aplicáveis às transferências voluntárias no recorte eleitoral, com hipóteses legais específicas de exceção. O marco não é apresentado como universal para toda conduta eleitoral.',
    auditQuestion:
      'Quais pagamentos ocorridos no período foram classificados como exceção e onde estão a obrigação formal preexistente, o cronograma e a prova de execução física exigidos para cada caso?',
    sourceIds: ['pge-defeso', 'tse-defeso', 'transferegov-21'],
    tags: ['04/07', 'art. 73', 'transferências voluntárias', 'exceções'],
  },
  {
    id: 'OE-BA-0004',
    slug: 'resultado-primeiro-turno-bahia-2026',
    title: 'Resultado do primeiro turno para o Governo da Bahia',
    date: '2026-10-04',
    dateLabel: '04 OUT 2026',
    scope: 'Estadual',
    municipality: 'Bahia — escopo estadual',
    category: 'Contexto eleitoral',
    status: 'Contexto processual',
    evidenceLevel: 'L2',
    summary:
      'O resultado do primeiro turno compõe apenas o contexto temporal e processual do dossiê. Ele não é utilizado como evidência de irregularidade.',
    auditQuestion:
      'Quais fatos eventualmente corroborados possuem relevância jurídica e temporal para representação, preservação de prova ou diligência antes da diplomação?',
    sourceIds: ['tse-resultado-ba', 'tse-calendario'],
    tags: ['1º turno', 'resultado eleitoral', 'diplomação', 'prazo'],
  },
];
