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
type PriorityUniverseMunicipality = CohortMunicipality & { sourceGroup:string };
type MunicipalityUniverse77 = { schemaVersion:number;universeId:string;createdAt:string;methodology:{statement:string;legacyExpansionDataset:string;housingCoreMunicipalities:string[]};counts:{totalMunicipalities:number;housingCore:number;expansionMunicipalities:number;expansionP0Municipalities:number;territoryIreceMunicipalities:number;cumulativeCentralEvidence:number};municipalities:PriorityUniverseMunicipality[] };
type CentralEvidenceWave = { schemaVersion:number;manifestId:string;generatedAt:string;purpose:string;countingPolicy:string;counts:{total:number;housingCore:number;expansionFinancialFacts:number;expansionFinancialExposureBRL:number};legalBoundary:string;items:CentralEvidenceItem[] };
type P0TriageRow = { municipality:string; instrument:string; agency:string; category:string; object:string; published:string; payment:string; paidBRL:number; instrumentValueBRL:number; publishedBeforeCutoff:boolean; daysPublicationBeforeCutoff:number; daysPaymentAfterCutoff:number; priority:string; flag:string };
type P0Triage36 = { schemaVersion:number;batchId:string;generatedAt:string;cutoffDate:string;scope:{municipalities:number;instruments:number;defesoPaidBRL:number};methodology:{statement:string;legalTest:string[];boundary:string};summary:{instrumentsPublishedBeforeCutoff:number;instrumentsPublishedOnOrAfterCutoff:number;criticalMunicipalities:string[];urgentFocus:string[]};deepDiveFacts:Record<string,{status:string;assessment:string}>;instruments:P0TriageRow[] };
type CentralEvidenceWave02 = { schemaVersion:number;manifestId:string;generatedAt:string;previousWave:string;countingPolicy:string;counts:{newEvidence:number;cumulativeCentralEvidence:number};items:Array<{id:string;municipality:string;type:string;status:string;title:string;source:string;sourceUrl:string;relationToPriorEvidence?:string;legalConclusion:string}>;boundary:string };
type CentralEvidenceWave03 = { schemaVersion:number;manifestId:string;generatedAt:string;previousWave:string;countingPolicy:string;counts:{newEvidence:number;cumulativeCentralEvidence:number};items:Array<{id:string;municipality:string;type:string;status:string;title:string;source:string;sourceUrl:string;boundary?:string;legalConclusion:string}>;boundary:string };
type ComidaControlCase = { municipality:string;fiplanInstrument:string;fiplanPaymentDate:string;fiplanPaidBRL:number;program:string;municipalAgreement:string;linkage:string;evidence:Array<{date:string;type:string;fact:string}>;status:string;assessment:string };
type P0ComidaControl = { schemaVersion:number;batchId:string;generatedAt:string;purpose:string;methodology:{rule:string;states:Record<string,string>};cases:ComidaControlCase[];nextActions:string[] };
type InfrastructureControlCase = { municipality:string;fiplanInstrument:string;stateAgreement:string;fiplanPaymentDate:string;fiplanPaidBRL:number;object:string;procurement:Record<string,unknown>;physicalExecution:Array<{date:string;type:string;fact:string;sourceUrl?:string}>;status:string;assessment:string };
type P0InfrastructureControl = { schemaVersion:number;batchId:string;generatedAt:string;purpose:string;methodology:{rule:string;states:Record<string,string>};cases:InfrastructureControlCase[];nextActions:string[] };
type IreceP0Case = { municipality:string;fiplanInstrument?:string;fiplanInstruments?:Array<{instrument:string;paymentDate:string;paidBRL:number;object:string}>;paymentDate?:string;paidBRL?:number;object?:string;procurement?:string;contract?:string;supplierCnpj?:string;preCutoffContract:boolean|null;preCutoffPhysicalExecution:string;status:string;assessment:string;marketProcurement?:Record<string,unknown>;animalCenterProcurement?:Record<string,unknown> };
type IreceP0DeepScan = { schemaVersion:number;batchId:string;generatedAt:string;territory:string;scope:{officialMunicipalities:number;p0Municipalities:string[];p0Count:number;remainingTerritorialTriage:number};methodology:{rule:string;chain:string};cases:IreceP0Case[];territoryNextActions:string[] };
type RuralMarketGapCase = { municipality:string;fiplanInstrument?:string;fiplanInstruments?:Array<{instrument:string;agreement:string;paymentDate:string;paidBRL:number;object:string}>;stateAgreement?:string;paymentDate?:string;paidBRL:number;instrumentValueBRL?:number;object?:string;linkage?:string;municipalRevenueCorroboration?:{sourceUrl:string;facts:string[]};procurement:string;contract:string;serviceOrder:string;measurement:string;status:string;assessment:string };
type P0RuralMarketGaps = { schemaVersion:number;batchId:string;generatedAt:string;purpose:string;methodology:{rule:string;statusDefinition:string};cases:RuralMarketGapCase[] };
type P0ClassificationCoverage = { schemaVersion:number;batchId:string;generatedAt:string;coverage:{classifiedMunicipalities:number;totalP0Municipalities:number;percent:number};counts:Record<string,number>;interpretation:Record<string,string>;municipalities:Array<{municipality:string;status:string;assessment:string}> };
type PrebaPackageIndex = { schemaVersion:number;indexId:string;generatedDate:string;purpose:string;methodologicalBoundary:string;packages:Array<{order:number;packageId:string;municipality:string;priority:string;status:string;protocolReady:boolean;structuredData?:string;humanReadable?:string;coreEvidence?:string[];mainBlockers?:string[];focus?:string}> };
type PrebaLajedoPackage = { schemaVersion:number;packageId:string;generatedDate:string;purpose:string;municipality:string;state:string;status:string;protocolReadiness:string;classification:string;legalBoundary:string;coreQuestion:string;financial:{agreementValueBRL:number;firstInstallmentBRL:number;criticalPeriodPaymentBRL:number;paymentDate:string};chronology:Array<{date:string;event:string;evidentiaryRole:string;sourceId:string;note?:string}>;evidenceMatrix:Array<{evidenceId:string;type:string;assertion:string;whatItProves:string;whatItDoesNotProve:string;source:string;integrityStatus:string}>;apparentIncompatibility:{status:string;statement:string;legalConclusion:string};documentGaps:Array<{priority:string;document:string;reason:string}>;requestedDiligences:Array<{recipient:string;request:string}>;protocolGate:{ready:boolean;minimumToClose:string[];recommendedUseNow:string} };
type PrebaBeloCampoPackage = { schemaVersion:number;packageId:string;generatedDate:string;purpose:string;municipality:string;state:string;status:string;protocolReadiness:string;classification:string;legalBoundary:string;coreQuestion:string;financial:{agreementValueBRL:number;stateContributionBRL:number;municipalCounterpartBRL:number;criticalPeriodPaymentBRL:number;paymentDate:string};chronology:Array<{date:string;event:string;evidentiaryRole:string;sourceId:string;note?:string}>;evidenceMatrix:Array<{evidenceId:string;type:string;assertion:string;whatItProves:string;whatItDoesNotProve:string;source:string;integrityStatus:string}>;apparentIncompatibility:{status:string;statement:string;legalConclusion:string};documentGaps:Array<{priority:string;document:string;reason:string}>;requestedDiligences:Array<{recipient:string;request:string}>;protocolGate:{ready:boolean;minimumToClose:string[];recommendedUseNow:string} };
type PrebaAracasPackage = { schemaVersion:number;packageId:string;generatedDate:string;purpose:string;municipality:string;state:string;status:string;protocolReadiness:string;classification:string;legalBoundary:string;coreQuestion:string;financial:{agreementValueBRL:number;firstInstallmentBRL:number;locatedCriticalPeriodPaymentBRL:number;locatedPaymentDate:string;paymentMatchesFirstInstallment:boolean};chronology:Array<{date:string;event:string;evidentiaryRole:string;sourceId:string;note?:string}>;evidenceMatrix:Array<{evidenceId:string;type:string;assertion:string;whatItProves:string;whatItDoesNotProve:string;source:string;integrityStatus:string}>;apparentIncompatibility:{status:string;statement:string;legalConclusion:string};documentGaps:Array<{priority:string;document:string;reason:string}>;requestedDiligences:Array<{recipient:string;request:string}>;protocolGate:{ready:boolean;minimumToClose:string[];recommendedUseNow:string} };
type PrebaJaguaquaraPackage = { schemaVersion:number;packageId:string;generatedDate:string;purpose:string;municipality:string;state:string;status:string;protocolReadiness:string;classification:string;legalBoundary:string;coreQuestion:string;financial:{instrumentValueBRL:number;stadiumPaymentBRL:number;stadiumPaymentDate:string;municipalRevenueCorroboratedBRL:number;totalJaguaquaraCriticalPeriodPaymentsBRL:number;otherKnownCriticalPeriodPaymentBRL:number;separationRule:string};chronology:Array<{date:string;event:string;evidentiaryRole:string;sourceId:string;note?:string}>;evidenceMatrix:Array<{evidenceId:string;type:string;assertion:string;whatItProves:string;whatItDoesNotProve:string;source:string;integrityStatus:string}>;apparentIncompatibility:{status:string;statement:string;legalConclusion:string};documentGaps:Array<{priority:string;document:string;reason:string}>;requestedDiligences:Array<{recipient:string;request:string}>;protocolGate:{ready:boolean;minimumToClose:string[];recommendedUseNow:string} };
type PrebaFinalRepresentation = { schemaVersion:number;representationId:string;generatedDate:string;destination:string;documentType:string;title:string;protocolReadiness:{readyAsNewsOfFactForDiligence:boolean;readyAsDefinitiveAccusation:boolean;reason:string};scope:{priorityUniverseMunicipalities:number;p0Classified:number;p0CoveragePercent:number;centralVersionedEvidence:number;priorityPackages:number;municipalities:string[]};legalBoundary:string;executiveSummary:string;cases:Array<{order:number;packageId:string;municipality:string;priority:string;question:string;coreEvidence:string[];status:string;mainDiligence:string}>;requestedMeasures:string[];finalReviewChecklist:string[] };
type PrebaFinalAnnexIndex = { schemaVersion:number;indexId:string;representationId:string;generatedDate:string;annexes:Array<{order:number;id:string;title:string;path:string;humanReadable?:string;purpose:string}>;protocolFolderOrder:string[];finalGate:{readyForNewsOfFactProtocol:boolean;pendingBeforeDefinitiveAccusation:string[]} };
type FollowMoneyRoadmap = { schemaVersion:number;roadmapId:string;updatedDate:string;startDate:string;endDate:string;scope:{priorityMunicipalities:string[];centralEvidenceFacts:number;priorityMunicipalitiesCount:number;universe77:boolean};stages:Array<{id:string;title:string;start:string;end:string;status:string;deliverables:string[];gate:string}>;evidenceSync:{repositoryRecords:number;apiServedConfirmed:number;privateBlobMirroredConfirmed:number;mode:string;lastSuccessfulSync:string|null};externalOriginals:{fiplanZipPreserved:boolean;upstreamSourcePdfVerifiedInThisStage:boolean} };
type Fm02Case = {caseId:string;municipality:string;identifiers:Record<string,unknown>;financial:Record<string,unknown>;chronology:Array<{date:string;event:string;sourceId:string}>;primaryFiplanSliceId:string;sources:string[];p0Gaps:Array<{priority:string;document:string;reason:string}>;p1Gaps:Array<{priority:string;document:string;reason:string}>;requests:Array<{recipient:string;request:string}>;legalBoundary:string;completenessState:string};
type Fm02Source = {sourceId:string;municipality:string;url:string;publisher:string;linkedEvidenceIds:string[];preservationStatus:string;contentSnapshotSha256:string|null;originalBytesInRepository:boolean;notes:string};
type Fm02Ledger = {schemaVersion:number;ledgerId:string;registeredDate:string;phase:string;phaseStatus:string;totalCases:number;totalFinancialPrimaryRows:number;totalSourceReferences:number;verifiedSourceArchiveInThisStage:{fiplanFilteredPaymentsInGit:boolean;externalOfficialPdfBinaryCount:number;additionalExternalWebBinaryCount:number};safeguards:Record<string,string>;cases:Fm02Case[];sources:Fm02Source[];protocolReadiness:string};
type Fm02Row = {evidenceSliceId:string;crossReferences:string[];caseId:string;municipality:string;instrumentFormatted:string;paymentNobFormatted:string;paymentDateDDMMYYYY:string;paymentValueBRL:number;legalConclusion:string};
type Fm02Financial = {schemaVersion:number;artifactId:string;source:{path:string;sha256Gzip:string;sha256Uncompressed:string;totalSourceRows:number};records:Fm02Row[]};
type Fm03Step = {slot:string;state:string;amountBRL:number|null;date:string|null;reference:string|null;sourcePath:string|null;sourceSha256:string|null;qualification:string};
type Fm03Chain = {chainId:string;caseId:string;municipality:string;inst:string;bankOrder:string;observedStateDisbursementBRL:number;steps:Fm03Step[];status:string;action:string;contextFacts:Array<{kind:string;date:string;evidenceId:string;caveat:string}>};
type Fm03Index = {schemaVersion:number;registryId:string;createdDate:string;status:string;counting:{chains:number;stateDisbursementsVerified:number;municipalRevenuePublicCorroborations:number;bankIngressFullyReconciled:number;verifiedMunicipalExpenseEntries:number;verifiedSupplierPayments:number;verifiedCampaignRelatedPayments:number;newCentralCE:number;totalStateDisbursementsBRL:number};chains:Fm03Chain[];nonConclusions:string[]};
type Fm03FiscalPortal = {schemaVersion:number;id:string;caseId:string;municipality:string;category:string;url:string;scope:string;preservation:{targetId:string;rawFilePublicGitAllowed:boolean;status:string;sha256:string|null;githubManifestPath:string};extraction:{filterYear:number;financialLinkVerified:boolean};supplierPaymentVerified:boolean;notASeparateCentralEvidence:boolean};
type Fm03FiscalCase = {caseId:string;agreement:string;sei:string;paymentNob:string;amountBRL:number;date:string;associatedPortalIds:string[];requests:string[];requestStatus:string;proofStatus:string};
type Fm03FiscalRegistry = {schemaVersion:number;registryId:string;registeredDate:string;status:string;totalMunicipalities:number;totalSourceReferences:number;verifiedSupplierPaymentsFoundInThisStage:number;newCentralCE:number;privacyRule:string;cases:Fm03FiscalCase[];sources:Fm03FiscalPortal[]};
type Fm03PncpItem = {schemaVersion:number;id:string;caseId:string;municipality:string;corroboratesExistingCE:string;rawSnapshotPath:string;sourceSha256:string;pncpControlNumber:string;procurementNumber:string;process:string;object:string;publicationDateTime:string;proposalDeadlineDateTime:string;estimatedValueBRL:number;homologatedValueBRL:number|null;resultRegisteredInRecord:boolean;procurementState:string;sourceModelLimit:string;supplierIdentifiedInThisRecord:boolean;supplierPaymentVerified:boolean};
type Fm03PncpIndex = {schemaVersion:number;registryId:string;count:number;newCentralCE:number;entries:Fm03PncpItem[];disputedSemantics:string};
type Fm03PncpFollowUp = {schemaVersion:number;registryId:string;status:string;metrics:{targetsAdded:number;casesCovered:number;itemsObtained:number;historyResponsesObtained:number;verifiedSupplierAwards:number;verifiedSupplierPayments:number;newCentralCE:number};accessPoints:Array<{caseId:string;municipality:string;id:string;sourceUrl:string;operation:string;contentStatus:string;sha256:string|null;originalBytesPreserved:boolean}>;cautions:string[]};
type Fm03PncpValidatedEvidence = {schemaVersion:number;registryId:string;status:string;counts:{cases:number;originalDocumentsVerifiedByManifest:number;itemsFound:number;historyEventsFound:number;resultQueriesRegistered:number;resultQueriesCollected:number;supplierPaymentsProven:number;newCentralCE:number};batches:Array<{caseId:string;municipality:string;items:{count:number;normalizedFacts:Array<{numeroItem:number;valorTotalEstimadoBRL:number;situacaoNaCaptura:string;temResultadoNoRegistro:boolean}>};history:{count:number};resultQuery:{url:string;status:string}}>};
type Fm03PncpReceiptIndex = {schemaVersion:number;registryId:string;captureRunId:number;officialResultsReturnedWithData:number;receipts:Array<{id:string;caseId:string;municipality:string;httpStatus:number;sha256:string;bodyBytes:number;resultsCanBeInterpreted:boolean}>;note:string;verifiedSupplierPayments:number;newCentralCE:number};
type Fm03LinkedContract = {schemaVersion:number;id:string;caseId:string;municipality:string;relatedCentralCE:string;pncpControlNumber:string;source:{authority:string;documentation:string;endpoint:string;targetId:string;expectedManifest:string};status:string;resultEvidence:{httpStatus:number|null;bodySha256:string|null;rawSnapshotPath:string|null;contractIdentifiers:string[];supplierIdentifiers:string[];verifiedFinancialDisbursements:number};interpretationBoundary:string};
type Fm03LinkedContracts = {registryId:string;status:string;counts:{cases:number;endpointTargets:number;officialCapturesAnalyzed:number;verifiedContractors:number;verifiedSupplierPayments:number;newCentralCE:number};targets:Fm03LinkedContract[];sourceManual:string};
type CentralEvidenceLedgerSummary = {registryId:string;versioned:number;mirrored:number;sourceOriginalsBundled:boolean};
type PrebaProtocolRelease = { schemaVersion:number;releaseId:string;generatedDate:string;status:string;globalCompletionPercent:number;destination:string;representative:string;documentType:string;definitiveAccusationReady:boolean;protocolChannel:{citizen:string;existingProceeding:string;institutionalPage:string;attendancePage:string;preAddress:string;phones:string[]};artifacts:{mainEditable:string;mainPdf:string;combinedPdf:string;zip:string;annexIndex:string;checklist:string;checksumManifest:string};qa:{mainDocumentPages:number;combinedPackagePages:number;annexesRendered:number;docxVisualReview:string;pdfRenderReview:string;runtimeErrorsAtPortalRelease:number};annexRule:string;finalBoundary:string };

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
    dynamicIntelligence: number; reviewedIntelligence: number; promotedIntelligence: number; triagePendingIntelligence: number;
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
  municipalityUniverse77: MunicipalityUniverse77;
  centralEvidenceWave01: CentralEvidenceWave;
  p0Triage36: P0Triage36;
  centralEvidenceWave02: CentralEvidenceWave02;
  centralEvidenceWave03: CentralEvidenceWave03;
  p0ComidaNoPratoControl: P0ComidaControl;
  p0InfrastructureControl: P0InfrastructureControl;
  ireceP0DeepScan: IreceP0DeepScan;
  p0RuralMarketGaps: P0RuralMarketGaps;
  p0ClassificationCoverage: P0ClassificationCoverage;
  prebaPackagesIndex: PrebaPackageIndex;
  prebaLajedoPackage: PrebaLajedoPackage;
  prebaBeloCampoPackage: PrebaBeloCampoPackage;
  prebaAracasPackage: PrebaAracasPackage;
  prebaJaguaquaraPackage: PrebaJaguaquaraPackage;
  prebaFinalRepresentation: PrebaFinalRepresentation;
  prebaFinalAnnexIndex: PrebaFinalAnnexIndex;
  prebaProtocolRelease: PrebaProtocolRelease;
  followMoneyRoadmap: FollowMoneyRoadmap;
  fm02DocumentaryLedger: Fm02Ledger;
  fm02FiplanPrimaryRows: Fm02Financial;
  fm03FinancialChains: Fm03Index;
  fm03PncpOfficialSnapshots: Fm03PncpIndex;
  fm03PncpItemsHistory: Fm03PncpFollowUp;
  fm03PncpItemHistoryEvidence: Fm03PncpValidatedEvidence;
  fm03PncpResultReceipts: Fm03PncpReceiptIndex;
  fm03LinkedContracts: Fm03LinkedContracts;
  fm03MunicipalSources: Fm03FiscalRegistry;
  centralEvidenceLedgerSummary: CentralEvidenceLedgerSummary;
};

type Tab = 'overview' | 'submissions' | 'triage' | 'findings' | 'sources' | 'provenance' | 'housing' | 'expansion' | 'preba' | 'entities' | 'relations' | 'municipalities' | 'reports' | 'api';

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
function workflowStateFor(item: IntelligenceRecord) {
  if (item.review?.workflowState) return item.review.workflowState;
  if (item.status === 'ingested') return 'new';
  if (item.status === 'triage' || item.status === 'corroborating') return 'analyzing';
  if (item.status === 'rejected' || item.status === 'insufficient') return 'discarded';
  if (item.status === 'publishable' || item.status === 'referred') return 'promoted';
  return 'corroborated';
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
  const [triageOrigin,setTriageOrigin]=useState('ingested');
  const [workflowFilter,setWorkflowFilter]=useState('Todos');
  const [reviewRecordId,setReviewRecordId]=useState('');
  const [reviewWorkflow,setReviewWorkflow]=useState('analyzing');
  const [reviewClassification,setReviewClassification]=useState('unclassified');
  const [reviewLevel,setReviewLevel]=useState('L1');
  const [reviewPriority,setReviewPriority]=useState('medium');
  const [reviewMunicipality,setReviewMunicipality]=useState('');
  const [reviewCaseId,setReviewCaseId]=useState('');
  const [reviewNote,setReviewNote]=useState('');
  const [reviewMessage,setReviewMessage]=useState('');
  const [savingReview,setSavingReview]=useState(false);
  const [centralEvidenceSyncing,setCentralEvidenceSyncing]=useState(false);
  const [centralEvidenceMirrorCount,setCentralEvidenceMirrorCount]=useState(data.centralEvidenceLedgerSummary.mirrored);
  const [centralEvidenceSyncMessage,setCentralEvidenceSyncMessage]=useState('');
  const [fm02ArchivingSource,setFm02ArchivingSource]=useState('');
  const [fm02ArchivedById,setFm02ArchivedById]=useState<Record<string,{sha256:string;path:string}>>({});
  const [fm02ArchiveMessage,setFm02ArchiveMessage]=useState('');

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
    ...data.municipalityUniverse77.municipalities.map((item)=>item.name),
    ...data.intelligence.map((item)=>item.municipality||''),
    ...data.submissions.map((item)=>item.municipality||''),
  ].filter(Boolean))).sort((a,b)=>a.localeCompare(b,'pt-BR')),[data.municipalityUniverse77,data.intelligence,data.submissions]);

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

  const triageRecords = useMemo(() => visibleIntel.filter((item) => {
    if (triageOrigin === 'ingested' && item.recordOrigin !== 'ingested') return false;
    if (workflowFilter !== 'Todos' && workflowStateFor(item) !== workflowFilter) return false;
    return true;
  }), [visibleIntel,triageOrigin,workflowFilter]);

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

  const priorityUniverseMunicipalities=useMemo(()=>{
    const counts=new Map(filteredMunicipalities.map((item)=>[item.label,item.count]));
    return data.municipalityUniverse77.municipalities
      .map((item)=>({...item,count:counts.get(item.name)||0}))
      .sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  },[data.municipalityUniverse77,filteredMunicipalities]);

  const filteredFinance=useMemo(()=>financialTotalsFor(filteredIntelligence),[filteredIntelligence]);

  const filteredQueue=useMemo(()=>filteredIntelligence.filter((item)=>['ingested','triage','corroborating'].includes(item.status)).slice(0,50),[filteredIntelligence]);

  const activeFilterCount=[
    globalQuery, municipalityFilter!=='Todos'?municipalityFilter:'', dateFrom,dateTo,
    evidenceFilter!=='Todos'?evidenceFilter:'',priorityFilter!=='Todos'?priorityFilter:'',
    statusFilter!=='Todos'?statusFilter:'',publisherFilter!=='Todos'?publisherFilter:'',
    paymentFilter!=='Todos'?paymentFilter:'',minAmount,maxAmount,
  ].filter(Boolean).length;

  async function archiveFm02Source(item:Fm02Source){
    if(fm02ArchivingSource)return;
    setFm02ArchivingSource(item.sourceId);
    setFm02ArchiveMessage('Coletando '+item.sourceId+' em armazenamento privado...');
    try{
      const response=await fetch('/api/private/source-archive',{
        method:'POST',credentials:'same-origin',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
          url:item.url,sourceId:item.sourceId,
          title:'FM02 '+item.municipality+' · '+item.sourceId,
          publisher:item.publisher,
          notes:['FM-02: cópia privada da fonte pública, não constitui prova de ilícito','Fonte localizada no registro FM02; conferir conteúdo efetivo e integridade antes do protocolo'],
        }),
      });
      const result=await response.json();
      if(!response.ok || !result.ok || !result.record?.sha256)throw new Error(result.error||'Falha na preservação');
      setFm02ArchivedById(prev=>({...prev,[item.sourceId]:{sha256:result.record.sha256,path:result.record.rawBlobPath}}));
      setFm02ArchiveMessage(item.sourceId+' arquivada com SHA-256 '+result.record.sha256+'. Preservado no Blob privado.');
    }catch(error){
      setFm02ArchiveMessage(item.sourceId+' não arquivada: '+(error instanceof Error?error.message:'falha inesperada'));
    }finally{setFm02ArchivingSource('');}
  }

  async function synchronizeCentralEvidence(){
    setCentralEvidenceSyncing(true);
    setCentralEvidenceSyncMessage('Iniciando espelhamento dos registros CE no Blob privado...');
    try {
      const response=await fetch('/api/private/central-evidence-sync',{
        method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:'{}',
      });
      const result=await response.json();
      if(!response.ok || !result.ok){
        const partial=(result.created||0)+(result.unchanged||0);
        setCentralEvidenceMirrorCount(Math.max(centralEvidenceMirrorCount,partial));
        setCentralEvidenceSyncMessage('Sincronização parcial: '+partial+'/'+(result.requested||57)+'; conflitos '+(result.conflicts||0)+'; erros '+(result.errors||0)+'. Conferir logs antes de repetir.');
      } else {
        setCentralEvidenceMirrorCount(result.created+result.unchanged);
        setCentralEvidenceSyncMessage('Espelhamento concluído: '+result.created+' novos e '+result.unchanged+' já existentes. Recarregue a página para atualizar as métricas globais.');
      }
    } catch(error) {
      setCentralEvidenceSyncMessage('Falha na comunicação com a API: '+(error instanceof Error?error.message:'erro desconhecido'));
    } finally {
      setCentralEvidenceSyncing(false);
    }
  }

  function clearAnalyticalFilters(){
    setGlobalQuery('');setMunicipalityFilter('Todos');setDateFrom('');setDateTo('');
    setEvidenceFilter('Todos');setPriorityFilter('Todos');setStatusFilter('Todos');
    setPublisherFilter('Todos');setPaymentFilter('Todos');setMinAmount('');setMaxAmount('');
    setSortBy('priority');
  }


  function openReview(item: IntelligenceRecord) {
    setReviewRecordId(item.recordId);
    setReviewWorkflow(workflowStateFor(item));
    setReviewClassification(item.review?.classification || 'unclassified');
    setReviewLevel(item.evidenceLevel);
    setReviewPriority(item.priority);
    setReviewMunicipality(data.municipalityUniverse77.municipalities.some((row)=>row.name===item.municipality) ? (item.municipality || '') : '');
    setReviewCaseId(item.review?.linkedCaseId || item.caseIds?.[0] || '');
    setReviewNote(item.review?.note || '');
    setReviewMessage('');
  }

  async function saveReview() {
    if (!reviewRecordId) return;
    setSavingReview(true); setReviewMessage('');
    try {
      const response=await fetch('/api/private/intelligence-review',{
        method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({recordId:reviewRecordId,workflowState:reviewWorkflow,classification:reviewClassification,evidenceLevel:reviewLevel,priority:reviewPriority,municipality:reviewMunicipality,caseId:reviewCaseId,note:reviewNote}),
      });
      const payload=await response.json();
      if(!response.ok) throw new Error(payload?.error||'Falha ao registrar revisão.');
      setReviewMessage(`Revisão registrada: ${payload.event.eventId}`);
      window.setTimeout(()=>window.location.reload(),650);
    } catch(error) { setReviewMessage(error instanceof Error?error.message:'Falha ao registrar revisão.'); }
    finally { setSavingReview(false); }
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
    { id: 'triage', label: 'Ingestão / Triagem', count: data.metrics.triagePendingIntelligence },
    { id: 'findings', label: 'Inteligência', count: data.metrics.intelligenceRecords },
    { id: 'sources', label: 'Fontes', count: data.metrics.sourceInventory },
    { id: 'provenance', label: 'Proveniência', count: data.metrics.archivedSources + data.metrics.versionedDatasets },
    { id: 'housing', label: 'Matriz Habitação', count: data.housingAudit.length },
    { id: 'expansion', label: 'Universo 77', count: data.municipalityUniverse77.counts.totalMunicipalities },
    { id: 'preba', label: 'Pacotes PRE-BA', count: data.prebaPackagesIndex.packages.length },
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
              <section className="private-panel" style={{border:'1px solid rgba(224,184,92,.5)'}}>
                <div className="private-panel-title">
                  <div>
                    <p className="eyebrow">CONSOLIDAÇÃO INVESTIGATIVA · 07/10/2026</p>
                    <h2>Os dados consolidados já estão disponíveis no cockpit.</h2>
                    <small>Esta é a visão operacional da expansão, evidências centrais, P0 e cobertura de Irecê.</small>
                  </div>
                  <div className="private-topbar-actions">
                    <button type="button" onClick={()=>setTab('expansion')}>Abrir Universo 77</button>
                    <button type="button" onClick={()=>setTab('api')}>Abrir Intel API</button>
                  </div>
                </div>
                <div className="intel-metrics-grid">
                  <article><span>Municípios no radar</span><strong>{data.municipalityUniverse77.counts.totalMunicipalities}</strong><small>8 núcleo + 69 expansão</small></article>
                  <article><span>P0 classificados</span><strong>{data.p0ClassificationCoverage.coverage.classifiedMunicipalities}/{data.p0ClassificationCoverage.coverage.totalP0Municipalities}</strong><small>{data.p0ClassificationCoverage.coverage.percent}% da fila financeira</small></article>
                  <article><span>Evidências centrais</span><strong>{data.centralEvidenceWave03.counts.cumulativeCentralEvidence}</strong><small>50 + {data.centralEvidenceWave02.counts.newEvidence} + {data.centralEvidenceWave03.counts.newEvidence}</small></article>
                  <article><span>Território de Irecê</span><strong>20/20</strong><small>cobertura territorial selecionada</small></article>
                  <article><span>Críticos</span><strong>{data.p0ClassificationCoverage.counts.critical_investigation||0}</strong><small>Lajedo do Tabocal · Belo Campo</small></article>
                  <article><span>Urgentes</span><strong>{data.p0ClassificationCoverage.counts.urgent_document_gap||0}</strong><small>Araçás · Jaguaquara</small></article>
                </div>
                <p className="private-report-note">A classificação é investigativa e não equivale a conclusão de ilícito. Use <strong>Universo 77</strong> para abrir as matrizes completas e <strong>Intel API</strong> para consultar os datasets publicados.</p>
              </section>

              <section className="intel-metrics-grid">
                <article><span>Denúncias</span><strong>{data.metrics.submissions}</strong><small>{data.metrics.anonymous} sem identificação · {data.metrics.identified} identificadas</small></article>
                <article><span>Registros Intel</span><strong>{data.metrics.intelligenceRecords}</strong><small>{data.metrics.researchFindings} achados analíticos</small></article>
                <article><span>Fontes</span><strong>{data.metrics.sourceInventory}</strong><small>catálogo + fontes de pesquisa + ingeridas</small></article>
                <article><span>Snapshots</span><strong>{data.metrics.archivedSources + data.metrics.versionedDatasets}</strong><small>Blob privado + datasets versionados no Git</small></article>
                <article><span>Municípios no radar</span><strong>{data.municipalityUniverse77.counts.totalMunicipalities}</strong><small>{data.municipalityUniverse77.counts.housingCore} núcleo + {data.municipalityUniverse77.counts.expansionMunicipalities} expansão</small></article>
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
                <div className="private-panel-title"><div><p className="eyebrow">FILA DE INVESTIGAÇÃO</p><h2>Próximos itens a trabalhar</h2></div><button className="intel-link-button" onClick={()=>setTab('triage')}>Abrir triagem →</button></div>
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

          {tab === 'triage' && (
            <>
              <section className="intel-metrics-grid">
                <article><span>Recebidos pela Intel API</span><strong>{data.metrics.dynamicIntelligence}</strong><small>registros preservados no Blob privado</small></article>
                <article><span>Pendentes de triagem</span><strong>{data.metrics.triagePendingIntelligence}</strong><small>novos ou em análise</small></article>
                <article><span>Revisados</span><strong>{data.metrics.reviewedIntelligence}</strong><small>com evento humano append-only</small></article>
                <article><span>Promovidos</span><strong>{data.metrics.promotedIntelligence}</strong><small>evidência dinâmica; não altera as 57 evidências versionadas</small></article>
              </section>
              <section className="private-panel">
                <div className="private-panel-title submissions-heading">
                  <div><p className="eyebrow">INTELLIGENCE TRIAGE & EVIDENCE PROMOTION</p><h2>Fila operacional da Intel API</h2><small className="filter-result-count">{triageRecords.length} registro(s) no recorte</small></div>
                  <div className="private-filters">
                    <select value={triageOrigin} onChange={(e)=>setTriageOrigin(e.target.value)}><option value="ingested">Somente Intel API</option><option value="all">Toda inteligência</option></select>
                    <select value={workflowFilter} onChange={(e)=>setWorkflowFilter(e.target.value)}><option>Todos</option>{['new','analyzing','corroborated','discarded','promoted'].map((v)=><option key={v}>{v}</option>)}</select>
                  </div>
                </div>
                <p className="private-report-note">O registro original permanece imutável. Cada decisão abaixo gera um novo evento de revisão com data/hora e ator da sessão privada. “Promovido” significa apto a integrar um pacote probatório interno; não significa ilícito comprovado nem altera automaticamente a contagem das 57 evidências centrais versionadas.</p>
                <div className="intel-record-list">
                  {triageRecords.length ? triageRecords.map((item)=>(
                    <details key={item.recordId} className="intel-record" open={reviewRecordId===item.recordId || undefined}>
                      <summary>
                        <span className={priorityClass(item.priority)}>{item.priority}</span>
                        <div><strong>{item.title}</strong><small>{item.recordId} · {item.kind} · {item.municipality||'sem município'} · origem: {item.recordOrigin||'legado'}</small></div>
                        <span className={levelClass(item.evidenceLevel)}>{item.evidenceLevel}</span>
                      </summary>
                      <div className="intel-record-body">
                        <p>{item.summary}</p>
                        <div className="intel-record-meta">
                          <div><span>Workflow</span><b>{workflowStateFor(item)}</b></div>
                          <div><span>Classificação</span><b>{item.review?.classification||'unclassified'}</b></div>
                          <div><span>Revisões</span><b>{item.review?.reviewCount||0}</b></div>
                          <div><span>Última revisão</span><b>{item.review?.reviewedAt?formatDate(item.review.reviewedAt):'—'}</b></div>
                        </div>
                        <div className="private-text-block"><small>PROVENIÊNCIA</small><p>{item.provenance?.publisher||'Fonte não informada'} · {item.provenance?.retrievedAt?formatDate(item.provenance.retrievedAt):'sem data de coleta'}{item.provenance?.checksum?` · SHA/checksum: ${item.provenance.checksum}`:''}</p></div>
                        {item.provenance?.sourceUrl?<a className="intel-source-link" href={item.provenance.sourceUrl} target="_blank" rel="noreferrer">Abrir fonte original ↗</a>:null}
                        <button type="button" className="intel-link-button" onClick={()=>openReview(item)}>{reviewRecordId===item.recordId?'Revisão aberta':'Classificar / promover'}</button>
                        {reviewRecordId===item.recordId?<div className="private-panel" style={{marginTop:'18px'}}>
                          <div className="analytic-filter-grid secondary">
                            <label><span>Estado</span><select value={reviewWorkflow} onChange={(e)=>setReviewWorkflow(e.target.value)}>{['new','analyzing','corroborated','discarded','promoted'].map((v)=><option key={v}>{v}</option>)}</select></label>
                            <label><span>Papel probatório</span><select value={reviewClassification} onChange={(e)=>setReviewClassification(e.target.value)}><option value="unclassified">não classificado</option><option value="documented_fact">fato documentado</option><option value="apparent_incompatibility">incompatibilidade aparente</option><option value="document_gap">lacuna documental</option><option value="lawful_explanation">hipótese explicativa lícita</option><option value="investigative_hypothesis">hipótese investigativa</option></select></label>
                            <label><span>Nível</span><select value={reviewLevel} onChange={(e)=>setReviewLevel(e.target.value)}>{['L0','L1','L2','L3','L4'].map((v)=><option key={v}>{v}</option>)}</select></label>
                            <label><span>Prioridade</span><select value={reviewPriority} onChange={(e)=>setReviewPriority(e.target.value)}>{['low','medium','high','urgent'].map((v)=><option key={v}>{v}</option>)}</select></label>
                            <label><span>Município do Universo 77</span><select value={reviewMunicipality} onChange={(e)=>setReviewMunicipality(e.target.value)}><option value="">Sem vínculo</option>{data.municipalityUniverse77.municipalities.map((row)=><option key={row.name} value={row.name}>{row.name}</option>)}</select></label>
                            <label><span>Caso / pacote</span><input value={reviewCaseId} onChange={(e)=>setReviewCaseId(e.target.value)} placeholder="ex.: PREBA-LAJEDO-01" /></label>
                          </div>
                          <label style={{display:'grid',gap:'6px',marginTop:'12px'}}><span>Nota de revisão</span><textarea rows={4} value={reviewNote} onChange={(e)=>setReviewNote(e.target.value)} placeholder="O que foi verificado, qual lacuna permanece e por que o estado foi escolhido." /></label>
                          <div style={{display:'flex',gap:'10px',alignItems:'center',marginTop:'12px',flexWrap:'wrap'}}><button type="button" className="source-archive-button" disabled={savingReview} onClick={saveReview}>{savingReview?'Registrando…':reviewWorkflow==='promoted'?'Promover para evidência':'Registrar revisão'}</button>{reviewMessage?<span>{reviewMessage}</span>:null}</div>
                          {reviewWorkflow==='promoted'?<p className="private-report-note">Guardrails: promoção exige município do Universo 77, classificação diferente de “não classificado”, nível L2–L4 e URL de fonte ou checksum de proveniência.</p>:null}
                        </div>:null}
                        {(item.reviewHistory||[]).length?<div className="private-text-block" style={{marginTop:'16px'}}><small>HISTÓRICO DE REVISÃO</small><div className="intel-queue">{item.reviewHistory?.slice().reverse().map((event)=><div key={event.eventId}><span className={levelClass(event.evidenceLevel)}>{event.evidenceLevel}</span><div><strong>{event.workflowState} · {event.classification}</strong><small>{formatDate(event.createdAt)} · {event.actor}{event.caseId?` · ${event.caseId}`:''}</small></div><span className={priorityClass(event.priority)}>{event.priority}</span></div>)}</div></div>:null}
                      </div>
                    </details>
                  )):<p>Nenhum registro correspondente. Novos registros enviados por <code>/api/intelligence/ingest</code> aparecerão aqui automaticamente.</p>}
                </div>
              </section>
            </>
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
              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">COBERTURA SUBSTANTIVA P0</p><h2>{data.p0ClassificationCoverage.coverage.classifiedMunicipalities}/{data.p0ClassificationCoverage.coverage.totalP0Municipalities} municípios classificados</h2><small>{data.p0ClassificationCoverage.coverage.percent}% da primeira fila financeira já recebeu disposição documental primária</small></div></div>
                <p className="private-report-note">Classificação não equivale a culpa. O objetivo é separar casos críticos, controles com evidência prévia e lacunas reais antes de qualquer encaminhamento.</p>
                <div className="intel-metric-grid">
                  {Object.entries(data.p0ClassificationCoverage.counts).map(([status,count])=><article key={status}><span>{status.replaceAll('_',' ')}</span><strong>{count}</strong></article>)}
                </div>
              </section>

              <section className="private-grid-three">
                <article className="private-panel"><p className="eyebrow">UNIVERSO CONSOLIDADO</p><h2>{data.municipalityUniverse77.counts.totalMunicipalities} municípios</h2><p className="private-report-note">{data.municipalityUniverse77.counts.housingCore} do núcleo original + {data.municipalityUniverse77.counts.expansionMunicipalities} novos. A votação é apenas critério de priorização, nunca evidência de irregularidade.</p></article>
                <article className="private-panel"><p className="eyebrow">IRECÊ</p><h2>{data.municipalityCohort69.methodology.newIreceMunicipalities} novos + Lapão</h2><p className="private-report-note">Cobertura completa dos 20 municípios do Território de Identidade de Irecê.</p></article>
                <article className="private-panel"><p className="eyebrow">EVIDÊNCIAS CENTRAIS</p><h2>{data.centralEvidenceWave03.counts.cumulativeCentralEvidence} itens</h2><p className="private-report-note">Wave 01: {data.centralEvidenceWave01.counts.total} · Wave 02: +{data.centralEvidenceWave02.counts.newEvidence} · Wave 03: +{data.centralEvidenceWave03.counts.newEvidence}.</p></article>
              </section>
              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">UNIVERSO DE PRIORIZAÇÃO</p><h2>77 municípios no radar</h2><small>8 do núcleo habitacional + 69 da expansão · {money(data.centralEvidenceWave01.counts.expansionFinancialExposureBRL)} em pagamentos FIPLAN qualificados na expansão P0.</small></div></div>
                <p className="private-report-note">{data.municipalityUniverse77.methodology.statement} A antiga coorte de 69 permanece como recorte de expansão e não deve ser confundida com o total consolidado.</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Seleção</span><span>FIPLAN no defeso</span><span>Jerônimo 2026</span><span>Evidência central</span><span>Status</span></div>
                  {data.municipalityUniverse77.municipalities.map((item)=><div key={item.name}>
                    <strong>{item.name}</strong>
                    <div><b>{item.priority}</b><small>{item.territoryIrece?'Território Irecê':''}</small></div>
                    <div>{item.defesoPaymentExposureBRL>0?<b>{money(item.defesoPaymentExposureBRL)}</b>:<span>sem fato financeiro classificado</span>}</div>
                    <div>{item.jeronimo2026ValidVotePct!==null?<><b>{item.jeronimo2026ValidVotePct.toFixed(2)}%</b><small>votos válidos</small></>:<span>percentual pendente de ingestão</span>}</div>
                    <div>{item.centralEvidenceQualified?<b className="housing-status-ok">qualificada</b>:<span className="housing-exception-pending">triagem</span>}</div>
                    <div><small>{item.selectionReasons.map((reason)=>reason==='housing_core'?'núcleo habitacional':reason==='defeso_fiplan_payment'?'pagamento FIPLAN':reason==='territorio_irece'?'Irecê':reason==='high_jeronimo_vote_2026'?'alta votação 2026':reason).join(' · ')}</small></div>
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
                <div className="private-panel-title"><div><p className="eyebrow">LACUNAS · MERCADOS / INFRA RURAL</p><h2>Últimos P0 sem cadeia operacional fechada</h2><small>{data.p0RuralMarketGaps.cases.length} casos classificados como lacuna documental</small></div></div>
                <p className="private-report-note">{data.p0RuralMarketGaps.methodology.rule}</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Pagamento</span><span>Objeto / convênio</span><span>Contratação</span><span>Estado</span><span>Avaliação</span></div>
                  {data.p0RuralMarketGaps.cases.map((item)=>{
                    const inst=item.fiplanInstrument || (item.fiplanInstruments||[]).map((row)=>row.instrument).join(' · ');
                    const obj=item.object || (item.fiplanInstruments||[]).map((row)=>row.agreement+' · '+row.object).join(' | ');
                    return <div key={item.municipality}>
                      <strong>{item.municipality}</strong>
                      <div><b>{money(item.paidBRL)}</b><code>{inst||'—'}</code></div>
                      <div><small>{obj||item.linkage||'—'}</small></div>
                      <div><b>{item.procurement==='not_located_inequivocally'||item.procurement==='not_located_inequivocally_for_2025_agreements'?'não localizada com segurança':item.procurement}</b></div>
                      <div><b className="housing-status-gap">{item.status.replaceAll('_',' ')}</b></div>
                      <div><small>{item.assessment}</small></div>
                    </div>;
                  })}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">IRECÊ · P0</p><h2>Deep scan dos municípios com pagamento no defeso</h2><small>{data.ireceP0DeepScan.scope.p0Count} P0 de {data.ireceP0DeepScan.scope.officialMunicipalities} municípios do território</small></div></div>
                <p className="private-report-note">{data.ireceP0DeepScan.methodology.rule}</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Pagamento / instrumento</span><span>Contratação prévia</span><span>Execução prévia</span><span>Estado</span><span>Avaliação</span></div>
                  {data.ireceP0DeepScan.cases.map((item)=>{
                    const paid=item.paidBRL ?? (item.fiplanInstruments||[]).reduce((sum,row)=>sum+row.paidBRL,0);
                    const instruments=item.fiplanInstrument || (item.fiplanInstruments||[]).map((row)=>row.instrument).join(' · ');
                    return <div key={item.municipality}>
                      <strong>{item.municipality}</strong>
                      <div><b>{money(paid||0)}</b><code>{instruments||'—'}</code></div>
                      <div><b>{item.preCutoffContract===true?'sim':item.preCutoffContract===false?'não':'não fechado'}</b></div>
                      <div><b>{item.preCutoffPhysicalExecution==='not_located'?'não localizada':item.preCutoffPhysicalExecution}</b></div>
                      <div><b className={item.status.includes('high_priority')?'housing-status-gap':item.status.includes('pre_cutoff')?'housing-status-ok':'housing-exception-pending'}>{item.status.replaceAll('_',' ')}</b></div>
                      <div><small>{item.assessment}</small></div>
                    </div>;
                  })}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">CONTROLE · OBRAS DE INFRAESTRUTURA</p><h2>Execução física antes de 04/07 versus contratação apenas iniciada</h2><small>{data.p0InfrastructureControl.cases.length} casos estruturados</small></div></div>
                <p className="private-report-note">{data.p0InfrastructureControl.methodology.rule}</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Convênio / instrumento</span><span>Pagamento</span><span>Execução prévia</span><span>Estado</span><span>Avaliação</span></div>
                  {data.p0InfrastructureControl.cases.map((item)=><div key={item.municipality}>
                    <strong>{item.municipality}</strong>
                    <div><b>{item.stateAgreement}</b><code>{item.fiplanInstrument}</code></div>
                    <div><b>{money(item.fiplanPaidBRL)}</b><small>{item.fiplanPaymentDate}</small></div>
                    <div><b>{item.physicalExecution.length} indicador(es)</b><small>{item.physicalExecution.map((e)=>`${e.date} · ${e.type}`).join(' | ')||'não localizada'}</small></div>
                    <div><b className={item.status==='pre_cutoff_physical_execution_corroborated'?'housing-status-ok':'housing-exception-pending'}>{item.status==='pre_cutoff_physical_execution_corroborated'?'execução pré-04/07 corroborada':'contratação prévia; execução aberta'}</b></div>
                    <div><small>{item.assessment}</small></div>
                  </div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">GRUPO DE CONTROLE · COMIDA NO PRATO</p><h2>Separação entre execução prévia e implantação tardia</h2><small>{data.p0ComidaNoPratoControl.cases.length} municípios já classificados neste cluster</small></div></div>
                <p className="private-report-note">{data.p0ComidaNoPratoControl.methodology.rule}</p>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Convênio</span><span>Pagamento</span><span>Indicadores pré-04/07</span><span>Estado</span><span>Avaliação</span></div>
                  {data.p0ComidaNoPratoControl.cases.map((item)=>{
                    const pre=item.evidence.filter((e)=>e.date<'2026-07-04');
                    return <div key={item.municipality}>
                      <strong>{item.municipality}</strong>
                      <div><b>{item.municipalAgreement}</b><code>{item.fiplanInstrument}</code><small>vínculo: {item.linkage}</small></div>
                      <div><b>{money(item.fiplanPaidBRL)}</b><small>{item.fiplanPaymentDate}</small></div>
                      <div><b>{pre.length} ato(s)</b><small>{pre.map((e)=>`${e.date} · ${e.type}`).join(' | ')||'nenhum localizado'}</small></div>
                      <div><b className={item.status==='pre_cutoff_execution_indicators'?'housing-status-ok':item.status==='post_cutoff_implementation_indicators'?'housing-status-gap':'housing-exception-pending'}>{item.status==='pre_cutoff_execution_indicators'?'execução prévia plausível':item.status==='pre_cutoff_procurement_only'?'atos prévios; execução aberta':item.status==='post_cutoff_implementation_indicators'?'implantação posterior localizada':'vínculo pendente'}</b></div>
                      <div><small>{item.assessment}</small></div>
                    </div>;
                  })}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">WAVE 03 · ARAÇÁS / JAGUAQUARA</p><h2>Novos elos documentais da triagem P0</h2><small>Total acumulado: {data.centralEvidenceWave03.counts.cumulativeCentralEvidence}</small></div></div>
                <p className="private-report-note">{data.centralEvidenceWave03.boundary}</p>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>ID</span><span>Município</span><span>Tipo</span><span>Fonte</span><span>Fato</span></div>
                  {data.centralEvidenceWave03.items.map((item)=><div key={item.id}><code>{item.id}</code><strong>{item.municipality}</strong><span>{item.type}</span><span>{item.source}</span><span>{item.title}</span></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">WAVE 02 · ACHADOS CRÍTICOS</p><h2>Novas evidências centrais independentes</h2><small>Total acumulado: {data.centralEvidenceWave02.counts.cumulativeCentralEvidence}</small></div></div>
                <p className="private-report-note">{data.centralEvidenceWave02.boundary}</p>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>ID</span><span>Município</span><span>Tipo</span><span>Fonte</span><span>Fato</span></div>
                  {data.centralEvidenceWave02.items.map((item)=><div key={item.id}><code>{item.id}</code><strong>{item.municipality}</strong><span>{item.type}</span><span>{item.source}</span><span>{item.title}</span></div>)}
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

          {tab === 'preba' && (
            <>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FM-03 · CONTRATOS VINCULADOS ÀS CONCORRÊNCIAS</p><h2>Próximo elo documental entre licitação e fornecedor</h2><small>{data.fm03LinkedContracts.registryId}</small></div>
                  <span className="housing-exception-pending">COLETA EM ANDAMENTO</span>
                </div>
                <p>A consulta PNCP de resultados de itens retornou HTTP 204, sem informações sobre adjudicação. Por isso, cadastramos a consulta oficial de contratos/empenhos associados diretamente a cada compra, sem presumir contratação ou pagamento.</p>
                <div className="private-grid-two">
                  {data.fm03LinkedContracts.targets.map(item=><article key={item.id} className="private-panel">
                    <div className="private-panel-title"><div><p className="eyebrow">{item.caseId} · {item.relatedCentralCE}</p><h2>{item.municipality}</h2></div><span className="housing-exception-pending">{item.status.includes('http_400')?'HTTP 400 · INCONCLUSIVO':item.status.includes('awaiting')?'AGUARDANDO':'VERIFICAR'}</span></div>
                    <p><code>{item.pncpControlNumber}</code></p>
                    <a href={item.source.endpoint} target="_blank" rel="noopener noreferrer">Consultar contratos oficiais no PNCP</a>
                    <p className="private-report-note">{item.interpretationBoundary}</p>
                  </article>)}
                </div>
                <p className="private-report-note">Cada resposta será registrada em arquivo individual com manifesto e SHA-256. Contrato identificado é diferente de pagamento municipal comprovado.</p>
              </section>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FM-03 · SEGUIMENTO PNCP</p><h2>Itens e histórico oficial de duas contratações</h2><small>{data.fm03PncpItemsHistory.registryId}</small></div>
                  <span className="housing-status-ok">4 JSON + 2 RECIBOS HTTP</span>
                </div>
                <p>As quatro consultas de itens e histórico retornaram dados oficiais, preservados integralmente com SHA-256. Há um item por processo e cinco eventos históricos. As duas consultas posteriores de resultado do item 1 responderam HTTP 204, sem corpo: isto não prova ausência de homologação, contratação ou pagamento.</p>
                <div className="private-grid-two">
                  {data.fm03PncpItemsHistory.accessPoints.map(s=><article key={s.id} className="private-panel">
                    <div className="private-panel-title">
                      <div><p className="eyebrow">{s.caseId} · {s.operation}</p><h2>{s.municipality}</h2></div>
                      <span className={s.originalBytesPreserved?'housing-status-ok':'housing-exception-pending'}>{s.originalBytesPreserved?'ARQUIVADO':'AGUARDANDO'}</span>
                    </div>
                    <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">Consultar endpoint oficial</a>
                    <p className="private-report-note">{s.id}: {s.contentStatus}.</p>
                  </article>)}
                </div>
                <div className="private-grid-two">
                  {data.fm03PncpItemHistoryEvidence.batches.map(batch=><article className="private-panel" key={batch.caseId}>
                    <div className="private-panel-title"><div><p className="eyebrow">{batch.caseId}</p><h2>{batch.municipality}</h2></div><strong>{money(batch.items.normalizedFacts[0].valorTotalEstimadoBRL)}</strong></div>
                    <p>Itens oficiais: <strong>{batch.items.count}</strong> · Número {batch.items.normalizedFacts[0].numeroItem} · Situação: {batch.items.normalizedFacts[0].situacaoNaCaptura}</p>
                    <p>Eventos no histórico PNCP: <strong>{batch.history.count}</strong></p>
                    <p>Resultado cadastrado no item capturado: {batch.items.normalizedFacts[0].temResultadoNoRegistro?'Sim':'Não informado'}</p>
                    <a href={batch.resultQuery.url} target="_blank" rel="noopener noreferrer">Consulta oficial de resultado do item 1</a>
                    <p className="private-report-note">Resultado da consulta: HTTP 204 (sem dados nesta resposta). Não permite afirmar inexistência de contratado ou pagamento municipal.</p>
                  </article>)}
                </div>
                <p className="private-report-note"><strong>Auditoria:</strong> {data.fm03PncpResultReceipts.receipts.length} respostas HTTP 204 preservadas com SHA-256 de corpo vazio. Não tratadas como JSON ou como comprovação de ausência de adjudicação.</p>
                <p className="private-report-note">Regra probatória: fornecedor vencedor só será exibido se constar de item/resultado oficial e for validado. Resultado de licitação não equivale a pagamento municipal.</p>
              </section>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FM-03 · PNCP OFICIAL — ORIGINAIS PRESERVADOS</p><h2>Contratações e evidências documentais</h2><small>{data.fm03PncpOfficialSnapshots.registryId}</small></div>
                  <span className="housing-status-ok">2 JSON CONFERIDOS</span>
                </div>
                <p>Os dados abaixo vêm de cópias integrais do JSON oficial PNCP preservadas com SHA-256. O campo <code>existeResultado=false</code> vale somente para o documento consultado; não significa inexistência de adjudicação, contrato ou pagamento em outro sistema.</p>
                <div className="private-grid-two">
                  {data.fm03PncpOfficialSnapshots.entries.map(item=><article className="private-panel" key={item.id}>
                    <div className="private-panel-title"><div><p className="eyebrow">{item.caseId} · {item.corroboratesExistingCE}</p><h2>{item.municipality}</h2></div><strong>{money(item.estimatedValueBRL)}</strong></div>
                    <p><strong>Controle PNCP:</strong> <code>{item.pncpControlNumber}</code></p>
                    <p><strong>Processo:</strong> {item.process} · publicado {item.publicationDateTime.slice(0,10)}</p>
                    <p><strong>Objeto:</strong> {item.object}</p>
                    <p className="private-report-note">Resultado informado no documento: {item.resultRegisteredInRecord?'Sim':'Não informado'} · Valor homologado {item.homologatedValueBRL===null?'não informado':money(item.homologatedValueBRL)}.</p>
                    <p className="private-report-note"><strong>Integridade:</strong> SHA-256 <code>{item.sourceSha256}</code></p>
                    <p className="private-report-note">Fornecedor e pagamento municipal ainda não comprovados.</p>
                  </article>)}
                </div>
              </section>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FM-03 · MONITORAMENTO DE TRANSPARÊNCIA MUNICIPAL</p><h2>Despesas, contratos e pedidos de documentos</h2><small>{data.fm03MunicipalSources.registryId}</small></div>
                  <span className="housing-exception-pending">DOCUMENTOS PENDENTES</span>
                </div>
                <p>Sete pontos oficiais de consulta financeira foram cadastrados para quatro municípios. Os sites permitem pesquisar, mas não há pagamentos a fornecedores vinculados a esses convênios documentalmente comprovados neste recorte.</p>
                <div className="intel-metrics-grid">
                  <article><span>Portais monitorados</span><strong>{data.fm03MunicipalSources.totalSourceReferences}</strong><small>URLs oficiais ou indicadas por município</small></article>
                  <article><span>Municípios</span><strong>{data.fm03MunicipalSources.totalMunicipalities}</strong><small>Fontes e minutas de LAI</small></article>
                  <article><span>Minutas LAI preparadas</span><strong>{data.fm03MunicipalSources.cases.length}</strong><small>Não foram protocoladas</small></article>
                  <article><span>Pagamentos novos comprovados</span><strong>{data.fm03MunicipalSources.verifiedSupplierPaymentsFoundInThisStage}</strong><small>Sem fornecedores presumidos</small></article>
                </div>
                <div className="private-grid-two" style={{marginTop:'14px'}}>
                  {data.fm03MunicipalSources.cases.map(c=><article className="private-panel" key={c.caseId}>
                    <div className="private-panel-title"><div><p className="eyebrow">{c.caseId}</p><h2>{data.fm03MunicipalSources.sources.find(s=>s.caseId===c.caseId)?.municipality}</h2></div><span className="housing-exception-pending">SEM PAGAMENTO CONFIRMADO</span></div>
                    <p><strong>{c.agreement}</strong> · NOB <code>{c.paymentNob}</code></p>
                    <ul>{data.fm03MunicipalSources.sources.filter(s=>s.caseId===c.caseId).map(s=><li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.scope}</a> <small>· {s.preservation.status==='awaiting_automated_capture'?'Aguardando coleta':s.preservation.status.includes('cross_domain_identical')?'HTTP 200: resposta igual a outro município; conferir':s.preservation.status.includes('hash_only')?'HTTP 200 + SHA, conteúdo não validado':s.preservation.status.includes('failed')?'Falha de captura':s.preservation.status}</small></li>)}</ul>
                    <a href={'https://github.com/davidazevedo/observatorio-eleitoral-ba-2026/blob/main/docs/FOLLOW_THE_MONEY/REQUISICOES/LAI_FM03_'+c.caseId+'.md'} target="_blank" rel="noopener noreferrer">Ver minuta LAI — não enviada</a>
                  </article>)}
                </div>
                <p className="private-report-note"><strong>Alerta documental:</strong> 9 respostas HTTP 200 e hashes, mas 4 URLs de duas prefeituras produziram bytes idênticos. Nenhuma dessas respostas, por si só, comprova pagamento a fornecedor.</p>
                <p className="private-report-note"><strong>Privacidade:</strong> as páginas completas de despesas não são republicadas automaticamente no Git público. O relatório de coleta preserva metadados e hash; conteúdo potencialmente pessoal deve ser arquivado apenas em ambiente restrito.</p>
              </section>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FOLLOW THE MONEY · ETAPA FM-03</p><h2>Cadeia financeira — origem ao fornecedor</h2><small>{data.fm03FinancialChains.registryId} · {data.fm03FinancialChains.createdDate}</small></div>
                  <span className="housing-exception-pending">BASE PARCIAL</span>
                </div>
                <p>As quatro origens estaduais são comprovadas por extrato FIPLAN versionado. A receita municipal de Jaguaquara foi corroborada pelo portal municipal, mas não por extrato da conta específica. Não há pagamentos a fornecedores comprovados nesse recorte.</p>
                <div className="intel-metrics-grid">
                  <article><span>Saídas estaduais</span><strong>{data.fm03FinancialChains.counting.stateDisbursementsVerified}/4</strong><small>extrato financeiro FIPLAN</small></article>
                  <article><span>Receita municipal corroborada</span><strong>{data.fm03FinancialChains.counting.municipalRevenuePublicCorroborations}</strong><small>sem conciliação bancária</small></article>
                  <article><span>Pagamentos a fornecedor</span><strong>{data.fm03FinancialChains.counting.verifiedSupplierPayments}</strong><small>documentalmente verificados</small></article>
                  <article><span>Montante de saída estadual</span><strong>{money(data.fm03FinancialChains.counting.totalStateDisbursementsBRL)}</strong><small>não significa recurso irregular</small></article>
                </div>
                <div className="private-grid-two" style={{marginTop:'16px'}}>
                  {data.fm03FinancialChains.chains.map(chain=><article className="private-panel" key={chain.caseId}>
                    <div className="private-panel-title"><div><p className="eyebrow">{chain.caseId} · {chain.bankOrder}</p><h2>{chain.municipality}</h2></div><strong>{money(chain.observedStateDisbursementBRL)}</strong></div>
                    <ol>
                      {chain.steps.map(step=><li key={step.slot}>
                        <strong>{step.slot==='state_disbursement'?'Repasse estadual':step.slot==='municipal_ingress'?'Ingresso municipal':step.slot==='municipal_expenditure'?'Empenho / liquidação':step.slot==='supplier_payment'?'Pagamento ao fornecedor':'Execução / entrega'}: </strong>
                        <span>{step.state==='verified_primary_extract'?'Comprovado no extrato FIPLAN':step.state==='corroborated_public_revenue_label'?'Receita municipal corroborada':'Documento não obtido'}</span>
                        <small> — {step.qualification}</small>
                      </li>)}
                    </ol>
                    <p className="private-report-note"><strong>Próxima diligência:</strong> {chain.action}</p>
                    {chain.contextFacts.map(context=><p key={context.evidenceId} className="private-report-note"><strong>{context.evidenceId}:</strong> {context.caveat}</p>)}
                  </article>)}
                </div>
                <p className="private-report-note">Limite metodológico: nenhuma correlação com financiamento eleitoral ou compra de votos foi estabelecida. Os grafos distinguem fatos comprovados, corroboração e lacunas de documentação.</p>
              </section>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FOLLOW THE MONEY · ETAPA FM-02</p><h2>Fechamento documental — quatro municípios</h2><small>{data.fm02DocumentaryLedger.ledgerId} · atualização {data.fm02DocumentaryLedger.registeredDate}</small></div>
                  <span className="housing-exception-pending">EM EXECUÇÃO</span>
                </div>
                <p>O extrato FIPLAN original filtrado já está versionado no Git e foi conferido por SHA-256. As quatro linhas de pagamento abaixo são extrações literais do arquivo preservado. As URLs de PDFs e páginas oficiais continuam sendo referências até que seus bytes sejam efetivamente arquivados.</p>
                <div className="intel-metrics-grid">
                  <article><span>Linhas financeiras verificadas</span><strong>{data.fm02FiplanPrimaryRows.records.length}/4</strong><small>FIPLAN original, NOB e instrumento</small></article>
                  <article><span>Casos estruturados</span><strong>{data.fm02DocumentaryLedger.totalCases}/4</strong><small>cronologias + requisições</small></article>
                  <article><span>Fontes documentais</span><strong>{data.fm02DocumentaryLedger.totalSourceReferences}</strong><small>repetições FIPLAN por caso; não 15 provas novas</small></article>
                  <article><span>Documentos P0 pendentes</span><strong>{data.fm02DocumentaryLedger.cases.reduce((n,c)=>n+c.p0Gaps.length,0)}</strong><small>solicitar aos órgãos de origem</small></article>
                </div>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Município</span><span>Instrumento</span><span>NOB</span><span>Pagamento</span><span>Correspondência</span><span>Status</span></div>
                  {data.fm02FiplanPrimaryRows.records.map(row=><div key={row.evidenceSliceId}>
                    <strong>{row.municipality}</strong><code>{row.instrumentFormatted}</code><code>{row.paymentNobFormatted}</code>
                    <div><strong>{money(row.paymentValueBRL)}</strong><small>{row.paymentDateDDMMYYYY}</small></div>
                    <code>{row.crossReferences.join(', ')}</code><span className="housing-status-ok">Extrato validado</span>
                  </div>)}
                </div>
                <p className="private-report-note">Integridade do extrato FIPLAN: compactado SHA-256 <code>{data.fm02FiplanPrimaryRows.source.sha256Gzip}</code>; conteúdo SHA-256 <code>{data.fm02FiplanPrimaryRows.source.sha256Uncompressed}</code>. Estes hashes não representam os PDFs oficiais ainda pendentes.</p>
                <h3>Fontes externas: preservação privada individual</h3>
                <p>Os arquivos originais ficam no Blob privado após confirmação de coleta; nenhum link é tratado como prova arquivada antes disso.</p>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>Município</span><span>Fonte</span><span>Status de preservação</span><span>URL</span><span>Ação</span></div>
                  {data.fm02DocumentaryLedger.sources.filter(s=>!s.sourceId.includes('FIPLAN')).map(src=>{
                    const previous=data.sourceArchives.find(a=>a.sourceId===src.sourceId.toLowerCase());
                    const archived=fm02ArchivedById[src.sourceId];
                    return <div key={src.sourceId}>
                      <strong>{src.municipality}</strong><code>{src.sourceId}</code>
                      <div><small>{archived?'Cópia privada arquivada e hasheada nesta sessão':previous?'Cópia localizada no arquivo privado':'Original pendente de captura'}</small>{archived?<code title={archived.path}>{archived.sha256.slice(0,16)}…</code>:null}</div>
                      <a href={src.url} target="_blank" rel="noopener noreferrer">Abrir fonte oficial</a>
                      <button type="button" disabled={Boolean(fm02ArchivingSource)} onClick={()=>archiveFm02Source(src)}>{fm02ArchivingSource===src.sourceId?'Arquivando...':archived||previous?'Arquivar nova versão':'Arquivar original'}</button>
                    </div>;
                  })}
                </div>
                {fm02ArchiveMessage?<p role="status">{fm02ArchiveMessage}</p>:null}
                <div className="private-grid-two" style={{marginTop:'16px'}}>
                  {data.fm02DocumentaryLedger.cases.map(c=><article className="private-panel" key={c.caseId}>
                    <div className="private-panel-title"><div><p className="eyebrow">{c.caseId}</p><h2>{c.municipality}</h2></div><span className="housing-exception-pending">{c.p0Gaps.length} P0</span></div>
                    <p><strong>Sequência:</strong> {c.chronology.map(e=>e.date+' '+e.sourceId).join(' → ')}</p>
                    <p className="private-report-note">Documentação faltante: {c.p0Gaps.map(g=>g.document).join(' · ')}</p>
                    <p>{c.legalBoundary}</p>
                  </article>)}
                </div>
              </section>
              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">FOLLOW THE MONEY · ROTEIRO DE 90 DIAS</p><h2>Etapa 01 — Segurança, preservação e sincronização</h2><small>{data.followMoneyRoadmap.roadmapId} · atualização {data.followMoneyRoadmap.updatedDate}</small></div>
                  <span className="housing-exception-pending">FM-01 · EM VALIDAÇÃO</span>
                </div>
                <p>Os 57 fatos centrais estão versionados individualmente e disponíveis na API autenticada desta release. O espelhamento no Blob privado é uma operação separada: só conta como concluído após a API confirmar os registros.</p>
                <div className="intel-metrics-grid">
                  <article><span>Fichas no Git</span><strong>{data.centralEvidenceLedgerSummary.versioned}/57</strong><small>CE-001 a CE-057</small></article>
                  <article><span>Consulta API</span><strong>57</strong><small>GET /api/intelligence/evidence (chave)</small></article>
                  <article><span>Blob espelhado</span><strong>{centralEvidenceMirrorCount}/57</strong><small>confirmado no armazenamento privado</small></article>
                  <article><span>Fases em execução</span><strong>{data.followMoneyRoadmap.stages.filter(p=>p.status==='in_progress').length}/7</strong><small>status independente por etapa</small></article>
                </div>
                <p className="private-report-note"><strong>Limite probatório:</strong> as 57 fichas derivam de manifests. Não constituem 57 arquivos oficiais originais. A fonte primária deve ser anexada e conferida antes de qualquer imputação.</p>
                <button type="button" disabled={centralEvidenceSyncing} onClick={synchronizeCentralEvidence}>
                  {centralEvidenceSyncing ? 'Sincronizando evidências...' : 'Sincronizar 57 fichas com o Blob privado'}
                </button>
                {centralEvidenceSyncMessage?<p role="status">{centralEvidenceSyncMessage}</p>:null}
                <div className="private-grid-two" style={{marginTop:'18px'}}>
                  {data.followMoneyRoadmap.stages.map(phase=><article className="private-panel" key={phase.id}>
                    <div className="private-panel-title"><div><p className="eyebrow">{phase.id} · {phase.start} — {phase.end}</p><h2>{phase.title}</h2></div><span className={phase.status==='pending'?'housing-exception-pending':'housing-status-ok'}>{phase.status==='pending'?'AGUARDANDO':phase.status==='in_progress'?'EM EXECUÇÃO':'CONCLUÍDO'}</span></div>
                    <ul>{phase.deliverables.map(item=><li key={item}>{item}</li>)}</ul><p className="private-report-note">{phase.gate}</p>
                  </article>)}
                </div>
              </section>

              <section className="intel-metrics-grid">
                <article><span>Pacote de protocolo</span><strong>{data.prebaProtocolRelease.globalCompletionPercent}%</strong><small>release de protocolo concluída</small></article>
                <article><span>Peça consolidada</span><strong>{data.prebaFinalRepresentation.protocolReadiness.readyAsNewsOfFactForDiligence?'PRONTA':'PENDENTE'}</strong><small>notícia de fato para diligências</small></article>
                <article><span>Pacote único</span><strong>{data.prebaProtocolRelease.qa.combinedPackagePages} págs.</strong><small>Word + PDF + 10 anexos + checksums</small></article>
                <article><span>Acusação definitiva</span><strong>{data.prebaProtocolRelease.definitiveAccusationReady?'SIM':'NÃO'}</strong><small>depende das diligências requisitadas</small></article>
              </section>

              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">ETAPA 8 · RELEASE DE PROTOCOLO</p><h2>Pacote final PRE-BA</h2><small>{data.prebaProtocolRelease.releaseId} · {data.prebaProtocolRelease.generatedDate}</small></div>
                  <span className="housing-status-ok">100% CONCLUÍDO</span>
                </div>
                <p>{data.prebaProtocolRelease.finalBoundary}</p>
                <div className="intel-metrics-grid">
                  <article><span>Peça principal</span><strong>{data.prebaProtocolRelease.qa.mainDocumentPages} págs.</strong><small>{data.prebaProtocolRelease.artifacts.mainPdf}</small></article>
                  <article><span>Pacote único</span><strong>{data.prebaProtocolRelease.qa.combinedPackagePages} págs.</strong><small>{data.prebaProtocolRelease.artifacts.combinedPdf}</small></article>
                  <article><span>Anexos renderizados</span><strong>{data.prebaProtocolRelease.qa.annexesRendered}</strong><small>QA visual concluído</small></article>
                  <article><span>Runtime</span><strong>{data.prebaProtocolRelease.qa.runtimeErrorsAtPortalRelease}</strong><small>erros na release do portal</small></article>
                </div>
                <div className="private-grid-two" style={{marginTop:'18px'}}>
                  <article className="private-panel">
                    <div className="private-panel-title"><div><p className="eyebrow">CANAL DE ENVIO</p><h2>{data.prebaProtocolRelease.protocolChannel.citizen}</h2></div></div>
                    <p>Para apresentação inicial por cidadão. Se já existir procedimento em trâmite, usar {data.prebaProtocolRelease.protocolChannel.existingProceeding}.</p>
                    <p className="private-report-note">{data.prebaProtocolRelease.protocolChannel.preAddress} · {data.prebaProtocolRelease.protocolChannel.phones.join(' / ')}</p>
                  </article>
                  <article className="private-panel">
                    <div className="private-panel-title"><div><p className="eyebrow">ANEXOS TÉCNICOS</p><h2>Regra de integridade</h2></div></div>
                    <p>{data.prebaProtocolRelease.annexRule}</p>
                    <div className="intel-chip-list"><span>{data.prebaProtocolRelease.artifacts.checksumManifest}</span><span>{data.prebaProtocolRelease.artifacts.zip}</span></div>
                  </article>
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title">
                  <div><p className="eyebrow">ETAPA 7 · PEÇA CONSOLIDADA</p><h2>{data.prebaFinalRepresentation.title}</h2><small>{data.prebaFinalRepresentation.destination}</small></div>
                  <span className={data.prebaFinalRepresentation.protocolReadiness.readyAsNewsOfFactForDiligence?'housing-status-ok':'housing-exception-pending'}>{data.prebaFinalRepresentation.protocolReadiness.readyAsNewsOfFactForDiligence?'PRONTA PARA PROTOCOLO':'PENDENTE'}</span>
                </div>
                <p>{data.prebaFinalRepresentation.executiveSummary}</p>
                <p className="private-report-note"><strong>Limite jurídico:</strong> {data.prebaFinalRepresentation.legalBoundary}</p>
                <div className="intel-metrics-grid">
                  <article><span>Universo prioritário</span><strong>{data.prebaFinalRepresentation.scope.priorityUniverseMunicipalities}</strong><small>municípios</small></article>
                  <article><span>P0 classificados</span><strong>{data.prebaFinalRepresentation.scope.p0Classified}/{data.prebaFinalRepresentation.scope.p0Classified}</strong><small>{data.prebaFinalRepresentation.scope.p0CoveragePercent}%</small></article>
                  <article><span>Evidências centrais</span><strong>{data.prebaFinalRepresentation.scope.centralVersionedEvidence}</strong><small>fatos auditáveis, não ilícitos</small></article>
                  <article><span>Núcleos da peça</span><strong>{data.prebaFinalRepresentation.scope.priorityPackages}</strong><small>{data.prebaFinalRepresentation.scope.municipalities.join(' · ')}</small></article>
                </div>
                <div className="private-grid-two" style={{marginTop:'18px'}}>
                  <article className="private-panel">
                    <div className="private-panel-title"><div><p className="eyebrow">PEDIDOS</p><h2>Diligências requeridas</h2></div></div>
                    <ol>{data.prebaFinalRepresentation.requestedMeasures.map((item)=><li key={item}>{item}</li>)}</ol>
                  </article>
                  <article className="private-panel">
                    <div className="private-panel-title"><div><p className="eyebrow">GATE FINAL</p><h2>Antes do protocolo</h2></div></div>
                    <ul>{data.prebaFinalRepresentation.finalReviewChecklist.map((item)=><li key={item}>{item}</li>)}</ul>
                    <p className="private-report-note">{data.prebaFinalRepresentation.protocolReadiness.reason}</p>
                  </article>
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">ÍNDICE FINAL</p><h2>{data.prebaFinalAnnexIndex.annexes.length} anexos para protocolo</h2><small>{data.prebaFinalAnnexIndex.finalGate.readyForNewsOfFactProtocol?'Gate de notícia de fato: pronto':'Gate pendente'}</small></div></div>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>#</span><span>Anexo</span><span>Finalidade</span><span>Arquivo</span><span>Humano</span></div>
                  {data.prebaFinalAnnexIndex.annexes.map((item)=><div key={item.id}><strong>{String(item.order).padStart(2,'0')}</strong><span>{item.title}</span><small>{item.purpose}</small><code>{item.path}</code><small>{item.humanReadable||'—'}</small></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">FILA DE FECHAMENTO PROBATÓRIO</p><h2>Pacotes prioritários para PRE-BA</h2><small>{data.prebaPackagesIndex.methodologicalBoundary}</small></div></div>
                <div className="intel-record-list">
                  {data.prebaPackagesIndex.packages.map((item)=><article className="intel-record" key={item.packageId}>
                    <div className="intel-record-body">
                      <div style={{display:'flex',justifyContent:'space-between',gap:'12px',alignItems:'flex-start',flexWrap:'wrap'}}>
                        <div><span className={priorityClass(item.priority==='critical'?'urgent':item.priority)}>{item.priority}</span><h3 style={{margin:'8px 0 4px'}}>{String(item.order).padStart(2,'0')} · {item.municipality}</h3><code>{item.packageId}</code></div>
                        <b className={item.protocolReady?'housing-status-ok':'housing-exception-pending'}>{item.protocolReady?'pronto para protocolo':item.status.replaceAll('_',' ')}</b>
                      </div>
                      {item.coreEvidence?.length?<div className="intel-chip-list">{item.coreEvidence.map((e)=><span key={e}>{e}</span>)}</div>:null}
                      {item.focus?<p>{item.focus}</p>:null}
                      {item.mainBlockers?.length?<div className="private-text-block"><small>BLOQUEADORES</small><ul>{item.mainBlockers.map((b)=><li key={b}>{b}</li>)}</ul></div>:null}
                    </div>
                  </article>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">PREBA-01 · LAJEDO DO TABOCAL</p><h2>Pacote probatório v1</h2><small>{data.prebaLajedoPackage.legalBoundary}</small></div><span className="housing-exception-pending">diligências P0</span></div>
                <p><strong>Questão central:</strong> {data.prebaLajedoPackage.coreQuestion}</p>
                <div className="intel-metrics-grid">
                  <article><span>Convênio</span><strong>{money(data.prebaLajedoPackage.financial.agreementValueBRL)}</strong><small>valor global</small></article>
                  <article><span>1ª parcela</span><strong>{money(data.prebaLajedoPackage.financial.firstInstallmentBRL)}</strong><small>valor previsto no termo</small></article>
                  <article><span>Pagamento</span><strong>{money(data.prebaLajedoPackage.financial.criticalPeriodPaymentBRL)}</strong><small>{data.prebaLajedoPackage.financial.paymentDate}</small></article>
                  <article><span>Classificação</span><strong>CRÍTICA</strong><small>necessidade de apuração, não conclusão</small></article>
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">CRONOLOGIA</p><h2>Sequência documental reproduzível</h2></div></div>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>Data</span><span>Evento</span><span>Papel</span><span>Fonte</span><span>Observação</span></div>
                  {data.prebaLajedoPackage.chronology.map((item,index)=><div key={item.date+index}><strong>{item.date}</strong><span>{item.event}</span><code>{item.evidentiaryRole}</code><span>{item.sourceId}</span><small>{item.note||'—'}</small></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">MATRIZ PROBATÓRIA</p><h2>O que cada evidência prova — e o que não prova</h2></div></div>
                <div className="intel-record-list">{data.prebaLajedoPackage.evidenceMatrix.map((item)=><article className="intel-record" key={item.evidenceId}><div className="intel-record-body"><div style={{display:'flex',justifyContent:'space-between',gap:'10px'}}><h3>{item.evidenceId} · {item.type}</h3><code>{item.integrityStatus}</code></div><p><strong>Fato:</strong> {item.assertion}</p><p><strong>Prova:</strong> {item.whatItProves}</p><p className="private-report-note"><strong>Limite:</strong> {item.whatItDoesNotProve}</p><small>{item.source}</small></div></article>)}</div>
              </section>

              <section className="private-grid-two">
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">APARENTE INCOMPATIBILIDADE</p><h2>Questão a investigar</h2></div></div><p>{data.prebaLajedoPackage.apparentIncompatibility.statement}</p><p className="private-report-note">Conclusão jurídica atual: <strong>nenhuma</strong>. O estado é {data.prebaLajedoPackage.apparentIncompatibility.status.replaceAll('_',' ')}.</p></article>
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">GATE DE PROTOCOLO</p><h2>O que falta fechar</h2></div></div><ul>{data.prebaLajedoPackage.protocolGate.minimumToClose.map((item)=><li key={item}>{item}</li>)}</ul><p className="private-report-note">{data.prebaLajedoPackage.protocolGate.recommendedUseNow}</p></article>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">DILIGÊNCIAS</p><h2>Documentos P0 e pedidos objetivos</h2></div></div>
                <div className="housing-audit-table housing-audit-v2">
                  <div className="housing-audit-head"><span>Prioridade</span><span>Documento</span><span>Razão</span><span>Estado</span><span>Destino</span><span>Uso</span></div>
                  {data.prebaLajedoPackage.documentGaps.map((item,index)=><div key={item.document}><b className={item.priority==='P0'?'housing-status-gap':'housing-exception-pending'}>{item.priority}</b><strong>{item.document}</strong><small>{item.reason}</small><span>não localizado/preservado</span><span>{data.prebaLajedoPackage.requestedDiligences[index]?.recipient||'SUDESB / Município / FIPLAN'}</span><small>fechamento do pacote</small></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">PREBA-02 · BELO CAMPO</p><h2>Pacote probatório v1</h2><small>{data.prebaBeloCampoPackage.legalBoundary}</small></div><span className="housing-exception-pending">diligências P0</span></div>
                <p><strong>Questão central:</strong> {data.prebaBeloCampoPackage.coreQuestion}</p>
                <div className="intel-metrics-grid">
                  <article><span>Convênio</span><strong>{money(data.prebaBeloCampoPackage.financial.agreementValueBRL)}</strong><small>valor global</small></article>
                  <article><span>Aporte estadual</span><strong>{money(data.prebaBeloCampoPackage.financial.stateContributionBRL)}</strong><small>participação do Estado</small></article>
                  <article><span>Pagamento</span><strong>{money(data.prebaBeloCampoPackage.financial.criticalPeriodPaymentBRL)}</strong><small>{data.prebaBeloCampoPackage.financial.paymentDate}</small></article>
                  <article><span>Classificação</span><strong>CRÍTICA</strong><small>evento concluído antes do repasse</small></article>
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">BELO CAMPO · CRONOLOGIA</p><h2>Convênio → evento → pagamento</h2></div></div>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>Data</span><span>Evento</span><span>Papel</span><span>Fonte</span><span>Observação</span></div>
                  {data.prebaBeloCampoPackage.chronology.map((item,index)=><div key={item.date+index}><strong>{item.date}</strong><span>{item.event}</span><code>{item.evidentiaryRole}</code><span>{item.sourceId}</span><small>{item.note||'—'}</small></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">BELO CAMPO · MATRIZ PROBATÓRIA</p><h2>O que cada evidência prova — e o que não prova</h2></div></div>
                <div className="intel-record-list">{data.prebaBeloCampoPackage.evidenceMatrix.map((item)=><article className="intel-record" key={item.evidenceId}><div className="intel-record-body"><div style={{display:'flex',justifyContent:'space-between',gap:'10px'}}><h3>{item.evidenceId} · {item.type}</h3><code>{item.integrityStatus}</code></div><p><strong>Fato:</strong> {item.assertion}</p><p><strong>Prova:</strong> {item.whatItProves}</p><p className="private-report-note"><strong>Limite:</strong> {item.whatItDoesNotProve}</p><small>{item.source}</small></div></article>)}</div>
              </section>

              <section className="private-grid-two">
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">BELO CAMPO · QUESTÃO JURÍDICA</p><h2>Repasse posterior ao evento</h2></div></div><p>{data.prebaBeloCampoPackage.apparentIncompatibility.statement}</p><p className="private-report-note">Conclusão jurídica atual: <strong>nenhuma</strong>.</p></article>
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">GATE DE PROTOCOLO</p><h2>O que falta fechar</h2></div></div><ul>{data.prebaBeloCampoPackage.protocolGate.minimumToClose.map((item)=><li key={item}>{item}</li>)}</ul><p className="private-report-note">{data.prebaBeloCampoPackage.protocolGate.recommendedUseNow}</p></article>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">PREBA-03 · ARAÇÁS</p><h2>Pacote probatório v1</h2><small>{data.prebaAracasPackage.legalBoundary}</small></div><span className="housing-exception-pending">requisição formal</span></div>
                <p><strong>Questão central:</strong> {data.prebaAracasPackage.coreQuestion}</p>
                <div className="intel-metrics-grid">
                  <article><span>Convênio</span><strong>{money(data.prebaAracasPackage.financial.agreementValueBRL)}</strong><small>valor global</small></article>
                  <article><span>1ª parcela contratual</span><strong>{money(data.prebaAracasPackage.financial.firstInstallmentBRL)}</strong><small>prevista no termo</small></article>
                  <article><span>Pagamento localizado</span><strong>{money(data.prebaAracasPackage.financial.locatedCriticalPeriodPaymentBRL)}</strong><small>{data.prebaAracasPackage.financial.locatedPaymentDate}</small></article>
                  <article><span>Coincide com 1ª parcela?</span><strong>{data.prebaAracasPackage.financial.paymentMatchesFirstInstallment?'SIM':'NÃO'}</strong><small>histórico integral é diligência nº 1</small></article>
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">ARAÇÁS · CRONOLOGIA</p><h2>Convênio → defeso → pagamento/contratação</h2></div></div>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>Data</span><span>Evento</span><span>Papel</span><span>Fonte</span><span>Observação</span></div>
                  {data.prebaAracasPackage.chronology.map((item,index)=><div key={item.date+index}><strong>{item.date}</strong><span>{item.event}</span><code>{item.evidentiaryRole}</code><span>{item.sourceId}</span><small>{item.note||'—'}</small></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">ARAÇÁS · MATRIZ PROBATÓRIA</p><h2>Pagamento, cláusula e contratação</h2></div></div>
                <div className="intel-record-list">{data.prebaAracasPackage.evidenceMatrix.map((item)=><article className="intel-record" key={item.evidenceId}><div className="intel-record-body"><div style={{display:'flex',justifyContent:'space-between',gap:'10px'}}><h3>{item.evidenceId} · {item.type}</h3><code>{item.integrityStatus}</code></div><p><strong>Fato:</strong> {item.assertion}</p><p><strong>Prova:</strong> {item.whatItProves}</p><p className="private-report-note"><strong>Limite:</strong> {item.whatItDoesNotProve}</p><small>{item.source}</small></div></article>)}</div>
              </section>

              <section className="private-grid-two">
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">ARAÇÁS · LACUNA CENTRAL</p><h2>Reconstrução do fluxo financeiro</h2></div></div><p>{data.prebaAracasPackage.apparentIncompatibility.statement}</p><p className="private-report-note">Conclusão jurídica atual: <strong>nenhuma</strong>.</p></article>
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">GATE DE PROTOCOLO</p><h2>O que falta fechar</h2></div></div><ul>{data.prebaAracasPackage.protocolGate.minimumToClose.map((item)=><li key={item}>{item}</li>)}</ul><p className="private-report-note">{data.prebaAracasPackage.protocolGate.recommendedUseNow}</p></article>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">PREBA-04 · JAGUAQUARA</p><h2>Pacote probatório v1</h2><small>{data.prebaJaguaquaraPackage.legalBoundary}</small></div><span className="housing-exception-pending">requisição formal</span></div>
                <p><strong>Questão central:</strong> {data.prebaJaguaquaraPackage.coreQuestion}</p>
                <div className="intel-metrics-grid">
                  <article><span>Instrumento</span><strong>{money(data.prebaJaguaquaraPackage.financial.instrumentValueBRL)}</strong><small>valor global FIPLAN</small></article>
                  <article><span>Pagamento estádio</span><strong>{money(data.prebaJaguaquaraPackage.financial.stadiumPaymentBRL)}</strong><small>{data.prebaJaguaquaraPackage.financial.stadiumPaymentDate}</small></article>
                  <article><span>Receita municipal</span><strong>{money(data.prebaJaguaquaraPackage.financial.municipalRevenueCorroboratedBRL)}</strong><small>coincidência exata de valor</small></article>
                  <article><span>Total municipal crítico</span><strong>{money(data.prebaJaguaquaraPackage.financial.totalJaguaquaraCriticalPeriodPaymentsBRL)}</strong><small>inclui R$ 400 mil de outro objeto</small></article>
                </div>
                <p className="private-report-note">{data.prebaJaguaquaraPackage.financial.separationRule}</p>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">JAGUAQUARA · CRONOLOGIA</p><h2>Publicação → defeso → pagamento → corroboração municipal</h2></div></div>
                <div className="intel-entity-table">
                  <div className="intel-table-head"><span>Data</span><span>Evento</span><span>Papel</span><span>Fonte</span><span>Observação</span></div>
                  {data.prebaJaguaquaraPackage.chronology.map((item,index)=><div key={item.date+index}><strong>{item.date}</strong><span>{item.event}</span><code>{item.evidentiaryRole}</code><span>{item.sourceId}</span><small>{item.note||'—'}</small></div>)}
                </div>
              </section>

              <section className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">JAGUAQUARA · MATRIZ PROBATÓRIA</p><h2>Valor, vínculo e cautela de identificação</h2></div></div>
                <div className="intel-record-list">{data.prebaJaguaquaraPackage.evidenceMatrix.map((item)=><article className="intel-record" key={item.evidenceId}><div className="intel-record-body"><div style={{display:'flex',justifyContent:'space-between',gap:'10px'}}><h3>{item.evidenceId} · {item.type}</h3><code>{item.integrityStatus}</code></div><p><strong>Fato:</strong> {item.assertion}</p><p><strong>Prova:</strong> {item.whatItProves}</p><p className="private-report-note"><strong>Limite:</strong> {item.whatItDoesNotProve}</p><small>{item.source}</small></div></article>)}</div>
              </section>

              <section className="private-grid-two">
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">JAGUAQUARA · LACUNA CENTRAL</p><h2>Início físico anterior a 04/07</h2></div></div><p>{data.prebaJaguaquaraPackage.apparentIncompatibility.statement}</p><p className="private-report-note">Conclusão jurídica atual: <strong>nenhuma</strong>.</p></article>
                <article className="private-panel"><div className="private-panel-title"><div><p className="eyebrow">GATE DE PROTOCOLO</p><h2>O que falta fechar</h2></div></div><ul>{data.prebaJaguaquaraPackage.protocolGate.minimumToClose.map((item)=><li key={item}>{item}</li>)}</ul><p className="private-report-note">{data.prebaJaguaquaraPackage.protocolGate.recommendedUseNow}</p></article>
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
                <div className="private-panel-title"><div><p className="eyebrow">UNIVERSO PRIORITÁRIO</p><h2>{data.municipalityUniverse77.counts.totalMunicipalities} municípios no radar</h2></div></div>
                <div className="intel-municipality-list">{priorityUniverseMunicipalities.map((item,index)=><div key={item.name}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.name}</strong><b>{item.count}</b></div>)}</div>
              </article>
              <article className="private-panel">
                <div className="private-panel-title"><div><p className="eyebrow">OBJETIVO</p><h2>Matriz dos 417 municípios</h2></div></div>
                <div className="intel-coverage-number"><strong>{data.municipalityUniverse77.counts.totalMunicipalities}</strong><span>no universo prioritário consolidado</span><i>{Math.round((data.municipalityUniverse77.counts.totalMunicipalities/417)*100)}%</i></div>
                <p className="private-report-note">São 8 municípios do núcleo habitacional original e 69 da expansão. O número indica cobertura investigativa, não suspeita nem irregularidade.</p>
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
                <div><span>GET</span><code>/api/intelligence/datasets</code><p>Lista datasets investigativos consolidados. Use <code>?name=...</code> para obter um conjunto específico.</p></div>
                <div><span>POST</span><code>/api/private/intelligence-review</code><p>Registra decisão humana append-only da triagem; exige sessão administrativa do cockpit.</p></div>
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
              <p className="private-report-note">Para cruzamentos de contas eleitorais, use <code>electoral_account</code>; para pagamentos e execução financeira, <code>financial_record</code>; para relações societárias ou eleitorais documentadas, use <code>relationship</code> e identifique a fonte no campo <code>provenance</code>. Dataset principal: <code>municipality-universe-77</code>. O <code>cohort-69</code> permanece disponível apenas como recorte legado da expansão. Também estão publicados <code>p0-triage-36</code>, <code>p0-classification-36</code>, <code>irece-p0-deep-scan</code>, três waves de evidência, matrizes de controle, os quatro pacotes PRE-BA e os datasets finais <code>preba-final-representation</code>, <code>preba-final-annex-index</code> e <code>preba-protocol-release</code>.</p>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
