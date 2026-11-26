import {Injectable} from '@angular/core';
import {CanActivate,Router,UrlTree} from '@angular/router';
import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';
import {portalFor,workspacePortal,portalOrigin,dedicatedPortalHome} from './portal-policy';
import {dedicatedAsset} from './asset-domain';import {ReservationAuthService} from './reservation-auth.service';
@Injectable({providedIn:'root'})export class PortalGuard implements CanActivate {
 constructor(private router:Router,private http:HttpClient,private auth:ReservationAuthService){}
 async canActivate(_route:any,state:any):Promise<boolean|UrlTree>{
  if(typeof window==='undefined')return true;const host=window.location.hostname,portal=portalFor(host),url=state.url,path=url.split(/[?#]/)[0];if(portal==='local')return true;
  const wanted=workspacePortal(path);if(wanted==='admin'&&portal!=='admin'){window.location.assign(portalOrigin(wanted)+url);return false;}
  const home=dedicatedPortalHome(host);
  if(portal==='owner'&&/^\/account\/login\/?$/.test(path)){
   const target=new URL(url,window.location.origin).searchParams.get('returnUrl');
   if(target&&/^\/owner\/listings\/?(?:[?#]|$)/.test(target)&&!/[\\\x00-\x1f]/.test(target)){
    try{await this.auth.user();}catch{return true;}
    return this.router.parseUrl(target);
   }
  }
  if(path==='/'&&home){
   try{await this.auth.user();}catch{return this.router.createUrlTree(['/account/login'],{queryParams:{returnUrl:home}});}
   return this.router.parseUrl(home);
  }
  if(portal==='admin'){
   if(path.startsWith('/platform/admin')){try{await this.auth.user();}catch{return this.router.createUrlTree(['/account/login'],{queryParams:{returnUrl:url}});}}
   if(!/^\/(platform\/admin|admin-access|account\/(login|forgotpwd|profile|accept-terms)|messages|legal|faq|contact)(\/|$)/.test(path))return this.router.parseUrl('/platform/admin');
  }
  if(/^\/(owner|concierge)(\/|$)/.test(path)){try{await this.auth.user();}catch{return this.router.createUrlTree(['/account/login'],{queryParams:{returnUrl:url}});}}
  return true;
 }
}
