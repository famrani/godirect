import {AssetCalendarLinkComponent} from '../calendar/asset-calendar-link.component';
import {ListingDescriptionComponent} from '../shared/listing-description.component';
import {Component,Input,OnChanges,OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {assetPhotoPaths} from '../services/asset-photos';
import {mediaObjectUrl} from '../services/media-routes';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {LanguageService} from '../services/language.service';
import {ASSET_PAGE_I18N} from '../services/asset-page-i18n';
import {SiteContentService} from '../home/site-content-service/site-content.service';
@Component({selector:'app-simple-listing',standalone:true,imports:[AssetCalendarLinkComponent,ListingDescriptionComponent,CommonModule,RouterModule],templateUrl:'./simple-listing.component.html',styleUrls:['./simple-listing.component.scss']})
export class SimpleListingComponent implements OnChanges,OnDestroy{
 showAllPhotos=false;
 @Input() assetType='';@Input() assetId='';asset:any=null;loading=false;error=false;ui:any=null;private sequence=0;
 constructor(private http:HttpClient,private auth:ReservationAuthService,public language:LanguageService,private content:SiteContentService){}
 ngOnChanges(){void this.load();}ngOnDestroy(){this.sequence++;}
 async load(){const seq=++this.sequence,type=this.assetType,id=this.assetId;this.asset=null;this.showAllPhotos=false;this.error=false;this.loading=true;try{if(!['boat','car','property','parking','pool'].includes(type)||!/^[a-zA-Z0-9_-]+$/.test(id))throw Error('invalid_scope');let headers;try{headers=await this.auth.headers();}catch{}const a=await firstValueFrom(this.http.get<any>('/api/resources/'+[type,id].map(encodeURIComponent).join('/'),{headers}));if(seq!==this.sequence)return;this.asset=a;void this.content.getContent().then(c=>{if(seq===this.sequence)this.ui=c;}).catch(()=>{});}catch{if(seq===this.sequence)this.error=true;}finally{if(seq===this.sequence)this.loading=false;}}
 t(key:string){const lang=this.language.currentLanguage;return this.content.tFromContent(this.ui,'ui.assetPages.'+key,lang,ASSET_PAGE_I18N[lang]?.[key]||ASSET_PAGE_I18N.en[key]||(key==='hour'?({fr:'heure',en:'hour',es:'hora',it:'ora',de:'Stunde',nl:'uur',ru:'час'} as Record<string,string>)[lang]:key));}
 get localized(){return this.asset?.translations?.[this.language.currentLanguage]||{};}
 get title(){return this.localized.title||this.asset?.name||'';}
 get description(){return this.localized.description||this.asset?.description||'';}
 get photos(){return assetPhotoPaths(this.asset,this.assetType,this.assetId).map(mediaObjectUrl).filter(Boolean);}
 get visiblePhotos(){return this.showAllPhotos?this.photos:this.photos.slice(0,5);}
 photoToggleText(){const copy:Record<string,[string,string]>={fr:['Voir toutes les photos','Réduire la galerie'],en:['Show all photos','Show fewer photos'],es:['Ver todas las fotos','Ver menos fotos'],it:['Mostra tutte le foto','Mostra meno foto'],de:['Alle Fotos anzeigen','Weniger Fotos anzeigen'],nl:['Alle foto’s bekijken','Minder foto’s bekijken'],ru:['Показать все фото','Свернуть галерею']};return (copy[this.language.currentLanguage]||copy.en)[this.showAllPhotos?1:0];}
 get bookingLink(){return ['/',this.assetType,this.assetId,'reserver'];}
}
