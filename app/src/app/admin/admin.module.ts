import {SiteTextPipe} from '../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** GoDirect administration feature boundary. Existing admin pages are migrated here incrementally. */
@NgModule({ imports: [SiteTextPipe,CommonModule] })
export class AdminModule {}
