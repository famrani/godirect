import {assetDomainSlug,dedicatedAsset} from './asset-domain';
import {portalFor} from './portal-policy';
import {identityName,workspaceView,viewDestination,WorkspaceView} from './session-presentation';
import {explicitAsset} from './workspace-navigation';
import {Injectable,Optional} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router,NavigationEnd} from '@angular/router';
import {firstValueFrom,timeout} from 'rxjs';
import {StoreDbService,ServicesService} from 'godigital-lib';
import {ResourceContextService} from './resource-context.service';
@Injectable({providedIn:'root'})
export class AssetAccessService{
 private state:any=null;private request=0;private profile:any=null;private preferredView:WorkspaceView='owner';switchingView=false;
 constructor(private http:HttpClient,private store:StoreDbService,private ctx:ResourceContextService,private router:Router,@Optional() private main?:ServicesService){router.events.subscribe(event=>{if(event instanceof NavigationEnd)void this.refresh();});const a:any=this.store;const auth=a.firebaseauth||a.firebaseAuth||a.auth;if(auth?.onAuthStateChanged)auth.onAuthStateChanged(()=>{this.state=null;void this.refresh();});const service:any=this.main;const stream=typeof service?.getLoggedUser==='function'?service.getLoggedUser():service?.bnUserO;stream?.subscribe?.((profile:any)=>{this.profile=profile||null;void this.refresh();});void this.refresh();}
 async signOut():Promise<void>{const current=this.user();try{if(current?.uid&&localStorage.getItem('gd.push.uid')===current.uid){const sdk=await import('firebase/messaging');const a:any=this.store;const auth=a.firebaseauth||a.firebaseAuth||a.auth;const m=sdk.getMessaging(auth.app?._delegate||auth.app);await sdk.deleteToken(m);localStorage.removeItem('gd.push.uid');}}catch{}this.request++;this.avatarRequest++;this.avatarUid='';this.photo='';this.state=null;this.profile=null;this.preferredView='owner';const a:any=this.store;const auth=a.firebaseauth||a.firebaseAuth||a.auth;if(auth?.signOut)await auth.signOut();}
 private user():any{const a:any=this.store;return a.firebaseauth?.currentUser||a.firebaseAuth?.currentUser||a.auth?.currentUser;}
 private get scope(){return `${this.ctx.resourceType}/${this.ctx.resourceId}`;}
 async refresh(type?:string,id?:string):Promise<void>{const request=++this.request;const u=this.user();if(!u?.getIdToken){this.state=null;return;}const target=type&&id?{assetType:type,assetId:id}:explicitAsset(typeof window==='undefined'?'/':window.location.pathname)||dedicatedAsset();try{const value=await firstValueFrom(this.http.get<any>('/api/me/context',{headers:{Authorization:`Bearer ${await u.getIdToken()}`},params:target?{type:target.assetType,id:target.assetId}:{}}).pipe(timeout(10000)));if(request===this.request&&this.user()?.uid===u.uid){this.state=value;if(this.avatarUid!==u.uid)void this.refreshAvatar();}}catch{if(request===this.request)this.state=null;}}
 adminAccessFailure: string = "";
 async checkPlatformAdmin():Promise<boolean>{
  this.adminAccessFailure="";
  try {
  // Bootstrap may create the Firebase Auth instance after the router starts.
  // Wait for the usable session, including late Auth instance initialization.
  const deadline=Date.now()+15000;
  while(!this.user()?.getIdToken&&Date.now()<deadline){await new Promise<void>(resolve=>setTimeout(resolve,100));}
  const user=this.user();if(!user?.getIdToken){this.adminAccessFailure="session_unavailable";return false;}
  const token=await user.getIdToken();
  const value=await firstValueFrom(this.http.get<any>('/api/me/context',{headers:{Authorization:`Bearer ${token}`}}).pipe(timeout(10000)));
  if(this.user()?.uid!==user.uid||value?.uid!==user.uid){this.adminAccessFailure='session_mismatch';return false;}
  if(value.platformAdmin!==true){this.adminAccessFailure='admin_required';return false;}
  return true;
  }catch(error:any){
   this.adminAccessFailure=error?.status===401?'authentication_required':error?.status===403?'admin_required':error?.name==='TimeoutError'?'request_timeout':error?.status===0?'network_unavailable':error?.status?'http_'+error.status:'session_check_failed';
   return false;
  }
 }
 canManageFor(type:string,id:string,permission?:string):boolean{return this.state?.uid===this.user()?.uid&&this.state?.scope===`${type}/${id}`&&((this.state?.platformAdmin===true&&(!permission||permission==='content'))||this.state?.ownsAsset===true||(permission?this.state?.managementPermissions?.[permission]===true:Object.values(this.state?.managementPermissions||{}).some(v=>v===true)));}
 canManage(user?:any):boolean{const uid=this.user()?.uid;const passed=user?.uid||user?.userId||user?.id;return !!uid&&(!passed||passed===uid)&&this.state?.uid===uid&&this.state.scope===this.scope&&this.canManageFor(this.ctx.resourceType,this.ctx.resourceId);}
 get displayName():string{return identityName(this.user(),this.state,this.profile||(this.main as any)?.bnUser);}
 get firstListingView():boolean{return this.router.url.split(/[?#]/)[0]==='/owner/start';}
 get siteHomeHref(){return typeof window==='undefined'?'/':window.location.origin+'/';}
 get onOwnerSite(){return typeof location!=='undefined'&&!!assetDomainSlug(location.hostname);}
 rememberSiteMode(mode?:WorkspaceView){
  if(!mode){if(!this.onOwnerSite||this.accountMode==='loading')return;mode=this.viewMode;}
  const uid=this.authenticatedUid;if(!uid)return;
  this.preferredView=mode;
  const key='godirect.view.'+uid;
  try{sessionStorage.setItem(key,mode);}catch{}
  if(this.onOwnerSite){try{localStorage.setItem(key,mode);}catch{}}
 }
 private savedView(uid:string|undefined):WorkspaceView{
  if(!uid)return this.preferredView;
  const key='godirect.view.'+uid;
  try{const saved=sessionStorage.getItem(key)||(this.onOwnerSite?localStorage.getItem(key):null);if(saved==='client'||saved==='owner')return saved;}catch{}
  return this.preferredView;
 }
 get siteManagerMode():boolean{return this.onOwnerSite&&!!this.authenticatedUid&&this.state?.uid===this.authenticatedUid&&this.state?.ownsSite===true;}
 get canSwitchView():boolean{return !this.onOwnerSite&&this.isManager&&(typeof window==='undefined'||portalFor(window.location.hostname)!=='client');}
 get viewMode():WorkspaceView{
  if(this.onOwnerSite)return this.siteManagerMode?'owner':'client';
  if(typeof window!=='undefined'&&portalFor(window.location.hostname)==='client')return 'client';
  if(this.firstListingView)return 'owner';
  if(!this.isManager)return 'client';
  return workspaceView(this.router.url,this.savedView(this.authenticatedUid));
 }
 private avatarUid='';private photo='';private avatarRequest=0;
 get avatarUrl(){return this.avatarUid===this.authenticatedUid?this.photo:'';}
 async refreshAvatar(){
  const user=this.user(),uid=user?.uid;if(!uid)return;
  if(this.avatarUid!==uid){this.avatarUid=uid;this.photo='';}
  const request=++this.avatarRequest;
  try{
   const result=await firstValueFrom(this.http.get<{photo:string}>('/api/me/avatar',{headers:{Authorization:`Bearer ${await user.getIdToken()}`}}).pipe(timeout(5000)));
   if(request===this.avatarRequest&&this.authenticatedUid===uid)this.photo=typeof result?.photo==='string'?result.photo:'';
  }catch{if(request===this.avatarRequest)this.avatarUid='';}
 }
 async switchView():Promise<void>{if(this.switchingView||!this.canSwitchView)return;this.switchingView=true;try{await this.refresh();if(!this.canSwitchView)return;const next:WorkspaceView=this.viewMode==='owner'?'client':'owner';const url=this.router.url||'/';const scope=explicitAsset(url);const target=viewDestination(url,next,!!scope&&this.canManageFor(scope.assetType,scope.assetId),this.isPlatformAdmin,this.isConcierge&&(!scope||!this.isOwnerOf(scope.assetType,scope.assetId)));const previous=this.viewMode;this.rememberSiteMode(next);try{const changed=await this.router.navigate([target.path],{queryParams:target.query||{}});if(changed===false){this.rememberSiteMode(previous);}}catch(error){this.rememberSiteMode(previous);throw error;}}finally{this.switchingView=false;}}
 get accountMode():string{if(!this.isAuthenticated)return 'guest';if(this.state?.uid!==this.user()?.uid)return 'loading';const path=this.router?.url||'',scope=explicitAsset(path);return this.isPlatformAdmin?'admin':this.isConcierge&&(!this.isOwner||path.startsWith('/concierge')||!!scope&&!this.isOwnerOf(scope.assetType,scope.assetId))?'concierge':this.isOwner?'owner':'client';}
 get authenticatedUid():string{return this.user()?.uid||'';}
 get isAuthenticated():boolean{return !!this.user()?.uid;}
 get isOwner():boolean{return this.state?.uid===this.user()?.uid&&this.state?.isAssetOwner===true;}
 get isConcierge():boolean{return this.state?.uid===this.user()?.uid&&this.state?.isConcierge===true;}
 canConcierge(permission:string):boolean{return this.isConcierge&&this.state?.conciergePermissions?.[permission]===true;}
 get isManager():boolean{return this.isPlatformAdmin||this.isOwner||this.isConcierge;}
 isOwnerOf(type:string,id:string):boolean{return this.state?.uid===this.user()?.uid&&this.state?.scope===`${type}/${id}`&&this.state?.ownsAsset===true;}
 get ownsCurrentAsset():boolean{return this.isOwnerOf(this.ctx.resourceType,this.ctx.resourceId);}
 canUse(permission:string):boolean{return this.canManageFor(this.ctx.resourceType,this.ctx.resourceId,permission);}
 get isPlatformAdmin():boolean{return this.state?.uid===this.user()?.uid&&this.state?.platformAdmin===true;}
}
