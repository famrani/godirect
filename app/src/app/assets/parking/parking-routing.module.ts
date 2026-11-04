import {SiteTextPipe} from '../../home/site-text.pipe';
import { ListingPublicationGuard } from '../../services/listing-publication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomelayoutComponent } from '../../layout/home/homelayout/homelayout.component';
import { ParkingHomeComponent } from './pages/home/parking-home.component';
import { ParkingDetailsComponent } from './pages/details/parking-details.component';

const routes:Routes=[{path:':assetId',component:HomelayoutComponent,canActivateChild:[ListingPublicationGuard],children:[
 {path:'',redirectTo:'home',pathMatch:'full'},
 {path:'home',component:ParkingHomeComponent},
 {path:'details',component:ParkingDetailsComponent},
 {path:'asset',component:ParkingDetailsComponent},
 {path:'',loadChildren:()=>import('../../home/home.module').then(m=>m.HomeModule)},
 {path:'',loadChildren:()=>import('../../login/login.module').then(m=>m.LoginModule)}
]}];
@NgModule({imports: [SiteTextPipe,RouterModule.forChild(routes)],exports:[RouterModule]})
export class ParkingRoutingModule {}
