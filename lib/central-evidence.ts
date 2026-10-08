import { createHash } from 'node:crypto';
import type { IntelligenceRecord } from '@/lib/intelligence';
import ledgerJson from '@/data/evidence/central/index-2026-10-08.json';

export type CentralEvidenceRecord = {
  schemaVersion: 1;
  evidenceId: string;
  canonicalPath: string;
  registrationDate: string;
  provenance: {
    sourceManifestPath: string;
    sourceManifestGitBlobSha: string;
    sourceReferenceType: string;
    originalDocumentBundledHere: boolean;
    sourceUrl: string | null;
    sourceLabel: string | null;
    verificationBoundary: string;
  };
  analysis: {
    classification: string;
    criminalConclusion: string;
    campaignFundingConclusion: string;
    sourceDocumentStatus: string;
  };
  documentedFact: {
    id: string;
    municipality: string;
    title: string;
    type: string;
    amountBRL?: number;
    source?: string;
    sourceScope?: string;
    sourceUrl?: string;
    legalConclusion?: string;
    [key: string]: unknown;
  };
};

const ledger = ledgerJson as unknown as {
  schemaVersion: number;
  registryId: string;
  registeredDate: string;
  totalUniqueFacts: number;
  entries: CentralEvidenceRecord[];
};

export const centralEvidenceRegistryId = ledger.registryId;
export const centralEvidenceEntries: readonly CentralEvidenceRecord[] = ledger.entries;

const idPattern = /^CE-\d{3}$/;
if (centralEvidenceEntries.length !== ledger.totalUniqueFacts ||
    new Set(centralEvidenceEntries.map(item => item.evidenceId)).size !== ledger.totalUniqueFacts ||
    centralEvidenceEntries.some(item => !idPattern.test(item.evidenceId) || item.documentedFact.id !== item.evidenceId)) {
  throw new Error('Registro central de evidências inconsistente.');
}

export function canonicalEvidenceHash(item: CentralEvidenceRecord) {
  // Hash do payload JSON canônico, NÃO do documento externo de origem.
  return createHash('sha256').update(JSON.stringify(item), 'utf8').digest('hex');
}

export function centralEvidenceAsIntelligence(): IntelligenceRecord[] {
  return centralEvidenceEntries.map(item => ({
    schemaVersion: 1,
    recordId: item.evidenceId,
    kind: 'research_finding',
    status: 'triage',
    title: item.documentedFact.title,
    summary: item.documentedFact.title + '. Fato cadastrado em manifesto versionado; a classificação jurídica depende dos documentos primários.',
    municipality: item.documentedFact.municipality,
    state: 'BA',
    collectedAt: '2026-10-08T00:00:00.000Z',
    sourceIds: [item.evidenceId, item.provenance.sourceManifestPath],
    caseIds: [],
    tags: ['central-evidence', 'repository-ledger', item.documentedFact.type],
    evidenceLevel: 'L1',
    priority: ['Lajedo do Tabocal','Belo Campo','Araçás','Jaguaquara'].includes(item.documentedFact.municipality) ? 'high' : 'medium',
    financial: {},
    provenance: {
      sourceUrl: item.provenance.sourceUrl || undefined,
      sourceTitle: item.provenance.sourceLabel || item.provenance.sourceManifestPath,
      publisher: item.provenance.sourceLabel || 'Manifesto versionado do Observatório',
      externalId: item.evidenceId,
      checksum: canonicalEvidenceHash(item),
      collector: 'oe-ba-central-evidence-ledger-v1',
      method: 'import',
    },
    notes: [
      'Proveniência: manifesto Git ' + item.provenance.sourceManifestGitBlobSha,
      'O hash informado corresponde à ficha normalizada, não ao arquivo oficial externo.',
      item.provenance.verificationBoundary,
    ],
    raw: {
      evidenceId: item.evidenceId,
      canonicalPath: item.canonicalPath,
      sourceManifestPath: item.provenance.sourceManifestPath,
      sourceManifestGitBlobSha: item.provenance.sourceManifestGitBlobSha,
      originalDocumentBundledHere: false,
      documentedFact: item.documentedFact,
      registrationDateOnly: item.registrationDate,
      collectedAtIsDateSentinel: true,
    },
    recordOrigin: 'ledger',
  }));
}
