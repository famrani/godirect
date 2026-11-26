import {NgIf} from '@angular/common';
import {AssetAccessService} from '../../services/asset-access.service';
import {assetDomainSlug} from '../../services/asset-domain';
import {SiteTextPipe} from '../../home/site-text.pipe';
import {RouterModule} from '@angular/router';import {Component} from '@angular/core';import {APP_RELEASE} from '../../services/app-release';
@Component({selector:'app-release-footer',standalone:true,imports:[NgIf,RouterModule,SiteTextPipe],template:`<footer class="release-footer"><span><strong *ngIf="ownerName as name">{{name}} · </strong>{{copyright}}</span><nav aria-label="Informations légales"><a routerLink="/legal">{{'ui.legal.conditions' | siteText}}</a> · <a routerLink="/faq">{{'ui.legal.faq' | siteText}}</a> · <a href="/contact">{{'ui.legal.contact' | siteText:'Contact'}}</a><ng-container *ngIf="offersInstall"> · <a href="/assets/pwa/install.html">Installer GoDirect</a></ng-container></nav><span>Version {{version}}</span> </footer>`,styles:[':host{display:block;width:100%;margin-top:auto}.release-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:18px max(20px,5vw);background:#f8f6f1;color:#173b36;border-top:1px solid #d2dcd4;font-size:13px;box-sizing:border-box}.release-footer a{color:inherit}']})
export class ReleaseFooterComponent{readonly version=APP_RELEASE;readonly slug=assetDomainSlug(typeof location==='undefined'?'':location.hostname);
 constructor(private access:AssetAccessService){}
 readonly host=typeof location==='undefined'?'':location.hostname;
 get offersInstall(){return ['godirect.fr','owner.godirect.fr','admin.godirect.fr','concierge.godirect.fr'].includes(this.host);}
 get ownerName(){return this.host==='owner.godirect.fr'&&this.access.isOwner&&this.access.isAuthenticated?this.access.displayName:'';}
 readonly copyright='© '+new Date().getFullYear()+' '+(this.slug?this.slug+'.godirect.fr powered by GoDirect.fr':'godirect.fr powered by All Digital Network');}
