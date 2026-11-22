import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { StoreDbService } from 'godigital-lib';
@Injectable({providedIn:'root'})
export class ReservationAuthService {
 constructor(private store:StoreDbService){}
 async user():Promise<any>{const a:any=this.store;const auth=a.firebaseauth||a.firebaseAuth||a.auth;let u=auth?.currentUser;
  // On a fresh subdomain load, Firebase may still be restoring its persisted session.
  if(!u&&typeof auth?.authStateReady==='function'){await auth.authStateReady();u=auth.currentUser;}
  else if(!u&&typeof auth?.onAuthStateChanged==='function'){await new Promise<void>(resolve=>{let unsubscribe:any;let finished=false;const finish=()=>{finished=true;clearTimeout(timer);unsubscribe?.();resolve();};const timer=setTimeout(finish,5000);unsubscribe=auth.onAuthStateChanged(finish,finish);if(finished)unsubscribe?.();});u=auth.currentUser;}
  if(!u?.getIdToken)throw new Error('Connectez-vous pour continuer.');return u;}
 async headers():Promise<HttpHeaders>{return new HttpHeaders({Authorization:`Bearer ${await (await this.user()).getIdToken()}`});}
}
