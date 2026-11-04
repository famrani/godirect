import {SiteTextPipe} from '../../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { ResourceRoutePipe } from '../../services/resource-route.pipe';
import { ParkingRoutingModule } from './parking-routing.module';
import { ParkingHomeComponent } from './pages/home/parking-home.component';
import { ParkingDetailsComponent } from './pages/details/parking-details.component';

@NgModule({
 declarations:[ParkingHomeComponent,ParkingDetailsComponent],
 imports: [SiteTextPipe,CommonModule,LayoutModule,SharedModule,ResourceRoutePipe,ParkingRoutingModule]
})
export class ParkingModule {}
