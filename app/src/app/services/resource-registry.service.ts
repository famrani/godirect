import {descriptionPlainText} from './listing-description';
import {mediaObjectUrl} from './media-routes';
import { Injectable } from '@angular/core';
import {firstValueFrom,timeout} from 'rxjs';
import {DiscoveryFilters} from './discovery-search';
import { HttpClient } from '@angular/common/http';

export interface ResourceRegistryItem {
  name: string;
  siteUrl?:string;
  pricing?:any;
  translations?:Record<string,any>;
  enabled?: boolean;
  description?: string;
  locationLabel?:string;
  coverImage?: string;
  resourceType?: string;
  resourceId?: string;
}

export interface ResourceTypeSummary {
  type: string;
  label: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class ResourceRegistryService {
  private readonly firebaseUrl = 'https://ailla-poc-default-rtdb.firebaseio.com';
  private readonly supported = ['boat', 'car', 'property', 'parking', 'pool'];
  private readonly labels: Record<string, string> = { boat: 'Boats', car: 'Cars', property: 'Properties', parking: 'Parking', pool: 'Pools' };

  constructor(private http: HttpClient) {}

  /** The authoritative RTDB schema is assets/{assetType}/{assetId}. */
  private async allAssets(): Promise<Record<string, any>> {
    const rows = await this.http.get<any[]>('/api/assets').toPromise();
    const flattened:Record<string,any>={};
    for(const asset of rows||[])flattened[`${asset.assetType}/${asset.id}`]=asset;
    return flattened;
  }

  private isPublic(asset: any): boolean {
    return !!asset && asset.published === true && asset.status === 'active' && asset.enabled !== false;
  }

  async listTypes(): Promise<ResourceTypeSummary[]> {
    const assets = await this.allAssets();
    return this.supported.map(type => ({
      type, label: this.labels[type],
      count: Object.values(assets).filter((asset: any) => asset.assetType === type && this.isPublic(asset)).length,
    }));
  }

  async list(type: string): Promise<Array<ResourceRegistryItem & { resourceId: string; resourceType: string }>> {
    if (!this.supported.includes(type)) return [];
    const assets = await this.allAssets();
    return Object.entries(assets)
      .filter(([, asset]) => asset.assetType === type && this.isPublic(asset))
      .map(([key, asset]) => ({
        resourceId: key.split('/')[1], resourceType: type,
        name: asset.name || key.split('/')[1], description: descriptionPlainText(asset.description || ''),
        coverImage: asset.media?.cover || '', enabled: true,locationLabel:[asset.location?.area,asset.location?.city,asset.location?.country].filter(Boolean).join(' · '),
      }));
  }

  async search(filters:DiscoveryFilters={}):Promise<Array<ResourceRegistryItem & {resourceId:string;resourceType:string}>>{
    const params:Record<string,string>={};for(const [key,value] of Object.entries(filters))if(value)params[key]=value;
    const rows=await firstValueFrom(this.http.get<any[]>('/api/assets',{params}).pipe(timeout(12000)));
    return (rows||[]).filter(a=>this.isPublic(a)).map(a=>({siteUrl:a.siteUrl,resourceId:a.id,resourceType:a.assetType,name:a.name||a.id,description:descriptionPlainText(a.headline||a.description||''),coverImage:a.media?.hero||a.media?.cover||a.media?.gallery?.[0]||'',locationLabel:[a.location?.area,a.location?.city,a.location?.country].filter(Boolean).join(' · '),pricing:a.pricing,translations:a.translations}));
  }
  mediaUrl(path?: string): string { return mediaObjectUrl(path || ''); }
}
