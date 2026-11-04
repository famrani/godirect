import {SiteTextPipe} from '../../home/site-text.pipe';
import { ListingPublicationGuard } from '../../services/listing-publication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomelayoutComponent } from '../../layout/home/homelayout/homelayout.component';
import { PoolHomeComponent } from './pages/home/pool-home.component';
import { PoolDetailsComponent } from './pages/details/pool-details.component';

const routes:Routes=[{path:':assetId',component:HomelayoutComponent,canActivateChild:[ListingPublicationGuard],children:[
 {path:'',redirectTo:'home',pathMatch:'full'},
 {path:'home',component:PoolHomeComponent},
 {path:'details',component:PoolDetailsComponent},
 {path:'asset',component:PoolDetailsComponent},
 {path:'',loadChildren:()=>import('../../home/home.module').then(m=>m.HomeModule)},
 {path:'',loadChildren:()=>import('../../login/login.module').then(m=>m.LoginModule)}
]}];
@NgModule({imports: [SiteTextPipe,RouterModule.forChild(routes)],exports:[RouterModule]})
export class PoolRoutingModule {}
