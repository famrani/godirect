import {Component,OnInit,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {AssetAccessService} from '../services/asset-access.service';
import {portalFor} from '../services/portal-policy';
import {dedicatedAsset} from '../services/asset-domain';

type Section='assets'|'bookings'|'payments'|'ratings';
@Component({standalone:true,imports:[CommonModule,RouterModule],selector:'app-client-space',
styles:[`main{max-width:65rem;margin:2rem auto;padding:1rem}nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1rem 0}button,a{padding:.6rem .8rem}button[aria-pressed=true]{background:#173d37;color:white}article{border-bottom:1px solid #cedbd7;padding:1rem 0}h2{font-size:1.2rem}`],
template:`<main><a *ngIf="preview" routerLink="/owner/listings">← Retour à mon espace propriétaire</a><a *ngIf="!preview" href="/">← Site du bien</a>
<h1>{{preview?'Vue client de mes biens':'Mon espace client'}}</h1><p>{{preview?'Vos annonces publiques et votre activité en tant que client sur ces biens.':'Vos biens disponibles, réservations, paiements et avis sur ce site.'}}</p>
<nav aria-label="Mon espace client"><button *ngFor="let tab of tabs" [attr.aria-pressed]="section===tab.id" (click)="load(tab.id)">{{tab.label}}</button></nav>
<p *ngIf="loading" role="status">Chargement…</p><p *ngIf="error" role="alert">{{error}} <button (click)="load(section)">Réessayer</button></p>
<ng-container *ngIf="!loading&&!error&&(section==='assets'&&!preview||uid&&uid===access.authenticatedUid)">
<p *ngIf="!rows.length">{{empty[section]}}</p>
<article *ngFor="let r of rows"><h2>{{r.assetName||r.name||r.assetId}}</h2>
<a *ngIf="section==='assets'" [routerLink]="['/',r.assetType,r.id,'home']">Voir l’annonce</a>
<ng-container *ngIf="section==='bookings'||section==='payments'"><p>{{r.startAt||r.outingDate}} → {{r.endAt}}</p>
<p *ngIf="section==='payments'">{{r.totalAmount??r.rentalAmount??0}} {{r.currency||'EUR'}} · {{r.paymentStatus||r.status}}</p>
<a [routerLink]="['/',r.assetType,r.assetId,'my-bookings']" [queryParams]="{bookingId:r.bookingId||r.id}">Détails de la réservation</a></ng-container>
<p *ngIf="section==='ratings'">{{r.rating}} / 5 · {{r.comments}}</p></article></ng-container></main>`})
export class ClientSpaceComponent implements OnInit,OnDestroy{
 readonly preview=location.pathname==='/owner/client-view';
 readonly tabs:{id:Section,label:string}[]=[{id:'assets',label:'Biens'},{id:'bookings',label:'Mes réservations'},{id:'payments',label:'Mes paiements'},{id:'ratings',label:'Mes avis'}];
 readonly empty={assets:'Aucune annonce publique dans cet espace.',bookings:'Aucune réservation à votre nom dans cet espace.',payments:'Aucun paiement associé à vos réservations dans cet espace.',ratings:'Aucun avis dans cet espace.'};
 section:Section='assets';rows:any[]=[];error='';loading=false;uid='';private sequence=0;
 constructor(private http:HttpClient,private auth:ReservationAuthService,public access:AssetAccessService){}
 ngOnInit(){void this.load('assets');}ngOnDestroy(){this.sequence++;}
 async load(section:Section){const seq=++this.sequence;this.section=section;this.rows=[];this.uid='';this.error='';this.loading=true;
 try{if(!this.preview&&!dedicatedAsset())throw Error('scope');
 const needsAuth=this.preview||section!=='assets';
 const uid=needsAuth?(await this.auth.user()).uid:'';
 const headers=needsAuth?await this.auth.headers():undefined;
 const url=section==='assets'?'/api/assets':section==='ratings'?'/api/me/feedbacks':'/api/me/bookings';
 const rows=await firstValueFrom(this.http.get<any[]>(url+(this.preview?'?preview=owner':''),{headers}));
 if(seq===this.sequence&&(!needsAuth||uid===this.access.authenticatedUid)){this.rows=rows;this.uid=uid;}
 }catch{if(seq===this.sequence)this.error='Impossible de charger cet espace. Vérifiez votre connexion et votre session.';}finally{if(seq===this.sequence)this.loading=false;}}
}
