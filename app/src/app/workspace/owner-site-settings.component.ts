import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';
@Component({standalone:true,imports:[CommonModule,FormsModule],template:`
<main><h1>Paramètres de mon site</h1>
<p *ngIf="loading" role="status">Chargement des réglages…</p>
<p *ngIf="loadError" role="alert">Impossible de charger les réglages. <button type="button" (click)="ngOnInit()">Réessayer</button></p>
<ng-container *ngIf="!loading && !loadError">
<p *ngIf="!siteUrl">Créez votre première annonce pour obtenir l’adresse de votre vitrine.</p>
<nav *ngIf="siteUrl"><a [href]="siteUrl+'/?view=client'" target="_blank" rel="noopener">Voir mon accueil public ↗</a><a [href]="siteUrl+'/contact'" target="_blank" rel="noopener">Voir ma page Contact ↗</a></nav>
<form (ngSubmit)="save('home')"><h2>Page d’accueil</h2><label>Titre<input name="title" maxlength="100" [(ngModel)]="home.title"></label><label>Présentation<textarea name="intro" rows="5" maxlength="2500" [(ngModel)]="home.intro"></textarea></label><button [disabled]="!!saving">Enregistrer l’accueil</button><p role="status">{{success.home}}</p><p *ngIf="error.home" role="alert">{{error.home}}</p></form>
<form (ngSubmit)="save('contact')"><h2>Coordonnées publiques</h2><p>Ces informations seront visibles sur la page Contact de votre vitrine.</p><label>Email<input name="email" type="email" email maxlength="254" [(ngModel)]="contact.email"></label><label>Téléphone<input name="phone" type="tel" maxlength="40" [(ngModel)]="contact.phone"></label><label>Adresse<input name="address" maxlength="300" [(ngModel)]="contact.address"></label><button [disabled]="!!saving">Enregistrer les coordonnées</button><p role="status">{{success.contact}}</p><p *ngIf="error.contact" role="alert">{{error.contact}}</p></form>
</ng-container></main>`,styles:[`main{max-width:48rem;margin:auto;padding:1.2rem;color:#173d37}nav{display:flex;gap:1rem;flex-wrap:wrap}form{padding:1rem;margin:1rem 0;background:white;border:1px solid #d0dfd8;border-radius:12px}label{display:grid;gap:.35rem;margin:.7rem 0}input,textarea{padding:.6rem;border:1px solid #acbdb6;border-radius:6px;min-width:0}button{background:#175348;color:white;border:0;border-radius:8px;padding:.65rem}p[role=alert]{color:#9c2519}`]})
export class OwnerSiteSettingsComponent implements OnInit{
 private readonly url='/api/owner/site-settings';
 siteUrl='';home={title:'',intro:''};contact={email:'',phone:'',address:''};loading=true;loadError=false;saving='';success={home:'',contact:''};error={home:'',contact:''};
 constructor(private http:HttpClient,private auth:ReservationAuthService){}
 async ngOnInit(){this.loading=true;this.loadError=false;try{const s=await firstValueFrom(this.http.get<any>(this.url,{headers:await this.auth.headers()}));if(/^[a-z0-9-]+$/.test(s.prefix||''))this.siteUrl='https://'+s.prefix+'.godirect.fr';this.home={...this.home,...s.home};this.contact={...this.contact,...s.contact};}catch{this.loadError=true;}finally{this.loading=false;}}
 async save(section:'home'|'contact'){if(this.saving)return;this.saving=section;this.success[section]='';this.error[section]='';try{const body=section==='home'?{home:{...this.home}}:{...this.contact};await firstValueFrom(this.http.put(this.url,body,{headers:await this.auth.headers()}));this.success[section]=section==='home'?'Page d’accueil enregistrée.':'Coordonnées publiques enregistrées.';}catch{this.error[section]='Enregistrement impossible. Vérifiez les champs puis réessayez.';}finally{this.saving='';}}
}
