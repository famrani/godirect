import { dedicatedAsset, internalAssetUrl } from './asset-domain';
import {AssetAccessService} from './asset-access.service';
import {Injectable} from '@angular/core';
import {CanActivateChild,ActivatedRouteSnapshot,RouterStateSnapshot,Router,UrlTree} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from './reservation-auth.service';
@Injectable({providedIn:'root'})
export class ListingPublicationGuard implements CanActivateChild{
 constructor(private http:HttpClient,private auth:ReservationAuthService,private router:Router,private access:AssetAccessService){}
 async canActivateChild(_route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Promise<boolean|UrlTree>{
  const parts=internalAssetUrl(state.url).split('?')[0].split('/').filter(Boolean);const [type,id,section]=parts;
  if(!['boat','car','property','parking','pool'].includes(type)||!id)return true;
  const site=dedicatedAsset();if(site&&(site.assetType!==type||site.assetId!==id))return this.router.parseUrl('/__asset_unavailable');
  let headers;try{headers=await this.auth.headers();}catch{}
  await this.access.refresh(type,id);
  const manager=this.access.canManageFor(type,id);
  if(section==='admin'&&['site-content','content','pricing-model'].includes(parts[3]||'')&&this.access.canManageFor(type,id,'content')){if(this.access.isPlatformAdmin)return this.router.parseUrl('/platform/admin/assets/'+type+'/'+id+'?action=edit');if(this.access.isOwnerOf(type,id))return this.router.parseUrl('/owner/listings?editType='+type+'&editId='+id);}
  if(section==='admin'){const tail=parts[3]||'';const delegatedRoute=parts.length===4&&(['site-content','content'].includes(tail)?this.access.canManageFor(type,id,'content'):tail==='reservations'?this.access.canManageFor(type,id,'bookings'):false);const allowed=this.access.isPlatformAdmin?delegatedRoute:this.access.isOwnerOf(type,id)||delegatedRoute;return allowed?true:this.router.parseUrl(dedicatedAsset()?'/__asset_unavailable':'/');}
  // Authorized private preview never changes public listing eligibility.
  if(manager)return true;
  // Existing customer and owner reservations, payments and account pages remain available.
  if(section&&(/^(my-|login|signup|forgotpwd|bookings|booking-detail|payment|deposit|offer|proposal|owner)/.test(section)))return true;
  try{const v=await firstValueFrom(this.http.get<any>(`/api/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/visibility`,{headers}));return v.public||v.owner?true:this.router.parseUrl(dedicatedAsset()?'/__asset_unavailable':v.owner?'/owner/listings':'/?listing=offline');}catch{return this.router.parseUrl(dedicatedAsset()?'/__asset_unavailable':'/?listing=unavailable');}
 }
}
