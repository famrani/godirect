import {SiteTextPipe} from '../../home/site-text.pipe';
import {PLATFORM_ADMIN_TEXT} from '../../platform-admin/platform-admin.text';
import {Component,OnInit} from '@angular/core';
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
@Component({selector:'app-platform-layout',standalone:true,imports: [SiteTextPipe,CommonModule,FormsModule,RouterModule],templateUrl:'./platform-layout.component.html',styleUrls:['./platform-layout.component.scss']})
export class PlatformLayoutComponent implements OnInit {
  get adminLabel(){return this.text.tFromContent(this.content,'ui.platformAdmin.title',this.language.currentLanguage,this.language.currentLanguage==='fr'?'Administration GoDirect':'GoDirect administration');}
  adminNav(key:string){const lang=this.language.currentLanguage;return this.text.tFromContent(this.content,'ui.platformAdmin.'+key,lang,PLATFORM_ADMIN_TEXT[lang]?.[key]||PLATFORM_ADMIN_TEXT.en[key]||key);}
  readonly languages=['fr','en','es','it','de','nl','ru'];
  readonly year=new Date().getFullYear();
  content:any;leaving=false;error='';
  constructor(public access:AssetAccessService,public language:LanguageService,private text:SiteContentService,private router:Router,private main:ServicesService){}
  async ngOnInit(){try{this.content=await this.text.getContent();}catch{}}
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
    const current=this.router.url||'/owner/listings';
    const returnUrl=mode==='signup'?'/owner/listings':current.startsWith('/')&&!current.startsWith('//')?current:'/owner/listings';
    void this.router.navigate([boatPath('/'+mode)],{queryParams:{role:'assetOwner',returnUrl}});
  }
  profile(){void this.router.navigateByUrl(boatPath('/my-profile'));}
  bookings(){void this.router.navigateByUrl(boatPath('/my-bookings'));}
  async logout(){
    if(this.leaving)return;this.leaving=true;this.error='';
    try{
      await this.access.signOut();
      const svc:any=this.main;
      try{if(typeof svc.setLoggedUser==='function')await svc.setLoggedUser(undefined);else svc.bnUserO?.next(null);}catch{}
      try{localStorage.removeItem('loggedUser');sessionStorage.removeItem('loggedUser');}catch{}
      await this.router.navigateByUrl('/');
    }catch{this.error=this.text.tFromContent(this.content,'common.error',this.language.currentLanguage,this.language.currentLanguage==='fr'?'Impossible de vous déconnecter. Réessayez.':'Unable to log out. Please try again.');}
    finally{this.leaving=false;}
  }
}
