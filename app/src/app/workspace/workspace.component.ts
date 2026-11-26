import {assetDomainSlug} from '../services/asset-domain';
import {MessageLinkComponent} from '../messaging/message-link.component';
import {ProfileRolesComponent} from '../profile-roles/profile-roles.component';
import {Component,OnInit,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';import {FormsModule} from '@angular/forms';import {ActivatedRoute,RouterModule} from '@angular/router';import {HttpClient} from '@angular/common/http';import {firstValueFrom,Subscription,combineLatest} from 'rxjs';
import {PlatformLayoutComponent} from '../layout/platform-layout/platform-layout.component';import {ReservationAuthService} from '../services/reservation-auth.service';import {AssetAccessService} from '../services/asset-access.service';import {LanguageService} from '../services/language.service';import {accountHeaderText} from '../services/account-header';import {assetLink,ownedAssets} from '../services/workspace-navigation';
@Component({selector:'app-workspace',standalone:true,imports:[MessageLinkComponent,CommonModule,FormsModule,RouterModule,PlatformLayoutComponent,ProfileRolesComponent],templateUrl:'./workspace.component.html',styleUrls:['./workspace.component.scss']})
export class WorkspaceComponent implements OnInit,OnDestroy{
 readonly storefront=typeof location==='undefined'?null:assetDomainSlug(location.hostname);
 get bookingScopeLabel(){const fr=this.language.currentLanguage==='fr';return this.storefront?(fr?'Vos réservations auprès de ':'Your bookings with ')+this.storefront:(fr?'Vos réservations auprès de tous les propriétaires GoDirect.':'Your bookings with all GoDirect owners.');}
 needsLogin=false;

 owner=false;kind='reservations';assets:any[]=[];rows:any[]=[];selected='';loading=false;error='';saved=false;profile:any={};private sub?:Subscription;private request=0;uid='';
 constructor(private http:HttpClient,private auth:ReservationAuthService,public access:AssetAccessService,public language:LanguageService,private route:ActivatedRoute){}
 t(key:string){return accountHeaderText(this.language.currentLanguage,key);}
 ngOnInit(){this.sub=combineLatest([this.route.paramMap,this.route.queryParamMap]).subscribe(()=>{this.owner=this.route.snapshot.data['owner']===true;this.kind=this.route.snapshot.data['kind']||this.route.snapshot.paramMap.get('section')||'reservations';if(!['profile','reservations','bookings','payments','ratings'].includes(this.kind))this.kind='reservations';const q=this.route.snapshot.queryParamMap;this.selected=q.get('type')&&q.get('id')?`${q.get('type')}/${q.get('id')}`:'';void this.refresh();});}
 ngOnDestroy(){this.request++;this.sub?.unsubscribe();this.rows=[];this.assets=[];}
 path(a:any,tail='home'){return assetLink(a,tail);}
 get concierge(){return this.route?.snapshot?.data?.['concierge']===true;}
 get visible(){const q=this.route.snapshot.queryParamMap,id=q.get('bookingId');return this.rows.filter(b=>(!this.selected||`${b.assetType}/${b.assetId}`===this.selected)&&(!this.owner||this.kind!=='reservations'||!id||((b.bookingId||b.id)===id&&b.assetType===q.get('assetType')&&b.assetId===q.get('assetId'))));}
 detail(b:any){return assetLink(b,this.owner?'admin/reservations':'my-bookings');}
 async refresh(){const request=++this.request;this.loading=true;this.needsLogin=false;this.error='';this.rows=[];try{const user=await this.auth.user(),uid=user.uid,headers=await this.auth.headers();this.uid=uid;
  if(this.kind==='profile'){const p=await firstValueFrom(this.http.get<any>('/api/me/profile',{headers}));if(request!==this.request||(await this.auth.user()).uid!==uid)return;this.profile=p;this.avatar={photo:'',googleAvailable:false};this.avatarUnavailable=false;await this.loadAvatar(uid,headers,request).catch(()=>{if(request===this.request)this.avatarUnavailable=true;});}
  else if(this.owner){const list=await firstValueFrom(this.http.get<any[]>(this.concierge?'/api/concierge/assets':'/api/owner/listings',{headers}));if(request!==this.request||(await this.auth.user()).uid!==uid)return;this.assets=this.concierge?list.filter(a=>a.permissions?.bookings):ownedAssets(list,uid);if(this.selected&&!this.assets.some(a=>`${a.assetType}/${a.id}`===this.selected))throw new Error('owner_required');
   if(this.kind==='ratings'){if(!this.selected&&this.assets.length===1)this.selected=`${this.assets[0].assetType}/${this.assets[0].id}`;if(this.selected){const [type,id]=this.selected.split('/');const ratings=await firstValueFrom(this.http.get<any[]>(`/api/manage/assets/${type}/${id}/feedbacks`,{headers}));if(request===this.request&&(await this.auth.user()).uid===uid)this.rows=ratings;}}
   else{const rows=await firstValueFrom(this.http.get<any[]>(this.concierge?'/api/manage/bookings':`/api/owners/${encodeURIComponent(uid)}/bookings`,{headers}));if(request===this.request&&(await this.auth.user()).uid===uid)this.rows=rows.filter(b=>(this.concierge||b.ownerId===uid)&&this.assets.some(a=>a.assetType===b.assetType&&a.id===b.assetId));}}
  else{const rows=await firstValueFrom(this.http.get<any[]>(this.kind==='ratings'?'/api/me/feedbacks':'/api/me/bookings',{headers}));if(request===this.request&&(await this.auth.user()).uid===uid)this.rows=rows;}
 }catch{if(request===this.request){this.rows=[];this.assets=[];this.needsLogin=this.kind==='bookings'&&!this.access.authenticatedUid;this.error=this.needsLogin?'':this.t('error');}}finally{if(request===this.request)this.loading=false;}}
 avatar={photo:'',googleAvailable:false};avatarBusy=false;avatarUnavailable=false;avatarNotice='';
 fr(en:string,fr:string){return this.language.currentLanguage==='fr'?fr:en;}
 private async loadAvatar(uid:string,headers:Awaited<ReturnType<ReservationAuthService['headers']>>,request=this.request){
  const avatar=await firstValueFrom(this.http.get<typeof this.avatar>('/api/me/avatar',{headers}));
  if(request===this.request&&uid===this.uid)this.avatar=avatar;
 }
 async updateAvatar(source:'google'|'none'|'upload',event?:Event){
  const input=event?.target as HTMLInputElement|undefined,file=input?.files?.[0];
  if(input)input.value='';
  if(this.avatarBusy||(source==='upload'&&!file))return;
  const uid=this.uid,request=this.request;
  this.avatarBusy=true;this.avatarNotice='';
  try{
   const headers=await this.auth.headers();
   if((await this.auth.user()).uid!==uid)throw Error('authentication_changed');
   let photo='';
   if(file&&source==='upload'){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8000000)throw Error('invalid_avatar');
    const bitmap=await createImageBitmap(file);
    try{
     const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
     const ctx=canvas.getContext('2d');if(!ctx)throw Error('invalid_avatar');
     const side=Math.min(bitmap.width,bitmap.height);
     ctx.fillStyle='#fff';ctx.fillRect(0,0,256,256);
     ctx.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,256,256);
     photo=canvas.toDataURL('image/jpeg',0.82);
    }finally{bitmap.close();}
   }
   if((await this.auth.user()).uid!==uid)throw Error('authentication_changed');
   await firstValueFrom(this.http.put('/api/me/avatar',{source,photo},{headers}));
   await this.loadAvatar(uid,headers,request);
   void this.access.refreshAvatar();
   if(request===this.request)this.avatarNotice=this.fr('Profile photo updated.','Photo de profil mise à jour.');
  }catch{if(request===this.request)this.avatarNotice=this.fr('Unable to save the photo. Use JPEG, PNG or WebP up to 8 MB.','Impossible d’enregistrer la photo. Utilisez un JPEG, PNG ou WebP de 8 Mo maximum.');}
  finally{this.avatarBusy=false;}
 }
 reviewDone=new Set<string>();
 reviewKey(b:any){return [this.uid,this.owner?'owner':'client',b.assetType,b.assetId,b.id||b.bookingId].join('/');}
 reviewLabel(b:any){if(b.direction==='owner-to-client')return this.owner?this.fr('Review left for the customer','Avis laissé au client'):this.fr('Review from the owner','Avis reçu du propriétaire');return b.direction==='client-to-owner'?(this.owner?this.fr('Review from the customer','Avis reçu du client'):this.fr('Review left for the owner','Avis laissé au propriétaire')):this.fr('Review','Avis');}
 reviewRow:any;stars=5;comment='';reviewBusy=false;reviewNotice='';
 canReview(b:any){return !this.concierge&&!(b.ownerId&&b.ownerId===b.customerId)&&!this.reviewDone.has(this.reviewKey(b))&&['bookings','reservations'].includes(this.kind)&&['confirmed','completed'].includes(b.status)&&Date.parse(b.endAt)<=Date.now();}
 async submitReview(b:any){this.reviewBusy=true;try{await firstValueFrom(this.http.put('/api/stay-reviews/'+[b.assetType,b.assetId,b.id||b.bookingId].map(encodeURIComponent).join('/'),{role:this.owner?'owner':'client',rating:Number(this.stars),comments:this.comment},{headers:await this.auth.headers()}));this.reviewDone.add(this.reviewKey(b));this.reviewRow=null;this.reviewNotice=this.fr('Review saved.','Avis enregistré.');}catch(e:any){if(e?.error?.error==='review_already_exists'){this.reviewDone.add(this.reviewKey(b));this.reviewRow=null;this.reviewNotice=this.fr('You have already reviewed this booking.','Vous avez déjà laissé un avis pour cette réservation.');}else this.reviewNotice=this.fr('Unable to save the review.','Impossible d’enregistrer cet avis.');}finally{this.reviewBusy=false;}}
 async save(){if(this.loading)return;this.loading=true;this.needsLogin=false;this.error='';this.saved=false;try{if((await this.auth.user()).uid!==this.uid)throw new Error('authentication_changed');const p=this.profile;await firstValueFrom(this.http.put('/api/me/profile',{firstname:p.firstname||'',lastname:p.lastname||'',phone:p.phone||'',address:p.address||'',displayName:[p.firstname,p.lastname].filter(Boolean).join(' ')},{headers:await this.auth.headers()}));await this.access.refresh();this.saved=true;}catch{this.error=this.t('error');}finally{this.loading=false;}}
}
