import {SiteTextPipe} from '../home/site-text.pipe';
import {OWNER_OFFER_TEXT} from '../services/owner-offer-text';
import {Component,EventEmitter,OnDestroy,OnInit,Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom,timeout} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {LanguageService} from '../services/language.service';
import {SiteContentService} from '../home/site-content-service/site-content.service';
import {PlatformLayoutComponent} from '../layout/platform-layout/platform-layout.component';
import {OWNER_DASHBOARD_TEXT} from './owner-dashboard.text';
@Component({selector:'app-owner-dashboard',standalone:true,imports:[SiteTextPipe,CommonModule,RouterModule,PlatformLayoutComponent],templateUrl:'./owner-dashboard.component.html',styleUrls:['./owner-dashboard.component.scss']})
export class OwnerDashboardComponent implements OnInit,OnDestroy {
 @Output() browse=new EventEmitter<void>();
 assets:any[]=[];stripe:any=null;content:any;loading=false;listError=false;stripeError=false;
 private request=0;private destroyed=false;
 constructor(private http:HttpClient,private auth:ReservationAuthService,public language:LanguageService,private texts:SiteContentService){}
 o(key:string){const lang=this.language.currentLanguage;return this.texts.tFromContent(this.content,'ui.ownerOffer.'+key,lang,OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key]||key);}
 t(key:string){const lang=this.language.currentLanguage;return this.texts.tFromContent(this.content,'ui.ownerDashboard.'+key,lang,OWNER_DASHBOARD_TEXT[lang]?.[key]||OWNER_DASHBOARD_TEXT.en[key]||key);}
 ngOnInit(){void this.texts.getContent().then(c=>{if(!this.destroyed)this.content=c;}).catch(()=>{});void this.refresh();}
 ngOnDestroy(){this.destroyed=true;this.request++;this.assets=[];this.stripe=null;}
 async refresh(){
  if(this.loading)return;const request=++this.request;this.loading=true;this.listError=false;this.stripeError=false;this.assets=[];this.stripe=null;
  try{const user=await this.auth.user(),headers=await this.auth.headers();const uid=user.uid;
   const [list,stripe]=await Promise.allSettled([firstValueFrom(this.http.get<any[]>('/api/owner/listings',{headers}).pipe(timeout(12000))),firstValueFrom(this.http.get<any>(`/api/owners/${encodeURIComponent(uid)}/stripe/status`,{headers}).pipe(timeout(12000)))]);
   if(this.destroyed||request!==this.request||(await this.auth.user()).uid!==uid)return;
   if(list.status==='fulfilled'&&Array.isArray(list.value))this.assets=list.value.filter(a=>a.ownerId===uid);else this.listError=true;
   if(stripe.status==='fulfilled')this.stripe=stripe.value;else this.stripeError=true;
  }catch{if(!this.destroyed&&request===this.request){this.listError=true;this.stripeError=true;}}
  finally{if(!this.destroyed&&request===this.request)this.loading=false;}
 }
 get current(){return this.assets.filter(a=>!a.deletedAt);}
 get online(){return this.current.filter(a=>a.public===true).length;}
 get pending(){return this.assets.reduce((n,a)=>n+Number(a.reservationSummary?.pending||0),0);}
 get confirmed(){return this.assets.reduce((n,a)=>n+Number(a.reservationSummary?.confirmed||0),0);}
 get subscriptionIssues(){const now=Date.now();return this.current.filter(a=>a.billing?.status!=='active'||Number(a.billing?.paidUntil||0)*1000<=now);}
 get archivedSubscriptions(){return this.assets.filter(a=>a.deletedAt&&a.billing?.status==='active'&&!a.billing.cancelAtPeriodEnd);}
 get reservationAssets(){return this.assets.filter(a=>a.reservationSummary?.active>0).sort((a,b)=>Number(b.reservationSummary?.pending||0)-Number(a.reservationSummary?.pending||0));}
 get stripeReady(){return this.stripe?.connected===true&&this.stripe?.chargesEnabled===true;}
 path(a:any,tail:string){return `/${encodeURIComponent(a.assetType)}/${encodeURIComponent(a.id)}/${tail}`;}
}
