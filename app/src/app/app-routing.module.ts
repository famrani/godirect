import {PortalHomeComponent} from './portals/portal-home.component';
import {PortalGuard} from './services/portal.guard';
import {SiteTextPipe} from './home/site-text.pipe';
import {PlatformAdminComponent} from './platform-admin/platform-admin.component';
import {PlatformAdminGuard,OwnerWorkspaceGuard,ManagementWorkspaceGuard} from './services/platform-admin.guard';
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
 {path:'espaces',loadComponent:()=>import('./workspace/spaces.component').then(m=>m.SpacesComponent),canActivate:[ManagementWorkspaceGuard]},
 {path:'managed-portfolio',loadComponent:()=>import('./workspace/concierge.component').then(m=>m.ConciergeComponent),canActivate:[ManagementWorkspaceGuard]},
 {path:'site-management',loadComponent:()=>import('./workspace/site-management.component').then(m=>m.SiteManagementComponent)},
  {path:'owner/client-view',loadComponent:()=>import('./workspace/client-space.component').then(m=>m.ClientSpaceComponent),canActivate:[OwnerWorkspaceGuard]},
  {path:'site-client',loadComponent:()=>import('./workspace/client-space.component').then(m=>m.ClientSpaceComponent)},

  {path:'owner/alerts',loadComponent:()=>import('./workspace/mobile-alerts.component').then(m=>m.MobileAlertsComponent),canActivate:[ManagementWorkspaceGuard]},
  {path:'concierge/alerts',loadComponent:()=>import('./workspace/mobile-alerts.component').then(m=>m.MobileAlertsComponent),canActivate:[ManagementWorkspaceGuard]},
 {path:'concierge-role',loadComponent:()=>import('./portals/concierge-role.component').then(m=>m.ConciergeRoleComponent)},
  {path:'messages',pathMatch:'full',loadComponent:()=>import('./messaging/messaging.component').then(m=>m.MessagingComponent)},
  {path:'asset-calendar/:type/:id',loadComponent:()=>import('./calendar/asset-calendar.component').then(m=>m.AssetCalendarComponent)},
  {path:'admin-access',pathMatch:'full',loadComponent:()=>import('./platform-admin/admin-access.component').then(m=>m.AdminAccessComponent)},
  {path:'contact',pathMatch:'full',loadComponent:()=>import('./contact-page/contact-page.component').then(m=>m.ContactPageComponent)},
  {path:'legal',pathMatch:'full',loadComponent:()=>import('./legal/legal-page.component').then(m=>m.LegalPageComponent)},
  {path:'faq',pathMatch:'full',loadComponent:()=>import('./legal/faq.component').then(m=>m.FaqComponent)},
  {path:'account/accept-terms',pathMatch:'full',loadComponent:()=>import('./legal/legal-page.component').then(m=>m.LegalPageComponent),data:{accept:true}},
  {path:'account/rental-history',component:PlatformLayoutComponent,canActivate:[ManagementWorkspaceGuard],children:[{path:'',loadComponent:()=>import('./workspace/rental-history.component').then(m=>m.RentalHistoryComponent)}]},
  {path:'account',children:[
    {path:'profile',loadComponent:()=>import('./workspace/workspace.component').then(m=>m.WorkspaceComponent),data:{kind:'profile'}},
    {path:'bookings',loadComponent:()=>import('./workspace/workspace.component').then(m=>m.WorkspaceComponent),data:{kind:'bookings'}},
    {path:'payments',loadComponent:()=>import('./workspace/workspace.component').then(m=>m.WorkspaceComponent),data:{kind:'payments'}},
    {path:'ratings',loadComponent:()=>import('./workspace/workspace.component').then(m=>m.WorkspaceComponent),data:{kind:'ratings'}},
    {path:'',component:PlatformLayoutComponent,loadChildren:()=>import('./login/login.module').then(m=>m.LoginModule)}
  ]},
  {path:'owner/listings/:type/:id/documents',loadComponent:()=>import('./workspace/asset-documents.component').then(m=>m.AssetDocumentsComponent),canActivate:[ManagementWorkspaceGuard]},
  {path:'owner/delegations',loadComponent:()=>import('./workspace/concierge.component').then(m=>m.ConciergeComponent),data:{delegations:true},canActivate:[ManagementWorkspaceGuard]},
  {path:'concierge',pathMatch:'full',loadComponent:()=>import('./workspace/concierge.component').then(m=>m.ConciergeComponent),canActivate:[ManagementWorkspaceGuard]},
  {path:'concierge/customers',loadComponent:()=>import('./workspace/owner-customers.component').then(m=>m.OwnerCustomersComponent),data:{concierge:true},canActivate:[ManagementWorkspaceGuard]},
  {path:'concierge/activity/:section',loadComponent:()=>import('./workspace/workspace.component').then(m=>m.WorkspaceComponent),data:{owner:true,concierge:true},canActivate:[ManagementWorkspaceGuard]},
  {path:'owner/site-settings',loadComponent:()=>import('./workspace/owner-site-settings.component').then(m=>m.OwnerSiteSettingsComponent),canActivate:[OwnerWorkspaceGuard]},
  {path:'owner/customers',loadComponent:()=>import('./workspace/owner-customers.component').then(m=>m.OwnerCustomersComponent),canActivate:[OwnerWorkspaceGuard]},
  {path:'owner/activity/:section',loadComponent:()=>import('./workspace/workspace.component').then(m=>m.WorkspaceComponent),data:{owner:true}},
  {path:'__asset_unavailable',loadComponent:()=>import('./workspace/asset-unavailable.component').then(m=>m.AssetUnavailableComponent)},
  {path:'platform/admin/assets/:type/:id',loadComponent:()=>import('./platform-admin/platform-asset.component').then(m=>m.PlatformAssetComponent),canActivate:[PlatformAdminGuard]},
  {path:'platform/admin/documents/:type/:id',loadComponent:()=>import('./workspace/asset-documents.component').then(m=>m.AssetDocumentsComponent),canActivate:[PlatformAdminGuard],data:{documentReview:true}},
  {path:'platform/admin/documents',loadComponent:()=>import('./workspace/document-review.component').then(m=>m.DocumentReviewComponent),canActivate:[PlatformAdminGuard]},
  {path:'platform/admin/legal',pathMatch:'full',redirectTo:'platform/admin/documents'},
  {path:'platform/admin/terms',loadComponent:()=>import('./legal/legal-admin.component').then(m=>m.LegalAdminComponent),canActivate:[PlatformAdminGuard]},
  {path:'platform/admin/notifications',loadComponent:()=>import('./notifications/notification-admin.component').then(m=>m.NotificationAdminComponent),canActivate:[PlatformAdminGuard]},
  {path:'platform/admin',component:PlatformAdminComponent,canActivate:[PlatformAdminGuard]},
  {path:'owner',component:PlatformLayoutComponent,children:[
    {path:'',redirectTo:'listings',pathMatch:'full'},
    {path:'start',component:OwnerListingsComponent,data:{firstListing:true},canActivate:[ManagementWorkspaceGuard]},
    {path:'listings',component:OwnerListingsComponent,canActivate:[OwnerWorkspaceGuard]},
    {path:'payments',component:OwnerPaymentsComponent,canActivate:[OwnerWorkspaceGuard]}
  ]},
  {path:'locations',component:ResourceDashboardComponent},
  { path: '', component: PortalHomeComponent, pathMatch: 'full' },

  ...['login','signup','forgotpwd'].map(path=>({path,redirectTo:'account/'+path,pathMatch:'full' as const})),
  {path:'my-profile',redirectTo:'account/profile',pathMatch:'full'},
  {path:'my-bookings',redirectTo:'account/bookings',pathMatch:'full'},
  {path:'my-payments',redirectTo:'account/payments',pathMatch:'full'},
  {path:'my-feedbacks',redirectTo:'account/ratings',pathMatch:'full'},
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
  {path:':type/:id/calendar',loadComponent:()=>import('./calendar/asset-calendar.component').then(m=>m.AssetCalendarComponent)},
  {path:':type/:id/admin/calendar',loadComponent:()=>import('./calendar/asset-calendar.component').then(m=>m.AssetCalendarComponent)},
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
  imports: [SiteTextPipe,RouterModule.forRoot(routes.map(route=>route.redirectTo!==undefined?route:({...route,canActivate:[PortalGuard,...(route.canActivate||[])]})), {
    preloadingStrategy: PreloadAllModules,
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
