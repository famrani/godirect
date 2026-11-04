import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { StoreDbService } from 'godigital-lib';
@Injectable({providedIn:'root'})
export class ReservationAuthService {
 constructor(private store:StoreDbService){}
 async user():Promise<any>{const a:any=this.store;const u=a.firebaseauth?.currentUser||a.firebaseAuth?.currentUser||a.auth?.currentUser;if(!u?.getIdToken)throw new Error('Connectez-vous pour continuer.');return u;}
 async headers():Promise<HttpHeaders>{return new HttpHeaders({Authorization:`Bearer ${await (await this.user()).getIdToken()}`});}
}
