// R22.5: only trusted server code writes workflow proofs.
export function initialWorkflow(origin:'admin'|'customer') {
  return {version:25,origin,adminApproved:origin==='admin',depositPaid:false,warrantyProvided:false};
}
export function advanceReservation(b:any):any {
  if(b.workflow?.version!==25)return b;
  const w=b.workflow;
  const deposit=Number(b.bookingDeposit)===0||w.depositPaid===true;
  const warranty=Number(b.securityDeposit)===0||w.warrantyProvided===true;
  const ready=deposit&&warranty&&w.adminApproved===true;
  const terminal=['cancelled','rejected','completed'].includes(b.status);
  return {...b,status:terminal?b.status:ready?'confirmed':'pending',
    paymentStatus:w.balancePaid?'paid':deposit?'deposit_paid':'unpaid',
    warrantyStatus:warranty?(w.warrantyProvidedProof?.kind==='security_payment'?'paid':'provided'):'pending',
    workflow:{...w,depositComplete:deposit,warrantyComplete:warranty,
      waitingFor:!deposit?'deposit':!warranty?'warranty':!w.adminApproved?'admin_approval':'none'},
    ...(ready&&!terminal&&!b.confirmedAt?{confirmedAt:new Date().toISOString()}:{} )};
}
