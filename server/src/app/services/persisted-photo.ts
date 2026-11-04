import {mediaObjectPath} from './media-routes.js';
const languages=['fr','en','es','it','de','nl','ru'];
const dirs:Record<string,string>={boat:'boats',car:'cars',property:'lodging',parking:'parkings',pool:'pools'};
const fail=(message:string)=>Object.assign(new Error(message),{status:400});
export function photoUpdate(input:any,type:string,id:string):{kind:string,path:string,slug?:string}{
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['kind','path','slug'].includes(k)))throw fail('invalid_photo');
 const path=mediaObjectPath(input.path),kind=String(input.kind||'');
 if(!path||!dirs[type]||!path.startsWith(`assets/${dirs[type]}/${id}/`))throw fail('invalid_photo_scope');
 if(!['cover','gallery','outing-cover','outing-gallery'].includes(kind)||type!=='boat'&&kind.startsWith('outing-'))throw fail('invalid_photo_kind');
 const slug=String(input.slug||'');
 if(kind.startsWith('outing-')&&!/^[a-zA-Z0-9_-]{1,80}$/.test(slug))throw fail('invalid_outing');
 return {kind,path,...(slug?{slug}:{})};
}
function append(values:any,path:string):string[]{return [...new Set<string>([...(Array.isArray(values)?values:[]),path])];}
/** Called inside the existing authorized CMS transaction; touches only photo fields. */
export function persistPhoto(root:any,type:string,id:string,photo:ReturnType<typeof photoUpdate>):void{
 const asset=root.assets[type][id];
 if(photo.kind.startsWith('outing-')){
  const record=root.bnOutings?.boat?.[id]?.[photo.slug!];
  if(!record)throw fail('save_outing_before_photo');
  if(photo.kind==='outing-cover')record.image=photo.path;else record.gallery=append(record.gallery,photo.path);
  for(const l of languages){
   record[l]??={};
   if(photo.kind==='outing-cover')record[l].image=photo.path;else record[l].gallery=append(record[l].gallery,photo.path);
   const entries=root.siteContent?.boat?.[id]?.[l]?.outings;
   if(Array.isArray(entries))for(const outing of entries)if(outing.slug===photo.slug){
    if(photo.kind==='outing-cover')outing.image=photo.path;else outing.gallery=append(outing.gallery,photo.path);
   }
  }
  return;
 }
 asset.media??={};asset.media.configured=true;asset.media.source='gcs';
 if(photo.kind==='cover'){asset.media.hero=photo.path;asset.media.cover=photo.path;root.resources??={};root.resources[type]??={};root.resources[type][id]??={};root.resources[type][id].coverImage=photo.path;}
 else {
  const existing=Array.isArray(asset.media.gallery)?asset.media.gallery:(root.siteContent?.boat?.[id]?.fr?.galleryImages||[]);
  asset.media.gallery=append(existing,photo.path);
 }
 if(type==='boat'){
  root.siteContent??={};root.siteContent.boat??={};root.siteContent.boat[id]??={};
  for(const l of languages){const content=root.siteContent.boat[id][l]??={};
   if(photo.kind==='cover')content.boatHeroImage=photo.path;else content.galleryImages=append(content.galleryImages,photo.path);
  }
 }
}
