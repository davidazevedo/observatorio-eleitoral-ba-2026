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
    provenance:src('https://www.ba.gov.br/pge/perguntas-frequentes-faq','Perguntas Frequentes - FAQ','Procuradoria Geral do Estado da Bahia','2026-05-05'),
    notes:[
      'Teste documental da exceção ordinária: instrumento formal anterior ao período vedado, execução física da obra/serviço já iniciada antes de 04/07/2026 e cronograma prefixado também anterior ao marco.',
      'A orientação eleitoral da PGE-BA, citando o TSE no RO-El nº 176880 (Ac. 25/03/2021), registra que a mera publicação de convênio, ainda que acompanhada de cronograma, não basta para afastar a vedação se a obra não estiver fisicamente iniciada antes do período crítico.',
      'Hipóteses de emergência ou calamidade pública devem ser verificadas separadamente mediante ato formal e aderência do objeto à situação excepcional.'
    ]
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
    title:'Lajedinho: R$ 1,17 milhão pago em 06/07; concorrência publicada em setembro e sessão retificada para 09/10',
    summary:'O FIPLAN registra pagamento efetivado de R$ 1,17 milhão em 06/07/2026 no convênio habitacional estadual com Lajedinho. O portal oficial municipal registra, meses depois, a Concorrência 008/2026 para executar as mesmas 50 unidades, vinculada ao Convênio 007/2026. Em 22/09 o município publicou retificação porque o Anexo XXI — Cronograma Físico-Financeiro — não acompanhou a divulgação anterior e remarcou a entrega das propostas e a sessão para 09/10/2026. Assim, em 06/10 o procedimento permanecia aberto e ainda não era possível exigir fornecedor vencedor. A combinação segue prioritária para obtenção da documentação da exceção legal e da eventual execução física anterior a 04/07; não prova, isoladamente, repasse irregular.',
    municipality:'Lajedinho',state:'BA',eventDate:'2026-07-06',caseIds:['OE-BA-0002','OE-BA-0003'],
    sourceIds:['dados-abertos-ba-convenios-parcerias','lajedinho-transparencia-licitacoes','pge-ba-eleicoes-2026'],
    tags:['convenio-007-2026','habitacao','pagamento-06-07','licitacao-setembro','retificacao-22-09','sessao-09-10','defeso-eleitoral','prioridade-documental'],
    evidenceLevel:'L3',analyticalConfidence:0.99,priority:'urgent',financial:{currency:'BRL',paid:1170000,contractValue:5877340.25},
    raw:{procurementDate:'2026-09-11',procurementStatus:'em_andamento',procurementControl:'13810544000160-1-000098/2026',procurementValue:5877340.25,procurementDeadline:'2026-10-09',supplier:null,supplierCnpj:null,electoralCrossmatch:'not_applicable_no_supplier',electoralCrossmatchNote:'Procedimento retificado em 22/09, com sessão remarcada para 09/10/2026; em 06/10 ainda não havia obrigação temporal de existir vencedor homologado.'},
    entities:[{name:'Município de Lajedinho',type:'municipality',identifier:'CNPJ 13.810.544/0001-60',role:'convenente/contratante'}],
    provenance:src('https://transparencia.lajedinho.ba.gov.br/licitacoes','Portal da Transparência — Licitações 2026','Prefeitura Municipal de Lajedinho','2026-09-22','Concorrência 008/2026 / PNCP 13810544000160-1-000098/2026'),
    notes:['FIPLAN: instrumento 26601.0001.26.0000007-1; celebrado em 19/06/2026; publicado em 20/06/2026; NOB 26601.0001.26.0000027-8; pagamento efetivado em 06/07/2026: R$ 1.170.000,00.','Portal municipal: Concorrência 008/2026 para executar 50 unidades vinculadas ao Convênio 007/2026, publicada em 11/09.','Retificação publicada em 22/09: inclusão do Anexo XXI — Cronograma Físico-Financeiro, que não acompanhou a divulgação anterior; propostas até 09/10 às 08:20 e abertura em 09/10 às 08:30. Em 06/10, portanto, o certame ainda estava em curso.','Pergunta decisiva: qual exceção do art. 73, VI, a, fundamentou o pagamento de 06/07 e qual documento comprova obra/serviço fisicamente iniciado antes de 04/07 com cronograma prefixado?','Verificar se existia contratação ou execução anterior distinta antes de qualquer conclusão jurídica.']
  }),
  base({
    recordId:'BOOT-CIPO-HAB-2026',kind:'research_finding',status:'corroborating',
    title:'Cipó: R$ 1,17 milhão pago em 06/07; primeira concorrência anulada e objeto republicado em agosto',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026 no convênio habitacional com Cipó. Para o mesmo objeto do Convênio 009/2026, foi localizada a Concorrência Eletrônica 007/2026, Processo 264/2026, publicada no PNCP em 03/08 e posteriormente marcada como anulada; em seguida o município republicou o objeto como Concorrência Eletrônica 009/2026, Processo 311/2026, controle PNCP 13808936000195-1-000063/2026, publicada em 24/08. A sequência pagamento → primeira licitação anulada → republicação posterior reforça a prioridade de obter a documentação da exceção legal, sem provar, isoladamente, irregularidade.',
    municipality:'Cipó',state:'BA',eventDate:'2026-07-06',caseIds:['OE-BA-0002','OE-BA-0003'],
    sourceIds:['dados-abertos-ba-convenios-parcerias','dou-cipo-concorrencia-007-2026','pge-ba-eleicoes-2026'],
    tags:['habitacao','convenio-009-2026','pagamento-06-07','licitacao-agosto','licitacao-anulada','republicacao','defeso-eleitoral'],
    evidenceLevel:'L3',analyticalConfidence:0.98,priority:'urgent',financial:{currency:'BRL',paid:1170000,contractValue:5877340.25},
    raw:{procurementDate:'2026-08-24',procurementStatus:'em_andamento',procurementControl:'13808936000195-1-000055/2026 (Conc. 007/2026, anulada) → 13808936000195-1-000063/2026 (Conc. 009/2026, republicada)',procurementValue:5877340.25,supplier:null,supplierCnpj:null,electoralCrossmatch:'not_applicable_no_supplier',electoralCrossmatchNote:'A primeira concorrência localizada para o objeto aparece anulada; a republicação de 24/08 seguia sem fornecedor vencedor publicado na consulta de 06/10/2026.'},
    entities:[{name:'Município de Cipó',type:'municipality',identifier:'CNPJ 13.808.936/0001-95',role:'convenente/contratante'}],
    provenance:src('https://www.in.gov.br/web/dou/-/aviso-de-licitacao-722316704','Aviso de Licitação — Concorrência Eletrônica nº 7/2026','Diário Oficial da União','2026-08-03','Processo Administrativo 264/2026 / Convênio 009/2026'),
    notes:['FIPLAN: instrumento 26601.0001.26.0000002-0; celebrado em 19/06; publicado em 20/06; NOB 26601.0001.26.0000032-4; R$ 1.170.000,00 efetivados em 06/07.','Primeira contratação localizada para o objeto: Concorrência Eletrônica 007/2026, Processo 264/2026, PNCP 13808936000195-1-000055/2026, publicada em 03/08, sessão em 13/08; fontes de monitoramento PNCP consultadas em 06/10 a classificavam como anulada.','Republicação: Concorrência Eletrônica 009/2026, Processo 311/2026, PNCP 13808936000195-1-000063/2026, publicação em 24/08, sessão em 09/09, valor estimado R$ 5.877.340,25; snapshot de 06/10 seguia sem resultado publicado.','A contratação municipal da empresa executora das 50 unidades foi levada a licitação após o pagamento, com uma primeira tentativa anulada e posterior republicação.','Verificar ato formal e motivo da anulação da 007/2026, eventual execução anterior distinta, ordem de serviço, contratação prévia ou outra hipótese antes de concluir sobre a legalidade do repasse.']
  }),
  base({
    recordId:'BOOT-ITABERABA-HAB-2026',kind:'research_finding',status:'corroborating',
    title:'Itaberaba: R$ 1,17 milhão pago em 06/07; aviso para contratar as 50 moradias publicado em 26/08',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026 no convênio habitacional com Itaberaba. O portal oficial municipal registra em 26/08/2026 o aviso da Concorrência Eletrônica nº 010/2026-FMAS para contratar empresa especializada para executar as 50 unidades habitacionais. O PNCP recebeu duas publicações do mesmo processo/objeto/valor com 32 minutos de diferença: o controle 160 modela 1 serviço por R$ 5,85 milhões; o 161 modela 50 serviços de R$ 117 mil, preservando o total. A evidência é compatível com correção/republicação cadastral, mas o ato formal explicativo ainda não foi localizado. A diferença temporal em relação ao pagamento continua prioritária para comprovação dos requisitos da exceção legal, sem presumir irregularidade.',
    municipality:'Itaberaba',state:'BA',eventDate:'2026-07-06',caseIds:['OE-BA-0002','OE-BA-0003'],
    sourceIds:['dados-abertos-ba-convenios-parcerias','itaberaba-licitacao-010-2026','pge-ba-eleicoes-2026'],
    tags:['habitacao','pagamento-06-07','licitacao-26-08','pncp-duplo-controle','possivel-correcao-cadastral','defeso-eleitoral','prioridade-documental'],
    evidenceLevel:'L3',analyticalConfidence:0.99,priority:'urgent',financial:{currency:'BRL',paid:1170000,contractValue:5850000},
    raw:{procurementDate:'2026-08-26',procurementStatus:'em_andamento',procurementControl:'13719646000175-1-000160/2026 → 13719646000175-1-000161/2026',procurementValue:5850000,pncpModelDifference:'160: quantidade 1 × R$ 5.850.000,00; 161: quantidade 50 × R$ 117.000,00; mesmo objeto e mesmo total',supplier:null,supplierCnpj:null,electoralCrossmatch:'not_applicable_no_supplier',electoralCrossmatchNote:'Ambos os controles permaneciam sem resultado na consulta preservada de 06/10/2026. A diferença cadastral sugere correção/republicação, mas ainda sem ato formal explicativo localizado.'},
    entities:[{name:'Município de Itaberaba',type:'municipality',identifier:'CNPJ 13.719.646/0001-75',role:'convenente/contratante'}],
    provenance:src('https://sai.io.org.br/ba/itaberaba/Site/PublicacoesOutrosVeiculos','Publicações em Outros Veículos — Concorrência Eletrônica nº 010/2026-FMAS','Prefeitura Municipal de Itaberaba','2026-08-26','Concorrência Eletrônica 010/2026-FMAS'),
    notes:['FIPLAN: instrumento 26601.0001.26.0000019-5; celebrado em 19/06; publicado em 20/06; NOB 26601.0001.26.0000028-6; R$ 1.170.000,00 efetivados em 06/07.','PNCP 160: incluído em 26/08 às 11:18:47; item descrito como 1 serviço, valor unitário/total R$ 5.850.000,00; situação Em andamento; temResultado=false.','PNCP 161: incluído em 26/08 às 11:50:50; mesma descrição e total, porém quantidade 50 e valor unitário R$ 117.000,00; situação Em andamento; temResultado=false.','Fontes públicas derivadas do PNCP normalizam o processo como FMAS - 091/2026 / FMAS 091/2026. O intervalo de 32 minutos e a mudança 1×R$5,85 mi → 50×R$117 mil são compatíveis com correção cadastral/republicação, mas não constituem prova do motivo; localizar o ato formal de retificação/cancelamento do primeiro controle.','Portal municipal: aviso de licitação para executar as 50 unidades publicado em 26/08, com sessão em 11/09.','Verificar eventual execução anterior distinta, ordem de serviço, contratação prévia ou outra hipótese antes de concluir sobre a legalidade do repasse.']
  }),
  base({
    recordId:'BOOT-LAPAO-HAB-2026',kind:'research_finding',status:'corroborating',
    title:'Lapão: R$ 1,17 milhão pago em 06/07; licitação das 50 moradias publicada em 31/07',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026 no convênio habitacional com Lapão. O aviso da Concorrência Eletrônica nº 010/2026, para executar as 50 unidades do Convênio nº 002/2026 SEDUR, foi publicado em 31/07/2026, com abertura em 18/08; a homologação posterior foi em favor da Nunes Engenharia Ltda. A sequência temporal exige a documentação da exceção legal e não prova, isoladamente, irregularidade.',
    municipality:'Lapão',state:'BA',eventDate:'2026-07-06',caseIds:['OE-BA-0002','OE-BA-0003'],
    sourceIds:['dados-abertos-ba-convenios-parcerias','lapao-concorrencia-010-2026','pge-ba-eleicoes-2026'],
    tags:['habitacao','convenio-002-2026','pagamento-06-07','licitacao-31-07','defeso-eleitoral','prioridade-documental'],
    evidenceLevel:'L3',analyticalConfidence:0.99,priority:'urgent',financial:{currency:'BRL',paid:1170000,contractValue:5822160.50},
    raw:{procurementDate:'2026-07-31',procurementStatus:'homologado',procurementControl:'Concorrência Eletrônica 010/2026',procurementValue:5822160.50,supplier:'Nunes Engenharia Ltda',supplierCnpj:'07.492.799/0001-20',electoralCrossmatch:'no_exact_match',electoralCrossmatchNote:'Busca exata no snapshot TSE/BA de 06/10/2026: zero ocorrências nos seis arquivos de despesas/documentos de candidatos e órgãos partidários.'},
    entities:[
      {name:'Município de Lapão',type:'municipality',identifier:'CNPJ 13.891.528/0001-40',role:'convenente/contratante'},
      {name:'Nunes Engenharia Ltda',type:'supplier',identifier:'CNPJ 07.492.799/0001-20',role:'empresa homologada para execução'}
    ],
    provenance:src('https://www.escavador.com/diarios/9247755/DOEBA/P/2026-07-31?page=130','Aviso de Licitação — Concorrência Eletrônica nº 010/2026','Diário Oficial do Estado da Bahia / Prefeitura Municipal de Lapão','2026-07-31','PNCP 15448570000116-1-000001/2026'),
    notes:['FIPLAN: instrumento 26601.0001.26.0000004-7; celebrado em 19/06; publicado em 20/06; NOB 26601.0001.26.0000038-3; R$ 1.170.000,00 efetivados em 06/07.','Aviso da Concorrência 010/2026 publicado em 31/07; sessão em 18/08.','Homologação publicada em 24/09 em favor da Nunes Engenharia Ltda, por R$ 5.822.160,50.','Verificar eventual contratação ou execução anterior distinta, ordem de serviço, medições e fundamento formal da exceção do art. 73, VI, a, antes de concluir sobre a legalidade do repasse.']
  }),
  base({
    recordId:'BOOT-MACAJUBA-HAB-2026',kind:'research_finding',status:'corroborating',
    title:'Macajuba: R$ 1,17 milhão pago em 07/07; concorrência das 50 moradias publicada no PNCP em 28/07',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 07/07/2026 no convênio habitacional com Macajuba. A API oficial do PNCP registra em 28/07/2026 a Concorrência Eletrônica nº 004/2026, Processo 254/2026, para construir exatamente 50 unidades habitacionais, vinculadas ao Convênio nº 014/2026, com valor estimado de R$ 5.849.648,93 e fonte orçamentária estadual. A sequência temporal exige documentação da exceção legal e não prova, isoladamente, irregularidade.',
    municipality:'Macajuba',state:'BA',eventDate:'2026-07-07',caseIds:['OE-BA-0002','OE-BA-0003'],
    sourceIds:['dados-abertos-ba-convenios-parcerias','pncp-macajuba-000019-2026','pge-ba-eleicoes-2026'],
    tags:['habitacao','convenio-014-2026','pagamento-07-07','pncp-28-07','defeso-eleitoral','prioridade-documental'],
    evidenceLevel:'L3',analyticalConfidence:0.995,priority:'urgent',financial:{currency:'BRL',paid:1170000,contractValue:5849648.93},
    raw:{procurementDate:'2026-07-28',procurementStatus:'em_andamento',procurementControl:'13810841000106-1-000019/2026',procurementValue:5849648.93,supplier:null,supplierCnpj:null,electoralCrossmatch:'not_applicable_no_supplier',electoralCrossmatchNote:'Portal oficial em 06/10/2026 exibia lote em andamento e sem vencedor.'},
    entities:[{name:'Município de Macajuba',type:'municipality',identifier:'CNPJ 13.810.841/0001-06',role:'convenente/contratante'}],
    provenance:src('https://pncp.gov.br/app/editais/13810841000106/2026/19','PNCP — Concorrência Eletrônica nº 004/2026, Processo 254/2026','Portal Nacional de Contratações Públicas','2026-07-28','13810841000106-1-000019/2026'),
    notes:['FIPLAN: instrumento 26601.0001.26.0000016-0; celebrado em 19/06; publicado em 20/06; NOB 26601.0001.26.0000041-3; R$ 1.170.000,00 efetivados em 07/07.','Portal oficial municipal: Concorrência Eletrônica 004/2026, Processo 254/2026, publicada em 28/07, valor estimado R$ 5.849.648,93. Na coleta de 06/10 o lote permanecia “Em andamento”, sem vencedor exibido.','Snapshot HTML privado preservado: SHA-256 3e47e4a4e56d0651a1b9d72bdde44d31fa8e517eca14f08a909639fcb16002d9; certificado de manifesto dd277f5170dd8b9aa102afc3017082c023dbdbe3eedc708488cc300894bfd9e4.','PDF oficial do DOE municipal, edição 3.667 de 28/07, preservado: SHA-256 5e85249bc8ddbe41050fed0fb9ef424e9093daf31fe37897489fd8cde851617d.','Verificar eventual contratação/execução anterior distinta, ordem de serviço, medições e fundamento formal da exceção antes de conclusão jurídica.']
  }),
  base({
    recordId:'BOOT-BARRA-HAB-GAP-2026',kind:'research_finding',status:'triage',
    title:'Barra: pagamento de R$ 1,17 milhão em 07/07; concorrência correspondente às 50 unidades ainda não localizada no PNCP',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 07/07/2026 no convênio estadual das 50 unidades de Barra. Consulta à API oficial do PNCP, CNPJ 13.880.703/0001-01, modalidade Concorrência Eletrônica, de 01/01 a 05/10/2026, retornou oito contratações e nenhuma com objeto habitacional correspondente. Isso é uma lacuna de pesquisa, não prova de ausência de contratação ou de irregularidade.',
    municipality:'Barra',state:'BA',eventDate:'2026-07-07',caseIds:['OE-BA-0002','OE-BA-0003'],tags:['habitacao','pagamento-07-07','pncp-lacuna','defeso-eleitoral'],evidenceLevel:'L1',analyticalConfidence:0.90,priority:'high',financial:{currency:'BRL',paid:1170000},
    raw:{procurementDate:null,procurementStatus:'nao_localizado',procurementControl:null,procurementValue:null,supplier:null,supplierCnpj:null,electoralCrossmatch:'not_run',electoralCrossmatchNote:'Sem fornecedor estadual correspondente localizado; cruzamento eleitoral não aplicável nesta etapa.'},
    provenance:src('https://pncp.gov.br/','Consulta API PNCP por CNPJ e modalidade','Portal Nacional de Contratações Públicas','2026-10-05','CNPJ 13880703000101 / modalidade 4 / 20260101-20261005'),
    notes:['Instrumento FIPLAN 26601.0001.26.0000006-3; NOB 26601.0001.26.0000039-1.','Prosseguir no DOE, portal municipal, contratos, ordens de serviço e outras modalidades/sistemas de origem.']
  }),
  base({
    recordId:'BOOT-ESPLANADA-HAB-GAP-2026',kind:'research_finding',status:'triage',
    title:'Esplanada: pagamento de R$ 1,17 milhão em 06/07; concorrência correspondente às 50 unidades ainda não localizada no PNCP',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026 no convênio estadual das 50 unidades de Esplanada. Consulta à API oficial do PNCP, CNPJ 13.885.231/0001-71, modalidade Concorrência Eletrônica, de 01/01 a 05/10/2026, retornou quatorze contratações e nenhuma com objeto habitacional correspondente. Isso é uma lacuna de pesquisa, não prova de ausência de contratação ou de irregularidade.',
    municipality:'Esplanada',state:'BA',eventDate:'2026-07-06',caseIds:['OE-BA-0002','OE-BA-0003'],tags:['habitacao','pagamento-06-07','pncp-lacuna','defeso-eleitoral'],evidenceLevel:'L1',analyticalConfidence:0.90,priority:'high',financial:{currency:'BRL',paid:1170000},
    raw:{procurementDate:null,procurementStatus:'nao_localizado',procurementControl:null,procurementValue:null,supplier:null,supplierCnpj:null,electoralCrossmatch:'not_run',electoralCrossmatchNote:'Sem fornecedor estadual correspondente localizado; cruzamento eleitoral não aplicável nesta etapa.'},
    provenance:src('https://pncp.gov.br/','Consulta API PNCP por CNPJ e modalidade','Portal Nacional de Contratações Públicas','2026-10-05','CNPJ 13885231000171 / modalidade 4 / 20260101-20261005'),
    notes:['Instrumento FIPLAN 26601.0001.26.0000009-8; NOB 26601.0001.26.0000034-0.','Existe outro projeto MCMV/PTS em Esplanada; não foi associado a este convênio estadual sem prova documental.','Prosseguir no DOE, portal municipal, contratos, ordens de serviço e outras modalidades/sistemas de origem.']
  }),
  base({
    recordId:'BOOT-IRAQUARA-HAB-GAP-2026',kind:'research_finding',status:'triage',
    title:'Iraquara: pagamento de R$ 1,17 milhão em 06/07; concorrência estadual das 50 unidades ainda não localizada',
    summary:'O FIPLAN registra R$ 1,17 milhão efetivado em 06/07/2026 no convênio estadual das 50 unidades de Iraquara. A API oficial do PNCP localiza em 2026 uma concorrência habitacional para 20 unidades do MCMV FNHIS Sub 50, publicada em janeiro, mas esse é um projeto federal distinto. Não foi localizada até 05/10 uma Concorrência Eletrônica correspondente às 50 unidades estaduais. A ausência é uma lacuna de pesquisa, não prova de irregularidade.',
    municipality:'Iraquara',state:'BA',eventDate:'2026-07-06',caseIds:['OE-BA-0002','OE-BA-0003'],tags:['habitacao','pagamento-06-07','projeto-federal-distinto','pncp-lacuna','defeso-eleitoral'],evidenceLevel:'L1',analyticalConfidence:0.95,priority:'high',financial:{currency:'BRL',paid:1170000},
    raw:{procurementDate:null,procurementStatus:'nao_localizado',procurementControl:null,procurementValue:null,supplier:null,supplierCnpj:null,electoralCrossmatch:'not_run',electoralCrossmatchNote:'Projeto federal de 20 unidades foi excluído; fornecedor do convênio estadual de 50 unidades não localizado.'},
    provenance:src('https://www.iraquara.ba.gov.br/portal-da-transparencia/licitacoes/3','Portal da Transparência — Editais de Licitação','Prefeitura Municipal de Iraquara','2026-10-05','CNPJ 13922596000129 / PNCP + portal municipal'),
    notes:['Instrumento FIPLAN 26601.0001.26.0000018-7; NOB 26601.0001.26.0000033-2.','Concorrência 001/2026 refere-se a 20 unidades federais FNHIS Sub 50 e foi explicitamente excluída do cruzamento estadual.','Prosseguir no DOE, contratos, ordens de serviço e publicações posteriores.']
  }),
  base({
    recordId:'BOOT-TSE-NUNES-CROSSMATCH-2026',kind:'electoral_account',status:'verified',
    title:'TSE 2026/BA: nenhuma ocorrência direta de Nunes Engenharia nos seis recortes eleitorais consultados',
    summary:'Busca exata pelo CNPJ 07.492.799/0001-20 e pelo nome NUNES ENGENHARIA nos recortes Bahia de despesas contratadas, despesas pagas e documentos fiscais de candidatos e órgãos partidários do TSE 2026 retornou zero ocorrências. O resultado reduz a hipótese de sobreposição eleitoral direta desta empresa nas bases consultadas, sem excluir relações por pessoas físicas, sociedades, outras UFs ou atualizações posteriores.',
    municipality:'Lapão',state:'BA',eventDate:'2026-10-06',caseIds:['OE-BA-0003'],
    sourceIds:['tse-prestacao-contas-2026-catalog'],
    tags:['tse-crossmatch','fornecedor','resultado-negativo','lapao','nunes-engenharia'],
    evidenceLevel:'L2',analyticalConfidence:1,priority:'low',financial:{currency:'BRL'},
    entities:[{name:'Nunes Engenharia Ltda',type:'supplier',identifier:'CNPJ 07.492.799/0001-20',role:'fornecedor público cruzado com bases eleitorais'}],
    provenance:src('https://dadosabertos.tse.jus.br/tl/dataset/prestacao-de-contas-eleitorais-2026','Prestação de Contas Eleitorais 2026','Tribunal Superior Eleitoral','2026-10-06','preservation/manifests/tse-2026-crossmatch.json'),
    notes:[
      'Arquivos consultados: despesas contratadas/pagas de candidatos BA, documentos fiscais de candidatos BA, despesas contratadas/pagas de órgãos partidários BA e documentos fiscais partidários BA.',
      'Universo consultado: 36.459 despesas contratadas de candidatos; 25.798 pagamentos de candidatos; 2.250 documentos fiscais de candidatos; 660 despesas contratadas partidárias; 237 pagamentos partidários; 1 documento fiscal partidário.',
      'Método: busca exata pelo CNPJ normalizado 07492799000120 e, em paralelo, pelo texto NUNES ENGENHARIA.',
      'Resultado: 0 ocorrências nos seis arquivos do snapshot coletado em 06/10/2026.',
      'Os seis recortes BA foram preservados em preservation/extracts/tse/; hashes e hashes dos ZIPs oficiais constam em preservation/manifests/tse-2026-crossmatch.json.',
      'Reexecutar o cruzamento sobre versões posteriores do TSE antes de encaminhamento institucional.'
    ]
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