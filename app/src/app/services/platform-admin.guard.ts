import {Injectable} from '@angular/core';import {CanActivate,Router,UrlTree} from '@angular/router';import {AssetAccessService} from './asset-access.service';
@Injectable({providedIn:'root'})export class PlatformAdminGuard implements CanActivate{constructor(private access:AssetAccessService,private router:Router){}async canActivate():Promise<boolean|UrlTree>{await this.access.refresh();return this.access.isPlatformAdmin||this.router.parseUrl('/');}}

@Injectable({providedIn:'root'})export class OwnerWorkspaceGuard implements CanActivate{constructor(private access:AssetAccessService,private router:Router){}async canActivate():Promise<boolean|UrlTree>{await this.access.refresh();return this.access.isPlatformAdmin?this.router.parseUrl('/platform/admin'):true;}}
