import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from './reservation-auth.service';
@Injectable({providedIn:'root'})export class RegistrationProfileService{constructor(private http:HttpClient,private auth:ReservationAuthService){}async roles():Promise<Array<{id:string,labelKey:string}>>{return firstValueFrom(this.http.get<Array<{id:string,labelKey:string}>>('/api/account-roles'));}async save(profile:any):Promise<any>{return firstValueFrom(this.http.put('/api/me/profile',profile,{headers:await this.auth.headers()}));}}
