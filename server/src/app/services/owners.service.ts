import {replaceTestStripeAccount} from './replace-test-stripe-account.js';
import {stripeReturnOrigin} from './stripe-return-origin.js';
import {ListingImportService} from './listing-import.js';
import {provisionTestOwner,testProvisioningEnabled} from './test-owner-provisioning.js';
import { createHash, randomBytes } from 'node:crypto';
import { ownerStripeTestMode, ownerStripeAccountId, assertOwnerTestAccount, stripeTestNamespace } from './owner-stripe-mode.js';
import { findAsset } from './asset-paths.service.js';
import { Request, Response } from 'express';
import { FirebaseService } from './firebase.service.js';
import { StripeService } from './stripe.service.js';
import { requireOwner } from './stripe-auth.service.js';

export class OwnersService {
  private listingImporter?:ListingImportService;
  importListing=(req:Request,res:Response)=>(this.listingImporter ||= new ListingImportService(this.firebase)).preview(req,res);
  importPhoto=(req:Request,res:Response)=>(this.listingImporter ||= new ListingImportService(this.firebase)).photo(req,res);
  constructor(private readonly firebase: FirebaseService, private readonly stripeSvc: StripeService) {}
  connect = async (req: Request,res: Response) => {
    const ownerId=String(req.params.ownerId); await requireOwner(req,this.firebase,ownerId); const ref=this.firebase.db.ref(`owners/${ownerId}`); const owner=(await ref.once('value')).val();
    if(!owner) return res.status(404).json({error:'owner_not_found'});
    const configured=(process.env.FRONTEND_URL||'').replace(/\/$/,'');
    if(!configured) return res.status(500).json({error:'frontend_url_missing'});
    const front=await stripeReturnOrigin(this.firebase,ownerId,String(req.body?.returnOrigin||req.header('origin')||configured),configured);
    // Redirect to the same asset's management payments page, only if it belongs to this UID.
    const assetType=String(req.body?.assetType||'');
    const assetId=String(req.body?.assetId||'');
    let paymentPath='/owner/payments';
    if (assetId && ['boat','car','property','parking','pool'].includes(assetType) && /^[a-zA-Z0-9_-]+$/.test(assetId)) {
      const asset=await findAsset(this.firebase,assetId);
      if (!asset || asset.ownerId!==ownerId || asset.assetType!==assetType) return res.status(403).json({error:'asset_access_denied'});
      paymentPath=req.body?.resumeWizard===true?'/owner/listings?'+new URLSearchParams({editType:assetType,editId:assetId,wizard:'stripe'}).toString():`/${assetType}/${assetId}/owner/payments`;
    }
    if(req.body?.resumeWizard===true&&paymentPath==='/owner/payments')return res.status(400).json({error:'wizard_asset_required'});
    const querySeparator=paymentPath.includes('?')?'&':'?';
    if(ownerStripeTestMode()){
      const existing=ownerStripeAccountId(owner);
      if(req.body?.replaceExisting===true){
        const result=await replaceTestStripeAccount(this.firebase,this.stripeSvc.stripe,ownerId,String(req.body?.expectedAccountId||''),`${front}${paymentPath}${querySeparator}refresh=1`,`${front}${paymentPath}${querySeparator}connected=1`);
        res.setHeader('Cache-Control','no-store');return res.json(result);
      }
      if(existing&&req.body?.replaceExisting!==true){
        const account=await this.stripeSvc.stripe.accounts.retrieve(existing);
        assertOwnerTestAccount(account,ownerId);
        const link=await this.stripeSvc.stripe.accountLinks.create({account:existing,type:'account_onboarding',refresh_url:`${front}${paymentPath}${querySeparator}refresh=1`,return_url:`${front}${paymentPath}${querySeparator}connected=1`});
        return res.json({mode:'test',accountId:existing,continuing:true,url:link.url});
      }
      const clientId=String(process.env.STRIPE_TEST_CONNECT_CLIENT_ID||'');
      const redirectUri=String(process.env.STRIPE_TEST_CONNECT_REDIRECT_URI||'');
      if(!/^ca_[a-zA-Z0-9]+$/.test(clientId)||!redirectUri)return res.status(503).json({error:'stripe_test_oauth_config_missing'});
      const state=randomBytes(32).toString('hex');
      const key=createHash('sha256').update(state).digest('hex');
      const namespace=stripeTestNamespace();
      await this.firebase.db.ref(`stripeOAuthStates/${key}`).set({ownerId,namespace,paymentPath,returnOrigin:front,expiresAt:Date.now()+10*60*1000,previousAccountId:ownerStripeAccountId(owner),replaceExisting:req.body?.replaceExisting===true});
      const url=new URL('https://connect.stripe.com/oauth/authorize');
      url.search=new URLSearchParams({response_type:'code',client_id:clientId,scope:'read_write',redirect_uri:redirectUri,state}).toString();
      // Use the authenticated Firebase email, preserving Gmail + aliases exactly.
      const identity=await this.firebase.auth.getUser(ownerId);
      if(identity.email&&req.body?.replaceExisting!==true)url.searchParams.set('stripe_user[email]',identity.email);
      url.searchParams.set('stripe_user[country]',String(process.env.STRIPE_TEST_ACCOUNT_COUNTRY||'FR'));
      res.setHeader('Cache-Control','no-store');
      return res.json({mode:'test',perOwnerTestAccount:true,url:url.toString()});
    }
    let accountId=owner?.stripe?.connectedAccountId || owner?.stripeAccountId;
    if(!accountId){ const a=await this.stripeSvc.stripe.accounts.create({type:'standard',metadata:{goDirectOwnerId:ownerId}}); accountId=a.id; await ref.update({stripe:{connectedAccountId:accountId,accountType:'standard',onboardingComplete:false,chargesEnabled:false,payoutsEnabled:false}}); }
    const link=await this.stripeSvc.stripe.accountLinks.create({account:accountId,refresh_url:`${front}${paymentPath}${querySeparator}refresh=1`,return_url:`${front}${paymentPath}${querySeparator}connected=1`,type:'account_onboarding'});
    return res.json({accountId,url:link.url});
  };
  // Public Stripe redirect: authorization comes from the unguessable, one-use state
  // created by the owner-authenticated POST, never from callback owner parameters.
  oauthCallback = async (req: Request,res: Response) => {
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Referrer-Policy','no-referrer');
    if(!ownerStripeTestMode())return res.status(409).json({error:'stripe_test_owner_mode_disabled'});
    const state=typeof req.query.state==='string'?req.query.state:'';
    if(!/^[a-f0-9]{64}$/.test(state))return res.status(400).json({error:'invalid_oauth_state'});
    const key=createHash('sha256').update(state).digest('hex');
    const stateRef=this.firebase.db.ref(`stripeOAuthStates/${key}`);
    // Warm the RTDB cache; returning null on its speculative null callback retries
    // against server data without accidentally consuming an absent state.
    await stateRef.once('value');
    const consumed=await stateRef.transaction((v:any)=>{
      if(v===null)return null;
      if(v.used||v.expiresAt<=Date.now()||v.namespace!==stripeTestNamespace())return;
      return {...v,used:true};
    },undefined,false);
    const entry=consumed.snapshot.val();
    if(!consumed.committed||!entry?.used)return res.status(400).json({error:'invalid_or_expired_oauth_state'});
    const front=(process.env.FRONTEND_URL||'').replace(/\/$/,'');
    if(!front)return res.status(503).json({error:'frontend_url_missing'});
    let returnOrigin=front;
    if(entry.returnOrigin){try{returnOrigin=await stripeReturnOrigin(this.firebase,entry.ownerId,String(entry.returnOrigin),front);}catch{/* An expired domain assignment falls back to the canonical platform. */}}
    const returnUrl=`${returnOrigin}${entry.paymentPath}`;
    const querySeparator=returnUrl.includes('?')?'&':'?';
    if(req.query.error)return res.redirect(`${returnUrl}${querySeparator}stripeOAuth=cancelled`);
    const code=typeof req.query.code==='string'?req.query.code:'';
    if(!code)return res.status(400).json({error:'stripe_oauth_code_missing'});
    const owner=(await this.firebase.db.ref(`owners/${entry.ownerId}`).once('value')).val();
    if(owner?.uid!==entry.ownerId)return res.status(403).json({error:'owner_access_denied'});
    const token=await this.stripeSvc.stripe.oauth.token({grant_type:'authorization_code',code});
    const accountId=String(token.stripe_user_id||'');
    if(token.livemode!==false||token.scope!=='read_write'||!/^acct_[a-zA-Z0-9]+$/.test(accountId))return res.status(409).json({error:'stripe_test_oauth_invalid_account'});
    if(entry.replaceExisting===true&&accountId===entry.previousAccountId)return res.redirect(`${returnUrl}${querySeparator}stripeOAuth=unchanged`);
    const platform=await this.stripeSvc.stripe.accounts.retrieve();
    if(accountId===platform.id)return res.status(409).json({error:'stripe_platform_account_cannot_be_owner'});
    const a=await this.stripeSvc.stripe.accounts.retrieve(accountId);
    if(a.deleted||('type' in a&&a.type!=='standard'))return res.status(409).json({error:'stripe_test_oauth_invalid_account'});
    const metadata=(a as any).metadata||{};
    if(metadata.goDirectOwnerId&&metadata.goDirectOwnerId!==entry.ownerId)return res.status(409).json({error:'stripe_test_account_already_assigned'});
    // Account-level claim survives reconnects and prevents cross-owner reuse.
    const claim=await this.firebase.db.ref(`stripeTestAccountOwners/${accountId}`).transaction((v:any)=>v&&v.ownerId!==entry.ownerId?undefined:{ownerId:entry.ownerId},undefined,false);
    if(!claim.committed)return res.status(409).json({error:'stripe_test_account_already_assigned'});
    await this.stripeSvc.stripe.accounts.update(accountId,{metadata:{platform:'godirect',goDirectOwnerId:entry.ownerId,goDirectTestNamespace:entry.namespace,environment:'test'}});
    const connectionRef=this.firebase.db.ref(`owners/${entry.ownerId}/stripeTest/${entry.namespace}`);
    await connectionRef.once('value');
    const saved=await connectionRef.transaction((v:any)=>{
      if(v===null&&entry.previousAccountId)return null;
      if(String(v?.connectedAccountId||'')!==entry.previousAccountId)return;
      return {ownerId:entry.ownerId,connectedAccountId:accountId,accountType:'standard',namespace:entry.namespace,mode:'test',connectionMethod:'oauth',connectedAt:new Date().toISOString(),previousAccountId:entry.previousAccountId,chargesEnabled:!!a.charges_enabled,payoutsEnabled:!!a.payouts_enabled,detailsSubmitted:!!a.details_submitted,onboardingComplete:!!(a.charges_enabled&&a.payouts_enabled),requirementsCurrentlyDue:a.requirements?.currently_due||[],statusCheckedAt:new Date().toISOString()};
    },undefined,false);
    if(!saved.committed||saved.snapshot.val()?.connectedAccountId!==accountId)return res.status(409).json({error:'stripe_test_connection_changed_retry'});
    return res.redirect(`${returnUrl}${querySeparator}stripeOAuth=connected`);
  };
  provisionTest = async (req: Request,res: Response) => {
    const ownerId=String(req.params.ownerId);
    await requireOwner(req,this.firebase,ownerId);
    res.setHeader('Cache-Control','no-store');
    if(req.body?.acceptSyntheticTestData!==true)return res.status(400).json({error:'stripe_test_fixture_consent_required'});
    await provisionTestOwner(this.firebase,this.stripeSvc.stripe,ownerId,req.body?.replaceExisting===true);
    return this.status(req,res);
  };
  status = async (req: Request,res: Response) => {
    const ownerId=String(req.params.ownerId); await requireOwner(req,this.firebase,ownerId); const owner=(await this.firebase.db.ref(`owners/${ownerId}`).once('value')).val();
    if(!owner) return res.status(404).json({error:'owner_not_found'});
    const sandbox=ownerStripeTestMode(); const accountId=ownerStripeAccountId(owner); if(!accountId) return res.json({connected:false,mode:sandbox?'test':undefined,testProvisioningEnabled:testProvisioningEnabled(),perOwnerTestAccount:sandbox});
    const a=await this.stripeSvc.stripe.accounts.retrieve(accountId);
    if(sandbox)assertOwnerTestAccount(a,ownerId);
    return res.json({connected:true,accountId,mode:sandbox?'test':(String(process.env.STRIPE_SECRET_KEY||'').startsWith('sk_test_')?'test':'live'),testProvisioningEnabled:testProvisioningEnabled(),perOwnerTestAccount:sandbox,chargesEnabled:!!a.charges_enabled,payoutsEnabled:!!a.payouts_enabled,detailsSubmitted:!!a.details_submitted,requirementsCurrentlyDue:a.requirements?.currently_due||[],requirementsPastDue:a.requirements?.past_due||[],requirementsPendingVerification:a.requirements?.pending_verification||[],disabledReason:a.requirements?.disabled_reason||null,onboardingComplete:!!(a.charges_enabled&&a.payouts_enabled)});
  };
}
