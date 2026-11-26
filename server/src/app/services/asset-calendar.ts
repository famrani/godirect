import {FirebaseService} from './firebase.service.js';
import {findAsset,isAssetType} from './asset-paths.service.js';
import {listingPublic} from './listing-billing.service.js';
import {platformAdministrator} from './account-access.service.js';
import {hasAssetPermission} from './asset-delegation.js';
import {legacySearchInterval} from './asset-search.service.js';
import {Request,Response} from 'express';

export function calendarRows(rows:any[],start:number,end:number,details:boolean):any[]{
 const valid=rows.filter(b=>Number.isFinite(Date.parse(b.startAt))&&Number.isFinite(Date.parse(b.endAt))&&Date.parse(b.endAt)>Date.parse(b.startAt)&&Date.parse(b.startAt)<end&&Date.parse(b.endAt)>start);
 if(details)return valid.map(b=>({id:String(b.id),startAt:b.startAt,endAt:b.endAt,status:String(b.status||'pending'),customerName:String(b.customerName||''),customerEmail:String(b.customerEmail||''),source:b.calendarSource||'booking'}));
 const periods=valid.filter(b=>!['cancelled','canceled','rejected','refused'].includes(String(b.status).toLowerCase())).map(b=>({a:Math.max(start,Date.parse(b.startAt)),z:Math.min(end,Date.parse(b.endAt))})).sort((a,b)=>a.a-b.a);
 const merged:Array<{a:number;z:number}>=[];
 for(const period of periods){const last=merged[merged.length-1];if(last&&period.a<=last.z)last.z=Math.max(last.z,period.z);else merged.push({...period});}
 // Public payload has no booking IDs, customer data, statuses or booking links.
 return merged.map(p=>({startAt:new Date(p.a).toISOString(),endAt:new Date(p.z).toISOString()}));
}
import {days,dayKey} from './calendar-rates.js';
import {updateExisting} from './existing-transaction.js';
import {matchesSite} from './portal-sites.js';
export class AssetCalendarService {
 constructor(private store:FirebaseService){}
 edit=async(req:Request,res:Response)=>{
  const type=String(req.params.type),id=String(req.params.id);
  if(!isAssetType(type)||!/^[-\w]{1,128}$/.test(id)||!await matchesSite(this.store,req.hostname,type,id))return res.sendStatus(404);
  const token=/^Bearer (.+)$/.exec(req.headers.authorization||'')?.[1];let uid:string;
  try{if(!token)throw Error();uid=(await this.store.auth.verifyIdToken(token,true)).uid;}catch{return res.sendStatus(401);}
  const {start,end,action,rate}=req.body||{},keys=action==='baseRate'?[]:days(start,end);
  if((action!=='baseRate'&&!keys.length)||!['block','personal','open','rate','reset','baseRate'].includes(action)||(['rate','baseRate'].includes(action)&&(!Number.isFinite(rate)||rate<=0||rate>1000000||Math.abs(Math.round(rate*100)-rate*100)>0.000001)))return res.sendStatus(400);
  const ref=this.store.db.ref();let failure=403;
  const tx=await updateExisting(ref,(root:any)=>{const a=root.assets?.[type]?.[id];if(!a||a.deletedAt||a.ownerId!==uid)return;
   if(action==='baseRate'){a.pricing??={};a.pricing.basePrice=rate;return root;}
   if(action==='block'||action==='personal'){const legacy=type==='boat'?Object.values<any>(root.bnBookings||{}).filter(b=>String(b.assetId||b.boatId||'alegria')===id).map(legacySearchInterval):[];
   if([...Object.values<any>(root.bookings?.[type]?.[id]||{}),...legacy].some(b=>!['cancelled','canceled','rejected','refused'].includes(b.status)&&Number.isFinite(Date.parse(b.startAt))&&Number.isFinite(Date.parse(b.endAt))&&dayKey(Date.parse(b.startAt))<=end&&dayKey(Date.parse(b.endAt)-1)>=start)){failure=409;return;}}
   a.calendarDays??={};for(const k of keys){const v=a.calendarDays[k]??={};if(action==='rate')v.rate=rate;else if(action==='reset')delete v.rate;else if(action==='open')delete v.blocked;else v.blocked=true;if(!Object.keys(v).length)delete a.calendarDays[k];}return root;});
  return tx.committed?res.json({ok:true}):res.status(failure).json({error:failure===409?'booking_conflict':'owner_required'});
 };
 get=async(req:Request,res:Response)=>{
  res.setHeader('Cache-Control','private, no-store');
  const type=String(req.params.type),id=String(req.params.id);
  if(!isAssetType(type)||!/^[a-zA-Z0-9_-]{1,180}$/.test(id))return res.status(400).json({error:'invalid_asset_scope'});
  if(!await matchesSite(this.store,req.hostname,type,id))return res.status(404).json({error:'asset_not_found'});
  const start=Date.parse(String(req.query.start||'')),end=Date.parse(String(req.query.end||''));
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>66*86400000)return res.status(400).json({error:'invalid_calendar_period'});
  const asset=await findAsset(this.store,id,type);if(!asset||asset.deletedAt)return res.status(404).json({error:'asset_not_found'});
  let isOwner=false;let details=false,canManageBookings=false;const token=/^Bearer (.+)$/.exec(req.headers.authorization||'')?.[1];
  if(token){let user:any;try{user=await this.store.auth.verifyIdToken(token,true);}catch{return res.status(401).json({error:'authentication_required'});}
   const profile=(await this.store.db.ref(`backendusers/${user.uid}`).once('value')).val()||{};
   isOwner=user.uid===asset.ownerId;canManageBookings=user.uid===asset.ownerId||await hasAssetPermission(this.store,user.uid,type,id,'bookings',user);
   details=canManageBookings||platformAdministrator(user,profile);
  }
  if(!details&&!await listingPublic(this.store,type,id,asset))return res.status(404).json({error:'asset_not_found'});
  const data=(await this.store.db.ref(`bookings/${type}/${id}`).once('value')).val()||{};
  const rows=Object.entries<any>(data).filter(([,b])=>b&&(!b.ownerId||b.ownerId===asset.ownerId)).map(([key,b])=>({...b,id:key,calendarSource:'booking'}));
  if(type==='boat'){
   const legacy=(await this.store.db.ref('bnBookings').once('value')).val()||{};
   for(const [key,b]of Object.entries<any>(legacy))if(b&&String(b.assetId||b.boatId||'alegria')===id&&(!b.assetType||b.assetType==='boat')&&(!b.ownerId||b.ownerId===asset.ownerId)&&!rows.some(row=>row.id===key||row.legacyBookingId===key))rows.push({...legacySearchInterval(b),id:key,calendarSource:'legacy'});
  }
  return res.json({assetName:asset.name,assetType:type,assetId:id,timeZone:'Europe/Paris',isOwner,currency:asset.pricing?.currency||'EUR',unit:asset.pricing?.pricingUnit||'day',basePrice:asset.pricing?.basePrice,days:Object.fromEntries(Object.entries<any>(asset.calendarDays||{}).filter(([k])=>k>=dayKey(start)&&k<=dayKey(end))),canViewDetails:details,canManageBookings,events:calendarRows(rows,start,end,details)});
 };
}
