import { createHash, timingSafeEqual } from 'node:crypto';
import { centralEvidenceAsIntelligence } from '@/lib/central-evidence';
import { get, list, put, type ListBlobResultBlob } from '@vercel/blob';
import { bootstrapIntelligenceRecords } from '@/lib/intelligence-bootstrap';
import { defesoIntelligenceRecords } from '@/lib/defeso-intelligence';
import { intelligenceBatch20261006, supersededHousingRecordIds } from '@/lib/intelligence-batch-2026-10-06';

export type IntelligenceKind =
  | 'complaint'
  | 'public_source'
  | 'research_finding'
  | 'financial_record'
  | 'electoral_account'
  | 'entity'
  | 'relationship'
  | 'municipal_fact'
  | 'legal_reference';

export type IntelligenceStatus =
  | 'ingested'
  | 'triage'
  | 'corroborating'
  | 'verified'
  | 'insufficient'
  | 'rejected'
  | 'publishable'
  | 'referred';

export type EvidenceLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type IntelligenceWorkflowState = 'new' | 'analyzing' | 'corroborated' | 'discarded' | 'promoted';
export type IntelligenceClassification =
  | 'unclassified'
  | 'documented_fact'
  | 'apparent_incompatibility'
  | 'document_gap'
  | 'lawful_explanation'
  | 'investigative_hypothesis';

export type IntelligenceReviewEvent = {
  schemaVersion: 1;
  eventId: string;
  recordId: string;
  createdAt: string;
  actor: 'private-dashboard-session';
  workflowState: IntelligenceWorkflowState;
  classification: IntelligenceClassification;
  status: IntelligenceStatus;
  evidenceLevel: EvidenceLevel;
  priority: Priority;
  municipality?: string;
  caseId?: string;
  note?: string;
};

export type IntelligenceReviewSummary = {
  workflowState: IntelligenceWorkflowState;
  classification: IntelligenceClassification;
  reviewedAt: string;
  reviewCount: number;
  actor: IntelligenceReviewEvent['actor'];
  linkedCaseId?: string;
  note?: string;
};

export type IntelligenceEntity = {
  name: string;
  type: 'person' | 'company' | 'public_body' | 'campaign' | 'municipality' | 'supplier' | 'other';
  identifier?: string;
  role?: string;
};

export type IntelligenceRelation = {
  from: string;
  to: string;
  type: string;
  description?: string;
};

export type IntelligenceFinancial = {
  currency?: string;
  announced?: number;
  committed?: number;
  liquidated?: number;
  paid?: number;
  contractValue?: number;
  amendmentValue?: number;
};

export type IntelligenceProvenance = {
  sourceUrl?: string;
  sourceTitle?: string;
  publisher?: string;
  sourceDate?: string;
  retrievedAt?: string;
  externalId?: string;
  checksum?: string;
  collector?: string;
  method?: 'manual' | 'web_research' | 'api' | 'import' | 'public_submission' | 'derived_analysis';
};

export type IntelligenceRecord = {
  schemaVersion: 1;
  recordId: string;
  kind: IntelligenceKind;
  status: IntelligenceStatus;
  title: string;
  summary: string;
  content?: string;
  municipality?: string;
  state?: string;
  eventDate?: string;
  collectedAt: string;
  sourceIds?: string[];
  caseIds?: string[];
  tags?: string[];
  evidenceLevel: EvidenceLevel;
  analyticalConfidence?: number;
  priority: Priority;
  entities?: IntelligenceEntity[];
  relations?: IntelligenceRelation[];
  financial?: IntelligenceFinancial;
  provenance: IntelligenceProvenance;
  notes?: string[];
  raw?: Record<string, unknown>;
  recordOrigin?: 'bootstrap' | 'defeso' | 'batch' | 'ledger' | 'ingested';
  review?: IntelligenceReviewSummary;
  reviewHistory?: IntelligenceReviewEvent[];
};

export type ResearchSource = {
  id: string;
  name: string;
  organization: string;
  category: 'transfers' | 'contracts' | 'expenses' | 'elections' | 'works' | 'legal' | 'institutional';
  url: string;
  access: 'api' | 'csv' | 'portal' | 'dataset';
  capabilities: string[];
  scope: string;
};

export const researchSourceRegistry: ResearchSource[] = [
  {
    id: 'transferegov-api',
    name: 'APIs de Dados Abertos do Transferegov.br',
    organization: 'Ministério da Gestão e da Inovação',
    category: 'transfers',
    url: 'https://api-publica.transferegov.gestao.gov.br/',
    access: 'api',
    capabilities: ['transferências especiais', 'gestão de parcerias', 'fundo a fundo', 'TED', 'filtros por localidade e período'],
    scope: 'Federal',
  },
  {
    id: 'pncp-api',
    name: 'API PNCP Consulta',
    organization: 'Portal Nacional de Contratações Públicas',
    category: 'contracts',
    url: 'https://pncp.gov.br/api/consulta/swagger-ui/index.html',
    access: 'api',
    capabilities: ['contratações', 'contratos/empenhos', 'atas', 'instrumentos de cobrança', 'PCA'],
    scope: 'Nacional',
  },
  {
    id: 'obrasgov-api',
    name: 'API Pública Obrasgov.br',
    organization: 'Governo Federal',
    category: 'works',
    url: 'https://api-publica.obrasgov.gestao.gov.br',
    access: 'api',
    capabilities: ['obras públicas', 'execução física', 'localização e situação de obras'],
    scope: 'Federal',
  },
  {
    id: 'tse-contas-2026',
    name: 'Prestação de Contas Eleitorais 2026',
    organization: 'Tribunal Superior Eleitoral',
    category: 'elections',
    url: 'https://dadosabertos.tse.jus.br/dataset/prestacao-de-contas-eleitorais-2026',
    access: 'dataset',
    capabilities: ['CNPJ de campanha', 'receitas', 'despesas', 'extratos bancários', 'documentos fiscais'],
    scope: 'Eleições 2026',
  },
  {
    id: 'tce-ba-dados-abertos',
    name: 'Dados Abertos TCE-BA',
    organization: 'Tribunal de Contas do Estado da Bahia',
    category: 'expenses',
    url: 'https://www.tce.ba.gov.br/dados-abertos',
    access: 'portal',
    capabilities: ['despesas', 'procedimentos licitatórios', 'contratos', 'repasses e transferências'],
    scope: 'Estado da Bahia',
  },
  {
    id: 'tce-ba-despesas',
    name: 'Execução da Despesa Pública',
    organization: 'Tribunal de Contas do Estado da Bahia',
    category: 'expenses',
    url: 'https://www.tce.ba.gov.br/dados-abertos/despesas',
    access: 'csv',
    capabilities: ['credor', 'CNPJ/CPF', 'empenho', 'pagamento', 'liquidação', 'valor pago', 'unidade gestora'],
    scope: 'Estado da Bahia',
  },
  {
    id: 'tce-ba-contratos',
    name: 'Contratos Administrativos',
    organization: 'Tribunal de Contas do Estado da Bahia',
    category: 'contracts',
    url: 'https://www.tce.ba.gov.br/dados-abertos/contratos',
    access: 'csv',
    capabilities: ['contrato', 'processo', 'licitação', 'CPF/CNPJ contratado', 'objeto', 'valor atual', 'aditivos'],
    scope: 'Estado da Bahia',
  },
  {
    id: 'transparencia-ba',
    name: 'Transparência Bahia',
    organization: 'Governo do Estado da Bahia',
    category: 'expenses',
    url: 'https://www.transparencia.ba.gov.br/',
    access: 'portal',
    capabilities: ['execução da despesa', 'pagamentos', 'credores', 'contratos', 'históricos'],
    scope: 'Estado da Bahia',
  },
  {
    id: 'dados-abertos-ba',
    name: 'Portal de Dados Abertos do Estado da Bahia',
    organization: 'Governo do Estado da Bahia',
    category: 'expenses',
    url: 'https://dados.ba.gov.br/',
    access: 'dataset',
    capabilities: ['Fiplan', 'pagamentos', 'convênios e parcerias', 'emendas', 'obras', 'catálogo CKAN'],
    scope: 'Estado da Bahia',
  },
  {
    id: 'doe-ba',
    name: 'Diário Oficial do Estado da Bahia',
    organization: 'Empresa Gráfica da Bahia / Governo da Bahia',
    category: 'institutional',
    url: 'https://www.doe.ba.gov.br/',
    access: 'portal',
    capabilities: ['convênios', 'contratos', 'licitações', 'ordens de serviço', 'atos oficiais', 'extratos'],
    scope: 'Estado da Bahia',
  },
  {
    id: 'ibge-localidades-ba',
    name: 'IBGE Localidades — Municípios da Bahia',
    organization: 'IBGE',
    category: 'institutional',
    url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios',
    access: 'api',
    capabilities: ['código IBGE', 'município', 'UF', 'normalização territorial'],
    scope: '417 municípios da Bahia',
  },
  {
    id: 'rfb-cnpj',
    name: 'Dados Abertos do CNPJ',
    organization: 'Receita Federal do Brasil',
    category: 'institutional',
    url: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/dados-abertos/cadastros',
    access: 'dataset',
    capabilities: ['CNPJ', 'razão social', 'situação cadastral', 'CNAE', 'capital social', 'QSA conforme base aberta'],
    scope: 'Nacional',
  },
];

function apiHash() {
  const value = process.env.INTELLIGENCE_API_KEY_HASH;
  if (!value || !/^[a-f0-9]{64}$/i.test(value)) throw new Error('INTELLIGENCE_API_KEY_HASH não configurado.');
  return value.toLowerCase();
}

export function verifyIntelligenceApiKey(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const header = request.headers.get('x-intelligence-key') || '';
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : header.trim();
  if (!token || token.length < 20 || token.length > 256) return false;
  const received = createHash('sha256').update(token, 'utf8').digest('hex');
  const left = Buffer.from(received, 'hex');
  const right = Buffer.from(apiHash(), 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

const allowedKinds = new Set<IntelligenceKind>([
  'complaint','public_source','research_finding','financial_record','electoral_account',
  'entity','relationship','municipal_fact','legal_reference',
]);
const allowedStatuses = new Set<IntelligenceStatus>([
  'ingested','triage','corroborating','verified','insufficient','rejected','publishable','referred',
]);
const allowedLevels = new Set<EvidenceLevel>(['L0','L1','L2','L3','L4']);
const allowedPriorities = new Set<Priority>(['low','medium','high','urgent']);
const allowedWorkflowStates = new Set<IntelligenceWorkflowState>(['new','analyzing','corroborated','discarded','promoted']);
const allowedClassifications = new Set<IntelligenceClassification>(['unclassified','documented_fact','apparent_incompatibility','document_gap','lawful_explanation','investigative_hypothesis']);

function txt(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
function num(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function stringList(value: unknown, maxItems = 30, maxLen = 300) {
  return Array.isArray(value)
    ? value.slice(0, maxItems).map((item) => txt(item, maxLen)).filter(Boolean)
    : [];
}
function validDate(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value);
}
function slugDate(date = new Date()) {
  return date.toISOString().slice(0, 10).replace(/-/g, '/');
}
function recordId() {
  return `INT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
}

export function normalizeIntelligenceRecord(input: Record<string, unknown>): IntelligenceRecord {
  const kind = txt(input.kind, 60) as IntelligenceKind;
  if (!allowedKinds.has(kind)) throw new Error('kind inválido.');

  const title = txt(input.title, 320);
  const summary = txt(input.summary, 4000);
  if (!title || !summary) throw new Error('title e summary são obrigatórios.');

  const statusRaw = txt(input.status, 60) as IntelligenceStatus;
  const status = allowedStatuses.has(statusRaw) ? statusRaw : 'ingested';
  const levelRaw = txt(input.evidenceLevel, 10) as EvidenceLevel;
  const evidenceLevel = allowedLevels.has(levelRaw) ? levelRaw : 'L0';
  const priorityRaw = txt(input.priority, 20) as Priority;
  const priority = allowedPriorities.has(priorityRaw) ? priorityRaw : 'medium';
  const eventDate = txt(input.eventDate, 40);
  if (!validDate(eventDate)) throw new Error('eventDate inválido.');

  const entities: IntelligenceEntity[] = Array.isArray(input.entities)
    ? input.entities.slice(0, 50).map((raw) => {
        const item = raw as Record<string, unknown>;
        return {
          name: txt(item.name, 300),
          type: (txt(item.type, 40) || 'other') as IntelligenceEntity['type'],
          identifier: txt(item.identifier, 120) || undefined,
          role: txt(item.role, 180) || undefined,
        };
      }).filter((item) => item.name)
    : [];

  const relations: IntelligenceRelation[] = Array.isArray(input.relations)
    ? input.relations.slice(0, 100).map((raw) => {
        const item = raw as Record<string, unknown>;
        return {
          from: txt(item.from, 300),
          to: txt(item.to, 300),
          type: txt(item.type, 120),
          description: txt(item.description, 600) || undefined,
        };
      }).filter((item) => item.from && item.to && item.type)
    : [];

  const financialInput = (input.financial && typeof input.financial === 'object')
    ? input.financial as Record<string, unknown>
    : {};
  const provenanceInput = (input.provenance && typeof input.provenance === 'object')
    ? input.provenance as Record<string, unknown>
    : {};

  const confidence = num(input.analyticalConfidence);
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    recordId: recordId(),
    kind,
    status,
    title,
    summary,
    content: txt(input.content, 30000) || undefined,
    municipality: txt(input.municipality, 160) || undefined,
    state: txt(input.state, 80) || 'BA',
    eventDate: eventDate || undefined,
    collectedAt: now,
    sourceIds: stringList(input.sourceIds, 30, 120),
    caseIds: stringList(input.caseIds, 30, 120),
    tags: stringList(input.tags, 50, 100),
    evidenceLevel,
    analyticalConfidence: confidence === undefined ? undefined : Math.max(0, Math.min(1, confidence)),
    priority,
    entities,
    relations,
    financial: {
      currency: txt(financialInput.currency, 10) || 'BRL',
      announced: num(financialInput.announced),
      committed: num(financialInput.committed),
      liquidated: num(financialInput.liquidated),
      paid: num(financialInput.paid),
      contractValue: num(financialInput.contractValue),
      amendmentValue: num(financialInput.amendmentValue),
    },
    provenance: {
      sourceUrl: txt(provenanceInput.sourceUrl, 2000) || undefined,
      sourceTitle: txt(provenanceInput.sourceTitle, 500) || undefined,
      publisher: txt(provenanceInput.publisher, 300) || undefined,
      sourceDate: txt(provenanceInput.sourceDate, 40) || undefined,
      retrievedAt: txt(provenanceInput.retrievedAt, 60) || now,
      externalId: txt(provenanceInput.externalId, 300) || undefined,
      checksum: txt(provenanceInput.checksum, 200) || undefined,
      collector: txt(provenanceInput.collector, 240) || 'intel-api',
      method: (txt(provenanceInput.method, 40) || 'api') as IntelligenceProvenance['method'],
    },
    notes: stringList(input.notes, 50, 1200),
    raw: input.raw && typeof input.raw === 'object' && !Array.isArray(input.raw)
      ? input.raw as Record<string, unknown>
      : undefined,
  };
}

export async function persistIntelligenceRecord(record: IntelligenceRecord) {
  const pathname = `intelligence/records/${slugDate()}/${record.kind}/${record.recordId}.json`;
  await put(pathname, JSON.stringify(record, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: false,
  });
  return pathname;
}

function workflowStatus(state: IntelligenceWorkflowState): IntelligenceStatus {
  if (state === 'new') return 'ingested';
  if (state === 'analyzing') return 'triage';
  if (state === 'corroborated') return 'verified';
  if (state === 'discarded') return 'rejected';
  return 'publishable';
}

export async function persistIntelligenceReview(input: {
  recordId: string;
  workflowState: IntelligenceWorkflowState;
  classification: IntelligenceClassification;
  evidenceLevel: EvidenceLevel;
  priority: Priority;
  municipality?: string;
  caseId?: string;
  note?: string;
}) {
  const recordIdValue = txt(input.recordId, 120);
  if (!/^[A-Z0-9][A-Z0-9._-]{2,119}$/i.test(recordIdValue)) throw new Error('recordId inválido.');
  if (!allowedWorkflowStates.has(input.workflowState)) throw new Error('workflowState inválido.');
  if (!allowedClassifications.has(input.classification)) throw new Error('classification inválida.');
  if (!allowedLevels.has(input.evidenceLevel)) throw new Error('evidenceLevel inválido.');
  if (!allowedPriorities.has(input.priority)) throw new Error('priority inválida.');

  const createdAt = new Date().toISOString();
  const event: IntelligenceReviewEvent = {
    schemaVersion: 1,
    eventId: `REV-${createdAt.slice(0,10).replace(/-/g,'')}-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
    recordId: recordIdValue,
    createdAt,
    actor: 'private-dashboard-session',
    workflowState: input.workflowState,
    classification: input.classification,
    status: workflowStatus(input.workflowState),
    evidenceLevel: input.evidenceLevel,
    priority: input.priority,
    municipality: txt(input.municipality, 160) || undefined,
    caseId: txt(input.caseId, 120) || undefined,
    note: txt(input.note, 2000) || undefined,
  };

  const pathname = `intelligence/reviews/${recordIdValue}/${createdAt.replace(/[:.]/g,'-')}-${event.eventId}.json`;
  await put(pathname, JSON.stringify(event, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: false,
  });
  return { event, pathname };
}

async function listAll(prefix: string) {
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

export async function listIntelligenceRecords(): Promise<IntelligenceRecord[]> {
  const [blobs, reviewBlobs] = await Promise.all([
    listAll('intelligence/records/'),
    listAll('intelligence/reviews/'),
  ]);
  const records = await Promise.all(blobs.filter((blob) => blob.pathname.endsWith('.json')).map(async (blob) => {
    try {
      const result = await get(blob.pathname, { access: 'private', useCache: false });
      if (!result || result.statusCode !== 200) return null;
      return JSON.parse(await new Response(result.stream).text()) as IntelligenceRecord;
    } catch {
      return null;
    }
  }));
  const reviews = await Promise.all(reviewBlobs.filter((blob) => blob.pathname.endsWith('.json')).map(async (blob) => {
    try {
      const result = await get(blob.pathname, { access: 'private', useCache: false });
      if (!result || result.statusCode !== 200) return null;
      return JSON.parse(await new Response(result.stream).text()) as IntelligenceReviewEvent;
    } catch {
      return null;
    }
  }));

  const persisted = records.filter((item): item is IntelligenceRecord => Boolean(item?.recordId));
  const reviewEvents = reviews.filter((item): item is IntelligenceReviewEvent => Boolean(item?.recordId && item?.eventId));
  const reviewsByRecord = new Map<string, IntelligenceReviewEvent[]>();
  for (const event of reviewEvents) {
    const current = reviewsByRecord.get(event.recordId) || [];
    current.push(event);
    reviewsByRecord.set(event.recordId, current);
  }
  for (const events of reviewsByRecord.values()) events.sort((a,b) => a.createdAt.localeCompare(b.createdAt));

  const byId = new Map<string, IntelligenceRecord>();
  for (const item of bootstrapIntelligenceRecords) if (!supersededHousingRecordIds.has(item.recordId)) byId.set(item.recordId, { ...item, recordOrigin: 'bootstrap' });
  for (const item of defesoIntelligenceRecords) byId.set(item.recordId, { ...item, recordOrigin: 'defeso' });
  for (const item of intelligenceBatch20261006) byId.set(item.recordId, { ...item, recordOrigin: 'batch' });
  for (const item of centralEvidenceAsIntelligence()) byId.set(item.recordId, item);
  for (const item of persisted) byId.set(item.recordId, { ...item, recordOrigin: 'ingested' });

  const merged = Array.from(byId.values()).map((item) => {
    const history = reviewsByRecord.get(item.recordId) || [];
    const latest = history.at(-1);
    if (!latest) return item;
    const caseIds = latest.caseId
      ? Array.from(new Set([...(item.caseIds || []), latest.caseId]))
      : item.caseIds;
    return {
      ...item,
      status: latest.status,
      evidenceLevel: latest.evidenceLevel,
      priority: latest.priority,
      municipality: latest.municipality || item.municipality,
      caseIds,
      review: {
        workflowState: latest.workflowState,
        classification: latest.classification,
        reviewedAt: latest.createdAt,
        reviewCount: history.length,
        actor: latest.actor,
        linkedCaseId: latest.caseId,
        note: latest.note,
      },
      reviewHistory: history,
    } satisfies IntelligenceRecord;
  });
  return merged.sort((a,b) => b.collectedAt.localeCompare(a.collectedAt));
}

export const intelligenceSchemaExample = {
  kind: 'research_finding',
  title: 'Pagamento identificado em fonte pública',
  summary: 'Resumo objetivo do achado, sem inferir ilícito.',
  municipality: 'Irecê',
  eventDate: '2026-07-10',
  status: 'triage',
  evidenceLevel: 'L2',
  priority: 'high',
  analyticalConfidence: 0.82,
  caseIds: ['OE-BA-0002'],
  tags: ['pagamento', 'contrato', 'fornecedor'],
  entities: [
    { name: 'Município de exemplo', type: 'municipality', role: 'beneficiário' },
    { name: 'Fornecedor exemplo Ltda.', type: 'supplier', identifier: '00.000.000/0001-00', role: 'contratado' },
  ],
  financial: { currency: 'BRL', paid: 100000 },
  provenance: {
    sourceUrl: 'https://fonte-oficial.example/',
    sourceTitle: 'Documento oficial',
    publisher: 'Órgão público',
    sourceDate: '2026-07-10',
    method: 'web_research',
    collector: 'Pesquisa Profunda',
  },
};
