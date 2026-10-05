import type { IntelligenceRecord } from '@/lib/intelligence';

const t = '2026-10-05T15:30:00.000Z';
const base = (x: Omit<IntelligenceRecord,'schemaVersion'|'collectedAt'>): IntelligenceRecord => ({schemaVersion:1,collectedAt:t,...x});
const src = (sourceUrl:string, sourceTitle:string, publisher:string, sourceDate?:string, externalId?:string) => ({
  sourceUrl, sourceTitle, publisher, sourceDate, externalId, retrievedAt:t, collector:'bootstrap-p0-2026-10-05', method:'web_research' as const
});

const housing = ['Alagoinhas','Lapão','Pojuca','Iraquara','Itapicuru','Iaçu','Lajedinho','Salinas da Margarida','Cipó','Aramari','Barra','Araçás','Conde','Macajuba','Itaberaba','Gavião','Santa Bárbara','Guanambi','Esplanada','Formosa do Rio Preto','Ribeira do Pombal','Nova Redenção'];

export const bootstrapIntelligenceRecords: IntelligenceRecord[] = [
  base({
    recordId:'BOOT-LEGAL-PGE-2026', kind:'legal_reference', status:'verified',
    title:'PGE-BA: regra de transferências Estado→Município no defeso de 2026',
    summary:'A PGE-BA informa impedimento de repasse financeiro estadual aos municípios de 04/07 a 04/10/2026, salvo obrigação formal preexistente para obra ou serviço já fisicamente iniciado com cronograma prefixado, ou emergência/calamidade.',
    state:'BA', eventDate:'2026-07-04', caseIds:['OE-BA-0003'], tags:['art-73','transferencia-voluntaria','regra-auditoria'],
    evidenceLevel:'L3', analyticalConfidence:1, priority:'high', financial:{currency:'BRL'},
    entities:[{name:'Procuradoria Geral do Estado da Bahia',type:'public_body',role:'orientação jurídica oficial'}],
    provenance:src('https://www.ba.gov.br/pge/perguntas-frequentes-faq','Perguntas Frequentes - FAQ','Procuradoria Geral do Estado da Bahia','2026-05-05')
  }),
  base({
    recordId:'BOOT-PACOTE-2026-06-11', kind:'research_finding', status:'verified',
    title:'11/06: pacote estadual superior a R$ 1,7 bilhão para 200 municípios',
    summary:'A SECOM documentou pacote superior a R$ 1,7 bilhão para 200 cidades, com 24 ordens de serviço, 56 licitações, 271 convênios e três acordos consorciais. O registro comprova o anúncio e os atos, não pagamento ou transferência efetiva.',
    state:'BA', eventDate:'2026-06-11', caseIds:['OE-BA-0001'], tags:['pacote-estadual','convenios','baseline'],
    evidenceLevel:'L2', analyticalConfidence:1, priority:'high', financial:{currency:'BRL',announced:1700000000},
    entities:[{name:'Governo do Estado da Bahia',type:'public_body',role:'anunciante/executor'}],
    provenance:src('https://www.ba.gov.br/comunicacao/noticias/2026-06/382803/investimentos-de-mais-de-r-17-bilhao-do-estado-fortalecem-municipios-e','Investimentos de mais de R$ 1,7 bilhão do Estado fortalecem municípios','SECOM Bahia','2026-06-11','SECOM-382803'),
    notes:['Valor anunciado; não somar como valor pago.']
  }),
  base({
    recordId:'BOOT-PACOTE-2026-07-03', kind:'research_finding', status:'corroborating',
    title:'03/07: pacote estadual de aproximadamente R$ 6 bilhões para mais de 160 municípios',
    summary:'Na véspera do defeso, a SECOM registrou mais de cem atos entre ordens de serviço, licitações, convênios, editais, autorizações e cessões, somando aproximadamente R$ 6 bilhões. A concentração temporal é prioridade de auditoria, não evidência de ilícito.',
    state:'BA', eventDate:'2026-07-03', caseIds:['OE-BA-0002'], tags:['03-07-2026','janela-eleitoral','prioridade-auditoria'],
    evidenceLevel:'L3', analyticalConfidence:1, priority:'urgent', financial:{currency:'BRL',announced:6000000000},
    entities:[{name:'Governo do Estado da Bahia',type:'public_body',role:'anunciante/executor'}],
    provenance:src('https://www.ba.gov.br/comunicacao/noticias/2026-07/383361/audio-governo-do-estado-anuncia-pacote-de-investimentos-de-cerca-de-r-6','Governo do Estado anuncia pacote de investimentos de cerca de R$ 6 bilhões','SECOM Bahia','2026-07-03','SECOM-383361'),
    notes:['Decompor atos por município e instrumento.','Cruzar com transferência/pagamento e execução física.']
  }),
  base({
    recordId:'BOOT-HABITACAO-2026-07-03', kind:'research_finding', status:'corroborating',
    title:'03/07: R$ 128,7 milhões em convênios habitacionais com 22 municípios',
    summary:'A Sedur informou convênios para 1.100 unidades em 22 municípios, 50 por município, com R$ 128,7 milhões estaduais. A fonte informa cinco parcelas acompanhando a execução física e 18 convênios já publicados no DOE.',
    state:'BA', eventDate:'2026-07-03', caseIds:['OE-BA-0002'], tags:['habitação','convênios','cinco-parcelas','execucao-fisica'],
    evidenceLevel:'L2', analyticalConfidence:1, priority:'urgent', financial:{currency:'BRL',announced:128700000},
    entities:[{name:'Secretaria de Desenvolvimento Urbano da Bahia',type:'public_body',role:'órgão estadual'},...housing.map(name=>({name,type:'municipality' as const,role:'convenente/beneficiário'}))],
    provenance:src('https://www.ba.gov.br/sedur/noticias/2026-07/12409/governo-da-bahia-firma-convenios-para-construcao-de-1100-moradias-em-22','Governo da Bahia firma convênios para construção de 1.100 moradias em 22 municípios','Secretaria de Desenvolvimento Urbano da Bahia','2026-07-03','SEDUR-12409'),
    notes:['Localizar as cinco parcelas de cada convênio.','Repasse no defeso exige teste documental da exceção; a fonte não prova que houve repasse no período.']
  }),
  ...housing.map((municipality,i)=>base({
    recordId:`BOOT-HAB-MUN-${String(i+1).padStart(2,'0')}`, kind:'municipal_fact', status:'triage',
    title:`${municipality}: 50 unidades habitacionais em convênio de 03/07`,
    summary:`A Sedur incluiu ${municipality} entre os 22 municípios contemplados em 03/07/2026. O pacote prevê 50 unidades por município e cinco parcelas conforme execução física. Este registro não presume transferência financeira após 04/07.`,
    municipality,state:'BA',eventDate:'2026-07-03',caseIds:['OE-BA-0002'],tags:['habitação','03-07-2026','auditoria-transferencia'],
    evidenceLevel:'L2',analyticalConfidence:0.99,priority:municipality==='Lajedinho'?'high':'medium',financial:{currency:'BRL'},
    entities:[{name:municipality,type:'municipality',role:'convenente/beneficiário'}],
    provenance:src('https://www.ba.gov.br/sedur/noticias/2026-07/12409/governo-da-bahia-firma-convenios-para-construcao-de-1100-moradias-em-22','Governo da Bahia firma convênios para construção de 1.100 moradias em 22 municípios','Secretaria de Desenvolvimento Urbano da Bahia','2026-07-03','SEDUR-12409'),
    notes:['Localizar número do convênio, parcelas, datas e execução física.']
  })),
  base({
    recordId:'BOOT-LAJEDINHO-007-2026',kind:'research_finding',status:'corroborating',
    title:'Lajedinho: Convênio 007/2026 teve licitação da obra em fase de contratação apenas em setembro',
    summary:'O portal oficial de Lajedinho registra a Concorrência 008/2026 para 50 unidades do Minha Casa Minha Vida Bahia, vinculada ao Convênio 007/2026, em fase licitatória em setembro. Isso corrobora o convênio estadual de 03/07 e torna prioritário verificar se houve parcela estadual durante o defeso. Não prova repasse irregular.',
    municipality:'Lajedinho',state:'BA',eventDate:'2026-09-22',caseIds:['OE-BA-0002'],
    tags:['convenio-007-2026','habitacao','licitacao','defeso-eleitoral','lacuna-transferencia'],
    evidenceLevel:'L3',analyticalConfidence:0.99,priority:'urgent',financial:{currency:'BRL',contractValue:5877340.25},
    entities:[{name:'Município de Lajedinho',type:'municipality',identifier:'CNPJ 13.810.544/0001-60',role:'convenente/contratante'}],
    provenance:src('https://transparencia.lajedinho.ba.gov.br/licitacoes','Portal da Transparência — Licitações 2026','Prefeitura Municipal de Lajedinho','2026-09-22','Concorrência 008/2026 / PNCP 13810544000160-1-000098/2026'),
    notes:['Pergunta decisiva: houve transferência estadual do Convênio 007/2026 entre 04/07 e 04/10?','Se houve, qual exceção e qual prova de execução física anterior a 04/07?','Verificar se existia contratação anterior distinta antes de qualquer conclusão.']
  }),
  base({
    recordId:'BOOT-CONTROL-TUCANO',kind:'municipal_fact',status:'verified',
    title:'Tucano/Caldas do Jorro: obra de R$ 58,6 milhões já estava em execução física antes do defeso',
    summary:'Em 01/07, a Embasa informou rede já executada e unidades em construção no SES de Caldas do Jorro. É caso-controle: proximidade eleitoral isolada não implica irregularidade e havia evidência pública de execução física anterior ao defeso.',
    municipality:'Tucano',state:'BA',eventDate:'2026-07-01',tags:['controle-negativo','execucao-fisica','embasa'],
    evidenceLevel:'L2',analyticalConfidence:1,priority:'low',financial:{currency:'BRL',announced:58600000},
    provenance:src('https://www.ba.gov.br/comunicacao/noticias/2026-07/383271/implantacao-de-esgotamento-sanitario-esta-em-fase-inicial-em-caldas-do','Implantação de esgotamento sanitário está em fase inicial em Caldas do Jorro','SECOM Bahia / Embasa','2026-07-01','SECOM-383271')
  }),
  base({
    recordId:'BOOT-CONTROL-CAMACARI',kind:'municipal_fact',status:'verified',
    title:'Camaçari: policlínica de R$ 49 milhões inaugurada antes do defeso',
    summary:'A Policlínica Regional de Camaçari foi inaugurada em 30/06, investimento total de R$ 49 milhões com aportes estadual e federal. Serve como controle para distinguir obra entregue de anúncio ou transferência.',
    municipality:'Camaçari',state:'BA',eventDate:'2026-06-30',tags:['controle-negativo','obra-entregue','saude'],
    evidenceLevel:'L2',analyticalConfidence:1,priority:'low',financial:{currency:'BRL',announced:49000000},
    provenance:src('https://www.ba.gov.br/comunicacao/noticias/2026-06/383264/nova-policlinica-de-camacari-amplia-acesso-saude-especializada-e-fortalece','Nova Policlínica de Camaçari amplia acesso à saúde especializada','SECOM Bahia','2026-06-30','SECOM-383264')
  })
];