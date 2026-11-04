import {assetPhotoPaths} from '../../../../services/asset-photos';
import {SiteContentService} from '../../../../home/site-content-service/site-content.service';
import { LanguageService } from '../../../../services/language.service';
import { ASSET_PAGE_I18N } from '../../../../services/asset-page-i18n';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../../../services/resource-context.service';
import { PrivateMediaService } from '../../../../services/private-media.service';

@Component({
  selector: 'app-car-home',
  templateUrl: './car-home.component.html',
  styleUrls: ['./car-home.component.scss'],
  standalone: false
})
export class CarHomeComponent implements OnInit {

  uiContent:any=null;
  t(key:string):string { const fallback=ASSET_PAGE_I18N[this.language.currentLanguage]?.[key] || ASSET_PAGE_I18N.fr[key] || key;return this.contentService?.tFromContent(this.uiContent,'ui.assetPages.'+key,this.language.currentLanguage,fallback)||fallback; }
  get localized():any { return this.asset?.translations?.[this.language.currentLanguage] || {}; }
  get localizedHeadline():string { return this.localized.headline || this.asset?.headline || ''; }
  get localizedDescription():string { return this.localized.description || this.asset?.description || ''; }
  asset: any = null;
  error = '';
  imageFailed = false;
  selectedImage = '';
  failedGalleryImages = new Set<string>();

  constructor(
    private http: HttpClient,
    public ctx: ResourceContextService,
    private media: PrivateMediaService, public language: LanguageService, private contentService:SiteContentService) {}

  ngOnInit(): void {
    const assetId = this.ctx.resourceId;
    this.http.get<any>(`/api/assets/${encodeURIComponent(assetId)}`).subscribe({
      next: async (asset) => {
        this.asset = await this.media.resolveFirebaseTree(asset);
        this.imageFailed = false;
        this.selectedImage = '';
      },
      error: (err) => {
        console.error(`Unable to load car asset ${assetId}`, err);
        this.error = 'Voiture introuvable.';
      }
    });
  }

  get p(): any { return this.asset?.properties || {}; }
  get price(): any { return this.asset?.pricing || {}; }
  get vehiclePage(): any { return this.asset?.vehiclePage || {}; }

  get title(): string {
    return this.vehiclePage.title || this.asset?.name || [this.p.brand, this.p.model].filter(Boolean).join(' ') || 'Voiture';
  }

  get intro(): string {
    return this.localized.intro || this.vehiclePage.intro || this.localizedHeadline;
  }

  get description(): string {
    return this.localized.description || this.vehiclePage.description || this.localizedDescription || this.localizedHeadline;
  }

  get features(): string[] {
    if (Array.isArray(this.localized.features) && this.localized.features.length) return this.localized.features;
    if (this.language.currentLanguage === 'fr' && Array.isArray(this.vehiclePage.features) && this.vehiclePage.features.length) return this.vehiclePage.features;
    return [
      this.p.seats ? `${this.p.seats} ${this.t('seats')}` : '',
      this.p.transmission ? this.t('automatic') : '',
      (this.p.fuel || this.p.energy) ? this.t('electric') : '',
      this.p.rangeKm ? `${this.t('range')} ${this.p.rangeKm} km` : ''
    ].filter(Boolean);
  }

  get galleryImages(): string[] {
    const raw = assetPhotoPaths(this.asset,this.ctx.resourceType,this.ctx.resourceId);
    return [...new Set(raw.map((value: string) => this.media.objectUrl(value)))]
      .filter((value: string) => !this.failedGalleryImages.has(value));
  }

  get heroImage(): string {
    if (this.selectedImage && !this.failedGalleryImages.has(this.selectedImage)) return this.selectedImage;
    return this.galleryImages[0] || '';
  }

  selectImage(image: string): void {
    this.selectedImage = image;
    this.imageFailed = false;
  }

  onImageError(): void {
    const failed = this.heroImage;
    if (failed) this.failedGalleryImages.add(failed);
    this.selectedImage = '';
    this.imageFailed = this.galleryImages.length === 0;
    console.error('Car hero image could not be loaded:', failed);
  }

  onGalleryImageError(image: string): void {
    this.failedGalleryImages.add(image);
    if (this.selectedImage === image) this.selectedImage = '';
  }
}
