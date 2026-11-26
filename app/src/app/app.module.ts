import {SharedHeaderComponent} from './layout/platform-layout/shared-header.component';
import {PlatformLayoutComponent} from './layout/platform-layout/platform-layout.component';
import {RentalHistoryComponent} from './workspace/rental-history.component';
import {SiteManagementComponent} from './workspace/site-management.component';
import {PortalHomeComponent} from './portals/portal-home.component';
import {MessageNotificationsComponent} from './messaging/message-notifications.component';
import {LegalInterceptor} from './services/legal.interceptor';
import {OwnerSitePromoComponent} from './owner-site-promo/owner-site-promo.component';
import {HomeRolesComponent} from './home-roles/home-roles.component';
import {ConciergeComponent} from './workspace/concierge.component';
import {ReleaseFooterComponent} from './layout/release-footer/release-footer.component';
import { UrlSerializer } from '@angular/router';
import { AssetUrlSerializer } from './services/asset-url-serializer';
import { ResourceRoutePipe } from './services/resource-route.pipe';
import {PlatformAdminComponent} from './platform-admin/platform-admin.component';
import {OwnerDashboardComponent} from './owner-dashboard/owner-dashboard.component';
import {SiteTextPipe} from './home/site-text.pipe';
import { OwnerListingsComponent } from './owner-listings.component';
import { AssetOwnerReadInterceptor } from './services/asset-owner-read.interceptor';
import { NgModule } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { HaversineService } from 'ng2-haversine';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';



import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutModule } from './layout/layout.module';

import { environment } from '../environments/environment';

import { GodigitalbModule, UtilsService } from 'godigital-lib';
import { Page404Component } from './page404/page404.component';
import { FirebaseMediaInterceptor } from './services/firebase-media.interceptor';

import { NgxEchartsModule } from 'ngx-echarts';
import { NgxSpinnerModule } from 'ngx-spinner';

import { LegacyRouteRedirectComponent } from './legacy-route-redirect/legacy-route-redirect.component';
import { ResourceDashboardComponent } from './resource-dashboard/resource-dashboard.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { OwnerPaymentsComponent } from './owner-payments.component';

@NgModule({
  declarations: [PortalHomeComponent, LegacyRouteRedirectComponent, ResourceDashboardComponent, ResourceListComponent, OwnerPaymentsComponent, AppComponent, Page404Component],
  imports: [SiteManagementComponent,SharedHeaderComponent,PlatformLayoutComponent,RentalHistoryComponent,MessageNotificationsComponent,OwnerListingsComponent,ReleaseFooterComponent,
    ResourceRoutePipe,
    PlatformAdminComponent,
    OwnerDashboardComponent,ConciergeComponent,HomeRolesComponent,OwnerSitePromoComponent,
    SiteTextPipe,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    GodigitalbModule,
    LayoutModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    IonicModule,
    LoggerModule.forRoot({
      serverLoggingUrl: environment.apiUrl,
      level: environment.logLevel,
      serverLogLevel: environment.serverLogLevel,
      disableConsoleLogging: false
    }),
//    FormsModule, ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:LegalInterceptor,multi:true},
    { provide: UrlSerializer, useClass: AssetUrlSerializer },
    {provide:HTTP_INTERCEPTORS,useClass:AssetOwnerReadInterceptor,multi:true},
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UtilsService,
    BarcodeScanner,
    DatePipe,
    Geolocation,
    NativeGeocoder,
    HaversineService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FirebaseMediaInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
