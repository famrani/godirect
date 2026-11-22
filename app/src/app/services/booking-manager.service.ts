import {Injectable} from '@angular/core';import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';import {ReservationAuthService} from './reservation-auth.service';
@Injectable({providedIn:'root'})export class BookingManagerService{
 constructor(private http:HttpClient,private auth:ReservationAuthService){}
 async allowed(type:string,id:string):Promise<boolean>{try{const user=await this.auth.user();const c:any=await firstValueFrom(this.http.get('/api/me/context',{headers:await this.auth.headers(),params:{type,id}}));return c.uid===user.uid&&c.managementPermissions?.bookings===true;}catch{return false;}}
}
