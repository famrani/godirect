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
  const parts=state.url.split('?')[0].split('/').filter(Boolean);const [type,id,section]=parts;
  if(!['boat','car','property','parking','pool'].includes(type)||!id)return true;
  await this.access.refresh();
  const manager=this.access.canManage();
  if(section==='admin')return manager?true:this.router.parseUrl('/');
  // Authorized private preview never changes public listing eligibility.
  if(manager)return true;
  // Existing customer and owner reservations, payments and account pages remain available.
  if(section&&(/^(my-|login|signup|forgotpwd|bookings|booking-detail|payment|deposit|offer|proposal|owner)/.test(section)))return true;
  try{let headers;try{headers=await this.auth.headers();}catch{}const v=await firstValueFrom(this.http.get<any>(`/api/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}/visibility`,{headers}));return v.public?true:this.router.parseUrl(v.owner?'/owner/listings':'/?listing=offline');}catch{return this.router.parseUrl('/?listing=unavailable');}
 }
}
