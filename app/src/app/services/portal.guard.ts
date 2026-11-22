import {Injectable} from '@angular/core';
import {CanActivate,Router,UrlTree} from '@angular/router';
import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';
import {portalFor,workspacePortal,portalOrigin} from './portal-policy';
import {dedicatedAsset} from './asset-domain';import {ReservationAuthService} from './reservation-auth.service';
@Injectable({providedIn:'root'})export class PortalGuard implements CanActivate {
 constructor(private router:Router,private http:HttpClient,private auth:ReservationAuthService){}
 async canActivate(_route:any,state:any):Promise<boolean|UrlTree>{
  if(typeof window==='undefined')return true;const host=window.location.hostname,portal=portalFor(host),url=state.url,path=url.split(/[?#]/)[0];if(portal==='local')return true;
  const wanted=workspacePortal(path);if(wanted&&wanted!==portal){window.location.assign(portalOrigin(wanted)+url);return false;}
  if(portal==='admin'){
   if(path==='/')return this.router.parseUrl('/platform/admin');
   if(path.startsWith('/platform/admin')){try{await this.auth.user();}catch{return this.router.createUrlTree(['/account/login'],{queryParams:{returnUrl:url}});}}
   if(!/^\/(platform\/admin|admin-access|account\/(login|forgotpwd|profile|accept-terms)|messages|legal|faq|contact)(\/|$)/.test(path))return this.router.parseUrl('/platform/admin');
  }
  if(/^\/(owner|concierge)(\/|$)/.test(path)){try{await this.auth.user();}catch{return this.router.createUrlTree(['/account/login'],{queryParams:{returnUrl:url}});}}
  const calendar=/^\/asset-calendar\/(boat|car|property|parking|pool)\/([-\w]+)$/.exec(path);
  if(calendar&&portal==='asset'){const scope=dedicatedAsset();if(scope?.assetType!==calendar[1]||scope?.assetId!==calendar[2])return this.router.parseUrl('/__asset_unavailable');}
  const asset=/^\/(boat|car|property|parking|pool)\/([-\w]+)(.*)$/.exec(path);
  if(asset){const [,type,id,tail]=asset;
   if(portal==='asset'){const scope=dedicatedAsset();return scope?.assetType===type&&scope?.assetId===id?true:this.router.parseUrl('/__asset_unavailable');}
   try{const site=await firstValueFrom(this.http.get<any>(`/api/asset-site/${type}/${id}`));const target=new URL(site.origin);if(target.protocol!=='https:'||portalFor(target.hostname)!=='asset')throw Error('invalid_site');window.location.assign(target.origin+(tail||'/home')+url.slice(path.length));return false;}catch{return this.router.parseUrl('/__asset_unavailable');}
  }
  if(/^\/(boat|car|property|parking|pool)$/.test(path)&&portal!=='client'&&portal!=='asset'){window.location.assign('https://client.godirect.fr/'+url.replace(/^\//,''));return false;}
  if(/^\/account\/(bookings|payments|ratings)(\/|$)/.test(path)&&portal!=='client'&&portal!=='asset'){window.location.assign('https://client.godirect.fr'+url);return false;}
  return true;
 }
}
