import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {PlatformLayoutComponent} from '../layout/platform-layout/platform-layout.component';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {LanguageService} from '../services/language.service';

@Component({standalone:true,imports:[CommonModule,FormsModule,PlatformLayoutComponent],template:`
<app-platform-layout><main class="settings">
<h1>{{fr?'Alertes SMS et WhatsApp':'SMS and WhatsApp alerts'}}</h1>
<p>{{fr?'Soyez averti des nouvelles demandes de renseignement et de réservation concernant vos biens ou les biens dont vous gérez les réservations.':'Get alerts about new enquiries and bookings for rentals you own or manage.'}}</p>
<p *ngIf="!available.sms&&!available.whatsapp&&!busy">{{fr?'Les alertes mobiles ne sont pas encore disponibles.':'Mobile alerts are not available yet.'}}</p>
<p *ngIf="verified">{{fr?'Numéro vérifié :':'Verified number:'}} {{verifiedPhone}}</p>
<form *ngIf="available.sms||available.whatsapp" (ngSubmit)="sendCode()">
<label>{{fr?'Numéro au format international':'International phone number'}} <input name="phone" type="tel" autocomplete="tel" [(ngModel)]="phone" placeholder="+33612345678" required></label>
<button type="submit" [disabled]="busy">{{fr?'Envoyer un code par SMS':'Send an SMS code'}}</button>
</form>
<form *ngIf="pending" (ngSubmit)="confirm()">
<label>{{fr?'Code reçu':'Verification code'}} <input name="code" autocomplete="one-time-code" inputmode="numeric" [(ngModel)]="code" required></label>
<button type="submit" [disabled]="busy">{{fr?'Vérifier le numéro':'Verify number'}}</button>
</form>
<form *ngIf="verified" (ngSubmit)="save()">
<label>{{fr?'Canal':'Channel'}} <select name="channel" [(ngModel)]="channel" (ngModelChange)="consent=false">
<option value="off">{{fr?'Désactivé':'Off'}}</option><option *ngIf="available.sms" value="sms">SMS</option><option *ngIf="available.whatsapp" value="whatsapp">WhatsApp</option>
</select></label>
<label *ngIf="channel!=='off'"><input name="consent" type="checkbox" [(ngModel)]="consent"> {{fr?'J’accepte de recevoir ces alertes GoDirect par':'I agree to receive these GoDirect alerts via'}} {{channel==='sms'?'SMS':'WhatsApp'}}.</label>
<button type="submit" [disabled]="busy||(channel!=='off'&&!consent)">{{fr?'Enregistrer':'Save'}}</button>
</form>
<p role="status">{{message}}</p><p role="alert" *ngIf="error">{{error}}</p>
</main></app-platform-layout>
`,styles:[`.settings{max-width:760px;margin:36px auto;padding:24px}form{display:grid;gap:12px;margin:20px 0;padding:20px;border:1px solid #cad7d1;border-radius:12px}input,select,button{padding:8px;margin:5px}button{justify-self:start}`]})
export class MobileAlertsComponent implements OnInit {
 private url='/api/me/mobile-alerts';
 phone='';verifiedPhone='';code='';channel='off';consent=false;verified=false;pending=false;busy=false;error='';message='';
 available={sms:false,whatsapp:false};
 constructor(private http:HttpClient,private auth:ReservationAuthService,private language:LanguageService){}
 get fr(){return this.language.currentLanguage==='fr';}
 ngOnInit(){void this.run(()=>this.load());}
 private async load(){const p=await firstValueFrom(this.http.get<any>(this.url,{headers:await this.auth.headers()}));this.phone=this.verifiedPhone=p.phone;this.verified=p.verified;this.available=p.available;this.channel=p.available[p.channel]?p.channel:'off';this.consent=false;}
 private async run(action:()=>Promise<void>){if(this.busy)return;this.busy=true;this.error=this.message='';try{await action();}catch(e:any){const code=e?.error?.error;if(e.status===429)this.error=this.fr?'Patientez avant de réessayer.':'Wait before trying again.';else if(code==='invalid_mobile_code'||code==='mobile_code_expired')this.error=this.fr?'Code incorrect ou expiré.':'Incorrect or expired code.';else if(code==='invalid_mobile_number')this.error=this.fr?'Numéro invalide ou non autorisé.':'Invalid or unauthorized number.';else this.error=this.fr?'Action impossible. Vérifiez votre compte et réessayez.':'Could not complete the action. Check your account and try again.';}finally{this.busy=false;}}
 sendCode(){return this.run(async()=>{await firstValueFrom(this.http.post(this.url+'/verify',{phone:this.phone},{headers:await this.auth.headers()}));this.pending=true;this.code='';this.message=this.fr?'Code envoyé.':'Code sent.';});}
 confirm(){return this.run(async()=>{await firstValueFrom(this.http.post(this.url+'/confirm',{code:this.code},{headers:await this.auth.headers()}));this.pending=false;this.code='';await this.load();this.message=this.fr?'Numéro vérifié. Choisissez votre canal.':'Number verified. Choose your channel.';});}
 save(){return this.run(async()=>{await firstValueFrom(this.http.put(this.url,{channel:this.channel,consent:this.consent},{headers:await this.auth.headers()}));await this.load();this.message=this.fr?'Préférences enregistrées.':'Preferences saved.';});}
}
