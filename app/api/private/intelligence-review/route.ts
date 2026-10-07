import { NextResponse } from 'next/server';
import municipalityUniverse77 from '@/data/investigation/municipality-universe-77-2026-10-07.json';
import {
  listIntelligenceRecords,
  persistIntelligenceReview,
  type EvidenceLevel,
  type IntelligenceClassification,
  type IntelligenceWorkflowState,
  type Priority,
} from '@/lib/intelligence';
import { isPrivateRequestAuthenticated } from '@/lib/private-auth';

export const runtime = 'nodejs';

const workflowStates = new Set<IntelligenceWorkflowState>(['new','analyzing','corroborated','discarded','promoted']);
const classifications = new Set<IntelligenceClassification>([
  'unclassified','documented_fact','apparent_incompatibility','document_gap','lawful_explanation','investigative_hypothesis',
]);
const levels = new Set<EvidenceLevel>(['L0','L1','L2','L3','L4']);
const priorities = new Set<Priority>(['low','medium','high','urgent']);
const priorityMunicipalities = new Set(municipalityUniverse77.municipalities.map((item) => item.name));

function value(input: unknown, max: number) {
  return typeof input === 'string' ? input.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  if (!isPrivateRequestAuthenticated(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const body = await request.json();
    const recordId = value(body?.recordId, 120);
    const workflowState = value(body?.workflowState, 40) as IntelligenceWorkflowState;
    const classification = value(body?.classification, 60) as IntelligenceClassification;
    const evidenceLevel = value(body?.evidenceLevel, 10) as EvidenceLevel;
    const priority = value(body?.priority, 20) as Priority;
    const requestedMunicipality = value(body?.municipality, 160);
    const caseId = value(body?.caseId, 120);
    const note = value(body?.note, 2000);

    if (!recordId || !workflowStates.has(workflowState) || !classifications.has(classification) || !levels.has(evidenceLevel) || !priorities.has(priority)) {
      return NextResponse.json({ error: 'Campos de revisão inválidos.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
    }

    const records = await listIntelligenceRecords();
    const record = records.find((item) => item.recordId === recordId);
    if (!record) {
      return NextResponse.json({ error: 'Registro de inteligência não encontrado.' }, { status: 404, headers: { 'cache-control': 'no-store' } });
    }

    const municipality = requestedMunicipality || record.municipality || '';
    if (municipality && !priorityMunicipalities.has(municipality)) {
      return NextResponse.json({ error: 'O município deve pertencer ao Universo 77.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
    }

    if (workflowState === 'promoted') {
      if (!municipality) {
        return NextResponse.json({ error: 'Para promover, vincule o registro a um município do Universo 77.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
      }
      if (classification === 'unclassified') {
        return NextResponse.json({ error: 'Para promover, classifique o papel probatório do registro.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
      }
      if (!['L2','L3','L4'].includes(evidenceLevel)) {
        return NextResponse.json({ error: 'Promoção probatória exige nível L2, L3 ou L4.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
      }
      if (!record.provenance?.sourceUrl && !record.provenance?.checksum) {
        return NextResponse.json({ error: 'Promoção probatória exige URL de fonte ou checksum de proveniência.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
      }
    }

    const result = await persistIntelligenceReview({
      recordId,
      workflowState,
      classification,
      evidenceLevel,
      priority,
      municipality: municipality || undefined,
      caseId: caseId || undefined,
      note: note || undefined,
    });

    return NextResponse.json(
      { ok: true, event: result.event, pathname: result.pathname },
      { status: 201, headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Falha ao registrar revisão.' },
      { status: 400, headers: { 'cache-control': 'no-store' } },
    );
  }
}
