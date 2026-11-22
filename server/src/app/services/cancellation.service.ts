import {queueNotification,queueBookingChange,emitNotification} from './email-notifications.js';
import { createHash, randomUUID } from 'node:crypto';
import type { FirebaseService } from './firebase.service.js';
import type Stripe from 'stripe';
import { updateExisting } from './existing-transaction.js';

const pendingStates=['refund_pending','refund_failed','review_required'];
export function cancellationLocked(b:any):boolean { return pendingStates.includes(b?.cancellation?.status); }
const fail=(code:string)=>Object.assign(new Error(code),{status:409});
const stamp=()=>new Date().toISOString();

/** Only server-verified Stripe state can finish a paid cancellation. */
export class CancellationService {
  constructor(private readonly firebase:FirebaseService,private readonly stripe:Stripe) {}
  private async pages(list:any,params:any,options:any):Promise<any[]> {
    const rows:any[]=[];let after:string|undefined;
    for(;;){const page=await list({...params,limit:100,...(after?{starting_after:after}:{})},options);rows.push(...page.data);if(!page.has_more)break;const last=page.data.at(-1)?.id;if(!last||last===after)throw fail('stripe_pagination_incomplete');after=last;}
    return rows;
  }
  async run(path:string,ownerId:string,initiate:boolean):Promise<any> {
    const ref=this.firebase.db.ref(path);const token=randomUUID();
    const locked=await updateExisting(ref,(b:any)=>{
      if(b.ownerId!==ownerId||['cancelled','rejected','completed'].includes(b.status))return;
      if(Object.values(b.checkoutOperations||{}).some(Boolean))return;
      if(b.cancellation?.lockUntil>Date.now())return;
      if(!initiate&&!cancellationLocked(b))return;
      return {...b,cancellation:{...(b.cancellation||{}),status:'refund_pending',approvedBy:b.cancellation?.approvedBy||ownerId,approvedAt:b.cancellation?.approvedAt||stamp(),lockToken:token,lockUntil:Date.now()+120000},cancellationRequestStatus:'approved',updatedAt:stamp()};
    });
    if(!locked.committed)throw fail('cancellation_busy_or_booking_closed');
    const b=locked.snapshot.val();let items:any[]=[];
    try{
      // Query the complete ledger, not only its optional secondary index.
      const snap=await this.firebase.db.ref('payments').orderByChild('bookingId').equalTo(b.id).once('value');
      const records:any[]=Object.entries(snap.val()||{}).map(([key,value]:any)=>({...value,ledgerKey:key}));
      const expectedMode=String(process.env.STRIPE_SECRET_KEY||'').startsWith('sk_test_')?'test':'live';
      if(b.stripeMode&&b.stripeMode!==expectedMode)throw fail('booking_stripe_mode_mismatch');
      if((b.paymentCheckoutStartedAt&&!records.length)||(!b.workflow&&b.status==='confirmed'&&Number(b.bookingDeposit)>0))throw fail('cancellation_financial_review_required');
      if(b.financialReviewRequired)throw fail('cancellation_financial_review_required');
      for(const field of ['depositPaid','balancePaid','warrantyProvided']){
        const proof=b.workflow?.[field+'Proof'];
        if(b.workflow?.[field]===true&&(!proof?.intentId||!records.some(r=>r.stripePaymentIntentId===proof.intentId)))throw fail('cancellation_financial_review_required');
      }
      if(!b.workflow&&([b.depositPaid,b.balancePaid].includes(true)||['paid','deposit_paid','fully_paid'].includes(b.paymentStatus)||['paid','provided'].includes(b.warrantyStatus)))throw fail('cancellation_financial_review_required');
      const seen=new Set<string>();
      for(const record of records){
        const id=String(record.stripePaymentIntentId||record.id||'');const account=String(record.stripeConnectedAccountId||'');
        if(record.bookingPath!==path||record.ownerId!==ownerId||record.assetId!==b.assetId||!account||!/^acct_[a-zA-Z0-9]+$/.test(account)||! /^(pi|seti)_[a-zA-Z0-9]+$/.test(id))throw fail('cancellation_financial_review_required');
        if(record.stripeMode&&record.stripeMode!==expectedMode)throw fail('booking_stripe_mode_mismatch');
        const pair=account+':'+id;if(seen.has(pair))continue;seen.add(pair);
        const opts={stripeAccount:account};const setup=id.startsWith('seti_');
        let intent:any=setup?await this.stripe.setupIntents.retrieve(id,{},opts):await this.stripe.paymentIntents.retrieve(id,{},opts);
        if(intent.livemode!==(expectedMode==='live')||intent.metadata?.platform!=='godirect'||intent.metadata?.bookingPath!==path||intent.metadata?.bookingId!==b.id||intent.metadata?.ownerId!==ownerId)throw fail('cancellation_payment_scope_mismatch');
        if(!['succeeded','canceled'].includes(intent.status)&&initiate){
          // Processing intents may reject cancellation: leave the booking active.
          intent=setup?await this.stripe.setupIntents.cancel(id,{},opts):await this.stripe.paymentIntents.cancel(id,{},opts);
        }
        if(setup){
          items.push({intentId:id,kind:record.kind,accountId:account,collected:0,refunded:0,pending:0,status:['succeeded','canceled'].includes(intent.status)?'no_charge':'processing'});
          continue;
        }
        const charges=await this.pages(this.stripe.charges.list.bind(this.stripe.charges),{payment_intent:id},opts);
        let collected=0,refunded=0,pending=0;let review=false;
        for(const charge of charges){
          if(!charge.paid)continue;
          if(charge.disputed)throw fail('cancellation_dispute_review_required');
          const captured=Number(charge.amount_captured??(charge.captured?charge.amount:0));
          if(!Number.isSafeInteger(captured)||captured<0||charge.currency!==record.currency)throw fail('cancellation_payment_scope_mismatch');
          collected+=captured;
          let refunds=await this.pages(this.stripe.refunds.list.bind(this.stripe.refunds),{charge:charge.id},opts);
          const success=()=>refunds.filter(r=>r.status==='succeeded').reduce((sum,r)=>sum+r.amount,0);
          const inFlight=()=>refunds.filter(r=>!['succeeded','failed','canceled'].includes(r.status)).reduce((sum,r)=>sum+r.amount,0);
          const remaining=captured-success()-inFlight();
          if(remaining>0&&initiate){
            const digest=createHash('sha256').update(path+'|'+account+'|'+charge.id+'|'+refunds.map(r=>r.id+':'+r.status).sort().join(',')).digest('hex');
            await this.stripe.refunds.create({charge:charge.id,amount:remaining,reason:'requested_by_customer',metadata:{platform:'godirect',bookingId:b.id,bookingPath:path,ownerId}},{...opts,idempotencyKey:'gd-cancel:'+digest});
            refunds=await this.pages(this.stripe.refunds.list.bind(this.stripe.refunds),{charge:charge.id},opts);
          }
          refunded+=success();pending+=inFlight();
          if(refunds.some(r=>r.status==='failed')&&success()<captured&&inFlight()===0)review=true;
        }
        if(collected!==Number(intent.amount_received||0))throw fail('cancellation_payment_scope_mismatch');
        const settled=['succeeded','canceled'].includes(intent.status)&&Number(intent.amount_capturable||0)===0&&refunded===collected&&pending===0;
        const item={intentId:id,kind:record.kind,accountId:account,currency:record.currency,collected,refunded,pending,status:settled?'refunded':review?'refund_failed':'refund_pending'};
        items.push(item);
        await this.firebase.db.ref(`payments/${record.ledgerKey}`).update({cancellationRefund:item,updatedAt:stamp()});
      }
      const complete=items.every(r=>['refunded','no_charge'].includes(r.status));
      const state=complete?'completed':items.some(r=>r.status==='refund_failed')?'refund_failed':'refund_pending';
      const saved=await updateExisting(ref,(current:any)=>{
        if(current.ownerId!==ownerId||current.cancellation?.lockToken!==token||current.cancellation.lockUntil<=Date.now())return;
        return {...current,...(complete?{status:'cancelled',cancelledAt:stamp(),cancellationRequestStatus:'completed'}:{}),cancellation:{...current.cancellation,status:state,items,verifiedAt:stamp(),lockToken:null,lockUntil:0,error:null},updatedAt:stamp()};
      });
      if(!saved.committed)throw fail('cancellation_changed_retry');
      const booking=saved.snapshot.val();if(complete){await emitNotification(this.firebase,{key:booking.id+'|cancelled',kind:'booking.cancelled',type:booking.assetType,assetId:booking.assetId,ownerId:booking.ownerId,bookingId:booking.id}).catch(()=>undefined);for(const item of items)if(item.refunded>0)await emitNotification(this.firebase,{key:item.intentId+'|'+item.refunded,kind:'payment.refunded',type:booking.assetType,assetId:booking.assetId,ownerId:booking.ownerId,bookingId:booking.id,amount:item.refunded/100,currency:item.currency}).catch(()=>undefined);}return booking;
    }catch(e:any){
      await updateExisting(ref,(current:any)=>current.cancellation?.lockToken===token?{...current,cancellation:{...current.cancellation,status:String(e.message||'').includes('review')||String(e.message||'').includes('scope')?'review_required':'refund_failed',items,error:e.code||e.message||'refund_failed',lockToken:null,lockUntil:0},updatedAt:stamp()}:undefined);
      throw e;
    }
  }
  async reconcilePayment(intentId:string,accountId:string):Promise<void>{
    const snap=await this.firebase.db.ref('payments').orderByChild('stripePaymentIntentId').equalTo(intentId).once('value');
    for(const record of Object.values(snap.val()||{}) as any[]){
      if(record.stripeConnectedAccountId!==accountId||!/^bookings\/(boat|car|property|parking|pool)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(record.bookingPath||''))continue;
      const b=(await this.firebase.db.ref(record.bookingPath).once('value')).val();
      if(cancellationLocked(b)){
        if(b.cancellation?.lockUntil>Date.now())throw Object.assign(new Error('cancellation_reconciliation_retry'),{status:503});
        await this.run(record.bookingPath,record.ownerId,false);
      }
    }
  }
}
