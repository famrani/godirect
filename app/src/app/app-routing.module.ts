import {SiteTextPipe} from './home/site-text.pipe';
import {PlatformAdminComponent} from './platform-admin/platform-admin.component';
import {PlatformAdminGuard,OwnerWorkspaceGuard} from './services/platform-admin.guard';
import {PlatformLayoutComponent} from './layout/platform-layout/platform-layout.component';
import { OwnerListingsComponent } from './owner-listings.component';
import { ListingPublicationGuard } from './services/listing-publication.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomelayoutComponent } from './layout/home/homelayout/homelayout.component';
import { Page404Component } from './page404/page404.component';
import { LegacyRouteRedirectComponent } from './legacy-route-redirect/legacy-route-redirect.component';
import { ResourceDashboardComponent } from './resource-dashboard/resource-dashboard.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { OwnerPaymentsComponent } from './owner-payments.component';

const legacy = ['home','sorties','bateau','galerie','reserver','book-online','contact','crew','terms','safety','deposit','booking-process','sea-toys','faq','how-it-works','my-bookings','calendar','my-offers','my-proposals','my-payments','my-profile','my-feedbacks','leave-feedback','my-external-bookings','signup','login','forgotpwd'];

const routes: Routes = [
  {path:'platform/admin',component:PlatformAdminComponent,canActivate:[PlatformAdminGuard]},
  {path:'owner',component:PlatformLayoutComponent,children:[
    {path:'',redirectTo:'listings',pathMatch:'full'},
    {path:'listings',component:OwnerListingsComponent,canActivate:[OwnerWorkspaceGuard]},
    {path:'payments',component:OwnerPaymentsComponent,canActivate:[OwnerWorkspaceGuard]}
  ]},
  { path: '', component: ResourceDashboardComponent, pathMatch: 'full' },

  // Legacy unscoped URLs MUST be checked before the generic resource route.
  // Otherwise URLs such as /admin/reservations are incorrectly interpreted as
  // resourceType=admin/resourceId=reservations.
  ...legacy.map(path => ({ path, component: LegacyRouteRedirectComponent })),
  { path: 'sorties/:slug', component: LegacyRouteRedirectComponent },
  { path: 'bateau/:page', component: LegacyRouteRedirectComponent },
  { path: 'bookings/:bookingId', component: LegacyRouteRedirectComponent },
  { path: 'bookings/:bookingId/invoice', component: LegacyRouteRedirectComponent },
  { path: 'payment/:bookingId', component: LegacyRouteRedirectComponent },
  { path: 'admin/:page', component: LegacyRouteRedirectComponent },
  { path: 'admin/:page/:id', component: LegacyRouteRedirectComponent },
  { path: 'admin/:page/:id/invoice', component: LegacyRouteRedirectComponent },
  { path: 'offer/:offerId', component: LegacyRouteRedirectComponent },
  { path: 'proposal/:proposalId', component: LegacyRouteRedirectComponent },

  // GoDirect owner Stripe Connect settings must be resolved before generic asset routes.
  // Asset-specific Stripe settings must precede the lazy-loaded asset routes.
  { path: ':assetType/:assetId/owner/payments', component: OwnerPaymentsComponent },

  // Asset-type catalogue pages remain available at /boat, /car, etc.
  { path: 'boat', component: ResourceListComponent, pathMatch: 'full', data: { assetType: 'boat' } },
  { path: 'car', component: ResourceListComponent, pathMatch: 'full', data: { assetType: 'car' } },
  { path: 'property', component: ResourceListComponent, pathMatch: 'full', data: { assetType: 'property' } },
  { path: 'parking', component: ResourceListComponent, pathMatch: 'full', data: { assetType: 'parking' } },
  { path: 'pool', component: ResourceListComponent, pathMatch: 'full', data: { assetType: 'pool' } },

  // GoDirect asset-type feature modules. Each asset category is a lazy-loaded
  // architectural boundary, while the legacy HomeModule remains a compatibility layer
  // during the incremental migration of shared/boat pages.
  { path: 'boat', loadChildren: () => import('./assets/boat/boat.module').then(m => m.BoatModule) },
  { path: 'car', loadChildren: () => import('./assets/car/car.module').then(m => m.CarModule) },
  { path: 'property', loadChildren: () => import('./assets/property/property.module').then(m => m.PropertyModule) },
  { path: 'parking', loadChildren: () => import('./assets/parking/parking.module').then(m => m.ParkingModule) },
  { path: 'pool', loadChildren: () => import('./assets/pool/pool.module').then(m => m.PoolModule) },

  // Asset-type indexes and an extensibility fallback for future asset types.
  { path: ':assetType', component: ResourceListComponent, pathMatch: 'full' },
  { path: ':assetType/:assetId', component: HomelayoutComponent, canActivateChild:[ListingPublicationGuard], children: [
    { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
    { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
  ]},
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [SiteTextPipe,RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
