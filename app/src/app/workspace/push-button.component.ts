import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {getMessaging,getToken,isSupported} from 'firebase/messaging';
import {StoreDbService} from 'godigital-lib';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {AssetAccessService} from '../services/asset-access.service';
import {LanguageService} from '../services/language.service';

const uidKey='gd.push.uid', tokenKey='gd.push.token';

@Component({
 standalone:true,
 selector:'app-push-button',
 template:`<button type="button" (click)="change()" [disabled]="busy">{{active?copy[0]:copy[1]}}</button>
 <small role="status">{{note}}</small>`,
 styles:[`:host{display:block}button{display:block;width:100%;box-sizing:border-box;padding:12px;min-height:44px;text-align:left;border:0;background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer}button:hover{background:#eef1e8}button:focus-visible{outline:2px solid #7fac61;outline-offset:-2px}button:disabled{opacity:.55;cursor:wait}small:not(:empty){display:block;padding:0 12px 8px;font-size:12px}`]
})
export class PushButtonComponent {
 busy=false;
 note='';
 get active(){try{return !!this.access.authenticatedUid&&localStorage.getItem(uidKey)===this.access.authenticatedUid;}catch{return false;}}
 get copy(){return this.language.currentLanguage==='fr'
  ? ['Désactiver les notifications','Activer les notifications','Notifications désactivées sur cet appareil.','Notifications activées sur cet appareil.','Sur iPhone, ouvrez GoDirect depuis son icône sur l’écran d’accueil.','Autorisez les notifications dans les réglages de votre appareil.','Notifications non configurées sur le serveur.','Impossible de modifier les notifications. Réessayez.']
  : ['Turn off notifications','Turn on notifications','Notifications turned off on this device.','Notifications turned on on this device.','On iPhone, open GoDirect from its Home Screen icon.','Allow notifications in your device settings.','Notifications are not configured on the server.','Could not change notifications. Try again.'];}
 constructor(private access:AssetAccessService,private auth:ReservationAuthService,private store:StoreDbService,private http:HttpClient,private language:LanguageService){}

 async change(){
  const uid=this.access.authenticatedUid, off=this.active;
  if(!uid||this.busy)return;
  this.busy=true;this.note='';
  try{
   let token=off?localStorage.getItem(tokenKey):null;
   if(!token){
    if(!('Notification' in window)||!('serviceWorker' in navigator)){this.note=this.copy[4];return;}
    if(!off&&await Notification.requestPermission()!=='granted'){this.note=this.copy[5];return;}
    if(!await isSupported())throw Error('push_unsupported');
    const {key}=await firstValueFrom(this.http.get<{key:string}>('/api/push/config'));
    if(!key){this.note=this.copy[6];return;}
    const store:any=this.store,auth=store.firebaseauth||store.firebaseAuth||store.auth;
    const messaging=getMessaging(auth.app?._delegate||auth.app);
    await navigator.serviceWorker.register('/godirect-sw.js',{scope:'/'});
    const registration=await navigator.serviceWorker.ready;
    token=await getToken(messaging,{vapidKey:key,serviceWorkerRegistration:registration});
   }
   const headers=await this.auth.headers();
   if(this.access.authenticatedUid!==uid)throw Error('session_changed');
   await firstValueFrom(this.http.post('/api/push/device',{token,enabled:!off},{headers}));
   if(off){localStorage.removeItem(uidKey);localStorage.removeItem(tokenKey);}
   else{localStorage.setItem(tokenKey,token);localStorage.setItem(uidKey,uid);}
   this.note=this.copy[off?2:3];
  }catch{this.note=this.copy[7];}finally{this.busy=false;}
 }
}
