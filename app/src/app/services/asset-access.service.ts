import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router,NavigationEnd} from '@angular/router';
import {firstValueFrom,timeout} from 'rxjs';
import {StoreDbService} from 'godigital-lib';
import {ResourceContextService} from './resource-context.service';
@Injectable({providedIn:'root'})
export class AssetAccessService{
 private state:any=null;private request=0;
 constructor(private http:HttpClient,private store:StoreDbService,private ctx:ResourceContextService,router:Router){router.events.subscribe(event=>{if(event instanceof NavigationEnd)void this.refresh();});const a:any=this.store;const auth=a.firebaseauth||a.firebaseAuth||a.auth;if(auth?.onAuthStateChanged)auth.onAuthStateChanged(()=>{this.state=null;void this.refresh();});void this.refresh();}
 async signOut():Promise<void>{this.request++;this.state=null;const a:any=this.store;const auth=a.firebaseauth||a.firebaseAuth||a.auth;if(auth?.signOut)await auth.signOut();}
 private user():any{const a:any=this.store;return a.firebaseauth?.currentUser||a.firebaseAuth?.currentUser||a.auth?.currentUser;}
 private get scope(){return `${this.ctx.resourceType}/${this.ctx.resourceId}`;}
 async refresh():Promise<void>{const request=++this.request;const u=this.user();if(!u?.getIdToken){this.state=null;return;}try{const value=await firstValueFrom(this.http.get<any>('/api/me/context',{headers:{Authorization:`Bearer ${await u.getIdToken()}`},params:{type:this.ctx.resourceType,id:this.ctx.resourceId}}).pipe(timeout(10000)));if(request===this.request&&this.user()?.uid===u.uid)this.state=value;}catch{if(request===this.request)this.state=null;}}
 canManage(user?:any):boolean{const uid=this.user()?.uid;const passed=user?.uid||user?.userId||user?.id;return !!uid&&(!passed||passed===uid)&&this.state?.uid===uid&&this.state.scope===this.scope&&(this.state.platformAdmin===true||this.state.ownsAsset===true);}
 get isAuthenticated():boolean{return !!this.user()?.uid;}
 get isOwner():boolean{return this.state?.uid===this.user()?.uid&&(this.state?.isAssetOwner===true||this.state?.platformAdmin===true);}
 get isPlatformAdmin():boolean{return this.state?.uid===this.user()?.uid&&this.state?.platformAdmin===true;}
}
