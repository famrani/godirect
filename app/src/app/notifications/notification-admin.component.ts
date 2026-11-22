import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {LanguageService} from '../services/language.service';
@Component({selector:'app-notification-admin',standalone:true,imports:[CommonModule,RouterModule],template:`<main style="max-width:1000px;margin:40px auto;padding:24px"><a routerLink="/platform/admin">← GoDirect Admin</a><h1>{{t(0)}}</h1><p>{{t(1)}}</p><button type="button" (click)="refresh()" [disabled]="busy">{{t(2)}}</button><p *ngIf="error" role="alert">{{t(3)}}</p><section *ngIf="data"><p>{{t(4)}} : {{data.enabled?'✓':'—'}}</p><p>Admin : {{data.adminEmail}}</p><p *ngIf="data.recipientFilterActive">{{t(10)}}</p><p>SMTP : {{data.smtpConfigured?'✓':'—'}}</p><p>{{t(5)}} : {{data.pending}} · {{t(6)}} : {{data.failed}}</p><p *ngIf="data.lastError">{{data.lastError}}</p><table style="width:100%;text-align:left;overflow-wrap:anywhere"><thead><tr><th>ID</th><th>{{t(7)}}</th><th>{{t(8)}}</th><th>{{t(11)}}</th></tr></thead><tbody><tr *ngFor="let row of data.queue"><td>{{row.id.slice(0,12)}}</td><td>{{row.attempts}} / 8</td><td>{{row.nextAttemptAt | date:'short'}} <button type="button" *ngIf="row.attempts>=8" (click)="retry(row.id)" [disabled]="busy">{{t(9)}}</button></td><td>{{row.lastError}} {{row.responseCode}}</td></tr></tbody></table></section></main>`})
export class NotificationAdminComponent implements OnInit{
 data:any=null;busy=false;error=false;
 constructor(private http:HttpClient,private auth:ReservationAuthService,private language:LanguageService){}
 t(i:number){const text:Record<string,string[]>={fr:['Notifications email','Les destinataires dépendent du bien et des droits des concierges. Activation depuis la configuration du serveur.','Actualiser','Impossible de charger le suivi.','Envoi activé','En attente','En échec après 8 tentatives','Tentatives','Prochaine tentative','Réessayer','Filtre des adresses de test actif : les autres destinataires sont ignorés.','Erreur'],en:['Email notifications','Recipients depend on the asset and concierge permissions. Enable sending in the server configuration.','Refresh','Unable to load delivery status.','Sending enabled','Pending','Failed after 8 attempts','Attempts','Next attempt','Retry','Test recipient filter active: other recipients are skipped.','Error']};return(text[this.language.currentLanguage]||text.en)[i];}
 async retry(id:string){if(this.busy)return;this.busy=true;try{await firstValueFrom(this.http.post('/api/platform/admin/notifications/'+id+'/retry',{}, {headers:await this.auth.headers()}));}catch{this.error=true;}finally{this.busy=false;}await this.refresh();}
 ngOnInit(){void this.refresh();}
 async refresh(){if(this.busy)return;this.busy=true;this.error=false;try{this.data=await firstValueFrom(this.http.get('/api/platform/admin/notifications',{headers:await this.auth.headers()}));}catch{this.data=null;this.error=true;}finally{this.busy=false;}}
}
