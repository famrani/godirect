import {mediaObjectUrl} from '../../services/media-routes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlegriaBoatResource, AssetType, FleetService } from '../fleet.service';

export interface AssetSearchCriteria {
  assetType: AssetType | 'all';
  geography: string;
  subtype: string;
  capacity: number | null;
}

export interface MarketplaceAsset extends AlegriaBoatResource {
  assetId: string;
  assetType: AssetType;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly firebaseUrl = 'https://ailla-poc-default-rtdb.firebaseio.com';

  constructor(private fleet: FleetService, private http: HttpClient) {}

  async search(criteria: AssetSearchCriteria): Promise<MarketplaceAsset[]> {
    const fleetAssets = await this.listPublishedAssets();
    const assets = await Promise.all(fleetAssets.map((asset) => this.withCmsHeroImage(asset)));
    return assets.filter((asset) => {
      if (asset.search?.searchable === false || asset.active === false) return false;
      if (criteria.assetType !== 'all' && asset.assetType !== criteria.assetType) return false;
      const place = [
        asset.search?.location?.area,
        asset.search?.location?.city,
        asset.search?.location?.region,
        asset.search?.location?.country,
        asset.defaultDepartureMarina,
      ].filter(Boolean).join(' ').toLowerCase();
      if (criteria.geography && !place.includes(criteria.geography.toLowerCase())) return false;
      if (criteria.subtype && criteria.subtype !== 'all') {
        const subtype = String(asset.attributes?.['subtype'] || asset.boatType || '').toLowerCase();
        if (!subtype.includes(criteria.subtype.toLowerCase())) return false;
      }
      return criteria.capacity == null || Number(asset.maxGuests || 0) >= criteria.capacity;
    });
  }

  async find(assetId: string): Promise<MarketplaceAsset | null> {
    const assets = await this.listPublishedAssets();
    const found = assets.find((asset) => asset.assetId === assetId);
    return found ? this.withCmsHeroImage(found) : null;
  }

  private async listPublishedAssets(): Promise<MarketplaceAsset[]> {
    const rows = await this.http.get<any[]>('/api/assets').toPromise();
    const groups:Record<string,any>={};for(const a of rows||[]){(groups[a.assetType]||=( {} ))[a.id]=a;}
    if (!groups || typeof groups !== 'object') return [];
    const result: MarketplaceAsset[] = [];
    for (const type of ['boat', 'car', 'property', 'parking', 'pool'] as const) {
      for (const [id, raw] of Object.entries(groups[type] || {})) {
        const a: any = raw;
        if (!a || a.published !== true || a.status !== 'active' || a.enabled === false) continue;
        result.push(this.normalise({
          boatId: id, assetId: id, assetType: type as AssetType,
          boatName: a.name || id, boatType: a.properties?.boatType || a.properties?.propertyType || type,
          manufacturer: a.properties?.builder || a.properties?.brand,
          model: a.properties?.model, ownerId: a.ownerId,
          maxGuests: a.properties?.capacity || a.properties?.guests || a.properties?.seats || 0,
          defaultDepartureMarina: a.properties?.departurePort,
          imageUrl: a.media?.cover || a.media?.hero || '',
          shortDescription: a.description || '', active: true,
          search: { searchable: true, location: a.location || {}, tags: [] },
          attributes: { subtype: a.properties?.boatType || a.properties?.propertyType || a.properties?.fuel || '' },
        }));
      }
    }
    return result;
  }

  /** Marketplace cards must follow the CMS primary image for EACH resource. */
  private async withCmsHeroImage(asset: MarketplaceAsset): Promise<MarketplaceAsset> {
    try {
      const content = await this.http.get<any>(
        `${this.firebaseUrl}/siteContent/${encodeURIComponent(asset.assetType)}/${encodeURIComponent(asset.assetId)}.json`,
      ).toPromise();

      // siteContent is language-scoped (fr/en/es/de/...). Prefer French, then English,
      // then the first language that actually defines boatHeroImage.
      const candidates = [content?.fr, content?.en, content?.es, content?.de, ...(content && typeof content === 'object' ? Object.values(content) : [])];
      const lang: any = candidates.find((entry: any) => entry && typeof entry === 'object' && String(entry.boatHeroImage || '').trim());
      const hero = String(lang?.boatHeroImage || '').trim();
      if (hero) return { ...asset, imageUrl: this.mediaObjectUrl(hero) };
    } catch {}
    return asset;
  }

  private mediaObjectUrl(path: string): string { return mediaObjectUrl(path || ''); }

  private normalise(asset: AlegriaBoatResource): MarketplaceAsset {
    return {
      ...asset,
      assetId: asset.assetId || asset.boatId,
      assetType: asset.assetType || 'boat',
      search: {
        searchable: true,
        tags: [],
        ...(asset.search || {}),
      },
    };
  }
}
