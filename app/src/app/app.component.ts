import {LegalService} from './services/legal.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { Router, NavigationEnd } from '@angular/router';
import * as AOS from 'aos';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { UtilsService, } from 'godigital-lib';
import { ServicesService, UsersService, OBJECTNAME } from 'godigital-lib';
import { LocalUtilsService } from './services/services.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { PendingOfferLoginModalService } from './services/pending-offer-login-modal.service';
import { SeoService } from './services/seo.service';
import { filter } from 'rxjs/operators';

declare let what3words: any;

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private loggedUserSub?: Subscription;
  private lastLoginIdentity = '';
  constructor(
    public router: Router,
    public platform: Platform,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public mainSvc: ServicesService,
    public localUtilsSvc: LocalUtilsService,
    public usersSvc: UsersService,
    public utilSvc: UtilsService,
    public spinner: NgxSpinnerService,
    public geolocation: Geolocation,
    public fb: FormBuilder,
    private pendingOfferLoginModal: PendingOfferLoginModalService,
    private seo: SeoService,
    private legal: LegalService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  ngOnInit() {
    AOS.init();
    this.localUtilsSvc.language = this.utilSvc.getLanguage() ?? 'en';
    this.mainSvc.setLanguage(this.localUtilsSvc.language);

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.seo.update(event.urlAfterRedirects);
      this.document.documentElement.lang = this.localUtilsSvc.language || 'fr';
    });
    this.seo.update(this.router.url || '/');

    this.initializeApp();
  }

  private watchLoggedUser(): void {
    const svc: any = this.mainSvc as any;
    const userObservable = typeof svc.getLoggedUser === 'function'
      ? svc.getLoggedUser()
      : typeof svc.getUser === 'function'
        ? svc.getUser()
        : svc.bnUserO;

    if (userObservable && typeof userObservable.subscribe === 'function') {
      this.loggedUserSub?.unsubscribe();
      this.loggedUserSub = userObservable.subscribe((user: any) => this.handleLoggedUser(user || svc.bnUser || svc.currentUser));
    } else {
      this.handleLoggedUser(svc.bnUser || svc.currentUser);
    }
  }

  private handleLoggedUser(user: any): void {
    if (!user) {
      this.lastLoginIdentity = '';
      return;
    }
    const identity = String(user.userId || user.uid || user.id || user.email || '').trim();
    if (!identity || identity === this.lastLoginIdentity) return;
    this.lastLoginIdentity = identity;
    setTimeout(async () => {
      if(/^\/owner\/listings\/[^/]+\/[^/]+\/documents(?:[?#]|$)/.test(this.router.url)||this.router.url.startsWith('/platform/admin/documents')||this.router.url.startsWith('/platform/admin/legal')||this.router.url.startsWith('/account/signup')||this.router.url.startsWith('/account/accept-terms'))return;
      try{const status=await this.legal.ensure();if(identity!==this.lastLoginIdentity)return;if(status&&status.accepting&&!status.accepted){await this.router.navigate(['/account/accept-terms'],{queryParams:{role:status.role,returnUrl:this.router.url}});return;}await this.pendingOfferLoginModal.checkAfterLogin(user);}catch{/* API guard still prevents unaccepted business operations. */}
    }, 250);
  }

  async initializeApp() {
    let value2;
    let error;
    this.utilSvc.appName = 'Alegria';

    let platform = await this.utilSvc.getPlatformEnv() as string;
    if (platform !== 'dev' && platform !== 'test' && platform !== 'prod') {
      platform = 'test';
    }

    this.platform.ready().then(async () => {
      const autoHide = true;
      if (this.platform.is('cordova')) {
        this.statusBar.hide();
      }

      this.mainSvc.bootstrap(platform).then(
        () => {
          console.log('version =', this.mainSvc.version);
          if (this.platform.is('cordova')) {
            this.splashScreen.hide();
          }
          this.watchLoggedUser();
          value2 = this.utilSvc.getUid();
          try {
            if (value2) {
              const autoLogin = this.localUtilsSvc.processLogin(undefined, undefined, value2);
              const timeout = new Promise(resolve => setTimeout(() => resolve(null), 8000));
              Promise.race([autoLogin, timeout]).catch(() => null);
            }
          } catch (e) { }
        });
    });
  }
}
