import { createHash, randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';
import tracker from '@/data/investigation/preba-diligence-tracker-2026-10-08.json';

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED: Record<string, string> = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg' };
type IntakeResult = { receiptId:string; requestId:string; packageId:string; receivedAt:string; sha256:string; sizeBytes:number; mimeType:string; documentPath:string; receiptPath:string; status:'received_unverified'; };
const requests = new Map(tracker.requests.map(item => [item.requestId, item]));

function typeFromBytes(bytes: Uint8Array): string | null {
  if (bytes.length >= 8 && String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-' && String.fromCharCode(...bytes.slice(-6)).includes('%%EOF')) return ACCEPTED.pdf;
  if (bytes.length >= 8 && [137,80,78,71,13,10,26,10].every((x, i) => bytes[i] === x)) return ACCEPTED.png;
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 && bytes[bytes.length-2] === 255 && bytes[bytes.length-1] === 217) return ACCEPTED.jpg;
  return null;
}

export function validateIntake(input: { requestId:string; packageId:string; filename:string; contentType:string; bytes:Uint8Array }) {
  const request = requests.get(input.requestId);
  if (!request || request.packageId !== input.packageId) throw new Error('Diligência ou pacote desconhecido.');
  if (request.status !== 'requested') throw new Error('Diligência ainda não solicitada formalmente; recebimento bloqueado.');
  if (!/^[^\\/\x00-\x1f]{1,120}$/.test(input.filename)) throw new Error('Nome de arquivo inválido.');
  const extension = input.filename.split('.').pop()?.toLowerCase() || '';
  if (!Object.hasOwn(ACCEPTED, extension)) throw new Error('Extensão não permitida.');
  if (input.bytes.byteLength < 8 || input.bytes.byteLength > MAX_BYTES) throw new Error('Arquivo fora do limite de 8 MB.');
  const detectedType = typeFromBytes(input.bytes);
  if (!detectedType || detectedType !== ACCEPTED[extension] || detectedType !== input.contentType) throw new Error('Tipo do arquivo não confere com a assinatura.');
  return { request, detectedType, extension };
}

export async function receiveDiligence(input: { requestId:string; packageId:string; filename:string; contentType:string; bytes:Uint8Array }) : Promise<IntakeResult> {
  const { detectedType, extension } = validateIntake(input);
  if (process.env.PREBA_INTAKE_ENABLED !== 'true') throw new Error('Recebimento desabilitado até liberação dos controles de segurança.');
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Armazenamento privado não configurado.');
  const receiptId = randomUUID();
  const receivedAt = new Date().toISOString();
  const sha256 = createHash('sha256').update(input.bytes).digest('hex');
  const prefix = `private/preba-intake/${input.packageId}/${input.requestId}/${receiptId}`;
  const documentPath = `${prefix}/original.${extension}`;
  const receiptPath = `${prefix}/receipt.json`;
  const document = await put(documentPath, Buffer.from(input.bytes), {
    access:'private', addRandomSuffix:false, allowOverwrite:false, contentType:detectedType,
  });
  const receipt = {
    schemaVersion:1, receiptId, requestId:input.requestId, packageId:input.packageId,
    receivedAt, filename:input.filename, mimeType:detectedType,
    sha256, sizeBytes:input.bytes.byteLength, documentPath:document.pathname,
    status:'received_unverified' as const,
    security:{ malwareScan:'not_performed', humanReview:'pending', gates:'all_pending', protocolReady:false },
    provenance:'uploaded_by_authenticated_private_session',
  };
  // Receipt is a separate immutable object. If its write fails, original remains quarantined;
  // do not signal success, and recover through a private orphan inventory.
  await put(receiptPath, JSON.stringify(receipt), {
    access:'private', addRandomSuffix:false, allowOverwrite:false, contentType:'application/json',
  });
  return { receiptId, requestId:receipt.requestId, packageId:receipt.packageId,
    receivedAt, sha256, sizeBytes:receipt.sizeBytes, mimeType:detectedType,
    documentPath:document.pathname, receiptPath, status:'received_unverified' };
}
