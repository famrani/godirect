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
  declarations: [OwnerListingsComponent, LegacyRouteRedirectComponent, ResourceDashboardComponent, ResourceListComponent, OwnerPaymentsComponent, AppComponent, Page404Component],
  imports: [
    PlatformAdminComponent,
    OwnerDashboardComponent,
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
