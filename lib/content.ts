export type SourceItem = {
  id: string;
  group: 'fato-publico' | 'eleitoral' | 'dados' | 'institucional';
  date: string;
  title: string;
  organization: string;
  summary: string;
  href: string;
};

export const sourceCatalog: SourceItem[] = [
  {
    id: 'govba-1700', group: 'fato-publico', date: '11/06/2026',
    title: 'Investimentos de mais de R$ 1,7 bilhão do Estado fortalecem municípios',
    organization: 'Governo do Estado da Bahia / SECOM',
    summary: 'Anúncio oficial de mais de R$ 1,7 bilhão, envolvendo 200 cidades, 271 convênios, 24 ordens de serviço, 56 licitações e três acordos consorciais.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-06/382803/investimentos-de-mais-de-r-17-bilhao-do-estado-fortalecem-municipios-e',
  },
  {
    id: 'govba-6000', group: 'fato-publico', date: '03/07/2026',
    title: 'Pacote de investimentos de cerca de R$ 6 bilhões',
    organization: 'Governo do Estado da Bahia / SECOM',
    summary: 'Anúncio oficial de mais de cem atos, entre ordens de serviço, licitações, convênios, editais, autorizações e cessão de equipamentos, beneficiando mais de 160 municípios.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-07/383361/audio-governo-do-estado-anuncia-pacote-de-investimentos-de-cerca-de-r-6',
  },
  {
    id: 'pge-defeso', group: 'eleitoral', date: '2026',
    title: 'Orientações para o Ano Eleitoral 2026',
    organization: 'Procuradoria Geral do Estado da Bahia',
    summary: 'A PGE-BA informa vedação ao repasse financeiro de transferências voluntárias do Estado aos municípios de 4 de julho a 4 de outubro de 2026, ressalvadas hipóteses legais como obrigação formal preexistente para obra/serviço fisicamente iniciado com cronograma prefixado e situações de emergência ou calamidade.',
    href: 'https://www.ba.gov.br/pge/orientacoes-para-o-ano-eleitoral-2026',
  },
  {
    id: 'transferegov-21', group: 'eleitoral', date: '03/07/2026',
    title: 'Comunicado nº 21/2026 — defeso eleitoral',
    organization: 'Transferegov / Ministério da Gestão e da Inovação',
    summary: 'Orienta sobre transferência efetiva, desbloqueio de recursos e requisitos cumulativos para exceções: obrigação formal preexistente, cronograma prefixado e execução física iniciada antes do período vedado.',
    href: 'https://www.gov.br/transferegov/pt-br/comunicados/comunicados-gerais/2026/comunicado-no-21-2026-orientacoes-para-gestao-das-transferencias-durante-o-periodo-de-defeso-eleitoral-e-suspensao-da-emissao-automatica-da-autorizacao-de-inicio-de-obras-aio',
  },
  {
    id: 'tse-defeso', group: 'eleitoral', date: '04/07/2026',
    title: 'Defeso eleitoral impõe limites a agentes públicos',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'Síntese oficial das vedações do art. 73 da Lei nº 9.504/1997, incluindo transferências voluntárias e suas exceções.',
    href: 'https://www.tse.jus.br/comunicacao/noticias/2026/Julho/defeso-eleitoral-impoe-limites-a-agentes-publicos-a-tres-meses-das-eleicoes-2026-1',
  },
  {
    id: 'tse-lei-eleicoes', group: 'eleitoral', date: 'Lei vigente',
    title: 'Lei das Eleições — Lei nº 9.504/1997',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'Texto compilado da Lei das Eleições, incluindo os arts. 41-A e 73 e jurisprudência correlata.',
    href: 'https://www.tse.jus.br/legislacao/codigo-eleitoral/lei-das-eleicoes/lei-das-eleicoes-lei-nb0-9.504-de-30-de-setembro-de-1997/',
  },
  {
    id: 'tse-lc64', group: 'eleitoral', date: 'Lei vigente',
    title: 'Lei de Inelegibilidade — LC nº 64/1990',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'Base normativa da AIJE e do exame de abuso de poder econômico, político ou de autoridade.',
    href: 'https://www.tse.jus.br/legislacao/codigo-eleitoral/lei-de-inelegibilidade/lei-de-inelegibilidade-lei-complementar-nb0-64-de-18-de-maio-de-1990',
  },
  {
    id: 'tse-abuso-2026', group: 'eleitoral', date: '15/07/2026',
    title: 'Diferenças entre abuso de autoridade, poder econômico e poder político',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'Conceitos oficiais que ajudam a separar desvio funcional, uso excessivo de recursos e uso eleitoral da posição pública.',
    href: 'https://www.tse.jus.br/comunicacao/noticias/2026/Julho/saiba-as-diferencas-entre-abuso-de-autoridade-abuso-de-poder-economico-e-abuso-de-poder-politico',
  },
  {
    id: 'tse-ilicitos-2026', group: 'eleitoral', date: '2026',
    title: 'Ilícitos eleitorais e condutas proibidas em 2026',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'Explica captação ilícita de sufrágio, condutas vedadas e outros ilícitos. A compra de votos exige finalidade eleitoral; o benefício pode envolver dinheiro, produtos, serviços, emprego ou função pública.',
    href: 'https://www.tse.jus.br/comunicacao/noticias/2026/Julho/por-dentro-das-eleicoes-conheca-os-ilicitos-eleitorais-e-as-condutas-proibidas-no-pleito-de-2026',
  },
  {
    id: 'tse-juris-abuso', group: 'eleitoral', date: 'Atualizado em 15/09/2026',
    title: 'Jurisprudência selecionada — abuso de poder político e econômico',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'O TSE registra que contratos, obras e incremento de despesa pública não demonstram abuso por si; exige-se prova robusta da gravidade e do nexo de benefício eleitoral.',
    href: 'https://temasselecionados.tse.jus.br/temas-selecionados/inelegibilidades-e-condicoes-de-elegibilidade/parte-i-inelegibilidades-e-condicoes-de-elegibilidade/abuso-de-poder-e-uso-indevido-de-meios-de-comunicacao-social/caracterizacao/abuso-do-poder-politico-e-economico',
  },
  {
    id: 'tse-resultado-ba', group: 'eleitoral', date: '05/10/2026',
    title: 'Resultado do 1º turno para o Governo da Bahia',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'O TSE informou a reeleição de Jerônimo Rodrigues no primeiro turno, com 55,80% dos votos válidos. O dado é apenas contexto processual e não integra, por si, qualquer inferência probatória.',
    href: 'https://www.tse.jus.br/comunicacao/noticias/2026',
  },
  {
    id: 'tse-calendario', group: 'eleitoral', date: '2026',
    title: 'Calendário Eleitoral 2026',
    organization: 'Tribunal Superior Eleitoral',
    summary: 'O calendário estabelece 18 de dezembro de 2026 como último dia para a diplomação. Prazos jurídicos concretos devem ser avaliados por profissional habilitado conforme a medida cabível.',
    href: 'https://www.tse.jus.br/eleicoes/calendario-eleitoral/calendario-eleitoral',
  },
  {
    id: 'tse-contas', group: 'dados', date: '2026',
    title: 'Prestação de Contas Eleitorais — 2026',
    organization: 'Portal de Dados Abertos do TSE',
    summary: 'Disponibiliza prestação de contas de candidatos e partidos, CNPJ de campanha, extratos bancários e documentos fiscais de receita e despesa.',
    href: 'https://dadosabertos.tse.jus.br/en/dataset/prestacao-de-contas-eleitorais-2026',
  },
  {
    id: 'transparencia-ba', group: 'dados', date: 'Atual',
    title: 'Transparência Bahia',
    organization: 'Governo do Estado da Bahia',
    summary: 'Fonte para execução da despesa. O próprio portal diferencia valor empenhado, liquidado e pago e orienta sobre denúncias concretas.',
    href: 'https://www.transparencia.ba.gov.br/Faq/',
  },
  {
    id: 'pre-ba', group: 'institucional', date: '2025–2027',
    title: 'Procuradoria Regional Eleitoral na Bahia',
    organization: 'Ministério Público Federal',
    summary: 'A PRE-BA atua perante o TRE-BA nas eleições federais e estaduais e dirige as atividades eleitorais do Ministério Público no estado.',
    href: 'https://www.mpf.mp.br/atuacao/eleitoral/pre-ba/institucional/a-pre-na-bahia',
  },
  {
    id: 'mpf-denuncia', group: 'institucional', date: '08/06/2026',
    title: 'Onde o cidadão pode denunciar irregularidades eleitorais',
    organization: 'Ministério Público Federal',
    summary: 'O MPF informa que qualquer cidadão pode encaminhar notícia de irregularidade eleitoral pelo MPF Serviços ou presencialmente em Sala de Atendimento ao Cidadão.',
    href: 'https://www.mpf.mp.br/o-mpf/unidades/procuradoria-geral-da-republica-pgr/noticias/me-explica-mpf-onde-o-cidadao-pode-denunciar-irregularidades-eleitorais',
  },
];

export const evidenceLevels = [
  ['L0', 'Relato não verificado', 'Narrativa recebida sem corroboração independente. Não deve gerar publicação acusatória.'],
  ['L1', 'Relato + material', 'Há arquivo ou documento anexado, mas autenticidade, contexto ou integridade ainda precisam ser confirmados.'],
  ['L2', 'Corroborado', 'Uma ou mais fontes públicas independentes sustentam elementos relevantes do relato.'],
  ['L3', 'Fonte primária', 'Documento oficial/primário e cadeia documental coerente sustentam o fato objetivo.'],
  ['L4', 'Convergência robusta', 'Múltiplas fontes primárias, execução material e relações relevantes convergem de forma auditável.'],
];

export const matrixFields = [
  'Município', 'instrumento/convênio', 'concedente e fonte do recurso', 'processo', 'valor previsto',
  'empenhado', 'liquidado', 'pago', 'data efetiva da transferência', 'objeto', 'licitação', 'contrato',
  'fornecedor', 'quadro societário', 'aditivos', 'ordem de serviço', 'cronograma físico-financeiro',
  'medições', 'execução física', 'fundamento de eventual exceção eleitoral', 'relações eleitorais documentadas',
  'nível de evidência', 'fontes oficiais', 'anexos e hashes',
];

export const redFlags = [
  'Transferência ou desbloqueio dentro do defeso sem documentação pública suficiente para demonstrar a exceção invocada.',
  'Ordem de serviço, medição ou execução física incompatível com a cronologia do pagamento.',
  'Preço unitário, aditivos ou quantitativos materialmente divergentes de referências verificáveis.',
  'Fornecedor recém-criado, com capacidade operacional incompatível ou concentração incomum de contratos relacionados.',
  'Contratações repetidas por dispensa/inexigibilidade ou fracionamento que mereçam verificação documental.',
  'Concentração temporal de liberações imediatamente antes do período vedado.',
  'Relação documental entre fornecedores públicos, prestadores de campanha, doadores, apoiadores ou agentes políticos.',
  'Distribuição individualizada de dinheiro, bens, serviços, emprego ou vantagem com elementos que indiquem finalidade eleitoral.',
];
