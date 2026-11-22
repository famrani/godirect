import {connectedCustomer} from './connected-customer.js';
import { randomUUID } from 'node:crypto';
import { cancellationLocked } from './cancellation.service.js';
import { ownerStripeTestMode, ownerStripeAccountId, assertOwnerTestAccount } from './owner-stripe-mode.js';
import { updateExisting } from './existing-transaction.js';
import { ensureReservationWorkflow, bookingPayments } from './reservation-compatibility.js';
import { findAsset } from './asset-paths.service.js';
import { Request, Response } from 'express';
import { z } from 'zod';
import { FirebaseService } from './firebase.service.js';
import { StripeService } from './stripe.service.js';
import { requireUser } from './stripe-auth.service.js';

const schema=z.object({bookingId:z.string().regex(/^[a-zA-Z0-9_-]+$/),kind:z.enum(['booking_deposit','balance','security_deposit','security_payment'])});
export class PaymentsService {
  config=async(_req:Request,res:Response)=>{
    ownerStripeTestMode();
    const publishableKey=String(process.env.STRIPE_PUBLISHABLE_KEY||'').trim();
    if(!publishableKey) return res.status(503).json({error:'stripe_publishable_key_not_configured'});
    return res.json({publishableKey,mode:publishableKey.startsWith('pk_live_')?'live':'test',directCharges:true,goDirectCommissionPercent:0});
  };

  constructor(private readonly firebase: FirebaseService,private readonly stripeSvc: StripeService) {}
  checkout=async(req:Request,res:Response)=>{
    const uid=await requireUser(req,this.firebase); const p=schema.parse(req.body); let bookingPath=`bookings/${p.bookingId}`; let b=(await this.firebase.db.ref(`bookings/${p.bookingId}`).once('value')).val();
    if(!b){
      for(const type of ['boat','car','parking','property','pool']) { const index=(await this.firebase.db.ref(`bookingsByCustomer/${uid}/${type}/${p.bookingId}`).once('value')).val(); if(typeof index==='string' && /^bookings\/(boat|car|parking|property|pool)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(index)) { b=(await this.firebase.db.ref(index).once('value')).val(); if(b){bookingPath=index;break;} } }
    }
    if(!b)return res.status(404).json({error:'booking_not_found'});
    if(![b.customerId,b.userId,b.customerUid].includes(uid)) return res.status(403).json({error:'booking_access_denied'});
    b=await ensureReservationWorkflow(this.firebase,bookingPath);
    if(!b)return res.status(404).json({error:'booking_not_found'});
    if(cancellationLocked(b))return res.status(409).json({error:'cancellation_in_progress'});
    if(b.financialReviewRequired)return res.status(409).json({error:'legacy_payment_review_required'});
    if((['cancelled','rejected'].includes(b.status)||(b.status==='completed'&&p.kind!=='balance')))return res.status(409).json({error:'booking_closed'});
    const stripeMode=String(process.env.STRIPE_SECRET_KEY||'').startsWith('sk_test_')?'test':'live';
    if(b.stripeMode&&b.stripeMode!==stripeMode)return res.status(409).json({error:'booking_stripe_mode_mismatch'});
    const proof=p.kind==='booking_deposit'?'depositPaid':p.kind==='balance'?'balancePaid':'warrantyProvided';
    if(b.workflow?.[proof])return res.status(409).json({error:'already_completed'});
    const asset=await findAsset(this.firebase,b.assetId,b.assetType);
    if(!asset || !asset.ownerId) return res.status(409).json({error:'asset_owner_missing'});
    // Resolve payment destination from the current asset, never from a client amount or stale booking owner.
    const canonicalOwnerId=String(asset.ownerId);
    if(canonicalOwnerId!==String(b.ownerId))return res.status(409).json({error:'booking_owner_changed_review_required'});
    const owner=(await this.firebase.db.ref(`owners/${canonicalOwnerId}`).once('value')).val();
    if(!owner || owner.uid!==canonicalOwnerId) return res.status(409).json({error:'owner_profile_invalid'}); const accountId=ownerStripeAccountId(owner); if(!accountId)return res.status(409).json({error:ownerStripeTestMode()?'owner_stripe_test_not_connected':'owner_stripe_not_connected'});
    if(b.stripeConnectedAccountId&&b.stripeConnectedAccountId!==accountId)return res.status(409).json({error:'booking_stripe_account_mismatch'});
    const account=await this.stripeSvc.stripe.accounts.retrieve(accountId);
    if(ownerStripeTestMode())assertOwnerTestAccount(account,canonicalOwnerId);
    if((account as any).deleted || !(account as any).charges_enabled) return res.status(409).json({error:ownerStripeTestMode()?'stripe_test_account_not_ready':'owner_stripe_charges_not_enabled'});
    const amount=p.kind==='booking_deposit'?b.bookingDeposit:p.kind==='balance'?b.balanceAmount:b.securityDeposit; if(!Number.isFinite(Number(amount)) || Number(amount)<=0) return res.status(400).json({error:'invalid_amount'});
    const existing=await bookingPayments(this.firebase,String(b.id));
    if(existing.some(r=>r.status!=='canceled'&&r.stripeConnectedAccountId&&r.stripeConnectedAccountId!==accountId))return res.status(409).json({error:'booking_stripe_account_mismatch'});
    const idempotencyScope=ownerStripeTestMode()?`${accountId}:${b.id}`:String(b.id);
    let attempt=0;
    for(const r of existing){if(r?.kind===p.kind&&r?.status==='succeeded')return res.status(409).json({error:'already_completed'});if(r?.kind===p.kind&&r?.status==='canceled')attempt++;}
    const operation=randomUUID();
    const locked=await updateExisting(this.firebase.db.ref(bookingPath),(current:any)=>{
      if(cancellationLocked(current))return;
      if(!current||(current.stripeMode&&current.stripeMode!==stripeMode)||(current.stripeConnectedAccountId&&current.stripeConnectedAccountId!==accountId)||![current.customerId,current.userId,current.customerUid].includes(uid)||(['cancelled','rejected'].includes(current.status)||(current.status==='completed'&&p.kind!=='balance'))||current.workflow?.[proof])return;
      if(['bookingDeposit','balanceAmount','securityDeposit','currency','startAt','endAt','ownerId'].some(k=>current[k]!==b[k]))return;
      return {...current,checkoutOperations:{...(current.checkoutOperations||{}),[operation]:true},stripeMode,stripeConnectedAccountId:accountId,paymentCheckoutStartedAt:current.paymentCheckoutStartedAt||new Date().toISOString()};
    });
    if(locked.missing)return res.status(404).json({error:'booking_not_found'});
    if(!locked.committed)return res.status(409).json({error:'booking_changed_reload_required'});
    try{
    const metadata={bookingId:String(b.id),bookingPath,kind:p.kind,assetId:String(b.assetId),ownerId:canonicalOwnerId,platform:'godirect'};
    const warranty=p.kind==='security_deposit';const options={stripeAccount:accountId};
    const pending=existing.filter(r=>r.kind===p.kind&&r.status!=='canceled'&&r.status!=='succeeded');
    if(pending.length>1)return res.status(409).json({error:'multiple_pending_payments_review_required'});
    let pi:any=null;
    if(pending.length){
      const previous=pending[0];const previousId=String(previous.stripePaymentIntentId||previous.id||'');
      pi=warranty?await this.stripeSvc.stripe.setupIntents.retrieve(previousId,options):await this.stripeSvc.stripe.paymentIntents.retrieve(previousId,options);
      if(['succeeded','processing','requires_capture'].includes(pi.status))return res.status(409).json({error:'payment_confirmation_pending'});
      if(pi.status==='canceled')return res.status(409).json({error:'payment_cancellation_pending'});
      if(Object.entries(metadata).some(([key,value])=>pi.metadata?.[key]!==value)||(!warranty&&(pi.amount!==Math.round(Number(amount)*100)||pi.currency!==String(b.currency||'eur').toLowerCase())))return res.status(409).json({error:'payment_scope_mismatch'});
    }
    const linked=pi?.customer?(typeof pi.customer==='string'?pi.customer:pi.customer.id):'';
    const customer=await connectedCustomer(this.firebase,this.stripeSvc.stripe,{uid,ownerId:canonicalOwnerId,accountId,mode:stripeMode,email:String(b.customerEmail||''),name:b.customerName,bookingId:String(b.id),candidateId:linked});
    if(linked&&linked!==customer.id)return res.status(409).json({error:'stripe_customer_migration_required'});
    if(!pi){
      // Preserve the previous idempotency recipe. Attach the Customer before returning to Elements.
      pi=warranty
       ?await this.stripeSvc.stripe.setupIntents.create({customer:customer.id,usage:'off_session',payment_method_types:['card'],metadata},{...options,idempotencyKey:`gd25:${idempotencyScope}:warranty:${attempt}`})
       :await this.stripeSvc.stripe.paymentIntents.create({amount:Math.round(Number(amount)*100),currency:String(b.currency||'eur').toLowerCase(),automatic_payment_methods:{enabled:true},metadata},{...options,idempotencyKey:`gd25:${idempotencyScope}:${p.kind}:${Math.round(Number(amount)*100)}:${attempt}`});
    }
    if(['succeeded','processing','requires_capture'].includes(pi.status))return res.status(409).json({error:'payment_confirmation_pending'});
    if(pi.status==='canceled')return res.status(409).json({error:'payment_cancellation_pending'});
    if(!warranty){
      if(pi.customer&&(typeof pi.customer==='string'?pi.customer:pi.customer.id)!==customer.id)return res.status(409).json({error:'stripe_customer_scope_mismatch'});
      pi=await this.stripeSvc.stripe.paymentIntents.update(pi.id,{customer:customer.id,receipt_email:customer.email},options);
    }else if((typeof pi.customer==='string'?pi.customer:pi.customer?.id)!==customer.id)return res.status(409).json({error:'stripe_customer_scope_mismatch'});
    const paymentId=pi.id;
    const payment={id:paymentId,stripeMode,bookingId:b.id,bookingPath,ownerId:canonicalOwnerId,assetId:b.assetId,customerUid:uid,stripeCustomerId:customer.id,customerEmail:customer.email,kind:p.kind,amount:Number(amount),currency:String(b.currency||'eur').toLowerCase(),stripePaymentIntentId:pi.id,stripeConnectedAccountId:accountId,goDirectCommissionAmount:0,goDirectCommissionPercent:0,status:pi.status,createdAt:new Date().toISOString()};
    await this.firebase.db.ref(`payments/${paymentId}`).transaction((old:any)=>{
      if(!old)return payment;
      if(old.bookingId!==b.id||old.stripeConnectedAccountId!==accountId||old.kind!==p.kind)throw Object.assign(new Error('payment_scope_mismatch'),{status:409});
      return {...old,customerUid:uid,stripeCustomerId:customer.id,customerEmail:customer.email};
    },undefined,false);
    await this.firebase.db.ref(`paymentsByBooking/${b.id}/${paymentId}`).set(true);
    return res.json({clientSecret:pi.client_secret,connectedAccountId:accountId,paymentId,mode:warranty?'setup':'payment',stripeMode});
    }finally{
      await updateExisting(this.firebase.db.ref(bookingPath),(current:any)=>{const operations={...(current.checkoutOperations||{})};delete operations[operation];return {...current,checkoutOperations:operations};});
    }
  };
}
