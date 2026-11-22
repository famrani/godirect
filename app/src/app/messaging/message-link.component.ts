import {presentationText} from './message-presentation';
import {Component,Input} from '@angular/core';import {RouterModule} from '@angular/router';import {LanguageService} from '../services/language.service';import {messagingText} from './messaging-text';
@Component({selector:'app-message-link',standalone:true,imports:[RouterModule],template:`<a routerLink="/messages" [queryParams]="threadId?{threadId}:{kind,type,assetId,bookingId,audience}">{{label}}</a>`,styles:[`:host{display:inline-block}a{display:inline-flex;align-items:center;min-height:40px;padding:8px 12px;margin:4px 8px 4px 0;border:1px solid #bbd0d8;border-radius:8px;text-decoration:none;color:#164f62;background:#f3f8f8;font-size:14px;font-weight:600;box-sizing:border-box}a:focus-visible{outline:3px solid #438ba3;outline-offset:2px}`]})
export class MessageLinkComponent{
 @Input()threadId='';@Input()kind='reservation';@Input()type='';@Input()assetId='';@Input()bookingId='';@Input()audience='rental';
 constructor(public language:LanguageService){}get label(){return messagingText(this.language.currentLanguage,0)+' · '+(this.kind==='subscription'?messagingText(this.language.currentLanguage,7):this.audience==='rental'?presentationText(this.language.currentLanguage,0):messagingText(this.language.currentLanguage,6));}
}
