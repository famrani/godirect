import {Injectable} from '@angular/core';import {HttpClient} from '@angular/common/http';import {StoreDbService} from 'godigital-lib';import {GoogleAuthProvider,signInWithPopup} from 'firebase/auth';import {firstValueFrom,timeout} from 'rxjs';
@Injectable({providedIn:'root'})
export class GoogleSessionService {
 constructor(private store:StoreDbService,private http:HttpClient){}
 private auth():any{const s:any=this.store;return s.firebaseauth||s.firebaseAuth||s.auth;}
 /** Call directly from the click: no awaited bootstrap or dynamic import before the popup. */
 signIn():Promise<any>{
  const auth=this.auth();if(!auth)return Promise.reject(Error('Authentication is still initializing. Reload the page and try again.'));
  const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
  const result=typeof auth.signInWithPopup==='function'?auth.signInWithPopup(provider):signInWithPopup(auth,provider);
  return Promise.resolve(result).then(async credential=>{const user=credential.user;if(!user?.uid||typeof user.getIdToken!=='function')throw Error('invalid_authentication');const token=await user.getIdToken();if(this.auth()?.currentUser?.uid!==user.uid)throw Error('session_changed');
   const profile=await firstValueFrom(this.http.post<any>('/api/me/session',{}, {headers:{Authorization:'Bearer '+token}}).pipe(timeout(20000)));
   if(this.auth()?.currentUser?.uid!==user.uid||profile?.userId!==user.uid)throw Error('session_changed');return profile;
  });
 }
}
