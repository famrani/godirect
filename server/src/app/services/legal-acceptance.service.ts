import {legalReleasePublished} from './legal-publication.js';
import {platformManagement} from './asset-delegation.js';
import {createHash} from 'node:crypto';
import {Request,Response,NextFunction} from 'express';
import {FirebaseService} from './firebase.service.js';
const fail=(status:number,message:string)=>Object.assign(new Error(message),{status});
const LANGUAGES=['fr','en','es','it','de','nl','ru'];
const sha=(text:string)=>createHash('sha256').update(text).digest('hex');
export function legalRole(value:unknown):string{const s=String(value||'').toLowerCase();return ['assetowner','boatowner','owner','asset_owner'].includes(s)?'assetOwner':['concierge','propertymanager'].includes(s)?'concierge':'customer';}
export function contentLanguage(value:unknown):string{const lang=String(value||'fr').toLowerCase();if(!LANGUAGES.includes(lang))throw fail(400,'unsupported_content_language');return lang;}
export function legalAccepting(published:boolean){return published||(process.env.NODE_ENV!=='production'&&process.env.LEGAL_ALLOW_DRAFT_ACCEPTANCE==='true');}
export class LegalAcceptanceService{
 constructor(private store:FirebaseService){}
 private async identity(req:Request){const t=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];if(!t)throw fail(401,'authentication_required');try{return await this.store.auth.verifyIdToken(t);}catch{throw fail(401,'invalid_authentication');}}
 private async bundle(roleValue:unknown,languageValue:unknown){
  const role=legalRole(roleValue),language=contentLanguage(languageValue);
  const legal=(await this.store.db.ref('publicContent/legal').once('value')).val();const releaseId=String(legal?.activeRelease||''),release=legal?.releases?.[releaseId];
  if(!release||!Array.isArray(release.languages)||!release.languages.includes(language))throw fail(503,'legal_content_unavailable');
  const published=legalReleasePublished(release);
  const ids=role==='customer'?['customer']:['customer',role];
  const documents=ids.map(id=>{
   const family=release.documents?.[id];
   const variants=LANGUAGES.map(lang=>{const d=family?.[lang];if(!d||d.id!==id||d.language!==lang||typeof d.text!=='string'||!d.text.trim()||typeof d.version!=='string'||!d.version||typeof d.title!=='string')throw fail(503,'legal_translation_unavailable');return{id,title:d.title,version:d.version,language:lang,text:d.text,referenceText:String(d.referenceText||''),sourceVersion:String(d.sourceVersion||''),...(d.attachment?{attachment:d.attachment}:{})};});
   const revisionKey=sha(JSON.stringify({id,variants})),selected=variants.find(d=>d.language===language)!;
   const snapshot={...selected,releaseId,revisionKey};return{...snapshot,sha256:sha(JSON.stringify(snapshot))};
  });
  const bundleHash=sha(JSON.stringify({published,role,language,releaseId,documents:documents.map(d=>({id:d.id,version:d.version,sha256:d.sha256,revisionKey:d.revisionKey}))}));
  return{role,language,releaseId,published,accepting:legalAccepting(published),documents,bundleHash};
 }
 private matching(records:any,bundle:any){return Object.values<any>(records||{}).filter(r=>r?.accepted===true&&r.published===bundle.published&&bundle.documents.every((d:any)=>r.documents?.some((v:any)=>v.id===d.id&&v.revisionKey===d.revisionKey))).sort((a,b)=>String(b.acceptedAt).localeCompare(String(a.acceptedAt)))[0]||null;}
 content=async(req:Request,res:Response)=>{const language=contentLanguage(req.query.language),[labels,faq]=await Promise.all(['labels','faq'].map(branch=>this.store.db.ref(`publicContent/${branch}/${language}`).once('value')));if(!labels.val()||!faq.val())throw fail(503,'public_content_unavailable');res.setHeader('Cache-Control','no-store');return res.json({language,labels:labels.val(),faq:faq.val()});};
 catalog=async(req:Request,res:Response)=>{const bundle=await this.bundle(req.query.role,req.query.language),labels=(await this.store.db.ref(`publicContent/labels/${bundle.language}`).once('value')).val();if(!labels)throw fail(503,'public_content_unavailable');res.setHeader('Cache-Control','no-store');return res.json({...bundle,labels,roles:['customer','assetOwner','concierge'].map(id=>({id,label:labels[id]}))});};
 status=async(req:Request,res:Response)=>{const u=await this.identity(req),bundle=await this.bundle(req.query.role,req.query.language),records=(await this.store.db.ref(`legalAcceptances/${u.uid}`).once('value')).val(),receipt=this.matching(records,bundle);res.setHeader('Cache-Control','no-store');return res.json({uid:u.uid,role:bundle.role,language:bundle.language,accepted:!!receipt,accepting:bundle.accepting,receipt});};
 accept=async(req:Request,res:Response)=>{
  const u=await this.identity(req),body=req.body||{},bundle=await this.bundle(body.role,body.language),name=typeof body.signerName==='string'?body.signerName.trim():'';
  if(!bundle.accepting)throw fail(503,'legal_documents_not_published');
  if(body.accepted!==true||body.adultConfirmed!==true||name.length<2||name.length>240)throw fail(400,'legal_explicit_acceptance_required');
  const proof=bundle.documents.map(d=>({id:d.id,version:d.version,sha256:d.sha256,revisionKey:d.revisionKey}));
  if(body.bundleHash!==bundle.bundleHash||!Array.isArray(body.documents)||JSON.stringify(body.documents)!==JSON.stringify(proof))throw fail(409,'legal_version_changed_reload');
  for(const d of bundle.documents){const saved=await this.store.db.ref(`legalDocumentVersions/${d.sha256}`).transaction((old:any)=>old||d);const value=saved.snapshot.val();const payload=value&&{id:value.id,title:value.title,version:value.version,language:value.language,text:value.text,referenceText:value.referenceText,sourceVersion:value.sourceVersion,...(value.attachment?{attachment:value.attachment}:{}),releaseId:value.releaseId,revisionKey:value.revisionKey};if(!payload||sha(JSON.stringify(payload))!==d.sha256)throw fail(409,'legal_snapshot_conflict');}
  // Recheck after snapshot writes: an administrator may have changed the active content meanwhile.
  const current=await this.bundle(body.role,body.language);if(current.bundleHash!==bundle.bundleHash)throw fail(409,'legal_version_changed_reload');
  const ref=this.store.db.ref(`legalAcceptances/${u.uid}/${bundle.bundleHash}`),receipt={uid:u.uid,email:String(u.email||''),emailVerified:u.email_verified===true,signerName:name,role:bundle.role,language:bundle.language,releaseId:bundle.releaseId,accepted:true,adultConfirmed:true,acceptedAt:new Date().toISOString(),bundleHash:bundle.bundleHash,documents:proof,method:'authenticated_explicit_click',published:bundle.published};
  const result=await ref.transaction((old:any)=>old||receipt);res.setHeader('Cache-Control','no-store');return res.json({accepted:true,receipt:result.snapshot.val()});
 };
 receipt=async(req:Request,res:Response)=>{const u=await this.identity(req),hash=String(req.params.hash||'');if(!/^[a-f0-9]{64}$/.test(hash))throw fail(400,'invalid_receipt');const record=(await this.store.db.ref(`legalAcceptances/${u.uid}/${hash}`).once('value')).val();if(!record)throw fail(404,'receipt_not_found');const documents=await Promise.all(record.documents.map(async(d:any)=>(await this.store.db.ref(`legalDocumentVersions/${d.sha256}`).once('value')).val()));res.setHeader('Cache-Control','no-store');return res.json({receipt:record,documents});};
 async require(uid:string,role:unknown){const bundle=await this.bundle(role,'fr');if(!bundle.accepting)throw fail(503,'legal_documents_not_published');const records=(await this.store.db.ref(`legalAcceptances/${uid}`).once('value')).val();if(!this.matching(records,bundle))throw Object.assign(fail(428,'legal_acceptance_required'),{requiredRole:bundle.role});}
 guard=async(req:Request,res:Response,next:NextFunction)=>{try{
  const p=req.path;
  if(/^\/(public-content$|legal(?:\/|$)|me\/legal(?:\/|$)|health$|ui-content$|account-roles$|me\/(context|roles|profile)$|asset-domain$)/.test(p)||/\/callback$/.test(p)){next();return;}
  if(!req.headers.authorization){next();return;}
  // Account listing access remains available to upload compliance documents.
  if(req.method==='GET'&&p==='/owner/listings'){next();return;}
  const u=await this.identity(req),profile=(await this.store.db.ref(`backendusers/${u.uid}`).once('value')).val()||{};
  const booking=req.method==='POST'&&/^\/(?:bookings|(?:boat|car|parking|pool|property)-bookings)\/?$/.test(p);
  if(booking&&String(req.query.admin||'')!=='1'){await this.require(u.uid,'customer');next();return;}
  if(platformManagement({backendusers:{[u.uid]:profile}},u.uid,u)){next();return;}
  let role=legalRole(profile.role);if(/^\/(owner|owners)(\/|$)/.test(p))role='assetOwner';if(/^\/concierge(\/|$)/.test(p))role='concierge';
  if(/^\/(manage|admin\/bookings)(\/|$)/.test(p)){const grants=(await this.store.db.ref('assetDelegations').once('value')).val()||{};if(Object.values<any>(grants).some(t=>Object.values<any>(t||{}).some(a=>a?.[u.uid]?.active===true&&a[u.uid].conciergeId===u.uid)))await this.require(u.uid,'concierge');}
  if(role!=='customer'||booking)await this.require(u.uid,role);next();
 }catch(e:any){if(e.status===503&&e.message==='legal_documents_not_published'){res.setHeader('Cache-Control','no-store');res.status(503).json({error:'legal_documents_not_published',messageKey:'ui.ownerStripeStatus.legalUnavailable',stripeStatusKnown:false,retryable:true});return;}if(e.status===428){res.status(428).json({error:e.message,requiredRole:e.requiredRole});return;}next(e);}};
}
