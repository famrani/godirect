import {inject} from '@angular/core';
import {UiTextService} from '../../../../services/ui-text.service';
import {localDateTime} from '../../../../services/discovery-search';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreDbService } from 'godigital-lib';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({selector:'app-car-booking',templateUrl:'./car-booking.component.html',styleUrls:['./car-booking.component.scss'],standalone:false})
export class CarBookingComponent implements OnInit {
 private readonly uiText=inject(UiTextService);
  assetId=''; adminMode=false; authRequired=false; asset:any=null; quote:any=null; quotedPayload=''; saving=false; calculating=false; message=''; error='';
  private quoteRequestId=0;
  private hasCalculated=false;
  form:any={customerId:'guest',customerName:'',customerEmail:'',customerPhone:'',startDate:'',startTime:'09:00',endDate:'',endTime:'18:00',pickupLocation:'',returnLocation:'',driverAge:25,licenseCountry:'FR',additionalDriver:false,childSeat:false,comments:''};
  constructor(private route:ActivatedRoute,private router:Router,private http:HttpClient,private storeDb:StoreDbService){}
  get authUser():any { const db:any=this.storeDb; return db.firebaseauth?.currentUser || db.firebaseAuth?.currentUser || db.auth?.currentUser || null; }
  private syncCustomer():void { const u=this.authUser; if(!u)return; if(!this.adminMode){this.form.customerId=u.uid;this.form.customerEmail=u.email||'';this.form.customerName=this.form.customerName||u.displayName||'';} this.authRequired=false; }
  login():void { const returnUrl=this.router.url; this.router.navigate(['/car',this.assetId,'login'],{queryParams:{returnUrl}}); }
  signup():void { const returnUrl=this.router.url; this.router.navigate(['/car',this.assetId,'signup'],{queryParams:{returnUrl}}); }
  private async bookingHeaders():Promise<HttpHeaders> { const u=this.authUser; if(!u?.getIdToken)throw new Error('Veuillez vous connecter pour réserver.'); return new HttpHeaders({Authorization:'Bearer '+await u.getIdToken()}); }
  ngOnInit(){const q=this.route.snapshot.queryParamMap;const start=localDateTime(q.get('startAt')||''),end=localDateTime(q.get('endAt')||'');if(start&&end&&Date.parse(q.get('endAt')||'')>Date.parse(q.get('startAt')||'')){this.form.startDate=start.slice(0,10);this.form.startTime=start.slice(11,16);this.form.endDate=end.slice(0,10);this.form.endTime=end.slice(11,16);} this.adminMode=this.route.snapshot.queryParamMap.get('admin')==='1'; this.syncCustomer(); this.authRequired=!this.authUser; this.assetId=String(this.route.parent?.snapshot.paramMap.get('assetId')||''); this.http.get<any>(`/api/assets/${encodeURIComponent(this.assetId)}`).subscribe({next:a=>{this.asset=a;this.form.pickupLocation=a?.location?.city||'';this.form.returnLocation=this.form.pickupLocation;},error:()=>this.error='Voiture introuvable.'}); }
  get quoteIsCurrent():boolean { return !!this.quote && this.quotedPayload === this.pricingSignature(); }
  private pricingSignature():string { const p=this.payload(); return JSON.stringify({assetId:p.assetId,startAt:p.startAt,endAt:p.endAt,additionalDriver:p.additionalDriver,childSeat:p.childSeat}); }
  onBookingChanged(){this.quoteRequestId++;this.quote=null;this.quotedPayload='';this.message='';this.error='';this.calculating=false;}
  onCustomerChanged(){this.message='';this.error='';}
  onOptionChanged(){
    const shouldRecalculate=this.hasCalculated;
    this.onBookingChanged();
    if(shouldRecalculate) this.calculate();
  }
  private payload(){return {assetId:this.assetId,customerId:this.adminMode ? (this.form.customerId||'external') : (this.authUser?.uid||''),customerName:this.form.customerName,customerEmail:this.form.customerEmail,customerPhone:this.form.customerPhone,startAt:new Date(`${this.form.startDate}T${this.form.startTime}:00`).toISOString(),endAt:new Date(`${this.form.endDate}T${this.form.endTime}:00`).toISOString(),pickupLocation:this.form.pickupLocation,returnLocation:this.form.returnLocation,driverAge:Number(this.form.driverAge),licenseCountry:this.form.licenseCountry,additionalDriver:!!this.form.additionalDriver,childSeat:!!this.form.childSeat,comments:this.form.comments};}
  private datesValid():boolean {
    const start=String(this.form.startDate||''); const end=String(this.form.endDate||'');
    const timeStart=String(this.form.startTime||''); const timeEnd=String(this.form.endTime||'');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||!/^\d{2}:\d{2}$/.test(timeStart)||!/^\d{2}:\d{2}$/.test(timeEnd)) return false;
    const a=new Date(`${start}T${timeStart}:00`),b=new Date(`${end}T${timeEnd}:00`);
    return Number.isFinite(a.getTime())&&Number.isFinite(b.getTime())&&b.getTime()>a.getTime();
  }
  calculate(){
    this.error='';this.quote=null;this.quotedPayload='';
    if(!this.datesValid()){this.calculating=false;this.error='Sélectionnez des dates et heures valides : la restitution doit être après la prise en charge.';return;}
    const p=this.payload(); const signature=this.pricingSignature(); const requestId=++this.quoteRequestId;
    this.calculating=true;
    this.http.post<any>('/api/car-bookings/quote',p).subscribe({
      next:q=>{if(requestId!==this.quoteRequestId||signature!==this.pricingSignature())return;this.quote=q;this.quotedPayload=signature;this.calculating=false;this.hasCalculated=true;},
      error:e=>{if(requestId!==this.quoteRequestId)return;this.calculating=false;this.error=e?.error?.error==='asset_unavailable'?this.uiText.text('Indisponible pour cette période.'):this.uiText.text('Impossible de calculer le prix')+(e?.error?.error?' : '+this.uiText.text(e.error.error):'');}
    });
  }
  async book(){
    this.error='';this.message='';
    if(!this.authUser){this.authRequired=true;this.error='Connectez-vous ou créez un compte pour réserver.';return;}
    this.syncCustomer();
    if(!this.datesValid()){this.error='Dates de réservation invalides.';return;}
    if(!this.form.customerName?.trim()||!/^\S+@\S+\.\S+$/.test(String(this.form.customerEmail||''))){this.error='Renseignez le nom du conducteur et une adresse e-mail valide.';return;}
    if(!this.quoteIsCurrent){this.error='Calculez le prix avant de demander la réservation.';return;}
    this.saving=true;
    const p=this.payload();const signature=this.pricingSignature();
    let headers:HttpHeaders; try { headers=await this.bookingHeaders(); } catch(e:any){this.saving=false;this.error=e.message;return;}
    this.http.post<any>('/api/car-bookings'+(this.adminMode?'?admin=1':''),p,{headers}).subscribe({next:b=>{this.saving=false;this.message=this.uiText.text('Demande de réservation créée : {id}').replace('{id}',String(b.id));this.quote=b.pricing;this.quotedPayload=signature;},error:e=>{this.saving=false;this.error=e?.error?.error==='asset_unavailable'?this.uiText.text('Indisponible pour cette période.'):this.uiText.text('Impossible de créer la réservation')+(e?.error?.error?' : '+this.uiText.text(e.error.error):'');}});
  }
}
