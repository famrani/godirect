export function domainAssetId(host:string):string|null {
 const hostname=String(host||'').toLowerCase().replace(/:\d+$/,'').replace(/\.$/,'');
 const match=/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\.godirect\.fr$/.exec(hostname);
 return match&&!['www','owner','client','concierge','admin'].includes(match[1])?match[1]:null;
}
export function hostnameMatches(pattern:string,host:string):boolean {
 if(pattern===host)return true;
 return pattern==='*.godirect.fr'&&/^[a-z0-9-]+\.godirect\.fr$/i.test(host);
}
