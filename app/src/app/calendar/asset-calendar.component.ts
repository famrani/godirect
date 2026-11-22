import {StoreDbService} from 'godigital-lib';
import {Component,OnInit,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute,RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Subscription,firstValueFrom,timeout} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {LanguageService} from '../services/language.service';
import {AssetAccessService} from '../services/asset-access.service';
import {monthCells,calendarEventOnDay,parisDay} from '../services/asset-calendar-view';
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
@Component({selector:'app-asset-calendar',standalone:true,imports:[CommonModule,RouterModule],templateUrl:'./asset-calendar.component.html',styleUrls:['./asset-calendar.component.scss']})
export class AssetCalendarComponent implements OnInit,OnDestroy{
 type='';id='';data:any=null;events:any[]=[];busy=false;error=false;year=Number(parisDay(Date.now()).slice(0,4));month=Number(parisDay(Date.now()).slice(5,7))-1;selectedDay='';selectedEvent:any=null;private sequence=0;private sub?:Subscription;
 constructor(private http:HttpClient,private route:ActivatedRoute,private auth:ReservationAuthService,public language:LanguageService,private access:AssetAccessService,private store:StoreDbService){}
 ngOnInit(){this.sub=this.route.paramMap.subscribe(p=>{this.type=p.get('type')||'';this.id=p.get('id')||'';void this.load();});}
 ngOnDestroy(){this.sequence++;this.sub?.unsubscribe();this.data=null;this.events=[];this.selectedEvent=null;}
 t(key:string){return (TEXT[this.language.currentLanguage]||TEXT.en)[KEYS.indexOf(key)]||key;}
 get cells(){return monthCells(this.year,this.month);}
 get heading(){return new Intl.DateTimeFormat(this.language.currentLanguage,{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(this.year,this.month,1)));}
 get weekdays(){return Array.from({length:7},(_,i)=>new Intl.DateTimeFormat(this.language.currentLanguage,{weekday:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,0,5+i))));}
 dayEvents(key:string){return this.events.filter(e=>calendarEventOnDay(e,key));}
 occupied(key:string){return this.dayEvents(key).some(e=>!['cancelled','canceled','rejected','refused'].includes(e.status));}
 today(key:string){return key===parisDay(Date.now());}
 change(delta:number){const d=new Date(Date.UTC(this.year,this.month+delta,1));this.year=d.getUTCFullYear();this.month=d.getUTCMonth();void this.load();}
 now(){const d=new Date(parisDay(Date.now())+'T12:00:00Z');this.year=d.getUTCFullYear();this.month=d.getUTCMonth();void this.load();}
 selectDay(key:string){this.selectedDay=key;this.selectedEvent=null;}
 selectEvent(e:any){if(this.data?.canViewDetails)this.selectedEvent=e;}
 period(e:any){const f=new Intl.DateTimeFormat(this.language.currentLanguage,{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Paris'});return f.format(new Date(e.startAt))+' → '+f.format(new Date(e.endAt));}
 status(value:string){const keys=['pending','confirmed','completed','cancelled','rejected'];const copy:Record<string,string[]>={fr:['En attente','Confirmée','Terminée','Annulée','Refusée'],en:['Pending','Confirmed','Completed','Cancelled','Rejected'],es:['Pendiente','Confirmada','Finalizada','Cancelada','Rechazada'],it:['In attesa','Confermata','Completata','Annullata','Rifiutata'],de:['Ausstehend','Bestätigt','Abgeschlossen','Storniert','Abgelehnt'],nl:['In afwachting','Bevestigd','Voltooid','Geannuleerd','Afgewezen'],ru:['В ожидании','Подтверждено','Завершено','Отменено','Отклонено']};const index=keys.indexOf(value==='canceled'?'cancelled':value);return index<0?value:(copy[this.language.currentLanguage]||copy.en)[index];}
 async load(){const seq=++this.sequence;this.data=null;this.events=[];this.selectedDay='';this.selectedEvent=null;this.busy=true;this.error=false;
  try{const deadline=Date.now()+15000;const store:any=this.store;while(!(store.firebaseauth||store.firebaseAuth||store.auth)&&Date.now()<deadline){await new Promise<void>(resolve=>setTimeout(resolve,100));}if(seq!==this.sequence)return;let headers;try{headers=await this.auth.headers();}catch{}const uid=this.access.authenticatedUid;
   const cells=this.cells;const params={start:new Date(Date.parse(cells[0].key+'T00:00:00Z')-86400000).toISOString(),end:new Date(Date.parse(cells[cells.length-1].key+'T00:00:00Z')+2*86400000).toISOString()};
   const data=await firstValueFrom(this.http.get<any>('/api/assets/'+[this.type,this.id].map(encodeURIComponent).join('/')+'/calendar',{headers,params}).pipe(timeout(15000)));
   if(seq!==this.sequence)return;if(uid!==this.access.authenticatedUid){void this.load();return;}this.data=data;this.events=data.events||[];
  }catch{if(seq===this.sequence)this.error=true;}finally{if(seq===this.sequence)this.busy=false;}
 }
}
