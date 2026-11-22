import {ListingDescriptionComponent} from '../../shared/listing-description.component';
import {SiteTextPipe} from '../../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LayoutModule } from '../../layout/layout.module';
import { CarRoutingModule } from './car-routing.module';
import { CarHomeComponent } from './pages/home/car-home.component';
import { CarDetailComponent } from './pages/details/car-detail.component';
import { CarBookingComponent } from './pages/booking/car-booking.component';
import { ResourceRoutePipe } from '../../services/resource-route.pipe';

@NgModule({
  declarations: [CarHomeComponent, CarDetailComponent],
  imports: [CarBookingComponent,ListingDescriptionComponent,SiteTextPipe,CommonModule, FormsModule, IonicModule, LayoutModule, ResourceRoutePipe, CarRoutingModule]
})
export class CarModule {}
