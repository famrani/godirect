import {FormsModule} from '@angular/forms';
import {StoreDbService} from 'godigital-lib';
import {Component,HostListener,OnInit,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute,RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Subscription,firstValueFrom,timeout} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {LanguageService} from '../services/language.service';
import {AssetAccessService} from '../services/asset-access.service';
import {monthCells,parisDay} from '../services/asset-calendar-view';
const KEYS=['calendar','busy','available','previous','next','today','refresh','loading','error','publicIntro','privateIntro','details','customer','status','period','back','timezone','manage'];
const TEXT:Record<string,string[]>={
 fr:['Calendrier','Occupé','Aucune occupation enregistrée','Mois précédent','Mois suivant','Aujourd’hui','Actualiser','Chargement…','Impossible de charger le calendrier.','Seules les périodes occupées sont affichées. Les informations des réservations restent privées.','Sélectionnez une réservation pour consulter son détail.','Détail de la réservation','Client','Statut','Période','Voir le bien','Horaires : Europe/Paris','Ouvrir la réservation'],
 en:['Calendar','Busy','No recorded occupancy','Previous month','Next month','Today','Refresh','Loading…','Unable to load the calendar.','Only busy periods are shown. Booking information remains private.','Select a booking to view its details.','Booking details','Customer','Status','Period','View asset','Times: Europe/Paris','Open booking'],
 es:['Calendario','Ocupado','Sin ocupación registrada','Mes anterior','Mes siguiente','Hoy','Actualizar','Cargando…','No se puede cargar el calendario.','Solo se muestran períodos ocupados. Los datos de las reservas son privados.','Seleccione una reserva para ver sus detalles.','Detalles de la reserva','Cliente','Estado','Período','Ver bien','Horario: Europe/Paris','Abrir reserva'],
 it:['Calendario','Occupato','Nessuna occupazione registrata','Mese precedente','Mese successivo','Oggi','Aggiorna','Caricamento…','Impossibile caricare il calendario.','Sono mostrati solo i periodi occupati. Le informazioni delle prenotazioni sono private.','Seleziona una prenotazione per vedere i dettagli.','Dettagli della prenotazione','Cliente','Stato','Periodo','Vedi bene','Orari: Europe/Paris','Apri prenotazione'],
 de:['Kalender','Belegt','Keine Belegung erfasst','Vorheriger Monat','Nächster Monat','Heute','Aktualisieren','Laden…','Kalender konnte nicht geladen werden.','Nur belegte Zeiträume werden angezeigt. Buchungsdaten bleiben privat.','Buchung auswählen, um Details anzuzeigen.','Buchungsdetails','Kunde','Status','Zeitraum','Objekt ansehen','Zeiten: Europe/Paris','Buchung öffnen'],
 nl:['Kalender','Bezet','Geen bezetting geregistreerd','Vorige maand','Volgende maand','Vandaag','Vernieuwen','Laden…','Kalender kan niet worden geladen.','Alleen bezette perioden worden getoond. Boekingsgegevens blijven privé.','Selecteer een boeking om details te bekijken.','Boekingsdetails','Klant','Status','Periode','Object bekijken','Tijden: Europe/Paris','Boeking openen'],
 ru:['Календарь','Занято','Занятость не зарегистрирована','Предыдущий месяц','Следующий месяц','Сегодня','Обновить','Загрузка…','Не удалось загрузить календарь.','Показаны только занятые периоды. Данные бронирований скрыты.','Выберите бронирование для просмотра деталей.','Детали бронирования','Клиент','Статус','Период','Посмотреть объект','Время: Europe/Paris','Открыть бронирование']
};
@Component({selector:'app-asset-calendar',standalone:true,imports:[CommonModule,RouterModule,FormsModule],templateUrl:'./asset-calendar.component.html',styleUrls:['./asset-calendar.component.scss']})
export class AssetCalendarComponent implements OnInit,OnDestroy{
 from='';to='';action='personal';rate:number|null=null;baseRate:number|null=null;second=false;saving=false;notice='';
 validRate(value:number|null){return typeof value==='number'&&Number.isFinite(value)&&value>0&&value<=1000000&&Math.abs(Math.round(value*100)-value*100)<0.000001;}
 async save(base=false){
  if(this.saving||!this.data?.isOwner||(base?!this.validRate(this.baseRate):!this.from||!this.to||this.from>this.to||(this.action==='rate'&&!this.validRate(this.rate))))return;
  const type=this.type,id=this.id;
  const payload=base?{action:'baseRate',rate:this.baseRate}:{start:this.from,end:this.to,action:this.action,rate:this.rate};
  this.saving=true;this.notice='';
  try{await firstValueFrom(this.http.patch('/api/assets/'+[type,id].map(encodeURIComponent).join('/')+'/calendar',payload,{headers:await this.auth.headers()}));if(type!==this.type||id!==this.id)return;await this.load();if(!this.error)this.notice=base?'Tarif de base enregistré.':'Calendrier enregistré.';}
  catch(e:any){if(type===this.type&&id===this.id)this.notice=e?.status===409?'Cette période contient déjà une réservation.':'Modification impossible. Vérifiez les dates, le tarif et vos droits.';}
  finally{this.saving=false;}
 }
 type='';id='';data:any=null;events:any[]=[];busy=false;error=false;year=Number(parisDay(Date.now()).slice(0,4));month=Number(parisDay(Date.now()).slice(5,7))-1;selectedDay='';selectedEvent:any=null;private sequence=0;private sub?:Subscription;
 constructor(private http:HttpClient,private route:ActivatedRoute,private auth:ReservationAuthService,public language:LanguageService,private access:AssetAccessService,private store:StoreDbService){}
 ngOnInit(){this.sub=this.route.paramMap.subscribe(p=>{this.endRange();this.skipClick=false;this.from=this.to='';this.notice='';this.second=false;this.type=p.get('type')||'';this.id=p.get('id')||'';void this.load();});}
 ngOnDestroy(){this.sequence++;this.sub?.unsubscribe();this.data=null;this.events=[];this.selectedEvent=null;}
 t(key:string){return (TEXT[this.language.currentLanguage]||TEXT.en)[KEYS.indexOf(key)]||key;}
 private grid=monthCells(this.year,this.month);private gridKey=this.year+':'+this.month;
 get cells(){const k=this.year+':'+this.month;if(k!==this.gridKey){this.grid=monthCells(this.year,this.month);this.gridKey=k;}return this.grid;}
 readonly trackDay=(_:number,c:{key:string})=>c.key;
 private byDay=new Map<string,any[]>();private empty:any[]=[];
 private indexEvents(){this.byDay.clear();const cells=this.cells;for(const event of this.events){const a=Date.parse(event.startAt),z=Date.parse(event.endAt);if(!Number.isFinite(a)||!Number.isFinite(z)||a>=z)continue;const first=parisDay(a),last=parisDay(z-1);for(const c of cells){if(c.key<first||c.key>last)continue;const bucket=this.byDay.get(c.key)||[];bucket.push(event);this.byDay.set(c.key,bucket);}}}
 get heading(){return new Intl.DateTimeFormat(this.language.currentLanguage,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(this.year,this.month,1)));}
 get weekdays(){return Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(this.language.currentLanguage,{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,5+i))));}
 private priceFormat?:Intl.NumberFormat;private priceFormatKey='';
 dayPrice(key:string){
  const value=this.data?.days?.[key]?.rate??this.data?.basePrice;
  if(typeof value!=='number'||!Number.isFinite(value))return '—';
  const currency=/^[A-Z]{3}$/.test(this.data?.currency)?this.data.currency:'EUR',locale=this.language.currentLanguage;
  const formatKey=locale+'|'+currency;
  if(!this.priceFormat||formatKey!==this.priceFormatKey){this.priceFormat=new Intl.NumberFormat(locale,{style:'currency',currency,minimumFractionDigits:0,maximumFractionDigits:2});this.priceFormatKey=formatKey;}
  return this.priceFormat.format(value);
 }
 dayEvents(key:string){return this.byDay.get(key)||this.empty;}
 occupied(key:string){return this.data?.days?.[key]?.blocked||this.dayEvents(key).some(e=>!['cancelled','canceled','rejected','refused'].includes(String(e.status||'').toLowerCase()));}
 today(key:string){return key===parisDay(Date.now());}
 change(delta:number){const d=new Date(Date.UTC(this.year,this.month+delta,1));this.year=d.getUTCFullYear();this.month=d.getUTCMonth();void this.load();}
 now(){const d=new Date(parisDay(Date.now())+'T12:00:00Z');this.year=d.getUTCFullYear();this.month=d.getUTCMonth();void this.load();}
 private anchor='';private moved=false;private skipClick=false;
 startRange(e:PointerEvent,key:string){if(!this.data?.isOwner||this.saving||e.pointerType!=='mouse'||e.button!==0||(e.target as Element).closest('.event,.more-events'))return;this.skipClick=false;this.anchor=key;this.moved=false;}
 extendRange(e:PointerEvent,key:string){if(!this.anchor||e.pointerType!=='mouse')return;if(!(e.buttons&1)){this.endRange();return;}if(key!==this.anchor)this.moved=true;if(!this.moved)return;this.from=key<this.anchor?key:this.anchor;this.to=key>this.anchor?key:this.anchor;this.selectedDay=key;this.selectedEvent=null;this.second=false;}
 @HostListener('window:pointerup') @HostListener('window:blur') @HostListener('window:pointercancel')
 endRange(){if(this.anchor)this.skipClick=this.moved;this.anchor='';this.moved=false;}
 clickCell(e:MouseEvent,key:string){if(e.detail && this.skipClick){this.skipClick=false;return;}this.skipClick=false;this.selectDay(key);}
 selectDay(key:string){if(this.data?.isOwner){if(!this.second){this.from=this.to=key;}else{this.to=key;if(this.from>key)[this.from,this.to]=[key,this.from];}this.second=!this.second;}this.selectedDay=key;this.selectedEvent=null;}
 bookingLink(e:any){return e.source==='legacy'?['/',this.type,this.id,'admin','reservations',e.id]:['/',this.data.isOwner?'owner':'concierge','activity','reservations'];}
 bookingQuery(e:any){return e.source==='legacy'?{}:{bookingId:e.id,assetType:this.type,assetId:this.id};}
 selectEvent(e:any){if(this.data?.canViewDetails)this.selectedEvent=e;}
 period(e:any){const f=new Intl.DateTimeFormat(this.language.currentLanguage,{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Paris'});return f.format(new Date(e.startAt))+' → '+f.format(new Date(e.endAt));}
 status(value:string){const keys=['pending','confirmed','completed','cancelled','rejected'];const copy:Record<string,string[]>={fr:['En attente','Confirmée','Terminée','Annulée','Refusée'],en:['Pending','Confirmed','Completed','Cancelled','Rejected'],es:['Pendiente','Confirmada','Finalizada','Cancelada','Rechazada'],it:['In attesa','Confermata','Completata','Annullata','Rifiutata'],de:['Ausstehend','Bestätigt','Abgeschlossen','Storniert','Abgelehnt'],nl:['In afwachting','Bevestigd','Voltooid','Geannuleerd','Afgewezen'],ru:['В ожидании','Подтверждено','Завершено','Отменено','Отклонено']};const index=keys.indexOf(value==='canceled'?'cancelled':value);return index<0?value:(copy[this.language.currentLanguage]||copy.en)[index];}
 async load(){const seq=++this.sequence;this.endRange();this.skipClick=false;this.data=null;this.events=[];this.byDay.clear();this.selectedDay='';this.selectedEvent=null;this.busy=true;this.error=false;
  try{const deadline=Date.now()+15000;const store:any=this.store;while(!(store.firebaseauth||store.firebaseAuth||store.auth)&&Date.now()<deadline){await new Promise<void>(resolve=>setTimeout(resolve,100));}if(seq!==this.sequence)return;let headers;try{headers=await this.auth.headers();}catch{}const uid=this.access.authenticatedUid;
   const cells=this.cells;const params={start:new Date(Date.parse(cells[0].key+'T00:00:00Z')-86400000).toISOString(),end:new Date(Date.parse(cells[cells.length-1].key+'T00:00:00Z')+2*86400000).toISOString()};
   const data=await firstValueFrom(this.http.get<any>('/api/assets/'+[this.type,this.id].map(encodeURIComponent).join('/')+'/calendar',{headers,params}).pipe(timeout(15000)));
   if(seq!==this.sequence)return;if(uid&&uid!==this.access.authenticatedUid){this.error=true;return;}this.data=data;this.baseRate=data.basePrice??null;this.events=data.events||[];this.indexEvents();
  }catch{if(seq===this.sequence)this.error=true;}finally{if(seq===this.sequence)this.busy=false;}
 }
}
