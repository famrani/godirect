export type Portal = 'owner'|'client'|'concierge'|'admin'|'asset'|'local';
export const PORTAL_HOSTS=['owner','client','concierge','admin','www'];
export function portalFor(host:string):Portal {
 const h=String(host||'').toLowerCase().replace(/:\d+$/,'').replace(/\.$/,'');
 if(h==='godirect.fr'||h==='www.godirect.fr'||h==='owner.godirect.fr')return 'owner';
 if(h==='client.godirect.fr')return 'client';if(h==='concierge.godirect.fr')return 'concierge';if(h==='admin.godirect.fr')return 'admin';
 return /^[a-z0-9-]+\.godirect\.fr$/.test(h)?'asset':'local';
}
export function dedicatedPortalHome(host:string):string|null{
 switch(host.toLowerCase().replace(/:\d+$/,'').replace(/\.$/,'')){
  case 'owner.godirect.fr':return '/owner/listings';
  case 'admin.godirect.fr':return '/platform/admin';
  case 'concierge.godirect.fr':return '/concierge';
  default:return null;
 }
}
export function workspacePortal(path:string):'owner'|'concierge'|'admin'|null {
 const p=path.split(/[?#]/)[0];
 if(/^\/(platform\/admin|admin-access)(\/|$)/.test(p))return 'admin';
 if(/^\/concierge(\/|$)/.test(p))return 'concierge';
 if(/^\/owner(\/|$)/.test(p))return 'owner';return null;
}
export function portalOrigin(portal:string){return `https://${portal}.godirect.fr`;}
