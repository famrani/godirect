import {assetPhotoPaths} from '../../../../services/asset-photos';
import {ASSET_ADMIN_I18N} from '../../../../services/asset-admin-i18n';
import {SiteContentService} from '../../../../home/site-content-service/site-content.service';
import { StoreDbService } from 'godigital-lib';
import { firstValueFrom } from 'rxjs';
import { ReservationAuthService } from '../../../../services/reservation-auth.service';
import { LanguageService } from '../../../../services/language.service';
import { ASSET_PAGE_I18N } from '../../../../services/asset-page-i18n';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../../../services/resource-context.service';
import { PrivateMediaService } from '../../../../services/private-media.service';

@Component({selector:'app-parking-home',templateUrl:'./parking-home.component.html',styleUrls:['./parking-home.component.scss'],standalone:false})
export class ParkingHomeComponent implements OnInit, OnDestroy {

  uiContent:any=null;
  t(key:string):string { const fallback=ASSET_PAGE_I18N[this.language.currentLanguage]?.[key] || ASSET_PAGE_I18N.fr[key] || key;return this.contentService?.tFromContent(this.uiContent,'ui.assetPages.'+key,this.language.currentLanguage,fallback)||fallback; }
  get localized():any { return this.asset?.translations?.[this.language.currentLanguage] || {}; }
  get localizedHeadline():string { return this.localized.headline || this.asset?.headline || ''; }
  get localizedDescription():string { return this.localized.description || this.asset?.description || ''; }
 asset:any=null; error=''; images:string[]=[];
 readonly kind='parking'; get detailLabel(){return this.t('parking');} get eyebrow(){return this.t('parking');}
 constructor(private http:HttpClient, public ctx:ResourceContextService, private media:PrivateMediaService, public language:LanguageService, private store:StoreDbService, private auth:ReservationAuthService, private contentService:SiteContentService){}
 ownerView:'admin'|'customer'='admin'; bookings:any[]=[]; dashboardLoading=false; dashboardError=''; dashboardLoaded=false;
 filter:'upcoming'|'attention'|'all'='upcoming'; search=''; private requestId=0; private stopAuth?:()=>void; private destroyed=false;
 private readonly viewChanged=(event:Event)=>{this.ownerView=(event as CustomEvent).detail==='customer'?'customer':'admin';void this.refreshDashboard();};
 private readonly storageChanged=(event:StorageEvent)=>{if(event.key==='alegria-owner-view'){this.readOwnerView();void this.refreshDashboard();}};
 private readOwnerView(){try{this.ownerView=localStorage.getItem('alegria-owner-view')==='customer'?'customer':'admin';}catch{this.ownerView='admin';}}
 private get currentUser():any{const store:any=this.store;return store.firebaseauth?.currentUser||store.firebaseAuth?.currentUser||store.auth?.currentUser||null;}
 get showAdmin():boolean{return !!this.asset?.ownerId&&this.currentUser?.uid===this.asset.ownerId&&this.ownerView==='admin';}
 ngOnInit(){ void this.contentService?.getContent().then(c=>this.uiContent=c);
  this.readOwnerView();window.addEventListener('alegria-owner-view-change',this.viewChanged);window.addEventListener('storage',this.storageChanged);
  const db:any=this.store;const firebaseAuth=db.firebaseauth||db.firebaseAuth||db.auth;
  if(typeof firebaseAuth?.onAuthStateChanged==='function')this.stopAuth=firebaseAuth.onAuthStateChanged(()=>{void this.refreshDashboard();});
  this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({next:async a=>{
    try{const resolved=await this.media.resolveFirebaseTree(a);if(this.destroyed)return;this.asset=resolved;this.images=this.assetImages(a);await this.refreshDashboard();}
    catch{if(!this.destroyed)this.error='Ressource introuvable.';}
  },error:()=>this.error='Ressource introuvable.'});
 }
 async refreshDashboard():Promise<void>{
  const request=++this.requestId;this.dashboardError='';
  if(!this.showAdmin){this.bookings=[];this.dashboardLoading=false;this.dashboardLoaded=false;return;}
  this.dashboardLoading=true;const uid=this.currentUser.uid;const assetId=this.ctx.resourceId;
  try{
    const rows=await firstValueFrom(this.http.get<any[]>(`/api/owners/${encodeURIComponent(uid)}/bookings`,{headers:await this.auth.headers()}));
    if(request!==this.requestId||this.destroyed||!this.showAdmin||uid!==this.currentUser?.uid||assetId!==this.ctx.resourceId)return;
    this.bookings=(Array.isArray(rows)?rows:[]).filter(b=>b.ownerId===uid&&b.assetType==='parking'&&b.assetId===assetId);this.dashboardLoaded=true;
  }catch{if(request===this.requestId){this.bookings=[];this.dashboardLoaded=false;this.dashboardError=this.adminT('loadError');}}
  finally{if(request===this.requestId)this.dashboardLoading=false;}
 }
 ngOnDestroy(){this.destroyed=true;this.requestId++;this.stopAuth?.();window.removeEventListener('alegria-owner-view-change',this.viewChanged);window.removeEventListener('storage',this.storageChanged);}
 isActive(b:any):boolean{return !['cancelled','rejected','completed'].includes(b.status);}
 needsApproval(b:any):boolean{return this.isActive(b)&&b.status==='pending'&&b.workflow?.adminApproved!==true;}
 needsPayment(b:any):boolean{return this.isActive(b)&&((Number(b.bookingDeposit)>0&&b.workflow?.depositPaid!==true)||(Number(b.balanceAmount)>0&&b.workflow?.balancePaid!==true)||(Number(b.securityDeposit)>0&&b.workflow?.warrantyProvided!==true));}
 cancelling(b:any):boolean{return this.isActive(b)&&(b.cancellationRequestStatus==='pending'||['refund_pending','refund_failed','review_required'].includes(b.cancellation?.status));}
 needsAttention(b:any):boolean{return this.needsApproval(b)||this.needsPayment(b)||this.cancelling(b);}
 get upcomingBookings():any[]{return this.bookings.filter(b=>this.isActive(b)&&Date.parse(b.endAt)>=Date.now()).sort((a,b)=>Date.parse(a.startAt)-Date.parse(b.startAt));}
 get approvalCount():number{return this.bookings.filter(b=>this.needsApproval(b)).length;}
 get paymentCount():number{return this.bookings.filter(b=>this.needsPayment(b)).length;}
 get cancellationCount():number{return this.bookings.filter(b=>this.cancelling(b)).length;}
 get visibleBookings():any[]{
  const query=this.search.trim().toLocaleLowerCase();const list=this.filter==='upcoming'?this.upcomingBookings:this.filter==='attention'?this.bookings.filter(b=>this.needsAttention(b)):this.bookings;
  return list.filter(b=>!query||[b.customerName,b.customerEmail,b.id].some(v=>String(v||'').toLocaleLowerCase().includes(query))).slice().sort((a,b)=>this.filter==='all'?Date.parse(b.startAt)-Date.parse(a.startAt):Date.parse(a.startAt)-Date.parse(b.startAt));
 }
 get nextArrival():any{return this.upcomingBookings.find(b=>b.status==='confirmed'&&Date.parse(b.startAt)>=Date.now());}
 onSearch(event:Event){this.search=(event.target as HTMLInputElement).value;}
 statusText(b:any):string{
  if(b.status==='cancelled')return this.adminT('cancelled');
  if(this.cancelling(b))return this.adminT(b.cancellationRequestStatus==='pending'?'cancellationRequested':'refundPending');
  return this.adminT(b.status==='confirmed'?'confirmed':b.status==='completed'?'completed':b.status==='rejected'?'rejected':'pending');
 }
 paymentText(b:any):string{if(b.cancellation?.status==='completed')return this.adminT('refundCompleted');return this.adminT(this.cancelling(b)?'refundFollowup':this.needsPayment(b)?'paymentDue':'paymentsReady');}
 adminT(key:string):string{
  const lang=this.language.currentLanguage;const fallback=ASSET_ADMIN_I18N['parking'][lang]?.[key]||ASSET_ADMIN_I18N['parking'].en[key]||key;
  return this.contentService?.tFromContent(this.uiContent,'ui.management.parking.'+key,lang,fallback)||fallback;
 }
 get p(){return this.asset?.properties||{};} get price(){return this.asset?.pricing||{};}
 private assetImages(a:any):string[]{return assetPhotoPaths(a,this.ctx.resourceType,this.ctx.resourceId).map(path=>this.media.objectUrl(path)||(/^https:\/\//i.test(path)?path:'')).filter(Boolean);}
 get facts():string[]{ return [this.p.secured?this.t('secured'):this.t('standard'),this.p.cctv?this.t('cctv'):this.t('noCctv'),this.p.evCharging?this.t('charging'):this.t('noCharging'),`${this.p.widthM||'-'} × ${this.p.lengthM||'-'} m`,`${this.p.heightLimitM||'-'} m max`];
 }
}
