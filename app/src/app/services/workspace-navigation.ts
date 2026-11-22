import {internalAssetUrl} from './asset-domain';
export function explicitAsset(url:string):{assetType:string;assetId:string}|null{const p=internalAssetUrl(url).split(/[?#]/)[0].split('/').filter(Boolean);return /^(boat|car|property|parking|pool)$/.test(p[0]||'')&&/^[a-z0-9][a-z0-9_-]*$/.test(p[1]||'')?{assetType:p[0],assetId:p[1]}:null;}
export function assetLink(a:any,tail='home'):string{const type=a?.assetType,id=a?.assetId||a?.id;if(!/^(boat|car|property|parking|pool)$/.test(type||'')||!/^[a-z0-9][a-z0-9_-]*$/.test(id||''))throw new Error('invalid_asset_scope');return `/${type}/${id}/${tail}`;}
export function ownedAssets(rows:any[],uid:string):any[]{return (Array.isArray(rows)?rows:[]).filter(a=>a.ownerId===uid&&explicitAsset(assetLink(a))!==null);}
export function scopedBookings(rows:any[],type:string,id:string):any[]{return rows.filter(b=>b.assetType===type&&b.assetId===id);}
