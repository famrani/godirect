import {SiteTextPipe} from '../../home/site-text.pipe';
import { ListingPublicationGuard } from '../../services/listing-publication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomelayoutComponent } from '../../layout/home/homelayout/homelayout.component';
import { PropertyHomeComponent } from './pages/home/property-home.component';
import { PropertyDetailsComponent } from './pages/details/property-details.component';

const routes:Routes=[{path:':assetId',component:HomelayoutComponent,canActivateChild:[ListingPublicationGuard],children:[
 {path:'',redirectTo:'home',pathMatch:'full'},
 {path:'home',component:PropertyHomeComponent},
 {path:'details',component:PropertyDetailsComponent},
 {path:'asset',component:PropertyDetailsComponent},
 {path:'',loadChildren:()=>import('../../home/home.module').then(m=>m.HomeModule)},
 {path:'',loadChildren:()=>import('../../login/login.module').then(m=>m.LoginModule)}
]}];
@NgModule({imports: [SiteTextPipe,RouterModule.forChild(routes)],exports:[RouterModule]})
export class PropertyRoutingModule {}
