import {assetPhotoPaths} from '../../../../services/asset-photos';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../../../services/resource-context.service';
import { PrivateMediaService } from '../../../../services/private-media.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss'],
  standalone: false,
})
export class CarDetailComponent implements OnInit {
  asset: any = null;
  error = '';
  selectedImage = '';

  constructor(private http: HttpClient, public ctx: ResourceContextService, private media: PrivateMediaService) {}

  ngOnInit(): void {
    this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({
      next: async (asset) => {
        this.asset = await this.media.resolveFirebaseTree(asset);
        this.selectedImage = this.images[0] || '';
      },
      error: () => this.error = 'Voiture introuvable.',
    });
  }

  get p(): any { return this.asset?.properties || {}; }
  get price(): any { return this.asset?.pricing || {}; }
  get details(): any { return this.asset?.vehiclePage || {}; }
  get images(): string[] {
    const values = assetPhotoPaths(this.asset,this.ctx.resourceType,this.ctx.resourceId)
      .map((v: string) => this.media.objectUrl(v));
    return [...new Set(values)];
  }
}
