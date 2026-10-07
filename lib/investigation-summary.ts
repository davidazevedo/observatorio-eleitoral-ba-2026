import municipalityUniverse77 from '@/data/investigation/municipality-universe-77-2026-10-07.json';
import p0ClassificationCoverage from '@/data/investigation/p0-classification-coverage-36-2026-10-06.json';

const universe = municipalityUniverse77.counts;
const p0 = p0ClassificationCoverage.coverage;

export const investigationSummary = {
  asOf: '07/10/2026',
  statewideMunicipalities: 417,
  priorityMunicipalities: universe.totalMunicipalities,
  housingCoreMunicipalities: universe.housingCore,
  expansionMunicipalities: universe.expansionMunicipalities,
  p0ClassifiedMunicipalities: p0.classifiedMunicipalities,
  p0TotalMunicipalities: p0.totalP0Municipalities,
  p0ClassificationPercent: p0.percent,
  ireceCoveredMunicipalities: universe.territoryIreceMunicipalities,
  ireceOfficialMunicipalities: 20,
  centralEvidence: universe.cumulativeCentralEvidence,
} as const;
