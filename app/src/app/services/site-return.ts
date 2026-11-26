import {assetDomainSlug} from './asset-domain';
export function siteReturn(value:string|null|undefined,host:string,fallback:string):string{
 const site=!!assetDomainSlug(host),dest=value||fallback;
 if(!dest.startsWith('/')||dest.startsWith('//')||/[\\\x00-\x1f]/.test(dest)||dest.startsWith('/account/accept-terms'))return site?'/':fallback;
 const path=dest.split(/[?#]/)[0];
 if(site&&/^\/(?:espaces|(?:boat|car|pool|parking|property)\/[^/]+\/espaces)\/?$/.test(path))return '/';
 return dest;
}
