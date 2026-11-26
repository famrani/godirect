import {ASSET_TYPES} from './asset-paths.service.js';
const RESERVED=new Set(['www','client','admin','api','mail','smtp','ftp','localhost','account','owner','platform','concierge','godirect','support','billing','assets','static','status','help','autoconfig','autodiscover']);
export function normalizePrefix(value:string):string{return String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,63).replace(/-$/,'');}
export function validPrefix(value:string):boolean{return /^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(value)&&(value.match(/[a-z]/g)||[]).length>=6&&!RESERVED.has(value);}
// Include legacy routing IDs and stored aliases, including archived assets: never recycle their addresses.
export interface PrefixScope {assetType:string;assetId:string;}
export function prefixTaken(root:any,prefix:string,scope?:PrefixScope):boolean{
 if(RESERVED.has(prefix))return true;
 const alias=root?.assetPrefixes?.[prefix];if(alias&&(!scope||alias.assetType!==scope.assetType||alias.assetId!==scope.assetId))return true;
 for(const t of ASSET_TYPES){for(const [id,a] of Object.entries<any>(root?.assets?.[t]||{}))if((id.toLowerCase()===prefix||String(a?.prefix||'').toLowerCase()===prefix)&&(!scope||scope.assetType!==t||scope.assetId!==id))return true;
 for(const branch of ['bnFleet','resources'])for(const id of Object.keys(root?.[branch]?.[t]||{}))if(id.toLowerCase()===prefix&&(!scope||scope.assetType!==t||scope.assetId!==id))return true;}
 return false;
}
export function prefixSuggestions(root:any,query:string,scope?:PrefixScope):string[]{
 const base=normalizePrefix(query);if((base.match(/[a-z]/g)||[]).length<6)return [];
 const out:string[]=[];for(let i=0;i<200&&out.length<5;i++){const candidate=i===0?base:base.slice(0,58).replace(/-$/,'')+'-'+(i+1);if(validPrefix(candidate)&&!prefixTaken(root,candidate,scope))out.push(candidate);}return out;
}
export function applyPrefixChange(root:any,prefix:string,assetType:string,assetId:string,ownerId:string):boolean{
 const asset=root?.assets?.[assetType]?.[assetId],scope={assetType,assetId};
 if(asset?.prefix&&prefix!==asset.prefix)return false;
 if(!asset||asset.ownerId!==ownerId||asset.deletedAt||!validPrefix(prefix)||prefixTaken(root,prefix,scope))return false;
 root.assetPrefixes??={};const old=asset.prefix;
 // Preserve previous addresses; never hand a former URL to another owner's listing.
 if(old&&old!==prefix&&!prefixTaken(root,old,scope))root.assetPrefixes[old]={assetType,assetId,ownerId};
 asset.prefix=prefix;root.assetPrefixes[prefix]={assetType,assetId,ownerId};return true;
}
export function ownerSitePrefix(root:any,uid:string):string {
 const rows=ASSET_TYPES.flatMap(t=>Object.entries<any>(root?.assets?.[t]||{}).map(([id,a])=>({...a,id,t}))).filter(a=>a.ownerId===uid&&validPrefix(a.prefix||'')).sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||''))||a.id.localeCompare(b.id));
 const saved=root?.owners?.[uid]?.sitePrefix;
 return (validPrefix(saved||'')&&root?.assetPrefixes?.[saved]?.ownerId===uid?saved:rows.find(a=>!prefixTaken(root,a.prefix,{assetType:a.t,assetId:a.id})||root?.assetPrefixes?.[a.prefix]?.ownerId===uid)?.prefix)||'';
}
export function applyCreation(root:any,updates:Record<string,any>,prefix:string,assetType:string,assetId:string,ownerId:string):any{
 if(!root)return;
 const existing=ownerSitePrefix(root,ownerId);
 if(existing)prefix=existing;else if(prefixTaken(root,prefix))return;
 if(!validPrefix(prefix))return;
 for(const [path,value] of Object.entries(updates)){const parts=path.split('/');let node=root;for(const part of parts.slice(0,-1))node=node[part]??={};node[parts[parts.length-1]]=value;}
 root.assets[assetType][assetId].prefix=prefix;
 root.owners??={};root.owners[ownerId]??={};root.owners[ownerId].sitePrefix=prefix;
 root.assetPrefixes??={};root.assetPrefixes[prefix]??={assetType,assetId,ownerId};return root;
}
