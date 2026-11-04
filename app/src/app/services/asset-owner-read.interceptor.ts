import {Injectable} from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent} from '@angular/common/http';
import {Observable,from,switchMap} from 'rxjs';
import {ReservationAuthService} from './reservation-auth.service';
@Injectable()
export class AssetOwnerReadInterceptor implements HttpInterceptor{
 constructor(private auth:ReservationAuthService){}
 intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
  if(req.method!=='GET'||!/^\/api\/(assets|resources)\//.test(req.url))return next.handle(req);
  return from(this.auth.headers().catch(()=>null)).pipe(switchMap(headers=>next.handle(headers?req.clone({headers:req.headers.set('Authorization',headers.get('Authorization')||'')}):req)));
 }
}
