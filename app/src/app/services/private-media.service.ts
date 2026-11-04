import {MEDIA_ROUTES, mediaObjectPath, mediaObjectUrl} from './media-routes';
import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ResourceContextService } from './resource-context.service';

interface MediaUrlsResponse {
  expiresAt: number;
  urls: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class PrivateMediaService {
  private readonly http: HttpClient;
  private readonly cache = new Map<string, { url: string; expiresAt: number }>();
  private readonly imagePattern = /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

  constructor(handler: HttpBackend, private resourceContext: ResourceContextService) {
    // A dedicated client bypasses the Firebase response interceptor and avoids
    // an interceptor loop when requesting signed URLs from our own backend.
    this.http = new HttpClient(handler);
  }

  async resolveFirebaseTree<T>(body: T): Promise<T> {
    const values = new Set<string>();
    this.collectImageValues(body, values);
    if (!values.size) return body;

    // All persistent image references are served by the private bucket proxy.

    const valueToPath = new Map<string, string>();
    for (const value of values) {
      const objectPath = this.toObjectPath(value);
      if (objectPath) valueToPath.set(value, objectPath);
    }
    if (!valueToPath.size) return body;

    const urls = await this.resolvePaths([...new Set(valueToPath.values())]);
    return this.replaceImageValues(body, valueToPath, urls);
  }

  /** Uploaded blob previews are temporary; persistent images always use the backend. */
  objectUrl(value: string): string {
    const raw = String(value || '').trim();
    return /^(data:image\/|blob:)/i.test(raw) ? raw : mediaObjectUrl(raw);
  }

  private async resolvePaths(paths: string[]): Promise<Record<string, string>> {
    const now = Date.now();
    const resolved: Record<string, string> = {};
    const missing: string[] = [];

    for (const objectPath of paths) {
      const cached = this.cache.get(objectPath);
      if (cached && cached.expiresAt > now + 5 * 60 * 1000) resolved[objectPath] = cached.url;
      else missing.push(objectPath);
    }

    for (let offset = 0; offset < missing.length; offset += 200) {
      try {
        const response = await firstValueFrom(this.http.post<MediaUrlsResponse>(
          MEDIA_ROUTES.urls,
          { paths: missing.slice(offset, offset + 200) },
        ));
        const signedUrls: Record<string, string> = response.urls || {};
        for (const objectPath of Object.keys(signedUrls)) {
          const url = mediaObjectUrl(signedUrls[objectPath]);
          this.cache.set(objectPath, { url, expiresAt: Number(response.expiresAt || 0) });
          resolved[objectPath] = url;
        }
      } catch (error) {
        console.warn('Private media URL resolution failed', error);
      }
    }

    return resolved;
  }

  private collectImageValues(value: any, result: Set<string>): void {
    if (Array.isArray(value)) {
      value.forEach((item) => this.collectImageValues(item, result));
      return;
    }
    if (value && typeof value === 'object') {
      Object.values(value).forEach((item) => this.collectImageValues(item, result));
      return;
    }
    if (typeof value === 'string' && this.imagePattern.test(value)) result.add(value);
  }

  private replaceImageValues<T>(value: T, valueToPath: Map<string, string>, urls: Record<string, string>): T {
    if (Array.isArray(value)) {
      return value.map((item) => this.replaceImageValues(item, valueToPath, urls)) as any;
    }
    if (value && typeof value === 'object') {
      const output: any = {};
      for (const [key, child] of Object.entries(value as any)) {
        output[key] = this.replaceImageValues(child, valueToPath, urls);
      }
      return output;
    }
    if (typeof value === 'string') {
      const objectPath = valueToPath.get(value);
      return (objectPath ? (urls[objectPath] || this.objectUrl(value)) : value) as any;
    }
    return value;
  }

  private toObjectPath(value: string): string | null { return mediaObjectPath(value); }
}
