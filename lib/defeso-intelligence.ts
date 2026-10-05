import type { IntelligenceRecord, Priority } from '@/lib/intelligence';
import chunk01 from '@/data/defeso-transferencias-2026-01.json';
import chunk02 from '@/data/defeso-transferencias-2026-02.json';
import chunk03 from '@/data/defeso-transferencias-2026-03.json';
import chunk04 from '@/data/defeso-transferencias-2026-04.json';
import chunk05 from '@/data/defeso-transferencias-2026-05.json';
import chunk06 from '@/data/defeso-transferencias-2026-06.json';
import chunk07 from '@/data/defeso-transferencias-2026-07.json';

type DefesoPayment = {
  date: string;
  amount: number;
  bankOrder: string;
  effective: string;
};

type DefesoRow = {
  instrumentId: string;
  instrumentNumber: string;
  municipality: string;
  recipientCnpj: string;
  stateAgency: string;
  stateAgencyAcronym: string;
  celebrationDate: string;
  publicationDate: string;
  category: string;
  instrumentValue: number;
  defesoPaid: number;
  payments: DefesoPayment[];
  priority: string;
  object: string;
};

const rows = [
  ...chunk01, ...chunk02, ...chunk03, ...chunk04, ...chunk05, ...chunk06, ...chunk07,
] as DefesoRow[];

const collectedAt = '2026-10-05T23:25:00.000Z';
const datasetUrl = 'https://dados.ba.gov.br/dataset/convenios-e-parcerias';
const datasetDownloadUrl = 'https://dados.ba.gov.br/dataset/9079f8b9-f480-466f-8016-d03108f6420f/resource/abbd1ce3-2117-4732-9c9f-8860e11efb3a/download/conveniosparcerias.zip';

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function paymentNote(payments: DefesoPayment[]) {
  return payments
    .map((payment) => `${payment.date}: ${money(payment.amount)} — NOB ${payment.bankOrder} — efetivado: ${payment.effective}`)
    .join(' | ');
}

export const defesoFinancialRecords: IntelligenceRecord[] = rows.map((row) => ({
  schemaVersion: 1,
  recordId: `FIPLAN-DEFESO-${row.instrumentId}`,
  kind: 'financial_record',
  status: 'corroborating',
  title: `${row.municipality}: ${money(row.defesoPaid)} em pagamento(s) efetivado(s) de convênio durante o defeso`,
  summary: `A base oficial Convênios e Parcerias/FIPLAN registra pagamento(s) efetivado(s) de ${money(row.defesoPaid)} no período de 04/07 a 04/10/2026 para o Município de ${row.municipality}, no instrumento ${row.instrumentNumber}, celebrado em ${row.celebrationDate}. O registro exige verificação da exceção legal aplicável e não constitui, isoladamente, prova de irregularidade.`,
  content: row.object,
  municipality: row.municipality,
  state: 'BA',
  eventDate: row.payments.map((payment) => payment.date).sort()[0],
  collectedAt,
  sourceIds: ['dados-abertos-ba-convenios-parcerias', 'pge-ba-eleicoes-2026'],
  caseIds: ['OE-BA-0003'],
  tags: ['convênio', 'transferência', 'pagamento-efetivado', 'defeso-eleitoral', row.category, row.stateAgencyAcronym.toLowerCase()],
  evidenceLevel: 'L2',
  analyticalConfidence: 0.99,
  priority: row.priority as Priority,
  entities: [
    { name: `Município de ${row.municipality}`, type: 'municipality', identifier: row.recipientCnpj, role: 'recebedor do convênio' },
    { name: row.stateAgency, type: 'public_body', role: 'órgão estadual concedente' },
  ],
  relations: [
    {
      from: row.stateAgency,
      to: `Município de ${row.municipality}`,
      type: 'convenio_com_pagamento_no_defeso',
      description: `${row.instrumentNumber}; ${money(row.defesoPaid)} efetivado(s) entre 04/07 e 04/10/2026.`,
    },
  ],
  financial: {
    currency: 'BRL',
    paid: row.defesoPaid,
    contractValue: row.instrumentValue,
  },
  provenance: {
    sourceUrl: datasetUrl,
    sourceTitle: 'Convênios e Parcerias',
    publisher: 'SEFAZ Bahia / FIPLAN',
    sourceDate: '2026-10-05',
    retrievedAt: collectedAt,
    externalId: row.instrumentNumber,
    collector: 'fiplan-defeso-2026-v1',
    method: 'import',
  },
  notes: [
    `Celebração: ${row.celebrationDate}; publicação: ${row.publicationDate}.`,
    paymentNote(row.payments),
    'Pergunta de auditoria: qual exceção do art. 73, VI, a, fundamentou o repasse e quais documentos comprovam os requisitos da exceção?',
    'A existência de pagamento no período crítico é um gatilho de verificação documental; não equivale a conclusão de ilicitude.',
  ],
  raw: {
    instrumentId: row.instrumentId,
    instrumentNumber: row.instrumentNumber,
    recipientCnpj: row.recipientCnpj,
    stateAgencyAcronym: row.stateAgencyAcronym,
    celebrationDate: row.celebrationDate,
    publicationDate: row.publicationDate,
    category: row.category,
    payments: row.payments,
    datasetDownloadUrl,
  },
}));

const housingDefeso = rows.filter((row) =>
  row.category === 'habitação' &&
  row.stateAgencyAcronym === 'SEDUR' &&
  row.defesoPaid === 1170000 &&
  ['2026-07-06', '2026-07-07'].includes(row.payments[0]?.date),
);

export const defesoSummaryRecords: IntelligenceRecord[] = [
  {
    schemaVersion: 1,
    recordId: 'FIPLAN-DEFESO-SUMMARY-2026',
    kind: 'research_finding',
    status: 'corroborating',
    title: 'FIPLAN: 51 pagamentos efetivados em 50 convênios municipais durante o defeso',
    summary: 'Filtro estrito da base oficial Convênios e Parcerias/FIPLAN identificou 51 pagamentos efetivados, vinculados a 50 convênios com 44 municípios, entre 04/07 e 04/10/2026, somando R$ 28.772.441,69. Todos os 50 instrumentos encontrados são convênios ativos celebrados antes de 04/07. Cada repasse precisa ser testado contra as exceções legais; o conjunto não presume irregularidade.',
    state: 'BA',
    eventDate: '2026-07-04',
    collectedAt,
    sourceIds: ['dados-abertos-ba-convenios-parcerias', 'pge-ba-eleicoes-2026'],
    caseIds: ['OE-BA-0003'],
    tags: ['fiplan', 'convênios', 'transferências', 'defeso-eleitoral', 'auditoria-estadual'],
    evidenceLevel: 'L3',
    analyticalConfidence: 0.99,
    priority: 'urgent',
    financial: { currency: 'BRL', paid: 28772441.69 },
    provenance: {
      sourceUrl: datasetUrl,
      sourceTitle: 'Convênios e Parcerias',
      publisher: 'SEFAZ Bahia / FIPLAN',
      sourceDate: '2026-10-05',
      retrievedAt: collectedAt,
      collector: 'fiplan-defeso-2026-v1',
      method: 'derived_analysis',
    },
    notes: [
      'Critério: exercício 2026; tipo de despesa Transferências; recebedor nominal Município/Prefeitura Municipal; instrumento Convênio; Pagamento_Efetivado=Sim; data entre 04/07 e 04/10.',
      '44 municípios; 50 instrumentos; 51 pagamentos; R$ 28.772.441,69.',
      'Concentração por órgão: SEDUR R$ 23.935.757,78; SDR R$ 2.933.845,04; Casa Civil R$ 1.126.313,95; SETRE R$ 576.524,92; SEAGRI R$ 200.000,00.',
      'A análise deve procurar, para cada instrumento, prova de execução física anterior a 04/07 com cronograma prefixado ou documentação de emergência/calamidade, conforme o caso.',
    ],
    raw: {
      instrumentCount: 50,
      paymentCount: 51,
      municipalityCount: 44,
      windowStart: '2026-07-04',
      windowEnd: '2026-10-04',
      datasetDownloadUrl,
    },
  },
  {
    schemaVersion: 1,
    recordId: 'FIPLAN-DEFESO-HABITACAO-2026',
    kind: 'research_finding',
    status: 'corroborating',
    title: 'Habitação: R$ 9,36 milhões pagos a oito municípios em 06–07/07',
    summary: `Na linha de 50 unidades do Minha Casa Minha Vida Bahia, a base FIPLAN registra oito primeiras parcelas de R$ 1,17 milhão efetivadas após o início do defeso: seis em 06/07 e duas em 07/07, totalizando R$ 9,36 milhões. Municípios: ${housingDefeso.map((row) => row.municipality).sort().join(', ')}. O achado exige a documentação da exceção legal para cada convênio.`,
    state: 'BA',
    eventDate: '2026-07-06',
    collectedAt,
    sourceIds: ['dados-abertos-ba-convenios-parcerias', 'sedur-mcmv-2026-07-03', 'pge-ba-eleicoes-2026'],
    caseIds: ['OE-BA-0002', 'OE-BA-0003'],
    tags: ['habitação', 'mcmv-bahia', 'primeira-parcela', 'defeso-eleitoral', 'sedur'],
    evidenceLevel: 'L3',
    analyticalConfidence: 0.99,
    priority: 'urgent',
    entities: housingDefeso.map((row) => ({ name: `Município de ${row.municipality}`, type: 'municipality' as const, identifier: row.recipientCnpj, role: 'recebedor' })),
    financial: { currency: 'BRL', paid: housingDefeso.reduce((sum, row) => sum + row.defesoPaid, 0) },
    provenance: {
      sourceUrl: datasetUrl,
      sourceTitle: 'Convênios e Parcerias',
      publisher: 'SEFAZ Bahia / FIPLAN',
      sourceDate: '2026-10-05',
      retrievedAt: collectedAt,
      collector: 'fiplan-defeso-2026-v1',
      method: 'derived_analysis',
    },
    notes: [
      'Pagamentos de 06/07: Cipó, Esplanada, Iraquara, Itaberaba, Lajedinho e Lapão — R$ 1,17 milhão cada.',
      'Pagamentos de 07/07: Barra e Macajuba — R$ 1,17 milhão cada.',
      'A etapa seguinte é localizar licitação/contrato/ordem de serviço/medição e evidência física anterior a 04/07 para cada município.',
      'Lajedinho já possui achado separado: a licitação municipal da execução das 50 unidades foi publicada somente em setembro de 2026.',
    ],
    raw: {
      municipalities: housingDefeso.map((row) => row.municipality).sort(),
      datasetDownloadUrl,
    },
  },
];

export const defesoIntelligenceRecords: IntelligenceRecord[] = [
  ...defesoSummaryRecords,
  ...defesoFinancialRecords,
];
