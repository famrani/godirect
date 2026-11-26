import {MessageBadgeComponent} from '../../messaging/message-badge.component';
import {messagingText} from '../../messaging/messaging-text';
import {accountHeaderText} from '../../services/account-header';
import {SiteTextPipe} from '../../home/site-text.pipe';
import {PLATFORM_ADMIN_TEXT} from '../../platform-admin/platform-admin.text';
import {Component,Input,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router,RouterModule} from '@angular/router';
import {ServicesService} from 'godigital-lib';
import {AssetAccessService} from '../../services/asset-access.service';
import {LanguageService} from '../../services/language.service';
import {SiteContentService} from '../../home/site-content-service/site-content.service';
import {MARKETPLACE_TRANSLATIONS} from '../../services/marketplace-translations';
import {DISCOVERY_TEXT} from '../../services/discovery-text';
import {boatPath} from '../../services/boat-routing';

/** Platform navigation for owner pages, independent of any asset's branding. */
@Component({selector:'app-platform-layout',standalone:true,imports: [MessageBadgeComponent,SiteTextPipe,CommonModule,FormsModule,RouterModule],templateUrl:'./platform-layout.component.html',styleUrls:['./platform-layout.component.scss']})
export class PlatformLayoutComponent implements OnInit {
  @Input() showFooter=true;
 messageLabel(){return messagingText(this.language.currentLanguage,0);}
  get adminLabel(){return this.text.tFromContent(this.content,'ui.platformAdmin.title',this.language.currentLanguage,this.language.currentLanguage==='fr'?'Administration GoDirect':'GoDirect administration');}
  adminNav(key:string){const lang=this.language.currentLanguage;return this.text.tFromContent(this.content,'ui.platformAdmin.'+key,lang,PLATFORM_ADMIN_TEXT[lang]?.[key]||PLATFORM_ADMIN_TEXT.en[key]||key);}
  readonly languages=['fr','en','es','it','de','nl','ru'];
  readonly year=new Date().getFullYear();
  content:any;leaving=false;error='';
  get onListingsPage():boolean {return this.router.url.split(/[?#;]/,1)[0].replace(/\/$/,'')==='/owner/listings';}
  constructor(public access:AssetAccessService,public language:LanguageService,private text:SiteContentService,private router:Router,private main:ServicesService){}
  async ngOnInit(){try{this.content=await this.text.getContent();}catch{}}
  accountText(key:string){return accountHeaderText(this.language.currentLanguage,key);}
  get authenticated(){return this.access.isAuthenticated;}
  setLanguage(value:string){if(this.language.isSupportedLanguage(value))this.language.setLanguage(value);}
  t(key:string):string {
    const lang=this.language.currentLanguage;
    if(key==='skip'){const copy:Record<string,string>={fr:'Aller au contenu',en:'Skip to content',es:'Ir al contenido',it:'Vai al contenuto',de:'Zum Inhalt springen',nl:'Naar inhoud',ru:'Перейти к содержимому'};return this.text.tFromContent(this.content,'common.skipToContent',lang,copy[lang]||copy.en);}
    const discovery:Record<string,string>={home:'back',find:'find',listings:'manage'};
    const field=discovery[key]||key;
    const fallback=discovery[key]?(DISCOVERY_TEXT[lang]?.[field]||DISCOVERY_TEXT.en[field]):(MARKETPLACE_TRANSLATIONS[lang]?.[field]||MARKETPLACE_TRANSLATIONS.en[field]);
    return this.text.tFromContent(this.content,`ui.${discovery[key]?'discovery':'marketplace'}.${field}`,lang,fallback||key);
  }
  authenticate(mode:'login'|'signup'){
    const customer=typeof window!=='undefined' && window.location.hostname==='client.godirect.fr';
    const current=this.router.url||'/';
    const returnUrl=mode==='signup'&&!customer?'/owner/listings':current.startsWith('/')&&!current.startsWith('//')?current:'/owner/listings';
    void this.router.navigate(['/account/'+mode],{queryParams:{role:customer?'customer':'assetOwner',returnUrl}});
  }
  profile(){void this.router.navigateByUrl('/account/profile');}
  bookings(){void this.router.navigateByUrl(this.access.isOwner?'/owner/activity/reservations':'/account/bookings');}
  async logout(){
    if(this.leaving)return;this.leaving=true;this.error='';
    try{
      await this.access.signOut();
      const svc:any=this.main;
      try{if(typeof svc.setLoggedUser==='function')await svc.setLoggedUser(undefined);else svc.bnUserO?.next(null);}catch{}
      try{localStorage.removeItem('loggedUser');sessionStorage.removeItem('loggedUser');}catch{}
      if(window.location.hostname==='admin.godirect.fr'){
        window.location.replace('https://godirect.fr/');
        return;
      }
      await this.router.navigateByUrl('/');
    }catch{this.error=this.text.tFromContent(this.content,'common.error',this.language.currentLanguage,this.language.currentLanguage==='fr'?'Impossible de vous déconnecter. Réessayez.':'Unable to log out. Please try again.');}
    finally{this.leaving=false;}
  }
}
