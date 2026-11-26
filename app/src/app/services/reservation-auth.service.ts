import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { StoreDbService } from 'godigital-lib';
@Injectable({providedIn:'root'})
export class ReservationAuthService {
 constructor(private store:StoreDbService){}
 async user():Promise<any>{const a:any=this.store;const getAuth=()=>a.firebaseauth||a.firebaseAuth||a.auth;
  const deadline=Date.now()+12000;
  let auth=getAuth();
  while(!auth&&Date.now()<deadline){await new Promise<void>(resolve=>setTimeout(resolve,100));auth=getAuth();}
  let u=auth?.currentUser;
  // On a fresh subdomain load, Firebase may still be restoring its persisted session.
  if(!u&&typeof auth?.authStateReady==='function'){let timer:ReturnType<typeof setTimeout>|undefined;try{await Promise.race([auth.authStateReady(),new Promise<void>(resolve=>{timer=setTimeout(resolve,8000);})]);}finally{clearTimeout(timer);}u=auth.currentUser;}
  else if(!u&&typeof auth?.onAuthStateChanged==='function'){await new Promise<void>(resolve=>{let unsubscribe:any;let finished=false;const finish=()=>{finished=true;clearTimeout(timer);unsubscribe?.();resolve();};const timer=setTimeout(finish,5000);unsubscribe=auth.onAuthStateChanged(finish,finish);if(finished)unsubscribe?.();});u=auth.currentUser;}
  if(!u?.getIdToken)throw new Error('Connectez-vous pour continuer.');return u;}
 async headers():Promise<HttpHeaders>{return new HttpHeaders({Authorization:`Bearer ${await (await this.user()).getIdToken()}`});}
}
