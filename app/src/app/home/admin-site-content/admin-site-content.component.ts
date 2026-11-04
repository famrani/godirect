import {PHOTO_PERSISTENCE_TEXT,PHOTO_UPLOAD_HINT} from '../../services/photo-persistence-text';
import {SiteContentService} from '../site-content-service/site-content.service';
import {editableAssetMedia} from '../../services/asset-photos';
import {ActivatedRoute} from '@angular/router';
import {hydrateBoatOutings} from '../../services/boat-outings-management';
import {inject} from '@angular/core';
import {UiTextService} from '../../services/ui-text.service';
import { ReservationAuthService } from '../../services/reservation-auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { FleetService, AlegriaBoatResource } from '../fleet.service';
import { ResourceContextService } from '../../services/resource-context.service';
import { AdminMediaService } from '../../services/admin-media.service';

type CmsTab = 'home' | 'outings' | 'boat' | 'pricing' | 'contact';
type LanguageCode = 'fr' | 'en' | 'es' | 'it' | 'de' | 'nl' | 'ru';

interface LanguageOption { id: LanguageCode; label: string; }

@Component({
  standalone: false,
  selector: 'app-admin-site-content',
  templateUrl: './admin-site-content.component.html',
  styleUrls: ['./admin-site-content.component.scss'],
})
export class AdminSiteContentComponent implements OnInit {
 private readonly uiText=inject(UiTextService);
  private readonly firebaseDatabaseUrl = 'https://ailla-poc-default-rtdb.firebaseio.com';
  private readonly rawFirebaseOptions = {
    headers: new HttpHeaders({ 'X-Skip-Media-Resolution': 'true' }),
  };

  readonly languages: LanguageOption[] = [
    { id: 'fr', label: 'Français' },
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Español' },
    { id: 'it', label: 'Italiano' },
    { id: 'de', label: 'Deutsch' },
    { id: 'nl', label: 'Nederlands' },
    { id: 'ru', label: 'Русский' },
  ];

  activeTab: CmsTab = 'home';
  selectedLanguage: LanguageCode = 'fr';
  boatId = 'alegria';
  ownerId = 'alegria';
  boats: AlegriaBoatResource[] = [];

  siteContent: any = {};
  pricing: any = this.defaultPricing();

  loading = false;
  saving = false;
  translating = false;
  uploadingKey = '';
  dirty = false;
  message = '';
  error = '';

  constructor(
    private http: HttpClient,
    private fleetService: FleetService,
    private resourceContext: ResourceContextService,
    public adminMedia: AdminMediaService,
    private reservationAuth: ReservationAuthService,
    private route:ActivatedRoute,
  ) {
    this.boatId = this.resourceContext.boatId;
  }

  private readonly contentCache=inject(SiteContentService);
  get isBoat():boolean { return this.resourceContext.resourceType==='boat'; }
  get assetLabel():string { return ({pool:'Piscine',parking:'Parking',property:'Logement',car:'Voiture'} as Record<string,string>)[this.resourceContext.resourceType] || 'Bien'; }
  assetDraft:any=null;
  private assetMediaDirty=false;
  get assetText():any { const translations=this.assetDraft.translations||(this.assetDraft.translations={});return translations[this.selectedLanguage]||(translations[this.selectedLanguage]={}); }
  private cachedPropertyType = "";
  private cachedPropertyFields:Array<{key:string,label:string,boolean?:boolean,text?:boolean}>=[];
  get propertyFields():Array<{key:string,label:string,boolean?:boolean,text?:boolean}> {
    const type=this.resourceContext.resourceType;
    if(this.cachedPropertyType===type)return this.cachedPropertyFields;
    this.cachedPropertyType=type;
    this.cachedPropertyFields=this.buildPropertyFields();
    return this.cachedPropertyFields;
  }
  trackPropertyField(_index:number,field:{key:string}):string{return field.key;}
  private buildPropertyFields():Array<{key:string,label:string,boolean?:boolean,text?:boolean}> {
    const field=(key:string,label:string,boolean=false,text=false)=>({key,label,boolean,text});
    switch(this.resourceContext.resourceType){
      case 'pool':return [field('lengthM','ui.labels.t1b1b59a7f3e2'),field('widthM','ui.labels.t8b5026d7037d'),field('capacity','ui.labels.t25bc0fbf3cbb'),field('heated','ui.labels.t853940be427f',true),field('indoor','ui.labels.td0e418a36cce',true)];
      case 'parking':return [field('widthM','ui.labels.t8b5026d7037d'),field('lengthM','ui.labels.t1b1b59a7f3e2'),field('heightLimitM','ui.labels.te35c28a897ef'),field('secured','ui.labels.t85014ef6373a',true),field('cctv','ui.labels.t03a0f44e2ab3',true),field('evCharging','ui.labels.t0c375c73fbd0',true)];
      case 'property':return [field('bedrooms','ui.labels.ted5b95f74495'),field('beds','ui.labels.tbe0e99e68559'),field('bathrooms','ui.labels.tb5331e439cba'),field('guests','ui.labels.t67d605234783'),field('surfaceM2','ui.labels.t1ef3f545a51c'),field('checkIn','ui.labels.tf5150c7fbf3d',false,true),field('checkOut','ui.labels.tdc613ae53e0c',false,true)];
      case 'car':return [field('brand','ui.labels.tb539addf71ad',false,true),field('model','ui.labels.t9853170f16b4',false,true),field('seats','ui.labels.t0cd3597453ab'),field('rangeKm','ui.labels.t43a4bb274dfb')];
      default:return [];
    }
  }
  get assetGallery():string[]{return Array.isArray(this.assetDraft?.media?.gallery)?this.assetDraft.media.gallery:[];}
  get assetHero():string{return this.assetDraft?.media?.hero||this.assetDraft?.media?.cover||'';}
  async uploadAssetPhoto(event:Event,gallery=false):Promise<void>{
    const input=event.target as HTMLInputElement;const file=input.files?.[0];
    if(!file||!this.assetDraft||this.uploadingKey||this.saving)return;
    this.error='';this.message='';
    if(!['image/jpeg','image/png','image/webp','image/avif','image/gif'].includes(file.type)||file.size>12*1024*1024){this.error='Choisissez une image JPEG, PNG, WebP, AVIF ou GIF de 12 Mo maximum.';input.value='';return;}
    this.uploadingKey=gallery?'asset-gallery':'asset-cover';
    try{

      const uploaded=await this.adminMedia.upload(file,gallery?'gallery':'content',this.resourceContext.resourceId);
      if(!uploaded?.path)throw new Error('Référence de photo manquante.');
      const saved=await this.cmsSave({photo:{kind:gallery?'gallery':'cover',path:uploaded.path}});
      if(!saved?.ok)throw new Error('La référence de la photo n’a pas été enregistrée.');
      this.assetDraft.media ||= {};
      if(gallery)this.assetDraft.media.gallery=[...new Set([...this.assetGallery,uploaded.path])];
      else{this.assetDraft.media.hero=uploaded.path;this.assetDraft.media.cover=uploaded.path;}
      this.assetMediaDirty=true;this.markDirty();this.message=this.photoText.saved;
    }catch(e:any){this.error=e?.error?.error||e?.error?.message||e?.message||'Téléversement impossible.';}
    finally{this.uploadingKey='';input.value='';}
  }
  removeAssetPhoto(index:number):void{if(this.saving||this.uploadingKey)return;this.assetDraft.media.gallery=this.assetGallery.filter((_,i)=>i!==index);this.assetMediaDirty=true;this.markDirty();}
  moveAssetPhoto(index:number,offset:number):void{if(this.saving||this.uploadingKey)return;const photos=[...this.assetGallery];const target=index+offset;if(target<0||target>=photos.length)return;[photos[index],photos[target]]=[photos[target],photos[index]];this.assetDraft.media.gallery=photos;this.assetMediaDirty=true;this.markDirty();}
  useAssetPhoto(index:number):void{if(this.saving||this.uploadingKey)return;const path=this.assetGallery[index];if(!path)return;this.assetDraft.media.hero=path;this.assetDraft.media.cover=path;this.assetMediaDirty=true;this.markDirty();}
  removeAssetHero():void{if(this.saving||this.uploadingKey)return;this.assetDraft.media ||= {};this.assetDraft.media.hero=null;this.assetDraft.media.cover=null;this.assetMediaDirty=true;this.markDirty();}
  private async bounded<T>(operation:Promise<T>):Promise<T>{
    let timer:ReturnType<typeof setTimeout>|undefined;
    try{return await Promise.race([operation,new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('Le chargement de la session a expiré. Réessayez.')),15000);})]);}
    finally{if(timer!==undefined)clearTimeout(timer);}
  }
  private cmsUrl():string { return `/api/manage/assets/${encodeURIComponent(this.resourceContext.resourceType)}/${encodeURIComponent(this.resourceContext.resourceId)}/content`; }
  private async cmsData():Promise<any>{return firstValueFrom(this.http.get<any>(this.cmsUrl(),{...this.rawFirebaseOptions,headers:(await this.reservationAuth.headers()).set('X-Skip-Media-Resolution','true')}).pipe(timeout(15000)));}
  private async cmsSave(data:any):Promise<any>{const result=await firstValueFrom(this.http.patch(this.cmsUrl(),data,{headers:await this.reservationAuth.headers()}).pipe(timeout(15000)));this.contentCache.invalidate?.();return result;}
  private assetUrl():string { return `${this.firebaseDatabaseUrl}/assets/${encodeURIComponent(this.resourceContext.resourceType)}/${encodeURIComponent(this.resourceContext.resourceId)}.json`; }
  private async loadAssetContent():Promise<void> {
    this.loading=true;this.error='';this.message='';this.assetDraft=null;
    try {
      const asset=(await this.cmsData()).asset;
      this.assetDraft=this.clone(asset);this.assetDraft.media=editableAssetMedia(asset,this.resourceContext.resourceType,this.resourceContext.resourceId);this.assetDraft.properties ||= {};this.assetDraft.pricing ||= {};if(!this.assetDraft.location||typeof this.assetDraft.location!=='object')this.assetDraft.location={};this.assetMediaDirty=JSON.stringify(this.assetDraft.media)!==JSON.stringify(asset.media||{});this.dirty=false;
    }catch(e:any){this.error=e?.message||'Impossible de charger le contenu du bien.';}finally{this.loading=false;}
  }
  private async saveAssetContent():Promise<void> {
    if(!this.assetDraft||this.loading||this.saving||this.uploadingKey)return;
    this.saving=true;this.error='';this.message='';
    try {

      const updates:Record<string,any>={name:String(this.assetDraft.name||'').trim()};
      if(!updates.name)throw new Error('Le nom est obligatoire.');
      const location=this.assetDraft.location||{};if(['parking','pool','property'].includes(this.resourceContext.resourceType)&&(!String(location.city||'').trim()||!String(location.country||'').trim()))throw new Error('Indiquez la ville et le pays du bien.');
      for(const key of ['city','area','country'])if(location[key]!==undefined)updates[`location/${key}`]=String(location[key]).trim();
      for(const language of this.languages){const t=this.assetDraft.translations?.[language.id];if(t)for(const key of ['headline','description'])if(t[key]!==undefined)updates[`translations/${language.id}/${key}`]=String(t[key]);}
      for(const key of ['headline','description'])if(this.assetDraft[key]!==undefined)updates[key]=String(this.assetDraft[key]);
      for(const f of this.propertyFields){const v=this.assetDraft.properties[f.key];if(v===undefined||v===null)continue;if(f.boolean)updates[`properties/${f.key}`]=!!v;else if(f.text)updates[`properties/${f.key}`]=String(v);else{if(!Number.isFinite(Number(v))||Number(v)<0)throw new Error('Caractéristique numérique invalide.');updates[`properties/${f.key}`]=Number(v);}}
      const price=Number(this.assetDraft.pricing.basePrice);if(!Number.isFinite(price)||price<0)throw new Error('Prix invalide.');updates['pricing/basePrice']=price;
      if(this.assetMediaDirty){updates['media/configured']=true;updates['media/hero']=this.assetDraft.media?.hero||null;updates['media/cover']=this.assetDraft.media?.cover||null;updates['media/gallery']=[...this.assetGallery];}
      await this.cmsSave({asset:updates});
      this.assetMediaDirty=false;this.dirty=false;this.message='Contenu du bien enregistré.';
    }catch(e:any){this.error=e?.error?.error||e?.message||'Enregistrement impossible.';}finally{this.saving=false;}
  }

  async ngOnInit(): Promise<void> {
    const tab=this.route.snapshot.queryParamMap.get('tab');
    if(tab&&['home','outings','boat','pricing','contact'].includes(tab))this.activeTab=tab as CmsTab;
    await this.load();
  }

  get current(): any {
    if (!this.siteContent[this.selectedLanguage]) this.siteContent[this.selectedLanguage] = {};
    return this.siteContent[this.selectedLanguage];
  }

  get outings(): any[] {
    if (!Array.isArray(this.current.outings)) this.current.outings = [];
    return this.current.outings;
  }

  get outingsPage(): any {
    if (!this.current.outingsPage) this.current.outingsPage = {};
    return this.current.outingsPage;
  }

  get boatPage(): any {
    if (!this.current.boatPage) this.current.boatPage = {};
    return this.current.boatPage;
  }

  get contactPage(): any {
    if (!this.current.contactPage) this.current.contactPage = {};
    return this.current.contactPage;
  }

  get contactInfo(): any {
    if (!this.current.contactInfo) this.current.contactInfo = {};
    return this.current.contactInfo;
  }

  get homePage(): any {
    if (!this.current.homePage) this.current.homePage = {};
    this.current.homePage.hero = this.current.homePage.hero || {};
    this.current.homePage.experiences = this.current.homePage.experiences || {};
    this.current.homePage.boat = this.current.homePage.boat || {};
    this.current.homePage.journey = this.current.homePage.journey || {};
    this.current.homePage.finalCta = this.current.homePage.finalCta || {};
    return this.current.homePage;
  }

  get pricingContent(): any {
    if (!this.current.homePage) this.current.homePage = {};
    if (!this.current.homePage.pricing) this.current.homePage.pricing = {};
    return this.current.homePage.pricing;
  }

  get brand(): any {
    if (!this.current.brand || typeof this.current.brand !== 'object') {
      this.current.brand = { name: typeof this.current.brand === 'string' ? this.current.brand : 'Alegria' };
    }
    return this.current.brand;
  }

  get boatGallery(): string[] {
    if (!Array.isArray(this.current.galleryImages)) this.current.galleryImages = [];
    return this.current.galleryImages;
  }

  async uploadOutingPhoto(event: Event, outing: any, gallery = false): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const slug = String(outing?.slug || `sortie-${Date.now()}`);
    const key = `outing-${slug}-${gallery ? 'gallery' : 'cover'}`;
    this.uploadingKey = key;
    this.message = '';
    this.error = '';
    try {
      const uploaded = await this.adminMedia.upload(file, 'outings', slug);
      const saved=await this.cmsSave({photo:{kind:gallery?'outing-gallery':'outing-cover',path:uploaded.path,slug}});
      if(!saved?.ok)throw new Error('La référence de la photo n’a pas été enregistrée.');
      this.updateOutingImagesForAllLanguages(slug, uploaded.path, gallery);
      this.markDirty();
      this.message = this.photoText.saved;
    } catch (e: any) {
      this.error = e?.error?.error==='save_outing_before_photo'?this.photoText.saveOuting:(e?.error?.message || e?.error?.error || e?.message || 'Téléversement impossible.');
    } finally {
      this.uploadingKey = '';
      input.value = '';
    }
  }

  async uploadBoatPhoto(event: Event, gallery = false): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const key = gallery ? 'boat-gallery' : 'boat-cover';
    this.uploadingKey = key;
    this.message = '';
    this.error = '';
    try {
      const uploaded = await this.adminMedia.upload(file, 'boat', this.boatId);
      const saved=await this.cmsSave({photo:{kind:gallery?'gallery':'cover',path:uploaded.path}});
      if(!saved?.ok)throw new Error('La référence de la photo n’a pas été enregistrée.');
      for (const language of this.languages) {
        const lang = this.siteContent[language.id] || (this.siteContent[language.id] = {});
        if (gallery) {
          const photos = Array.isArray(lang.galleryImages) ? lang.galleryImages : [];
          if (!photos.includes(uploaded.path)) photos.push(uploaded.path);
          lang.galleryImages = photos;
        } else {
          lang.boatHeroImage = uploaded.path;
        }
      }
      this.markDirty();
      this.message = this.photoText.saved;
    } catch (e: any) {
      this.error = e?.error?.error==='save_outing_before_photo'?this.photoText.saveOuting:(e?.error?.message || e?.error?.error || e?.message || 'Téléversement impossible.');
    } finally {
      this.uploadingKey = '';
      input.value = '';
    }
  }

  removeOutingPhoto(outing: any, path: string): void {
    const slug = String(outing?.slug || '');
    for (const language of this.languages) {
      const localized = (this.siteContent?.[language.id]?.outings || [])
        .find((item: any) => String(item?.slug || '') === slug);
      if (localized && Array.isArray(localized.gallery)) {
        localized.gallery = localized.gallery.filter((photo: string) => photo !== path);
      }
    }
    this.markDirty();
  }

  removeBoatPhoto(path: string): void {
    for (const language of this.languages) {
      const photos = this.siteContent?.[language.id]?.galleryImages;
      if (Array.isArray(photos)) {
        this.siteContent[language.id].galleryImages = photos.filter((photo: string) => photo !== path);
      }
    }
    this.markDirty();
  }

  get photoUploadHint():string{return PHOTO_UPLOAD_HINT[this.selectedLanguage]||PHOTO_UPLOAD_HINT.en;}
  private get photoText(){return PHOTO_PERSISTENCE_TEXT[this.selectedLanguage]||PHOTO_PERSISTENCE_TEXT.en;}
  mediaPreview(path: string): string {
    return this.adminMedia.previewUrl(path);
  }

  private updateOutingImagesForAllLanguages(slug: string, path: string, gallery: boolean): void {
    for (const language of this.languages) {
      const localizedOutings = this.siteContent?.[language.id]?.outings || [];
      const localized = localizedOutings.find((item: any) => String(item?.slug || '') === slug);
      if (!localized) continue;
      if (gallery) {
        localized.gallery = Array.isArray(localized.gallery) ? localized.gallery : [];
        if (!localized.gallery.includes(path)) localized.gallery.push(path);
      } else {
        localized.image = path;
      }
    }
  }

  async load(): Promise<void> {
    if (!this.isBoat) { await this.loadAssetContent(); return; }
    this.loading = true;
    this.message = '';
    this.error = '';
    try {
      const data=await this.cmsData();
      const site=data.siteContent,operationalPricing=data.pricing;
      const profile=data.fleet||{boatId:this.boatId,ownerId:data.asset.ownerId,boatName:data.asset.name};
      const boats=[profile];
      this.siteContent = hydrateBoatOutings(site,data.outings,this.boatId);
      this.boats = boats;

      if(!this.boats.some(boat=>boat.boatId===this.boatId))this.boats=[profile,...this.boats];
      this.ownerId = profile?.ownerId || this.ownerId;
      this.pricing = this.clone(
        operationalPricing ||
        this.defaultPricing()
      );
      this.ensureLanguageShapes();
      this.dirty = false;
    } catch (e: any) {
      this.error = e?.error?.message || 'Impossible de charger le contenu depuis Firebase.';
    } finally {
      this.loading = false;
    }
  }

  async selectBoat(boatId: string): Promise<void> {
    if (boatId !== this.boatId) {
      this.resourceContext.setResourceId(boatId);
      return; // The new URL reloads every service for the selected boat.
    }
    await this.load();
  }

  selectTab(tab: CmsTab): void {
    this.activeTab = tab;
    this.message = '';
    this.error = '';
  }

  markDirty(): void {
    this.dirty = true;
    this.message = '';
  }

  addOuting(): void {
    this.outings.push({
      title: 'Nouvelle sortie',
      description: '',
      duration: '',
      guests: '',
      image: '',
      slug: `sortie-${Date.now()}`,
      highlights: [],
      eyebrow: '',
      subtitle: '',
      intro: '',
      programTitle: '',
      program: [],
      includesTitle: '',
      includes: [],
      idealForTitle: '',
      idealFor: [],
      cta: '',
      contactNote: '',
    });
    this.markDirty();
  }

  removeOuting(index: number): void {
    if (!confirm(this.uiText.text('Supprimer cette sortie dans la langue affichée ?'))) return;
    this.outings.splice(index, 1);
    this.markDirty();
  }

  addArrayItem(target: any[], value = ''): void {
    if (!Array.isArray(target)) return;
    target.push(value);
    this.markDirty();
  }

  removeArrayItem(target: any[], index: number): void {
    if (!Array.isArray(target)) return;
    target.splice(index, 1);
    this.markDirty();
  }

  async translateCurrentTab(): Promise<void> {
    const sourceLanguage = this.selectedLanguage;
    const sourcePayload = this.getTabPayload(sourceLanguage);
    if (!sourcePayload) return;

    this.translating = true;
    this.message = '';
    this.error = '';
    try {
      for (const language of this.languages) {
        if (language.id === sourceLanguage) continue;
        const translated = await this.translateValue(sourcePayload, sourceLanguage, language.id, []);
        this.applyTabPayload(language.id, translated);
      }
      this.dirty = true;
      this.message = `Traduction automatique effectuée depuis ${this.languageLabel(sourceLanguage)} vers les 6 autres langues. Vérifiez les textes avant d’enregistrer.`;
    } catch (e: any) {
      this.error = e?.message || 'La traduction automatique a échoué.';
    } finally {
      this.translating = false;
    }
  }

  async saveCurrentTab(): Promise<void> {
    if (!this.isBoat) { await this.saveAssetContent(); return; }
    this.saving = true;
    this.message = '';
    this.error = '';
    try {
      const siteContent:any={};
      for(const language of this.languages){siteContent[language.id]={};for(const section of this.sectionsForTab(this.activeTab))siteContent[language.id][section]=this.siteContent?.[language.id]?.[section]??null;}
      const payload:any={siteContent};
      if(this.activeTab==='pricing')payload.pricing=this.pricing;
      if(this.activeTab==='outings')payload.outings=await this.saveOperationalOutings();
      await this.cmsSave(payload);
      this.dirty = false;
      this.message = 'Contenu enregistré dans Firebase.';
    } catch (e: any) {
      this.error = e?.error?.message || 'Enregistrement impossible dans Firebase.';
    } finally {
      this.saving = false;
    }
  }

  private primaryBoatHeroImage(): string {
    const preferred = [this.selectedLanguage, 'fr', 'en', 'es', 'it', 'de', 'nl', 'ru'];
    for (const language of preferred) {
      const hero = String(this.siteContent?.[language]?.boatHeroImage || '').trim();
      if (hero) return hero;
    }
    return '';
  }

  private sectionsForTab(tab: CmsTab): string[] {
    switch (tab) {
      case 'home': return ['homePage'];
      case 'outings': return ['outingsPage', 'outings'];
      case 'boat': return ['brand', 'brandTagline', 'boatPage', 'boatHighlights', 'boatHeroImage', 'galleryImages'];
      case 'contact': return ['contactPage', 'contactInfo', 'phoneDisplay', 'phoneRaw'];
      case 'pricing': return ['homePage'];
    }
  }

  private getTabPayload(language: LanguageCode): any {
    const lang = this.siteContent?.[language] || {};
    switch (this.activeTab) {
      case 'home': return { homePage: lang.homePage || {} };
      case 'outings': return { outingsPage: lang.outingsPage || {}, outings: lang.outings || [] };
      case 'boat': return {
        brand: lang.brand || {},
        brandTagline: lang.brandTagline || '',
        boatPage: lang.boatPage || {},
        boatHighlights: lang.boatHighlights || [],
        boatHeroImage: lang.boatHeroImage || '',
        galleryImages: lang.galleryImages || [],
      };
      case 'contact': return {
        contactPage: lang.contactPage || {},
        contactInfo: lang.contactInfo || {},
        phoneDisplay: lang.phoneDisplay || '',
        phoneRaw: lang.phoneRaw || '',
      };
      case 'pricing': return {
        homePage: {
          ...(lang.homePage || {}),
          pricing: lang.homePage?.pricing || {},
        },
      };
    }
  }

  private applyTabPayload(language: LanguageCode, payload: any): void {
    if (!this.siteContent[language]) this.siteContent[language] = {};
    Object.keys(payload || {}).forEach(key => {
      if (key === 'homePage') {
        this.siteContent[language].homePage = {
          ...(this.siteContent[language].homePage || {}),
          ...(payload.homePage || {}),
        };
      } else {
        this.siteContent[language][key] = payload[key];
      }
    });
  }

  private async translateValue(value: any, source: LanguageCode, target: LanguageCode, path: string[]): Promise<any> {
    if (value === null || value === undefined) return value;
    if (typeof value === 'number' || typeof value === 'boolean') return value;
    if (Array.isArray(value)) {
      const translated: any[] = [];
      for (let i = 0; i < value.length; i++) {
        translated.push(await this.translateValue(value[i], source, target, [...path, String(i)]));
      }
      return translated;
    }
    if (typeof value === 'object') {
      const translated: any = {};
      for (const key of Object.keys(value)) {
        translated[key] = await this.translateValue(value[key], source, target, [...path, key]);
      }
      return translated;
    }
    if (typeof value !== 'string' || !value.trim() || this.mustPreserve(path, value)) return value;
    return this.translateText(value, source, target);
  }

  private mustPreserve(path: string[], value: string): boolean {
    const key = (path[path.length - 1] || '').toLowerCase();
    const technicalKeys = ['slug', 'image', 'icon', 'route', 'path', 'email', 'phone', 'phoneraw', 'whatsapp', 'whatsappraw', 'id', 'boatid', 'ownerid'];
    if (technicalKeys.some(item => key.includes(item))) return true;
    if (/^(https?:\/\/|assets\/|\/)/i.test(value)) return true;
    if (/^[+\d\s().-]{6,}$/.test(value)) return true;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true;
    return false;
  }

  private async translateText(text: string, source: LanguageCode, target: LanguageCode): Promise<string> {
    const url = 'https://translate.googleapis.com/translate_a/single';
    const response: any = await firstValueFrom(this.http.get(url, {
      params: { client: 'gtx', sl: source, tl: target, dt: 't', q: text },
    }).pipe(timeout(20000)));
    const translated = Array.isArray(response?.[0])
      ? response[0].map((segment: any[]) => segment?.[0] || '').join('')
      : '';
    return translated || text;
  }

  private ensureLanguageShapes(): void {
    for (const language of this.languages) {
      if (!this.siteContent[language.id]) this.siteContent[language.id] = {};
      const lang = this.siteContent[language.id];
      lang.outingsPage = lang.outingsPage || {};
      lang.outings = Array.isArray(lang.outings) ? lang.outings : [];
      lang.outings.forEach((outing: any) => {
        outing.highlights = Array.isArray(outing.highlights) ? outing.highlights : [];
        outing.program = Array.isArray(outing.program) ? outing.program : [];
        outing.includes = Array.isArray(outing.includes) ? outing.includes : [];
        outing.idealFor = Array.isArray(outing.idealFor) ? outing.idealFor : [];
      });
      lang.boatPage = lang.boatPage || {};
      lang.galleryImages = Array.isArray(lang.galleryImages) ? lang.galleryImages : [];
      lang.contactPage = lang.contactPage || {};
      lang.contactInfo = lang.contactInfo || {};
      lang.homePage = lang.homePage || {};
      lang.homePage.pricing = lang.homePage.pricing || {};
      if (!lang.brand || typeof lang.brand !== 'object') lang.brand = { name: lang.brand || 'Alegria' };
    }
  }

  private async saveOperationalOutings(): Promise<any> {
    const existing=(await this.cmsData()).outings||{};
    const bySlug: any = { ...existing };
    for (const language of this.languages) {
      const localizedOutings = this.siteContent?.[language.id]?.outings || [];
      for (const outing of localizedOutings) {
        if (!outing?.slug) continue;
        const previous = bySlug[outing.slug] || {};
        bySlug[outing.slug] = {
          ...previous,
          id: outing.slug,
          slug: outing.slug,
          active: previous.active !== false,
          boatId: this.boatId,
          ownerId: this.ownerId,
          image: outing.image || previous.image || '',
          gallery: outing.gallery || previous.gallery || [],
          category: outing.category || previous.category || '',
          priceFrom: outing.priceFrom ?? previous.priceFrom ?? null,
          [language.id]: {...(previous[language.id]||{}),...this.localizedOutingPayload(outing)},
          modifiedTS: Date.now(),
          createdTS: previous.createdTS || Date.now(),
        };
      }
    }

    return bySlug;
  }

  private localizedOutingPayload(outing: any): any {
    const keys = [
      'title', 'description', 'duration', 'guests', 'priceLabel', 'priceDetails', 'highlights',
      'eyebrow', 'subtitle', 'intro', 'programTitle', 'program',
      'includesTitle', 'includes', 'idealForTitle', 'idealFor',
      'cta', 'contactNote', 'gallery', 'galleryTitle', 'coreOfferingTitle',
      'coreOffering', 'optionalExtrasTitle', 'optionalExtras',
      'suggestionsTitle', 'guestSuggestions',
    ];
    return keys.reduce((payload: any, key: string) => {
      if (outing[key] !== undefined) payload[key] = this.clone(outing[key]);
      return payload;
    }, {});
  }

  languageLabel(code: LanguageCode): string {
    return this.languages.find(language => language.id === code)?.label || code;
  }

  trackByIndex(index: number): number { return index; }

  private defaultPricing(): any {
    return {
      day: 1200,
      halfDay: 900,
      sunset: 600,
      evening: 900,
      skipperPrice: 300,
      cleaningPrice: 150,
      nominalGuests: 8,
      minGuests: 1,
      maxGuests: 12,
      extraGuestPrice: 60,
      seasonalMultipliers: [],
    };
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }
}
