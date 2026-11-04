import { CancellationService } from './cancellation.service.js';
import { ownerStripeTestMode } from './owner-stripe-mode.js';
import { updateExisting } from './existing-transaction.js';
import { advanceReservation } from './reservation-workflow.js';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { FirebaseService } from './firebase.service.js';

export class StripeService {
  readonly stripe: Stripe;
  readonly cancellations: CancellationService;
  constructor(private readonly firebase: FirebaseService) {
    ownerStripeTestMode();
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) console.warn('[Stripe] STRIPE_SECRET_KEY is missing; Stripe routes will fail until configured.');
    this.stripe = new Stripe(key || 'sk_test_missing');
    this.cancellations = new CancellationService(firebase,this.stripe);
  }
  webhook = async (req: Request, res: Response) => {
    const sig=req.header('stripe-signature'); const secret=process.env.STRIPE_WEBHOOK_SECRET;
    if(!sig||!secret) return res.status(400).send('Webhook not configured');
    let event:Stripe.Event;
    try{event=this.stripe.webhooks.constructEvent(req.body,sig,secret);}catch{return res.status(400).send('Invalid webhook signature');}
    if(['refund.created','refund.updated','refund.failed','charge.refunded'].includes(event.type)&&event.account){
      const object:any=event.data.object;const id=typeof object.payment_intent==='string'?object.payment_intent:object.payment_intent?.id;
      if(id)await this.cancellations.reconcilePayment(id,event.account);
      return res.json({received:true});
    }
    if(event.type==='account.updated'){
      if(ownerStripeTestMode()&&event.livemode===false)return res.json({received:true});
      const account=event.data.object as Stripe.Account;
      const q=await this.firebase.db.ref('owners').orderByChild('stripe/connectedAccountId').equalTo(account.id).once('value');
      const updates:Record<string,unknown>={};
      q.forEach(c=>{ const base=`owners/${c.key}/stripe`; updates[`${base}/onboardingComplete`]=!!(account.charges_enabled&&account.payouts_enabled); updates[`${base}/chargesEnabled`]=!!account.charges_enabled; updates[`${base}/payoutsEnabled`]=!!account.payouts_enabled; });
      if(Object.keys(updates).length) await this.firebase.db.ref().update(updates);
    }
    if(['payment_intent.succeeded','setup_intent.succeeded','payment_intent.payment_failed','payment_intent.canceled','setup_intent.setup_failed','setup_intent.canceled'].includes(event.type)) {
      const intent:any=event.data.object;
      const accountId=event.account;
      if(!accountId||intent.metadata?.platform!=='godirect')return res.json({received:true});
      let record=(await this.firebase.db.ref(`payments/${intent.id}`).once('value')).val();
      // Return a retryable error if Stripe delivered before checkout persistence.
      if(!record){
        // R22.4 stored random payment keys and did not include bookingPath metadata.
        const legacy=await this.firebase.db.ref('payments').orderByChild('stripePaymentIntentId').equalTo(intent.id).once('value');
        const updates:Record<string,unknown>={};
        legacy.forEach(child=>{const r=child.val();if(r.stripeConnectedAccountId===accountId&&r.bookingId===intent.metadata.bookingId){updates[`payments/${child.key}/status`]=r.status==='succeeded'?'succeeded':intent.status;updates[`payments/${child.key}/webhookEventId`]=event.id;}});
        if(Object.keys(updates).length){await this.firebase.db.ref().update(updates);return res.json({received:true});}
      }
      if(!record)return res.status(503).json({error:'payment_record_not_ready'});
      if(record.stripeMode&&event.livemode!==(record.stripeMode==='live'))return res.status(400).json({error:'stripe_event_mode_mismatch'});
      if(record.stripeConnectedAccountId!==accountId||record.bookingId!==intent.metadata.bookingId||record.kind!==intent.metadata.kind||record.bookingPath!==intent.metadata.bookingPath)return res.status(400).json({error:'payment_scope_mismatch'});
      if(!/^bookings\/(boat|car|parking|property|pool)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(record.bookingPath))return res.status(400).json({error:'invalid_booking_scope'});
      const success=event.type.endsWith('.succeeded');
      if(success&&record.kind!=='security_deposit'&&(intent.amount_received!==Math.round(record.amount*100)||intent.currency!==record.currency))return res.status(400).json({error:'payment_amount_mismatch'});
      if(success&&record.kind==='security_deposit'&&!intent.payment_method)return res.status(400).json({error:'warranty_proof_missing'});
      // Booking-level transaction preserves simultaneous deposit/warranty/approval updates.
      if(success){
        const result=await updateExisting(this.firebase.db.ref(record.bookingPath),(b:any)=>{
          if(!b||b.id!==record.bookingId||b.ownerId!==record.ownerId||(record.stripeMode&&b.stripeMode!==record.stripeMode)||(b.stripeConnectedAccountId&&b.stripeConnectedAccountId!==record.stripeConnectedAccountId))return;
          const expected=record.kind==='booking_deposit'?b.bookingDeposit:record.kind==='balance'?b.balanceAmount:b.securityDeposit;
          if(Number(expected)!==record.amount||String(b.currency).toLowerCase()!==record.currency)return;
          const field=record.kind==='booking_deposit'?'depositPaid':record.kind==='balance'?'balancePaid':'warrantyProvided';
          if(b.workflow?.[field+'Proof']?.intentId===intent.id)return b;
          return advanceReservation({...b,workflow:{...(b.workflow||{}),[field]:true,
            [field+'Proof']:{kind:record.kind,intentId:intent.id,eventId:event.id,accountId,verifiedAt:new Date().toISOString(),...(record.kind==='security_deposit'?{paymentMethodId:String(intent.payment_method),customerId:String(intent.customer||'')}:{})}},updatedAt:new Date().toISOString()});
        });
        if(!result.committed)return res.status(409).json({error:'booking_payment_mismatch'});
      }
      const saved=await updateExisting(this.firebase.db.ref(`payments/${intent.id}`),(old:any)=>({...old,status:old.status==='succeeded'?'succeeded':intent.status,webhookEventId:event.id,updatedAt:new Date().toISOString()}));
      if(!saved.committed)return res.status(503).json({error:'payment_record_update_retry'});
      await this.cancellations.reconcilePayment(intent.id,accountId);
    }
    return res.json({received:true});
  };
}
