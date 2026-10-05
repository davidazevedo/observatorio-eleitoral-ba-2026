import { get, list, type ListBlobResultBlob } from '@vercel/blob';
import { publicCases } from '@/lib/cases';

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

export async function getPrivateDashboardData() {
  const [submissionBlobs, evidenceBlobs] = await Promise.all([
    listAll('submissions/'),
    listAll('evidence/'),
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

  const municipalityRanking = groupCount(submissions.map((item) => item.municipality));
  const categoryRanking = groupCount(submissions.map((item) => item.category));
  const statusRanking = groupCount(submissions.map((item) => item.status));
  const levelRanking = groupCount(
    submissions.map((item) => item.review?.verificationLevel || 'unreviewed'),
  );

  const dailySubmissions = groupCount(
    submissions.map((item) => item.createdAt ? item.createdAt.slice(0, 10) : 'Sem data'),
  ).sort((a, b) => a.label.localeCompare(b.label));

  return {
    generatedAt: new Date().toISOString(),
    metrics: {
      submissions: submissions.length,
      identified,
      anonymous,
      evidenceFiles: evidenceBlobs.length,
      evidenceBytes: totalEvidenceBytes,
      municipalities: new Set(submissions.map((item) => item.municipality.trim()).filter(Boolean)).size,
      categories: new Set(submissions.map((item) => item.category.trim()).filter(Boolean)).size,
      publicCases: publicCases.length,
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
      dailySubmissions,
    },
    quality: {
      evidenceCoverage: submissions.length ? Math.round((withEvidence / submissions.length) * 100) : 0,
      eventDateCoverage: submissions.length ? Math.round((withEventDate / submissions.length) * 100) : 0,
      missingReferencedEvidence,
      orphanEvidence: orphanEvidence.map((blob) => ({
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt instanceof Date ? blob.uploadedAt.toISOString() : String(blob.uploadedAt),
      })),
    },
    submissions,
    publicCases,
  };
}
