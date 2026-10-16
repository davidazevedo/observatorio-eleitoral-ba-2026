/**
 * PRE-BA 6E.4: conservative reconciliation decisions for untrusted, partial writes.
 * The evaluator NEVER promotes evidence, deletes objects or changes DB state.
 */
export type LedgerStage = 'reserved'|'stored'|'quarantined'|'failed'|'recovery_required';
export type ObjectInventory = { originals:number; receipts:number; receiptConsistent:boolean; originalDigestMatches:boolean };
export type ReconciliationDecision =
  | {kind:'no_action'; reason:string}
  | {kind:'manual_review'; reason:string; flagRecovery:boolean};

export function evaluateIntakeRecovery(status:LedgerStage, inventory:ObjectInventory):ReconciliationDecision {
  const {originals,receipts,receiptConsistent,originalDigestMatches}=inventory;
  if (![originals,receipts].every(n=>Number.isSafeInteger(n)&&n>=0)) throw new Error('Invalid object inventory counts');
  if(originals>1||receipts>1)
    return {kind:'manual_review',reason:'ambiguous_multiple_objects',flagRecovery:true};
  if(status==='quarantined'){
    return originals===1&&receipts===1&&receiptConsistent&&originalDigestMatches
      ?{kind:'no_action',reason:'quarantine_pair_consistent'}
      :{kind:'manual_review',reason:'quarantine_integrity_mismatch',flagRecovery:true};
  }
  if(status==='failed'&&originals===0&&receipts===0)
    return {kind:'no_action',reason:'failed_without_objects'};
  if(status==='reserved'&&originals===0&&receipts===0)
    return {kind:'manual_review',reason:'reservation_may_be_in_flight',flagRecovery:false};
  if(status==='recovery_required'&&originals===0&&receipts===0)
    return {kind:'manual_review',reason:'recovery_no_objects',flagRecovery:false};
  if(originals!==1||receipts!==1)
    return {kind:'manual_review',reason:'partial_or_missing_blob_pair',flagRecovery:true};
  if(!receiptConsistent||!originalDigestMatches)
    return {kind:'manual_review',reason:'receipt_or_digest_mismatch',flagRecovery:true};
  return {kind:'manual_review',reason:'complete_pair_not_finalized',flagRecovery:true};
}
