import {SiteTextPipe} from '../home/site-text.pipe';
import {ActivatedRoute} from '@angular/router';import {Subscription} from 'rxjs';import {PrivateMediaService} from '../services/private-media.service';
import {Component,OnInit,OnDestroy} from '@angular/core';import {CommonModule} from '@angular/common';import {FormsModule} from '@angular/forms';import {RouterModule} from '@angular/router';import {HttpClient} from '@angular/common/http';import {firstValueFrom,timeout} from 'rxjs';import {ReservationAuthService} from '../services/reservation-auth.service';import {SiteContentService} from '../home/site-content-service/site-content.service';import {LanguageService} from '../services/language.service';import {PlatformLayoutComponent} from '../layout/platform-layout/platform-layout.component';import {PLATFORM_ADMIN_TEXT} from './platform-admin.text';
@Component({selector:'app-platform-admin',standalone:true,imports:[SiteTextPipe,CommonModule,FormsModule,RouterModule,PlatformLayoutComponent],templateUrl:'./platform-admin.component.html',styleUrls:['./platform-admin.component.scss']})
export class PlatformAdminComponent implements OnInit,OnDestroy{
 showArchived=false;data:any=null;loading=false;error='';query='';ownerId='';tab='requests';page=0;readonly pageSize=20;content:any;selected:any=null;reason='';working=false;private querySub?:Subscription;private destroyed=false;private request=0;
 constructor(private http:HttpClient,private auth:ReservationAuthService,public language:LanguageService,private texts:SiteContentService,private route:ActivatedRoute,private media:PrivateMediaService){}
 t(k:string){const lang=this.language.currentLanguage;return this.texts.tFromContent(this.content,'ui.platformAdmin.'+k,lang,PLATFORM_ADMIN_TEXT[lang]?.[k]||PLATFORM_ADMIN_TEXT.en[k]||k);}
 ngOnInit(){this.querySub=this.route?.queryParamMap.subscribe(p=>{const tab=p.get('tab');if(tab&&['owners','assets','subscriptions','requests'].includes(tab))this.select(tab);});void this.texts.getContent().then(c=>{if(!this.destroyed)this.content=c;}).catch(()=>{});void this.refresh();}
 ngOnDestroy(){this.querySub?.unsubscribe();this.destroyed=true;this.request++;this.data=null;}
 async refresh(){if(this.loading)return;this.loading=true;this.data=null;this.error='';const request=++this.request;try{const uid=(await this.auth.user()).uid;const value=await firstValueFrom(this.http.get<any>('/api/platform/admin/overview',{headers:await this.auth.headers()}).pipe(timeout(20000)));if(!this.destroyed&&request===this.request&&(await this.auth.user()).uid===uid){this.data=value;this.page=0;}}catch(e:any){if(!this.destroyed&&request===this.request)this.error=this.t(e.status===403?'forbidden':'error');}finally{if(!this.destroyed&&request===this.request)this.loading=false;}}
 select(tab:string){this.selected=null;this.tab=tab;this.page=0;}
 inspect(uid:string){this.ownerId=uid;this.query='';this.select('assets');}
 reset(){this.ownerId='';this.query='';this.page=0;}
 get rows():any[]{const q=this.query.trim().toLocaleLowerCase();return (this.tab==='requests'?(this.data?.assets||[]).filter((a:any)=>!a.archived&&a.moderation?.status==='pending'):(this.data?.[this.tab]||[])).filter((r:any)=>(this.tab!=='assets'||this.showArchived||!r.archived)&&(!this.ownerId||(this.tab==='owners'?r.uid:r.ownerId)===this.ownerId)&&(!q||[r.name,r.email,r.uid,r.id,r.assetId,r.assetName,r.assetType,r.ownerId,r.status,r.subscriptionStatus].some(v=>String(v||'').toLocaleLowerCase().includes(q))));}
 review(a:any){this.selected=a;this.reason='';this.error='';}
 image(value:string){return this.media.objectUrl(value);}
 get photos():string[]{const m=this.selected?.media||{};return [...new Set<string>([m.hero,m.cover,...(Array.isArray(m.gallery)?m.gallery:[])].filter(v=>typeof v==='string'&&!!v))];}
 async decide(decision:'approved'|'rejected'){
  if(this.working||!this.selected||(decision==='rejected'&&!this.reason.trim()))return;this.working=true;this.error='';
  const a=this.selected;try{await firstValueFrom(this.http.post(`/api/platform/admin/listings/${encodeURIComponent(a.assetType)}/${encodeURIComponent(a.id)}/moderation`,{decision,revision:a.moderation.revision,reason:this.reason.trim()},{headers:await this.auth.headers()}).pipe(timeout(20000)));if(!this.destroyed){this.selected=null;await this.refresh();}}catch(e:any){if(!this.destroyed){this.error=this.t(e.status===409?'changed':e.status===403?'forbidden':'error');if(e.status===409)this.selected=null;}}finally{if(!this.destroyed)this.working=false;}
 }
 get requestCount(){return (this.data?.assets||[]).filter((a:any)=>!a.archived&&a.moderation?.status==='pending').length;}
 get visible(){return this.rows.slice(this.page*this.pageSize,(this.page+1)*this.pageSize);}
 get pages(){return Math.max(1,Math.ceil(this.rows.length/this.pageSize));}
 get assetCount(){return (this.data?.assets||[]).filter((a:any)=>!a.archived).length;}
 get online(){return (this.data?.assets||[]).filter((a:any)=>a.public).length;}
 get activeSubscriptions(){return (this.data?.subscriptions||[]).filter((b:any)=>b.entitled).length;}
 ownerName(uid:string){return this.data?.owners?.find((o:any)=>o.uid===uid)?.name||uid||'—';}
}
