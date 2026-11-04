import {SiteTextPipe} from '../home/site-text.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetGalleryComponent } from './components/asset-gallery/asset-gallery.component';

@NgModule({
  declarations: [AssetGalleryComponent],
  imports: [SiteTextPipe,CommonModule],
  exports: [AssetGalleryComponent]
})
export class SharedModule {}
