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
import prebaPackagesIndex from '@/data/investigation/preba-packages-index-2026-10-07.json';
import prebaLajedoPackage from '@/data/investigation/preba-package-01-lajedo-do-tabocal-2026-10-07.json';
import prebaBeloCampoPackage from '@/data/investigation/preba-package-02-belo-campo-2026-10-07.json';
import prebaAracasPackage from '@/data/investigation/preba-package-03-aracas-2026-10-07.json';
import prebaJaguaquaraPackage from '@/data/investigation/preba-package-04-jaguaquara-2026-10-07.json';
import prebaFinalRepresentation from '@/data/investigation/preba-final-representation-2026-10-07.json';
import prebaFinalAnnexIndex from '@/data/investigation/preba-final-annex-index-2026-10-07.json';
import prebaProtocolRelease from '@/data/investigation/preba-protocol-release-2026-10-08.json';
import followMoneyRoadmap from '@/data/investigation/follow-money-roadmap-2026-10-08.json';
import centralEvidenceLedger from '@/data/evidence/central/index-2026-10-08.json';

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
  'preba-priority-packages': prebaPackagesIndex,
  'preba-package-01-lajedo-do-tabocal': prebaLajedoPackage,
  'preba-package-02-belo-campo': prebaBeloCampoPackage,
  'preba-package-03-aracas': prebaAracasPackage,
  'preba-package-04-jaguaquara': prebaJaguaquaraPackage,
  'preba-final-representation': prebaFinalRepresentation,
  'preba-final-annex-index': prebaFinalAnnexIndex,
  'preba-protocol-release': prebaProtocolRelease,
  'follow-money-roadmap': followMoneyRoadmap,
  'central-evidence-ledger': centralEvidenceLedger,
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
