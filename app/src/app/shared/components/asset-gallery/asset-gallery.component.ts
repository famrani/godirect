import { Component, HostListener, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-asset-gallery',
  templateUrl: './asset-gallery.component.html',
  styleUrls: ['./asset-gallery.component.scss'],
  standalone: false
})
export class AssetGalleryComponent implements OnChanges {
  @Input() images: string[] = [];
  @Input() title = '';

  selectedIndex = 0;
  lightboxOpen = false;
  private touchStartX: number | null = null;

  get selected(): string { return this.images?.[this.selectedIndex] || ''; }

  ngOnChanges(): void {
    if (!this.images?.length) { this.selectedIndex = 0; this.closeLightbox(); return; }
    if (this.selectedIndex >= this.images.length) this.selectedIndex = 0;
  }

  selectIndex(index: number): void {
    if (!this.images?.length) return;
    this.selectedIndex = Math.max(0, Math.min(index, this.images.length - 1));
  }

  previous(event?: Event): void {
    event?.stopPropagation();
    if (!this.images?.length) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.images.length) % this.images.length;
  }

  next(event?: Event): void {
    event?.stopPropagation();
    if (!this.images?.length) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
  }

  openLightbox(): void {
    if (!this.selected) return;
    this.lightboxOpen = true;
    document.body.classList.add('asset-lightbox-open');
  }

  closeLightbox(event?: Event): void {
    event?.stopPropagation();
    this.lightboxOpen = false;
    document.body.classList.remove('asset-lightbox-open');
  }

  lightboxBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closeLightbox();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches?.[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;
    const endX = event.changedTouches?.[0]?.clientX ?? this.touchStartX;
    const delta = endX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) < 45) return;
    delta < 0 ? this.next() : this.previous();
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent): void {
    if (this.images?.length > 1) { event.preventDefault(); this.previous(); }
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent): void {
    if (this.images?.length > 1) { event.preventDefault(); this.next(); }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (this.lightboxOpen) { event.preventDefault(); this.closeLightbox(); }
  }
}
