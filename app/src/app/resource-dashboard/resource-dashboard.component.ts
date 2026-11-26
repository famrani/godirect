import {homeRolesCopy} from '../home-roles/home-roles.text';
import {accountHeaderText} from '../services/account-header';
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
  readonly heroSlides = [
    {type:'boat', image:'/api/media/object?path=assets%2Fboats%2Falegria%2Fboat%2Fbali-41-2.jpg'},
    {type:'car', image:'assets/img/car/riviera-ev/tesla-model-3-1.jpg'},
    {type:'parking', image:'assets/img/parking/port-antibes-parking/parking-1.jpg'},
    {type:'property', image:'assets/img/property/villa-azur/villa-5.jpg'},
    {type:'pool', image:'assets/img/pool/azure-pool/pool-1.jpg'}
  ];
  heroIndex=0; heroPlaying=false; heroHovered=false;
  private heroTimer?:ReturnType<typeof setInterval>;
  get heroSlide(){return this.heroSlides[this.heroIndex];}
  selectHero(index:number){this.heroIndex=(index+this.heroSlides.length)%this.heroSlides.length;}
  pauseHero(){this.heroPlaying=false;}
  toggleHero(){this.heroPlaying=!this.heroPlaying;}
  private startHero(){
    if(typeof window==='undefined')return;
    this.heroPlaying=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.heroTimer=setInterval(()=>{
      if(this.heroPlaying&&!this.heroHovered&&!document.hidden&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)this.selectHero(this.heroIndex+1);
    },6000);
  }
  get listingOffline():boolean{return typeof window!=='undefined'&&new URLSearchParams(window.location.search).has('listing');}
  get isPlatformAdmin(){return this.assetAccess.isPlatformAdmin;}
  private requestedClientView=false;
  get browseAsCustomer(){return (typeof window!=='undefined'&&window.location.pathname==='/locations')||this.requestedClientView||(this.assetAccess.isManager&&this.assetAccess.viewMode==='client');}
  set browseAsCustomer(value:boolean){this.requestedClientView=value;}
  browseRentals(){void this.router.navigate(['/'],{queryParams:{view:'rentals'},fragment:'rentals'});}
  showOwnerDashboard(){void this.assetAccess.switchView();}
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
    if(typeof document!=='undefined')document.title='GoDirect | Trouver une location';

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

  ngOnDestroy(): void {if(this.heroTimer)clearInterval(this.heroTimer);this.closePublicationChoice();this.accountSub?.unsubscribe();this.querySub?.unsubscribe();this.searchRequest++;}

  homeRoleCopy(){return homeRolesCopy(this.lang);}
  o(key:string):string{const lang=this.lang;return this.siteContent.tFromContent(this.uiContent,'ui.ownerOffer.'+key,lang,OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key]||key);}
  d(key:string):string {const live=this.uiContent?.[this.lang]?.ui?.discovery?.[key];return typeof live==='string'?live:DISCOVERY_TEXT[this.lang]?.[key]||DISCOVERY_TEXT.en[key]||key;}
  open(type:string){this.selectedType=type;void this.search();}
  async search(){this.searchError='';let filters:DiscoveryFilters;try{filters=discoveryFilters(this.selectedType,this.location,this.startDate,this.endDate);}catch(e:any){this.searchError=e.message;return;}void this.runSearch(filters);await this.router.navigate(['/'],{queryParams:{...filters,...(this.isOwner&&this.browseAsCustomer?{view:'rentals'}:{})},fragment:'results'});}
  async runSearch(filters:DiscoveryFilters){const request=++this.searchRequest;this.lastSearch=JSON.stringify(filters);this.appliedFilters={...filters};this.searching=true;this.searchError='';this.searched=Object.values(filters).some(Boolean);try{const rows=await this.registry.search(filters);if(request===this.searchRequest)this.results=rows;}catch{if(request===this.searchRequest){this.results=[];this.searchError='searchFailed';}}finally{if(request===this.searchRequest)this.searching=false;}}
  clearSearch(){this.selectedType='';this.location='';this.startDate='';this.endDate='';void this.search();}
  get appliedPeriod(){return this.appliedFilters;}
  get hasDates(){return !!this.appliedFilters.startAt&&!!this.appliedFilters.endAt;}
  openResult(item:ResourceRegistryItem){if(item.siteUrl){const u=new URL(item.siteUrl);if(u.protocol==='https:'&&u.hostname==='godirect.fr'){Object.entries(this.appliedFilters).forEach(([k,v])=>{if(v)u.searchParams.set(k,String(v));});window.location.assign(u.href);return;}}void this.router.navigate(['/',item.resourceType,item.resourceId,'home'],{queryParams:this.appliedFilters});}
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
    void this.router.navigate(['/account/'+mode],{queryParams:{role:'assetOwner',returnUrl:'/owner/listings'}});
  }

  icon(type: string) { return ({parking:'🅿️', car:'🚗', boat:'⛵', property:'🏠', pool:'🏊'} as any)[type] || '📦'; }

  get isLoggedIn(): boolean {return this.assetAccess.isAuthenticated;}
  get firstName(): string {
    const user = this.loggedUser || {};
    const value = user.firstname || user.firstName || user.displayName || user.email || '';
    return String(value).split(' ')[0] || this.t('account');
  }
  accountText(key:string){return accountHeaderText(this.lang,key);}
  get accountLabel(): string { return this.isLoggedIn ? `${this.firstName}` : this.t('account'); }

  login(): void { this.router.navigateByUrl('/account/login'); }
  signup(): void { this.router.navigateByUrl('/account/signup'); }
  profile(): void { this.router.navigateByUrl('/account/profile'); }
  bookings(): void { this.router.navigateByUrl(this.isOwner?'/owner/activity/reservations':'/account/bookings'); }
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
