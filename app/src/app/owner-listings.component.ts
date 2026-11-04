import {LISTING_MODERATION_TEXT} from './services/listing-moderation-text';
import {LISTING_ACTIONS_TEXT} from './services/listing-actions-text';
import {SiteContentService} from './home/site-content-service/site-content.service';
import {LanguageService} from './services/language.service';
import {Component,OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from './services/reservation-auth.service';
@Component({selector:'app-owner-listings',standalone:false,templateUrl:'./owner-listings.component.html',styleUrls:['./owner-listings.component.scss']})
export class OwnerListingsComponent implements OnInit{
 uiContent:any=null;
 text(key:string,fallback:string){return this.siteContent?.tFromContent(this.uiContent,key,this.language?.currentLanguage||'fr',fallback)||fallback;}
 moderationLabel(a:any){const status=a.moderation?.status;const lang=this.language?.currentLanguage||'fr';return this.text('ui.listingModeration.'+status,LISTING_MODERATION_TEXT[lang]?.[status]||LISTING_MODERATION_TEXT.en[status]||status);}
 editing:any=null;deleting:any=null;impact:any=null;acknowledged=false;showArchived=false;
 lx(key:string){const lang=this.language?.currentLanguage||'fr';return this.text('ui.listingActions.'+key,LISTING_ACTIONS_TEXT[lang]?.[key]||LISTING_ACTIONS_TEXT.en[key]||key);}
 get visibleRows(){return this.rows.filter(a=>this.showArchived?!!a.deletedAt:!a.deletedAt);}
 rows:any[]=[];busy=false;error='';message='';creating=false;prices:Record<string,number>={};
 types=[{id:'boat',label:'ui.labels.tc94e451ae5dc'},{id:'car',label:'ui.labels.tc9d1737a7efb'},{id:'property',label:'ui.labels.t89104fc18cf2'},{id:'parking',label:'ui.labels.taef05c2870c0'},{id:'pool',label:'ui.labels.t42f9f15e9931'}];
 form:any=this.empty();
 readonly fields:Record<string,Array<{key:string,label:string,type:string}>>={boat:[{key:'boatType',label:'ui.labels.t7b2c95799dfc',type:'text'},{key:'capacity',label:'ui.labels.t288adcf14920',type:'number'},{key:'departurePort',label:'ui.labels.t8141355a2512',type:'text'}],car:[{key:'brand',label:'ui.labels.tb539addf71ad',type:'text'},{key:'model',label:'ui.labels.t9853170f16b4',type:'text'},{key:'seats',label:'ui.labels.t0cd3597453ab',type:'number'},{key:'rangeKm',label:'ui.labels.t43a4bb274dfb',type:'number'}],property:[{key:'bedrooms',label:'ui.labels.ted5b95f74495',type:'number'},{key:'beds',label:'ui.labels.tbe0e99e68559',type:'number'},{key:'bathrooms',label:'ui.labels.tb5331e439cba',type:'number'},{key:'guests',label:'ui.labels.t67d605234783',type:'number'},{key:'surfaceM2',label:'ui.labels.t1ef3f545a51c',type:'number'},{key:'checkIn',label:'ui.labels.tb26bc6807453',type:'time'},{key:'checkOut',label:'ui.labels.t2fb998a9c5c0',type:'time'}],parking:[{key:'widthM',label:'ui.labels.t8b5026d7037d',type:'number'},{key:'lengthM',label:'ui.labels.t1b1b59a7f3e2',type:'number'},{key:'heightLimitM',label:'ui.labels.t30eca4619772',type:'number'},{key:'secured',label:'ui.labels.t85014ef6373a',type:'checkbox'},{key:'cctv',label:'ui.labels.t03a0f44e2ab3',type:'checkbox'},{key:'evCharging',label:'ui.labels.t0c375c73fbd0',type:'checkbox'}],pool:[{key:'lengthM',label:'ui.labels.t1b1b59a7f3e2',type:'number'},{key:'widthM',label:'ui.labels.t8b5026d7037d',type:'number'},{key:'capacity',label:'ui.labels.t25bc0fbf3cbb',type:'number'},{key:'heated',label:'ui.labels.t853940be427f',type:'checkbox'},{key:'indoor',label:'ui.labels.td0e418a36cce',type:'checkbox'}]};
 constructor(private http:HttpClient,private auth:ReservationAuthService,private siteContent:SiteContentService,public language:LanguageService){}
 empty(){return{assetType:'boat',name:'',headline:'',description:'',location:{city:'',area:'',country:'France'},pricing:{basePrice:100,currency:'EUR',pricingUnit:'day'},properties:{},depositType:'percentage',depositPercent:10,securityDeposit:0};}
 get locationRequired():boolean{return ['parking','pool','property'].includes(this.form.assetType);}
 label(type:string){return this.types.find(t=>t.id===type)?.label||type;}
 url(a:any){return `/api/owner/listings/${encodeURIComponent(a.assetType)}/${encodeURIComponent(a.id)}`;}
 path(a:any,tail:string){return `/${a.assetType}/${a.id}/${tail}`;}
 async ngOnInit(){this.uiContent=await this.siteContent?.getContent();await this.refresh();}
 async refresh(){if(this.busy)return;this.busy=true;this.error='';try{this.prices=(await firstValueFrom(this.http.get<any>('/api/listing-plans'))).prices;this.rows=await firstValueFrom(this.http.get<any[]>('/api/owner/listings',{headers:await this.auth.headers()}));if(new URLSearchParams(window.location.search).get('billing')==='success')this.message=this.text('ui.labels.tbd4b83f35532','Retour de Stripe : actualisez pour vérifier la confirmation serveur. Le retour seul ne publie pas votre annonce.');}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}}
 changeType(){this.form.properties={};this.form.pricing.pricingUnit=this.form.assetType==='property'?'night':'day';}
 closeEditor(){this.creating=false;this.editing=null;this.deleting=null;this.impact=null;this.acknowledged=false;this.form=this.empty();}
 toggleCreate(){if(this.creating||this.editing||this.deleting){this.closeEditor();return;}this.closeEditor();this.creating=true;}
 async prepare(a:any,mode:'edit'|'delete'){
  if(this.busy||a.deletedAt)return;this.closeEditor();this.error='';this.message='';
  if(mode==='edit'){this.editing=a;this.form={...this.empty(),assetType:a.assetType,name:a.name||'',headline:a.headline||'',description:a.description||'',location:{city:'',area:'',country:'France',...(a.location||{})},pricing:{...this.empty().pricing,...(a.pricing||{})},properties:{...(a.properties||{})},depositType:a.paymentPolicy?.bookingDeposit?.type||'fixed',depositPercent:Number(a.paymentPolicy?.bookingDeposit?.value||0),securityDeposit:Number(a.paymentPolicy?.securityDeposit?.value||0)};this.creating=true;}
  else this.deleting=a;
  await this.reloadImpact();if(typeof document!=='undefined'){const el=document.getElementById('listing-editor');el?.scrollIntoView({block:'start',behavior:'smooth'});el?.focus({preventScroll:true});}
 }
 async reloadImpact(){const a=this.editing||this.deleting;if(!a||this.busy)return;this.busy=true;this.impact=null;this.acknowledged=false;this.error='';try{this.impact=await firstValueFrom(this.http.get<any>(this.url(a)+'/impact',{headers:await this.auth.headers()}));}catch(e:any){this.error=this.err(e)||this.lx('loadFailed');}finally{this.busy=false;}}
 async commitListing(){
  const a=this.editing||this.deleting;if(!a||this.busy||!this.impact||((this.deleting||this.impact.active>0)&&!this.acknowledged))return;
  const removing=!!this.deleting;this.busy=true;this.error='';
  try{const body={revision:this.impact.revision,acknowledgeReservations:this.acknowledged,...(!removing?{listing:this.form}:{})};const options={headers:await this.auth.headers()};if(removing)await firstValueFrom(this.http.delete(this.url(a),{...options,body}));else await firstValueFrom(this.http.patch(this.url(a),body,options));this.closeEditor();this.message=this.lx(removing?'deleted':'saved');}
  catch(e:any){this.error=this.err(e);if(e?.status===409||e?.error?.error==='listing_changed_reload_required'){this.impact=null;this.acknowledged=false;}return;}
  finally{this.busy=false;}
  await this.refresh();
 }
 async create(){if(this.editing){await this.commitListing();return;}if(this.busy)return;this.busy=true;this.error='';try{const a=await firstValueFrom(this.http.post<any>('/api/owner/listings',this.form,{headers:await this.auth.headers()}));this.creating=false;this.form=this.empty();this.message=this.text('ui.labels.tc89168e2e53f','Annonce créée en brouillon. Ajoutez les photos et souscrivez pour la publier.');this.rows.unshift(a);}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}}
 async action(a:any,kind:'checkout'|'portal'|'renewal'|'publication'|'reconcile'|'resubmit'){if(this.busy)return;this.busy=true;this.error='';try{const headers=await this.auth.headers();let result:any;if(kind==='publication'||kind==='resubmit')result=await firstValueFrom(this.http.patch(this.url(a)+'/publication',{published:kind==='resubmit'?true:a.published!==true},{headers}));else result=await firstValueFrom(this.http.post(this.url(a)+'/'+kind,kind==='renewal'?{cancelAtPeriodEnd:!a.billing?.cancelAtPeriodEnd}:{},{headers}));if(result?.url){const url=new URL(result.url);if(url.protocol!=='https:'||!['checkout.stripe.com','billing.stripe.com'].includes(url.hostname))throw Error('Lien Stripe invalide.');window.location.assign(url.href);return;}}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}await this.refresh();}
 err(e:any){const code=e?.error?.error;if(code==='listing_changed_reload_required')return this.lx('changed');if(code==='listing_archived')return this.lx('notEditable');if(code==='asset_type_immutable')return this.lx('typeImmutable');if(code==='reservations_acknowledgement_required')return this.lx('acknowledge');return ({authentication_required:'Connectez-vous pour gérer vos annonces.',subscription_exists_use_manage:'Un abonnement existe déjà. Utilisez « Factures et paiement ».',subscription_confirmation_pending:'Paiement en cours de confirmation : actualisez dans quelques instants.',checkout_in_progress:'Une ouverture Stripe est déjà en cours. Réessayez dans quelques instants.',billing_return_url_required:'Le serveur doit configurer BILLING_RETURN_URL.',billing_mode_mismatch:'Le mode Stripe facturation a changé. Contactez l’administrateur.'} as Record<string,string>)[code]||(e?.error?.issues?.some((i:any)=>i.path?.[0]==='location')?'Indiquez la ville et le pays pour ce bien.':null)||e?.error?.message||code||e?.message||'Opération impossible.';}
}
