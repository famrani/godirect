import {createHash} from 'node:crypto';
import {mediaObjectPath} from './media-routes.js';
const dirs:Record<string,string>={boat:'boats',car:'cars',property:'lodging',parking:'parkings',pool:'pools'};
/** Runs inside the owner-authorized listing transaction. Keeps legacy existing paths. */
export function applyListingPhotos(root:any,type:string,id:string,paths:string[]):void{
 const asset=root.assets[type][id];
 const existing=new Set<string>([asset.media?.hero,asset.media?.cover,...(type==='boat'?[root.siteContent?.boat?.[id]?.fr?.boatHeroImage]:[]),...(Array.isArray(asset.media?.gallery)?asset.media.gallery:[]),...(type==='boat'?(root.siteContent?.boat?.[id]?.fr?.galleryImages||[]):[])].filter(v=>typeof v==='string'));
 const gallery=[...new Set(paths.map(raw=>{
  if(existing.has(raw))return raw;
  const path=mediaObjectPath(raw);
  if(!path||!dirs[type]||!path.startsWith(`assets/${dirs[type]}/${id}/`))throw Object.assign(new Error('invalid_photo_scope'),{status:400});
  return path;
 }))];
 const cover=gallery[0]||null;
 asset.media={...(asset.media||{}),configured:true,hero:cover,cover,gallery};
 root.resources??={};root.resources[type]??={};root.resources[type][id]={...(root.resources[type][id]||{}),coverImage:cover};
 if(type==='boat'){
  root.siteContent??={};root.siteContent.boat??={};root.siteContent.boat[id]??={};
  for(const lang of ['fr','en','es','it','de','nl','ru']){
   const content=root.siteContent.boat[id][lang]??={};content.boatPhotosConfigured=true;content.boatHeroImage=cover||'';content.galleryImages=[...gallery];
  }
  asset.siteContentRevision=createHash('sha256').update(JSON.stringify(root.siteContent.boat[id])).digest('hex');
 }
}
