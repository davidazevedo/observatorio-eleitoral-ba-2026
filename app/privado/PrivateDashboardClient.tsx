'use client';

import { useMemo, useState } from 'react';
import type { PublicCase } from '@/lib/cases';
import type { IntelligenceRecord } from '@/lib/intelligence';
import type { PrivateSubmission } from '@/lib/private-data';

type Ranking = { label: string; count: number };
type SourceRow = {
  id: string; name: string; organization: string; category: string; url: string;
  access: string; scope: string; capabilities: string[]; origin: string;
};
type EntityRow = { name: string; type: string; identifier?: string; mentions: number; roles: string[] };
type RelationRow = { from: string; to: string; type: string; description?: string };
type SourceArchiveRow = { sourceId:string; originalUrl:string; finalUrl:string; title?:string; publisher?:string; retrievedAt:string; httpStatus:number; contentType:string; size:number; sha256:string; etag?:string; lastModified?:string; rawBlobPath:string; manifestBlobPath:string; certificateSha256:string; certificateValid:boolean; notes?:string[] };
type HousingAuditRow = { municipality:string; paymentRecordId:string|null; paymentDate:string|null; paid:number; instrumentNumber:string|null; findingRecordId:string|null; findingTitle:string; evidenceLevel:string; priority:string; status:'corroborado'|'lacuna'|'triagem'; exceptionDocumented:boolean; exceptionStatus:'under_test'|'not_located'|'documented'; exceptionNote:string|null; instrumentPublishedAt:string|null; physicalExecutionStatus:'not_located'|'documented'; prefixedScheduleStatus:'not_located'|'documented'; procurementDate:string|null; procurementStatus:string|null; procurementControl:string|null; procurementValue:number|null; supplier:string|null; supplierCnpj:string|null; electoralCrossmatch:string; electoralCrossmatchNote:string|null; sourceUrl:string|null };
type CohortMunicipality = { rank:number; name:string; state:string; priority:string; selectionReasons:string[]; territoryIrece:boolean; defesoPaymentExposureBRL:number; centralEvidenceQualified:boolean; centralEvidenceType:string|null; jeronimo2026ValidVotePct:number|null; jeronimoVoteSource:string|null; investigationStatus:string; legalConclusion:string };
type CentralEvidenceItem = { id:string; municipality:string; title:string; type:string; status:string; amountBRL:number; sourceScope:string; evidenceReference?:string; caseGroup:string; legalConclusion:string; nextTest?:string[] };
type MunicipalityCohort69 = { schemaVersion:number; cohortId:string; createdAt:string; methodology:{statement:string;existingCasesExcluded:string[];rules:string[];statewideJeronimo2026ValidVotePct:number;territoryIreceOfficialMunicipalityCount:number;newMunicipalityCount:number;newDefesoPaymentMunicipalities:number;newIreceMunicipalities:number;highVoteSupplementMunicipalities:number;overlaps:{ireceAndDefesoPayment:string[]}}; evidenceGoal:{waveTargetCentralEvidence:number;priorCentralEvidence:number;additionalQualifiedFiplanMunicipalFacts:number;minimumCentralEvidenceAfterClassification:number;countingRule:string}; municipalities:CohortMunicipality[] };
type CentralEvidenceWave = { schemaVersion:number;manifestId:string;generatedAt:string;purpose:string;countingPolicy:string;counts:{total:number;housingCore:number;expansionFinancialFacts:number;expansionFinancialExposureBRL:number};legalBoundary:string;items:CentralEvidenceItem[] };
type P0TriageRow = { municipality:string; instrument:string; agency:string; category:string; object:string; published:string; payment:string; paidBRL:number; instrumentValueBRL:number; publishedBeforeCutoff:boolean; daysPublicationBeforeCutoff:number; daysPaymentAfterCutoff:number; priority:string; flag:string };
type P0Triage36 = { schemaVersion:number;batchId:string;generatedAt:string;cutoffDate:string;scope:{municipalities:number;instruments:number;defesoPaidBRL:number};methodology:{statement:string;legalTest:string[];boundary:string};summary:{instrumentsPublishedBeforeCutoff:number;instrumentsPublishedOnOrAfterCutoff:number;criticalMunicipalities:string[];urgentFocus:string[]};deepDiveFacts:Record<string,{status:string;assessment:string}>;instruments:P0TriageRow[] };

type GitPreservationRow = {
  schemaVersion:number; sourceId:string; sourceUrl:string; publisher:string; retrievedAt:string;
  repositoryCommit:string; repositoryUrl:string;
  transport:{scheme:string;certificateVerification:string;certificate:{subject:string;issuer:string;sha256Fingerprint:string;notBefore:string;notAfter:string}};
  http:{status:number;server:string;contentType:string;contentLength:number;contentDisposition:string;lastModified:string;etag:string;cacheControl:string};
  sourceArtifact:{filename:string;size:number;sha256:string;fullRawCopyPreservedInGit:boolean;reason:string};
  extraction:{parser:string;selection:string;sourceMembers:string[];result:{instruments:number;payments:number;municipalities:number;paidBRL:number};preservedExtracts:Array<{path:string;uncompressedSize:number;uncompressedSha256:string;gzipSize:number;gzipSha256:string;rows:number}>};
  interpretationBoundary:string;
};

type DashboardData = {
  generatedAt: string;
  metrics: {
    submissions: number; identified: number; anonymous: number; evidenceFiles: number; evidenceBytes: number;
    municipalities: number; categories: number; publicCases: number; intelligenceRecords: number;
    researchFindings: number; sourceInventory: number; entities: number; relationships: number; highPriority: number;
    withEvidence: number; withEventDate: number; missingReferencedEvidence: number; orphanEvidence: number;
    archivedSources: number; archivedSourceBytes: number; validSourceCertificates: number;
    housingCorroborated:number; housingGaps:number; versionedDatasets: number; versionedRows: number; versionedPaid: number;
  };
  rankings: {
    municipalities: Ranking[]; categories: Ranking[]; statuses: Ranking[]; verificationLevels: Ranking[];
    intelligenceKinds: Ranking[]; sourcePublishers: Ranking[]; dailySubmissions: Ranking[];
  };
  quality: {
    evidenceCoverage: number; eventDateCoverage: number; intelligenceWithSource: number; intelligenceWithMunicipality: number;
    missingReferencedEvidence: string[]; orphanEvidence: { pathname: string; size: number; uploadedAt: string }[];
  };
  financial: {
    announced: number; committed: number; liquidated: number; paid: number; contractValue: number; amendmentValue: number;
  };
  submissions: PrivateSubmission[];
  publicCases: PublicCase[];
  intelligence: IntelligenceRecord[];
  findings: IntelligenceRecord[];
  entities: EntityRow[];
  relationships: RelationRow[];
  queue: IntelligenceRecord[];
  sources: SourceRow[];
  sourceArchives: SourceArchiveRow[];
  gitPreservations: GitPreservationRow[];
  housingAudit: HousingAuditRow[];
  municipalityCohort69: MunicipalityCohort69;
  centralEvidenceWave01: CentralEvidenceWave;
  p0Triage36: P0Triage36;
};

type Tab = 'overview' | 'submissions' | 'findings' | 'sources' | 'provenance' | 'housing' | 'expansion' | 'entities' | 'relations' | 'municipalities' | 'reports' | 'api';

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}
function formatDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('pt-BR');
}
function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: value >= 1_000_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value || 0);
}
function levelClass(level: string) {
  return `intel-level intel-level-${level.toLowerCase()}`;
}
function priorityClass(priority: string) {
  return `intel-priority intel-priority-${priority}`;
}
function normalized(value: unknown) {
  return String(value ?? '').trim().toLocaleLowerCase('pt-BR');
}
function recordAmount(item: IntelligenceRecord) {
  return Math.max(
    item.financial?.paid || 0,
    item.financial?.liquidated || 0,
    item.financial?.committed || 0,
    item.financial?.contractValue || 0,
    item.financial?.announced || 0,
  );
}
function inDateRange(value: string | undefined, from: string, to: string) {
  if (!value) return !from && !to;
  const day=value.slice(0,10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}
function financialTotalsFor(records: IntelligenceRecord[]) {
  return records.reduce((acc,item)=>{
    acc.announced += item.financial?.announced || 0;
    if(item.kind==='financial_record'){
      acc.committed += item.financial?.committed || 0;
      acc.liquidated += item.financial?.liquidated || 0;
      acc.paid += item.financial?.paid || 0;
      acc.contractValue += item.financial?.contractValue || 0;
      acc.amendmentValue += item.financial?.amendmentValue || 0;
    }
    return acc;
  },{announced:0,committed:0,liquidated:0,paid:0,contractValue:0,amendmentValue:0});
}

export default function PrivateDashboardClient({ data }: { data: DashboardData }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('Todos');
  const [intelQuery, setIntelQuery] = useState('');
  const [intelKind, setIntelKind] = useState('Todos');
  const [sourceQuery, setSourceQuery] = useState('');
  const [archiveUrl,setArchiveUrl]=useState('');
  const [archiveSourceId,setArchiveSourceId]=useState('');
  const [archiveTitle,setArchiveTitle]=useState('');
  const [archivePublisher,setArchivePublisher]=useState('');
  const [archiveMessage,setArchiveMessage]=useState('');
  const [archiving,setArchiving]=useState(false);

  // Filtros analíticos transversais
  const [globalQuery,setGlobalQuery]=useState('');
  const [municipalityFilter,setMunicipalityFilter]=useState('Todos');
  const [dateFrom,setDateFrom]=useState('');
  const [dateTo,setDateTo]=useState('');
  const [evidenceFilter,setEvidenceFilter]=useState('Todos');
  const [priorityFilter,setPriorityFilter]=useState('Todos');
  const [statusFilter,setStatusFilter]=useState('Todos');
  const [publisherFilter,setPublisherFilter]=useState('Todos');
  const [paymentFilter,setPaymentFilter]=useState('Todos');
  const [minAmount,setMinAmount]=useState('');
  const [maxAmount,setMaxAmount]=useState('');
  const [sortBy,setSortBy]=useState('priority');
  const [filtersExpanded,setFiltersExpanded]=useState(true);
  const [submissionCategory,setSubmissionCategory]=useState('Todos');
  const [submissionEvidence,setSubmissionEvidence]=useState('Todos');
  const [sourceCategory,setSourceCategory]=useState('Todos');
  const [sourceAccess,setSourceAccess]=useState('Todos');
  const [entityQuery,setEntityQuery]=useState('');
  const [entityType,setEntityType]=useState('Todos');
  const [entityMentions,setEntityMentions]=useState('1');
  const [relationQuery,setRelationQuery]=useState('');
  const [relationType,setRelationType]=useState('Todos');
  const [archiveCertFilter,setArchiveCertFilter]=useState('Todos');
  const [archiveTypeFilter,setArchiveTypeFilter]=useState('Todos');
  const [housingDocumentFilter,setHousingDocumentFilter]=useState('Todos');
  const [housingProcurementStatus,setHousingProcurementStatus]=useState('Todos');
  const [housingSupplierFilter,setHousingSupplierFilter]=useState('Todos');
  const [housingTseFilter,setHousingTseFilter]=useState('Todos');

  const municipalityOptions=useMemo(()=>Array.from(new Set([
    ...data.intelligence.map((item)=>item.municipality||''),
    ...data.submissions.map((item)=>item.municipality||''),
  ].filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR')),[data.intelligence,data.submissions]);

  const publisherOptions=useMemo(()=>Array.from(new Set(data.intelligence.map((item)=>item.provenance?.publisher||'').filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR')),[data.intelligence]);
  const submissionCategoryOptions=useMemo(()=>Array.from(new Set(data.submissions.map((item)=>item.category).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR')),[data.submissions]);
  const sourceCategoryOptions=useMemo(()=>Array.from(new Set(data.sources.map((item)=>item.category).filter(Boolean))).sort(),[data.sources]);
  const sourceAccessOptions=useMemo(()=>Array.from(new Set(data.sources.map((item)=>item.access).filter(Boolean))).sort(),[data.sources]);
  const entityTypeOptions=useMemo(()=>Array.from(new Set(data.entities.map((item)=>item.type).filter(Boolean))).sort(),[data.entities]);
  const relationTypeOptions=useMemo(()=>Array.from(new Set(data.relationships.map((item)=>item.type).filter(Boolean))).sort(),[data.relationships]);
  const archiveTypeOptions=useMemo(()=>Array.from(new Set(data.sourceArchives.map((item)=>item.contentType.split(';')[0]).filter(Boolean))).sort(),[data.sourceArchives]);

  const filteredIntelligence=useMemo(()=>{
    const q=normalized(globalQuery);
    const min=minAmount ? Number(minAmount) : null;
    const max=maxAmount ? Number(maxAmount) : null;
    const rows=data.intelligence.filter((item)=>{
      if(municipalityFilter!=='Todos' && item.municipality!==municipalityFilter) return false;
      if(evidenceFilter!=='Todos' && item.evidenceLevel!==evidenceFilter) return false;
      if(priorityFilter!=='Todos' && item.priority!==priorityFilter) return false;
      if(statusFilter!=='Todos' && item.status!==statusFilter) return false;
      if(publisherFilter!=='Todos' && (item.provenance?.publisher||'')!==publisherFilter) return false;
      if(!inDateRange(item.eventDate||item.collectedAt,dateFrom,dateTo)) return false;
      const amount=recordAmount(item);
      if(paymentFilter==='Com pagamento' && (item.financial?.paid||0)<=0) return false;
      if(paymentFilter==='Sem pagamento' && (item.financial?.paid||0)>0) return false;
      if(min!==null && Number.isFinite(min) && amount<min) return false;
      if(max!==null && Number.isFinite(max) && amount>max) return false;
      if(q){
        const hay=[item.recordId,item.title,item.summary,item.content,item.municipality,item.provenance?.publisher,item.provenance?.externalId,...(item.tags||[]),...(item.caseIds||[]),...(item.entities||[]).flatMap((e)=>[e.name,e.identifier,e.role])].join(' ');
        if(!normalized(hay).includes(q)) return false;
      }
      return true;
    });
    return [...rows].sort((a,b)=>{
      if(sortBy==='date-desc') return (b.eventDate||b.collectedAt).localeCompare(a.eventDate||a.collectedAt);
      if(sortBy==='date-asc') return (a.eventDate||a.collectedAt).localeCompare(b.eventDate||b.collectedAt);
      if(sortBy==='amount-desc') return recordAmount(b)-recordAmount(a);
      if(sortBy==='amount-asc') return recordAmount(a)-recordAmount(b);
      if(sortBy==='municipality') return (a.municipality||'').localeCompare(b.municipality||'','pt-BR');
      const weight=(p:string)=>p==='urgent'?4:p==='high'?3:p==='medium'?2:1;
      return weight(b.priority)-weight(a.priority) || (b.eventDate||b.collectedAt).localeCompare(a.eventDate||a.collectedAt);
    });
  },[data.intelligence,globalQuery,municipalityFilter,dateFrom,dateTo,evidenceFilter,priorityFilter,statusFilter,publisherFilter,paymentFilter,minAmount,maxAmount,sortBy]);

  const visibleSubmissions = useMemo(() => {
    const local=normalized(query);
    const global=normalized(globalQuery);
    return data.submissions.filter((item) => {
      if (mode !== 'Todos' && item.mode !== mode) return false;
      if (submissionCategory!=='Todos' && item.category!==submissionCategory) return false;
      if (submissionEvidence==='Com evidência' && (item.evidence||[]).length===0) return false;
      if (submissionEvidence==='Sem evidência' && (item.evidence||[]).length>0) return false;
      if (municipalityFilter!=='Todos' && item.municipality!==municipalityFilter) return false;
      if (!inDateRange(item.eventDate||item.createdAt,dateFrom,dateTo)) return false;
      const hay=[item.protocol,item.municipality,item.locality,item.category,item.peopleOrEntities,item.statement,item.sourceContext,item.contact?.name,item.contact?.email].join(' ');
      if(local && !normalized(hay).includes(local)) return false;
      if(global && !normalized(hay).includes(global)) return false;
      return true;
    });
  }, [data.submissions, query, mode,submissionCategory,submissionEvidence,globalQuery,municipalityFilter,dateFrom,dateTo]);

  const visibleIntel = useMemo(() => {
    const local=normalized(intelQuery);
    return filteredIntelligence.filter((item)=>{
      if(intelKind!=='Todos' && item.kind!==intelKind) return false;
      if(!local) return true;
      return normalized([item.recordId,item.title,item.summary,item.content,item.municipality,item.provenance?.publisher,...(item.tags||[]),...(item.entities||[]).map((e)=>e.name)].join(' ')).includes(local);
    });
  }, [filteredIntelligence,intelQuery,intelKind]);

  const visibleSources = useMemo(() => {
    const q=normalized([sourceQuery,globalQuery].filter(Boolean).join(' '));
    return data.sources.filter((item)=>{
      if(sourceCategory!=='Todos' && item.category!==sourceCategory) return false;
      if(sourceAccess!=='Todos' && item.access!==sourceAccess) return false;
      if(publisherFilter!=='Todos' && item.organization!==publisherFilter) return false;
      if(!q) return true;
      return normalized([item.name,item.organization,item.category,item.scope,...(item.capabilities||[])]).includes(q);
    });
  }, [data.sources,sourceQuery,globalQuery,publisherFilter,sourceCategory,sourceAccess]);

  const visibleHousing=useMemo(()=>data.housingAudit.filter((item)=>{
    if(municipalityFilter!=='Todos' && item.municipality!==municipalityFilter) return false;
    if(evidenceFilter!=='Todos' && item.evidenceLevel!==evidenceFilter) return false;
    if(priorityFilter!=='Todos' && item.priority!==priorityFilter) return false;
    if(statusFilter!=='Todos' && item.status!==statusFilter) return false;
    if(!inDateRange(item.paymentDate||undefined,dateFrom,dateTo)) return false;
    if(paymentFilter==='Com pagamento' && item.paid<=0) return false;
    if(paymentFilter==='Sem pagamento' && item.paid>0) return false;
    const min=minAmount?Number(minAmount):null,max=maxAmount?Number(maxAmount):null;
    if(min!==null && Number.isFinite(min) && item.paid<min) return false;
    if(max!==null && Number.isFinite(max) && item.paid>max) return false;
    if(housingDocumentFilter==='Contratação localizada' && item.status!=='corroborado') return false;
    if(housingDocumentFilter==='Lacuna' && item.status!=='lacuna') return false;
    if(housingProcurementStatus!=='Todos' && item.procurementStatus!==housingProcurementStatus) return false;
    if(housingSupplierFilter==='Com fornecedor' && !item.supplier) return false;
    if(housingSupplierFilter==='Sem fornecedor' && item.supplier) return false;
    if(housingTseFilter==='Sem match exato' && item.electoralCrossmatch!=='no_exact_match') return false;
    if(housingTseFilter==='Não aplicável ainda' && item.electoralCrossmatch!=='not_applicable_no_supplier') return false;
    if(housingTseFilter==='Não executado' && item.electoralCrossmatch!=='not_run') return false;
    const q=normalized(globalQuery);
    return !q || normalized([item.municipality,item.findingTitle,item.instrumentNumber,item.procurementControl,item.procurementStatus,item.supplier,item.supplierCnpj,item.electoralCrossmatch,item.status,item.evidenceLevel,item.priority]).includes(q);
  }),[data.housingAudit,municipalityFilter,evidenceFilter,priorityFilter,statusFilter,dateFrom,dateTo,paymentFilter,minAmount,maxAmount,globalQuery,housingDocumentFilter,housingProcurementStatus,housingSupplierFilter,housingTseFilter]);

  const filteredEntities=useMemo(()=>{
    const map=new Map<string,EntityRow & {roles:string[]}>();
    for(const record of filteredIntelligence){
      for(const entity of record.entities||[]){
        const key=`${entity.type}:${entity.identifier||normalized(entity.name)}`;
        const current=map.get(key)||{name:entity.name,type:entity.type,identifier:entity.identifier,mentions:0,roles:[]};
        current.mentions+=1;
        if(entity.role && !current.roles.includes(entity.role)) current.roles.push(entity.role);
        map.set(key,current);
      }
    }
    return Array.from(map.values()).sort((a,b)=>b.mentions-a.mentions||a.name.localeCompare(b.name,'pt-BR'));
  },[filteredIntelligence]);

  const visibleEntities=useMemo(()=>{
    const q=normalized(entityQuery);
    const min=Math.max(1,Number(entityMentions)||1);
    return filteredEntities.filter((item)=>{
      if(entityType!=='Todos' && item.type!==entityType) return false;
      if(item.mentions<min) return false;
      if(q && !normalized([item.name,item.identifier,item.type,...item.roles]).includes(q)) return false;
      return true;
    });
  },[filteredEntities,entityQuery,entityType,entityMentions]);

  const filteredRelations=useMemo(()=>filteredIntelligence.flatMap((item)=>item.relations||[]),[filteredIntelligence]);
  const visibleRelations=useMemo(()=>{
    const q=normalized(relationQuery);
    return filteredRelations.filter((item)=>{
      if(relationType!=='Todos' && item.type!==relationType) return false;
      if(q && !normalized([item.from,item.to,item.type,item.description]).includes(q)) return false;
      return true;
    });
  },[filteredRelations,relationQuery,relationType]);

  const visibleSourceArchives=useMemo(()=>data.sourceArchives.filter((item)=>{
    if(archiveCertFilter==='Íntegro' && !item.certificateValid) return false;
    if(archiveCertFilter==='Revisar' && item.certificateValid) return false;
    if(archiveTypeFilter!=='Todos' && !item.contentType.toLowerCase().includes(archiveTypeFilter.toLowerCase())) return false;
    const q=normalized(globalQuery);
    return !q || normalized([item.title,item.publisher,item.sourceId,item.originalUrl,item.sha256,item.contentType]).includes(q);
  }),[data.sourceArchives,archiveCertFilter,archiveTypeFilter,globalQuery]);

  const filteredMunicipalities=useMemo(()=>{
    const counts=new Map<string,number>();
    for(const item of filteredIntelligence) if(item.municipality) counts.set(item.municipality,(counts.get(item.municipality)||0)+1);
    for(const item of visibleSubmissions) if(item.municipality) counts.set(item.municipality,(counts.get(item.municipality)||0)+1);
    return Array.from(counts.entries()).map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label,'pt-BR'));
  },[filteredIntelligence,visibleSubmissions]);

  const filteredFinance=useMemo(()=>financialTotalsFor(filteredIntelligence),[filteredIntelligence]);

  const filteredQueue=useMemo(()=>filteredIntelligence.filter((item)=>['ingested','triage','corroborating'].includes(item.status)).slice(0,50),[filteredIntelligence]);

  const activeFilterCount=[
    globalQuery, municipalityFilter!=='Todos'?municipalityFilter:'', dateFrom,dateTo,
    evidenceFilter!=='Todos'?evidenceFilter:'',priorityFilter!=='Todos'?priorityFilter:'',
    statusFilter!=='Todos'?statusFilter:'',publisherFilter!=='Todos'?publisherFilter:'',
    paymentFilter!=='Todos'?paymentFilter:'',minAmount,maxAmount,
  ].filter(Boolean).length;

  function clearAnalyticalFilters(){
    setGlobalQuery('');setMunicipalityFilter('Todos');setDateFrom('');setDateTo('');
    setEvidenceFilter('Todos');setPriorityFilter('Todos');setStatusFilter('Todos');
    setPublisherFilter('Todos');setPaymentFilter('Todos');setMinAmount('');setMaxAmount('');
    setSortBy('priority');
  }


  async function archiveSource() {
    if (!archiveUrl.trim()) return;
    setArchiving(true); setArchiveMessage('');
    try {
      const response=await fetch('/api/private/source-archive',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({url:archiveUrl,sourceId:archiveSourceId,title:archiveTitle,publisher:archivePublisher})});
      const payload=await response.json();
      if(!response.ok) throw new Error(payload?.error||'Falha ao arquivar.');
      setArchiveMessage(`Snapshot preservado: ${payload.record.sha256}`);
      window.setTimeout(()=>window.location.reload(),700);
    } catch (error) { setArchiveMessage(error instanceof Error?error.message:'Falha ao arquivar.'); }
    finally { setArchiving(false); }
  }

  async function logout() {
    await fetch('/api/private/logout', { method: 'POST' });
    window.location.href = '/privado/login';
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Visão geral' },
    { id: 'submissions', label: 'Denúncias', count: data.metrics.submissions },
    { id: 'findings', label: 'Inteligência', count: data.metrics.intelligenceRecords },
    { id: 'sources', label: 'Fontes', count: data.metrics.sourceInventory },
    { id: 'provenance', label: 'Proveniência', count: data.metrics.archivedSources + data.metrics.versionedDatasets },
    { id: 'housing', label: 'Matriz Habitação', count: data.housingAudit.length },
    { id: 'expansion', label: 'Coorte 69', count: data.municipalityCohort69.municipalities.length },
    { id: 'entities', label: 'Entidades', count: data.metrics.entities },
    { id: 'relations', label: 'Relações', count: data.metrics.relationships },
    { id: 'municipalities', label: 'Municípios', count: data.metrics.municipalities },
    { id: 'reports', label: 'Relatórios' },
    { id: 'api', label: 'Intel API' },
  ];

  return (
    <>
      <header className="private-topbar intel-topbar">
        <div>
          <span className="private-topbar-mark">OE</span>
          <div><strong>Cockpit de Inteligência</strong><small>Observatório Eleitoral Bahia 2026 · ambiente reservado</small></div>
        </div>
        <div className="private-topbar-actions">
          <a href="/api/private/export?format=csv">Denúncias CSV</a>
          <a href="/api/private/export?format=csv&scope=intelligence">Intel CSV</a>
          <a href="/api/private/export?format=json">Base completa JSON</a>
          <button type="button" onClick={logout}>Sair</button>
        </div>
      </header>

      <div className="intel-shell">
        <aside className="intel-sidebar">
          <div className="intel-sidebar-title"><span>COCKPIT</span><strong>Investigação</strong></div>
          <nav>
            {tabs.map((item) => (
              <button key={item.id} type="button" className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
                <span>{item.label}</span>{typeof item.count === 'number' ? <b>{item.count}</b> : null}
              </button>
            ))}
          </nav>
          <div className="intel-sidebar-note">
            <strong>Não público</strong>
            <span>Relatos, contatos, achados e relações ainda não corroboradas permanecem internos.</span>
          </div>
        </aside>

        <main className="private-dashboard intel-dashboard">
          <section className="private-dashboard-heading intel-heading">
            <div>
              <p className="eyebrow">INTELIGÊNCIA · PROVENIÊNCIA · CRUZAMENTOS</p>
              <h1>{tab === 'overview' ? 'Visão consolidada da investigação.' : tabs.find((item) => item.id === tab)?.label}</h1>
              <p>Atualizado em {formatDate(data.generatedAt)}. O cockpit diferencia denúncia, fonte, achado analítico, entidade, relação e caso público.</p>
            </div>
            <div className="private-security-note"><strong>ACESSO RESTRITO</strong><span>Não compartilhar dados pessoais, relações não corroboradas ou hipóteses internas.</span></div>
          </section>

          <section className="analytic-filter-shell">
            <div className="analytic-filter-head">
              <div><p className="eyebrow">FILTRO ANALÍTICO GLOBAL</p><strong>{filteredIntelligence.length} de {data.intelligence.length} registros Intel · {visibleSubmissions.length} denúncia(s)</strong></div>
              <div className="analytic-filter-actions">
                {activeFilterCount>0?<span>{activeFilterCount} filtro(s) ativo(s)</span>:<span>Universo completo</span>}
                <button type="button" onClick={()=>setFiltersExpanded((value)=>!value)}>{filtersExpanded?'Recolher':'Expandir'} filtros</button>
                {activeFilterCount>0?<button type="button" className="clear" onClick={clearAnalyticalFilters}>Limpar tudo</button>:null}
              </div>
            </div>
            {filtersExpanded?<>
              <div className="analytic-filter-grid primary">
                <label className="analytic-search"><span>Busca transversal</span><input value={globalQuery} onChange={(e)=>setGlobalQuery(e.target.value)} placeholder="Município, CNPJ, fornecedor, convênio, NOB, termo…" /></label>
                <label><span>Município</span><select value={municipalityFilter} onChange={(e)=>setMunicipalityFilter(e.target.value)}><option>Todos</option>{municipalityOptions.map((item)=><option key={item}>{item}</option>)}</select></label>
                <label><span>De</span><input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} /></label>
                <label><span>Até</span><input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} /></label>
              </div>
              <div className="analytic-filter-grid secondary">
                <label><span>Nível probatório</span><select value={evidenceFilter} onChange={(e)=>setEvidenceFilter(e.target.value)}><option>Todos</option>{['L0','L1','L2','L3','L4'].map((v)=><option key={v}>{v}</option>)}</select></label>
                <label><span>Prioridade</span><select value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value)}><option>Todos</option>{['urgent','high','medium','low'].map((v)=><option key={v}>{v}</option>)}</select></label>
                <label><span>Status</span><select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}><option>Todos</option>{['ingested','triage','corroborating','verified','insufficient','rejected','publishable','referred','corroborado','lacuna','triagem'].map((v)=><option key={v}>{v}</option>)}</select></label>
                <label><span>Órgão / publicador</span><select value={publisherFilter} onChange={(e)=>setPublisherFilter(e.target.value)}><option>Todos</option>{publisherOptions.map((v)=><option key={v}>{v}</option>)}</select></label>
                <label><span>Pagamento</span><select value={paymentFilter} onChange={(e)=>setPaymentFilter(e.target.value)}><option>Todos</option><option>Com pagamento</option><option>Sem pagamento</option></select></label>
                <label><span>Valor mínimo (R$)</span><input inputMode="decimal" value={minAmount} onChange={(e)=>setMinAmount(e.target.value.replace(/[^0-9.]/g,''))} placeholder="0" /></label>
                <label><span>Valor máximo (R$)</span><input inputMode="decimal" value={maxAmount} onChange={(e)=>setMaxAmount(e.target.value.replace(/[^0-9.]/g,''))} placeholder="sem limite" /></label>
                <label><span>Ordenar por</span><select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}><option value="priority">Prioridade</option><option value="date-desc">Data ↓</option><option value="date-asc">Data ↑</option><option value="amount-desc">Valor ↓</option><option value="amount-asc">Valor ↑</option><option value="municipality">Município A–Z</option></select></label>
              </div>
              {activeFilterCount>0?<div className="analytic-filter-chips">
                {globalQuery?<button onClick={()=>setGlobalQuery('')}>Busca: {globalQuery} ×</button>:null}
                {municipalityFilter!=='Todos'?<button onClick={()=>setMunicipalityFilter('Todos')}>{municipalityFilter} ×</button>:null}
                {dateFrom?<button onClick={()=>setDateFrom('')}>Desde {dateFrom} ×</button>:null}
                {dateTo?<button onClick={()=>setDateTo('')}>Até {dateTo} ×</button>:null}
                {evidenceFilter!=='Todos'?<button onClick={()=>setEvidenceFilter('Todos')}>{evidenceFilter} ×</button>:null}
                {priorityFilter!=='Todos'?<button onClick={()=>setPriorityFilter('Todos')}>Prioridade: {priorityFilter} ×</button>:null}
                {statusFilter!=='Todos'?<button onClick={()=>setStatusFilter('Todos')}>Status: {statusFilter} ×</button>:null}
                {publisherFilter!=='Todos'?<button onClick={()=>setPublisherFilter('Todos')}>{publisherFilter} ×</button>:null}
                {paymentFilter!=='Todos'?<button onClick={()=>setPaymentFilter('Todos')}>{paymentFilter} ×</button>:null}
                {minAmount?<button onClick={()=>setMinAmount('')}>≥ R$ {minAmount} ×</button>:null}
                {maxAmount?<button onClick={()=>setMaxAmount('')}>≤ R$ {maxAmount} ×</button>:null}
              </div>:null}
            </>:null}
          </section>

          {tab === 'overview' && (
            <>
              <section className="intel-metrics-grid">
                <article><span>Denúncias</span><strong>{data.metrics.submissions}</strong><small>{data.metrics.anonymous} sem identificação · {data.metrics.identified} identificadas</small></article>
                <article><span>Registros Intel</span><strong>{data.metrics.intelligenceRecords}</strong><small>{data.metrics.researchFindings} achados analíticos</small></article>
                <article><span>Fontes</span><strong>{data.metrics.sourceInventory}</strong><small>catálogo + fontes de pesquisa + ingeridas</small></article>
                <article><span>Snapshots</span><strong>{data.metrics.archivedSources + data.metrics.versionedDatasets}</strong><small>Blob privado + datasets versionados no Git</small></article>
                <article><span>Municípios</span><strong>{data.metrics.municipalities}</strong><small>presentes em denúncias ou inteligência</small></article>
                <article><span>Entidades</span><strong>{data.metrics.entities}</strong><small>pessoas, empresas, órgãos e fornecedores</small></article>
                <article><span>Relações</span><strong>{data.metrics.relationships}</strong><small>vínculos registrados para análise</small></article>
                <article><span>Fila prioritária</span><strong>{data.metrics.highPriority}</strong><small>itens high/urgent em apuração</small></article>
                <article><span>Evidências</span><strong>{data.metrics.evidenceFiles}</strong><small>{formatBytes(data.metrics.evidenceBytes)} privados</small></article>
              </section>

              <section className="private-grid-two">
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">QUALIDADE DOS DADOS</p><h2>Cobertura e proveniência</h2></div></div>
                  <div className="quality-grid">
                    <div><strong>{data.quality.evidenceCoverage}%</strong><span>denúncias com evidência</span></div>
                    <div><strong>{data.quality.eventDateCoverage}%</strong><span>denúncias com data do fato</span></div>
                    <div><strong>{data.quality.intelligenceWithSource}%</strong><span>registros Intel com URL de fonte</span></div>
                    <div><strong>{data.quality.intelligenceWithMunicipality}%</strong><span>registros Intel vinculados a município</span></div>
                  </div>
                </article>

                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">ESTADO PROBATÓRIO</p><h2>Distribuição</h2></div></div>
                  <div className="intel-level-ranking">
                    {data.rankings.verificationLevels.map((item) => <div key={item.label}><span className={levelClass(item.label)}>{item.label}</span><strong>{item.count}</strong><i style={{width:`${Math.max(6,(item.count/Math.max(1,...data.rankings.verificationLevels.map((r)=>r.count)))*100)}%`}} /></div>)}
                  </div>
                </article>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">FILA DE INVESTIGAÇÃO</p><h2>Próximos itens a trabalhar</h2></div><button className="intel-link-button" onClick={()=>setTab('findings')}>Ver tudo →</button></div>
                <div className="intel-queue">
                  {filteredQueue.length ? filteredQueue.slice(0,8).map((item) => (
                    <div key={item.recordId}>
                      <span className={priorityClass(item.priority)}>{item.priority}</span>
                      <div><strong>{item.title}</strong><small>{item.recordId} · {item.kind} · {item.municipality || 'sem município'}</small></div>
                      <span className={levelClass(item.evidenceLevel)}>{item.evidenceLevel}</span>
                    </div>
                  )) : <p>Nenhum registro de inteligência aguardando apuração ainda.</p>}
                </div>
              </section>

              <section className="private-grid-two">
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">MUNICÍPIOS</p><h2>Maior volume de registros</h2></div></div>
                  <div className="ranking-list">{filteredMunicipalities.slice(0,10).map((item)=><div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>)}</div>
                </article>
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">TIPOS DE INTELIGÊNCIA</p><h2>Composição da base</h2></div></div>
                  <div className="ranking-list">{data.rankings.intelligenceKinds.length ? data.rankings.intelligenceKinds.map((item)=><div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>) : <p>Nenhum registro externo ingerido ainda.</p>}</div>
                </article>
              </section>
            </>
          )}

          {tab === 'submissions' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading">
                <div><p className="eyebrow">DENÚNCIAS RECEBIDAS</p><h2>Base privada</h2></div>
                <div className="private-filters">
                  <input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Protocolo, texto, entidade…" />
                  <select value={mode} onChange={(e)=>setMode(e.target.value)}><option>Todos</option><option value="anonymous">sem identificação</option><option value="identified">identificada</option></select>
                  <select value={submissionCategory} onChange={(e)=>setSubmissionCategory(e.target.value)}><option>Todos</option>{submissionCategoryOptions.map((item)=><option key={item}>{item}</option>)}</select>
                  <select value={submissionEvidence} onChange={(e)=>setSubmissionEvidence(e.target.value)}><option>Todos</option><option>Com evidência</option><option>Sem evidência</option></select>
                </div>
              </div>
              <div className="private-submissions">
                {visibleSubmissions.map((item) => (
                  <details className="private-submission-card" key={item.submissionId}>
                    <summary><div><strong>{item.protocol}</strong><span>{item.municipality} · {item.category}</span></div><div><span>{item.mode==='identified'?'Identificada':'Sem identificação'}</span><time>{formatDate(item.createdAt)}</time></div></summary>
                    <div className="private-submission-body">
                      <div className="private-submission-meta"><div><small>Localidade</small><strong>{item.locality||'—'}</strong></div><div><small>Data</small><strong>{item.eventDate||'—'}</strong></div><div><small>Status</small><strong>{item.status||'—'}</strong></div><div><small>Nível</small><strong>{item.review?.verificationLevel||'L0'}</strong></div></div>
                      {item.contact?<div className="private-contact"><small>CONTATO</small><p><strong>{item.contact.name||'—'}</strong> · {item.contact.email||'—'} · {item.contact.phone||'—'}</p></div>:null}
                      <div className="private-text-block"><small>PESSOAS / ÓRGÃOS / EMPRESAS</small><p>{item.peopleOrEntities||'—'}</p></div>
                      <div className="private-text-block"><small>RELATO</small><p>{item.statement||'—'}</p></div>
                      <div className="private-text-block"><small>ORIGEM / CONTEXTO</small><p>{item.sourceContext||'—'}</p></div>
                      <div className="private-evidence-list"><small>EVIDÊNCIAS ({item.evidence?.length||0})</small>{(item.evidence||[]).map((evidence)=><a key={evidence.pathname} href={`/api/private/evidence?pathname=${encodeURIComponent(evidence.pathname)}&name=${encodeURIComponent(evidence.originalName||'evidencia')}`}><span>{evidence.originalName||evidence.pathname}</span><b>{formatBytes(evidence.size)}</b><em>baixar ↓</em></a>)}</div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {tab === 'findings' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading">
                <div><p className="eyebrow">INTELIGÊNCIA INGESTADA</p><h2>Achados, contas e registros</h2><small className="filter-result-count">{visibleIntel.length} resultado(s) no recorte atual</small></div>
                <div className="private-filters">
                  <input type="search" value={intelQuery} onChange={(e)=>setIntelQuery(e.target.value)} placeholder="Buscar achado, entidade, município…" />
                  <select value={intelKind} onChange={(e)=>setIntelKind(e.target.value)}><option>Todos</option>{Array.from(new Set(data.intelligence.map((item)=>item.kind))).map((kind)=><option key={kind}>{kind}</option>)}</select>
                </div>
              </div>
              <div className="intel-record-list">
                {visibleIntel.length ? visibleIntel.map((item)=>(
                  <details key={item.recordId} className="intel-record">
                    <summary>
                      <span className={priorityClass(item.priority)}>{item.priority}</span>
                      <div><strong>{item.title}</strong><small>{item.recordId} · {item.kind} · {item.municipality||'sem município'}</small></div>
                      <span className={levelClass(item.evidenceLevel)}>{item.evidenceLevel}</span>
                    </summary>
                    <div className="intel-record-body">
                      <p>{item.summary}</p>
                      {item.content?<div className="private-text-block"><small>CONTEÚDO / ANÁLISE</small><p>{item.content}</p></div>:null}
                      <div className="intel-record-meta"><div><span>Status</span><b>{item.status}</b></div><div><span>Confiança analítica</span><b>{item.analyticalConfidence!==undefined?`${Math.round(item.analyticalConfidence*100)}%`:'—'}</b></div><div><span>Coletado</span><b>{formatDate(item.collectedAt)}</b></div><div><span>Fonte</span><b>{item.provenance?.publisher||'—'}</b></div></div>
                      {item.provenance?.sourceUrl?<a className="intel-source-link" href={item.provenance.sourceUrl} target="_blank" rel="noreferrer">Abrir fonte original ↗</a>:null}
                      {(item.entities||[]).length?<div className="intel-chip-list">{item.entities?.map((entity)=><span key={entity.name+entity.type}>{entity.name}<small>{entity.type}{entity.role?` · ${entity.role}`:''}</small></span>)}</div>:null}
                    </div>
                  </details>
                )):<p>Nenhum registro de inteligência ingerido ainda.</p>}
              </div>
            </section>
          )}

          {tab === 'sources' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading"><div><p className="eyebrow">INVENTÁRIO DE FONTES</p><h2>Onde pesquisar e de onde vieram os dados</h2><small className="filter-result-count">{visibleSources.length} fonte(s)</small></div><div className="private-filters"><input value={sourceQuery} onChange={(e)=>setSourceQuery(e.target.value)} placeholder="TSE, contratos, despesas…" /><select value={sourceCategory} onChange={(e)=>setSourceCategory(e.target.value)}><option>Todos</option>{sourceCategoryOptions.map((v)=><option key={v}>{v}</option>)}</select><select value={sourceAccess} onChange={(e)=>setSourceAccess(e.target.value)}><option>Todos</option>{sourceAccessOptions.map((v)=><option key={v}>{v}</option>)}</select></div></div>
              <div className="intel-source-grid">
                {visibleSources.map((source)=>(
                  <article key={source.origin+source.id}>
                    <div><span>{source.category}</span><b>{source.access}</b></div>
                    <h3>{source.name}</h3><p>{source.organization}</p><small>{source.scope}</small>
                    <ul>{(source.capabilities||[]).slice(0,5).map((item)=><li key={item}>{item}</li>)}</ul>
                    {source.url?<a href={source.url} target="_blank" rel="noreferrer">Abrir fonte ↗</a>:null}
                  </article>
                ))}
              </div>
            </section>
          )}

          {tab === 'housing' && (
            <>
              <section className="intel-metrics-grid">
                <article><span>Convênios-alvo</span><strong>{visibleHousing.length}</strong><small>bloco de 50 unidades por município</small></article>
                <article><span>Parcela identificada</span><strong>{money(visibleHousing.reduce((sum,item)=>sum+item.paid,0))}</strong><small>R$ 1,17 mi por município · FIPLAN</small></article>
                <article><span>Corroborados</span><strong>{visibleHousing.filter((item)=>item.status==='corroborado').length}</strong><small>contratação posterior localizada</small></article>
                <article><span>Lacunas</span><strong>{visibleHousing.filter((item)=>item.status==='lacuna').length}</strong><small>contratação estadual correspondente ainda não localizada</small></article>
              </section>
              <section className="private-panel">
                <div className="private-panel-title submissions-heading"><div><p className="eyebrow">MATRIZ DE DILIGÊNCIA</p><h2>Pagamento → contratação → fornecedor → TSE → exceção</h2><small className="filter-result-count">{visibleHousing.length} caso(s) no recorte</small></div><div className="private-filters"><select value={housingDocumentFilter} onChange={(e)=>setHousingDocumentFilter(e.target.value)}><option>Todos</option><option>Contratação localizada</option><option>Lacuna</option></select><select value={housingProcurementStatus} onChange={(e)=>setHousingProcurementStatus(e.target.value)}><option>Todos</option><option value="em_andamento">Em andamento</option><option value="homologado">Homologado</option><option value="nao_localizado">Não localizado</option></select><select value={housingSupplierFilter} onChange={(e)=>setHousingSupplierFilter(e.target.value)}><option>Todos</option><option>Com fornecedor</option><option>Sem fornecedor</option></select><select value={housingTseFilter} onChange={(e)=>setHousingTseFilter(e.target.value)}><option>Todos</option><option>Sem match exato</option><option>Não aplicável ainda</option><option>Não executado</option></select></div></div>
                <p className="private-report-note">“Corroborado” significa que foi localizada documentação de contratação posterior ao pagamento. “Lacuna” significa que a contratação correspondente ainda não foi localizada. Em “Exceção”, “em teste” indica hipótese jurídica documentalmente possível ainda sem vínculo específico comprovado; “não localizada” significa somente ausência de documentação nas fontes consultadas até o corte. “Sem match exato TSE” descreve apenas os arquivos/versionamento consultados. Nenhum estado equivale a conclusão de ilegalidade.</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Pagamento</span><span>Contratação</span><span>Situação / referência</span><span>Fornecedor / TSE</span><span>Exceção</span></div>
                  {visibleHousing.map((item)=>(
                    <div key={item.municipality}>
                      <strong>{item.municipality}</strong>
                      <div><b>{money(item.paid)}</b><small>{item.paymentDate||'—'}</small>{item.instrumentNumber?<code>{item.instrumentNumber}</code>:null}</div>
                      <div><b>{item.procurementDate||'não localizada'}</b>{item.procurementValue?<small>{money(item.procurementValue)}</small>:null}</div>
                      <div><b className={item.status==='corroborado'?'housing-status-ok':item.status==='lacuna'?'housing-status-gap':'housing-status-triage'}>{item.status}</b><small>{item.procurementStatus||item.findingTitle}</small>{item.procurementControl?<code>{item.procurementControl}</code>:null}<span className={levelClass(item.evidenceLevel)}>{item.evidenceLevel}</span></div>
                      <div>{item.supplier?<><strong>{item.supplier}</strong>{item.supplierCnpj?<code>{item.supplierCnpj}</code>:null}</>:<span>Fornecedor não consolidado</span>}{item.electoralCrossmatch==='no_exact_match'?<b className="housing-tse-none">TSE: sem match exato</b>:item.electoralCrossmatch==='not_applicable_no_supplier'?<b className="housing-tse-pending">TSE: aguarda fornecedor</b>:<b className="housing-tse-pending">TSE: não executado</b>}{item.electoralCrossmatchNote?<small>{item.electoralCrossmatchNote}</small>:null}</div>
                      <div title={item.exceptionNote||undefined}><span className={item.exceptionStatus==='documented'?'housing-status-ok':'housing-exception-pending'}>{item.exceptionStatus==='documented'?'documentada':item.exceptionStatus==='under_test'?'em teste':'não localizada'}</span><small>R1 instrumento: {item.instrumentPublishedAt?`✓ ${item.instrumentPublishedAt}`:'não verificado'}</small><small>R2 execução física: {item.physicalExecutionStatus==='documented'?'✓ documentada':'não localizada'}</small><small>R3 cronograma: {item.prefixedScheduleStatus==='documented'?'✓ documentado':'não localizado'}</small></div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {tab === 'expansion' && (
            <>
              <section className="private-grid-three">
                <article className="private-panel"><p className="eyebrow">EXPANSÃO TERRITORIAL</p><h2>{data.municipalityCohort69.methodology.newMunicipalityCount} novos municípios</h2><p className="private-report-note">A votação é critério de priorização da amostra, nunca evidência de irregularidade.</p></article>
                <article className="private-panel"><p className="eyebrow">IRECÊ</p><h2>{data.municipalityCohort69.methodology.newIreceMunicipalities} novos + Lapão</h2><p className="private-report-note">Cobertura completa dos 20 municípios do Território de Identidade de Irecê.</p></article>
                <article className="private-panel"><p className="eyebrow">EVIDÊNCIAS CENTRAIS · LEVA 01</p><h2>{data.centralEvidenceWave01.counts.total} itens</h2><p className="private-report-note">{data.centralEvidenceWave01.counts.housingCore} do núcleo habitacional + {data.centralEvidenceWave01.counts.expansionFinancialFacts} fatos financeiros adicionais.</p></article>
              </section>
              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">COORTE DE PRIORIZAÇÃO</p><h2>69 municípios selecionados para a próxima onda</h2><small>{money(data.centralEvidenceWave01.counts.expansionFinancialExposureBRL)} em pagamentos FIPLAN já qualificados entre os 36 municípios com exposição financeira.</small></div></div>
                <p className="private-report-note">{data.municipalityCohort69.methodology.statement} Referência estadual de Jerônimo em 2026: {data.municipalityCohort69.methodology.statewideJeronimo2026ValidVotePct.toFixed(2)}% dos votos válidos. Percentuais municipais só aparecem quando já verificados nesta coorte.</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Seleção</span><span>FIPLAN no defeso</span><span>Jerônimo 2026</span><span>Evidência central</span><span>Status</span></div>
                  {data.municipalityCohort69.municipalities.map((item)=><div key={item.name}>
                    <strong>{item.name}</strong>
                    <div><b>{item.priority}</b><small>{item.territoryIrece?'Território Irecê':''}</small></div>
                    <div>{item.defesoPaymentExposureBRL>0?<b>{money(item.defesoPaymentExposureBRL)}</b>:<span>sem fato financeiro classificado</span>}</div>
                    <div>{item.jeronimo2026ValidVotePct!==null?<><b>{item.jeronimo2026ValidVotePct.toFixed(2)}%</b><small>votos válidos</small></>:<span>percentual pendente de ingestão</span>}</div>
                    <div>{item.centralEvidenceQualified?<b className="housing-status-ok">qualificada</b>:<span className="housing-exception-pending">triagem</span>}</div>
                    <div><small>{item.selectionReasons.map((reason)=>reason==='defeso_fiplan_payment'?'pagamento FIPLAN':reason==='territorio_irece'?'Irecê':'alta votação 2026').join(' · ')}</small></div>
                  </div>)}
                </div>
              </section>
              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">TRIAGEM P0 · 36 MUNICÍPIOS</p><h2>Teste documental do marco de 04/07</h2><small>{data.p0Triage36.scope.instruments} instrumentos · {money(data.p0Triage36.scope.defesoPaidBRL)} pagos no período crítico</small></div></div>
                <p className="private-report-note">{data.p0Triage36.methodology.statement} Resultado R1: {data.p0Triage36.summary.instrumentsPublishedBeforeCutoff}/{data.p0Triage36.scope.instruments} instrumentos publicados antes do marco.</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Instrumento</span><span>Publicação</span><span>Pagamento</span><span>Valor no defeso</span><span>Prioridade</span></div>
                  {data.p0Triage36.instruments.map((item)=><div key={item.instrument}>
                    <strong>{item.municipality}</strong>
                    <div><code>{item.instrument}</code><small>{item.agency} · {item.category}</small></div>
                    <div><b>{item.published}</b><small>{item.daysPublicationBeforeCutoff} dia(s) antes de 04/07</small></div>
                    <div><b>{item.payment}</b><small>{item.daysPaymentAfterCutoff} dia(s) após 04/07</small></div>
                    <div><b>{money(item.paidBRL)}</b><small>{item.object}</small></div>
                    <div><b className={item.priority==='critical'?'housing-status-gap':item.priority==='urgent'?'housing-exception-pending':'housing-status-triage'}>{item.priority}</b><small>{item.flag.replaceAll('_',' ')}</small></div>
                  </div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">REGISTRO PROBATÓRIO</p><h2>Primeira leva de 50 evidências centrais</h2></div></div>
                <p className="private-report-note">{data.centralEvidenceWave01.countingPolicy}</p>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>ID</span><span>Município</span><span>Tipo</span><span>Valor</span><span>Fato</span></div>
                  {data.centralEvidenceWave01.items.map((item)=><div key={item.id}><code>{item.id}</code><strong>{item.municipality}</strong><span>{item.type}</span><b>{money(item.amountBRL)}</b><span>{item.title}</span></div>)}
                </div>
              </section>
            </>
          )}

          {tab === 'entities' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading"><div><p className="eyebrow">ÍNDICE DE ENTIDADES</p><h2>Pessoas, empresas, órgãos e fornecedores</h2><small className="filter-result-count">{visibleEntities.length} entidade(s)</small></div><div className="private-filters"><input value={entityQuery} onChange={(e)=>setEntityQuery(e.target.value)} placeholder="Nome, CNPJ, papel…" /><select value={entityType} onChange={(e)=>setEntityType(e.target.value)}><option>Todos</option>{entityTypeOptions.map((v)=><option key={v}>{v}</option>)}</select><select value={entityMentions} onChange={(e)=>setEntityMentions(e.target.value)}><option value="1">≥ 1 menção</option><option value="2">≥ 2 menções</option><option value="3">≥ 3 menções</option><option value="5">≥ 5 menções</option><option value="10">≥ 10 menções</option></select></div></div>
              <div className="intel-entity-table">
                <div className="intel-table-head"><span>Entidade</span><span>Tipo</span><span>Identificador</span><span>Menções</span><span>Papéis</span></div>
                {visibleEntities.map((item)=><div key={item.type+item.identifier+item.name}><strong>{item.name}</strong><span>{item.type}</span><code>{item.identifier||'—'}</code><b>{item.mentions}</b><span>{item.roles.join(', ')||'—'}</span></div>)}
              </div>
            </section>
          )}

          {tab === 'relations' && (
            <section className="private-panel">
              <div className="private-panel-title submissions-heading"><div><p className="eyebrow">GRAFO RELACIONAL</p><h2>Vínculos registrados para análise</h2><small className="filter-result-count">{visibleRelations.length} relação(ões)</small></div><div className="private-filters"><input value={relationQuery} onChange={(e)=>setRelationQuery(e.target.value)} placeholder="Origem, destino, descrição…" /><select value={relationType} onChange={(e)=>setRelationType(e.target.value)}><option>Todos</option>{relationTypeOptions.map((v)=><option key={v}>{v}</option>)}</select></div></div>
              <div className="intel-relations">
                {visibleRelations.length ? visibleRelations.map((item,index)=><div key={index}><strong>{item.from}</strong><span>{item.type}</span><strong>{item.to}</strong><p>{item.description||''}</p></div>):<p>Nenhuma relação estruturada ingerida ainda. A Intel API já aceita relações entre entidades.</p>}
              </div>
            </section>
          )}

          {tab === 'municipalities' && (
            <section className="private-grid-two">
              <article className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">COBERTURA TERRITORIAL</p><h2>Municípios na base</h2></div></div>
                <div className="intel-municipality-list">{filteredMunicipalities.map((item,index)=><div key={item.label}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.label}</strong><b>{item.count}</b></div>)}</div>
              </article>
              <article className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">OBJETIVO</p><h2>Matriz dos 417 municípios</h2></div></div>
                <div className="intel-coverage-number"><strong>{filteredMunicipalities.length}</strong><span>no recorte analítico atual</span><i>{Math.round((filteredMunicipalities.length/417)*100)}%</i></div>
                <p className="private-report-note">O número indica cobertura de dados, não suspeita nem irregularidade. A meta é completar a matriz de origem → transferência → contratação → execução → contexto.</p>
              </article>
            </section>
          )}

          {tab === 'reports' && (
            <>
              <section className="intel-metrics-grid reports">
                <article><span>Anunciado</span><strong>{money(filteredFinance.announced)}</strong><small>soma bruta dos valores anotados; pode haver sobreposição entre pacotes e subitens</small></article>
                <article><span>Empenhado</span><strong>{money(filteredFinance.committed)}</strong><small>quando disponível</small></article>
                <article><span>Liquidado</span><strong>{money(filteredFinance.liquidated)}</strong><small>quando disponível</small></article>
                <article><span>Pago</span><strong>{money(filteredFinance.paid)}</strong><small>movimentação efetiva registrada</small></article>
              </section>
              <section className="private-grid-two">
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">EDITORES / FONTES</p><h2>Publicadores mais presentes</h2></div></div>
                  <div className="ranking-list">{data.rankings.sourcePublishers.length?data.rankings.sourcePublishers.slice(0,12).map((item)=><div key={item.label}><span>{item.label}</span><b>{item.count}</b></div>):<p>Aguardando ingestão de pesquisa externa.</p>}</div>
                </article>
                <article className="private-panel">
                  <div className="private-panel-title"><div><p className="eyebrow">INTEGRIDADE</p><h2>Alertas da base</h2></div></div>
                  <div className="quality-grid"><div><strong>{data.metrics.missingReferencedEvidence}</strong><span>evidências referenciadas ausentes</span></div><div><strong>{data.metrics.orphanEvidence}</strong><span>arquivos órfãos</span></div><div><strong>{100-data.quality.intelligenceWithSource}%</strong><span>Intel sem URL de fonte</span></div><div><strong>{100-data.quality.intelligenceWithMunicipality}%</strong><span>Intel sem município</span></div></div>
                </article>
              </section>
              <section className="private-panel private-report">
                <div className="private-panel-title"><div><p className="eyebrow">EXPORTAÇÃO ANALÍTICA</p><h2>Extrair por domínio</h2></div></div>
                <div className="intel-export-links"><a href="/api/private/export?format=csv">Denúncias CSV</a><a href="/api/private/export?format=csv&scope=intelligence">Inteligência CSV</a><a href="/api/private/export?format=csv&scope=sources">Fontes CSV</a><a href="/api/private/export?format=csv&scope=entities">Entidades CSV</a><a href="/api/private/export?format=csv&scope=relationships">Relações CSV</a><a href="/api/private/export?format=json">Base completa JSON</a></div>
              </section>
              <section className="private-panel private-report">
                <div className="private-panel-title"><div><p className="eyebrow">LEITURA AUTOMÁTICA</p><h2>Resumo operacional</h2></div></div>
                <p>No recorte atual há <strong>{visibleSubmissions.length}</strong> denúncia(s), <strong>{filteredIntelligence.length}</strong> registro(s) de inteligência, <strong>{filteredMunicipalities.length}</strong> município(s) e <strong>{visibleEntities.length}</strong> entidade(s). A fila de apuração contém <strong>{filteredQueue.length}</strong> item(ns).</p>
                <p className="private-report-note">Esses números descrevem a base. Eles não atribuem culpa, dolo, abuso ou irregularidade. Qualquer conclusão depende de análise documental e jurídica humana.</p>
              </section>
            </>
          )}

          {tab === 'provenance' && (
            <>
              <section className="private-panel git-preservation-panel">
                <div className="private-panel-title"><div><p className="eyebrow">PROVENIÊNCIA VERSIONADA</p><h2>Datasets certificados no Git</h2></div><span>{data.metrics.versionedDatasets} dataset · {data.metrics.versionedRows} linhas preservadas</span></div>
                {data.gitPreservations.map((item)=>(
                  <article className="git-preservation-card" key={item.sourceId}>
                    <div className="source-archive-head"><div><strong>{item.publisher}</strong><small>{item.sourceId}</small></div><span className="source-cert-ok">GIT ✓</span></div>
                    <div className="git-preservation-kpis">
                      <div><small>Instrumentos</small><strong>{item.extraction.result.instruments}</strong></div>
                      <div><small>Pagamentos</small><strong>{item.extraction.result.payments}</strong></div>
                      <div><small>Municípios</small><strong>{item.extraction.result.municipalities}</strong></div>
                      <div><small>Valor filtrado</small><strong>{money(item.extraction.result.paidBRL)}</strong></div>
                    </div>
                    <div className="source-hash"><small>SHA-256 DO ZIP OFICIAL</small><code>{item.sourceArtifact.sha256}</code></div>
                    <div className="source-archive-meta"><span><b>Coleta</b>{formatDate(item.retrievedAt)}</span><span><b>HTTP</b>{item.http.status}</span><span><b>Last-Modified</b>{item.http.lastModified}</span><span><b>ETag</b>{item.http.etag}</span></div>
                    <div className="git-preservation-warning"><strong>Transporte TLS</strong><span>O servidor apresentou cadeia de certificado incompleta no ambiente de coleta. A falha foi registrada; o certificado apresentado e sua impressão SHA-256 foram preservados. O conteúdo foi baixado somente após registrar essa limitação.</span></div>
                    <div className="source-hash"><small>FINGERPRINT DO CERTIFICADO APRESENTADO</small><code>{item.transport.certificate.sha256Fingerprint}</code></div>
                    <div className="git-extract-grid">
                      {item.extraction.preservedExtracts.map((extract)=><div key={extract.path}><strong>{extract.rows} linhas</strong><span>{extract.path.split('/').pop()}</span><code>{extract.uncompressedSha256}</code></div>)}
                    </div>
                    <p className="private-report-note">{item.interpretationBoundary}</p>
                    <div className="source-archive-actions"><a href={item.sourceUrl} target="_blank" rel="noreferrer">Fonte oficial ↗</a><a href={item.repositoryUrl} target="_blank" rel="noreferrer">Commit de preservação ↗</a></div>
                  </article>
                ))}
              </section>
              <section className="private-panel source-archive-form">
                <div className="private-panel-title"><div><p className="eyebrow">PRESERVAÇÃO PROBATÓRIA</p><h2>Arquivar fonte pública</h2></div></div>
                <p className="private-report-note">A coleta salva uma cópia bruta em Blob privado e registra SHA-256, URL original/final, data/hora e cabeçalhos HTTP. O hash permite comprovar posteriormente que o arquivo preservado não foi alterado.</p>
                <div className="source-archive-fields"><input value={archiveUrl} onChange={(e)=>setArchiveUrl(e.target.value)} placeholder="https://fonte-oficial..." /><input value={archiveSourceId} onChange={(e)=>setArchiveSourceId(e.target.value)} placeholder="ID curto da fonte (opcional)" /><input value={archiveTitle} onChange={(e)=>setArchiveTitle(e.target.value)} placeholder="Título (opcional)" /><input value={archivePublisher} onChange={(e)=>setArchivePublisher(e.target.value)} placeholder="Órgão/publicador (opcional)" /></div>
                <button type="button" className="source-archive-button" disabled={archiving||!archiveUrl.trim()} onClick={archiveSource}>{archiving?'Preservando…':'Preservar snapshot'}</button>
                {archiveMessage?<p className="source-archive-message">{archiveMessage}</p>:null}
              </section>
              <section className="private-panel">
                <div className="private-panel-title submissions-heading"><div><p className="eyebrow">CADEIA DE PROVENIÊNCIA</p><h2>Snapshots preservados</h2><small className="filter-result-count">{visibleSourceArchives.length} snapshot(s) no recorte</small></div><div className="private-filters"><select value={archiveCertFilter} onChange={(e)=>setArchiveCertFilter(e.target.value)}><option>Todos</option><option>Íntegro</option><option>Revisar</option></select><select value={archiveTypeFilter} onChange={(e)=>setArchiveTypeFilter(e.target.value)}><option>Todos</option>{archiveTypeOptions.map((v)=><option key={v}>{v}</option>)}</select></div></div>
                <div className="source-archive-list">
                  {visibleSourceArchives.length?visibleSourceArchives.map((item)=><article key={item.manifestBlobPath}>
                    <div className="source-archive-head"><div><strong>{item.title||item.sourceId}</strong><small>{item.publisher||new URL(item.originalUrl).hostname}</small></div><span className={item.certificateValid?'source-cert-ok':'source-cert-bad'}>{item.certificateValid?'SHA ✓':'REVISAR'}</span></div>
                    <p>{item.originalUrl}</p>
                    <div className="source-archive-meta"><span><b>Coleta</b>{formatDate(item.retrievedAt)}</span><span><b>HTTP</b>{item.httpStatus}</span><span><b>Tipo</b>{item.contentType}</span><span><b>Tamanho</b>{formatBytes(item.size)}</span></div>
                    <div className="source-hash"><small>SHA-256 DO ARQUIVO</small><code>{item.sha256}</code></div>
                    <div className="source-hash"><small>HASH DO CERTIFICADO</small><code>{item.certificateSha256}</code></div>
                    <div className="source-archive-actions"><a href={item.originalUrl} target="_blank" rel="noreferrer">Fonte original ↗</a><a href={`/api/private/source-archive/file?pathname=${encodeURIComponent(item.rawBlobPath)}&name=${encodeURIComponent(item.sourceId)}`}>Baixar cópia preservada ↓</a></div>
                  </article>):<p>Nenhum snapshot preservado ainda.</p>}
                </div>
              </section>
            </>
          )}

          {tab === 'api' && (
            <section className="private-panel api-panel">
              <div className="private-panel-title"><div><p className="eyebrow">INTEL API · V1</p><h2>Entrada para pesquisas profundas, scripts e agentes</h2></div></div>
              <p>A API é server-to-server e usa uma chave própria. A chave não é exibida pelo cockpit porque a Vercel armazena somente seu hash.</p>
              <div className="api-endpoints">
                <div><span>POST</span><code>/api/intelligence/ingest</code><p>Ingere um registro ou lote de até 100 registros.</p></div>
                <div><span>GET</span><code>/api/intelligence/query</code><p>Consulta registros por kind, município, status, nível, caso ou texto.</p></div>
              </div>
              <h3>Tipos aceitos</h3>
              <div className="intel-chip-list">{['complaint','public_source','research_finding','financial_record','electoral_account','entity','relationship','municipal_fact','legal_reference'].map((item)=><span key={item}>{item}</span>)}</div>
              <h3>Exemplo de payload</h3>
              <pre className="api-code">{JSON.stringify({
                kind:'research_finding',title:'Pagamento identificado em fonte pública',
                summary:'Resumo objetivo sem inferir ilícito.',municipality:'Irecê',
                eventDate:'2026-07-10',status:'triage',evidenceLevel:'L2',priority:'high',
                analyticalConfidence:0.82,caseIds:['OE-BA-0002'],
                provenance:{sourceUrl:'https://fonte-oficial.example/',publisher:'Órgão público',method:'web_research'}
              },null,2)}</pre>
              <p className="private-report-note">Para cruzamentos de contas eleitorais, use <code>electoral_account</code>; para pagamentos e execução financeira, <code>financial_record</code>; para relações societárias ou eleitorais documentadas, use <code>relationship</code> e identifique a fonte no campo <code>provenance</code>.</p>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
