import {SiteTextPipe} from '../../home/site-text.pipe';
import { ListingPublicationGuard } from '../../services/listing-publication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomelayoutComponent } from '../../layout/home/homelayout/homelayout.component';

const routes: Routes = [
  {
    path: ':assetId',
    component: HomelayoutComponent, canActivateChild:[ListingPublicationGuard],
    children: [
      { path: '', loadChildren: () => import('../../home/home.module').then(m => m.HomeModule) },
      { path: '', loadChildren: () => import('../../login/login.module').then(m => m.LoginModule) }
    ]
  }
];

@NgModule({
  imports: [SiteTextPipe,RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoatRoutingModule {}
