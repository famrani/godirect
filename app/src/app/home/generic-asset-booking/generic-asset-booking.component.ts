import {inject} from '@angular/core';
import {UiTextService} from '../../services/ui-text.service';
import {ActivatedRoute} from '@angular/router';
import {localDateTime} from '../../services/discovery-search';
import { ReservationAuthService } from '../../services/reservation-auth.service';
import { firstValueFrom } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../services/resource-context.service';
@Component({selector:'app-generic-asset-booking',templateUrl:'./generic-asset-booking.component.html',styleUrls:['./generic-asset-booking.component.scss'],standalone:false})
export class GenericAssetBookingComponent implements OnInit {
 private readonly uiText=inject(UiTextService);
 @Input() kind:'parking'|'property'|'pool'|'boat'='parking'; @Input() admin=false; asset:any=null; quote:any=null; error=''; message=''; saving=false;
 form:any={startDate:'',startTime:'09:00',endDate:'',endTime:'18:00',customerId:'guest',customerName:'',customerEmail:'',customerPhone:'',guests:1,vehiclePlate:'',comments:''};
 constructor(private http:HttpClient,public ctx:ResourceContextService,private auth:ReservationAuthService,private route:ActivatedRoute){}
 ngOnInit(){this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe(a=>{this.asset=a;if(this.kind==='parking'){this.form.startTime=a.availability?.defaultStart||'00:00';this.form.endTime=a.availability?.defaultEnd||'23:59';}else{this.form.startTime=a.properties?.checkIn||'16:00';this.form.endTime=a.properties?.checkOut||'10:00';}const q=this.route?.snapshot.queryParamMap;const start=localDateTime(q?.get('startAt')||''),end=localDateTime(q?.get('endAt')||'');if(start&&end&&Date.parse(q?.get('endAt')||'')>Date.parse(q?.get('startAt')||'')){this.form.startDate=start.slice(0,10);this.form.startTime=start.slice(11,16);this.form.endDate=end.slice(0,10);this.form.endTime=end.slice(11,16);}});}
 get isParking(){return this.kind==='parking';}
 private dateTime(date:string,time:string):string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date||'') || !/^\d{2}:\d{2}$/.test(time||'')) throw new Error('missing_booking_dates');
  const local=`${date}T${time}:00`;
  const parsed=new Date(local);
  if (!Number.isFinite(parsed.getTime()) || parsed.getFullYear()!==Number(date.slice(0,4)) || parsed.getMonth()+1!==Number(date.slice(5,7)) || parsed.getDate()!==Number(date.slice(8,10)) || parsed.getHours()!==Number(time.slice(0,2)) || parsed.getMinutes()!==Number(time.slice(3,5))) throw new Error('invalid_booking_dates');
  return parsed.toISOString();
 }
 private validatedPayload(requireCustomer=false):any {
  const startAt=this.dateTime(this.form.startDate,this.form.startTime);
  const endAt=this.dateTime(this.form.endDate,this.form.endTime);
  if(new Date(endAt).getTime()<=new Date(startAt).getTime()) throw new Error('end_before_start');
  if(requireCustomer && (!String(this.form.customerName||'').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(this.form.customerEmail||'')))) throw new Error('missing_customer_details');
  return {assetId:this.ctx.resourceId,customerId:this.form.customerId||'guest',customerName:this.form.customerName,customerEmail:this.form.customerEmail,customerPhone:this.form.customerPhone,startAt,endAt,guests:Number(this.form.guests||1),vehiclePlate:this.form.vehiclePlate,comments:this.form.comments};
 }
 private explain(e:any):string {
  const code=e?.error?.error||e?.message;
  if(code==='missing_booking_dates') return this.uiText.text('Sélectionnez les dates et heures d’entrée et de sortie.');
  if(code==='invalid_booking_dates') return this.uiText.text('Dates ou heures de réservation invalides.');
  if(code==='end_before_start') return this.uiText.text('La sortie doit être postérieure à l’entrée.');
  if(code==='missing_customer_details') return this.uiText.text('Renseignez votre nom et une adresse e-mail valide.');
  if(code==='asset_unavailable') return this.uiText.text('Indisponible pour cette période.');
  if(code==='too_many_guests') return this.uiText.text('Le nombre de voyageurs dépasse la capacité.');
  return this.uiText.text('Erreur')+' '+(e?.status||'')+' : '+this.uiText.text(code||'Service indisponible');
 }
 calculate(){
  this.error='';this.message='';this.quote=null;
  let payload:any;
  try { payload=this.validatedPayload(); } catch(e){this.error=this.explain(e);return;}
  this.http.post<any>(`/api/${this.kind}-bookings/quote`,payload).subscribe({next:q=>this.quote=q,error:e=>this.error=this.explain(e)});
 }
 async book(){
  this.error='';this.message='';
  let payload:any;
  try {payload=this.validatedPayload(true);} catch(e){this.error=this.explain(e);return;}
  let headers;try{headers=await this.auth.headers();}catch(e){this.error=this.explain(e);return;}
  this.saving=true;
  this.http.post<any>(`/api/${this.kind}-bookings${this.admin?'?admin=1':''}`,payload,{headers}).subscribe({next:b=>{this.saving=false;this.quote=b.pricing;this.message=this.uiText.text('Réservation en attente : {id}. Retrouvez-la dans Mes réservations pour payer l’acompte et enregistrer la garantie.').replace('{id}',String(b.id));},error:e=>{this.saving=false;this.error=this.explain(e);}});
 }
}
