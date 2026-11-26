import {blocked} from './calendar-rates.js';
import {domainScope,matchesSite,siteOrigin} from './portal-sites.js';
import {AssetCalendarService} from './asset-calendar.js';
import {hasAssetPermission} from './asset-delegation.js';
import { domainAssetId } from './asset-domain.js';
import {platformAdministrator} from './account-access.service.js';
import {parseAssetSearch,locationMatches,overlapsSearch,legacySearchInterval} from './asset-search.service.js';
import {listingPublic} from './listing-billing.service.js';
import { findAsset, isAssetType } from './asset-paths.service.js';
import { Request, Response } from 'express';
import { FirebaseService } from './firebase.service.js';
import { Asset } from '../models/domain.models.js';

export function publicAsset(a:any):any{if(!a)return a;const raw=a.location;const location=raw&&typeof raw==='object'?Object.fromEntries(['city','area','region','country'].filter(k=>typeof raw[k]==='string').map(k=>[k,raw[k]])):{};return {...a,location,siteUrl:siteOrigin(a,String(a.id||''))};}
export class AssetsService {
  readonly calendar:AssetCalendarService;
  constructor(private readonly firebase: FirebaseService) {this.calendar=new AssetCalendarService(firebase);}
  private async accessible(req:Request,a:any,id:string):Promise<boolean>{
    if(!a||!await matchesSite(this.firebase,String(req.headers.host||''),String(a.assetType||a.type),id))return false;
    if(!a.deletedAt&&await listingPublic(this.firebase,a?.assetType||a?.type,id,a))return true;
    const token=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];if(!token)return false;
    try{const u=await this.firebase.auth.verifyIdToken(token);if(a.deletedAt){const p=(await this.firebase.db.ref(`backendusers/${u.uid}`).once('value')).val()||{};return platformAdministrator(u,p);}if(u.uid===a.ownerId)return true;for(const permission of ['content','bookings','customers','payments'] as const)if(await hasAssetPermission(this.firebase,u.uid,String(a.assetType||a.type),id,permission))return true;const p=(await this.firebase.db.ref(`backendusers/${u.uid}`).once('value')).val()||{};return platformAdministrator(u,p);}catch{return false;}
  }
  listingContent = async (req:Request,res:Response) => {
    const type=String(req.params.type), id=String(req.params.id);
    res.setHeader('Cache-Control','no-store');
    if(!isAssetType(type)||!/^[a-zA-Z0-9_-]{1,80}$/.test(id))return res.status(404).json({error:'asset_not_found'});
    const asset=(await this.firebase.db.ref(`assets/${type}/${id}`).once('value')).val();
    if(!asset||asset.deletedAt||!await matchesSite(this.firebase,String(req.headers.host||''),type,id)||!await listingPublic(this.firebase,type,id,asset))return res.status(404).json({error:'asset_not_found'});
    const cms=(await this.firebase.db.ref(`siteContent/${type}/${id}`).once('value')).val()||{};
    const result:Record<string,any>={};
    for(const lang of ['fr','en','es','it','de','nl','ru']){
      if(!cms[lang])continue;
      result[lang]=Object.fromEntries(['homePage','outingsPage','outings','brand','brandTagline','boatPage','boatHighlights','boatHeroImage','boatPhotosConfigured','galleryImages','contactPage','contactInfo','phoneDisplay','phoneRaw'].filter(key=>Object.prototype.hasOwnProperty.call(cms[lang],key)).map(key=>[key,cms[lang][key]]));
    }
    return res.json(result);
  };
  resolveDomain = async (req:Request,res:Response) => {
    res.setHeader('Cache-Control','no-store');
    const scope=await domainScope(this.firebase,String(req.headers.host||''));
    return scope?res.json(scope):res.status(404).json({error:'asset_domain_not_found'});
  };
  list = async (req: Request, res: Response) => {
    const snap = await this.firebase.db.ref('assets').once('value');
    let rows = Object.entries(snap.val() || {}).filter(([t])=>isAssetType(t)).flatMap(([t,group]:any) => Object.entries(group || {}).map(([id, value]) => ({ ...(value as object), id, assetType:t }))) as Asset[];
    const scope=domainAssetId(String(req.headers.host||''))?await domainScope(this.firebase,String(req.headers.host||'')):null;
    if(domainAssetId(String(req.headers.host||'')))rows=rows.filter(a=>scope?.assetType===a.assetType&&scope?.assetId===a.id);
    if(req.query.preview==='owner'){
      const token=/^Bearer\s+(.+)$/i.exec(String(req.headers.authorization||''))?.[1];
      if(!token)return res.status(401).json({error:'authentication_required'});
      let uid:string;try{uid=(await this.firebase.auth.verifyIdToken(token)).uid;}catch{return res.status(401).json({error:'authentication_required'});}
      rows=rows.filter((a:any)=>a.ownerId===uid);
      res.setHeader('Cache-Control','private, no-store');
    }
    const filter=parseAssetSearch(req.query);
    if(filter.type)rows=rows.filter(a=>a.assetType===filter.type);
    rows=rows.filter(a=>locationMatches(a,filter.location));
    rows=(await Promise.all(rows.map(async a=>await listingPublic(this.firebase,a.assetType,String(a.id),a)?a:null))).filter(Boolean) as Asset[];
    if(filter.startAt){
      const legacy=rows.some(a=>a.assetType==='boat')?(await this.firebase.db.ref('bnBookings').once('value')).val()||{}:{};
      rows=(await Promise.all(rows.map(async a=>{
        const bookings=(await this.firebase.db.ref(`bookings/${a.assetType}/${a.id}`).once('value')).val()||{};
        const old=a.assetType==='boat'?Object.values(legacy).filter((b:any)=>!!b&&String(b.assetId||b.boatId||'alegria')===String(a.id)&&(!b.assetType||b.assetType==='boat')).map(legacySearchInterval):[];
        return blocked(a,filter.startAt!,filter.endAt!)||[...Object.values(bookings),...old].some(b=>overlapsSearch(b,filter.startAt,filter.endAt))?null:a;
      }))).filter(Boolean) as Asset[];
    }
    return res.json(rows.map(publicAsset));
  };
  get = async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const asset = await findAsset(this.firebase,id);
    return asset && await this.accessible(req,asset,id) ? res.json(publicAsset({ id, ...asset })) : res.status(404).json({ error: 'asset_not_found' });
  };
  assetTypes = async (_req: Request, res: Response) => {
    const snap = await this.firebase.db.ref('assetTypes').once('value');
    return res.json(snap.val() || {});
  };
  faqs = async (req: Request, res: Response) => {
    const assetId = String(req.params.assetId);
    const asset = await findAsset(this.firebase,assetId);
    if(!asset||!await this.accessible(req,asset,assetId))return res.status(404).json({error:'asset_not_found'});
    const snap=await this.firebase.db.ref(`faqs/${asset.assetType}/${assetId}`).once('value');
    return res.json(Object.values(snap.val()||{}));
  };
  listByType = async (req: Request, res: Response) => {
    const type = String(req.params.type || '').toLowerCase();
    const snap = await this.firebase.db.ref(`assets/${type}`).once('value');
    let rows = Object.entries(snap.val() || {})
      .map(([id, value]) => ({ ...(value as object), id, assetType:type }) as Asset)
      .filter((a) => String(a.assetType || (a as any).type || '').toLowerCase() === type)
      .filter((a) => a.enabled !== false && a.published !== false && a.status !== 'disabled');
    if(domainAssetId(String(req.headers.host||''))){const scope=await domainScope(this.firebase,String(req.headers.host||''));rows=rows.filter(a=>scope?.assetType===type&&scope?.assetId===a.id);}
    rows = (await Promise.all(rows.map(async a=>(await listingPublic(this.firebase,type,String(a.id),a))?a:null))).filter(Boolean) as Asset[];
    return res.json(rows.map(publicAsset));
  };
  getByScope = async (req: Request, res: Response) => {
    const type = String(req.params.type || '').toLowerCase();
    const id = String(req.params.id || '');
    const asset = await findAsset(this.firebase,id,type);
    if (!asset || !await this.accessible(req,asset,id)) return res.status(404).json({ error: 'asset_not_found' });
    if (String(asset.assetType || asset.type || '').toLowerCase() !== type) return res.status(404).json({ error: 'asset_not_found' });
    return res.json(publicAsset({ id, ...asset }));
  };
  outingsByScope = async (req: Request, res: Response) => {
    const type = String(req.params.type || '').toLowerCase();
    const id = String(req.params.id || '');
    const asset=await findAsset(this.firebase,id,type);if(!asset||!await this.accessible(req,asset,id))return res.status(404).json({error:'asset_not_found'});
    const snap = await this.firebase.db.ref(`bnOutings/${type}/${id}`).once('value');
    return res.json(snap.val() || {});
  };

}
