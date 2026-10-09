import { get, list, type ListBlobResultBlob } from '@vercel/blob';
import { publicCases } from '@/lib/cases';
import { sourceCatalog } from '@/lib/content';
import { listSourceArchives, verifySourceArchiveRecord } from '@/lib/source-archive';
import fiplanPreservation from '@/preservation/manifests/fiplan-defeso-2026.json';
import municipalityCohort69 from '@/data/investigation/municipality-cohort-69-2026-10-06.json';
import municipalityUniverse77 from '@/data/investigation/municipality-universe-77-2026-10-07.json';
import centralEvidenceWave01 from '@/preservation/manifests/central-evidence-wave-01-50.json';
import p0Triage36 from '@/data/investigation/p0-triage-36-2026-10-06.json';
import centralEvidenceWave02 from '@/preservation/manifests/central-evidence-wave-02-critical-p0.json';
import centralEvidenceWave03 from '@/preservation/manifests/central-evidence-wave-03-aracas-jaguaquara.json';
import p0ComidaNoPratoControl from '@/data/investigation/p0-comida-no-prato-control-2026-10-06.json';
import p0InfrastructureControl from '@/data/investigation/p0-infrastructure-control-2026-10-06.json';
import ireceP0DeepScan from '@/data/investigation/irece-p0-deep-scan-2026-10-06.json';
import p0RuralMarketGaps from '@/data/investigation/p0-rural-market-gaps-2026-10-06.json';
import p0ClassificationCoverage from '@/data/investigation/p0-classification-coverage-36-2026-10-06.json';
import prebaPackagesIndex from '@/data/investigation/preba-packages-index-2026-10-07.json';
import prebaLajedoPackage from '@/data/investigation/preba-package-01-lajedo-do-tabocal-2026-10-07.json';
import prebaBeloCampoPackage from '@/data/investigation/preba-package-02-belo-campo-2026-10-07.json';
import prebaAracasPackage from '@/data/investigation/preba-package-03-aracas-2026-10-07.json';
import prebaJaguaquaraPackage from '@/data/investigation/preba-package-04-jaguaquara-2026-10-07.json';
import prebaFinalRepresentation from '@/data/investigation/preba-final-representation-2026-10-07.json';
import prebaFinalAnnexIndex from '@/data/investigation/preba-final-annex-index-2026-10-07.json';
import prebaProtocolRelease from '@/data/investigation/preba-protocol-release-2026-10-08.json';
import followMoneyRoadmap from '@/data/investigation/follow-money-roadmap-2026-10-08.json';
import fm02DocumentaryLedger from '@/data/investigation/fm02-documentary-ledger-2026-10-08.json';
import fm02FiplanPrimaryRows from '@/data/investigation/fm02-fiplan-primary-rows-2026-10-08.json';
import fm03FinancialChains from '@/data/investigation/fm03-financial-chain-baseline-2026-10-08.json';
import fm03PncpOfficialSnapshots from '@/data/investigation/fm03-pncp-official-snapshots-2026-10-08.json';
import fm03PncpItemsHistory from '@/data/investigation/fm03-pncp-items-history-watch-2026-10-08.json';
import fm03PncpItemHistoryEvidence from '@/data/investigation/fm03-pncp-item-history-evidence-2026-10-08.json';
import fm03MunicipalSources from '@/data/investigation/fm03-municipal-source-register-2026-10-08.json';
import centralEvidenceLedger from '@/data/evidence/central/index-2026-10-08.json';
import {
  listIntelligenceRecords,
  researchSourceRegistry,
  type IntelligenceRecord,
} from '@/lib/intelligence';

export type PrivateEvidence = {
  pathname: string;
  contentType: string;
  etag: string;
  originalName: string;
  size: number;
};

export type PrivateSubmission = {
  schemaVersion?: number;
  submissionId: string;
  protocol: string;
  status: string;
  createdAt: string;
  mode: 'identified' | 'anonymous';
  municipality: string;
  locality: string;
  eventDate: string;
  category: string;
  peopleOrEntities: string;
  statement: string;
  sourceContext: string;
  contact: null | {
    name?: string;
    email?: string;
    phone?: string;
  };
  evidence: PrivateEvidence[];
  review?: {
    verificationLevel?: string;
    publish?: boolean;
    notes?: unknown[];
  };
};

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

async function readJsonBlob(pathname: string) {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text);
}

function groupCount(values: string[]) {
  const map = new Map<string, number>();
  for (const raw of values) {
    const value = raw?.trim() || 'Não informado';
    map.set(value, (map.get(value) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'pt-BR'));
}

function priorityWeight(value: string) {
  return value === 'urgent' ? 4 : value === 'high' ? 3 : value === 'medium' ? 2 : 1;
}

function financialTotals(records: IntelligenceRecord[]) {
  return records.reduce((acc, item) => {
    acc.announced += item.financial?.announced || 0;
    if (item.kind === 'financial_record') {
      acc.committed += item.financial?.committed || 0;
      acc.liquidated += item.financial?.liquidated || 0;
      acc.paid += item.financial?.paid || 0;
      acc.amendmentValue += item.financial?.amendmentValue || 0;
    }
    acc.contractValue += item.kind === 'financial_record' ? (item.financial?.contractValue || 0) : 0;
    return acc;
  }, { announced: 0, committed: 0, liquidated: 0, paid: 0, contractValue: 0, amendmentValue: 0 });
}

function entityIndex(records: IntelligenceRecord[]) {
  const map = new Map<string, { name: string; type: string; identifier?: string; mentions: number; roles: Set<string> }>();
  for (const record of records) {
    for (const entity of record.entities || []) {
      const key = `${entity.type}:${entity.identifier || entity.name.toLocaleLowerCase('pt-BR')}`;
      const current = map.get(key) || { name: entity.name, type: entity.type, identifier: entity.identifier, mentions: 0, roles: new Set<string>() };
      current.mentions += 1;
      if (entity.role) current.roles.add(entity.role);
      map.set(key, current);
    }
  }
  return Array.from(map.values())
    .map((item) => ({ ...item, roles: Array.from(item.roles) }))
    .sort((a,b) => b.mentions - a.mentions || a.name.localeCompare(b.name,'pt-BR'));
}

export async function getPrivateDashboardData() {
  const [submissionBlobs, evidenceBlobs, intelligence, sourceArchives] = await Promise.all([
    listAll('submissions/'),
    listAll('evidence/'),
    listIntelligenceRecords(),
    listSourceArchives(),
  ]);

  const metadataBlobs = submissionBlobs.filter((blob) => blob.pathname.endsWith('/metadata.json'));
  const records = await Promise.all(
    metadataBlobs.map(async (blob) => {
      try {
        return (await readJsonBlob(blob.pathname)) as PrivateSubmission;
      } catch {
        return null;
      }
    }),
  );

  const submissions = records
    .filter((item): item is PrivateSubmission => Boolean(item?.submissionId && item?.protocol))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const referencedEvidence = new Set(
    submissions.flatMap((item) => (item.evidence || []).map((evidence) => evidence.pathname)),
  );
  const evidencePaths = new Set(evidenceBlobs.map((blob) => blob.pathname));

  const totalEvidenceBytes = evidenceBlobs.reduce((sum, blob) => sum + (blob.size || 0), 0);
  const missingReferencedEvidence = Array.from(referencedEvidence).filter((pathname) => !evidencePaths.has(pathname));
  const orphanEvidence = evidenceBlobs.filter((blob) => !referencedEvidence.has(blob.pathname));

  const identified = submissions.filter((item) => item.mode === 'identified').length;
  const anonymous = submissions.filter((item) => item.mode === 'anonymous').length;
  const withEvidence = submissions.filter((item) => (item.evidence || []).length > 0).length;
  const withEventDate = submissions.filter((item) => Boolean(item.eventDate)).length;

  const intelMunicipalities = intelligence.map((item) => item.municipality || '').filter(Boolean);
  const submissionMunicipalities = submissions.map((item) => item.municipality).filter(Boolean);
  const allMunicipalities = new Set([...intelMunicipalities, ...submissionMunicipalities]);

  const municipalityRanking = groupCount([
    ...submissionMunicipalities,
    ...intelMunicipalities,
  ]);
  const categoryRanking = groupCount(submissions.map((item) => item.category));
  const statusRanking = groupCount([
    ...submissions.map((item) => item.status),
    ...intelligence.map((item) => item.status),
  ]);
  const levelRanking = groupCount([
    ...submissions.map((item) => item.review?.verificationLevel || 'L0'),
    ...intelligence.map((item) => item.evidenceLevel),
  ]);
  const kindRanking = groupCount(intelligence.map((item) => item.kind));
  const publisherRanking = groupCount(intelligence.map((item) => item.provenance?.publisher || '').filter(Boolean));

  const dailySubmissions = groupCount(
    submissions.map((item) => item.createdAt ? item.createdAt.slice(0, 10) : 'Sem data'),
  ).sort((a, b) => a.label.localeCompare(b.label));

  const findings = intelligence.filter((item) =>
    ['research_finding','financial_record','electoral_account','municipal_fact','legal_reference'].includes(item.kind),
  );
  const ingestedSources = intelligence.filter((item) => item.kind === 'public_source');
  const relationshipRecords = intelligence.filter((item) => item.kind === 'relationship');
  const entities = entityIndex(intelligence);
  const relationships = intelligence.flatMap((item) => item.relations || []);
  const queue = intelligence
    .filter((item) => ['ingested','triage','corroborating'].includes(item.status))
    .sort((a,b) => priorityWeight(b.priority) - priorityWeight(a.priority) || b.collectedAt.localeCompare(a.collectedAt));
  const highPriority = queue.filter((item) => item.priority === 'high' || item.priority === 'urgent');
  const dynamicIntelligence = intelligence.filter((item) => item.recordOrigin === 'ingested');
  const reviewedIntelligence = dynamicIntelligence.filter((item) => (item.review?.reviewCount || 0) > 0);
  const promotedIntelligence = dynamicIntelligence.filter((item) => item.review?.workflowState === 'promoted');
  const triagePendingIntelligence = dynamicIntelligence.filter((item) => !item.review || ['new','analyzing'].includes(item.review.workflowState));
  const finance = financialTotals(intelligence);
  const housingTargets = ['Barra','Cipó','Esplanada','Iraquara','Itaberaba','Lajedinho','Lapão','Macajuba'];
  const housingExceptionTest: Record<string,{status:'under_test'|'not_located'|'documented';note:string;instrumentPublishedAt:string;physicalExecution:'not_located'|'documented';prefixedSchedule:'not_located'|'documented'}> = {
    Barra:{status:'under_test',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Situação de emergência por chuvas vigente na data do pagamento (Decreto Municipal 075/2026, homologado pelo Decreto Estadual 24.408/2026); vínculo específico do convênio habitacional com a emergência ainda não localizado.'},
    Cipó:{status:'under_test',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Situação de emergência por chuvas vigente na data do pagamento (Decreto Municipal 065/2026); vínculo específico do Convênio 009/2026/50 moradias com a emergência ainda não localizado.'},
    Esplanada:{status:'not_located',instrumentPublishedAt:'2026-06-27',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Não localizada, até o corte, prova pública de execução física anterior a 04/07, cronograma original aplicável, OS/medição anterior ou vínculo emergencial específico.'},
    Iraquara:{status:'not_located',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Não localizada, até o corte, prova pública de execução física anterior a 04/07, cronograma original aplicável, OS/medição anterior ou vínculo emergencial específico para as 50 unidades estaduais.'},
    Itaberaba:{status:'not_located',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Não localizada, até o corte, prova pública de execução física anterior a 04/07, cronograma original aplicável, OS/medição anterior ou vínculo emergencial específico.'},
    Lajedinho:{status:'not_located',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Não localizada, até o corte, prova pública de execução física anterior a 04/07, cronograma original aplicável, OS/medição anterior ou vínculo emergencial específico.'},
    Lapão:{status:'not_located',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Não localizada, até o corte, prova pública de execução física anterior a 04/07, cronograma original aplicável, OS/medição anterior ou vínculo emergencial específico.'},
    Macajuba:{status:'not_located',instrumentPublishedAt:'2026-06-20',physicalExecution:'not_located',prefixedSchedule:'not_located',note:'Instrumento publicado antes de 04/07. Não localizada, até o corte, prova pública de execução física anterior a 04/07, cronograma original aplicável, OS/medição anterior ou vínculo emergencial específico.'},
  };
  const housingAudit = housingTargets.map((municipality) => {
    const payment = intelligence.find((item) => item.kind === 'financial_record' && item.municipality === municipality && (item.tags || []).includes('habitação'));
    const analytical = intelligence
      .filter((item) => item.kind === 'research_finding' && item.municipality === municipality && (item.tags || []).includes('habitacao'))
      .sort((a,b) => priorityWeight(b.priority)-priorityWeight(a.priority) || b.evidenceLevel.localeCompare(a.evidenceLevel))[0];
    const gap = Boolean(analytical?.recordId.includes('GAP'));
    const raw = analytical?.raw || {};
    const rawString = (key: string) => typeof raw[key] === 'string' ? String(raw[key]) : null;
    const rawNumber = (key: string) => typeof raw[key] === 'number' ? Number(raw[key]) : null;
    return {
      municipality,
      paymentRecordId: payment?.recordId || null,
      paymentDate: payment?.eventDate || null,
      paid: payment?.financial?.paid || 0,
      instrumentNumber: typeof payment?.raw?.instrumentNumber === 'string' ? payment.raw.instrumentNumber : null,
      findingRecordId: analytical?.recordId || null,
      findingTitle: analytical?.title || 'Aguardando cruzamento documental',
      evidenceLevel: analytical?.evidenceLevel || payment?.evidenceLevel || 'L1',
      priority: analytical?.priority || payment?.priority || 'medium',
      status: (gap ? 'lacuna' : analytical ? 'corroborado' : 'triagem') as 'lacuna' | 'corroborado' | 'triagem',
      exceptionDocumented: housingExceptionTest[municipality]?.status === 'documented',
      exceptionStatus: housingExceptionTest[municipality]?.status || 'not_located',
      exceptionNote: housingExceptionTest[municipality]?.note || null,
      instrumentPublishedAt: housingExceptionTest[municipality]?.instrumentPublishedAt || null,
      physicalExecutionStatus: housingExceptionTest[municipality]?.physicalExecution || 'not_located',
      prefixedScheduleStatus: housingExceptionTest[municipality]?.prefixedSchedule || 'not_located',
      procurementDate: rawString('procurementDate'),
      procurementStatus: rawString('procurementStatus'),
      procurementControl: rawString('procurementControl'),
      procurementValue: rawNumber('procurementValue'),
      supplier: rawString('supplier'),
      supplierCnpj: rawString('supplierCnpj'),
      electoralCrossmatch: rawString('electoralCrossmatch') || 'not_run',
      electoralCrossmatchNote: rawString('electoralCrossmatchNote'),
      sourceUrl: analytical?.provenance?.sourceUrl || payment?.provenance?.sourceUrl || null,
    };
  });
  const housingCorroborated = housingAudit.filter((item)=>item.status==='corroborado').length;
  const housingGaps = housingAudit.filter((item)=>item.status==='lacuna').length;
  const archivedSourceBytes = sourceArchives.reduce((sum,item)=>sum + item.size,0);
  const validSourceCertificates = sourceArchives.filter(verifySourceArchiveRecord).length;
  const sourceArchivesWithVerification = sourceArchives.map((item)=>({ ...item, certificateValid: verifySourceArchiveRecord(item) }));
  const gitPreservations = [{
    ...fiplanPreservation,
    repositoryCommit: '5a5a17c79338233a15b174f4eb3b4a1a4a70c9a0',
    repositoryUrl: 'https://github.com/davidazevedo/observatorio-eleitoral-ba-2026/commit/5a5a17c79338233a15b174f4eb3b4a1a4a70c9a0',
  }];
  const versionedRows = fiplanPreservation.extraction.result.instruments + fiplanPreservation.extraction.result.payments;

  const sources = [
    ...sourceCatalog.map((item) => ({
      id: item.id,
      name: item.title,
      organization: item.organization,
      category: item.group,
      url: item.href,
      access: 'portal',
      scope: 'Catálogo editorial',
      capabilities: [item.summary],
      origin: 'editorial',
    })),
    ...researchSourceRegistry.map((item) => ({ ...item, origin: 'research_registry' })),
    ...ingestedSources.map((item) => ({
      id: item.recordId,
      name: item.title,
      organization: item.provenance?.publisher || 'Fonte ingerida',
      category: item.kind,
      url: item.provenance?.sourceUrl || '',
      access: item.provenance?.method || 'api',
      scope: item.municipality || item.state || 'Não informado',
      capabilities: item.tags || [],
      origin: 'ingested',
    })),
  ];

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      submissions: submissions.length,
      identified,
      anonymous,
      evidenceFiles: evidenceBlobs.length,
      evidenceBytes: totalEvidenceBytes,
      municipalities: allMunicipalities.size,
      categories: new Set(submissions.map((item) => item.category.trim()).filter(Boolean)).size,
      publicCases: publicCases.length,
      intelligenceRecords: intelligence.length,
      researchFindings: findings.length,
      sourceInventory: sources.length,
      archivedSources: sourceArchives.length,
      archivedSourceBytes,
      validSourceCertificates,
      housingCorroborated,
      housingGaps,
      versionedDatasets: gitPreservations.length,
      versionedRows,
      versionedPaid: fiplanPreservation.extraction.result.paidBRL,
      entities: entities.length,
      relationships: relationships.length + relationshipRecords.length,
      highPriority: highPriority.length,
      dynamicIntelligence: dynamicIntelligence.length,
      reviewedIntelligence: reviewedIntelligence.length,
      promotedIntelligence: promotedIntelligence.length,
      triagePendingIntelligence: triagePendingIntelligence.length,
      withEvidence,
      withEventDate,
      missingReferencedEvidence: missingReferencedEvidence.length,
      orphanEvidence: orphanEvidence.length,
    },
    rankings: {
      municipalities: municipalityRanking,
      categories: categoryRanking,
      statuses: statusRanking,
      verificationLevels: levelRanking,
      intelligenceKinds: kindRanking,
      sourcePublishers: publisherRanking,
      dailySubmissions,
    },
    quality: {
      evidenceCoverage: submissions.length ? Math.round((withEvidence / submissions.length) * 100) : 0,
      eventDateCoverage: submissions.length ? Math.round((withEventDate / submissions.length) * 100) : 0,
      intelligenceWithSource: intelligence.length
        ? Math.round((intelligence.filter((item) => Boolean(item.provenance?.sourceUrl)).length / intelligence.length) * 100)
        : 0,
      intelligenceWithMunicipality: intelligence.length
        ? Math.round((intelligence.filter((item) => Boolean(item.municipality)).length / intelligence.length) * 100)
        : 0,
      missingReferencedEvidence,
      orphanEvidence: orphanEvidence.map((blob) => ({
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt instanceof Date ? blob.uploadedAt.toISOString() : String(blob.uploadedAt),
      })),
    },
    financial: finance,
    submissions,
    publicCases,
    intelligence,
    findings,
    entities,
    relationships,
    queue,
    sources,
    sourceArchives: sourceArchivesWithVerification,
    gitPreservations,
    housingAudit,
    municipalityCohort69,
    municipalityUniverse77,
    centralEvidenceWave01,
    p0Triage36,
    centralEvidenceWave02,
    centralEvidenceWave03,
    p0ComidaNoPratoControl,
    p0InfrastructureControl,
    ireceP0DeepScan,
    p0RuralMarketGaps,
    p0ClassificationCoverage,
    prebaPackagesIndex,
    prebaLajedoPackage,
    prebaBeloCampoPackage,
    prebaAracasPackage,
    prebaJaguaquaraPackage,
    prebaFinalRepresentation,
    prebaFinalAnnexIndex,
    prebaProtocolRelease,
    followMoneyRoadmap,
    fm02DocumentaryLedger,
    fm02FiplanPrimaryRows,
    fm03FinancialChains,
    fm03PncpOfficialSnapshots,
    fm03PncpItemsHistory,
    fm03PncpItemHistoryEvidence,
    fm03MunicipalSources,
    centralEvidenceLedgerSummary: {
      registryId: centralEvidenceLedger.registryId,
      versioned: centralEvidenceLedger.totalUniqueFacts,
      mirrored: intelligence.filter(item =>
        item.recordOrigin === 'ingested' &&
        /^CE-\d{3}$/.test(item.recordId) &&
        item.provenance?.collector === 'oe-ba-central-evidence-ledger-v1'
      ).length,
      sourceOriginalsBundled: false,
    },
  };
}
