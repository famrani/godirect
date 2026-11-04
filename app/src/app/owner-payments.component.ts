import {OWNER_OFFER_TEXT} from './services/owner-offer-text';
import {LanguageService} from './services/language.service';
import {SiteContentService} from './home/site-content-service/site-content.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreDbService } from 'godigital-lib';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from 'godigital-lib';

interface StripeOwnerStatus {
  connected: boolean;
  mode?: 'test'|'live';
  perOwnerTestAccount?: boolean;
  accountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  onboardingComplete?: boolean;
  detailsSubmitted?: boolean;
  requirementsCurrentlyDue?: string[];
  requirementsPastDue?: string[];
}

@Component({
  standalone:false,
  selector: 'app-owner-payments',
  template: `
  <main class="owner-payments">
    <button class="back" type="button" (click)="goBack()">← {{ assetName || 'GoDirect' }} — {{ 'ui.pages.management' | siteText }}</button>
    <section class="card">
      <div class="kicker">{{ 'ui.messages.tbf13fde2a8c8' | siteText }} <span *ngIf="assetName">— {{ assetName }}</span></div>
      <h1>{{ 'ui.messages.ta5499dd3dc77' | siteText }}</h1>
      <p>{{ 'ui.messages.t41e841696f33' | siteText }}</p>

      <p *ngIf="loading">{{ 'ui.messages.te6e1e4e63784' | siteText }}</p>
      <div *ngIf="error" class="error">{{ error | siteText }}</div>

      <ng-container *ngIf="!loading && !error">
        <p *ngIf="status.mode==='test'" class="fee-box">{{ 'ui.messages.t29b92bcaeca9' | siteText }} <span *ngIf="status.perOwnerTestAccount">{{ 'ui.messages.t521b8f1764c5' | siteText }}</span></p>
        <div class="status-row"><span>{{ 'ui.messages.t0f2604b8ff95' | siteText }}</span><strong>{{ status.connected ? ('ui.messages.tc2f9b7b4897f' | siteText) : ('ui.messages.t8b02f3de3906' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.accountId"><span>{{ 'ui.messages.t85dfa32c97d8' | siteText }}</span><strong>{{ maskedAccount }}</strong></div>
        <div class="status-row" *ngIf="status.connected"><span>{{ 'ui.messages.t44357ae55a21' | siteText }}</span><strong>{{ status.chargesEnabled ? ('ui.messages.tdf174a3f2faa' | siteText) : ('ui.messages.t9fa0e005a03c' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.connected"><span>{{ 'ui.messages.te0e7ea13f8f5' | siteText }}</span><strong>{{ status.payoutsEnabled ? ('ui.messages.tdf174a3f2faa' | siteText) : ('ui.messages.t9fa0e005a03c' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.connected"><span>{{ 'ui.messages.tade2f9461d99' | siteText }}</span><strong>{{ status.detailsSubmitted ? ('ui.messages.t2e00359b9802' | siteText) : ('ui.messages.t387fd1bbc184' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.requirementsCurrentlyDue?.length"><span>{{ 'ui.messages.tf78be09f9405' | siteText }}</span><strong>{{ status.requirementsCurrentlyDue?.join(', ') }}</strong></div>
        <button type="button" (click)="refresh()">{{ 'ui.messages.t79fc27bcf930' | siteText }}</button>
        <div class="fee-box"><span>{{offer('commission')}}</span><strong>0%</strong></div><p>{{offer('fees')}}</p>

        <button class="primary" type="button" [disabled]="working" (click)="connect()">
          {{ working ? ('ui.messages.t8ed3c2197f2d' | siteText) : (status.perOwnerTestAccount ? (status.connected ? ('ui.messages.tadca3cb0974e' | siteText) : ('ui.messages.t02b204fa8a58' | siteText)) : (status.onboardingComplete ? ('ui.messages.td30345b2eb9e' | siteText) : ('ui.messages.t7ef3a611e4ee' | siteText))) }}
        </button>
      </ng-container>
    </section>
  </main>`,
  styles: [`
    :host{display:block;background:#f7f7f5;color:#17202a}.owner-payments{max-width:820px;margin:0 auto;padding:36px 22px 70px}.back{border:0;background:transparent;font-weight:700;cursor:pointer;margin-bottom:24px}.card{background:#fff;border:1px solid #e5e2db;border-radius:22px;padding:34px;box-shadow:0 12px 34px rgba(0,0,0,.06)}.kicker{text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:800}h1{font-size:34px;margin:8px 0 12px}p{line-height:1.6;color:#56606a}.status-row,.fee-box{display:flex;justify-content:space-between;gap:20px;padding:15px 0;border-top:1px solid #ece9e2}.fee-box{margin-top:12px;padding:18px;border:1px solid #d9e8dd;border-radius:14px;background:#f4faf6}.fee-box strong{font-size:22px}.primary{margin-top:24px;border:0;border-radius:12px;padding:14px 20px;background:#17202a;color:white;font-weight:800;cursor:pointer}.primary:disabled{opacity:.6}.error{padding:14px;border-radius:12px;background:#fff0f0;color:#9a1d1d}@media(max-width:600px){.card{padding:24px 18px}h1{font-size:28px}}
  `]
})
export class OwnerPaymentsComponent implements OnInit {
  loading=true; working=false; error=''; status: StripeOwnerStatus={connected:false}; ownerId=''; assetName=''; assetType=''; assetId='';
  constructor(private http:HttpClient, private mainSvc:ServicesService, private storeDb:StoreDbService, public router:Router, private route:ActivatedRoute,private language:LanguageService,private texts:SiteContentService) {}
  copy:any;
  offer(key:string){const lang=this.language?.currentLanguage||'en';return this.texts?.tFromContent(this.copy,'ui.ownerOffer.'+key,lang,OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key])||OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key];}
  ngOnInit():void { void this.initialize();void this.texts.getContent().then(c=>this.copy=c).catch(()=>{}); }
  private async initialize(): Promise<void> {
    this.assetType = String(this.route.snapshot.paramMap.get('assetType') || '');
    this.assetId = String(this.route.snapshot.paramMap.get('assetId') || '');
    const svc=this.mainSvc as any;
    const u=svc.bnUser||svc.currentUser||null;
    // Canonical owner identifier in R7 is the authenticated Firebase UID.
    const auth:any=this.storeDb as any;
    const firebaseUser=auth.firebaseauth?.currentUser || auth.firebaseAuth?.currentUser || auth.auth?.currentUser;
    this.ownerId=String(firebaseUser?.uid||'').trim();
    if (this.assetId) {
      if (!['boat','car','property','parking','pool'].includes(this.assetType)) {
        this.loading=false; this.error='Unsupported asset type.'; return;
      }
      try {
        // Asset ownership is resolved from the registry, never inferred from the user's UID.
        const asset:any=await firstValueFrom(this.http.get<any>(
          `/api/assets/${encodeURIComponent(this.assetId)}`));
        if (!asset || asset.assetType !== this.assetType || !asset.ownerId) {
          this.loading=false; this.error='Asset or asset owner not found.'; return;
        }
        this.assetName=String(asset.name||this.assetId);
        if (String(asset.ownerId)!==this.ownerId) {
          this.loading=false; this.error='You are not the owner of this asset.'; return;
        }
      } catch(e:any) {
        this.loading=false; this.error='Unable to resolve asset ownership. Please try again.'; return;
      }
    }
    if(!this.ownerId){ this.loading=false; this.error='No owner profile is linked to your account.'; return; }
    await this.refresh();
    if(this.route.snapshot.queryParamMap.get('stripeOAuth')==='cancelled')this.error='Stripe connection was cancelled. Your existing account was kept.';
  }
  goBack(): void {
    try { localStorage.setItem('alegria-owner-view','admin'); } catch {}
    this.router.navigateByUrl(this.assetId ? `/${this.assetType}/${this.assetId}/home` : '/');
  }
  get maskedAccount():string { const id=this.status.accountId||''; return id.length>8 ? `${id.slice(0,7)}••••${id.slice(-4)}` : id; }
  private async headers(): Promise<HttpHeaders> {
    const auth: any = this.storeDb as any;
    const user = auth.firebaseauth?.currentUser || auth.firebaseAuth?.currentUser || auth.auth?.currentUser;
    if (!user?.getIdToken) throw new Error('Please sign in again to connect Stripe.');
    return new HttpHeaders({Authorization: `Bearer ${await user.getIdToken()}`});
  }
  async refresh(): Promise<void> {
    this.loading=true; this.error='';
    try { this.status=await firstValueFrom(this.http.get<StripeOwnerStatus>(`/api/owners/${encodeURIComponent(this.ownerId)}/stripe/status`,{headers:await this.headers()})); }
    catch(e:any) {this.error=e?.error?.error||e?.message||'Unable to load Stripe status.';}
    finally {this.loading=false;}
  }
  async connect(): Promise<void> {
    this.working=true; this.error='';
    try {
      const r=await firstValueFrom(this.http.post<any>(`/api/owners/${encodeURIComponent(this.ownerId)}/stripe/connect`,{assetType:this.assetType,assetId:this.assetId}, {headers:await this.headers()}));
      if(r?.url){window.location.assign(r.url);return;}
      this.error='Stripe onboarding URL was not returned.';
    } catch(e:any) {this.error=e?.error?.error||e?.message||'Unable to start Stripe onboarding.';}
    finally {this.working=false;}
  }
}
