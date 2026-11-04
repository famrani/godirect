import { createHash } from 'node:crypto';

/** Sandbox selection is server-owned. Each owner has an independent test connection. */
export function ownerStripeTestMode():boolean {
  const mode=String(process.env.STRIPE_OWNER_MODE||'').trim().toLowerCase();
  if(mode&&!['test','live'].includes(mode))throw Object.assign(new Error('invalid_stripe_owner_mode'),{status:503});
  if(mode!=='test')return false;
  const secret=String(process.env.STRIPE_SECRET_KEY||'').trim();
  const publishable=String(process.env.STRIPE_PUBLISHABLE_KEY||'').trim();
  if(!secret.startsWith('sk_test_')||!publishable.startsWith('pk_test_'))throw Object.assign(new Error('stripe_test_owners_require_test_keys'),{status:503});
  return true;
}
export function stripeTestNamespace():string {
  const name=String(process.env.STRIPE_TEST_NAMESPACE||'default').trim();
  if(!/^[a-zA-Z0-9_-]{1,48}$/.test(name))throw Object.assign(new Error('invalid_stripe_test_namespace'),{status:503});
  return name;
}
export function ownerStripeAccountId(owner:any):string {
  if(!ownerStripeTestMode())return String(owner?.stripe?.connectedAccountId||owner?.stripeAccountId||'');
  const entry=owner?.stripeTest?.[stripeTestNamespace()];
  if(!entry)return '';
  if(entry.ownerId!==owner.uid||!/^acct_[a-zA-Z0-9]+$/.test(String(entry.connectedAccountId||'')))throw Object.assign(new Error('stripe_test_account_owner_mismatch'),{status:409});
  return entry.connectedAccountId;
}
export function assertOwnerTestAccount(account:any,ownerId:string):void {
  if(account?.deleted||account?.metadata?.goDirectOwnerId!==ownerId||account?.metadata?.goDirectTestNamespace!==stripeTestNamespace()||account?.metadata?.environment!=='test')throw Object.assign(new Error('stripe_test_account_owner_mismatch'),{status:409});
}
export async function ensureOwnerStripeTestAccount(firebase:any,stripe:any,ownerId:string,owner:any):Promise<string> {
  if(!ownerStripeTestMode())throw Object.assign(new Error('stripe_test_owner_mode_disabled'),{status:503});
  if(owner?.uid!==ownerId)throw Object.assign(new Error('owner_access_denied'),{status:403});
  const existing=ownerStripeAccountId(owner);if(existing)return existing;
  const namespace=stripeTestNamespace();
  const country=String(process.env.STRIPE_TEST_ACCOUNT_COUNTRY||'FR').trim().toUpperCase();
  if(!/^[A-Z]{2}$/.test(country))throw Object.assign(new Error('invalid_stripe_test_account_country'),{status:503});
  const digest=createHash('sha256').update(namespace+'|'+ownerId).digest('hex');
  // Owner-authenticated POST only. Standard accounts keep Stripe-hosted TEST onboarding.
  const account=await stripe.accounts.create({type:'standard',country,metadata:{platform:'godirect',goDirectOwnerId:ownerId,goDirectTestNamespace:namespace,environment:'test'}},{idempotencyKey:`gd-test-owner:v1:${digest}`});
  assertOwnerTestAccount(account,ownerId);
  if(!/^acct_[a-zA-Z0-9]+$/.test(String(account.id)))throw new Error('invalid_stripe_account_response');
  const entry={ownerId,connectedAccountId:account.id,accountType:'standard',namespace,mode:'test',createdAt:new Date().toISOString()};
  const saved=await firebase.db.ref(`owners/${ownerId}/stripeTest/${namespace}`).transaction((current:any)=>current||entry,undefined,false);
  if(!saved.committed)throw Object.assign(new Error('stripe_test_connection_changed_retry'),{status:409});
  const selected=saved.snapshot.val();
  if(selected?.ownerId!==ownerId||!/^acct_[a-zA-Z0-9]+$/.test(String(selected?.connectedAccountId||'')))throw Object.assign(new Error('stripe_test_account_owner_mismatch'),{status:409});
  return selected.connectedAccountId;
}
