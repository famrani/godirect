import {SiteTextPipe} from '../../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../layout/layout.module';
import { BoatRoutingModule } from './boat-routing.module';

/** Lazy-loaded GoDirect feature boundary for boat assets. */
@NgModule({
  imports: [SiteTextPipe,CommonModule, LayoutModule, BoatRoutingModule]
})
export class BoatModule {}
