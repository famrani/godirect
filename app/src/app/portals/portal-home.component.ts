import {Component,OnInit} from '@angular/core';import {Router} from '@angular/router';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {portalFor} from '../services/portal-policy';import {AssetAccessService} from '../services/asset-access.service';import {LanguageService} from '../services/language.service';
@Component({standalone:false,selector:'app-portal-home',templateUrl:'./portal-home.component.html',styleUrls:['./portal-home.component.scss']})
export class PortalHomeComponent implements OnInit {
 readonly portal=typeof window==='undefined'?'owner':portalFor(window.location.hostname);
 constructor(public language:LanguageService,public access:AssetAccessService,private router:Router,private auth:ReservationAuthService){}
 site:any;failed=false;restoringSession=true;
 private async restoreSiteSession(){
  try{await this.auth.user();await this.access.refresh();}
  catch{/* A visitor without a session can still use the public storefront. */}
  finally{this.restoringSession=false;}
 }
async ngOnInit(){if(this.portal==='asset'){void this.restoreSiteSession();try{const r=await fetch('/api/site-home',{cache:'no-store'});if(!r.ok)throw Error();this.site=await r.json();document.title=this.site.title;}catch{this.failed=true;}return;}if(typeof document!=='undefined')document.title=this.concierge?'GoDirect | Espace concierge':'GoDirect | Votre site de location en direct';if(this.portal==='concierge'){try{await this.auth.user();await this.access.refresh();if(this.access.isAuthenticated)void this.router.navigateByUrl('/concierge');}catch{}}}
 get fr(){return this.language.currentLanguage==='fr';}
 get concierge(){return this.portal==='concierge';}
}
