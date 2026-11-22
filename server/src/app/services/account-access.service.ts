import {queueNotification,queueBookingChange,emitNotification} from './email-notifications.js';
import {documentSummary,assetDocumentStatus} from './asset-documents.js';
import {LegalAcceptanceService} from './legal-acceptance.service.js';
import {delegatedAssets,activeDelegation,hasAssetPermission} from './asset-delegation.js';
import {feedbackRows,publicFeedback} from './workspace-feedback.js';
import {moderationView,listingRevision} from './listing-moderation.js';
import {randomUUID} from 'node:crypto';
import {ASSET_TYPES} from './asset-paths.service.js';
import {paidEntitlement,ANNUAL_PRICES} from './listing-billing.service.js';
import {listingImpact} from './listing-impact.js';
import {Request,Response} from 'express';
import {z} from 'zod';
import {FirebaseService} from './firebase.service.js';
import {isAssetType,assetPath} from './asset-paths.service.js';

export type AccountRole='customer'|'assetOwner'|'serviceProvider'|'concierge'|'admin';
export function accountRole(value:unknown):AccountRole {
  const role=String(value||'').trim().toLowerCase();
  if(['owner','boatowner','assetowner','asset_owner'].includes(role))return 'assetOwner';
  if(['concierge','propertymanager'].includes(role))return 'concierge';
  if(['admin','superadmin'].includes(role))return 'admin';
  if(['serviceprovider','provider'].includes(role))return 'serviceProvider';
  return 'customer';
}
export function platformAdministrator(user:any,profile:any):boolean{return user?.admin===true||user?.role==='admin'||accountRole(profile?.role)==='admin'||profile?.isAdmin===true||profile?.roles?.admin===true;}
const fail=(status:number,message:string)=>Object.assign(new Error(message),{status});
const profileSchema=z.object({
  firstname:z.string().trim().max(120).optional(),lastname:z.string().trim().max(120).optional(),
  displayName:z.string().trim().max(240).optional(),country:z.string().max(120).optional(),
  phone:z.string().max(80).optional(),address:z.string().max(1000).optional(),role:z.string().optional(),
  photos:z.array(z.string().max(2000)).max(20).optional(),photoURL:z.string().max(2000).optional(),
  socialnetwork:z.array(z.object({label:z.string().max(120),url:z.string().max(2000)})).max(20).optional(),
});
export class AccountAccessService {
  constructor(public readonly store:FirebaseService){}
  private async identity(req:Request){
    const token=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];
    if(!token)throw fail(401,'authentication_required');
    try{return await this.store.auth.verifyIdToken(token);}catch{throw fail(401,'invalid_authentication');}
  }
  context=async(req:Request,res:Response)=>{
    const user=await this.identity(req);
    const profile=(await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val()||{};
    const role=accountRole(profile.role);
    const platformAdmin=platformAdministrator(user,profile);
    const type=String(req.query.type||''),id=String(req.query.id||'');let ownsAsset=false;
    if(isAssetType(type)&&/^[a-zA-Z0-9_-]+$/.test(id)){
      const asset=(await this.store.db.ref(assetPath(type,id)).once('value')).val();
      ownsAsset=asset?.ownerId===user.uid;
    }
    const assets=(await this.store.db.ref('assets').once('value')).val()||{},grants=(await this.store.db.ref('assetDelegations').once('value')).val()||{};const delegated=delegatedAssets({assets,assetDelegations:grants},user.uid);const grant=activeDelegation({assets,assetDelegations:grants},user.uid,type,id);const managementPermissions=Object.fromEntries(['content','bookings','customers','payments'].map(p=>[p,(platformAdmin&&p==='content')||ownsAsset||grant?.permissions?.[p]===true]));
    res.setHeader('Cache-Control','no-store');return res.json({conciergePermissions:Object.fromEntries(['content','bookings','customers','payments'].map(p=>[p,delegated.some(a=>a.permissions?.[p]===true)])),isConcierge:delegated.length>0,delegatedAssetCount:delegated.length,managementPermissions,uid:user.uid,displayName:String(profile.displayName||[profile.firstname||profile.firstName,profile.lastname||profile.lastName].filter(Boolean).join(' ')||profile.name||profile.username||user.name||user.email||''),role,platformAdmin,ownsAsset,isAssetOwner:role==='assetOwner'||profile.roles?.assetOwner===true||ownsAsset||ASSET_TYPES.some(t=>Object.values<any>(assets[t]||{}).some(a=>a?.ownerId===user.uid)),scope:type&&id?`${type}/${id}`:''});
  };
  platformOverview=async(req:Request,res:Response)=>{
    const user=await this.identity(req);const profile=(await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val()||{};
    if(!platformAdministrator(user,profile))throw fail(403,'platform_admin_required');
    const paths=['assets','backendusers','owners','listingBilling','bookings','bnBookings','listingModeration','publicContent/documentRequirements','assetDocuments'];
    const snaps=await Promise.all(paths.map(p=>this.store.db.ref(p).once('value')));
    const [assets,profiles,owners,billing,bookings,legacy,moderations,documentCatalog,documentRecords]=snaps.map(s=>s.val()||{});
    const ownerIds=new Set<string>(Object.keys(owners));
    for(const [uid,p]of Object.entries<any>(profiles))if(accountRole(p?.role)==='assetOwner'||p?.roles?.assetOwner===true)ownerIds.add(uid);
    const assetRows:any[]=[],subscriptions:any[]=[];
    for(const type of ASSET_TYPES){
      for(const [id,a]of Object.entries<any>(assets[type]||{})){
        if(!a||typeof a!=='object')continue;const ownerId=String(a.ownerId||'');if(ownerId)ownerIds.add(ownerId);
        const b=billing[type]?.[id],impact=listingImpact(a,bookings[type]?.[id],legacy,b,type,id);
        const moderation=moderationView(a,moderations[type]?.[id]);assetRows.push({createdAt:a.createdAt||null,documents:documentSummary(documentCatalog,type,ownerId,documentRecords[type]?.[id]),moderation,headline:String(a.headline||''),description:String(a.description||''),location:{city:a.location?.city||'',area:a.location?.area||'',country:a.location?.country||''},pricing:a.pricing||{},properties:a.properties||{},media:a.media||{},id,assetType:type,name:String(a.name||id),ownerId,archived:!!a.deletedAt,public:!a.deletedAt&&a.enabled!==false&&a.published===true&&a.status==='active'&&moderation.status==='approved'&&b?.ownerId===ownerId&&paidEntitlement(b)&&documentSummary(documentCatalog,type,ownerId,documentRecords[type]?.[id]).approved,pending:impact.pending,confirmed:impact.confirmed,subscriptionStatus:b?.status||'required',paidUntil:Number(b?.paidUntil||0),cancelAtPeriodEnd:!!b?.cancelAtPeriodEnd});
      }
      for(const [id,b]of Object.entries<any>(billing[type]||{})){
        if(!b||typeof b!=='object')continue;const ownerId=String(b.ownerId||'');if(ownerId)ownerIds.add(ownerId);
        subscriptions.push({assetId:id,assetType:type,assetName:String(assets[type]?.[id]?.name||id),ownerId,status:String(b.status||'unknown'),mode:String(b.mode||'unknown'),entitled:paidEntitlement(b),paidUntil:Number(b.paidUntil||0),cancelAtPeriodEnd:!!b.cancelAtPeriodEnd,renewalState:!b.subscriptionId||['canceled','incomplete_expired'].includes(b.status)?'none':b.cancelAtPeriodEnd?'stopped':'automatic',annualPrice:ANNUAL_PRICES[type],missingAsset:!assets[type]?.[id],archived:!!assets[type]?.[id]?.deletedAt});
      }
    }
    const ownerRows=[...ownerIds].filter(uid=>{const o=owners[uid]||{},p=profiles[uid]||{};return !/^owner_demo(?:_|$)/i.test(uid)&&o.isDemo!==true&&o.demo!==true&&p.isDemo!==true&&p.demo!==true&&String(o.status||'').toLowerCase()!=='migrated'&&assetRows.some(a=>a.ownerId===uid&&!a.archived);}).sort().map(uid=>{const p=profiles[uid]||{},o=owners[uid]||{},owned=assetRows.filter(a=>a.ownerId===uid);return{uid,name:String(p.displayName||[p.firstname,p.lastname].filter(Boolean).join(' ')||p.email||uid),email:String(p.email||o.email||''),status:String(o.status||'unknown'),assetCount:owned.filter(a=>!a.archived).length,archivedAssetCount:owned.filter(a=>a.archived).length,online:owned.filter(a=>a.public).length,pending:owned.reduce((n,a)=>n+a.pending,0),subscriptions:subscriptions.filter(b=>b.ownerId===uid&&b.entitled).length};});
    res.setHeader('Cache-Control','no-store');return res.json({generatedAt:new Date().toISOString(),owners:ownerRows,assets:assetRows,subscriptions});
  };
  platformAsset=async(req:Request,res:Response)=>{
    const user=await this.identity(req),profile=(await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val()||{};
    if(!platformAdministrator(user,profile))throw fail(403,'platform_admin_required');
    const type=String(req.params.type),id=String(req.params.id);if(!isAssetType(type)||!/^[a-zA-Z0-9_-]+$/.test(id))throw fail(400,'invalid_asset_scope');
    const asset=(await this.store.db.ref(assetPath(type,id)).once('value')).val();if(!asset)throw fail(404,'asset_not_found');
    const [owner,ownerAccount,billing,moderation]=await Promise.all([`backendusers/${asset.ownerId}`,`owners/${asset.ownerId}`,`listingBilling/${type}/${id}`,`listingModeration/${type}/${id}`].map(path=>this.store.db.ref(path).once('value')));const p=owner.val()||{},o=ownerAccount.val()||{},b=billing.val()||{};
    res.setHeader('Cache-Control','no-store');return res.json({documents:await assetDocumentStatus(this.store,type,id,asset.ownerId),asset:{id,assetType:type,ownerId:String(asset.ownerId||''),name:String(asset.name||id),prefix:String(asset.prefix||id),headline:String(asset.headline||''),description:String(asset.description||''),archived:!!asset.deletedAt,status:String(asset.status||''),location:asset.location||{},pricing:asset.pricing||{},properties:asset.properties||{},media:asset.media||{},published:asset.published===true,enabled:asset.enabled!==false},owner:{uid:String(asset.ownerId||''),name:String(p.displayName||[p.firstname||p.firstName,p.lastname||p.lastName].filter(Boolean).join(' ')||p.name||p.email||asset.ownerId||''),email:String(p.email||o.email||'')},moderation:moderationView(asset,moderation.val()),subscription:{status:String(b.status||'required'),paidUntil:Number(b.paidUntil||0),entitled:b.ownerId===asset.ownerId&&paidEntitlement(b)},permissions:{content:!asset.deletedAt,bookings:false,delegations:false,financial:false}});
  };
  moderateListing=async(req:Request,res:Response)=>{
    const user=await this.identity(req);const profile=(await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val()||{};if(!platformAdministrator(user,profile))throw fail(403,'platform_admin_required');
    const type=String(req.params.type),id=String(req.params.id);if(!isAssetType(type)||!/^[a-zA-Z0-9_-]+$/.test(id))throw fail(400,'invalid_asset_scope');
    const body=z.object({decision:z.enum(['approved','rejected']),revision:z.string().regex(/^[a-f0-9]{64}$/),reason:z.string().trim().max(2000).default(''),reviewDraft:z.boolean().optional(),publish:z.boolean().optional()}).parse(req.body);if(body.decision==='rejected'&&!body.reason)throw fail(400,'rejection_reason_required');
    const now=new Date().toISOString(),audit=randomUUID();let error='listing_changed_reload_required';
    await this.store.db.ref().once('value');
    const result=await this.store.db.ref().transaction((root:any)=>{if(root===null)return null;if(!platformAdministrator(user,root.backendusers?.[user.uid]||{})){error='platform_admin_required';return;}const a=root.assets?.[type]?.[id];if(!a||a.deletedAt){error='listing_unavailable';return;}if(listingRevision(a)!==body.revision)return;
      const current=root.listingModeration?.[type]?.[id];if(moderationView(a,current).status!=='pending'&&body.reviewDraft!==true){error='moderation_not_pending';return;}
      if(body.publish===true){const billing=root.listingBilling?.[type]?.[id];if(body.decision!=='approved'||billing?.ownerId!==a.ownerId||!paidEntitlement(billing)||!documentSummary(root.publicContent?.documentRequirements,type,a.ownerId,root.assetDocuments?.[type]?.[id]).approved){error='publication_requirements_not_met';return;}a.published=true;a.enabled=true;a.status='active';a.updatedAt=now;}
      const record={status:body.decision,revision:body.revision,reason:body.reason,publish:body.publish===true,reviewedAt:now,reviewedBy:user.uid,requestedAt:current?.requestedAt||a.createdAt||null,requestedBy:current?.requestedBy||a.ownerId||null};
      root.listingModeration??={};root.listingModeration[type]??={};root.listingModeration[type][id]=record;root.listingModerationHistory??={};root.listingModerationHistory[type]??={};root.listingModerationHistory[type][id]??={};root.listingModerationHistory[type][id][audit]=record;queueNotification(root,{key:body.revision+'|'+body.decision,kind:'listing.'+body.decision,type,assetId:id,ownerId:a.ownerId,reason:body.reason});return root;
    },undefined,false);
    if(!result.committed||!result.snapshot.val()?.listingModeration?.[type]?.[id])throw fail(409,error);
    res.setHeader('Cache-Control','no-store');return res.json({ok:true});
  };
  accountRoles=async(req:Request,res:Response)=>{
    const user=await this.identity(req),profile=(await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val()||{};
    const [assetsSnap,grantsSnap]=await Promise.all([this.store.db.ref('assets').once('value'),this.store.db.ref('assetDelegations').once('value')]);
    const assets=assetsSnap.val()||{},delegated=delegatedAssets({assets,assetDelegations:grantsSnap.val()||{}},user.uid);
    const admin=platformAdministrator(user,profile),owner=accountRole(profile.role)==='assetOwner'||profile.roles?.assetOwner===true||ASSET_TYPES.some(type=>Object.values<any>(assets[type]||{}).some(a=>a?.ownerId===user.uid));
    const roles=[...(admin?['admin']:[]),...(delegated.length?['concierge']:[]),...(owner?['assetOwner']:[]),'customer'];
    res.setHeader('Cache-Control','no-store');return res.json({uid:user.uid,primaryRole:roles[0],roles,delegatedAssetCount:delegated.length});
  };
  getProfile=async(req:Request,res:Response)=>{const u=await this.identity(req),p=(await this.store.db.ref(`backendusers/${u.uid}`).once('value')).val()||{};return res.json({firstname:String(p.firstname||p.firstName||''),lastname:String(p.lastname||p.lastName||''),phone:String(p.phone||''),address:String(p.address||''),email:String(u.email||p.email||'')});};
  private async feedbackData(){return feedbackRows((await this.store.db.ref('backendfeedbacks').once('value')).val());}
  myFeedbacks=async(req:Request,res:Response)=>{const u=await this.identity(req);return res.json((await this.feedbackData()).filter(r=>[r.userId,r.guestId,r.customerId].some(id=>id===u.uid)).map(publicFeedback));};
  assetFeedbacks=async(req:Request,res:Response)=>{const u=await this.identity(req),type=String(req.params.type||''),id=String(req.params.id||'');if(!isAssetType(type)||!/^[a-z0-9][a-z0-9_-]*$/.test(id))throw fail(400,'invalid_asset_scope');const a=(await this.store.db.ref(assetPath(type,id)).once('value')).val();const p=(await this.store.db.ref(`backendusers/${u.uid}`).once('value')).val()||{};if(!a||(a.ownerId!==u.uid&&!await hasAssetPermission(this.store,u.uid,type,id,'bookings')))throw fail(403,'owner_required');return res.json((await this.feedbackData()).filter(r=>r.assetType===type&&r.assetId===id).map(publicFeedback));};
  saveProfile=async(req:Request,res:Response)=>{
    const user=await this.identity(req),input=profileSchema.parse(req.body);
    const ref=this.store.db.ref(`backendusers/${user.uid}`);
    const existing=(await ref.once('value')).val();
    const requested=accountRole(input.role??existing?.role);
    if(requested==='admin'&&accountRole(existing?.role)!=='admin')throw fail(403,'platform_role_cannot_be_self_assigned');
    const allowed=(await this.store.db.ref(`platformConfig/roles/${requested}/selfRegistration`).once('value')).val();
    if(accountRole(existing?.role)!=='admin'&&(!existing||accountRole(existing.role)!==requested)&&allowed!==true)throw fail(403,'role_not_available');
    await new LegalAcceptanceService(this.store).require(user.uid,requested);
    const now=Date.now();
    const result=await ref.transaction((old:any)=>{
      // Re-evaluate the stored role on every retry; profile editing must not revoke an administrator.
      const role=accountRole(old?.role)==='admin'?'admin':requested==='admin'?accountRole(old?.role):requested;
      return {...(old||{}),...input,role,userId:user.uid,email:user.email||old?.email||'',
        emailverified:user.email_verified===true,provider:old?.provider||user.firebase?.sign_in_provider||'firebase',
        state:old?.state||'active',createdTS:old?.createdTS||now,modifiedTS:now};
    });
    if(!result.committed)throw fail(409,'profile_changed_reload_required');
    const profile=result.snapshot.val();
    if(accountRole(profile.role)==='assetOwner'){
      await this.store.db.ref(`owners/${user.uid}`).update({uid:user.uid,status:'active'});
      await ref.child('roles/assetOwner').set(true);
      profile.roles={...(profile.roles||{}),assetOwner:true};
    }
    return res.json(profile);
  };
  registrationRoles=async(_req:Request,res:Response)=>{
    const catalog=(await this.store.db.ref('platformConfig/roles').once('value')).val()||{};
    return res.json(['customer','assetOwner','serviceProvider','concierge'].filter(id=>catalog[id]?.selfRegistration===true).map(id=>({id,labelKey:`roles.${id}`})));
  };
  uiContent=async(_req:Request,res:Response)=>{
    res.setHeader('Cache-Control','no-store');
    const [uiSnapshot,labelSnapshot]=await Promise.all([this.store.db.ref('uiTranslations').once('value'),this.store.db.ref('publicContent/labels').once('value')]);
    const ui=uiSnapshot.val()||{},labels=labelSnapshot.val()||{};const documentLabels=(await this.store.db.ref('publicContent/documentRequirements/labels').once('value')).val()||{};for(const [lang,copy]of Object.entries<any>(documentLabels)){ui[lang]??={};ui[lang].ui??={};ui[lang].ui.documents=copy;}for(const [lang,copy] of Object.entries<any>(labels)){ui[lang]??={};ui[lang].ui??={};ui[lang].ui.legal={conditions:copy.conditions,faq:copy.faq,contact:copy.contact};}const adminLabels=(await this.store.db.ref('publicContent/legalAdminLabels').once('value')).val()||{};for(const [lang,copy]of Object.entries<any>(adminLabels)){ui[lang]??={};ui[lang].ui??={};ui[lang].ui.legal??={};ui[lang].ui.legal.manage=copy.title;}return res.json(ui);
  };
}
