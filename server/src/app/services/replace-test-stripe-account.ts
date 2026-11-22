import {createHash} from 'node:crypto';
import {ownerStripeTestMode,ownerStripeAccountId,stripeTestNamespace,assertOwnerTestAccount} from './owner-stripe-mode.js';

/** Only invoked by the authenticated owner's explicit test-account replacement action. */
export async function replaceTestStripeAccount(firebase:any,stripe:any,ownerId:string,expectedAccountId:string,refreshUrl:string,returnUrl:string):Promise<any>{
  const fail=(code:string,status=409):never=>{throw Object.assign(new Error(code),{status});};
  if(!ownerStripeTestMode())fail('stripe_test_owner_mode_disabled');
  const owner=(await firebase.db.ref(`owners/${ownerId}`).once('value')).val();
  if(owner?.uid!==ownerId)fail('owner_access_denied',403);
  const previous=ownerStripeAccountId(owner);
  if(!previous||previous!==expectedAccountId)fail('stripe_test_connection_changed_retry');
  const namespace=stripeTestNamespace();
  const identity=await firebase.auth.getUser(ownerId);
  const digest=createHash('sha256').update(namespace+'|'+ownerId+'|'+previous).digest('hex');
  // Retries/concurrent clicks for the same previous account create only one replacement.
  const account=await stripe.accounts.create({type:'standard',country:String(process.env.STRIPE_TEST_ACCOUNT_COUNTRY||'FR'),...(identity.email?{email:identity.email}:{}),metadata:{platform:'godirect',goDirectOwnerId:ownerId,goDirectTestNamespace:namespace,environment:'test'}},{idempotencyKey:`gd-test-replace:v1:${digest}`});
  assertOwnerTestAccount(account,ownerId);
  if(!/^acct_[a-zA-Z0-9]+$/.test(String(account.id))||account.id===previous)fail('stripe_test_new_account_required');
  // Prepare the hosted setup before switching; a link failure leaves the current account intact.
  const link=await stripe.accountLinks.create({account:account.id,type:'account_onboarding',refresh_url:refreshUrl,return_url:returnUrl});
  const entry={ownerId,connectedAccountId:account.id,previousAccountId:previous,accountType:'standard',namespace,mode:'test',connectionMethod:'api_new_account',connectedAt:new Date().toISOString(),chargesEnabled:!!account.charges_enabled,payoutsEnabled:!!account.payouts_enabled,detailsSubmitted:!!account.details_submitted,onboardingComplete:!!(account.charges_enabled&&account.payouts_enabled),requirementsCurrentlyDue:account.requirements?.currently_due||[]};
  const ref=firebase.db.ref(`owners/${ownerId}/stripeTest/${namespace}`);
  await ref.once('value');
  const saved=await ref.transaction((v:any)=>{
    if(v===null)return null;
    if(v.ownerId!==ownerId)return;
    if(v.connectedAccountId===account.id&&v.previousAccountId===previous)return v;
    if(v.connectedAccountId!==previous)return;
    return entry;
  },undefined,false);
  if(!saved.committed||saved.snapshot.val()?.connectedAccountId!==account.id)fail('stripe_test_connection_changed_retry');
  return {mode:'test',accountId:account.id,previousAccountId:previous,created:true,url:link.url};
}
