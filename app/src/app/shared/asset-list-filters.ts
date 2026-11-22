export interface AssetListFilters {type:string;state:string;location:string;}
export function emptyAssetFilters():AssetListFilters{return {type:'',state:'',location:''};}
export function searchText(value:unknown):string{return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();}
export function creationTime(value:any):number|null{if(value===null||value===undefined||value==='')return null;const n=typeof value==='number'?(value<1e12?value*1000:value):Date.parse(value);return Number.isFinite(n)?n:null;}
export function matchesAssetFilters(asset:any,f:AssetListFilters):boolean{
 if(!asset)return !f.type&&!f.state&&!f.location;
 if(f.type&&asset.assetType!==f.type)return false;
 const archived=asset.archived===true||!!asset.deletedAt,pending=!archived&&asset.moderation?.status==='pending',online=!archived&&asset.public===true,offline=!archived&&!pending&&asset.public!==true;
 if(f.state&&!(f.state==='archived'?archived:f.state==='pending'?pending:f.state==='online'?online:offline))return false;
 const l=asset.location||{};if(f.location&&!searchText([l.city,l.area,l.country,l.postalCode].filter(Boolean).join(' ')).includes(searchText(f.location)))return false;
 return true;
}
export function sortAssetRows(rows:any[],asset:(r:any)=>any=(r:any)=>r):any[]{return [...rows].sort((a,b)=>{const aa=asset(a),bb=asset(b),at=creationTime(aa?.createdAt),bt=creationTime(bb?.createdAt);if(at===null)return bt===null?String(aa?.name||'').localeCompare(String(bb?.name||'')):1;if(bt===null)return -1;return bt-at;});}
