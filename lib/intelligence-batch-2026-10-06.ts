import type { IntelligenceRecord, EvidenceLevel, Priority } from '@/lib/intelligence';

const collectedAt='2026-10-06T18:05:00.000Z';

type HousingRow={
  recordId:string; municipality:string; paymentDate:string; instrumentNumber:string; bankOrder:string;
  procurementDate:string|null; procurementStatus:string; procurementControl:string|null; procurementValue:number|null;
  evidenceLevel:EvidenceLevel; priority:Priority; sourceUrl:string; sourceTitle:string; publisher:string; sourceDate?:string;
  summary:string; notes:string[]; recipientCnpj:string; supplier?:string|null; supplierCnpj?:string|null;
  electoralCrossmatch?:string; electoralCrossmatchNote?:string;
};

const rows:HousingRow[]=[
  {
    recordId:'BOOT-BARRA-HAB-GAP-2026',municipality:'Barra',paymentDate:'2026-07-07',instrumentNumber:'26601.0001.26.0000006-3',bankOrder:'26601.0001.26.0000039-1',
    procurementDate:null,procurementStatus:'Não localizada nas fontes consultadas',procurementControl:null,procurementValue:null,evidenceLevel:'L2',priority:'high',
    sourceUrl:'https://pncp.gov.br/',sourceTitle:'Consulta PNCP por CNPJ 13.880.703/0001-01 e modalidade Concorrência',publisher:'Portal Nacional de Contratações Públicas',sourceDate:'2026-10-06',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 07/07/2026. A consulta oficial ao PNCP retornou oito concorrências até 06/10 sem o objeto das 50 unidades estaduais; o portal municipal também retornou “Nada encontrado” para buscas dirigidas. Isso documenta uma lacuna de pesquisa, não prova inexistência de contratação nem irregularidade.',
    notes:['Snapshot PNCP preservado no Blob privado: SHA-256 e44219a55fe91a0d258e3f8cde55842dfbcde1d5950f58e2717eb84275f59590.','Prosseguir em DOE, contratos, ordens de serviço e sistemas de origem.'],recipientCnpj:'13.880.703/0001-01'
  },
  {
    recordId:'BOOT-CIPO-HAB-2026',municipality:'Cipó',paymentDate:'2026-07-06',instrumentNumber:'26601.0001.26.0000002-0',bankOrder:'26601.0001.26.0000032-4',
    procurementDate:'2026-08-24',procurementStatus:'Em andamento; sem resultado no PNCP em 01/10',procurementControl:'13808936000195-1-000063/2026',procurementValue:5877340.25,evidenceLevel:'L3',priority:'urgent',
    sourceUrl:'https://pncp.gov.br/app/editais/13808936000195/2026/63',sourceTitle:'PNCP — contratação 009/2026 — 50 unidades habitacionais',publisher:'Portal Nacional de Contratações Públicas',sourceDate:'2026-08-24',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026. O PNCP registra em 24/08 a contratação 009 para exatamente 50 unidades do Minha Casa Minha Vida Bahia, Convênio 009/2026, estimada em R$ 5.877.340,25. Na consulta de 06/10, o item constava Em andamento, sem resultado. A sequência exige documentação da exceção legal e não prova irregularidade.',
    notes:['PNCP: item atualizado em 01/10/2026; situação Em andamento; temResultado=false.','Verificar eventual contratação/execução anterior distinta, ordem de serviço, medições e fundamento da exceção.'],recipientCnpj:'13.808.936/0001-95'
  },
  {
    recordId:'BOOT-ESPLANADA-HAB-GAP-2026',municipality:'Esplanada',paymentDate:'2026-07-06',instrumentNumber:'26601.0001.26.0000009-8',bankOrder:'26601.0001.26.0000034-0',
    procurementDate:null,procurementStatus:'Não localizada nas fontes consultadas',procurementControl:null,procurementValue:null,evidenceLevel:'L2',priority:'high',
    sourceUrl:'https://pncp.gov.br/',sourceTitle:'Consulta PNCP por CNPJ 13.885.231/0001-71 e modalidade Concorrência',publisher:'Portal Nacional de Contratações Públicas',sourceDate:'2026-10-06',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026. O PNCP retornou quatorze concorrências até 06/10 sem objeto correspondente às 50 unidades estaduais; a API oficial municipal também retornou zero registros para “50 unidades”. É uma lacuna de pesquisa, não evidência de ausência ou irregularidade.',
    notes:['Snapshot PNCP preservado: SHA-256 19aea6a466ec171c24e257bb1072ad1f4e84a72f0c5563d46a12a572ee65121f.','Outro projeto MCMV/PTS foi excluído por não demonstrar vínculo com este convênio estadual.'],recipientCnpj:'13.885.231/0001-71'
  },
  {
    recordId:'BOOT-IRAQUARA-HAB-GAP-2026',municipality:'Iraquara',paymentDate:'2026-07-06',instrumentNumber:'26601.0001.26.0000018-7',bankOrder:'26601.0001.26.0000033-2',
    procurementDate:null,procurementStatus:'Não localizada; projeto federal distinto excluído',procurementControl:null,procurementValue:null,evidenceLevel:'L2',priority:'high',
    sourceUrl:'https://pncp.gov.br/',sourceTitle:'Consulta PNCP por CNPJ 13.922.596/0001-29 e modalidade Concorrência',publisher:'Portal Nacional de Contratações Públicas',sourceDate:'2026-10-06',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026. O PNCP retornou cinco concorrências; a única habitacional é um projeto federal distinto, de 20 unidades MCMV FNHIS Sub 50, publicado em janeiro. Não foi localizada contratação inequívoca das 50 unidades estaduais. A lacuna não prova irregularidade.',
    notes:['Snapshot PNCP preservado: SHA-256 734abb4dc9cb1a67fddb791763102bb85f591b4e824083ecc517dbac6e21c9ad.','Projeto federal de 20 unidades, controle 13922596000129-1-000001/2026, explicitamente excluído do cruzamento estadual.'],recipientCnpj:'13.922.596/0001-29'
  },
  {
    recordId:'BOOT-ITABERABA-HAB-2026',municipality:'Itaberaba',paymentDate:'2026-07-06',instrumentNumber:'26601.0001.26.0000019-5',bankOrder:'26601.0001.26.0000028-6',
    procurementDate:'2026-08-26',procurementStatus:'Em andamento; sem resultado nas duas entradas PNCP',procurementControl:'13719646000175-1-000160/2026 · 13719646000175-1-000161/2026',procurementValue:5850000,evidenceLevel:'L3',priority:'urgent',
    sourceUrl:'https://pncp.gov.br/app/editais/13719646000175/2026/160',sourceTitle:'PNCP — FMAS 010/2026 — 50 unidades habitacionais',publisher:'Portal Nacional de Contratações Públicas',sourceDate:'2026-08-26',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026. O PNCP registra em 26/08 duas entradas da Concorrência 010/FMAS para exatamente 50 unidades habitacionais, estimadas em R$ 5,85 milhões. Ambas apareciam Em andamento e sem resultado na consulta realizada. Isso exige diligência sobre a exceção legal, sem presumir irregularidade.',
    notes:['PNCP: controles 13719646000175-1-000160/2026 e -000161/2026; ambos com temResultado=false.'],recipientCnpj:'13.719.646/0001-75'
  },
  {
    recordId:'BOOT-LAJEDINHO-007-2026',municipality:'Lajedinho',paymentDate:'2026-07-06',instrumentNumber:'26601.0001.26.0000007-1',bankOrder:'26601.0001.26.0000027-8',
    procurementDate:'2026-09-22',procurementStatus:'Licitação localizada posteriormente; diligência pendente',procurementControl:'13810544000160-1-000098/2026',procurementValue:5877340.25,evidenceLevel:'L3',priority:'urgent',
    sourceUrl:'https://transparencia.lajedinho.ba.gov.br/licitacoes',sourceTitle:'Portal da Transparência — Licitações 2026',publisher:'Prefeitura Municipal de Lajedinho',sourceDate:'2026-09-22',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026. O portal municipal registra posteriormente a Concorrência 008/2026 para executar as mesmas 50 unidades do Convênio 007/2026. A sequência exige comprovação documental da exceção legal e não prova, isoladamente, irregularidade.',
    notes:['Verificar contratação ou execução anterior distinta, ordem de serviço, medição, cronograma e fundamento formal da exceção.'],recipientCnpj:'13.810.544/0001-60'
  },
  {
    recordId:'BOOT-LAPAO-HAB-2026',municipality:'Lapão',paymentDate:'2026-07-06',instrumentNumber:'26601.0001.26.0000004-7',bankOrder:'26601.0001.26.0000038-3',
    procurementDate:'2026-07-31',procurementStatus:'Homologada em 24/09/2026',procurementControl:'15448570000116-1-000001/2026',procurementValue:5822160.50,evidenceLevel:'L3',priority:'urgent',
    sourceUrl:'https://www.escavador.com/diarios/9247755/DOEBA/P/2026-07-31?page=130',sourceTitle:'Aviso de Licitação — Concorrência Eletrônica nº 010/2026',publisher:'Diário Oficial do Estado da Bahia / Prefeitura Municipal de Lapão',sourceDate:'2026-07-31',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026. A Concorrência 010/2026 para as 50 unidades do Convênio 002/2026 foi publicada em 31/07 e homologada em favor da Nunes Engenharia Ltda. por R$ 5.822.160,50. O CNPJ exato da empresa não apareceu nos seis arquivos Bahia do TSE 2026 consultados; isso não exclui outros vínculos fora desse escopo.',
    notes:['Homologação publicada em 24/09 para Nunes Engenharia Ltda., CNPJ 07.492.799/0001-20.','CNPJ pesquisado nos arquivos BA de despesas contratadas/pagas e documentos fiscais de candidatos e órgãos partidários: zero correspondências no snapshot de 06/10.'],recipientCnpj:'13.891.528/0001-40',supplier:'Nunes Engenharia Ltda',supplierCnpj:'07.492.799/0001-20',electoralCrossmatch:'no_exact_match',electoralCrossmatchNote:'CNPJ exato sem correspondência nos 6 arquivos BA do TSE 2026 preservados/referenciados em 06/10.'
  },
  {
    recordId:'BOOT-MACAJUBA-HAB-2026',municipality:'Macajuba',paymentDate:'2026-07-07',instrumentNumber:'26601.0001.26.0000016-0',bankOrder:'26601.0001.26.0000041-3',
    procurementDate:'2026-07-28',procurementStatus:'Em andamento em 06/10; sem vencedor exibido',procurementControl:'13810841000106-1-000019/2026',procurementValue:5849648.93,evidenceLevel:'L3',priority:'urgent',
    sourceUrl:'https://macajuba.ba.gov.br/licitacoes-exibir/?id=90172',sourceTitle:'Concorrência Eletrônica nº 004/2026 — Processo 254/2026',publisher:'Prefeitura Municipal de Macajuba',sourceDate:'2026-07-28',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 07/07/2026. O portal oficial de Macajuba e o Diário Municipal confirmam a Concorrência 004/2026, Processo 254/2026, publicada em 28/07 para exatamente 50 unidades do Convênio 014/2026, estimada em R$ 5.849.648,93. Em 06/10 o lote ainda aparecia Em andamento e sem vencedor.',
    notes:['Diário Oficial de Macajuba, edição 3.667, página 4, preservado em Blob privado: SHA-256 5e85249bc8ddbe41050fed0fb9ef424e9093daf31fe37897489fd8cde851617d.','Página oficial de detalhe preservada: SHA-256 3e47e4a4e56d0651a1b9d72bdde44d31fa8e517eca14f08a909639fcb16002d9.'],recipientCnpj:'13.810.841/0001-06'
  }
];

export const supersededHousingRecordIds=new Set([
  'BOOT-GAP-BARRA-HAB-2026','BOOT-GAP-ESPLANADA-HAB-2026','BOOT-GAP-IRAQUARA-HAB-2026','BOOT-GAP-MACAJUBA-HAB-2026'
]);

export const housingBatchRecords:IntelligenceRecord[]=rows.map((row)=>({
  schemaVersion:1,recordId:row.recordId,kind:'research_finding',
  status:row.procurementDate?'corroborating':'triage',
  title:row.procurementDate
    ? `${row.municipality}: R$ 1,17 milhão pago em ${row.paymentDate.slice(8,10)}/07; contratação posterior localizada`
    : `${row.municipality}: R$ 1,17 milhão pago em ${row.paymentDate.slice(8,10)}/07; contratação correspondente ainda não localizada`,
  summary:row.summary,municipality:row.municipality,state:'BA',eventDate:row.paymentDate,collectedAt,
  sourceIds:['dados-abertos-ba-convenios-parcerias','pge-ba-eleicoes-2026'],caseIds:['OE-BA-0002','OE-BA-0003'],
  tags:['habitacao','defeso-eleitoral','pagamento-efetivado',row.procurementDate?'contratacao-posterior':'lacuna-contratacao'],
  evidenceLevel:row.evidenceLevel,analyticalConfidence:row.procurementDate?0.995:0.97,priority:row.priority,
  entities:[
    {name:`Município de ${row.municipality}`,type:'municipality',identifier:`CNPJ ${row.recipientCnpj}`,role:'convenente/contratante'},
    ...(row.supplier?[{name:row.supplier,type:'supplier' as const,identifier:row.supplierCnpj?`CNPJ ${row.supplierCnpj}`:undefined,role:'fornecedor homologado'}]:[])
  ],
  financial:{currency:'BRL',paid:1170000,contractValue:row.procurementValue||undefined},
  provenance:{sourceUrl:row.sourceUrl,sourceTitle:row.sourceTitle,publisher:row.publisher,sourceDate:row.sourceDate,retrievedAt:collectedAt,externalId:row.procurementControl||row.instrumentNumber,collector:'housing-defeso-batch-2026-10-06',method:'derived_analysis'},
  notes:[`FIPLAN: instrumento ${row.instrumentNumber}; NOB ${row.bankOrder}; R$ 1.170.000,00 efetivados em ${row.paymentDate}.`,...row.notes,'A sequência temporal é prioridade de diligência e não constitui, isoladamente, prova de ilegalidade.'],
  raw:{procurementDate:row.procurementDate,procurementStatus:row.procurementStatus,procurementControl:row.procurementControl,procurementValue:row.procurementValue,supplier:row.supplier||null,supplierCnpj:row.supplierCnpj||null,electoralCrossmatch:row.electoralCrossmatch||'not_run',electoralCrossmatchNote:row.electoralCrossmatchNote||'Fornecedor ainda não consolidado para cruzamento eleitoral.'}
}));

export const tseBatchRecords:IntelligenceRecord[]=[{
  schemaVersion:1,recordId:'BOOT-TSE-NUNES-NO-EXACT-MATCH-2026',kind:'electoral_account',status:'verified',
  title:'Nunes Engenharia: nenhum match exato de CNPJ nos arquivos Bahia do TSE 2026 consultados',
  summary:'O CNPJ 07.492.799/0001-20 foi pesquisado por correspondência exata em seis arquivos oficiais da Bahia do TSE 2026: despesas contratadas, pagas e documentos fiscais de candidatos e de órgãos partidários. O snapshot de 06/10 retornou zero correspondências. O resultado é limitado ao escopo e à versão dos arquivos consultados e não exclui outros vínculos.',
  state:'BA',eventDate:'2026-10-06',collectedAt,caseIds:['OE-BA-0003'],tags:['tse-2026','cruzamento-cnpj','resultado-negativo','fornecedor','lapao'],
  evidenceLevel:'L2',analyticalConfidence:1,priority:'low',financial:{currency:'BRL'},
  entities:[{name:'Nunes Engenharia Ltda',type:'supplier',identifier:'CNPJ 07.492.799/0001-20',role:'fornecedor público pesquisado no TSE 2026'}],
  provenance:{sourceUrl:'https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2026',sourceTitle:'Prestação de Contas Eleitorais 2026',publisher:'Tribunal Superior Eleitoral',sourceDate:'2026-10-06',retrievedAt:collectedAt,externalId:'exact-cnpj-07492799000120-ba-2026',collector:'tse-crossmatch-2026-10-06',method:'derived_analysis'},
  notes:['Arquivos e hashes registrados em preservation/manifests/tse-ba-2026-2026-10-06.json.','Resultado: 0 correspondências exatas. Não interpretar como inexistência de relação política fora do escopo consultado.'],
  raw:{queryType:'exact_cnpj',query:'07492799000120',matchCount:0,scope:'BA',snapshotDate:'2026-10-06',manifest:'preservation/manifests/tse-ba-2026-2026-10-06.json'}
}];

export const exceptionBatchRecords:IntelligenceRecord[]=[
  {
    schemaVersion:1,recordId:'BOOT-CIPO-EMERGENCY-2026',kind:'municipal_fact',status:'verified',
    title:'Cipó: situação de emergência por chuvas vigente na data do pagamento habitacional',
    summary:'O Decreto Municipal 065/2026, de 01/03/2026, declarou situação de emergência por chuvas intensas por 180 dias. A vigência alcançava 06/07/2026. O achado abre uma hipótese de exceção eleitoral, mas não demonstra que o Convênio 009/2026 das 50 moradias foi celebrado ou pago para atendimento dessa emergência.',
    municipality:'Cipó',state:'BA',eventDate:'2026-03-01',collectedAt,caseIds:['OE-BA-0003'],tags:['emergencia','chuvas','decreto-065-2026','teste-excecao','habitacao'],
    evidenceLevel:'L3',analyticalConfidence:1,priority:'urgent',financial:{currency:'BRL'},
    entities:[{name:'Município de Cipó',type:'municipality',identifier:'CNPJ 13.808.936/0001-95',role:'ente em situação de emergência'}],
    provenance:{sourceUrl:'https://cipo.ba.gov.br/wp-includes/ExternalApps/downloader.php?hurl=aHR0cDovL2RvZW0ub3JnLmJyL2JhL2NpcG8vYXJxdWl2b3MvZG93bmxvYWQvZDcxODBjMWYzNTkxMmY2ZmI2MDM1MjU5ODQ2MGZhOGEvZjVjODNmZTNkNDNhYWNmN2Y5NzIxOWVhZGVlYTA2YjgucGRm',sourceTitle:'Decreto Municipal nº 065/2026',publisher:'Prefeitura Municipal de Cipó',sourceDate:'2026-03-01',retrievedAt:collectedAt,externalId:'DECRETO-065-2026-CIPO',collector:'housing-exception-test-2026-10-06',method:'web_research'},
    notes:['O decreto autoriza medidas de resposta, recuperação e reconstrução e contratações emergenciais destinadas ao atendimento da situação excepcional.','Não foi localizado, até o corte, documento que vincule especificamente o Convênio 009/2026/50 moradias ao Decreto 065/2026.','Outras contratações municipais localizadas para assistência às famílias afetadas pelas chuvas mencionam expressamente o Decreto 065/2026, contraste que reforça a necessidade de verificar o processo específico do convênio habitacional.']
  },
  {
    schemaVersion:1,recordId:'BOOT-BARRA-EMERGENCY-2026',kind:'municipal_fact',status:'verified',
    title:'Barra: situação de emergência por chuvas vigente na data do pagamento habitacional',
    summary:'O Decreto Estadual 24.408/2026 homologou o Decreto Municipal 075/2026, de 25/02/2026, que declarou situação de emergência em Barra por chuvas intensas por 180 dias. A vigência alcançava 07/07/2026. O achado abre uma hipótese de exceção eleitoral, mas não demonstra vínculo do repasse das 50 moradias com a resposta à emergência.',
    municipality:'Barra',state:'BA',eventDate:'2026-02-25',collectedAt,caseIds:['OE-BA-0003'],tags:['emergencia','chuvas','decreto-075-2026','decreto-estadual-24408-2026','teste-excecao','habitacao'],
    evidenceLevel:'L3',analyticalConfidence:1,priority:'urgent',financial:{currency:'BRL'},
    entities:[{name:'Município de Barra',type:'municipality',identifier:'CNPJ 13.880.703/0001-01',role:'ente em situação de emergência'}],
    provenance:{sourceUrl:'https://www.escavador.com/diarios/6228221/DOEBA/P/2026-03-05?page=8',sourceTitle:'Decreto Estadual nº 24.408/2026 — homologação da situação de emergência de Barra',publisher:'Diário Oficial do Estado da Bahia',sourceDate:'2026-03-05',retrievedAt:collectedAt,externalId:'DECRETO-24408-2026-BA',collector:'housing-exception-test-2026-10-06',method:'web_research'},
    notes:['O decreto estadual registra prazo de 180 dias e retroação dos efeitos a 25/02/2026.','A SECOM Bahia também listou Barra entre os municípios em situação de emergência por chuvas em 04/03/2026.','Não foi localizado, até o corte, documento que vincule especificamente o repasse habitacional estadual das 50 unidades ao atendimento da emergência.']
  }
];

export const p0ExpansionFindings:IntelligenceRecord[]=[
  {
    schemaVersion:1,recordId:'P0-LAJEDO-TABOCAL-DEFESO-2026',kind:'research_finding',status:'corroborating',
    title:'Lajedo do Tabocal: primeira parcela de R$ 49.946,15 paga em 06/07; termo veda atividade antes do início do repasse',
    summary:'O FIPLAN registra R$ 49.946,15 pagos em 06/07/2026 no instrumento 21301.0001.26.0000299-1. O Termo de Convênio SUDESB nº 32/2026, Processo SEI 069.1479.2026.0002857-54, fixa exatamente R$ 49.946,15 como primeira parcela, liberável após a publicação, e veda qualquer atividade prevista no plano de trabalho antes do início do repasse financeiro. O PNCP registra posteriormente, em 13/07, a Concorrência Eletrônica 04/2026 para contratar empresa para a reforma do mesmo estádio, estimada em R$ 3.020.421,46. A combinação cria aparente incompatibilidade com a exceção eleitoral ordinária de execução física anterior a 04/07, mas requer o processo administrativo, AIO/OS e eventual fundamento jurídico antes de conclusão.',
    municipality:'Lajedo do Tabocal',state:'BA',eventDate:'2026-07-06',collectedAt,caseIds:['OE-BA-0003'],tags:['p0','defeso-eleitoral','primeira-parcela','sudesb','estadio','execucao-fisica','prioridade-critica'],
    evidenceLevel:'L4',analyticalConfidence:0.99,priority:'urgent',financial:{currency:'BRL',paid:49946.15,contractValue:3020421.46},
    entities:[{name:'Município de Lajedo do Tabocal',type:'municipality',identifier:'CNPJ 16.434.441/0001-31',role:'convenente/recebedor'},{name:'Superintendência dos Desportos do Estado da Bahia - SUDESB',type:'public_body',role:'concedente'}],
    provenance:{sourceUrl:'https://www.ba.gov.br/esporte/sites/site-sudesb/files/2026-07/SEI_00142991035_Termo_de_Convenio.pdf',sourceTitle:'Termo de Convênio nº 32/2026 — Processo SEI 069.1479.2026.0002857-54',publisher:'SUDESB Bahia',sourceDate:'2026-06-30',retrievedAt:collectedAt,externalId:'069.1479.2026.0002857-54',collector:'p0-expansion-2026-10-06',method:'web_research'},
    notes:['FIPLAN: instrumento 21301.0001.26.0000299-1; publicado em 01/07; NOB 21301.0001.26.0002162-7; R$ 49.946,15 pagos em 06/07.','Cláusula Quarta: primeira parcela R$ 49.946,15; liberação após publicação; vedada atividade do plano antes do início do repasse.','PNCP 16434441000131-1-000026/2026: edital publicado em 13/07 para a reforma do Estádio Municipal em atendimento ao Convênio 32/2026.','Não tratar como ilegalidade consumada sem obter autorização de início de obra, ordem de serviço, processo de liberação e eventual parecer/exceção.'],
    raw:{instrument:'21301.0001.26.0000299-1',bankOrder:'21301.0001.26.0002162-7',agreement:'32/2026',firstInstallment:49946.15,paymentDate:'2026-07-06',procurementPublication:'2026-07-13',procurementControl:'16434441000131-1-000026/2026',exceptionAssessment:'apparent_incompatibility_requires_authority_records'}
  },
  {
    schemaVersion:1,recordId:'P0-BELO-CAMPO-DEFESO-2026',kind:'research_finding',status:'corroborating',
    title:'Belo Campo: cavalgada realizada em 07/06; R$ 200 mil estaduais pagos em 08/07',
    summary:'O Convênio SEAGRI nº 01/2026 destinou R$ 200 mil estaduais à realização da Cavalgada de Belo Campo — A Tradição do Vaqueiro. A Prefeitura documentou que o evento ocorreu em 07/06/2026. O FIPLAN registra pagamento efetivado de R$ 200 mil em 08/07/2026, já no período de vedação. Como a exceção ordinária do art. 73, VI, a exige obrigação preexistente referente a obra ou serviço em andamento e com cronograma prefixado, a transferência posterior à realização do evento requer explicação jurídica específica e exame do processo de liberação.',
    municipality:'Belo Campo',state:'BA',eventDate:'2026-07-08',collectedAt,caseIds:['OE-BA-0003'],tags:['p0','defeso-eleitoral','evento-concluido','seagri','transferencia-voluntaria','prioridade-critica'],
    evidenceLevel:'L4',analyticalConfidence:0.995,priority:'urgent',financial:{currency:'BRL',paid:200000,contractValue:200000},
    entities:[{name:'Município de Belo Campo',type:'municipality',identifier:'CNPJ 14.237.333/0001-43',role:'convenente/recebedor'},{name:'Secretaria da Agricultura da Bahia - SEAGRI',type:'public_body',role:'concedente'}],
    provenance:{sourceUrl:'https://www.belocampo.ba.gov.br/Site/Noticias/noticia-120620262339492561-Cavalgada-A-Tradi-o-do-Vaqueiro-re-ne-cerca-de-11-mil-pessoas-e-celebra-a',sourceTitle:'Cavalgada – A Tradição do Vaqueiro reúne cerca de 11 mil pessoas',publisher:'Prefeitura Municipal de Belo Campo',sourceDate:'2026-06-10',retrievedAt:collectedAt,externalId:'CONVENIO-SEAGRI-01-2026',collector:'p0-expansion-2026-10-06',method:'web_research'},
    notes:['DOE 03/06/2026: Convênio SEAGRI 01/2026, Processo 010.9156.2025.0002545-71, R$ 200 mil de participação estadual, objeto apoio à Cavalgada.','Prefeitura: evento realizado em 07/06/2026.','FIPLAN: instrumento 10101.0001.26.0000079-3; NOB 10101.0001.26.0001454-0; R$ 200.000,00 pagos em 08/07.','Requisitar processo de pagamento e parecer que definiu o enquadramento eleitoral; evento concluído antes do início do defeso não deve ser automaticamente equiparado a serviço em andamento.'],
    raw:{instrument:'10101.0001.26.0000079-3',bankOrder:'10101.0001.26.0001454-0',agreement:'SEAGRI 01/2026',eventDate:'2026-06-07',paymentDate:'2026-07-08',stateContribution:200000,exceptionAssessment:'post_completion_transfer_requires_legal_basis'}
  }
];

export const intelligenceBatch20261006=[...housingBatchRecords,...tseBatchRecords,...exceptionBatchRecords,...p0ExpansionFindings];
