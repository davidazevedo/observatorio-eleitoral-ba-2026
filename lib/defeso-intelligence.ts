import type { IntelligenceRecord, Priority } from '@/lib/intelligence';
import p01 from '@/data/defeso/part-01.json';
import p02 from '@/data/defeso/part-02.json';
import p03 from '@/data/defeso/part-03.json';
import p04 from '@/data/defeso/part-04.json';
import p05 from '@/data/defeso/part-05.json';
import p06 from '@/data/defeso/part-06.json';
import p07 from '@/data/defeso/part-07.json';
import p08 from '@/data/defeso/part-08.json';
import p09 from '@/data/defeso/part-09.json';
import p10 from '@/data/defeso/part-10.json';
import p11 from '@/data/defeso/part-11.json';
import p12 from '@/data/defeso/part-12.json';
import p13 from '@/data/defeso/part-13.json';
import p14 from '@/data/defeso/part-14.json';
import p15 from '@/data/defeso/part-15.json';
import p16 from '@/data/defeso/part-16.json';
import p17 from '@/data/defeso/part-17.json';
import p18 from '@/data/defeso/part-18.json';
import p19 from '@/data/defeso/part-19.json';
import p20 from '@/data/defeso/part-20.json';
import p21 from '@/data/defeso/part-21.json';
import p22 from '@/data/defeso/part-22.json';
import p23 from '@/data/defeso/part-23.json';
import p24 from '@/data/defeso/part-24.json';
import p25 from '@/data/defeso/part-25.json';

type RawPayment = [date: string, amount: number, bankOrder: string];
type RawRow = {
  i: string; n: string; m: string; c: string; a: string; cd: string; pd: string;
  k: string; v: number; d: number; p: RawPayment[]; pr: string; o: string;
};

const rawRows = [...p01, ...p02, ...p03, ...p04, ...p05, ...p06, ...p07, ...p08, ...p09, ...p10, ...p11, ...p12, ...p13, ...p14, ...p15, ...p16, ...p17, ...p18, ...p19, ...p20, ...p21, ...p22, ...p23, ...p24, ...p25] as RawRow[];
const collectedAt = '2026-10-05T23:25:00.000Z';
const datasetUrl = 'https://dados.ba.gov.br/dataset/convenios-e-parcerias';
const datasetDownloadUrl = 'https://dados.ba.gov.br/dataset/9079f8b9-f480-466f-8016-d03108f6420f/resource/abbd1ce3-2117-4732-9c9f-8860e11efb3a/download/conveniosparcerias.zip';

const agencyNames: Record<string,string> = {
  SEDUR: 'Secretaria de Desenvolvimento Urbano',
  SDR: 'Secretaria de Desenvolvimento Rural',
  SETRE: 'Secretaria do Trabalho, Emprego, Renda e Esporte',
  SEAGRI: 'Secretaria da Agricultura, Pecuária, Irrigação, Pesca e Aquicultura',
  'CASA CIVIL': 'Casa Civil',
};

function agencyName(acronym: string) {
  return agencyNames[acronym] || acronym;
}

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function paymentNote(payments: RawPayment[]) {
  return payments.map(([date, amount, bankOrder]) => `${date}: ${money(amount)} — NOB ${bankOrder} — pagamento efetivado`).join(' | ');
}

export const defesoFinancialRecords: IntelligenceRecord[] = rawRows.map((row) => {
  const agency = agencyName(row.a);
  const eventDate = row.p.map(([date]) => date).sort()[0];
  return {
    schemaVersion: 1,
    recordId: `FIPLAN-DEFESO-${row.i}`,
    kind: 'financial_record',
    status: 'corroborating',
    title: `${row.m}: ${money(row.d)} em pagamento(s) efetivado(s) de convênio durante o defeso`,
    summary: `A base oficial Convênios e Parcerias/FIPLAN registra pagamento(s) efetivado(s) de ${money(row.d)} entre 04/07 e 04/10/2026 para o Município de ${row.m}, no instrumento ${row.n}, celebrado em ${row.cd}. O registro exige verificação da exceção legal aplicável e não constitui, isoladamente, prova de irregularidade.`,
    content: row.o,
    municipality: row.m,
    state: 'BA',
    eventDate,
    collectedAt,
    sourceIds: ['dados-abertos-ba-convenios-parcerias', 'pge-ba-eleicoes-2026'],
    caseIds: ['OE-BA-0003'],
    tags: ['convênio', 'transferência', 'pagamento-efetivado', 'defeso-eleitoral', row.k, row.a.toLowerCase()],
    evidenceLevel: 'L2',
    analyticalConfidence: 0.99,
    priority: row.pr as Priority,
    entities: [
      { name: `Município de ${row.m}`, type: 'municipality', identifier: row.c, role: 'recebedor do convênio' },
      { name: agency, type: 'public_body', role: 'órgão estadual concedente' },
    ],
    relations: [{ from: agency, to: `Município de ${row.m}`, type: 'convenio_com_pagamento_no_defeso', description: `${row.n}; ${money(row.d)} efetivado(s) no período crítico.` }],
    financial: { currency: 'BRL', paid: row.d, contractValue: row.v },
    provenance: {
      sourceUrl: datasetUrl,
      sourceTitle: 'Convênios e Parcerias',
      publisher: 'SEFAZ Bahia / FIPLAN',
      sourceDate: '2026-10-05',
      retrievedAt: collectedAt,
      externalId: row.n,
      collector: 'fiplan-defeso-2026-v1',
      method: 'import',
    },
    notes: [
      `Celebração: ${row.cd}; publicação: ${row.pd}.`,
      paymentNote(row.p),
      'Pergunta de auditoria: qual exceção do art. 73, VI, a, fundamentou o repasse e quais documentos comprovam os requisitos da exceção?',
      'A existência de pagamento no período crítico é um gatilho de verificação documental; não equivale a conclusão de ilicitude.',
    ],
    raw: { instrumentId: row.i, instrumentNumber: row.n, recipientCnpj: row.c, agencyAcronym: row.a, category: row.k, payments: row.p, datasetDownloadUrl },
  };
});

const housingDefeso = rawRows.filter((row) =>
  row.k === 'habitação' && row.a === 'SEDUR' && row.d === 1170000 &&
  ['2026-07-06', '2026-07-07'].includes(row.p[0]?.[0]),
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
    provenance: { sourceUrl: datasetUrl, sourceTitle: 'Convênios e Parcerias', publisher: 'SEFAZ Bahia / FIPLAN', sourceDate: '2026-10-05', retrievedAt: collectedAt, collector: 'fiplan-defeso-2026-v1', method: 'derived_analysis' },
    notes: [
      'Critério: exercício 2026; tipo de despesa Transferências; recebedor nominal Município/Prefeitura Municipal; instrumento Convênio; Pagamento_Efetivado=Sim; data entre 04/07 e 04/10.',
      '44 municípios; 50 instrumentos; 51 pagamentos; R$ 28.772.441,69.',
      'Concentração por órgão: SEDUR R$ 23.935.757,78; SDR R$ 2.933.845,04; Casa Civil R$ 1.126.313,95; SETRE R$ 576.524,92; SEAGRI R$ 200.000,00.',
      'Para cada instrumento, procurar prova de execução física anterior a 04/07 com cronograma prefixado ou documentação de emergência/calamidade, conforme o caso.',
    ],
    raw: { instrumentCount: 50, paymentCount: 51, municipalityCount: 44, windowStart: '2026-07-04', windowEnd: '2026-10-04', datasetDownloadUrl },
  },
  {
    schemaVersion: 1,
    recordId: 'FIPLAN-DEFESO-HABITACAO-2026',
    kind: 'research_finding',
    status: 'corroborating',
    title: 'Habitação: R$ 9,36 milhões pagos a oito municípios em 06–07/07',
    summary: `Na linha de 50 unidades do Minha Casa Minha Vida Bahia, a base FIPLAN registra oito primeiras parcelas de R$ 1,17 milhão efetivadas após o início do defeso: seis em 06/07 e duas em 07/07, totalizando R$ 9,36 milhões. Municípios: ${housingDefeso.map((row) => row.m).sort().join(', ')}. O achado exige a documentação da exceção legal para cada convênio.`,
    state: 'BA',
    eventDate: '2026-07-06',
    collectedAt,
    sourceIds: ['dados-abertos-ba-convenios-parcerias', 'sedur-mcmv-2026-07-03', 'pge-ba-eleicoes-2026'],
    caseIds: ['OE-BA-0002', 'OE-BA-0003'],
    tags: ['habitação', 'mcmv-bahia', 'primeira-parcela', 'defeso-eleitoral', 'sedur'],
    evidenceLevel: 'L3',
    analyticalConfidence: 0.99,
    priority: 'urgent',
    entities: housingDefeso.map((row) => ({ name: `Município de ${row.m}`, type: 'municipality' as const, identifier: row.c, role: 'recebedor' })),
    financial: { currency: 'BRL', paid: housingDefeso.reduce((sum, row) => sum + row.d, 0) },
    provenance: { sourceUrl: datasetUrl, sourceTitle: 'Convênios e Parcerias', publisher: 'SEFAZ Bahia / FIPLAN', sourceDate: '2026-10-05', retrievedAt: collectedAt, collector: 'fiplan-defeso-2026-v1', method: 'derived_analysis' },
    notes: [
      '06/07: Cipó, Esplanada, Iraquara, Itaberaba, Lajedinho e Lapão — R$ 1,17 milhão cada.',
      '07/07: Barra e Macajuba — R$ 1,17 milhão cada.',
      'Próxima verificação: licitação, contrato, ordem de serviço, medição e evidência física anterior a 04/07 para cada município.',
      'Lajedinho já possui achado separado: a licitação municipal das 50 unidades foi publicada somente em setembro de 2026.',
    ],
    raw: { municipalities: housingDefeso.map((row) => row.m).sort(), datasetDownloadUrl },
  },
];

export const defesoIntelligenceRecords: IntelligenceRecord[] = [...defesoSummaryRecords, ...defesoFinancialRecords];
