import {OWNER_CUSTOMERS_TEXT} from '../../services/owner-customers-text';
import {PAYMENT_CONFIRMATION_TEXT} from '../../services/payment-confirmation-text';
import {inject} from '@angular/core';
import {UiTextService} from '../../services/ui-text.service';
import {OWNER_OFFER_TEXT} from '../../services/owner-offer-text';
import {LanguageService} from '../../services/language.service';
import {SiteContentService} from '../site-content-service/site-content.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ReservationAuthService } from '../../services/reservation-auth.service';
import { StripeConnectPaymentService } from '../../services/stripe-connect-payment.service';
import { ResourceContextService } from '../../services/resource-context.service';

type PaymentKind='booking_deposit'|'balance'|'security_deposit'|'security_payment';

@Component({selector:'app-my-bookings',standalone:false,templateUrl:'./my-bookings.component.html',styleUrls:['./my-bookings.component.scss']})
export class MyBookingsComponent implements OnInit,OnDestroy {
 private readonly uiText=inject(UiTextService);
  @Input() admin=false;
  bookings:any[]=[];loading=true;error='';busy='';selected:any=null;
  createOpen=false;checkout:any=null;paymentMessage='';editing=false;editForm:any={};
  warrantyAccepted=false;
  private pendingPayment:{bookingId:string;kind:PaymentKind;chargeId?:string}|null=null;
  private timer:any;private mountedElement:any;
  @ViewChild('paymentHost') set paymentHost(ref:ElementRef<HTMLElement>|undefined){
    if(ref&&this.checkout&&this.mountedElement!==this.checkout.paymentElement){
      try{this.checkout.paymentElement.mount(ref.nativeElement);this.mountedElement=this.checkout.paymentElement;ref.nativeElement.scrollIntoView({behavior:'smooth',block:'center'});}
      catch(e:any){this.error=this.explain(e);}
    }
  }
  constructor(private http:HttpClient,private auth:ReservationAuthService,private stripePayments:StripeConnectPaymentService,public ctx:ResourceContextService,private route:ActivatedRoute,private language:LanguageService,private texts:SiteContentService){}
  offerCopy:any;
  compactLabel(fr:string,en:string,full:string){const lang=this.language.currentLanguage;return lang==='fr'?fr:lang==='en'?en:full;}
  offer(key:string){const lang=this.language?.currentLanguage||'fr';return this.texts?.tFromContent(this.offerCopy,'ui.ownerOffer.'+key,lang,OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key])||OWNER_OFFER_TEXT[lang]?.[key]||OWNER_OFFER_TEXT.en[key];}
  async ngOnInit(){void this.texts?.getContent().then(c=>this.offerCopy=c).catch(()=>{});this.route.queryParamMap.subscribe(params=>{this.createOpen=this.admin&&params.get('create')==='1';});await this.refresh();const id=this.route.snapshot.queryParamMap.get('bookingId');const booking=this.bookings.find(b=>b.id===id);if(booking)await this.open(booking);}
  async refresh(){
    this.loading=true;
    try{
      const url=this.admin?'/api/manage/bookings':'/api/me/bookings';
      const rows=await firstValueFrom(this.http.get<any[]>(url,{headers:await this.auth.headers()}));
      this.bookings=rows.filter(b=>b.assetType===this.ctx.resourceType&&b.assetId===this.ctx.resourceId);
      this.updatePaymentMessage();
      if(this.selected&&!this.editing){const latest=this.bookings.find(b=>b.id===this.selected.id);if(latest)this.selected=latest;}
    }catch(e:any){this.error=this.explain(e);}finally{this.loading=false;}
  }
  private paymentText(key:string){return PAYMENT_CONFIRMATION_TEXT[this.language?.currentLanguage||'fr']?.[key]||PAYMENT_CONFIRMATION_TEXT.en[key];}
  warrantyText(key:string){return OWNER_CUSTOMERS_TEXT[this.language?.currentLanguage||'fr']?.[key]||OWNER_CUSTOMERS_TEXT.en[key];}
  warrantyCharges(b:any):any[]{return Object.values(b?.warrantyCharges||{});}
  warrantyConsentDone(b:any){return b?.warrantyConsent?.version==='gd-warranty-v1'&&b.warrantyConsent.intentId===b.workflow?.warrantyProvidedProof?.intentId&&b.warrantyConsent.limitMinor===Math.round(Number(b.securityDeposit)*100)&&b.warrantyConsent.currency===String(b.currency).toLowerCase();}
  async saveWarrantyConsent(b:any,intentId:string){if(!this.warrantyAccepted)throw Error(this.warrantyText('authorize'));await firstValueFrom(this.http.post(this.url(b)+'/warranty-consent',{accepted:true,version:'gd-warranty-v1',intentId,limitMinor:Math.round(Number(b.securityDeposit)*100),currency:String(b.currency).toLowerCase()},{headers:await this.auth.headers()}));}
  async authorizeWarranty(){if(this.busy||!this.selected)return;this.busy='consent';this.error='';try{await this.saveWarrantyConsent(this.selected,this.selected.workflow.warrantyProvidedProof.intentId);this.paymentMessage=this.warrantyText('authorized');this.warrantyAccepted=false;await this.refresh();}catch(e:any){this.error=this.explain(e);}finally{this.busy='';}}
  async validateWarrantyCharge(b:any,c:any){if(this.busy)return;this.busy='warranty';this.error='';try{const checkout=await firstValueFrom(this.http.get<any>(this.url(b)+'/warranty-charges/'+encodeURIComponent(c.id)+'/payment',{headers:await this.auth.headers()}));const stripe=await this.stripePayments.stripeForConnectedAccount(checkout.connectedAccountId);const result=await stripe.confirmCardPayment(checkout.clientSecret);if(result.error)throw Error(result.error.message);this.pendingPayment={bookingId:b.id,kind:'security_payment',chargeId:c.id};this.paymentMessage=this.paymentText('pending');await this.refresh();let attempts=0;clearInterval(this.timer);if(this.pendingPayment)this.timer=setInterval(()=>{void this.refresh();if(++attempts>=12)clearInterval(this.timer);},5000);}catch(e:any){this.error=this.explain(e);}finally{this.busy='';}}
  private updatePaymentMessage(){
    const pending=this.pendingPayment;if(!pending)return;const booking=this.bookings.find(b=>b.id===pending.bookingId);if(!booking)return;
    if(pending.kind==='security_payment'){if(booking.warrantyCharges?.[pending.chargeId||'']?.status==='succeeded'){this.paymentMessage=this.warrantyText('warrantyPaid');this.pendingPayment=null;clearInterval(this.timer);}return;}
    const field=pending.kind==='booking_deposit'?'depositPaid':pending.kind==='balance'?'balancePaid':'warrantyProvided';
    if(booking.workflow?.[field]===true){this.paymentMessage=this.paymentText(pending.kind==='security_deposit'?'warranty':pending.kind==='balance'?'balance':'deposit');this.pendingPayment=null;clearInterval(this.timer);}
  }
  get upcoming(){return this.bookings.filter(b=>Date.parse(b.endAt||b.outingDate||'')>=Date.now());}
  get past(){return this.bookings.filter(b=>Date.parse(b.endAt||b.outingDate||'')<Date.now());}
  get bookingKind():'boat'|'pool'|'property'|'parking'{return this.ctx.resourceType as any;}
  cancellationLocked(b:any){return ['refund_pending','refund_failed','review_required'].includes(b?.cancellation?.status);}
  reservationStatus(b:any){if(b.status==='cancelled')return 'Annulée';const state=b.cancellation?.status;return state==='refund_pending'?'Remboursement en cours':state==='refund_failed'?'Remboursement à reprendre':state==='review_required'?'Vérification financière requise':b.cancellationRequestStatus==='pending'?'Annulation demandée':this.statusLabel(b.status);}
  refundLabel(state:string){return ({refunded:'Remboursé intégralement',no_charge:'Aucun débit à rembourser',refund_pending:'Remboursement en attente',refund_failed:'Remboursement échoué',processing:'Paiement en traitement'} as any)[state]||state;}
  refundKind(kind:string){return ({booking_deposit:'Acompte',balance:'Solde',security_payment:'Caution payée',security_deposit:'Garantie par carte'} as any)[kind]||kind;}
  active(b:any){return !!b&&!['cancelled','rejected','completed'].includes(b.status);}
  depositDone(b:any){return Number(b.bookingDeposit)===0||b.workflow?.depositPaid===true;}
  warrantyDone(b:any){return Number(b.securityDeposit)===0||b.workflow?.warrantyProvided===true;}
  balanceDone(b:any){return Number(b.balanceAmount)===0||b.workflow?.balancePaid===true;}
  financialLocked(b:any){return !!(b.financialChangesLocked||b.paymentCheckoutStartedAt||b.financialReviewRequired||b.workflow?.depositPaid||b.workflow?.warrantyProvided||b.workflow?.balancePaid);}
  warrantyLabel(b:any){if(Number(b.securityDeposit)===0)return 'Non requise';if(b.warrantyStatus==='paid'||b.workflow?.warrantyProvidedProof?.kind==='security_payment')return 'Caution payée';return this.warrantyDone(b)?'Carte enregistrée — aucun montant bloqué':'Carte à enregistrer — aucun débit ni blocage';}
  canPay(b:any,kind:PaymentKind){return ['booking_deposit','balance','security_deposit'].includes(kind)&&!this.admin&&(this.active(b)||(b?.status==='completed'&&kind==='balance'))&&!b.financialReviewRequired&&!this.cancellationLocked(b)&&this.money(b,kind)>0&&(kind==='booking_deposit'?!this.depositDone(b):kind==='balance'?!this.balanceDone(b):!this.warrantyDone(b));}
  money(b:any,kind:PaymentKind){return Number(kind==='booking_deposit'?b.bookingDeposit:kind==='balance'?b.balanceAmount:b.securityDeposit)||0;}
  paymentTitle(kind:PaymentKind){return kind==='booking_deposit'?'Payer l’acompte':kind==='balance'?'Payer le solde':'Enregistrer ma carte pour la caution';}
  statusLabel(status:string){return ({pending:'En attente',confirmed:'Confirmée',cancelled:'Annulée',rejected:'Refusée',completed:'Terminée'} as any)[status]||status;}
  private url(b:any){return `/api/${this.admin?'admin':'me'}/bookings/${encodeURIComponent(b.assetType)}/${encodeURIComponent(b.assetId)}/${encodeURIComponent(b.id||b.bookingId)}`;}
  async open(b:any){
    this.error='';this.editing=false;this.warrantyAccepted=false;
    try{this.selected=await firstValueFrom(this.http.get<any>(this.url(b),{headers:await this.auth.headers()}));}
    catch(e:any){this.error=this.explain(e);}
  }
  async cancelAdmin(b:any){
    if(!confirm(this.uiText.text('Approuver l’annulation et rembourser intégralement tous les paiements (acompte, solde et caution payée) ? La réservation restera active jusqu’à confirmation des remboursements.')))return;
    this.closePayment();this.editing=false;this.paymentMessage='';
    this.busy=b.id;this.error='';
    try{this.selected=await firstValueFrom(this.http.delete<any>(this.url(b),{headers:await this.auth.headers()}));await this.refresh();}
    catch(e:any){this.error=this.explain(e);await this.refresh();}finally{this.busy='';}
  }
  async checkCancellation(b:any){
    this.busy=b.id;this.error='';
    try{this.selected=await firstValueFrom(this.http.post<any>(this.url(b)+'/cancellation/reconcile',{}, {headers:await this.auth.headers()}));await this.refresh();}
    catch(e:any){this.error=this.explain(e);await this.refresh();}finally{this.busy='';}
  }
  async approve(b:any){
    this.busy=b.id;this.error='';
    try{await firstValueFrom(this.http.patch(this.url(b),{status:'confirmed'},{headers:(await this.auth.headers()).set('If-Match',b.updatedAt||b.createdAt)}));await this.refresh();}
    catch(e:any){this.error=this.explain(e);}finally{this.busy='';}
  }
  async pay(b:any,kind:PaymentKind){
    if(this.busy||!this.canPay(b,kind))return;
    this.error='';this.paymentMessage='';this.pendingPayment=null;this.warrantyAccepted=false;clearInterval(this.timer);this.busy=b.id;this.editing=false;
    try{
      this.closePayment();
      this.selected=await firstValueFrom(this.http.get<any>(this.url(b),{headers:await this.auth.headers()}));
      this.checkout={...await this.stripePayments.createPaymentElement(b.id,kind as 'booking_deposit'|'balance'|'security_deposit'),bookingId:b.id,kind,amount:this.money(this.selected,kind),currency:this.selected.currency};
    }catch(e:any){this.error=this.explain(e);}finally{this.busy='';}
  }
  closePayment(){this.checkout?.paymentElement?.destroy();this.checkout=null;this.mountedElement=null;}
  async confirmPayment(){
    if(!this.checkout||this.busy)return;this.busy='payment';this.error='';
    try{
      const c=this.checkout;if(c.kind==='security_deposit'&&c.checkout.mode!=='setup')throw new Error('warranty_setup_required');const args={elements:c.elements,confirmParams:{return_url:window.location.href},redirect:'if_required'};
      if(c.kind==='security_deposit')await this.saveWarrantyConsent(this.selected,c.checkout.paymentId);
      const result=c.checkout.mode==='setup'?await c.stripe.confirmSetup(args):await c.stripe.confirmPayment(args);
      if(result.error)throw new Error(result.error.message);
      this.pendingPayment={bookingId:c.bookingId,kind:c.kind};this.closePayment();this.paymentMessage='Validation en cours auprès de Stripe. Le statut sera actualisé après réception de la confirmation du serveur.';
      await this.refresh();let attempts=0;clearInterval(this.timer);
      if(this.pendingPayment)this.timer=setInterval(()=>{void this.refresh();if(++attempts>=12){clearInterval(this.timer);if(this.pendingPayment)this.paymentMessage=this.paymentText('pending');}},5000);
    }catch(e:any){this.error=this.explain(e);}finally{this.busy='';}
  }
  private localDate(value:string){const d=new Date(value);if(!Number.isFinite(d.getTime()))return '';const pad=(n:number)=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
  async startEdit(b:any){
    if(this.busy||!this.active(b)||this.cancellationLocked(b))return;
    await this.open(b);if(this.error||!this.selected)return;this.closePayment();const s=this.selected;
    this.editForm={customerName:s.customerName||'',customerEmail:s.customerEmail||'',customerPhone:s.customerPhone||'',comments:s.comments||'',startLocal:this.localDate(s.startAt),endLocal:this.localDate(s.endAt),pickupLocation:s.rental?.pickupLocation||'',returnLocation:s.rental?.returnLocation||'',driverAge:s.rental?.driverAge||25,licenseCountry:s.rental?.licenseCountry||'FR',additionalDriver:!!s.extras?.additionalDriver,childSeat:!!s.extras?.childSeat,guests:s.rental?.guests||1,vehiclePlate:s.rental?.vehiclePlate||'',rentalAmount:Number(s.rentalAmount),bookingDeposit:Number(s.bookingDeposit),securityDeposit:Number(s.securityDeposit)};
    this.editing=true;
  }
  async saveEdit(){
    if(!this.selected||this.busy)return;this.busy='edit';this.error='';
    try{
      const s=this.selected,f=this.editForm;
      const patch:any={customerName:f.customerName,customerPhone:f.customerPhone,comments:f.comments};
      if(this.admin)patch.customerEmail=f.customerEmail;
      if(s.assetType==='car')Object.assign(patch,{pickupLocation:f.pickupLocation,returnLocation:f.returnLocation,driverAge:Number(f.driverAge),licenseCountry:f.licenseCountry,additionalDriver:!!f.additionalDriver,childSeat:!!f.childSeat});
      else if(s.assetType==='parking')patch.vehiclePlate=f.vehiclePlate;
      else patch.guests=Number(f.guests);
      if(!this.financialLocked(s)){
        const start=new Date(f.startLocal),end=new Date(f.endLocal);
        if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start)throw new Error('Dates invalides : la fin doit être postérieure au début.');
        if(start.getTime()!==Date.parse(s.startAt))patch.startAt=start.toISOString();
        if(end.getTime()!==Date.parse(s.endAt))patch.endAt=end.toISOString();
        if(this.admin)for(const key of ['rentalAmount','bookingDeposit','securityDeposit'])if(Number(f[key])!==Number(s[key]))patch[key]=Number(f[key]);
      }
      const headers=(await this.auth.headers()).set('If-Match',s.updatedAt||s.createdAt||'');
      this.selected=await firstValueFrom(this.http.patch<any>(this.url(s),patch,{headers}));
      this.editing=false;this.paymentMessage='Réservation enregistrée. Les montants et le statut ont été actualisés.';await this.refresh();
    }catch(e:any){this.error=this.explain(e);}finally{this.busy='';}
  }
  async requestCancellation(b:any){
    if(!confirm(this.uiText.text('Demander l’annulation ? Après accord de l’administrateur, tous les paiements devront être remboursés avant que la réservation soit annulée.')))return;
    this.busy=b.id;this.error='';
    try{await firstValueFrom(this.http.post(this.url(b)+'/cancellation-request',{}, {headers:await this.auth.headers()}));await this.refresh();}
    catch(e:any){this.error=this.explain(e);}finally{this.busy='';}
  }
  private explain(e:any){
    const code=e?.error?.error||e?.message||'';
    if(code==='payment_confirmation_pending')return this.paymentText('pending');
    const translated=this.uiText.text(code);if(translated!==code)return translated;
    const messages:any={security_payment_disabled:'La caution se fournit désormais par enregistrement de carte, sans débit ni blocage.',warranty_setup_required:'L’enregistrement de carte n’a pas pu être démarré. Aucun paiement de caution ne sera confirmé. Contactez le propriétaire.',cancellation_in_progress:'L’annulation est en cours : les nouveaux paiements et modifications sont bloqués.',cancellation_busy_or_booking_closed:'Une opération est en cours ou la réservation est déjà clôturée. Actualisez puis réessayez.',cancellation_financial_review_required:'Un paiement ancien ou incomplet doit être vérifié avant tout remboursement ou annulation.',cancellation_payment_scope_mismatch:'Le compte ou le paiement Stripe ne correspond pas à cette réservation. Vérification requise.',cancellation_dispute_review_required:'Un litige Stripe doit être résolu avant l’annulation.',use_refund_cancellation_action:'Utilisez l’action Annuler et rembourser pour clôturer cette réservation.',owner_stripe_test_not_connected:'Le propriétaire doit créer son compte Stripe de test dans sa page Paiements.',stripe_test_account_owner_mismatch:'Le compte Stripe de test ne correspond pas au propriétaire de cette ressource.',stripe_test_account_not_ready:'Le propriétaire doit terminer la configuration de son compte Stripe de test.',stripe_test_connected_account_not_configured:'Le compte Stripe de test doit être configuré.',stripe_test_owners_require_test_keys:'Le mode propriétaires de test nécessite les deux clés Stripe de test.',booking_stripe_mode_mismatch:'Cette réservation appartient à un autre mode Stripe. Créez une nouvelle réservation pour vos essais.',booking_stripe_account_mismatch:'Cette réservation est liée à un autre compte Stripe. Créez une nouvelle réservation de test.',owner_stripe_not_connected:'Le propriétaire doit connecter son compte Stripe avant de recevoir un paiement.',owner_stripe_charges_not_enabled:'Le compte Stripe du propriétaire n’est pas encore activé pour recevoir les paiements.',stripe_publishable_key_not_configured:'La clé publique Stripe doit être configurée sur le serveur.',legacy_payment_review_required:'Un ancien paiement doit être vérifié par l’administrateur avant un nouveau paiement.',financial_changes_locked:'Un paiement a déjà été démarré ou enregistré : les dates, options tarifaires et montants sont verrouillés. Les coordonnées et commentaires restent modifiables.',booking_changed_reload_required:'La réservation a changé. Actualisez-la puis réessayez.',asset_unavailable:'Ces dates sont déjà réservées.',already_completed:'Cette étape est déjà validée. Actualisez la réservation.',invalid_asset_payment_policy:'Les montants configurés ne sont pas valides.',authentication_required:'Connectez-vous pour continuer.',invalid_booking_changes:'Vérifiez les champs de la réservation.',too_many_guests:'Le nombre de personnes dépasse la capacité.',booking_closed:'Cette réservation est clôturée.',invalid_amount:'Aucun montant valide à payer pour cette étape.'};
    return this.uiText.text(messages[code]||code||'L’opération n’a pas pu aboutir.');
  }
  ngOnDestroy(){clearInterval(this.timer);this.closePayment();}
}
