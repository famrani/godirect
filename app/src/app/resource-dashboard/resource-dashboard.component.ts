import {OWNER_OFFER_TEXT} from '../services/owner-offer-text';
import {SiteContentService} from '../home/site-content-service/site-content.service';
import {AssetAccessService} from '../services/asset-access.service';
import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import {DISCOVERY_TEXT} from '../services/discovery-text';
import {DiscoveryFilters,discoveryFilters,localDateTime} from '../services/discovery-search';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServicesService } from 'godigital-lib';
import { ResourceRegistryService, ResourceTypeSummary, ResourceRegistryItem } from '../services/resource-registry.service';
import { LanguageService, SiteLanguage } from '../services/language.service';
import { MARKETPLACE_TRANSLATIONS } from '../services/marketplace-translations';
import { boatPath } from '../services/boat-routing';

@Component({ standalone:false, selector: 'app-resource-dashboard', templateUrl: './resource-dashboard.component.html', styleUrls: ['./resource-dashboard.component.scss'] })
export class ResourceDashboardComponent implements OnInit, OnDestroy {
  get listingOffline():boolean{return typeof window!=='undefined'&&new URLSearchParams(window.location.search).has('listing');}
  get isPlatformAdmin(){return this.assetAccess.isPlatformAdmin;}
  browseAsCustomer=false;
  browseRentals(){void this.router.navigate(['/'],{queryParams:{view:'rentals'},fragment:'rentals'});}
  showOwnerDashboard(){void this.router.navigate(['/']);}
  types: ResourceTypeSummary[] = [];
  loading = true;
  results:Array<ResourceRegistryItem & {resourceId:string;resourceType:string}>=[];
  publishChoiceOpen=false;
  @ViewChild('publicationDialog') private publicationDialog?:ElementRef<HTMLDialogElement>;
  searching=false;searched=false;searchError='';locationOptions:string[]=[];
  private searchRequest=0;private querySub?:Subscription;private lastSearch='';private appliedFilters:DiscoveryFilters={};
  location = '';
  startDate = '';
  endDate = '';
  selectedType = '';
  loggedUser: any = null;
  private accountSub?: Subscription;
  readonly languages: SiteLanguage[] = ['fr','en','es','de','it','nl','ru'];
  get lang(): SiteLanguage { return this.language.currentLanguage; }
  setLang(value: string): void { if (this.language.isSupportedLanguage(value)) this.language.setLanguage(value); }
  uiContent:any;
  t(key: string): string { if(key==='ownerWorkspace')return this.siteContent.tFromContent(this.uiContent,'ui.ownerDashboard.eyebrow',this.lang,this.lang==='fr'?'Espace propriétaire':'Owner workspace');const live=this.uiContent?.[this.lang]?.ui?.marketplace?.[key];if(typeof live==='string')return live;return MARKETPLACE_TRANSLATIONS[this.lang]?.[key] || MARKETPLACE_TRANSLATIONS.en[key] || key; }
  typeLabel(type: string): string { return this.t(type); }

  constructor(
    private registry: ResourceRegistryService,
    private router: Router,
    private mainSvc: ServicesService,
    public language: LanguageService,
    public assetAccess:AssetAccessService,
    private siteContent:SiteContentService,
    private route:ActivatedRoute
) {}

  async ngOnInit() {
    if(typeof document!=='undefined'&&!document.getElementById('godirect-discovery-style')){const link=document.createElement('link');link.id='godirect-discovery-style';link.rel='stylesheet';link.href=new URL('assets/styles/godirect-discovery.css',document.baseURI).toString();document.head.appendChild(link);}
    void this.siteContent.getContent().then(c=>this.uiContent=c);void this.assetAccess.refresh();
    this.querySub=this.route.queryParamMap.subscribe(params=>{
      this.browseAsCustomer=params.get('view')==='rentals';
      this.selectedType=params.get('type')||'';this.location=params.get('location')||'';
      const a=params.get('startAt')||'',b=params.get('endAt')||'';this.startDate=localDateTime(a);this.endDate=localDateTime(b);
      try{if((a&&!this.startDate)||(b&&!this.endDate))throw Error('invalidDates');const filters=discoveryFilters(this.selectedType,this.location,this.startDate,this.endDate);if(JSON.stringify(filters)!==this.lastSearch)void this.runSearch(filters);}catch(e:any){this.lastSearch='';this.searchRequest++;this.searching=false;this.searchError=e.message;this.results=[];}
    });
    try{const rows=await this.registry.search();this.locationOptions=[...new Set(rows.map(a=>a.locationLabel).filter((v):v is string=>!!v))].sort();}catch{}this.loading=false;

    const svc = this.mainSvc as any;
    const userObservable = typeof svc.getLoggedUser === 'function'
      ? svc.getLoggedUser()
      : typeof svc.getUser === 'function'
        ? svc.getUser()
        : svc.bnUserO;

    if (userObservable && typeof userObservable.subscribe === 'function') {
      this.accountSub = userObservable.subscribe((user: any) => this.loggedUser = user || null);
    } else if (svc.bnUser) {
      this.loggedUser = svc.bnUser;
    }
  }

  ngOnDestroy(): void {this.closePublicationChoice();this.accountSub?.unsubscribe();this.querySub?.unsubscribe();this.searchRequest++;}

  o(key:string):string{const lang=this.lang;return this.siteContent.tFromContent(this.uiContent,'ui.ownerOffer.'+key,lang,OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key]||key);}
  d(key:string):string {const live=this.uiContent?.[this.lang]?.ui?.discovery?.[key];return typeof live==='string'?live:DISCOVERY_TEXT[this.lang]?.[key]||DISCOVERY_TEXT.en[key]||key;}
  open(type:string){this.selectedType=type;void this.search();}
  async search(){this.searchError='';let filters:DiscoveryFilters;try{filters=discoveryFilters(this.selectedType,this.location,this.startDate,this.endDate);}catch(e:any){this.searchError=e.message;return;}void this.runSearch(filters);await this.router.navigate(['/'],{queryParams:{...filters,...(this.isOwner&&this.browseAsCustomer?{view:'rentals'}:{})}});}
  async runSearch(filters:DiscoveryFilters){const request=++this.searchRequest;this.lastSearch=JSON.stringify(filters);this.appliedFilters={...filters};this.searching=true;this.searchError='';this.searched=Object.values(filters).some(Boolean);try{const rows=await this.registry.search(filters);if(request===this.searchRequest)this.results=rows;}catch{if(request===this.searchRequest){this.results=[];this.searchError='searchFailed';}}finally{if(request===this.searchRequest)this.searching=false;}}
  clearSearch(){this.selectedType='';this.location='';this.startDate='';this.endDate='';void this.search();}
  get appliedPeriod(){return this.appliedFilters;}
  get hasDates(){return !!this.appliedFilters.startAt&&!!this.appliedFilters.endAt;}
  openResult(item:ResourceRegistryItem){void this.router.navigate(['/',item.resourceType,item.resourceId,'home'],{queryParams:this.appliedFilters});}
  title(item:ResourceRegistryItem){return item.translations?.[this.lang]?.name||item.name;}
  description(item:ResourceRegistryItem){return item.translations?.[this.lang]?.headline||item.translations?.[this.lang]?.description||item.description;}
  priceUnit(unit:string){return this.d(unit==='night'?'night':unit==='hour'?'hour':'day');}
  registryMedia(path:string){return this.registry.mediaUrl(path);}
  imageFailed(event:Event){(event.target as HTMLImageElement).style.display='none';}
  publish():void {
    if(this.isLoggedIn){void this.router.navigateByUrl('/owner/listings');return;}
    this.publishChoiceOpen=true;
    const dialog=this.publicationDialog?.nativeElement;if(dialog&&!dialog.open)dialog.showModal();
  }
  closePublicationChoice():void {this.publishChoiceOpen=false;const dialog=this.publicationDialog?.nativeElement;if(dialog?.open)dialog.close();}
  publicationBackdrop(event:MouseEvent):void {
    const dialog=this.publicationDialog?.nativeElement;if(!dialog||event.target!==dialog)return;
    const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)this.closePublicationChoice();
  }
  continuePublication(mode:'login'|'signup'):void {
    this.closePublicationChoice();
    if(this.isLoggedIn){void this.router.navigateByUrl('/owner/listings');return;}
    try{sessionStorage.setItem('redirectAfterLogin','/owner/listings');}catch{}
    void this.router.navigate([boatPath('/'+mode)],{queryParams:{role:'assetOwner',returnUrl:'/owner/listings'}});
  }

  icon(type: string) { return ({parking:'🅿️', car:'🚗', boat:'⛵', property:'🏠', pool:'🏊'} as any)[type] || '📦'; }

  get isLoggedIn(): boolean {return this.assetAccess.isAuthenticated;}
  get firstName(): string {
    const user = this.loggedUser || {};
    const value = user.firstname || user.firstName || user.displayName || user.email || '';
    return String(value).split(' ')[0] || this.t('account');
  }
  get accountLabel(): string { return this.isLoggedIn ? `${this.firstName}` : this.t('account'); }

  login(): void { this.router.navigateByUrl(boatPath('/login')); }
  signup(): void { this.router.navigateByUrl(boatPath('/signup')); }
  profile(): void { this.router.navigateByUrl(boatPath('/my-profile')); }
  bookings(): void { this.router.navigateByUrl(boatPath('/my-bookings')); }
  ownerPayments(): void { this.router.navigateByUrl('/owner/payments'); }
  get isOwner(): boolean { return this.assetAccess.isOwner; }

  async logout(): Promise<void> {
    await this.assetAccess.signOut();
    const svc = this.mainSvc as any;
    const userId = this.loggedUser?.userId || this.loggedUser?.uid;
    if (typeof svc.disconnectingUser === 'function' && userId) {
      svc.disconnectingUser(userId);
    } else if (typeof svc.setLoggedUser === 'function') {
      svc.setLoggedUser(undefined);
    } else if (svc.bnUserO && typeof svc.bnUserO.next === 'function') {
      svc.bnUserO.next(null);
    }
    try {
      localStorage.removeItem('loggedUser');
      sessionStorage.removeItem('loggedUser');
    } catch {}
    this.loggedUser = null;
    this.router.navigateByUrl('/');
  }
}
