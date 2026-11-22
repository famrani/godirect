import {Component,EventEmitter,Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LanguageService} from '../services/language.service';
import {ownerSiteCopy} from './owner-site-promo.text';
@Component({selector:'app-owner-site-promo',standalone:true,imports:[CommonModule],templateUrl:'./owner-site-promo.component.html',styleUrls:['./owner-site-promo.component.scss']})
export class OwnerSitePromoComponent {
 @Output() createSite=new EventEmitter<void>();
 constructor(public language:LanguageService){}
 get copy(){return ownerSiteCopy(this.language.currentLanguage);}
}
