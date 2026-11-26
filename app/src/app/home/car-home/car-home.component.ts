import { carOfferLabels } from '../../services/car-offer';
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
  asset: any = null;
  error = '';
  imageFailed = false;
  selectedImage = '';
  failedGalleryImages = new Set<string>();

  constructor(
    private http: HttpClient,
    public ctx: ResourceContextService,
    private media: PrivateMediaService
  ) {}

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
    return this.vehiclePage.intro || this.asset?.headline || '';
  }

  get description(): string {
    return this.vehiclePage.description || this.asset?.description || this.asset?.headline || '';
  }

  get carOffer(): string[] { return carOfferLabels(this.p, 'fr'); }

  get features(): string[] {
    if (Array.isArray(this.vehiclePage.features) && this.vehiclePage.features.length) return this.vehiclePage.features;
    return [
      this.p.seats ? `${this.p.seats} places` : '',
      this.p.transmission || '',
      this.p.fuel || this.p.energy || '',
      this.p.rangeKm ? `Autonomie ${this.p.rangeKm} km` : ''
    ].filter(Boolean);
  }

  get galleryImages(): string[] {
    const m = this.asset?.media || {};
    const raw = [m.hero, m.cover, ...(Array.isArray(m.gallery) ? m.gallery : [])].filter(Boolean);
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
