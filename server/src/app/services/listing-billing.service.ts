import {checkoutSessionMatches,expiredCheckoutUpdate} from './listing-checkout-state.js';
import {queueListingUpdate} from './listing-update-notification.js';
import {queueNotification,queueBookingChange,emitNotification} from './email-notifications.js';
import {documentsPermitPublication,assetDocumentStatus} from './asset-documents.js';
import {platformManagement,hasAssetPermission} from './asset-delegation.js';
import {validPrefix,normalizePrefix,prefixTaken,prefixSuggestions,applyPrefixChange,applyCreation,ownerSitePrefix} from './asset-prefix.js';
import {applyListingPhotos} from './listing-photos.js';
import {ownerStripeTestMode} from './owner-stripe-mode.js';
import {subscriptionView,unstartedSubscription} from './listing-subscription-view.js';
import {moderationView,listingRevision} from './listing-moderation.js';
import {listingImpact} from './listing-impact.js';
import {updateExisting} from './existing-transaction.js';
import {randomUUID} from 'node:crypto';
import Stripe from 'stripe';
import {Request,Response} from 'express';
import {z} from 'zod';
import {FirebaseService} from './firebase.service.js';
import {ASSET_TYPES,assetPath,isAssetType} from './asset-paths.service.js';
const LEGACY_PRICES:Record<string,number>={parking:5900,pool:11900,car:17900,property:23900,boat:29900};
const LEGACY_PLAN='r227-annual-eur-v1';
export const BILLING_VERSION='r227-annual-eur-v2';
export const ANNUAL_PRICES:Record<string,number>=Object.fromEntries(ASSET_TYPES.map(type=>[type,9900]));
function tariff(plan:string,type:string){
 if(!isAssetType(type))return null;
 if(plan===LEGACY_PLAN)return {amount:LEGACY_PRICES[type],tax:'exclusive' as const};
 if(plan===BILLING_VERSION)return {amount:ANNUAL_PRICES[type],tax:'inclusive' as const};
 return null;
}
function listingTariff(b:any,type:string){
 const retain=b?.subscriptionId&&!['canceled','incomplete_expired'].includes(b.status)||b?.status==='checkout_pending'&&b.requestId;
 const p=tariff(retain?b.plan:BILLING_VERSION,type)||tariff(BILLING_VERSION,type)!;
 return {annualPrice:p.amount,annualTaxBehavior:p.tax};
}
export const listingSchema=z.object({assetType:z.enum(ASSET_TYPES),prefix:z.string().optional(),name:z.string().trim().min(1).max(120),description:z.string().max(10000).default(''),headline:z.string().max(240).default(''),location:z.object({city:z.string().trim().max(120).default(''),area:z.string().trim().max(160).default(''),country:z.string().trim().max(120).default('France')}).default({}),pricing:z.object({basePrice:z.number().positive().max(1000000),currency:z.literal('EUR').default('EUR'),pricingUnit:z.enum(['hour','day','night']).default('day')}),properties:z.record(z.union([z.string().max(1000),z.number().nonnegative(),z.boolean()])).default({}),depositType:z.enum(['percentage','fixed']).default('percentage'),depositPercent:z.number().min(0).max(1000000).default(10),securityDeposit:z.number().min(0).max(1000000).default(0),photos:z.array(z.string().trim().min(1).max(2048)).max(50).optional()}).superRefine((value,ctx)=>{if(value.assetType==='car'){const {carCategory,carService}=value.properties;if(carCategory!==undefined&&carCategory!=='standard'&&carCategory!=='prestige')ctx.addIssue({code:z.ZodIssueCode.custom,path:['properties','carCategory'],message:'Catégorie de voiture invalide.'});if(carService!==undefined&&carService!=='selfDrive'&&carService!=='chauffeured')ctx.addIssue({code:z.ZodIssueCode.custom,path:['properties','carService'],message:'Service de chauffeur invalide.'});}if(value.depositType==='percentage'&&value.depositPercent>100)ctx.addIssue({code:z.ZodIssueCode.custom,path:['depositPercent'],message:'Maximum 100%'});if(['parking','pool','property'].includes(value.assetType)){for(const key of ['city','country'] as const)if(!value.location[key])ctx.addIssue({code:z.ZodIssueCode.custom,path:['location',key],message:'Localisation requise pour ce type de bien.'});}});
const objId=(v:any)=>typeof v==='string'?v:v?.id;
const fail=(s:number,m:string)=>Object.assign(new Error(m),{status:s});
export function paidEntitlement(e:any,now=Date.now()):boolean{return !!e&&!!tariff(e.plan,'boat')&&e.mode===billingMode()&&e.status==='active'&&e.paid===true&&Number(e.paidUntil)*1000>now;}
export function billingMode():string{return String(process.env.STRIPE_BILLING_SECRET_KEY||process.env.STRIPE_SECRET_KEY||'').startsWith('sk_live_')?'live':'test';}
export async function listingPublicationIssue(store:FirebaseService,type:string,id:string,a:any):Promise<string>{
 if(!a||a.deletedAt)return 'listing_unavailable';
 const e=(await store.db.ref(`listingBilling/${type}/${id}`).once('value')).val();
 if(e?.ownerId!==a.ownerId||!paidEntitlement(e))return 'listing_subscription_required';
 if(!await documentsPermitPublication(store,type,id,a.ownerId))return 'listing_documents_required';
 const m=(await store.db.ref(`listingModeration/${type}/${id}`).once('value')).val();
 if(moderationView(a,m).status!=='approved')return 'listing_moderation_required';
 if(a.enabled===false||a.published!==true||a.status!=='active')return 'listing_not_published';
 return '';
}
export async function listingPublic(store:FirebaseService,type:string,id:string,a:any):Promise<boolean>{return !await listingPublicationIssue(store,type,id,a);}
export class ListingBillingService{
 readonly stripe:Stripe;
 constructor(private store:FirebaseService,sdk?:Stripe){this.stripe=sdk||new Stripe(process.env.STRIPE_BILLING_SECRET_KEY||process.env.STRIPE_SECRET_KEY||'sk_test_missing');}
 async init():Promise<void>{await this.store.db.ref('listingBillingConfig').update({mode:billingMode(),updatedAt:new Date().toISOString()});}
 private async user(req:Request){const token=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];if(!token)throw fail(401,'authentication_required');try{return await this.store.auth.verifyIdToken(token);}catch{throw fail(401,'authentication_required');}}
 private scope(req:Request){const t=String(req.params.type),id=String(req.params.id);assetPath(t,id);return{t,id};}
 private async owned(req:Request,scope?:{t:string;id:string}){const u=await this.user(req);const {t,id}=scope||this.scope(req);assetPath(t,id);const a=(await this.store.db.ref(assetPath(t,id)).once('value')).val();if(!a||a.ownerId!==u.uid)throw fail(403,'owner_required');return{u,t,id,a};}
 private async editable(req:Request,administration=false){if(!administration)return this.owned(req);const u=await this.user(req),{t,id}=this.scope(req);const profile=(await this.store.db.ref('backendusers/'+u.uid).once('value')).val();if(!platformManagement({backendusers:{[u.uid]:profile}},u.uid,u))throw fail(403,'platform_admin_required');const a=(await this.store.db.ref(assetPath(t,id)).once('value')).val();if(!a)throw fail(404,'asset_not_found');return {u,t,id,a};}
 adminImpact=async(req:Request,res:Response)=>this.listingEditImpact(req,res,true);
 adminEdit=async(req:Request,res:Response)=>this.mutateListing(req,res,false,true);
 adminPrefixes=async(req:Request,res:Response)=>this.prefixOptions(req,res,true);
 private origin(){const raw=process.env.BILLING_RETURN_URL||process.env.FRONTEND_URL;if(!raw)throw fail(503,'billing_return_url_required');const url=new URL(raw);if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw fail(503,'invalid_billing_return_url');return url.origin;}
 assignPrefix=async(req:Request,res:Response)=>{
  const {u,t,id}=await this.owned(req);const prefix=String(req.body?.prefix||'');if(!validPrefix(prefix))throw fail(400,'invalid_asset_prefix');let reason='asset_prefix_unavailable';
  const result=await this.store.db.ref().transaction((root:any)=>{if(root===null)return null;const asset=root.assets?.[t]?.[id];if(!asset||asset.ownerId!==u.uid){reason='owner_required';return;}if(asset.deletedAt){reason='listing_archived';return;}if(!applyPrefixChange(root,prefix,t,id,u.uid))return;return root;},undefined,false);
  if(!result.committed||result.snapshot.val()?.assetPrefixes?.[prefix]?.assetId!==id)throw fail(reason==='owner_required'?403:409,reason);return res.json({prefix});
 };
 prefixes=async(req:Request,res:Response)=>this.prefixOptions(req,res);
 private async prefixOptions(req:Request,res:Response,administration=false){await this.user(req);const q=String(req.query.q||'');if(q.length>120)throw fail(400,'invalid_asset_prefix');let scope: {assetType:string;assetId:string}|undefined;if(administration){const {t,id}=await this.editable(req,true);scope={assetType:t,assetId:id};}else if(req.query.type||req.query.id){const {t,id}=await this.owned(req,{t:String(req.query.type||''),id:String(req.query.id||'')});scope={assetType:t,assetId:id};}const root=(await this.store.db.ref().once('value')).val();res.setHeader('Cache-Control','no-store');const query=normalizePrefix(q);const valid=validPrefix(query);const taken=prefixTaken(root,query,scope);return res.json({query,available:valid&&!taken,reason:!valid?'invalid':taken?'taken':null,suggestions:prefixSuggestions(root,q,scope)});};
 siteSettings=async(req:Request,res:Response)=>{const u=await this.user(req);res.setHeader('Cache-Control','no-store');
 if(req.method==='PUT'&&req.body?.home){const home=z.object({title:z.string().trim().max(100),intro:z.string().trim().max(2500)}).parse(req.body.home);await this.store.db.ref('owners/'+u.uid+'/siteHome').set(home);return res.json({ok:true});}
 if(req.method==='PUT'){const contact=z.object({email:z.union([z.literal(''),z.string().email().max(254)]),phone:z.string().max(40).regex(/^[+0-9 ().-]*$/),address:z.string().max(300)}).parse(req.body);await this.store.db.ref('owners/'+u.uid+'/publicContact').set(contact);return res.json({ok:true});}
 const root=(await this.store.db.ref().once('value')).val();return res.json({prefix:ownerSitePrefix(root,u.uid),home:root?.owners?.[u.uid]?.siteHome||{},contact:root?.owners?.[u.uid]?.publicContact||{}});};
 plans=async(_req:Request,res:Response)=>res.json({mode:billingMode(),ownerMode:ownerStripeTestMode()?'test':'live',currency:'EUR',interval:'year',taxBehavior:'inclusive',prices:ANNUAL_PRICES});
 list=async(req:Request,res:Response)=>{const u=await this.user(req);const all=(await this.store.db.ref('assets').once('value')).val()||{};const [bookingsSnap,legacySnap]=await Promise.all([this.store.db.ref('bookings').once('value'),this.store.db.ref('bnBookings').once('value')]);const bookings=bookingsSnap.val()||{},legacy=legacySnap.val()||{};const out=[];for(const t of ASSET_TYPES)for(const [id,a]of Object.entries<any>(all[t]||{})){if(a.ownerId!==u.uid)continue;const b=(await this.store.db.ref(`listingBilling/${t}/${id}`).once('value')).val();const impact=listingImpact(a,bookings[t]?.[id],legacy,b,t,id);const moderation=moderationView(a,(await this.store.db.ref(`listingModeration/${t}/${id}`).once('value')).val());out.push({...a,documents:await assetDocumentStatus(this.store,t,id,a.ownerId),moderation,id,assetType:t,reservationSummary:{pending:impact.pending,confirmed:impact.confirmed,active:impact.active,total:impact.total},...listingTariff(b,t),public:await listingPublic(this.store,t,id,a),billing:subscriptionView(b,paidEntitlement(b))});}return res.json(out);};
 private async refreshCheckout(t:string,id:string,ownerId:string,b:any):Promise<any>{
  if(!b?.sessionId||b.subscriptionId||!['checkout_pending','checkout_expired'].includes(b.status))return b;
  if(b.ownerId!==ownerId||b.mode!==billingMode())throw fail(409,'billing_mode_mismatch');
  const session=await this.stripe.checkout.sessions.retrieve(b.sessionId);
  const scope={type:t,id,ownerId,mode:billingMode()};
  if(!checkoutSessionMatches(session,scope))throw fail(409,'subscription_scope_mismatch');
  const ref=this.store.db.ref(`listingBilling/${t}/${id}`);
  if(session.status==='expired')await updateExisting(ref,current=>expiredCheckoutUpdate(current,session,scope,Date.now()));
  else if(session.status==='complete'&&objId(session.subscription))await this.sync(objId(session.subscription));
  return (await ref.once('value')).val();
 }
 subscription=async(req:Request,res:Response)=>{
  const {t,id,a,u}=await this.owned(req);const ref=this.store.db.ref(`listingBilling/${t}/${id}`);let b=(await ref.once('value')).val();
  if(b?.ownerId&&b.ownerId!==u.uid)throw fail(403,'owner_required');
  b=await this.refreshCheckout(t,id,u.uid,b);
  // Older subscriptions did not retain Stripe's start and period dates.
  if(b?.subscriptionId&&(!b.startedAt||!b.currentPeriodEnd)){await this.sync(b.subscriptionId);b=(await ref.once('value')).val();}
  res.setHeader('Cache-Control','no-store');return res.json({id,assetType:t,name:a.name,deletedAt:a.deletedAt||null,...listingTariff(b,t),billing:subscriptionView(b,paidEntitlement(b))});
 };
 create=async(req:Request,res:Response)=>{const u=await this.user(req);const p=listingSchema.parse(req.body);if(p.photos?.length)throw fail(400,'photo_upload_requires_asset');const prefix=p.prefix||'';const id=`${p.assetType}-${randomUUID()}`;const a={prefix,id,ownerId:u.uid,assetType:p.assetType,name:p.name,headline:p.headline,description:p.description,location:p.location,pricing:p.pricing,properties:p.properties,media:{gallery:[]},paymentPolicy:{bookingDeposit:{type:p.depositType,value:p.depositPercent},securityDeposit:{type:'fixed',value:p.securityDeposit}},enabled:true,published:true,status:'active',createdAt:new Date().toISOString()};const updates:any={[assetPath(p.assetType,id)]:a,[`listingModeration/${p.assetType}/${id}`]:{status:'pending',revision:listingRevision(a),requestedAt:a.createdAt,requestedBy:u.uid},[`owners/${u.uid}/uid`]:u.uid,[`owners/${u.uid}/status`]:'active',[`owners/${u.uid}/assetIds/${id}`]:true,[`backendusers/${u.uid}/roles/assetOwner`]:true};if(p.assetType==='boat'){updates[`bnFleet/boat/${id}`]={boatId:id,assetId:id,assetType:'boat',ownerId:u.uid,boatName:p.name,boatType:p.properties.boatType||'Bateau',active:true,shortDescription:p.description,maxGuests:p.properties.capacity||1};updates[`siteContent/boat/${id}/fr`]={brand:{name:p.name},boatPage:{title:p.name,description:p.description},homePage:{hero:{title:p.name,description:p.description}}};}const result=await this.store.db.ref().transaction((root:any)=>root===null?null:(()=>{const next=applyCreation(root,updates,prefix,p.assetType,id,u.uid);if(next){queueNotification(next,{key:id,kind:'asset.created',type:p.assetType,assetId:id,ownerId:u.uid});queueNotification(next,{key:listingRevision(a),kind:'listing.pending',type:p.assetType,assetId:id,ownerId:u.uid});}return next;})(),undefined,false);const saved=result.snapshot.val()?.assets?.[p.assetType]?.[id];if(!result.committed||saved?.ownerId!==u.uid)throw fail(409,'asset_prefix_unavailable');return res.status(201).json({...saved,moderation:{status:'pending',reason:''},public:false});};
 impact=async(req:Request,res:Response)=>this.listingEditImpact(req,res);
 private async listingEditImpact(req:Request,res:Response,administration=false){const {t,id,a}=await this.editable(req,administration);const [b,old,billing]=await Promise.all([this.store.db.ref(`bookings/${t}/${id}`).once('value'),this.store.db.ref(t==='boat'?'bnBookings':`bookings/${t}/${id}`).once('value'),this.store.db.ref(`listingBilling/${t}/${id}`).once('value')]);return res.json(listingImpact(a,b.val(),t==='boat'?old.val():{},billing.val(),t,id));};
 edit=async(req:Request,res:Response)=>this.mutateListing(req,res,false);
 remove=async(req:Request,res:Response)=>this.mutateListing(req,res,true);
 private async mutateListing(req:Request,res:Response,remove:boolean,administration=false){
  const {u,t,id,a:original}=await this.editable(req,administration);
  const body=z.object({revision:z.string().regex(/^[a-f0-9]{64}$/),acknowledgeReservations:z.boolean(),listing:z.unknown().optional()}).parse(req.body);
  const p=remove?null:listingSchema.parse(body.listing);if(p&&p.assetType!==t)throw fail(400,'asset_type_immutable');
  const now=new Date().toISOString(),saveId=randomUUID();let reason='listing_changed_reload_required';
  // One atomic decision covers asset, both booking stores and billing. Concurrent booking writes retry this transaction.
  await this.store.db.ref().once('value');
  const result=await this.store.db.ref().transaction((root:any)=>{
   if(root===null)return null;
   if(administration&&!platformManagement(root,u.uid,u)){reason='platform_admin_required';return;}
   const a=root.assets?.[t]?.[id];if(!a||a.ownerId!==(administration?original.ownerId:u.uid)){reason='owner_required';return;}
   if(a.deletedAt){reason='listing_archived';return;}
   const before=JSON.parse(JSON.stringify(a));
   const impact=listingImpact(a,root.bookings?.[t]?.[id],root.bnBookings,root.listingBilling?.[t]?.[id],t,id);
   if(impact.revision!==body.revision){reason='listing_changed_reload_required';return;}
   if((impact.active>0||(remove&&impact.subscriptionContinues))&&!body.acknowledgeReservations){reason='reservations_acknowledgement_required';return;}
   if(p?.prefix&&p.prefix!==a.prefix){
    if(!validPrefix(p.prefix)){reason='invalid_asset_prefix';return;}
    if(!applyPrefixChange(root,p.prefix,t,id,a.ownerId)){reason='asset_prefix_unavailable';return;}
   }
   if(remove){root.assets[t][id]={...a,published:false,enabled:false,status:'archived',deletedAt:now,deletedBy:u.uid,updatedAt:now};}
   else if(p){root.assets[t][id]={...a,name:p.name,headline:p.headline,description:p.description,location:{...(a.location||{}),...p.location},pricing:{...(a.pricing||{}),...p.pricing},properties:{...(a.properties||{}),...p.properties},paymentPolicy:{...(a.paymentPolicy||{}),bookingDeposit:{...(a.paymentPolicy?.bookingDeposit||{}),type:p.depositType,value:p.depositPercent},securityDeposit:{...(a.paymentPolicy?.securityDeposit||{}),type:'fixed',value:p.securityDeposit}},updatedAt:now};}
   if(p?.photos)applyListingPhotos(root,t,id,p.photos);
   if(!remove){root.listingModeration??={};root.listingModeration[t]??={};root.listingModeration[t][id]={status:'pending',revision:listingRevision(root.assets[t][id]),requestedAt:now,requestedBy:u.uid};}
   if(t==='boat'&&root.bnFleet?.boat?.[id]){const b=root.bnFleet.boat[id];root.bnFleet.boat[id]=remove?{...b,active:false}:{...b,boatName:p!.name,shortDescription:p!.description,boatType:p!.properties.boatType||b.boatType,maxGuests:p!.properties.capacity??b.maxGuests};}
   if(administration){root.managementAudit??={};root.managementAudit[randomUUID()]={action:'listing.edit',actorId:u.uid,ownerId:a.ownerId,assetType:t,assetId:id,at:now};}
   if(!remove)queueListingUpdate(root,before,root.assets[t][id],t,id,u.uid,saveId);
   return root;
  },undefined,false);
  if(!result.committed||!result.snapshot.val()?.assets?.[t]?.[id])throw fail(reason==='owner_required'?403:409,reason);
  return res.json({ok:true,archived:remove,prefix:result.snapshot.val()?.assets?.[t]?.[id]?.prefix||null});
 }
 publication=async(req:Request,res:Response)=>{const {u,t,id,a}=await this.owned(req);if(a.deletedAt)throw fail(409,'listing_archived');if(typeof req.body.published!=='boolean')throw fail(400,'invalid_publication');
 const now=new Date().toISOString();const changes:any={[`${assetPath(t,id)}/published`]:req.body.published,[`${assetPath(t,id)}/updatedAt`]:now};
 const current=(await this.store.db.ref(`listingModeration/${t}/${id}`).once('value')).val();
 if(req.body.published&&moderationView(a,current).status!=='approved')changes[`listingModeration/${t}/${id}`]={status:'pending',revision:listingRevision(a),requestedAt:now,requestedBy:u.uid};
 if(changes[`listingModeration/${t}/${id}`]){const event={key:listingRevision(a),kind:'listing.pending',type:t,assetId:id,ownerId:u.uid};const holder:any={};queueNotification(holder,event);for(const [k,v]of Object.entries(holder.notificationEvents||{})){changes['notificationEvents/'+k]=v;changes['notificationQueue/'+k]=holder.notificationQueue[k];}}await this.store.db.ref().update(changes);return res.json({ok:true});};
 visibility=async(req:Request,res:Response)=>{const {t,id}=this.scope(req);const a=(await this.store.db.ref(assetPath(t,id)).once('value')).val();const visible=await listingPublic(this.store,t,id,a);let owner=false;if(req.headers.authorization){const u=await this.user(req);owner=u.uid===a?.ownerId;for(const permission of ['content','bookings','customers','payments'] as const)if(!owner)owner=await hasAssetPermission(this.store,u.uid,t,id,permission,u);}return res.json({public:visible,owner});};
 checkout=async(req:Request,res:Response)=>{
  const {u,t,id,a}=await this.owned(req);if(a.deletedAt)throw fail(409,'listing_archived');if(ownerStripeTestMode()&&billingMode()!=='test')throw fail(409,'test_onboarding_requires_test_billing');const origin=this.origin();const ref=this.store.db.ref(`listingBilling/${t}/${id}`);let b=(await ref.once('value')).val();
  if(b&&b.mode!==billingMode()&&!unstartedSubscription(b))throw fail(409,'billing_mode_mismatch');
  if(b?.subscriptionId){await this.sync(b.subscriptionId);b=(await ref.once('value')).val();if(!['canceled','incomplete_expired'].includes(b.status))throw fail(409,'subscription_exists_use_manage');b={...b,sessionId:null};}
  if(b?.sessionId){const session=await this.stripe.checkout.sessions.retrieve(b.sessionId);const scope={type:t,id,ownerId:u.uid,mode:billingMode()};if(!checkoutSessionMatches(session,scope))throw fail(409,'subscription_scope_mismatch');if(session.status==='open'&&session.url)return res.json({url:session.url});if(session.status==='complete'){if(objId(session.subscription))await this.sync(objId(session.subscription));throw fail(409,'subscription_confirmation_pending');}if(session.status!=='expired')throw fail(409,'checkout_requires_reconciliation');await updateExisting(ref,current=>expiredCheckoutUpdate(current,session,scope,Date.now()));b=(await ref.once('value')).val();if(b?.status!=='checkout_expired'||b?.sessionId!==session.id)throw fail(409,'checkout_in_progress');}
  if(b?.status==='checkout_pending'&&!b.sessionId&&b.requestStartedAt&&Date.now()-b.requestStartedAt>23*3600000)throw fail(409,'checkout_requires_reconciliation');
  const requestId=b?.status==='checkout_pending'&&b?.requestId?b.requestId:randomUUID();const plan=b?.status==='checkout_pending'&&b?.requestId===requestId&&tariff(b.plan,t)?b.plan:BILLING_VERSION;const selected=tariff(plan,t)!;const lock=await ref.transaction((old:any)=>{if(old?.busyUntil>Date.now()||old?.syncUntil>Date.now())return;if(old?.subscriptionId&&!['canceled','incomplete_expired'].includes(old.status))return;if(old?.sessionId&&old.sessionId!==b?.sessionId&&!old?.subscriptionId)return;return {...(old||{}),ownerId:u.uid,mode:billingMode(),plan,requestId,requestStartedAt:old?.requestId===requestId?old.requestStartedAt:Date.now(),busyUntil:Date.now()+120000,status:'checkout_pending',paid:false,paidUntil:0,sessionId:null,subscriptionId:null};});if(!lock.committed)throw fail(409,'checkout_in_progress');
  try{
   const metadata={platform:'godirect-listing',ownerId:u.uid,assetType:t,assetId:id,requestId,plan};
   const session=await this.stripe.checkout.sessions.create({mode:'subscription',client_reference_id:`${t}/${id}`,customer_email:u.email,metadata,subscription_data:{metadata},line_items:[{quantity:1,price_data:{currency:'eur',unit_amount:selected.amount,tax_behavior:selected.tax,recurring:{interval:'year'},product_data:{name:`GoDirect — ${a.name}`,tax_code:'txcd_10103000'}}}],automatic_tax:{enabled:true},billing_address_collection:'required',tax_id_collection:{enabled:true},success_url:origin+`/owner/listings?billing=success`,cancel_url:origin+`/owner/listings?billing=cancelled`},{idempotencyKey:`listing-${requestId}`});
   await updateExisting(ref,(old:any)=>old?.requestId===requestId?{...old,sessionId:session.id,busyUntil:0}:undefined);return res.json({url:session.url});
  }catch(e){/* Keep an uncertain checkout locked. Retry after timeout; no automatic charging. */throw e;}
 };
 reconcile=async(req:Request,res:Response)=>{const {t,id,u}=await this.owned(req);const ref=this.store.db.ref(`listingBilling/${t}/${id}`);let b=(await ref.once('value')).val();if(b&&(b.ownerId!==u.uid||b.mode!==billingMode()))throw fail(409,'billing_mode_mismatch');if(b?.subscriptionId)await this.sync(b.subscriptionId);else b=await this.refreshCheckout(t,id,u.uid,b);b=(await ref.once('value')).val();return res.json({ok:true,billing:subscriptionView(b,paidEntitlement(b))});};
 manage=async(req:Request,res:Response)=>{const {t,id,u}=await this.owned(req);const ref=this.store.db.ref(`listingBilling/${t}/${id}`);let b=(await ref.once('value')).val();if(!b?.subscriptionId||b.ownerId!==u.uid||b.mode!==billingMode())throw fail(409,'subscription_missing');const sub=await this.stripe.subscriptions.retrieve(b.subscriptionId);if(sub.metadata.ownerId!==b.ownerId||sub.metadata.assetType!==t||sub.metadata.assetId!==id)throw fail(409,'subscription_scope_mismatch');if(typeof req.body.cancelAtPeriodEnd!=='boolean')throw fail(400,'invalid_cancellation');await this.stripe.subscriptions.update(sub.id,{cancel_at_period_end:req.body.cancelAtPeriodEnd});await this.sync(sub.id);return res.json({ok:true});};
 portal=async(req:Request,res:Response)=>{const {t,id,u}=await this.owned(req);const b=(await this.store.db.ref(`listingBilling/${t}/${id}`).once('value')).val();if(!b?.customerId||b.ownerId!==u.uid||b.mode!==billingMode())throw fail(409,'subscription_missing');const session=await this.stripe.billingPortal.sessions.create({customer:b.customerId,return_url:this.origin()+`/owner/listings/${t}/${id}/subscription`});return res.json({url:session.url});};
 async sync(id:string,notify=false):Promise<void>{
  let sub:any=await this.stripe.subscriptions.retrieve(id,{expand:['latest_invoice']});const m=sub.metadata||{};if(m.platform!=='godirect-listing'||!tariff(m.plan,m.assetType)||!isAssetType(m.assetType)||!/^[a-zA-Z0-9_-]+$/.test(m.assetId||''))return;
  if(sub.livemode!==(billingMode()==='live'))throw fail(400,'billing_mode_mismatch');
  const ref=this.store.db.ref(`listingBilling/${m.assetType}/${m.assetId}`);const lease=randomUUID();
  const lock=await updateExisting(ref,(old:any)=>{if(!old||old.ownerId!==m.ownerId||old.requestId!==m.requestId||old.plan!==m.plan)return;if(old.syncUntil>Date.now())return;return {...old,syncLease:lease,syncUntil:Date.now()+120000};});
  if(!lock.committed){const old=(await ref.once('value')).val();if(old?.requestId===m.requestId)throw fail(503,'billing_sync_busy');return;}
  try { sub=await this.stripe.subscriptions.retrieve(id,{expand:['latest_invoice']});
  if(sub.metadata.plan!==m.plan||sub.metadata.requestId!==m.requestId||sub.metadata.ownerId!==m.ownerId||sub.metadata.assetType!==m.assetType||sub.metadata.assetId!==m.assetId)throw fail(409,'subscription_scope_mismatch');
  const item=sub.items?.data?.[0],price=item?.price;const invoice=sub.latest_invoice;const selected=tariff(m.plan,m.assetType)!;const valid=sub.items?.data?.length===1&&item.quantity===1&&price?.currency==='eur'&&price.unit_amount===selected.amount&&(m.plan===LEGACY_PLAN||price.tax_behavior===selected.tax)&&price.recurring?.interval==='year'&&price.recurring?.interval_count===1;
  const until=Number(sub.current_period_end||item?.current_period_end||0);let paid=valid&&sub.status==='active'&&invoice?.status==='paid'&&Number(invoice.amount_paid)>=selected.amount&&objId(invoice.customer)===objId(sub.customer)&&!sub.pause_collection;
  if(paid&&invoice?.charge){const charge=await this.stripe.charges.retrieve(objId(invoice.charge));if(charge.amount_refunded>0)paid=false;}
  const synced=await updateExisting(ref,(old:any)=>{if(!old||old.syncLease!==lease||old.ownerId!==m.ownerId||old.requestId!==m.requestId||(old.subscriptionId&&old.subscriptionId!==sub.id))return;return {...old,subscriptionId:sub.id,customerId:objId(sub.customer),status:valid?sub.status:'invalid_plan',paid:!!paid,paidUntil:paid?until:0,cancelAtPeriodEnd:!!sub.cancel_at_period_end,startedAt:Number(sub.start_date||sub.created||0)||null,currentPeriodStart:Number(sub.current_period_start||item?.current_period_start||0)||null,currentPeriodEnd:until||null,canceledAt:Number(sub.canceled_at||0)||null,verifiedAt:new Date().toISOString(),busyUntil:0};});
  if(synced.committed&&paid&&(notify||!lock.snapshot.val()?.paid||Number(lock.snapshot.val()?.paidUntil||0)<until))await emitNotification(this.store,{key:String(invoice.id),kind:'subscription.paid',type:m.assetType,assetId:m.assetId,ownerId:m.ownerId,periodStart:Number(sub.current_period_start||item?.current_period_start||0)*1000,periodEnd:until*1000,amount:Number(invoice.amount_paid)/100,currency:String(invoice.currency||'eur').toUpperCase()});
  }finally{await updateExisting(ref,(old:any)=>old?.syncLease===lease?{...old,syncLease:null,syncUntil:0}:undefined);}
 }
 webhook=async(req:Request,res:Response)=>{
  const secret=process.env.STRIPE_BILLING_WEBHOOK_SECRET;const sig=req.header('stripe-signature');if(!secret||!sig)return res.status(400).json({error:'billing_webhook_not_configured'});let e:Stripe.Event;try{e=this.stripe.webhooks.constructEvent(req.body,sig,secret);}catch{return res.status(400).json({error:'invalid_signature'});}
  if(e.account)return res.status(400).json({error:'platform_events_required'});if(e.livemode!==(billingMode()==='live'))return res.status(400).json({error:'billing_mode_mismatch'});
  const o:any=e.data.object;
  if(e.type==='checkout.session.expired'){
   const m=o.metadata||{};
   if(m.platform==='godirect-listing'&&isAssetType(m.assetType)&&/^[a-zA-Z0-9_-]+$/.test(m.assetId||'')&&typeof m.ownerId==='string'){
    const scope={type:m.assetType,id:m.assetId,ownerId:m.ownerId,mode:billingMode()};
    await updateExisting(this.store.db.ref(`listingBilling/${scope.type}/${scope.id}`),current=>expiredCheckoutUpdate(current,o,scope,Date.now()));
   }
  }
  let sub='';if(e.type.startsWith('customer.subscription.'))sub=o.id;else if(e.type.startsWith('checkout.session.'))sub=objId(o.subscription)||'';else if(e.type.startsWith('invoice.'))sub=objId(o.subscription||o.parent?.subscription_details?.subscription)||'';
  if(e.type==='charge.refunded'&&o.invoice){const invoice:any=await this.stripe.invoices.retrieve(objId(o.invoice));sub=objId(invoice.subscription||invoice.parent?.subscription_details?.subscription)||'';}
  if(sub){await this.sync(sub,true);if(e.type==='invoice.payment_failed'){const subscription:any=await this.stripe.subscriptions.retrieve(sub);const m=subscription.metadata||{};if(m.platform==='godirect-listing'&&isAssetType(m.assetType))await emitNotification(this.store,{key:String(o.id)+'|'+String(o.attempt_count||0),kind:'subscription.failed',type:m.assetType,assetId:m.assetId,ownerId:m.ownerId});}}return res.json({received:true});
 };
}
