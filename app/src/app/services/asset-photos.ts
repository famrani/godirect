/** Shared raw photo paths for the public pages and the CMS; never resolves URLs. */
const defaults:Record<string,string[]>={
 'parking/port-antibes-parking':[1,2,3].map(n=>`assets/parkings/port-antibes-parking/parking-${n}.jpg`),
 'property/villa-azur':[1,2,3].map(n=>`assets/lodging/villa-azur/villa-${n}.jpg`),
 'pool/azure-pool':[1,2,3].map(n=>`assets/pools/azure-pool/pool-${n}.jpg`)
};
export function assetPhotoPaths(asset:any,type:string,id:string):string[]{
 const m=asset?.media||{};
 const paths=[m.hero,m.cover,...(Array.isArray(m.gallery)?m.gallery:[])]
  .filter((v):v is string=>typeof v==='string'&&!!v.trim());
 if(paths.length||m.configured===true)return Array.from(new Set(paths));
 return [...(defaults[`${type}/${id}`]||[])];
}
export function editableAssetMedia(asset:any,type:string,id:string):any{
 const media=structuredClone(asset?.media||{});
 const existing=[media.hero,media.cover,...(Array.isArray(media.gallery)?media.gallery:[])].some(v=>typeof v==='string'&&!!v.trim());
 if(!existing&&media.configured!==true){
  const paths=assetPhotoPaths(asset,type,id);
  if(paths.length){media.hero=paths[0];media.cover=paths[0];media.gallery=[...paths];}
 }
 return media;
}
