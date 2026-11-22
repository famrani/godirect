import {dedicatedAsset} from './services/asset-domain';
import {ReservationAuthService} from './services/reservation-auth.service';
import {STRIPE_TEST_FIXTURE_TEXT} from './services/stripe-test-fixture-text';
import {OWNER_ONBOARDING_TEXT} from './services/owner-onboarding-text';
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
  testProvisioningEnabled?: boolean;
  mode?: 'test'|'live';
  perOwnerTestAccount?: boolean;
  accountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  onboardingComplete?: boolean;
  detailsSubmitted?: boolean;
  requirementsCurrentlyDue?: string[];
  requirementsPastDue?: string[];
  requirementsPendingVerification?: string[];
  disabledReason?: string|null;
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

      <a routerLink="/owner/listings">{{onb('back')}}</a><p *ngIf="statusKnown && status.mode==='test'">{{onb('test')}} <span *ngIf="!status.testProvisioningEnabled">{{onb('oauth')}}</span></p><p *ngIf="statusKnown && status.mode==='test' && status.chargesEnabled">{{onb('ready')}}</p>
      <p *ngIf="loading">{{ 'ui.messages.te6e1e4e63784' | siteText }}</p>
      <div *ngIf="error" class="error" role="alert">{{ error | siteText }}</div>

      <button type="button" [disabled]="working || loading" (click)="refresh()">{{ 'ui.messages.t79fc27bcf930' | siteText }}</button>
      <ng-container *ngIf="!loading && statusKnown">
        <p *ngIf="status.connected&&!status.chargesEnabled" role="status">{{onb('incompleteAccount')}}</p>
        <p *ngIf="status.requirementsPendingVerification?.length" role="status">{{onb('pendingVerification')}}</p>
        <p *ngIf="status.mode==='test' && !status.testProvisioningEnabled" class="fee-box">{{ 'ui.messages.t29b92bcaeca9' | siteText }} <span *ngIf="status.perOwnerTestAccount">{{ 'ui.messages.t521b8f1764c5' | siteText }}</span></p>
        <div class="status-row"><span>{{ 'ui.messages.t0f2604b8ff95' | siteText }}</span><strong>{{ status.connected ? ('ui.messages.tc2f9b7b4897f' | siteText) : ('ui.messages.t8b02f3de3906' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.accountId"><span>{{ 'ui.messages.t85dfa32c97d8' | siteText }}</span><strong>{{ maskedAccount }}</strong></div>
        <div class="status-row" *ngIf="status.connected"><span>{{ 'ui.messages.t44357ae55a21' | siteText }}</span><strong>{{ status.chargesEnabled ? ('ui.messages.tdf174a3f2faa' | siteText) : ('ui.messages.t9fa0e005a03c' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.connected"><span>{{ 'ui.messages.te0e7ea13f8f5' | siteText }}</span><strong>{{ status.payoutsEnabled ? ('ui.messages.tdf174a3f2faa' | siteText) : ('ui.messages.t9fa0e005a03c' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.connected"><span>{{ 'ui.messages.tade2f9461d99' | siteText }}</span><strong>{{ status.detailsSubmitted ? ('ui.messages.t2e00359b9802' | siteText) : ('ui.messages.t387fd1bbc184' | siteText) }}</strong></div>
        <div class="status-row" *ngIf="status.requirementsCurrentlyDue?.length || status.requirementsPastDue?.length"><span>{{ 'ui.messages.tf78be09f9405' | siteText }}</span><strong>{{ requirementLabels.join(', ') }}</strong></div>
        <div class="fee-box"><span>{{offer('commission')}}</span><strong>0%</strong></div><p>{{offer('fees')}}</p>

        <section *ngIf="status.mode==='test' && status.testProvisioningEnabled && !status.chargesEnabled">
          <p>{{fx('explanation')}}</p>
          <label><input type="checkbox" [(ngModel)]="fixtureConsent" [disabled]="working"> {{fx('consent')}}</label>
          <button class="primary" type="button" [disabled]="working || !fixtureConsent" (click)="provisionTest()">{{fx('create')}}</button>
        </section>
        <p *ngIf="fixturePending" role="status">{{fx('pending')}}</p>
        <div class="stripe-actions">
        <button *ngIf="!status.testProvisioningEnabled || status.connected" class="primary" type="button" [disabled]="working" (click)="connect()">
          {{ working ? ('ui.messages.t8ed3c2197f2d' | siteText) : (status.connected ? onb(status.chargesEnabled?'manageAccount':'finishSetup') : (status.perOwnerTestAccount ? ('ui.messages.t02b204fa8a58' | siteText) : ('ui.messages.t7ef3a611e4ee' | siteText))) }}
        </button>
        <button class="secondary" *ngIf="status.connected&&status.perOwnerTestAccount&&!status.testProvisioningEnabled" type="button" (click)="connect(true)" [disabled]="working||loading">{{onb('replaceAccount')}}</button>
        </div>
        <p *ngIf="status.connected&&status.perOwnerTestAccount">{{onb('replacementHelp')}}</p>
      </ng-container>
    </section>
  </main>`,
  styles: [`
    .stripe-actions{display:flex;flex-direction:column;gap:16px;margin-top:24px}.stripe-actions button{margin:0;min-height:48px;padding:14px 20px;border-radius:12px;font:inherit;font-weight:700;cursor:pointer}.secondary{border:1px solid #bcc9cd;background:#fff;color:#17202a}.stripe-actions button:disabled{opacity:.6;cursor:wait}.stripe-actions button:focus-visible{outline:3px solid #147f90;outline-offset:3px}
    :host{display:block;background:#f7f7f5;color:#17202a}.owner-payments{max-width:820px;margin:0 auto;padding:36px 22px 70px}.back{border:0;background:transparent;font-weight:700;cursor:pointer;margin-bottom:24px}.card{background:#fff;border:1px solid #e5e2db;border-radius:22px;padding:34px;box-shadow:0 12px 34px rgba(0,0,0,.06)}.kicker{text-transform:uppercase;letter-spacing:.12em;font-size:12px;font-weight:800}h1{font-size:34px;margin:8px 0 12px}p{line-height:1.6;color:#56606a}.status-row strong{overflow-wrap:anywhere;min-width:0}.status-row,.fee-box{display:flex;justify-content:space-between;gap:20px;padding:15px 0;border-top:1px solid #ece9e2}.fee-box{margin-top:12px;padding:18px;border:1px solid #d9e8dd;border-radius:14px;background:#f4faf6}.fee-box strong{font-size:22px}.primary{margin-top:24px;border:0;border-radius:12px;padding:14px 20px;background:#17202a;color:white;font-weight:800;cursor:pointer}.primary:disabled{opacity:.6}.error{padding:14px;border-radius:12px;background:#fff0f0;color:#9a1d1d}@media(max-width:600px){.card{padding:24px 18px}h1{font-size:28px}}
  `]
})
export class OwnerPaymentsComponent implements OnInit {
  loading=true; working=false; statusKnown=false; error=''; status: StripeOwnerStatus={connected:false}; ownerId=''; assetName=''; assetType=''; assetId='';
  constructor(private http:HttpClient, private mainSvc:ServicesService, private storeDb:StoreDbService, public router:Router, private route:ActivatedRoute,private language:LanguageService,private texts:SiteContentService,private reservationAuth:ReservationAuthService) {}
  fixtureConsent=false; fixturePending=false; private refreshing=false;
  fx(key:string){const lang=this.language.currentLanguage;return this.texts?.tFromContent(this.copy,'ui.stripeTestFixture.'+key,lang,STRIPE_TEST_FIXTURE_TEXT[lang]?.[key]||STRIPE_TEST_FIXTURE_TEXT.en[key])||STRIPE_TEST_FIXTURE_TEXT.en[key];}
  async provisionTest():Promise<void>{
    if(this.working||this.loading||!this.statusKnown||!this.fixtureConsent)return;
    this.working=true;this.error='';
    try{
      this.status=await firstValueFrom(this.http.post<StripeOwnerStatus>(`/api/owners/${encodeURIComponent(this.ownerId)}/stripe/test/provision`,{acceptSyntheticTestData:true,replaceExisting:this.status.connected},{headers:await this.headers()}));
      this.fixturePending=!this.status.chargesEnabled;this.fixtureConsent=false;
    }catch(e:any){
      const code=e?.error?.error;
      if(this.handleStatusFailure(e))return;
      this.error=code==='stripe_test_account_in_use_create_new_owner'?this.fx('inUse'):code==='stripe_test_provisioning_disabled'?this.fx('disabled'):this.fx('failed')+' '+String(code||e?.message||'');
    }finally{this.working=false;}
  }
  copy:any;
 onb(key:string){const lang=this.language.currentLanguage;return this.texts?.tFromContent(this.copy,'ui.ownerOnboarding.'+key,lang,OWNER_ONBOARDING_TEXT[lang]?.[key]||OWNER_ONBOARDING_TEXT.en[key])||OWNER_ONBOARDING_TEXT.en[key];}

  offer(key:string){const lang=this.language?.currentLanguage||'en';return this.texts?.tFromContent(this.copy,'ui.ownerOffer.'+key,lang,OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key])||OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key];}
  ngOnInit():void { void this.initialize();void this.texts.getContent().then(c=>this.copy=c).catch(()=>{}); }
  private async initialize(): Promise<void> {
    this.assetType = String(this.route.snapshot.paramMap.get('assetType') || dedicatedAsset()?.assetType || '');
    this.assetId = String(this.route.snapshot.paramMap.get('assetId') || dedicatedAsset()?.assetId || '');
    const svc=this.mainSvc as any;
    const u=svc.bnUser||svc.currentUser||null;
    // Canonical owner identifier in R7 is the authenticated Firebase UID.
    const auth:any=this.storeDb as any;
    const deadline=Date.now()+15000;while(!(auth.firebaseauth||auth.firebaseAuth||auth.auth)&&Date.now()<deadline){await new Promise<void>(resolve=>setTimeout(resolve,100));}
    let firebaseUser:any;try{firebaseUser=await this.reservationAuth.user();}catch{}
    this.ownerId=String(firebaseUser?.uid||'').trim();
    if (this.assetId) {
      if (!['boat','car','property','parking','pool'].includes(this.assetType)) {
        this.loading=false; this.error='Unsupported asset type.'; return;
      }
      try {
        // Asset ownership is resolved from the registry, never inferred from the user's UID.
        const asset:any=await firstValueFrom(this.http.get<any>(
          `/api/resources/${encodeURIComponent(this.assetType)}/${encodeURIComponent(this.assetId)}`,{headers:await this.reservationAuth.headers()}));
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
    if(this.route.snapshot.queryParamMap.get('stripeOAuth')==='unchanged')this.error=this.onb('sameAccount');
    if(this.route.snapshot.queryParamMap.get('stripeOAuth')==='cancelled')this.error='Stripe connection was cancelled. Your existing account was kept.';
  }
  goBack(): void {
    try { localStorage.setItem('alegria-owner-view','admin'); } catch {}
    this.router.navigateByUrl(this.assetId ? `/${this.assetType}/${this.assetId}/home` : '/');
  }
  get requirementLabels():string[]{
    const fields=[...(this.status.requirementsCurrentlyDue||[]),...(this.status.requirementsPastDue||[])];const labels=new Set<string>();
    for(const field of fields){const key=field.includes('address')?'missingAddress':/first_name|last_name|dob|verification/.test(field)?'missingIdentity':field.includes('phone')?'missingPhone':field.startsWith('tos_acceptance')?'missingTerms':'missingOther';labels.add(this.onb(key));}return [...labels];
  }
  get maskedAccount():string { const id=this.status.accountId||''; return id.length>8 ? `${id.slice(0,7)}••••${id.slice(-4)}` : id; }
  private async headers(): Promise<HttpHeaders> {
    const auth: any = this.storeDb as any;
    const user = auth.firebaseauth?.currentUser || auth.firebaseAuth?.currentUser || auth.auth?.currentUser;
    if (!user?.getIdToken) throw new Error('Please sign in again to connect Stripe.');
    return new HttpHeaders({Authorization: `Bearer ${await user.getIdToken()}`});
  }

  statusMessage(key:string):string {
    const copy:Record<string,Record<string,string>>={
      fr:{legalUnavailable:'Conditions générales indisponibles. Le statut Stripe ne peut pas être vérifié. Réessayez plus tard ; aucun nouveau compte ne sera créé.',acceptanceRequired:'Veuillez accepter les conditions générales avant de consulter votre statut Stripe.',unavailable:'Impossible de vérifier le statut Stripe. Réessayez ; aucun nouveau compte ne sera créé.'},
      en:{legalUnavailable:'Terms and conditions unavailable. Stripe status cannot be checked. Try again later; no new account will be created.',acceptanceRequired:'Please accept the terms and conditions before checking your Stripe status.',unavailable:'Unable to check Stripe status. Try again; no new account will be created.'},
      de:{legalUnavailable:'Die Geschäftsbedingungen sind nicht verfügbar. Der Stripe-Status kann nicht geprüft werden. Es wird kein neues Konto erstellt.',acceptanceRequired:'Bitte akzeptieren Sie die Geschäftsbedingungen, bevor Sie Ihren Stripe-Status prüfen.',unavailable:'Der Stripe-Status kann nicht geprüft werden. Es wird kein neues Konto erstellt.'},
      es:{legalUnavailable:'Condiciones generales no disponibles. No se puede verificar el estado de Stripe. No se creará ninguna cuenta nueva.',acceptanceRequired:'Acepta las condiciones generales antes de consultar tu estado de Stripe.',unavailable:'No se puede verificar el estado de Stripe. No se creará ninguna cuenta nueva.'},
      it:{legalUnavailable:'Condizioni generali non disponibili. Impossibile verificare lo stato Stripe. Non verrà creato alcun nuovo account.',acceptanceRequired:'Accetta le condizioni generali prima di consultare lo stato Stripe.',unavailable:'Impossibile verificare lo stato Stripe. Non verrà creato alcun nuovo account.'},
      nl:{legalUnavailable:'Algemene voorwaarden niet beschikbaar. De Stripe-status kan niet worden gecontroleerd. Er wordt geen nieuw account aangemaakt.',acceptanceRequired:'Accepteer de algemene voorwaarden om je Stripe-status te bekijken.',unavailable:'De Stripe-status kan niet worden gecontroleerd. Er wordt geen nieuw account aangemaakt.'},
      ru:{legalUnavailable:'Условия использования недоступны. Невозможно проверить статус Stripe. Новый аккаунт не будет создан.',acceptanceRequired:'Примите условия использования, чтобы проверить статус Stripe.',unavailable:'Не удалось проверить статус Stripe. Новый аккаунт не будет создан.'}
    };
    const lang=this.language.currentLanguage||'en',fallback=copy[lang]?.[key]||copy.en[key];
    return this.texts?.tFromContent(this.copy,'ui.ownerStripeStatus.'+key,lang,fallback)||fallback;
  }
  private handleStatusFailure(e:any):boolean {
    this.statusKnown=false;this.fixtureConsent=false;this.fixturePending=false;
    const code=e?.error?.error;
    this.error=this.statusMessage(code==='legal_documents_not_published'?'legalUnavailable':code==='legal_acceptance_required'?'acceptanceRequired':'unavailable');
    return code==='legal_documents_not_published'||code==='legal_acceptance_required';
  }

  async refresh(): Promise<void> {
    if(this.working||this.refreshing)return;
    this.refreshing=true;
    this.loading=true; this.statusKnown=false; this.fixtureConsent=false; this.error='';
    try { this.status=await firstValueFrom(this.http.get<StripeOwnerStatus>(`/api/owners/${encodeURIComponent(this.ownerId)}/stripe/status`,{headers:await this.headers()}));if(typeof this.status?.connected!=='boolean')throw Error('invalid_stripe_status');this.statusKnown=true; }
    catch(e:any) {this.handleStatusFailure(e);}
    finally {this.refreshing=false;this.loading=false;this.fixturePending=this.fixturePending&&!this.status.chargesEnabled;}
  }
  async connect(replaceExisting=false): Promise<void> {
    if(this.working||this.loading||!this.statusKnown)return;
    this.working=true; this.error='';
    try {
      const r=await firstValueFrom(this.http.post<any>(`/api/owners/${encodeURIComponent(this.ownerId)}/stripe/connect`,{assetType:this.assetType,assetId:this.assetId,returnOrigin:window.location.origin,replaceExisting,expectedAccountId:this.status.accountId}, {headers:await this.headers()}));
      if(r?.url){window.location.assign(r.url);return;}
      this.error='Stripe onboarding URL was not returned.';
    } catch(e:any) {this.handleStatusFailure(e);}
    finally {this.working=false;}
  }
}
