import {Component,OnInit} from '@angular/core';import {CommonModule} from '@angular/common';import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';import {ReservationAuthService} from '../services/reservation-auth.service';import {AssetAccessService} from '../services/asset-access.service';
@Component({standalone:true,selector:'app-rental-history',imports:[CommonModule],template:`
<section *ngIf="access.authenticatedUid" id="mes-locations" aria-labelledby="history-title">
<header><div><h2 id="history-title">Mes biens déjà loués</h2><p>Retrouvez vos locations terminées et leurs dates.</p></div>
<button type="button" (click)="load()" [disabled]="busy">{{busy ? 'Chargement…' : 'Actualiser'}}</button></header>
<p *ngIf="status" role="status">{{status}}</p>
<ul *ngIf="uid===access.authenticatedUid && rows.length"><li *ngFor="let a of rows">
<a *ngIf="a.origin;else offline" [href]="a.origin" target="_blank" rel="noopener noreferrer"><span><strong>{{a.name}}</strong><small>Ouvrir le site du propriétaire</small></span><b aria-hidden="true">↗</b></a>
<ng-template #offline><div class="offline"><strong>{{a.name}}</strong><small>Site indisponible</small></div></ng-template><small class="stay" *ngFor="let stay of a.stays">Du {{stay.startAt | date:'dd/MM/yyyy HH:mm'}} au {{stay.endAt | date:'dd/MM/yyyy HH:mm'}}</small></li></ul>
</section>`,styles:[`
:host{display:block;box-sizing:border-box;max-width:1440px;margin:auto;padding:0 5vw}
section{background:#edf4f6;color:#103f64;border:1px solid #d4e3e9;border-radius:20px;padding:clamp(16px,2vw,28px);margin-bottom:24px}
header{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
h2{font:600 clamp(21px,2vw,28px)/1.2 Georgia,serif;margin:0}p{margin:6px 0 0;color:#435e70}
button{background:white;color:#103f64;border:1px solid #a5bbc8;border-radius:12px;min-height:44px;padding:0 16px;font:inherit;cursor:pointer}
ul{list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px;margin:16px 0 0;padding:0}
li{min-width:0}a,.offline{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:16px;background:white;color:#103f64;border:1px solid #ccdde5;padding:14px 18px;border-radius:12px;text-decoration:none;max-width:440px}
strong{overflow-wrap:anywhere}small{display:block;margin-top:3px;color:#49677a}.offline{display:block}a:hover{border-color:#497895}a:focus-visible,button:focus-visible{outline:3px solid #176d98;outline-offset:2px}
`]})
export class RentalHistoryComponent implements OnInit{rows:any[]=[];uid='';busy=false;status='';constructor(private http:HttpClient,private auth:ReservationAuthService,public access:AssetAccessService){}ngOnInit(){void this.load();}async load(){if(this.busy)return;this.busy=true;this.rows=[];this.status='';try{const u=await this.auth.user();const rows=await firstValueFrom(this.http.get<any[]>('/api/me/rented-assets',{headers:await this.auth.headers()}));if(u.uid===this.access.authenticatedUid){this.uid=u.uid;this.rows=rows;this.status=rows.length?'':'Aucun bien déjà loué.';}}catch{this.status='Historique indisponible.';}finally{this.busy=false;}}}
