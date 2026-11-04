import {PAGE_TRANSLATIONS,LITERAL_KEYS} from '../../services/page-translations';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { SITE_CONTENT, SiteContent } from '../site-content';
import { SiteLanguage } from '../../services/language.service';
import { ResourceContextService } from '../../services/resource-context.service';
import { PrivateMediaService } from '../../services/private-media.service';

export type SiteContentRoot = Partial<Record<SiteLanguage, any>> & {
  i18n?: Partial<Record<SiteLanguage, any>>;
  languages?: any;
  meta?: any;
};

export interface AlegriaV2TenantConfig {
  tenantId: string;
  slug: string;
  publicUrl?: string;
  brand?: {
    name?: string;
    legalName?: string;
    primaryBoatId?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  settings?: any;
  boats?: Record<string, any>;
}

export interface AlegriaV2ContentRoot {
  alegria_v2?: {
    tenants?: Record<string, AlegriaV2TenantConfig>;
    languages?: Record<string, any>;
    i18n?: Partial<Record<SiteLanguage, any>>;
    routing?: any;
    dataModel?: any;
    meta?: any;
  };
}

@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private readonly restDatabaseUrls = [
    'https://ailla-poc-default-rtdb.firebaseio.com',
  ];

  private readonly languages: SiteLanguage[] = ['fr', 'en', 'es', 'it', 'de', 'nl', 'ru'];
  private readonly defaultTenantId = 'alegria';

  private cacheGeneration=0;
  invalidate():void { this.cacheGeneration++;this.cached=undefined;this.rawSiteContent=undefined;this.scopeLoads.clear(); }
  private cacheScope="";
  private globalContent:any;
  private globalPromise?:Promise<any>;
  private scopeLoads=new Map<string,Promise<Record<SiteLanguage,SiteContent>>>();
  private cached?: Record<SiteLanguage, SiteContent>;
  private rawScope="";
  private rawSiteContent?: SiteContentRoot | null;

  constructor(
    private http: HttpClient,
    private resourceContext: ResourceContextService,
    private privateMedia: PrivateMediaService,
  ) {}

  /**
   * R22.8: shared UI is read from /uiTranslations via the backend.
   * Resource CMS remains scoped to /siteContent/{type}/{id}/{language}.
   *
   * Canonical Firebase shape:
   *   /siteContent/{resourceType}/{resourceId}/{language}/...
   *
   * Backwards compatible only for old dumps that still have:
   *   /siteContent/i18n/fr/...
   *
   * The service no longer reads /alegria_v2 for translations.
   */
  getContent(forceRefresh = false): Promise<Record<SiteLanguage, SiteContent>> {
    const scope=this.resourceContext.scopedPath('siteContent');
    const current=this.scopeLoads.get(scope);if(current&&!forceRefresh)return current;
    const task=this.loadContent(forceRefresh);this.scopeLoads.set(scope,task);
    void task.then(()=>{if(this.scopeLoads.get(scope)===task)this.scopeLoads.delete(scope);},()=>this.scopeLoads.delete(scope));return task;
  }
  private async loadContent(forceRefresh = false): Promise<Record<SiteLanguage, SiteContent>> {
    const scope=this.resourceContext.scopedPath('siteContent');
    if(this.cached&&this.cacheScope===scope&&!forceRefresh)return this.cached;
    this.cacheScope=scope;
    const generation=this.cacheGeneration;
    try{
      if(forceRefresh)this.globalPromise=undefined;
      if(!this.globalContent||forceRefresh){try{this.globalPromise ||= firstValueFrom(this.http.get<any>('/api/ui-content').pipe(timeout(5000))).finally(()=>this.globalPromise=undefined);this.globalContent=await this.globalPromise;}catch{}}
      let scoped:any={};
      try{scoped=await firstValueFrom(this.http.get<any>(`${this.restDatabaseUrls[0]}/${scope}.json`).pipe(timeout(5000)))||{};}catch{}
      const value:any={};
      for(const language of this.languages){
        const fallback=(SITE_CONTENT as any)[language]||(SITE_CONTENT as any).en||{};
        value[language]=this.deepMerge(this.deepMerge(fallback,this.globalContent?.[language]||{}),scoped?.[language]||{});
        // Generic role labels and new shared UI belong to the platform, not boat CMS overrides.
        if(this.globalContent?.[language]?.roles)value[language].roles=this.globalContent[language].roles;
        if(this.globalContent?.[language]?.ui)value[language].ui=this.globalContent[language].ui;
        value[language]=this.applyLegacyContentAliases(value[language]);
      }
      const resolved=await this.privateMedia.resolveFirebaseTree(value).catch(()=>value);
      if(this.cacheScope===scope&&this.cacheGeneration===generation){this.rawSiteContent=scoped;this.rawScope=scope;this.cached=resolved;}
      return resolved;
    }catch{
      const fallback=this.mergeAll(SITE_CONTENT as any);if(this.cacheScope===scope&&this.cacheGeneration===generation)this.cached=fallback;return fallback;
    }
  }

  async getLanguageContent(language: SiteLanguage): Promise<SiteContent> {
    const all = await this.getContent();
    return all[language] || all.en || all.fr || ({} as SiteContent);
  }

  async getRawContent(forceRefresh = false): Promise<any> {
    const scope=this.resourceContext.scopedPath('siteContent');
    if (!forceRefresh && this.rawSiteContent && this.rawScope===scope) return this.rawSiteContent;

    for (const baseUrl of this.restDatabaseUrls) {
      try {
        this.rawSiteContent = await firstValueFrom(this.http.get<any>(
          `${baseUrl}/${this.resourceContext.scopedPath('siteContent')}.json`
        ).pipe(timeout(5000)));
        if (!this.rawSiteContent) {
          this.rawSiteContent = {};
        }
        this.rawScope=scope;
        return this.rawSiteContent;
      } catch {}
    }

    return {};
  }

  async translate(path: string, language: SiteLanguage = 'fr', fallback = ''): Promise<string> {
    const all = await this.getContent();
    return this.tFromContent(all, path, language, fallback);
  }

  /** Synchronous lookup for components/pipes that already hold a content object. */
  tFromContent(all: any, path: string, language: SiteLanguage = 'fr', fallback = ''): string {
    path=LITERAL_KEYS[path]||path;
    const current = all?.[language];
    const english = all?.en;
    const french = all?.fr;

    const value = this.getByPath(current, path);
    if (typeof value === 'string' && value.trim()) return value;
    const bundled=PAGE_TRANSLATIONS[language]?.[path];
    if(typeof bundled==='string' && bundled.trim())return bundled;

    const englishValue = this.getByPath(english, path);
    if (typeof englishValue === 'string') return englishValue;

    const frenchValue = this.getByPath(french, path);
    if (typeof frenchValue === 'string') return frenchValue;

    if (fallback) return fallback;

    // Development-safe fallback: never break rendering because a key is missing.
    return path;
  }

  /**
   * These tenant helpers are intentionally kept as no-op/legacy-safe methods so
   * existing components that still call them do not break. UI translations must
   * not rely on alegria_v2 anymore.
   */
  async getV2Root(_forceRefresh = false): Promise<AlegriaV2ContentRoot | null> {
    return null;
  }

  async getTenantConfig(_tenantId = this.defaultTenantId, _forceRefresh = false): Promise<AlegriaV2TenantConfig | null> {
    return null;
  }

  async getTenantSettings(_tenantId = this.defaultTenantId, _forceRefresh = false): Promise<any> {
    return null;
  }

  async getTenantMarinas(_tenantId = this.defaultTenantId): Promise<Array<{ id: string; label: string; default?: boolean }>> {
    const all = await this.getContent();
    const marinas = (all?.fr as any)?.settings?.marinas || (all?.en as any)?.settings?.marinas;
    return Array.isArray(marinas) ? marinas : [];
  }

  private normalizeSiteContent(raw: SiteContentRoot | null | undefined): Partial<Record<SiteLanguage, Partial<SiteContent>>> | null {
    if (!raw || typeof raw !== 'object') return null;

    // Preferred Release 3.1 shape: siteContent/fr, siteContent/en, etc.
    if (this.hasAnyLanguage(raw)) {
      return raw as Partial<Record<SiteLanguage, Partial<SiteContent>>>;
    }

    // Backwards compatibility only: siteContent/i18n/fr, siteContent/i18n/en, etc.
    if (raw.i18n && this.hasAnyLanguage(raw.i18n as any)) {
      return raw.i18n as Partial<Record<SiteLanguage, Partial<SiteContent>>>;
    }

    return null;
  }

  private hasAnyLanguage(value: any): boolean {
    return !!value && this.languages.some((lang) => !!value[lang]);
  }

  private mergeAll(value: Partial<Record<SiteLanguage, Partial<SiteContent>>>): Record<SiteLanguage, SiteContent> {
    return this.languages.reduce((acc, language) => {
      const fallback = (SITE_CONTENT as any)[language] || SITE_CONTENT.en || SITE_CONTENT.fr;
      (acc as any)[language] = this.deepMerge(fallback, (value as any)[language] || {});
      return acc;
    }, {} as Record<SiteLanguage, SiteContent>);
  }

  /**
   * Firebase is the source of truth when it answers successfully. We only use
   * another Firebase language as a language-level fallback; SITE_CONTENT is not
   * merged field by field into live content.
   */
  private normalizeFirebaseLanguages(
    value: Partial<Record<SiteLanguage, Partial<SiteContent>>>
  ): Record<SiteLanguage, SiteContent> {
    const english = (value as any).en || {};
    const french = (value as any).fr || {};
    return this.languages.reduce((acc, language) => {
      const localized = (value as any)[language];
      const merged = this.deepMerge(
        this.deepMerge({}, french || english),
        localized || french || english
      );
      (acc as any)[language] = this.applyLegacyContentAliases(merged);
      return acc;
    }, {} as Record<SiteLanguage, SiteContent>);
  }

  /**
   * `admin-proposals` was renamed to `admin-offers`. Older Firebase dumps still
   * contain the WhatsApp dialog copy under the former component path. Preserve
   * those installations while the canonical Firebase patch is being imported.
   */
  private applyLegacyContentAliases<T>(content: T): T {
    const output: any = content || {};
    const home = output?.auto?.home;
    if (!home || typeof home !== 'object') return output as T;

    const legacy = home?.['admin-proposals']?.['admin-proposals']?.component;
    const current = home?.['admin-offers']?.['admin-offers']?.component;
    if (!legacy || typeof legacy !== 'object') return output as T;

    const normalized = this.deepMerge({}, legacy) as any;
    if (!normalized.envoyer_la_offre_au_client && legacy.envoyer_la_proposition_au_client) {
      normalized.envoyer_la_offre_au_client = legacy.envoyer_la_proposition_au_client;
    }

    home['admin-offers'] = home['admin-offers'] || {};
    home['admin-offers']['admin-offers'] = home['admin-offers']['admin-offers'] || {};
    home['admin-offers']['admin-offers'].component = this.deepMerge(normalized, current || {});
    return output as T;
  }

  private deepMerge<T>(target: T, source: any): T {
    if (Array.isArray(source)) {
      return source as T;
    }

    if (!source || typeof source !== 'object') {
      return target;
    }

    const output: any = Array.isArray(target) ? [...(target as any)] : { ...(target as any) };

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (Array.isArray(sourceValue)) {
        output[key] = sourceValue;
      } else if (sourceValue && typeof sourceValue === 'object') {
        output[key] = this.deepMerge(targetValue || {}, sourceValue);
      } else if (sourceValue !== undefined && sourceValue !== null) {
        output[key] = sourceValue;
      }
    });

    return output as T;
  }

  private getByPath(obj: any, path: string): any {
    return String(path || '')
      .split('.')
      .filter(Boolean)
      .reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj);
  }
}
