import { NextResponse } from 'next/server';
import { verifyIntelligenceApiKey } from '@/lib/intelligence';

import municipalityCohort69 from '@/data/investigation/municipality-cohort-69-2026-10-06.json';
import municipalityUniverse77 from '@/data/investigation/municipality-universe-77-2026-10-07.json';
import p0Triage36 from '@/data/investigation/p0-triage-36-2026-10-06.json';
import p0Classification36 from '@/data/investigation/p0-classification-coverage-36-2026-10-06.json';
import p0ComidaNoPratoControl from '@/data/investigation/p0-comida-no-prato-control-2026-10-06.json';
import p0InfrastructureControl from '@/data/investigation/p0-infrastructure-control-2026-10-06.json';
import ireceP0DeepScan from '@/data/investigation/irece-p0-deep-scan-2026-10-06.json';
import p0RuralMarketGaps from '@/data/investigation/p0-rural-market-gaps-2026-10-06.json';
import centralEvidenceWave01 from '@/preservation/manifests/central-evidence-wave-01-50.json';
import centralEvidenceWave02 from '@/preservation/manifests/central-evidence-wave-02-critical-p0.json';
import centralEvidenceWave03 from '@/preservation/manifests/central-evidence-wave-03-aracas-jaguaquara.json';

export const runtime = 'nodejs';

const datasets = {
  'municipality-universe-77': municipalityUniverse77,
  'cohort-69': municipalityCohort69,
  'p0-triage-36': p0Triage36,
  'p0-classification-36': p0Classification36,
  'p0-comida-no-prato-control': p0ComidaNoPratoControl,
  'p0-infrastructure-control': p0InfrastructureControl,
  'irece-p0-deep-scan': ireceP0DeepScan,
  'p0-rural-market-gaps': p0RuralMarketGaps,
  'central-evidence-wave-01': centralEvidenceWave01,
  'central-evidence-wave-02': centralEvidenceWave02,
  'central-evidence-wave-03': centralEvidenceWave03,
} as const;

type DatasetName = keyof typeof datasets;

function isDatasetName(value: string): value is DatasetName {
  return Object.prototype.hasOwnProperty.call(datasets, value);
}

export async function GET(request: Request) {
  if (!verifyIntelligenceApiKey(request)) {
    return NextResponse.json(
      { error: 'Não autorizado.' },
      { status: 401, headers: { 'cache-control': 'no-store' } },
    );
  }

  const url = new URL(request.url);
  const name = (url.searchParams.get('name') || '').trim();

  if (!name) {
    return NextResponse.json(
      {
        ok: true,
        api: 'intel-datasets-v1',
        datasets: Object.entries(datasets).map(([datasetName, payload]) => ({
          name: datasetName,
          schemaVersion: (payload as { schemaVersion?: number }).schemaVersion ?? null,
        })),
      },
      { headers: { 'cache-control': 'private, no-store' } },
    );
  }

  if (!isDatasetName(name)) {
    return NextResponse.json(
      { error: 'Dataset inválido.', available: Object.keys(datasets) },
      { status: 400, headers: { 'cache-control': 'private, no-store' } },
    );
  }

  return NextResponse.json(
    { ok: true, name, data: datasets[name] },
    { headers: { 'cache-control': 'private, no-store' } },
  );
}
