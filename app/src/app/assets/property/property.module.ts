import {ListingDescriptionComponent} from '../../shared/listing-description.component';
import {SiteTextPipe} from '../../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { ResourceRoutePipe } from '../../services/resource-route.pipe';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyHomeComponent } from './pages/home/property-home.component';
import { PropertyDetailsComponent } from './pages/details/property-details.component';

@NgModule({
 declarations:[PropertyHomeComponent,PropertyDetailsComponent],
 imports: [ListingDescriptionComponent,SiteTextPipe,CommonModule,LayoutModule,SharedModule,ResourceRoutePipe,PropertyRoutingModule]
})
export class PropertyModule {}
