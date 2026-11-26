import {sendEventPush} from './portal-push.js';
import {matchesSite} from './portal-sites.js';
import {portalFor} from './portal-policy.js';
import {notificationCategory,notificationDate,notificationName} from './notification-details.js';
import {claimNotification,renewNotification,failNotification,retryNotification} from './notification-queue.js';
import {createHash,randomUUID} from 'node:crypto';
import type {FirebaseService} from './firebase.service.js';
import type {Request,Response,Express} from 'express';
import {activeDelegation,platformManagement} from './asset-delegation.js';
import {smtpSender} from './contact.service.js';
export type MailEvent={key:string;kind:string;type:string;assetId:string;ownerId?:string;bookingId?:string;customerId?:string;reason?:string;amount?:number;currency?:string;actorId?:string;periodStart?:number;periodEnd?:number;changes?:string[]};
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const validScope=(e:MailEvent)=>['boat','car','property','parking','pool'].includes(e.type)&&/^[a-zA-Z0-9_-]{1,180}$/.test(e.assetId);
export function notificationId(e:MailEvent){return hash(e.kind+'|'+e.type+'|'+e.assetId+'|'+e.key);}
/** Called inside domain transactions: email failure never rolls back a booking/payment. */
export function queueNotification(root:any,event:MailEvent){if(!root||!validScope(event)||process.env.NOTIFICATIONS_CAPTURE==='false')return;const id=notificationId(event);root.notificationEvents??={};if(root.notificationEvents[id])return;const now=Date.now();const clean=JSON.parse(JSON.stringify(event));root.notificationEvents[id]={...clean,createdAt:now,deliveries:{},status:'queued'};root.notificationQueue??={};root.notificationQueue[id]={nextAttemptAt:now,attempts:0,leaseUntil:0};if(process.env.FCM_WEB_VAPID_PUBLIC_KEY?.trim()){root.notificationPushQueue??={};root.notificationPushQueue[id]={nextAttemptAt:now,attempts:0,leaseUntil:0,expiresAt:now+86400000};}}
export async function emitNotification(store:FirebaseService,event:MailEvent){try{await store.db.ref().transaction(root=>{if(root===null)return null;queueNotification(root,event);return root;},undefined,false);}catch{console.error('[GoDirect email] enqueue failed; event='+notificationId(event));throw Error('notification_enqueue_retry');}}
export function queueBookingChange(root:any,before:any,after:any){
 if(!after)return;
 // Owner approval does not necessarily satisfy deposit/warranty requirements.
 // Notify that approval even when advanceReservation keeps status pending.
 if(before&&before.workflow?.adminApproved!==true&&after.workflow?.adminApproved===true&&after.workflow?.origin==='customer'&&after.status==='pending'){
  queueNotification(root,{key:after.id+'|accepted|'+String(after.workflow.approvedAt||after.updatedAt||'initial'),kind:'booking.accepted',type:after.assetType,assetId:after.assetId,ownerId:after.ownerId,bookingId:after.id,customerId:after.customerId});
 }
 if(before?.status===after.status)return;
 const kind=({confirmed:'booking.confirmed',rejected:'booking.rejected',cancelled:'booking.cancelled',completed:'booking.completed'} as Record<string,string>)[after.status];
 if(kind)queueNotification(root,{key:after.id+'|'+after.status,kind,type:after.assetType,assetId:after.assetId,ownerId:after.ownerId,bookingId:after.id,customerId:after.customerId});
}
const COPY:Record<string,[string,string]>={
 'listing.updated':['Annonce modifiée — à vérifier','Listing updated — review required'],
 'asset.created':['Votre bien est enregistré','Your asset has been saved'],
 'listing.pending':['Annonce à modérer','Listing awaiting review'],
 'listing.approved':['Annonce validée','Listing approved'],
 'listing.rejected':['Annonce refusée','Listing rejected'],
 'documents.pending':['Justificatifs à vérifier','Documents awaiting review'],
 'documents.approved':['Dossier de justificatifs validé','Documents approved'],
 'documents.rejected':['Dossier de justificatifs refusé','Documents rejected'],
 'documents.file.approved':['Justificatif validé','Document approved'],
 'documents.file.rejected':['Justificatif refusé','Document rejected'],
 'subscription.paid':['Abonnement payé','Subscription paid'],
 'subscription.failed':['Paiement de l’abonnement échoué','Subscription payment failed'],
 'booking.updated':['Réservation modifiée','Booking updated'],
 'booking.created':['Nouvelle demande de réservation','New booking request'],
 'booking.accepted':['Réservation acceptée par le propriétaire','Booking accepted by the owner'],
 'booking.confirmed':['Réservation confirmée','Booking confirmed'],
 'booking.rejected':['Réservation refusée','Booking rejected'],
 'booking.cancelled':['Réservation annulée','Booking cancelled'],
 'booking.completed':['Location terminée','Rental completed'],
 'booking.cancellation_requested':['Demande d’annulation reçue','Cancellation requested'],
 'payment.booking_deposit':['Acompte confirmé','Deposit confirmed'],
 'payment.balance':['Paiement du solde confirmé','Balance payment confirmed'],
 'payment.security_deposit':['Carte enregistrée pour la caution — aucun débit','Card saved for the security deposit — no charge'],
 'payment.security_payment':['Débit de caution confirmé','Security deposit charge confirmed'],
 'payment.refunded':['Remboursement confirmé','Refund confirmed'],
 'payment.failed':['Paiement non abouti','Payment unsuccessful']
};
export function notificationAudience(kind:string){return kind==='listing.pending'||kind==='documents.pending'?'admin':['subscription.paid','listing.updated'].includes(kind)?'ownerAdmin':kind.startsWith('booking.')||kind.startsWith('payment.')?'booking':'owner';}
export function notificationLink(e:MailEvent,admin:boolean,customer:boolean){if(admin)return e.kind.startsWith('documents.')?`/platform/admin/documents/${e.type}/${e.assetId}`:`/platform/admin/assets/${e.type}/${e.assetId}`;if(customer)return `/${e.type}/${e.assetId}/my-bookings`;return e.bookingId?`/${e.type}/${e.assetId}/admin/bookings`:'/owner/listings';}
export class EmailNotifications {
 private running=false;private pushing=false;private timer:ReturnType<typeof setInterval>|undefined;private sender:Awaited<ReturnType<typeof smtpSender>>;private lastError='';
 constructor(private store:FirebaseService){}
 start(){if(this.timer)return;this.timer=setInterval(()=>{void this.tick();void this.pushTick();},15000);this.timer.unref();void this.tick();void this.pushTick();}
 stop(){if(this.timer)clearInterval(this.timer);this.timer=undefined;}
 private enabled(){return process.env.NOTIFICATIONS_ENABLED==='true';}
 private origin(){const u=new URL(process.env.NOTIFICATIONS_BASE_URL||process.env.FRONTEND_URL||'https://godirect.fr');if(u.protocol!=='https:'&&!(u.protocol==='http:'&&['localhost','127.0.0.1'].includes(u.hostname)))throw Error('invalid_notification_origin');return u.origin;}
 private async recipients(e:MailEvent){const asset=(await this.store.db.ref(`assets/${e.type}/${e.assetId}`).once('value')).val();if(!asset||asset.ownerId!==e.ownerId||asset.deletedAt)return [];const booking=e.bookingId?(await this.store.db.ref(`bookings/${e.type}/${e.assetId}/${e.bookingId}`).once('value')).val():null;if(e.bookingId&&(!booking||booking.ownerId!==asset.ownerId))return [];const audience=notificationAudience(e.kind),ids=new Map<string,{admin:boolean;customer:boolean}>();if(audience!=='admin')ids.set(asset.ownerId,{admin:false,customer:false});
 if(audience!=='admin'){const grants=(await this.store.db.ref(`assetDelegations/${e.type}/${e.assetId}`).once('value')).val()||{};const permission=e.kind.startsWith('payment.')?'payments':e.kind.startsWith('booking.')?'bookings':'content';for(const uid of Object.keys(grants))if(activeDelegation({assets:{[e.type]:{[e.assetId]:asset}},assetDelegations:{[e.type]:{[e.assetId]:grants}}},uid,e.type,e.assetId)?.permissions?.[permission]===true)ids.set(uid,{admin:false,customer:false});}
 if(audience==='booking'&&booking?.customerId)ids.set(booking.customerId,{admin:false,customer:true});const result=[];for(const [uid,role]of ids){try{const auth=await this.store.auth.getUser(uid);if(auth.disabled||!auth.email)continue;const profile=(await this.store.db.ref(`backendusers/${uid}`).once('value')).val()||{};const lang=String(profile.language||profile.preferredLanguage||'fr').startsWith('en')?'en':'fr';result.push({uid,email:auth.email,...role,lang,assetName:String(asset.name||e.assetId).slice(0,180),booking});}catch(err:any){if(err?.code!=='auth/user-not-found')throw err;}}if(audience==='admin'||audience==='ownerAdmin'){const email=process.env.NOTIFICATIONS_ADMIN_EMAIL||'famrani@alldigitalnetwork.com';if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw Error('invalid_admin_email');result.push({uid:'admin-mailbox',email,admin:true,customer:false,lang:'fr',assetName:String(asset.name||e.assetId).slice(0,180),booking});}return result;}
 async pushTick(){
  if(this.pushing||!process.env.FCM_WEB_VAPID_PUBLIC_KEY?.trim())return;
  this.pushing=true;
  try{
   const rows=(await this.store.db.ref('notificationPushQueue').once('value')).val()||{},now=Date.now();
   const due=Object.entries<any>(rows).filter(([,q])=>q.leaseUntil<=now&&(q.expiresAt<=now||(q.attempts<8&&q.nextAttemptAt<=now))).sort((a,b)=>a[1].nextAttemptAt-b[1].nextAttemptAt).slice(0,20);
   for(const [id,q] of due){
    const ref=this.store.db.ref('notificationPushQueue/'+id);
    if(q.expiresAt<=now){await ref.transaction(v=>v?.expiresAt<=now&&v.leaseUntil<=now?null:undefined);continue;}
    const token=randomUUID(),lock=await ref.transaction(v=>claimNotification(v,token,Date.now()),undefined,false);
    if(!lock.committed||lock.snapshot.val()?.lease!==token)continue;
    try{
     const snap=await this.store.db.ref('notificationEvents/'+id).once('value'),e=snap.val();
     if(e&&validScope(e))await this.deliverPush(id,e);
     await ref.transaction(v=>v?.lease===token?null:undefined);
    }catch{
     await ref.transaction(v=>failNotification(v,token,Date.now(),'push_failed',null),undefined,false);
    }
   }
  }catch{console.warn('[GoDirect push] notification worker failed');}
  finally{this.pushing=false;}
 }
 private async deliverPush(id:string,e:MailEvent&{createdAt:number}){
  const recipients=await this.recipients(e);
  const devices=(await this.store.db.ref('messageOperations/_devices').once('value')).val()||{};
  if(!Object.keys(devices).length)return;
  for(const r of recipients){
   let uid=r.uid;
   if(r.admin){
    try{const admin=await this.store.auth.getUserByEmail(r.email);if(admin.disabled)continue;uid=admin.uid;
     const p=(await this.store.db.ref('backendusers/'+uid).once('value')).val();
     if(!platformManagement({backendusers:{[uid]:p}},uid,admin.customClaims||{}))continue;
    }catch(error:any){if(error?.code==='auth/user-not-found')continue;throw error;}
   }
   const en=r.lang==='en',category=notificationCategory(e.kind,en),subject=(COPY[e.kind]||[e.kind,e.kind])[en?1:0];
   const fromId=e.actorId||(['booking.created','booking.cancellation_requested'].includes(e.kind)?r.booking?.customerId:['booking.accepted','booking.rejected','asset.created','listing.pending'].includes(e.kind)?e.ownerId:undefined);
   const profile=fromId?(await this.store.db.ref('backendusers/'+fromId).once('value')).val():null;
   const from=notificationName(profile)||(fromId&&fromId===r.booking?.customerId?String(r.booking?.customerName||'').slice(0,100):'')||'GoDirect';
   const start=notificationDate(r.booking?.startAt||e.periodStart,en,!r.booking),end=notificationDate(r.booking?.endAt||e.periodEnd,en,!r.booking);
   const body=[r.assetName,`${en?'From':'De'} : ${from}`,notificationDate(e.createdAt,en),[start,end].filter(Boolean).join(' → '),typeof e.amount==='number'?`${e.amount.toFixed(2)} ${e.currency||'EUR'}`:'',e.kind==='booking.created'?r.booking?.comments:e.reason].filter(Boolean).join('\n').slice(0,500);
   const path=r.admin?notificationLink(e,true,false):r.customer?'/account/bookings':e.bookingId?(uid===e.ownerId?'/owner/activity/reservations':'/concierge/activity/reservations')+'?'+new URLSearchParams({bookingId:e.bookingId,assetType:e.type,assetId:e.assetId}):uid===e.ownerId?'/owner/listings':'/concierge';
   for(const [key,device] of Object.entries<any>(devices)){
    if(device.uid!==uid||!device.token)continue;
    const portal=portalFor(device.host||'');
    if(r.admin?portal!=='admin':portal==='local'||portal==='admin'||(portal==='asset'&&(!r.customer&&uid!==e.ownerId||!await matchesSite(this.store,device.host,e.type,e.assetId))))continue;
    const marker=this.store.db.ref(`notificationEvents/${id}/pushDeliveries/${hash(key)}`);
    if((await marker.once('value')).exists())continue;
    const fresh=(await this.store.db.ref('messageOperations/_devices/'+key).once('value')).val();
    if(fresh?.uid!==uid||fresh?.token!==device.token||fresh?.host!==device.host)continue;
    await sendEventPush(this.store,fresh,{id,title:category+' · '+subject,body,path});
    await marker.set({sentAt:Date.now()});
   }
  }
 }
 async tick(){if(this.running||!this.enabled())return;this.running=true;try{this.origin();this.sender ||= await smtpSender();if(!this.sender){this.lastError='mail_not_configured';return;}const rows=(await this.store.db.ref('notificationQueue').once('value')).val()||{};const due=Object.entries<any>(rows).filter(([,q])=>q.attempts<8&&q.nextAttemptAt<=Date.now()&&q.leaseUntil<Date.now()).sort((a,b)=>a[1].nextAttemptAt-b[1].nextAttemptAt).slice(0,20);for(const [id]of due)await this.deliver(id);this.lastError='';}catch{this.lastError='notification_worker_failed';console.error('[GoDirect email] worker failed');}finally{this.running=false;}}
 private async deliver(id:string){const ref=this.store.db.ref('notificationQueue/'+id),token=randomUUID();const lock=await ref.transaction(q=>claimNotification(q,token,Date.now()),undefined,false);if(!lock.committed||lock.snapshot.val()?.lease!==token)return;try{const e=(await this.store.db.ref('notificationEvents/'+id).once('value')).val();if(!e)throw Error('missing_event');const from=process.env.NOTIFICATIONS_FROM_ADDRESS||process.env.CONTACT_FROM_ADDRESS||process.env.SMTP_USER||'';if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(from))throw Error('mail_not_configured');const recipients=await this.recipients(e);if(!recipients.length)throw Error('no_eligible_recipient');for(const r of recipients){const renewed=await ref.transaction(q=>renewNotification(q,token,Date.now()),undefined,false);if(!renewed.committed||renewed.snapshot.val()?.lease!==token)throw Error('notification_lease_lost');const delivery=hash(r.email.toLowerCase());if((await this.store.db.ref(`notificationEvents/${id}/deliveries/${delivery}`).once('value')).exists())continue;const en=r.lang==='en',subject=(COPY[e.kind]||[e.kind,e.kind])[en?1:0];const category=notificationCategory(e.kind,en);
const sourceId=e.actorId||(['booking.created','booking.cancellation_requested'].includes(e.kind)?e.customerId:e.kind==='booking.accepted'?e.ownerId:undefined);
const sourceProfile=sourceId?(await this.store.db.ref('backendusers/'+sourceId).once('value')).val():null;
const source=notificationName(sourceProfile)||(sourceId&&sourceId===r.booking?.customerId?r.booking?.customerName:'')||'GoDirect';
const at=notificationDate(e.createdAt,en);
const start=notificationDate(r.booking?.startAt||e.periodStart,en,!r.booking);
const end=notificationDate(r.booking?.endAt||e.periodEnd,en,!r.booking);
const text=[subject,`Type : ${category}`,`${en?'From':'De'} : ${source}`,at?`Date : ${at} (Europe/Paris)`:'',e.kind==='booking.accepted'?(en?'The owner has accepted the request. This is not yet the final booking confirmation. Sign in to view and complete any remaining steps.':'Le propriétaire a accepté la demande. Il ne s’agit pas encore de la confirmation définitive. Connectez-vous pour consulter et terminer les étapes restantes.'):'',`${en?'Asset':'Bien'} : ${r.assetName}`,e.bookingId?`${en?'Booking':'Réservation'} : ${e.bookingId}`:'',start?`${en?'Start':'Début'} : ${start}`:'',end?`${en?'End':'Fin'} : ${end}`:'',e.kind==='booking.created'&&r.booking?.comments?`Message : ${String(r.booking.comments).slice(0,4000)}`:'',e.amount!==undefined?`${en?'Amount':'Montant'} : ${e.amount.toFixed(2)} ${e.currency||'EUR'}`:'',e.changes?.length?`${en?'Updated sections':'Rubriques modifiées'} : ${e.changes.map((k:string)=>({presentation:en?'title / description':'titre / description',photos:en?'photos':'photos',pricing:en?'pricing / payment policy':'tarifs / conditions de paiement',details:en?'details':'caractéristiques',location:en?'location':'localisation',prefix:en?'website prefix':'préfixe du site',site:en?'website content':'contenu du site'} as Record<string,string>)[k]||k).join(', ')}`:'',e.reason?`${en?'Reason':'Motif'} : ${e.reason.slice(0,2000)}`:'','GoDirect : '+this.origin()+notificationLink(e,r.admin,r.customer),'',en?'Sign in to view the details.':'Connectez-vous pour consulter les détails.'].filter(Boolean).join('\n');const allow=(process.env.NOTIFICATIONS_ALLOWED_RECIPIENTS||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);if(allow.length&&!allow.includes(r.email.toLowerCase())){await this.store.db.ref(`notificationEvents/${id}/deliveries/${delivery}`).set({uid:r.uid,skippedAt:Date.now(),reason:'test_allowlist'});continue;}const sent=await this.sender!({from:{name:'GoDirect — All Digital Network',address:from},to:r.email,subject:'[GoDirect · '+category+'] '+subject,text,messageId:`<${id}.${delivery}@godirect.fr>`,disableFileAccess:true,disableUrlAccess:true} as any);if(!sent.accepted?.some(v=>String(v).toLowerCase()===r.email.toLowerCase()))throw Error('recipient_not_accepted');await this.store.db.ref(`notificationEvents/${id}/deliveries/${delivery}`).set({uid:r.uid,sentAt:Date.now()});}
 await this.store.db.ref().update({[`notificationEvents/${id}/status`]:'sent',[`notificationEvents/${id}/sentAt`]:Date.now(),['notificationQueue/'+id]:null});
 }catch(error:any){const known=['mail_not_configured','no_eligible_recipient','missing_event','notification_lease_lost','recipient_not_accepted','invalid_admin_email'];const code=known.includes(error?.message)?error.message:['EAUTH','ESOCKET','ETIMEDOUT','ENOTFOUND','ECONNECTION','EENVELOPE'].includes(error?.code)?error.code:'delivery_failed';const responseCode=Number.isInteger(error?.responseCode)?error.responseCode:null;await ref.transaction(q=>failNotification(q,token,Date.now(),code,responseCode),undefined,false);console.error('[GoDirect email] delivery pending; event='+id+'; code='+code+(responseCode?'; smtp='+responseCode:''));}}
 private async administrator(req:Request){const token=/^Bearer (.+)$/.exec(req.headers.authorization||'')?.[1];if(!token)throw Object.assign(Error('authentication_required'),{status:401});let u:any;try{u=await this.store.auth.verifyIdToken(token,true);}catch{throw Object.assign(Error('authentication_required'),{status:401});}const p=(await this.store.db.ref('backendusers/'+u.uid).once('value')).val();if(!platformManagement({backendusers:{[u.uid]:p}},u.uid,u))throw Object.assign(Error('platform_admin_required'),{status:403});return u;}
 routes(app:Express){
 app.get('/api/platform/admin/notifications',async(req:Request,res:Response)=>{try{await this.administrator(req);const queue=(await this.store.db.ref('notificationQueue').once('value')).val()||{};return res.set('Cache-Control','no-store').json({enabled:this.enabled(),captureEnabled:process.env.NOTIFICATIONS_CAPTURE!=='false',adminEmail:process.env.NOTIFICATIONS_ADMIN_EMAIL||'famrani@alldigitalnetwork.com',recipientFilterActive:!!process.env.NOTIFICATIONS_ALLOWED_RECIPIENTS?.trim(),smtpConfigured:!!(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS),pending:Object.keys(queue).length,failed:Object.values<any>(queue).filter(q=>q.attempts>=8).length,lastError:this.lastError,queue:Object.entries<any>(queue).map(([id,q])=>({id,attempts:q.attempts,nextAttemptAt:q.nextAttemptAt,lastError:q.lastError||null,responseCode:q.responseCode||null})).slice(0,100)});}catch(e:any){return res.status(e.status||503).json({error:e.status?e.message:'notifications_unavailable'});}});
 app.post('/api/platform/admin/notifications/:id/retry',async(req:Request,res:Response)=>{try{const user=await this.administrator(req);const id=req.params.id;if(typeof id!=='string'||!/^[a-f0-9]{64}$/.test(id))return res.status(400).json({error:'invalid_notification'});const event=(await this.store.db.ref('notificationEvents/'+id).once('value')).val();if(!event||event.status==='sent')return res.status(409).json({error:'notification_not_pending'});const result=await this.store.db.ref('notificationQueue/'+id).transaction(q=>retryNotification(q,user.uid,Date.now()),undefined,false);if(!result.committed||!result.snapshot.exists())return res.status(409).json({error:'notification_busy'});return res.json({ok:true});}catch(e:any){return res.status(e.status||503).json({error:e.status?e.message:'notifications_unavailable'});}});
 }
}
