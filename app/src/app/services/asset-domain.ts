/** A dedicated hostname is resolved by the server before Angular starts. */
export interface DomainAsset {assetType:string;assetId:string;}
let domainAsset:DomainAsset|null=null;
export function setDomainAsset(asset:DomainAsset|null):void {domainAsset=asset;}
export function dedicatedAsset():DomainAsset|null{return domainAsset;}
export function assetDomainSlug(hostname:string):string|null {
 const match=/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\.godirect\.fr$/i.exec(hostname);
 return match&&!['www','owner','client','concierge','admin'].includes(match[1].toLowerCase())?match[1].toLowerCase():null;
}
export function internalAssetUrl(url:string):string {
 const a=domainAsset;if(!a)return url;
 // Angular Location normalizes the initial '/' to an empty string.
 if(/^\/(?:espaces|(?:boat|car|property|parking|pool)\/[^/]+\/espaces)\/?(?:[?#].*)?$/.test(url))return '/';
 if(!url||url.startsWith('?')||url.startsWith('#'))return '/'+(url||'');
 if(/^\/(?:[?#]|$)/.test(url))return url;
 if(/^\/(?:__asset_unavailable|site-management|site-client|messages|asset-calendar|admin-access|account|owner|platform|concierge-role|concierge|legal|faq|contact)(?:[/?#]|$)/.test(url))return url;
 const base=`/${a.assetType}/${a.assetId}`;
 if(url===base||url.startsWith(base+'/')||url.startsWith(base+'?')||url.startsWith(base+'#'))return url;
 if(/^\/(boat|car|property|parking|pool)\//.test(url))return url;
 const tail=url.startsWith('/')?url:'/'+url;
 return base+(tail==='/'?'/home':/^[/?#]/.test(tail)&&/^\/[?#]/.test(tail)?'/home'+tail.slice(1):tail);
}
export function externalAssetUrl(url:string):string {
 const a=domainAsset;if(!a)return url;
 const base=`/${a.assetType}/${a.assetId}`;
 if(typeof location!=='undefined'&&location.pathname.startsWith(base+'/'))return url;
 if(url===base||url.startsWith(base+'/'))return url;
 if(url.startsWith(base+'/home?')||url.startsWith(base+'/home#'))return '/'+url.slice((base+'/home').length);
 if(url.startsWith(base+'/'))return url.slice(base.length);
 return url;
}
