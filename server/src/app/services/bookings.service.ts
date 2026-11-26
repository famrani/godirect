import {blocked,periodTotal} from './calendar-rates.js';
import {queueMobileAlert} from './mobile-alerts.js';
import {customerScopeFilter,matchesSite,siteOrigin} from './portal-sites.js';
import {portalFor} from './portal-policy.js';
import {linkPrebooking} from './message-prebooking.js';
import {queueNotification,queueBookingChange,emitNotification} from './email-notifications.js';
import {hasAssetPermission,assetPermission,conciergeBookingView} from './asset-delegation.js';
import {listingPublicationIssue} from './listing-billing.service.js';
import { CancellationService, cancellationLocked } from './cancellation.service.js';
import { updateExisting } from './existing-transaction.js';
import { reservationView, bookingPayments } from './reservation-compatibility.js';
import { initialWorkflow, advanceReservation } from './reservation-workflow.js';
import { findAsset, bookingIndexPaths } from './asset-paths.service.js';
import { Request, Response } from 'express';
import { z } from 'zod';
import { FirebaseService } from './firebase.service.js';
import { UtilsService } from './utils.service.js';

const genericSchema = z.object({ assetId:z.string().min(1), customerId:z.string().min(1), startAt:z.string().min(1), endAt:z.string().min(1), rentalAmount:z.number().nonnegative(), bookingDeposit:z.number().nonnegative().default(0), securityDeposit:z.number().nonnegative().default(0), currency:z.string().default('eur') });
const carSchema = z.object({
 prebookingThreadId:z.string().regex(/^[a-f0-9]{64}$/).optional(),
  assetId: z.string().min(1), customerId: z.string().min(1), startAt: z.string().min(1), endAt: z.string().min(1),
  customerName: z.string().min(1), customerEmail: z.string().email(), customerPhone: z.string().optional().default(''),
  pickupLocation: z.string().min(1), returnLocation: z.string().min(1), driverAge: z.number().int().min(18).max(100),
  licenseCountry: z.string().min(2).max(3), additionalDriver: z.boolean().default(false), childSeat: z.boolean().default(false), comments: z.string().optional().default('')
});


const resourceSchema = z.object({
 prebookingThreadId:z.string().regex(/^[a-f0-9]{64}$/).optional(),
  assetId:z.string().min(1), customerId:z.string().min(1), startAt:z.string().min(1), endAt:z.string().min(1),
  customerName:z.string().min(1), customerEmail:z.string().email(), customerPhone:z.string().optional().default(''),
  guests:z.number().int().min(1).optional().default(1), vehiclePlate:z.string().optional().default(''), comments:z.string().optional().default('')
});

function validBookingDates(startAt:string,endAt:string):boolean {
  // Require an ISO date/time with explicit timezone, avoiding server-local timezone ambiguity.
  const iso=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
  if(!iso.test(startAt)||!iso.test(endAt)) return false;
  const start=Date.parse(startAt),end=Date.parse(endAt);
  return Number.isFinite(start)&&Number.isFinite(end)&&end>start;
}

export class BookingsService {
  constructor(private readonly firebase: FirebaseService, private readonly utils = new UtilsService(), private readonly cancellations?:CancellationService) {}

  private async creationIdentity(req:Request,res:Response,asset:any,p:any):Promise<any> {
    const user=await this.authenticatedCustomer(req,res);if(!user)return null;
    const admin=String(req.query.admin||'')==='1';
    if(admin&&!await hasAssetPermission(this.firebase,user.uid,asset.assetType,asset.id||p.assetId,'bookings',user)){res.status(403).json({error:'owner_required'});return null;}
    if(!admin&&!user.email){res.status(403).json({error:'email_required'});return null;}
    let customerId=user.uid;
    if(admin){try{customerId=(await this.firebase.auth.getUserByEmail(p.customerEmail)).uid;}catch(e:any){if(e.code!=='auth/user-not-found')throw e;customerId='guest';}}
    return {customerId,customerEmail:admin?p.customerEmail:user.email,
      actorUid:admin?user.uid:null,actorClaims:admin?{uid:user.uid,admin:user.admin===true}:null,workflow:initialWorkflow(admin?'admin':'customer')};
  }
  private async bookingSite(req:Request,res:Response,asset:any,id:string):Promise<boolean>{
    const host=String(req.headers.host||''),portal=portalFor(host),type=String(asset.assetType);
    if(host.toLowerCase().split(':')[0]==='godirect.fr')return true;
    if(portal==='local'&&['localhost','127.0.0.1','alegriaboat.eu','www.alegriaboat.eu'].includes(host.toLowerCase().replace(/:\d+$/,'')))return true;
    if(portal==='asset'&&await matchesSite(this.firebase,host,type,id))return true;
    if(portal!=='asset'&&String(req.query.admin||'')==='1'){
      const token=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];
      if(token){try{const u=await this.firebase.auth.verifyIdToken(token);if(await hasAssetPermission(this.firebase,u.uid,type,id,'bookings',u))return true;}catch{}}
    }
    res.status(409).json({error:'booking_site_required',siteUrl:siteOrigin(asset,id)});return false;
  }
  // R17 canonical layout: bookings/{assetType}/{assetId}/{bookingId}.
  private bookingPath(type:string, assetId:string, id?:string):string {
    if (!['boat','car','parking','property','pool'].includes(type) || !/^[a-zA-Z0-9_-]+$/.test(assetId)) throw new Error('invalid_asset_scope');
    return ['bookings',type,assetId,id].filter(Boolean).join('/');
  }
  private async scopedBookings(assetId:string):Promise<any[]> {
    if(typeof assetId !== 'string' || !assetId) return [];
    const asset=await findAsset(this.firebase,assetId);
    if(!asset) return [];
    const path=this.bookingPath(String(asset.assetType),assetId);
    const snap=await this.firebase.db.ref(path).once('value');
    return Object.values(snap.val()||{});
  }
  private async bookingsForIndex(index:string,id:string):Promise<any[]> {
    const tree=(await this.firebase.db.ref(`${index}/${id}`).once('value')).val()||{};
    const pointers:string[]=[];
    const walk=(node:any)=>{if(typeof node==='string'){if(/^bookings\/(boat|car|parking|property|pool)\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(node))pointers.push(node);return;} if(node&&typeof node==='object')Object.values(node).forEach(walk);};
    walk(tree);
    const results=await Promise.all([...new Set(pointers)].map(async path=>(await this.firebase.db.ref(path).once('value')).val()));
    return results.filter(Boolean);
  }
  private async overlaps(assetId:string, startAt:string, endAt:string) {
    const existing = await this.scopedBookings(assetId);
    const start = new Date(startAt).getTime(), end = new Date(endAt).getTime();
    return existing.some((b:any) => !['cancelled','rejected'].includes(String(b.status||'').toLowerCase()) && new Date(b.startAt).getTime() < end && new Date(b.endAt).getTime() > start);
  }

  private async saveNewBooking(booking:any,actorUid?:string,actorClaims?:any,prebookingThreadId?:string):Promise<boolean>{
    const path=this.bookingPath(booking.assetType,booking.assetId,booking.id);
    const result=await this.firebase.db.ref().transaction((root:any)=>{
      if(root===null)return null;if(root.assets?.[booking.assetType]?.[booking.assetId]?.ownerId!==booking.ownerId||root.assets[booking.assetType][booking.assetId].deletedAt)return;if(actorUid&&!assetPermission(root,actorUid,booking.assetType,booking.assetId,'bookings',actorClaims))return;root.bookings??={};root.bookings[booking.assetType]??={};const rows=root.bookings[booking.assetType][booking.assetId]||{};
      const liveAsset=root.assets[booking.assetType][booking.assetId];if(blocked(liveAsset,booking.startAt,booking.endAt))return;
      const check=booking.assetType==='car'?this.carPrice(liveAsset,booking.startAt,booking.endAt,booking.extras?.additionalDriver,booking.extras?.childSeat):this.resourcePrice(liveAsset,booking.startAt,booking.endAt,booking.assetType);
      if(check.rentalAmount!==booking.rentalAmount||check.bookingDeposit!==booking.bookingDeposit||check.securityDeposit!==booking.securityDeposit)return;
      if(Object.values(rows).some((b:any)=>!['cancelled','rejected'].includes(b.status)&&Date.parse(b.startAt)<Date.parse(booking.endAt)&&Date.parse(b.endAt)>Date.parse(booking.startAt)))return;
      linkPrebooking(root,booking,prebookingThreadId);root.bookings[booking.assetType][booking.assetId]={...rows,[booking.id]:booking};if(actorUid){root.managementAudit??={};root.managementAudit['create_'+booking.id]={action:'booking.create',actorId:actorUid,ownerId:booking.ownerId,assetType:booking.assetType,assetId:booking.assetId,bookingId:booking.id,at:booking.createdAt};}if(!actorUid)queueMobileAlert(root,{kind:'booking',type:booking.assetType,assetId:booking.assetId,ownerId:booking.ownerId,reference:booking.id});queueNotification(root,{key:booking.id,kind:'booking.created',...(actorUid?{actorId:actorUid}:{}),type:booking.assetType,assetId:booking.assetId,ownerId:booking.ownerId,bookingId:booking.id,customerId:booking.customerId});return root;
    },undefined,false);
    if(!result.committed)return false;
    await this.firebase.db.ref().update(bookingIndexPaths(booking,path));
    return true;
  }
  private validatePrice(pricing:any):any {
    if(![pricing.rentalAmount,pricing.bookingDeposit,pricing.securityDeposit].every(v=>Number.isFinite(v)&&v>=0)||pricing.rentalAmount<=0||pricing.bookingDeposit>pricing.rentalAmount)throw Object.assign(new Error('invalid_asset_payment_policy'),{status:409});
    return pricing;
  }
  private carPrice(asset:any, startAt:string, endAt:string, additionalDriver=false, childSeat=false) {
    const start = new Date(startAt), end = new Date(endAt);
    const ms = end.getTime() - start.getTime();
    if (!Number.isFinite(ms) || ms <= 0) throw new Error('invalid_booking_dates');
    const quantity = Math.max(1, Math.ceil(ms / 86400000));
    const basePrice = Number(asset?.pricing?.basePrice || 0);
    const cfg = asset?.bookingConfig || {};
    const additionalDriverAmount = additionalDriver ? Number(cfg?.extras?.additionalDriver?.pricePerDay || 0) * quantity : 0;
    const childSeatAmount = childSeat ? Number(cfg?.extras?.childSeat?.pricePerBooking || 0) : 0;
    const extras = additionalDriverAmount + childSeatAmount;
    const baseAmount = periodTotal(asset,startAt,quantity,false);
    const rentalAmount = Math.round((baseAmount + extras) * 100) / 100;
    const dep = asset?.paymentPolicy?.bookingDeposit || {type:'fixed',value:0};
    const bookingDeposit = dep.type === 'percentage' ? Math.round(rentalAmount * Number(dep.value||0))/100 : Number(dep.value||0);
    return { quantity, pricingUnit: asset?.pricing?.pricingUnit || 'day', basePrice, baseAmount, additionalDriverAmount, childSeatAmount, extrasAmount:extras, rentalAmount, bookingDeposit, securityDeposit:Number(asset?.paymentPolicy?.securityDeposit?.value||0), currency:String(asset?.pricing?.currency||'EUR').toUpperCase() };
  }

  carQuote = async (req:Request,res:Response) => {
    const p = carSchema.omit({customerId:true,customerName:true,customerEmail:true,customerPhone:true,comments:true}).parse(req.body);
    if(!validBookingDates(p.startAt,p.endAt))return res.status(400).json({error:'invalid_booking_dates'});
    const asset=await findAsset(this.firebase,p.assetId,'car'); if(!asset) return res.status(404).json({error:'asset_not_found'}); if(String(asset.assetType)!=='car') return res.status(400).json({error:'asset_is_not_car'});
    if(!await this.bookingSite(req,res,asset,p.assetId))return;
    const publicationIssue=await listingPublicationIssue(this.firebase,String(asset.assetType),String(p.assetId),asset);if(publicationIssue)return res.status(publicationIssue==='listing_subscription_required'?402:409).json({error:publicationIssue});
    if(blocked(asset,p.startAt,p.endAt)||await this.overlaps(p.assetId,p.startAt,p.endAt)) return res.status(409).json({error:'asset_unavailable'});
    return res.json(this.carPrice(asset,p.startAt,p.endAt,p.additionalDriver,p.childSeat));
  };

  createCar = async (req:Request,res:Response) => {
    const p=carSchema.parse(req.body); const asset=await findAsset(this.firebase,p.assetId,'car');
    if(!asset||asset.assetType!=='car')return res.status(404).json({error:'asset_not_found'});
    if(!await this.bookingSite(req,res,asset,p.assetId))return;
    const publicationIssue=await listingPublicationIssue(this.firebase,String(asset.assetType),String(p.assetId),asset);if(publicationIssue)return res.status(publicationIssue==='listing_subscription_required'?402:409).json({error:publicationIssue});
    const identity=await this.creationIdentity(req,res,asset,p);if(!identity)return;
    const {customerId,customerEmail}=identity;
    if(!validBookingDates(p.startAt,p.endAt))return res.status(400).json({error:'invalid_booking_dates'});
    if(blocked(asset,p.startAt,p.endAt)||await this.overlaps(p.assetId,p.startAt,p.endAt)) return res.status(409).json({error:'asset_unavailable'});
    const pricing=this.validatePrice(this.carPrice(asset,p.startAt,p.endAt,p.additionalDriver,p.childSeat));
    const ref=this.firebase.db.ref(this.bookingPath('car',p.assetId)).push(), id=String(ref.key);
    const booking:any={id,assetId:p.assetId,assetType:'car',ownerId:String(asset.ownerId),customerId,startAt:p.startAt,endAt:p.endAt,customerName:p.customerName,customerEmail,customerPhone:p.customerPhone,rental:{pickupLocation:p.pickupLocation,returnLocation:p.returnLocation,driverAge:p.driverAge,licenseCountry:p.licenseCountry},extras:{additionalDriver:p.additionalDriver,childSeat:p.childSeat},comments:p.comments,pricing,rentalAmount:pricing.rentalAmount,bookingDeposit:pricing.bookingDeposit,securityDeposit:pricing.securityDeposit,currency:pricing.currency,balanceAmount:Math.max(0,pricing.rentalAmount-pricing.bookingDeposit),status:'pending',paymentStatus:'unpaid',createdAt:this.utils.nowIso()};
    const {actorUid,actorClaims,...customerIdentity}=identity;Object.assign(booking,advanceReservation({...booking,...customerIdentity}));
    if(!await this.saveNewBooking(booking,identity.actorUid,identity.actorClaims,p.prebookingThreadId))return res.status(409).json({error:'asset_unavailable'});
    return res.status(201).json(booking);
  };


  private resourcePrice(asset:any,startAt:string,endAt:string,type:'parking'|'property'|'pool'|'boat') {
    const start=new Date(startAt), end=new Date(endAt), ms=end.getTime()-start.getTime();
    if(!Number.isFinite(ms)||ms<=0) throw new Error('invalid_booking_dates');
    const unit=String(asset?.pricing?.pricingUnit||'day');
    const quantity=Math.max(1,Math.ceil(ms/(unit==='hour'?3600000:86400000)));
    const basePrice=Number(asset?.pricing?.basePrice||0), rentalAmount=periodTotal(asset,startAt,quantity,unit==='hour');
    const dep=asset?.paymentPolicy?.bookingDeposit||{type:'fixed',value:0};
    const bookingDeposit=dep.type==='percentage'?Math.round(rentalAmount*Number(dep.value||0))/100:Number(dep.value||0);
    return {quantity,pricingUnit:asset?.pricing?.pricingUnit||(type==='property'?'night':'day'),basePrice,extrasAmount:0,rentalAmount,bookingDeposit,securityDeposit:Number(asset?.paymentPolicy?.securityDeposit?.value||0),currency:String(asset?.pricing?.currency||'EUR').toUpperCase()};
  }

  resourceQuote = (type:'parking'|'property'|'pool'|'boat') => async (req:Request,res:Response) => {
    const p=resourceSchema.parse(req.body);
    if(!validBookingDates(p.startAt,p.endAt)) return res.status(400).json({error:'invalid_booking_dates'});
    const asset=await findAsset(this.firebase,p.assetId,type);
    if(!asset) return res.status(404).json({error:'asset_not_found'});
    if(!await this.bookingSite(req,res,asset,p.assetId))return;
    const publicationIssue=await listingPublicationIssue(this.firebase,String(asset.assetType),String(p.assetId),asset);if(publicationIssue)return res.status(publicationIssue==='listing_subscription_required'?402:409).json({error:publicationIssue});
    if(String(asset.assetType)!==type) return res.status(400).json({error:`asset_is_not_${type}`});
    if(type==='property' && Number(p.guests)>Number(asset?.properties?.guests||999)) return res.status(400).json({error:'too_many_guests'});
    if(blocked(asset,p.startAt,p.endAt)||await this.overlaps(p.assetId,p.startAt,p.endAt)) return res.status(409).json({error:'asset_unavailable'});
    return res.json(this.resourcePrice(asset,p.startAt,p.endAt,type));
  };

  createResource = (type:'parking'|'property'|'pool'|'boat') => async (req:Request,res:Response) => {
    const p=resourceSchema.parse(req.body);
    if(!validBookingDates(p.startAt,p.endAt)) return res.status(400).json({error:'invalid_booking_dates'});
    const asset=await findAsset(this.firebase,p.assetId,type);
    if(!asset) return res.status(404).json({error:'asset_not_found'});
    if(!await this.bookingSite(req,res,asset,p.assetId))return;
    const publicationIssue=await listingPublicationIssue(this.firebase,String(asset.assetType),String(p.assetId),asset);if(publicationIssue)return res.status(publicationIssue==='listing_subscription_required'?402:409).json({error:publicationIssue});
    if(String(asset.assetType)!==type) return res.status(400).json({error:`asset_is_not_${type}`});
    if(type==='property' && Number(p.guests)>Number(asset?.properties?.guests||999)) return res.status(400).json({error:'too_many_guests'});
    if(blocked(asset,p.startAt,p.endAt)||await this.overlaps(p.assetId,p.startAt,p.endAt)) return res.status(409).json({error:'asset_unavailable'});
    const identity=await this.creationIdentity(req,res,asset,p);if(!identity)return;
    const pricing=this.validatePrice(this.resourcePrice(asset,p.startAt,p.endAt,type)), ref=this.firebase.db.ref(this.bookingPath(type,p.assetId)).push(), id=String(ref.key);
    const booking:any={id,assetId:p.assetId,assetType:type,ownerId:String(asset.ownerId),customerId:identity.customerId,startAt:p.startAt,endAt:p.endAt,customerName:p.customerName,customerEmail:identity.customerEmail,customerPhone:p.customerPhone,comments:p.comments,pricing,rentalAmount:pricing.rentalAmount,bookingDeposit:pricing.bookingDeposit,securityDeposit:pricing.securityDeposit,currency:pricing.currency,balanceAmount:Math.max(0,pricing.rentalAmount-pricing.bookingDeposit),status:'pending',paymentStatus:'unpaid',createdAt:this.utils.nowIso()};
    if(type==='parking') booking.rental={vehiclePlate:p.vehiclePlate}; else booking.rental={guests:p.guests};
    const {actorUid,actorClaims,...customerIdentity}=identity;Object.assign(booking,advanceReservation({...booking,...customerIdentity}));
    if(!await this.saveNewBooking(booking,identity.actorUid,identity.actorClaims,p.prebookingThreadId))return res.status(409).json({error:'asset_unavailable'});
    return res.status(201).json(booking);
  };

  create = async(req:Request,res:Response)=>{
    const asset=await findAsset(this.firebase,String(req.body.assetId||''));
    if(!asset)return res.status(404).json({error:'asset_not_found'});
    if(!await this.bookingSite(req,res,asset,String(req.body.assetId)))return;
    const publicationIssue=await listingPublicationIssue(this.firebase,String(asset.assetType),String(req.body.assetId),asset);if(publicationIssue)return res.status(publicationIssue==='listing_subscription_required'?402:409).json({error:publicationIssue});
    if(asset.assetType==='car')return this.createCar(req,res);
    return this.createResource(asset.assetType)(req,res);
  };
  customerBookings=async(req:Request,res:Response)=>{return this.customerMyBookings(req,res);};
  ownerBookings=async(req:Request,res:Response)=>{const user=await this.authenticatedCustomer(req,res);if(!user)return;const id=String(req.params.ownerId);if(id!==user.uid)return res.status(403).json({error:'owner_required'});return res.json(await Promise.all((await this.bookingsForIndex('bookingsByOwner',id)).filter((b:any)=>b.ownerId===user.uid).map((b:any)=>reservationView(this.firebase,b))));};
  // R21: Firebase ID token is verified server-side. Never trust an ownerId from the request.
  private async ownedBooking(req:Request,res:Response):Promise<{asset:any;booking:any;path:string}|null> {
    res.setHeader('Cache-Control','no-store');
    const {type,assetId,bookingId}=req.params;
    if(typeof type!=='string'||!['boat','car','parking','property','pool'].includes(type)||
       typeof assetId!=='string'||typeof bookingId!=='string'||
       !/^[a-zA-Z0-9_-]+$/.test(assetId)||!/^[a-zA-Z0-9_-]+$/.test(bookingId)) {
      res.status(400).json({error:'invalid_booking_scope'});return null;
    }
    const match=/^Bearer (.+)$/i.exec(String(req.headers.authorization||''));
    if(!match){res.status(401).json({error:'authentication_required'});return null;}
    let uid:string;let actorClaims:any;
    try{actorClaims=await this.firebase.auth.verifyIdToken(match[1]);uid=actorClaims.uid;}
    catch{res.status(401).json({error:'invalid_authentication'});return null;}
    const asset=await findAsset(this.firebase,assetId,type);
    if(!asset||String(asset.assetType)!==type){res.status(404).json({error:'asset_not_found'});return null;}
    if(!await hasAssetPermission(this.firebase,uid,type,assetId,'bookings',actorClaims)){res.status(403).json({error:'not_asset_owner'});return null;}
    const path=this.bookingPath(type,assetId,bookingId);
    const booking=(await this.firebase.db.ref(path).once('value')).val();
    if(!booking||String(booking.assetId)!==assetId||String(booking.ownerId)!==String(asset.ownerId)){res.status(404).json({error:'booking_not_found'});return null;}
    return {asset,booking,path,actorId:uid,actorClaims} as any;
  }
  // R22.4: customer operations are bound to the verified Firebase identity.
  private async authenticatedCustomer(req:Request,res:Response):Promise<{uid:string;email:string;admin:boolean}|null> {
    const match=/^Bearer (.+)$/i.exec(String(req.headers.authorization||''));
    if(!match){res.status(401).json({error:'authentication_required'});return null;}
    try{
      const claims:any=await this.firebase.auth.verifyIdToken(match[1]);
      return {uid:String(claims.uid),email:String(claims.email||'').trim().toLowerCase(),admin:claims.admin===true||claims.role==='admin'};
    } catch { res.status(401).json({error:'invalid_authentication'});return null; }
  }

  // Safely adopt legacy guest bookings when their e-mail exactly matches the verified
  // Firebase e-mail. This repairs old R22 bookings without exposing bookings by e-mail alone.
  private async claimLegacyGuestBookings(uid:string,email:string):Promise<void> {
    if(!email)return;
    const root=(await this.firebase.db.ref('bookings').once('value')).val()||{};
    const updates:Record<string,unknown>={};
    for(const type of ['boat','car','parking','property','pool']) {
      const byAsset=root?.[type]||{};
      for(const [assetId,node] of Object.entries(byAsset) as [string,any][]) {
        for(const [bookingId,booking] of Object.entries(node||{}) as [string,any][]) {
          if(!booking||String(booking.customerId)!=='guest')continue;
          if(String(booking.customerEmail||'').trim().toLowerCase()!==email)continue;
          const path=this.bookingPath(type,assetId,bookingId);
          updates[`${path}/customerId`]=uid;
          updates[`bookingsByCustomer/${uid}/${type}/${bookingId}`]=path;
          updates[`bookingsByCustomer/guest/${type}/${bookingId}`]=null;
        }
      }
    }
    if(Object.keys(updates).length)await this.firebase.db.ref().update(updates);
  }

  rentedAssets=async(req:Request,res:Response)=>{
    const u=await this.authenticatedCustomer(req,res);if(!u)return;
    if(!['godirect.fr','client.godirect.fr','localhost','127.0.0.1'].includes(String(req.headers.host||'').toLowerCase().split(':')[0]))return res.sendStatus(404);
    res.setHeader('Cache-Control','private, no-store');
    await this.claimLegacyGuestBookings(u.uid,u.email);
    const rows=await this.bookingsForIndex('bookingsByCustomer',u.uid), out=new Map<string,any>();
    for(const b of rows){if(b.customerId!==u.uid||!(b.status==='completed'||b.status==='confirmed'&&Date.parse(b.endAt)<=Date.now()))continue;
      const key=b.assetType+'/'+b.assetId;if(out.has(key)){out.get(key).stays.push({startAt:b.startAt||null,endAt:b.endAt||null});continue;}
      const a=(await this.firebase.db.ref('assets/'+key).once('value')).val();const candidate=a&&!a.deletedAt?siteOrigin({...a,assetType:b.assetType},b.assetId):null;const valid=candidate&&await matchesSite(this.firebase,new URL(candidate).hostname,b.assetType,b.assetId);out.set(key,{name:a?.name||b.assetName||b.assetId,origin:valid?candidate:null,stays:[{startAt:b.startAt||null,endAt:b.endAt||null}]});}
    return res.json([...out.values()]);};
  customerMyBookings=async(req:Request,res:Response)=>{
    const customer=await this.authenticatedCustomer(req,res);if(!customer)return;
    await this.claimLegacyGuestBookings(customer.uid,customer.email);
    res.setHeader('Cache-Control','private, no-store');
    let bookings=await this.bookingsForIndex('bookingsByCustomer',customer.uid);
    bookings=bookings.filter(await customerScopeFilter(this.firebase,String(req.headers.host||''),customer.uid,req.query.preview==='owner'));
    // Never trust the index alone: stale or forged pointers must not expose other customers.
    return res.json(await Promise.all(bookings.filter((b:any)=>String(b.customerId)===customer.uid).map((b:any)=>reservationView(this.firebase,b))));
  };
  customerMyBooking=async(req:Request,res:Response)=>{
    const customer=await this.authenticatedCustomer(req,res);if(!customer)return; const uid=customer.uid;
    const {type,assetId,bookingId}=req.params;
    if(typeof type!=='string'||!['boat','car','parking','property','pool'].includes(type)||
       typeof assetId!=='string'||typeof bookingId!=='string'||
       !/^[a-zA-Z0-9_-]+$/.test(assetId)||!/^[a-zA-Z0-9_-]+$/.test(bookingId))return res.status(400).json({error:'invalid_booking_scope'});
    if(!await matchesSite(this.firebase,String(req.headers.host||''),type,assetId))return res.status(404).json({error:'booking_not_found'});
    const booking=(await this.firebase.db.ref(this.bookingPath(type,assetId,bookingId)).once('value')).val();
    if(!booking||String(booking.customerId)!==uid)return res.status(404).json({error:'booking_not_found'});
    return res.json(await reservationView(this.firebase,booking));
  };
  customerCancelRequest=async(req:Request,res:Response)=>{
    const customer=await this.authenticatedCustomer(req,res);if(!customer)return; const uid=customer.uid;
    const {type,assetId,bookingId}=req.params;
    if(typeof type!=='string'||!['boat','car','parking','property','pool'].includes(type)||
       typeof assetId!=='string'||typeof bookingId!=='string'||
       !/^[a-zA-Z0-9_-]+$/.test(assetId)||!/^[a-zA-Z0-9_-]+$/.test(bookingId))return res.status(400).json({error:'invalid_booking_scope'});
    const ref=this.firebase.db.ref(this.bookingPath(type,assetId,bookingId));
    let forbidden=false,invalid=false;
    const result=await updateExisting(ref,(current:any)=>{
      if(!current||String(current.customerId)!==uid){forbidden=true;return;}
      if(cancellationLocked(current)){invalid=true;return;}
      if(['cancelled','rejected','completed'].includes(String(current.status||'').toLowerCase())){invalid=true;return;}
      return {...current,cancellationRequestedAt:new Date().toISOString(),cancellationRequestedBy:uid,cancellationRequestStatus:'pending'};
    });
    if(result.missing)return res.status(404).json({error:'booking_not_found'});
    if(forbidden)return res.status(404).json({error:'booking_not_found'});
    if(invalid)return res.status(409).json({error:'booking_not_cancellable'});
    if(!result.committed)return res.status(409).json({error:'booking_changed_retry'});
    const b=result.snapshot.val();await emitNotification(this.firebase,{key:b.id+'|cancellation_requested',kind:'booking.cancellation_requested',type,assetId,ownerId:b.ownerId,bookingId:b.id,customerId:b.customerId});return res.json({ok:true,status:'cancellation_requested'});
  };
  adminBookingGet=async(req:Request,res:Response)=>{
    const scoped=await this.ownedBooking(req,res);if(!scoped)return;
    return res.json((scoped as any).actorId===scoped.booking.ownerId?await reservationView(this.firebase,scoped.booking):conciergeBookingView(await reservationView(this.firebase,scoped.booking)));
  };
  customerBookingPatch=async(req:Request,res:Response)=>this.editReservation(req,res,false);
  adminBookingPatch=async(req:Request,res:Response)=>this.editReservation(req,res,true);

  private async editReservation(req:Request,res:Response,admin:boolean){
    let scoped:any;let uid='';
    if(admin){scoped=await this.ownedBooking(req,res);if(!scoped)return;uid=String(scoped.actorId);}
    else{
      const user=await this.authenticatedCustomer(req,res);if(!user)return;uid=user.uid;
      const {type,assetId,bookingId}=req.params;
      if(!['boat','car','parking','property','pool'].includes(String(type))||!/^[a-zA-Z0-9_-]+$/.test(String(assetId))||!/^[a-zA-Z0-9_-]+$/.test(String(bookingId)))return res.status(400).json({error:'invalid_booking_scope'});
      const path=this.bookingPath(String(type),String(assetId),String(bookingId));
      const booking=(await this.firebase.db.ref(path).once('value')).val();
      if(!booking||booking.customerId!==uid)return res.status(404).json({error:'booking_not_found'});
      const asset=await findAsset(this.firebase,String(assetId),String(type));
      if(!asset)return res.status(404).json({error:'asset_not_found'});
      scoped={asset,booking,path};
    }
    const common={customerName:z.string().min(1).max(200).optional(),customerPhone:z.string().max(80).optional(),comments:z.string().max(4000).optional(),
      startAt:z.string().optional(),endAt:z.string().optional(),additionalDriver:z.boolean().optional(),childSeat:z.boolean().optional(),
      pickupLocation:z.string().max(200).optional(),returnLocation:z.string().max(200).optional(),driverAge:z.number().int().min(18).max(100).optional(),licenseCountry:z.string().min(2).max(3).optional(),guests:z.number().int().min(1).optional(),vehiclePlate:z.string().max(80).optional()};
    const schema=admin?z.object({...common,customerEmail:z.string().email().optional(),status:z.enum(['pending','confirmed','cancelled']).optional(),rentalAmount:z.number().positive().optional(),bookingDeposit:z.number().nonnegative().optional(),securityDeposit:z.number().nonnegative().optional()}).strict():z.object(common).strict();
    const parsed=schema.safeParse(req.body);
    if(!parsed.success)return res.status(400).json({error:'invalid_booking_changes',details:parsed.error.issues});
    const p:any=parsed.data,old=scoped.booking,type=String(old.assetType);
    if(admin&&p.status==='cancelled')return res.status(409).json({error:'use_refund_cancellation_action'});
    if(cancellationLocked(old))return res.status(409).json({error:'cancellation_in_progress'});
    const expected=String(req.headers['if-match']||'');
    if(!expected)return res.status(428).json({error:'revision_required'});
    const startAt=p.startAt??old.startAt,endAt=p.endAt??old.endAt;
    if(!Number.isFinite(Date.parse(startAt))||!Number.isFinite(Date.parse(endAt))||Date.parse(endAt)<=Date.parse(startAt))return res.status(400).json({error:'invalid_booking_dates'});
    const datesChanged=Date.parse(startAt)!==Date.parse(old.startAt)||Date.parse(endAt)!==Date.parse(old.endAt);
    if(datesChanged&&!validBookingDates(startAt,endAt))return res.status(400).json({error:'invalid_booking_dates'});
    const carFields=['additionalDriver','childSeat','pickupLocation','returnLocation','driverAge','licenseCountry'];
    if(type!=='car'&&carFields.some(k=>p[k]!==undefined))return res.status(400).json({error:'car_only_fields'});
    if(p.guests!==undefined&&type==='car')return res.status(400).json({error:'invalid_resource_fields'});
    const capacity=Number(scoped.asset?.properties?.guests||scoped.asset?.pool?.capacity||scoped.asset?.capacity||999);
    if(p.guests!==undefined&&p.guests>capacity)return res.status(400).json({error:'too_many_guests'});
    const extras={...(old.extras||{}),additionalDriver:p.additionalDriver??old.extras?.additionalDriver??false,childSeat:p.childSeat??old.extras?.childSeat??false};
    const extrasChanged=type==='car'&&(extras.additionalDriver!==!!old.extras?.additionalDriver||extras.childSeat!==!!old.extras?.childSeat);
    const moneyChanged=['rentalAmount','bookingDeposit','securityDeposit'].some(k=>p[k]!==undefined&&Number(p[k])!==Number(old[k]));
    const priceChanged=datesChanged||extrasChanged||moneyChanged;
    const ledger=priceChanged?await bookingPayments(this.firebase,String(old.id)):[];
    const view=await reservationView(this.firebase,old);
    const changes:any={};
    for(const key of ['customerName','customerPhone','comments',...(admin?['customerEmail']:[])])if(p[key]!==undefined)changes[key]=p[key];
    if(datesChanged){changes.startAt=startAt;changes.endAt=endAt;}
    const rental={...(old.rental||{})};
    for(const key of ['pickupLocation','returnLocation','driverAge','licenseCountry','guests','vehiclePlate'])if(p[key]!==undefined)rental[key]=p[key];
    if(Object.keys(rental).length)changes.rental=rental;
    if(type==='car')changes.extras=extras;
    if(priceChanged){
      if(['cancelled','rejected','completed'].includes(old.status))return res.status(409).json({error:'booking_closed'});
      if(old.paymentCheckoutStartedAt||ledger.length||view.financialReviewRequired||view.workflow?.depositPaid||view.workflow?.warrantyProvided||view.workflow?.balancePaid)return res.status(409).json({error:'financial_changes_locked'});
      let pricing=datesChanged||extrasChanged?(type==='car'?this.carPrice(scoped.asset,startAt,endAt,extras.additionalDriver,extras.childSeat):this.resourcePrice(scoped.asset,startAt,endAt,type as any)):{...(old.pricing||{}),rentalAmount:Number(old.rentalAmount),bookingDeposit:Number(old.bookingDeposit),securityDeposit:Number(old.securityDeposit)};
      for(const key of ['rentalAmount','bookingDeposit','securityDeposit'])if(p[key]!==undefined)pricing[key]=p[key];
      pricing=this.validatePrice(pricing);
      Object.assign(changes,{pricing,rentalAmount:pricing.rentalAmount,bookingDeposit:pricing.bookingDeposit,securityDeposit:pricing.securityDeposit,balanceAmount:Math.round(Math.max(0,pricing.rentalAmount-pricing.bookingDeposit)*100)/100});
    }
    let failure='booking_changed_reload_required';
    const parent=this.bookingPath(type,String(old.assetId));
    const result=await updateExisting(this.firebase.db.ref(),(root:any)=>{
      if(admin&&(!assetPermission(root,uid,type,String(old.assetId),'bookings',scoped.actorClaims)||root.assets?.[type]?.[String(old.assetId)]?.ownerId!==old.ownerId)){failure='not_asset_owner';return;}const rows=root?.bookings?.[type]?.[String(old.assetId)];
      failure='booking_changed_reload_required';
      if(datesChanged&&blocked(root.assets?.[type]?.[old.assetId],startAt,endAt)){failure='asset_unavailable';return;}
      const current=rows?.[old.id];
      if(cancellationLocked(current)){failure='cancellation_in_progress';return;}
      if(!current||String(current.updatedAt||current.createdAt||'')!==expected||(admin?current.ownerId!==scoped.asset.ownerId:current.customerId!==uid))return;
      if(!admin&&['cancelled','rejected','completed'].includes(current.status)){failure='booking_closed';return;}
      if(priceChanged&&current.paymentCheckoutStartedAt){failure='financial_changes_locked';return;}
      if(datesChanged&&Object.values(rows).some((b:any)=>b.id!==old.id&&!['cancelled','rejected'].includes(b.status)&&Date.parse(b.startAt)<Date.parse(endAt)&&Date.parse(b.endAt)>Date.parse(startAt))){failure='asset_unavailable';return;}
      let next:any={...current,...changes,updatedAt:new Date(Math.max(Date.now(),Date.parse(current.updatedAt||current.createdAt||'')+1||0)).toISOString()};
      if(!view.financialReviewRequired)next.workflow={...(current.workflow?.version===25?current.workflow:view.workflow)};
      if(next.workflow?.version===25){
        if(datesChanged&&next.workflow.origin==='customer')next.workflow={...next.workflow,adminApproved:false};
        if(admin&&p.status==='confirmed')next.workflow={...next.workflow,adminApproved:true,approvedAt:this.utils.nowIso()};
        if(admin&&p.status==='pending')next.workflow={...next.workflow,adminApproved:next.workflow.origin==='admin'};
        next=advanceReservation(next);
      }
      queueBookingChange(root,current,next);
      if(Object.keys(changes).some(key=>JSON.stringify(current[key])!==JSON.stringify(next[key])))queueNotification(root,{key:next.id+'|'+next.updatedAt,kind:'booking.updated',type:String(type),assetId:String(old.assetId),bookingId:next.id,ownerId:next.ownerId,customerId:next.customerId,actorId:uid});
      root.bookings[type][String(old.assetId)]={...rows,[old.id]:next};root.managementAudit??={};root.managementAudit['edit_'+old.id+'_'+Date.parse(next.updatedAt)]={actorId:uid,ownerId:current.ownerId,assetType:type,assetId:old.assetId,bookingId:old.id,action:'booking.edit',at:next.updatedAt};return root;
    });
    if(result.missing)return res.status(404).json({error:'booking_not_found'});
    if(!result.committed)return res.status(409).json({error:failure});
    const updated=await reservationView(this.firebase,result.snapshot.val()?.bookings?.[type]?.[String(old.assetId)]?.[old.id]);return res.json(admin&&uid!==old.ownerId?conciergeBookingView(updated):updated);
  }
  adminBookingDelete=async(req:Request,res:Response)=>this.cancelReservation(req,res,true);
  adminCancellationReconcile=async(req:Request,res:Response)=>this.cancelReservation(req,res,false);
  private async cancelReservation(req:Request,res:Response,initiate:boolean){
    const scoped=await this.ownedBooking(req,res);if(!scoped)return;
    if((scoped as any).actorId!==scoped.booking.ownerId)return res.status(403).json({error:'financial_owner_required'});
    if(!this.cancellations)return res.status(503).json({error:'cancellation_service_unavailable'});
    const booking=await this.cancellations.run(scoped.path,String(scoped.booking.ownerId),initiate);
    return res.status(booking.status==='cancelled'?200:202).json(await reservationView(this.firebase,booking));
  }
  assetBookings=async(req:Request,res:Response)=>{
    const {type,assetId}=req.params;
    if(typeof type !== 'string' || !['boat','car','parking','property','pool'].includes(type)) return res.status(400).json({error:'invalid_asset_type'});
    if(typeof assetId !== 'string' || !assetId) return res.status(400).json({error:'invalid_asset_id'});
    const asset=await findAsset(this.firebase,assetId);
    if(!asset || asset.assetType!==type) return res.status(404).json({error:'asset_not_found'});
    // Production MUST authenticate and authorize the owner before exposing customer PII.
    // Refuse access until a verified authorization layer is wired to this endpoint.
    return res.status(403).json({error:'owner_auth_required'});
  };
}
