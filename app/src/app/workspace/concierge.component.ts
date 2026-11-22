import {MessageLinkComponent} from '../messaging/message-link.component';
import {AssetListFiltersComponent} from '../shared/asset-list-filters.component';
import {emptyAssetFilters,matchesAssetFilters,sortAssetRows,searchText} from '../shared/asset-list-filters';
import {AssetCalendarLinkComponent} from '../calendar/asset-calendar-link.component';
import {Component,OnInit,OnDestroy} from '@angular/core';import {CommonModule} from '@angular/common';import {FormsModule} from '@angular/forms';import {RouterModule,ActivatedRoute} from '@angular/router';import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';
import {PlatformLayoutComponent} from '../layout/platform-layout/platform-layout.component';import {ReservationAuthService} from '../services/reservation-auth.service';import {AssetAccessService} from '../services/asset-access.service';import {LanguageService} from '../services/language.service';import {conciergeText} from '../services/concierge-text';
@Component({selector:'app-concierge',standalone:true,imports:[MessageLinkComponent,AssetListFiltersComponent,AssetCalendarLinkComponent,CommonModule,FormsModule,RouterModule,PlatformLayoutComponent],templateUrl:'./concierge.component.html',styleUrls:['./concierge.component.scss']})
export class ConciergeComponent implements OnInit,OnDestroy{
 filters=emptyAssetFilters();
 rows:any[]=[];payments:any[]=[];uid='';busy=false;error='';message='';selected='';query='';email='';confirm:any=null;permissions:any={content:true,bookings:true,customers:true,payments:true};readonly permissionKeys=['content','bookings','customers','payments'];private sequence=0;
 constructor(private http:HttpClient,private auth:ReservationAuthService,public access:AssetAccessService,public language:LanguageService,private route:ActivatedRoute){}
 get delegation(){return this.route.snapshot.data['delegations']===true;}
 t(key:string){return conciergeText(this.language.currentLanguage,key);}
 get asset(){return this.rows.find(a=>a.assetType+'/'+a.id===this.selected);}
 get filtered(){const q=searchText(this.query);return sortAssetRows(this.rows.filter(a=>matchesAssetFilters(a,this.filters)&&searchText([a.name,a.ownerName,a.prefix,a.id].join(' ')).includes(q)));}
 get hasPayments(){return this.rows.some(a=>a.permissions?.payments);}
 get hasCustomers(){return this.rows.some(a=>a.permissions?.customers);}
 get hasBookings(){return this.rows.some(a=>a.permissions?.bookings);}
 ngOnInit(){void this.refresh();}ngOnDestroy(){this.sequence++;this.rows=[];this.payments=[];}
 path(a:any,tail='home'){return ['/',a.assetType,a.id,...tail.split('/')];}
 async refresh(){if(this.busy)return;const sequence=++this.sequence;this.busy=true;this.error='';this.rows=[];this.payments=[];try{const uid=(await this.auth.user()).uid;this.uid=uid;const rows=await firstValueFrom(this.http.get<any[]>(this.delegation?'/api/owner/delegations':'/api/concierge/assets',{headers:await this.auth.headers()}));if(sequence!==this.sequence||(await this.auth.user()).uid!==uid)return;this.rows=rows;if(this.delegation&&!this.selected){const q=this.route.snapshot.queryParamMap,type=q?.get('type'),id=q?.get('id');if(type&&id&&rows.some(a=>a.assetType===type&&a.id===id))this.selected=type+'/'+id;}if(!this.delegation&&this.hasPayments){const payments=await firstValueFrom(this.http.get<any[]>('/api/concierge/payments',{headers:await this.auth.headers()}));if(sequence===this.sequence&&(await this.auth.user()).uid===uid)this.payments=payments;}await this.access.refresh();}catch{this.error=this.t('error');this.rows=[];this.payments=[];}finally{if(sequence===this.sequence)this.busy=false;}}
 async save(){if(this.busy||!this.asset||!this.email.trim()||!Object.values(this.permissions).some(Boolean))return;this.busy=true;this.error='';this.message='';try{if((await this.auth.user()).uid!==this.uid)throw Error('auth');await firstValueFrom(this.http.put('/api/owner/delegations/'+[this.asset.assetType,this.asset.id].map(encodeURIComponent).join('/'),{email:this.email.trim(),permissions:this.permissions},{headers:await this.auth.headers()}));this.message=this.t('saved');this.email='';}catch(e:any){this.error=this.t(e?.error?.error==='concierge_account_required'?'accountRequired':'error');}finally{this.busy=false;}if(!this.error)await this.refresh();}
 edit(g:any){this.email=g.email;this.permissions={...g.permissions};this.confirm=null;}
 async revoke(g:any){if(this.busy||!this.asset)return;this.busy=true;this.error='';try{if((await this.auth.user()).uid!==this.uid)throw Error('auth');await firstValueFrom(this.http.delete('/api/owner/delegations/'+[this.asset.assetType,this.asset.id,g.conciergeId].map(encodeURIComponent).join('/'),{headers:await this.auth.headers()}));this.confirm=null;this.message=this.t('revoked');}catch{this.error=this.t('error');}finally{this.busy=false;}if(!this.error)await this.refresh();}
}
