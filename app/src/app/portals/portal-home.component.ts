import {Component,OnInit} from '@angular/core';import {Router} from '@angular/router';
import {ReservationAuthService} from '../services/reservation-auth.service';
import {portalFor} from '../services/portal-policy';import {AssetAccessService} from '../services/asset-access.service';import {LanguageService} from '../services/language.service';
@Component({standalone:false,selector:'app-portal-home',templateUrl:'./portal-home.component.html',styleUrls:['./portal-home.component.scss']})
export class PortalHomeComponent implements OnInit {
 readonly portal=typeof window==='undefined'?'owner':portalFor(window.location.hostname);
 constructor(public language:LanguageService,public access:AssetAccessService,private router:Router,private auth:ReservationAuthService){}
 async ngOnInit(){if(typeof document!=='undefined')document.title=this.concierge?'GoDirect | Espace concierge':'GoDirect | Votre site de location en direct';if(this.portal==='concierge'){try{await this.auth.user();await this.access.refresh();if(this.access.isAuthenticated)void this.router.navigateByUrl('/concierge');}catch{}}}
 get fr(){return this.language.currentLanguage==='fr';}
 get concierge(){return this.portal==='concierge';}
}
