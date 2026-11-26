import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AssetAccessService} from '../services/asset-access.service';
import {LanguageService} from '../services/language.service';
@Component({standalone:true,imports:[CommonModule,RouterModule],template:`<main><h1>{{fr?'Mes espaces':'My workspaces'}}</h1><a routerLink="/locations">{{fr?'Locataire · Trouver une location':'Renter · Find a rental'}}</a><a [routerLink]="access.isOwner?'/owner/listings':'/owner/start'">{{fr?(access.isOwner?'Propriétaire · Mes biens':'Mettre mon bien en location'):'Owner · My listings'}}</a><a *ngIf="access.isConcierge" routerLink="/concierge">{{fr?'Propriétaire par délégation · Biens confiés':'Delegated manager · Assigned properties'}}</a></main>`,styles:['main{max-width:55rem;margin:3rem auto;padding:1rem}a{display:block;margin:.8rem 0;padding:1rem;background:white;border:1px solid #cad9d1;border-radius:.7rem;color:#173b36}']})
export class SpacesComponent{constructor(public access:AssetAccessService,public language:LanguageService){}get fr(){return this.language.currentLanguage==='fr';}}
