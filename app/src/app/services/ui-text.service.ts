import {Injectable} from '@angular/core';
import {LanguageService} from './language.service';
import {SiteContentService} from '../home/site-content-service/site-content.service';
@Injectable({providedIn:'root'})
export class UiTextService {
 private content:any;
 constructor(private language:LanguageService,private source:SiteContentService){void source.getContent().then(value=>this.content=value).catch(()=>{});}
 text(value:string):string{return this.source.tFromContent(this.content,value,this.language.currentLanguage,value);}
}
