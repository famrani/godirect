import {verifyMessagingRules} from './messaging-storage.js';
import {createHash} from 'node:crypto';
import type {Express,Request,Response,NextFunction} from 'express';
import type {FirebaseService} from './firebase.service.js';
import {activeDelegation} from './asset-delegation.js';
import {canMessage} from './messaging-policy.js';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const phoneOK=(s:string)=>/^\+[1-9]\d{7,14}$/.test(s);
const fail=(status:number,message:string)=>Object.assign(Error(message),{status});
const enabled=()=>process.env.MOBILE_ALERTS_ENABLED==='true';
const sid=()=>process.env.TWILIO_ACCOUNT_SID||'';
const verify=()=>process.env.TWILIO_VERIFY_SERVICE_SID||'';
let rulesPrivate=false;
const configured=()=>rulesPrivate&&enabled()&&/^AC[a-f0-9]{32}$/i.test(sid())&&!!process.env.TWILIO_AUTH_TOKEN&&/^VA[a-f0-9]{32}$/i.test(verify());
const channels=()=>({sms:configured()&&!!process.env.TWILIO_SMS_FROM,whatsapp:configured()&&!!process.env.TWILIO_WHATSAPP_FROM&&!!process.env.TWILIO_WHATSAPP_ALERT_TEMPLATE});
const allowed=(phone:string)=>{const list=(process.env.MOBILE_ALERTS_ALLOWED_NUMBERS||'').split(',').map(s=>s.trim()).filter(Boolean);return !list.length||list.includes(phone);};
type Event={kind:'inquiry'|'booking';type:string;assetId:string;ownerId:string;reference:string};
function recipients(root:any,e:Event){
 const a=root.assets?.[e.type]?.[e.assetId];if(!a||a.deletedAt||a.ownerId!==e.ownerId)return [];
 const thread=e.kind==='inquiry'?root.messageThreads?.[e.reference]:null;
 if(e.kind==='inquiry'&&(!thread||thread.type!==e.type||thread.assetId!==e.assetId))return [];
 return [...new Set([e.ownerId,...Object.keys(root.assetDelegations?.[e.type]?.[e.assetId]||{})])].filter(uid=>
  (uid===e.ownerId||activeDelegation(root,uid,e.type,e.assetId)?.permissions?.bookings===true)
  &&(!thread||canMessage(root,{uid},thread)));
}
export function queueMobileAlert(root:any,e:Event){
 if(!configured())return;
 for(const uid of recipients(root,e)){
  const p=root.mobileAlertPreferences?.[uid];if(!p?.verifiedAt||!['sms','whatsapp'].includes(p.channel))continue;
  const key=hash([e.kind,e.type,e.assetId,e.reference,uid].join('|'));
  root.mobileAlertQueue??={};root.mobileAlertQueue[key]??={...e,uid,channel:p.channel,verifiedAt:p.verifiedAt,status:'pending',createdAt:Date.now()};
 }
}
async function twilio(host:'verify'|'api',path:string,form:Record<string,string>){
 const response=await fetch('https://'+host+'.twilio.com'+path,{method:'POST',headers:{Authorization:'Basic '+Buffer.from(sid()+':'+process.env.TWILIO_AUTH_TOKEN).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(form),signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw fail(502,'mobile_provider_error');
 return await response.json() as any;
}
export class MobileAlerts {
 private running=false;
 constructor(private store:FirebaseService){}
 private read(path:string){return this.store.db.ref(path).once('value').then(s=>s.val());}
 private async throttle(key:string,wait:number){const now=Date.now();const r=await this.store.db.ref('mobileAlertLimits/'+key).transaction(v=>Number(v||0)>now?undefined:now+wait,undefined,false);if(!r.committed)throw fail(429,'mobile_rate_limited');}
 routes(app:Express){
  const wrap=(action:(req:Request,res:Response,uid:string)=>Promise<unknown>)=>async(req:Request,res:Response,next:NextFunction)=>{res.set('Cache-Control','no-store');try{const token=/^Bearer (.+)$/i.exec(String(req.headers.authorization||''))?.[1];if(!token)throw fail(401,'authentication_required');let user;try{user=await this.store.auth.verifyIdToken(token,true);}catch{throw fail(401,'invalid_authentication');}return await action(req,res,user.uid);}catch(e){next(e);}};
  const base='/api/me/mobile-alerts';
  app.get(base,wrap(async(_req,res,uid)=>{const p=await this.read('mobileAlertPreferences/'+uid);return res.json({phone:p?.phone||'',channel:p?.channel||'off',available:channels(),verified:!!p?.verifiedAt});}));
  app.post(base+'/verify',wrap(async(req,res,uid)=>{
   if(!configured())throw fail(503,'mobile_not_configured');
   const phone=String(req.body?.phone||'').trim();if(!phoneOK(phone)||!allowed(phone))throw fail(400,'invalid_mobile_number');
   const profile=await this.read('backendusers/'+uid);const account=await this.store.auth.getUser(uid);
   if(!account.emailVerified||!profile)throw fail(403,'verified_account_required');
   await this.throttle('send_'+hash(uid),60000);await this.throttle('phone_'+hash(phone),60000);await this.throttle('ip_'+hash(String(req.ip)),10000);
   const day=new Date().toISOString().slice(0,10);
   const limit=Number(process.env.MOBILE_VERIFY_DAILY_LIMIT)||100;
   const quota=await this.store.db.ref('mobileAlertLimits/day_'+day).transaction(v=>Number(v||0)>=limit?undefined:Number(v||0)+1,undefined,false);
   if(!quota.committed)throw fail(429,'mobile_rate_limited');
   await twilio('verify','/v2/Services/'+verify()+'/Verifications',{To:phone,Channel:'sms'});
   await this.store.db.ref('mobileAlertVerification/'+uid).set({phone,expiresAt:Date.now()+600000});
   return res.json({ok:true});
  }));
  app.post(base+'/confirm',wrap(async(req,res,uid)=>{
   if(!configured())throw fail(503,'mobile_not_configured');const code=String(req.body?.code||'');if(!/^\d{4,10}$/.test(code))throw fail(400,'invalid_mobile_code');
   await this.throttle('check_'+hash(uid),3000);const pending=await this.read('mobileAlertVerification/'+uid);if(!pending||pending.expiresAt<Date.now()||!allowed(pending.phone))throw fail(409,'mobile_code_expired');
   const result=await twilio('verify','/v2/Services/'+verify()+'/VerificationCheck',{To:pending.phone,Code:code});if(result.status!=='approved')throw fail(400,'invalid_mobile_code');
   const saved=await this.store.db.ref().transaction(root=>{const p=root?.mobileAlertVerification?.[uid];if(!p||p.phone!==pending.phone||p.expiresAt!==pending.expiresAt||p.expiresAt<Date.now())return;root.mobileAlertPreferences??={};root.mobileAlertPreferences[uid]={phone:p.phone,verifiedAt:Date.now(),channel:'off'};delete root.mobileAlertVerification[uid];return root;},undefined,false);
   if(!saved.committed)throw fail(409,'mobile_code_expired');return res.json({ok:true});
  }));
  app.put(base,wrap(async(req,res,uid)=>{
   const channel:unknown=req.body?.channel;const c=channels();if(channel!=='off'&&(!(channel==='sms'||channel==='whatsapp')||!c[channel]||req.body?.consent!==true))throw fail(400,'mobile_consent_required');
   const result=await this.store.db.ref('mobileAlertPreferences/'+uid).transaction(p=>channel==='off'?{...(p||{}),channel}:p?.verifiedAt?{...p,channel,consentAt:Date.now()}:undefined,undefined,false);
   if(!result.committed)throw fail(409,'mobile_number_not_verified');return res.json({ok:true});
  }));
 }
 async start(){if(!enabled())return;
  try{rulesPrivate=await verifyMessagingRules(['mobileAlertPreferences','mobileAlertVerification','mobileAlertQueue','mobileAlertLimits']);}catch{rulesPrivate=false;}
  if(!configured()){console.error('[GoDirect mobile] disabled: check Firebase rules and Twilio configuration');return;}const timer=setInterval(()=>void this.tick(),15000);timer.unref();void this.tick();}
 async tick(){
  if(this.running||!configured())return;this.running=true;
  try{
   const rows=(await this.store.db.ref('mobileAlertQueue').orderByChild('status').equalTo('pending').limitToFirst(20).once('value')).val()||{};
   for(const id of Object.keys(rows))await this.deliver(id);
  }catch{console.error('[GoDirect mobile] worker failed');}finally{this.running=false;}
 }
 private async deliver(id:string){
  const ref=this.store.db.ref('mobileAlertQueue/'+id),claim=await ref.transaction(q=>q?.status==='pending'?{...q,status:'sending',claimedAt:Date.now()}:undefined,undefined,false);
  if(!claim.committed)return;const e=claim.snapshot.val();let status='skipped';
  try{
   const [asset,delegations,thread,booking,p]=await Promise.all([this.read(`assets/${e.type}/${e.assetId}`),this.read(`assetDelegations/${e.type}/${e.assetId}`),e.kind==='inquiry'?this.read('messageThreads/'+e.reference):null,e.kind==='booking'?this.read(`bookings/${e.type}/${e.assetId}/${e.reference}`):null,this.read('mobileAlertPreferences/'+e.uid)]);
   const root={assets:{[e.type]:{[e.assetId]:asset}},assetDelegations:{[e.type]:{[e.assetId]:delegations}},messageThreads:{[e.reference]:thread}};
   if(Date.now()-e.createdAt>3600000||!recipients(root,e).includes(e.uid)||(!thread&&booking?.ownerId!==e.ownerId)||!p?.verifiedAt||p.verifiedAt!==e.verifiedAt||p.channel!==e.channel||!phoneOK(p.phone)||!allowed(p.phone))return;
   if((e.channel!=='sms'&&e.channel!=='whatsapp')||!channels()[e.channel as 'sms'|'whatsapp'])return;
   const q=new URLSearchParams({bookingId:e.reference,assetType:e.type,assetId:e.assetId});
   const path=e.kind==='inquiry'?'/messages?threadId='+e.reference:(e.uid===e.ownerId?'/owner/activity/reservations':'/concierge/activity/reservations')+'?'+q;
   const origin=e.uid===e.ownerId?'https://owner.godirect.fr':'https://concierge.godirect.fr';
   const link=origin+'/account/login?returnUrl='+encodeURIComponent(path);
   const kind=e.kind==='inquiry'?'demande de renseignement':'demande de réservation';
   const name=String(asset.name||'votre bien').replace(/\s+/g,' ').slice(0,70);
   if(e.channel==='whatsapp')await twilio('api','/2010-04-01/Accounts/'+sid()+'/Messages.json',{To:'whatsapp:'+p.phone,From:process.env.TWILIO_WHATSAPP_FROM!,ContentSid:process.env.TWILIO_WHATSAPP_ALERT_TEMPLATE!,ContentVariables:JSON.stringify({'1':kind,'2':name,'3':link})});
   else if(e.channel==='sms')await twilio('api','/2010-04-01/Accounts/'+sid()+'/Messages.json',{To:p.phone,From:process.env.TWILIO_SMS_FROM!,Body:`GoDirect : nouvelle ${kind} — ${name}. ${link}`});
   status='accepted';
  }catch{status='failed_or_unknown';}finally{await ref.update({status,finishedAt:Date.now()});}
 }
}
