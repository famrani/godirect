import {ListingDescriptionComponent} from '../../shared/listing-description.component';
import {SiteTextPipe} from '../../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { ResourceRoutePipe } from '../../services/resource-route.pipe';
import { PoolRoutingModule } from './pool-routing.module';
import { PoolHomeComponent } from './pages/home/pool-home.component';
import { PoolDetailsComponent } from './pages/details/pool-details.component';

@NgModule({
 declarations:[PoolHomeComponent,PoolDetailsComponent],
 imports: [ListingDescriptionComponent,SiteTextPipe,CommonModule,LayoutModule,SharedModule,ResourceRoutePipe,PoolRoutingModule]
})
export class PoolModule {}
