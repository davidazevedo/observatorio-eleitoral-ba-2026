import { get, put } from '@vercel/blob';
import { createHash } from 'node:crypto';
import { centralEvidenceAsIntelligence } from '@/lib/central-evidence';

function digest(value: string) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

export async function syncCentralEvidenceToPrivateBlob(selectedIds?: string[]) {
  const selected = new Set(selectedIds || []);
  const records = centralEvidenceAsIntelligence().filter(item => !selected.size || selected.has(item.recordId));
  const results: Array<{recordId:string;state:string;pathname:string;sha256:string;error?:string}> = [];

  for (const record of records) {
    const pathname = `intelligence/records/central-evidence/${record.recordId}.json`;
    const payload = JSON.stringify(record, null, 2);
    const sha256 = digest(payload);
    try {
      const existing = await get(pathname, { access: 'private', useCache: false });
      if (existing && existing.statusCode === 200) {
        const old = await new Response(existing.stream).text();
        results.push({ recordId: record.recordId, state: digest(old) === sha256 ? 'unchanged' : 'conflict', pathname, sha256 });
        continue;
      }
      await put(pathname, payload, {
        access: 'private', contentType: 'application/json',
        addRandomSuffix: false, allowOverwrite: false,
      });
      results.push({recordId: record.recordId, state: 'created', pathname, sha256});
    } catch (error) {
      results.push({
        recordId: record.recordId, state: 'error', pathname, sha256,
        error: error instanceof Error ? error.message : 'Erro de replicação',
      });
    }
  }

  const created = results.filter(item => item.state === 'created').length;
  const unchanged = results.filter(item => item.state === 'unchanged').length;
  return {
    ok: results.length === records.length && results.every(item => ['created','unchanged'].includes(item.state)),
    requested: records.length, created, unchanged,
    conflicts: results.filter(item => item.state === 'conflict').length,
    errors: results.filter(item => item.state === 'error').length,
    results,
  };
}
