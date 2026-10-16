import assert from 'node:assert/strict';
import {evaluateIntakeRecovery, type LedgerStage, type ObjectInventory} from '../lib/preba-reconciliation-policy';

const empty:ObjectInventory={originals:0,receipts:0,receiptConsistent:false,originalDigestMatches:false};
const consistent:ObjectInventory={originals:1,receipts:1,receiptConsistent:true,originalDigestMatches:true};
function check(status:LedgerStage, inventory:ObjectInventory, kind:string, reason:string, flagRecovery?:boolean){
  const result=evaluateIntakeRecovery(status,inventory);
  assert.equal(result.kind,kind);
  assert.equal(result.reason,reason);
  if(result.kind==='manual_review'&&flagRecovery!==undefined)assert.equal(result.flagRecovery,flagRecovery);
}
check('reserved',empty,'manual_review','reservation_may_be_in_flight',false);
check('failed',empty,'no_action','failed_without_objects');
check('recovery_required',empty,'manual_review','recovery_no_objects',false);
check('stored',{...empty,originals:1},'manual_review','partial_or_missing_blob_pair',true);
check('stored',{...empty,receipts:1},'manual_review','partial_or_missing_blob_pair',true);
check('recovery_required',consistent,'manual_review','complete_pair_not_finalized',true);
check('quarantined',consistent,'no_action','quarantine_pair_consistent');
check('quarantined',{...consistent,originalDigestMatches:false},'manual_review','quarantine_integrity_mismatch',true);
check('quarantined',{...consistent,receiptConsistent:false},'manual_review','quarantine_integrity_mismatch',true);
check('stored',{...consistent,originals:2},'manual_review','ambiguous_multiple_objects',true);
check('stored',{...consistent,receipts:2},'manual_review','ambiguous_multiple_objects',true);
assert.throws(()=>evaluateIntakeRecovery('stored',{...consistent,originals:-1}),/Invalid/);
console.log('PASS PRE-BA recovery policy: 12 synthetic fault scenarios, no automatic promotion/deletion, fail-closed.');
