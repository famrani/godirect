import {notificationDate} from './notification-details.js';
import admin from 'firebase-admin';import {createHash} from 'node:crypto';import {portalFor} from './portal-policy.js';import {domainAssetId} from './asset-domain.js';
const base='messageOperations/_devices';const hash=(v:string)=>createHash('sha256').update(v).digest('hex');
export function installPush(app:any,store:any,ready:()=>boolean){
 app.get('/api/push/config',(_q:any,s:any)=>s.json({key:ready()?process.env.FCM_WEB_VAPID_PUBLIC_KEY||'':''}));
 app.post('/api/push/device',async(q:any,s:any,n:any)=>{try{if(!ready())return s.sendStatus(503);
 let u;try{u=await store.auth.verifyIdToken(String(q.headers.authorization||'').replace(/^Bearer /,''),true);}catch{return s.sendStatus(401);}
 const token=q.body?.token;if(typeof token!=='string'||token.length<20||token.length>4096)return s.sendStatus(400);
 const host=q.hostname;if(portalFor(host)==='local'||q.headers.origin!=='https://'+host)return s.sendStatus(403);
 const ref=store.db.ref(base+'/'+hash(token));if(q.body.enabled===false){await ref.transaction((v:any)=>v?.uid===u.uid?null:v);}else await ref.set({uid:u.uid,token,host});
 return s.json({ok:true});}catch(e){n(e);}});}
export async function notifyDevices(root:any,uids:string[],type:string,id:string,thread:string,bookingId=''){
 if(!process.env.FCM_WEB_VAPID_PUBLIC_KEY)return;
 const devices=Object.values<any>(root.messageOperations?._devices||{}),prefix=String(root.assets?.[type]?.[id]?.prefix||id);
 const conversation=root.messageThreads?.[thread];
 const message=root.messageMessages?.[thread]?.[conversation?.lastMessageId];
 const booking=root.bookings?.[type]?.[id]?.[bookingId||conversation?.bookingId];
 const label:Record<string,string>={subscription:'Abonnement · Message',reservation:'Réservation · Message'};
 const title=thread?(label[conversation?.kind]||'Message · GoDirect'):'Réservation · Nouvelle demande';
 const sender=String((thread?message?.senderName:booking?.customerName)||'GoDirect').trim().slice(0,100);
 const date=notificationDate(thread?message?.createdAt:booking?.createdAt);
 const start=notificationDate(booking?.startAt||conversation?.prebooking?.startAt);
 const end=notificationDate(booking?.endAt||conversation?.prebooking?.endAt);
 const preview=String((thread?message?.text:booking?.comments)||'').trim().slice(0,240);
 const asset=String(root.assets?.[type]?.[id]?.name||'').slice(0,100);
 const body=[`De : ${sender}`,asset,date,start?[start,end].filter(Boolean).join(' → '):'',preview||(!thread?'Nouvelle demande de réservation.':'Vous avez reçu un message.')].filter(Boolean).join('\n');
 for(const d of devices){if(!uids.includes(d.uid)||!d.token||domainAssetId(d.host)&&domainAssetId(d.host)!==prefix)continue;
 try{await admin.messaging().send({token:d.token,data:{kind:thread?'message':'booking',thread,title,body,bookingId,assetType:type,assetId:id,delegated:d.uid!==booking?.ownerId?'1':'0'},webpush:{headers:{TTL:'600'}}});}catch(e:any){if(e.code==='messaging/registration-token-not-registered')await admin.database().ref(base+'/'+hash(d.token)).remove();else console.warn('[Push]',e.code||'delivery_failed');}}}

export async function sendEventPush(store:any,device:any,event:{id:string;title:string;body:string;path:string}){
 const token=String(device.token||'');
 if(!token)return;
 try{
  await admin.messaging().send({token,data:{kind:'event',eventId:event.id,title:event.title,body:event.body,path:event.path},webpush:{headers:{TTL:'600'}}});
 }catch(e:any){
  if(e.code!=='messaging/registration-token-not-registered')throw e;
  await store.db.ref(base+'/'+hash(token)).transaction((v:any)=>v?.uid===device.uid&&v?.token===token&&v?.host===device.host?null:undefined);
 }
}
