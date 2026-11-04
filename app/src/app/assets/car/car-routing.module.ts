import {SiteTextPipe} from '../../home/site-text.pipe';
import { ListingPublicationGuard } from '../../services/listing-publication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomelayoutComponent } from '../../layout/home/homelayout/homelayout.component';
import { CarHomeComponent } from './pages/home/car-home.component';
import { CarDetailComponent } from './pages/details/car-detail.component';
import { CarBookingComponent } from './pages/booking/car-booking.component';

const routes: Routes = [{
  path: ':assetId',
  component: HomelayoutComponent, canActivateChild:[ListingPublicationGuard],
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: CarHomeComponent },
    { path: 'details', component: CarDetailComponent },
    { path: 'vehicle', component: CarDetailComponent },
    { path: 'voiture', component: CarDetailComponent },
    { path: 'book', component: CarBookingComponent },
    { path: 'reserver', component: CarBookingComponent },
    { path: '', loadChildren: () => import('../../home/home.module').then(m => m.HomeModule) },
    { path: '', loadChildren: () => import('../../login/login.module').then(m => m.LoginModule) }
  ]
}];

@NgModule({ imports: [SiteTextPipe,RouterModule.forChild(routes)], exports: [RouterModule] })
export class CarRoutingModule {}
