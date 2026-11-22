import {Component,Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LanguageService} from '../services/language.service';
@Component({selector:'app-asset-calendar-link',standalone:true,imports:[RouterModule],template:`<a [routerLink]="['/asset-calendar',type,assetId]">{{label}}</a>`,styles:[`:host{display:inline-block;margin:4px 8px 4px 0}a{display:inline-block;color:#12566a;text-decoration:underline;text-underline-offset:3px;padding:5px 0}a:focus-visible{outline:3px solid #b47a22;outline-offset:2px}`]})
export class AssetCalendarLinkComponent{
 @Input() type='';@Input() assetId='';constructor(public language:LanguageService){}
 get label(){return ({fr:'Calendrier',en:'Calendar',es:'Calendario',it:'Calendario',de:'Kalender',nl:'Kalender',ru:'Календарь'} as Record<string,string>)[this.language.currentLanguage]||'Calendar';}
}
