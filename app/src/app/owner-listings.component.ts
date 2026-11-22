import {MessageLinkComponent} from './messaging/message-link.component';
import {AssetCalendarLinkComponent} from './calendar/asset-calendar-link.component';
import {ListingDescriptionEditorComponent} from './shared/listing-description-editor.component';
import {WIZARD_STRIPE_TEXT} from './services/wizard-stripe-text';
import {LISTING_IMPORT_TEXT} from './services/listing-import-text';
import {AssetDocumentsComponent} from './workspace/asset-documents.component';
import {prefixQuery,prefixQueryReady,prefixSelectionValid} from './services/asset-prefix';
import {LISTING_WIZARD_TEXT} from './services/listing-wizard-text';
import {LISTING_WIZARD_STEPS,listingStepValid,listingPhotoFileValid,sanitizedListingForm} from './services/listing-wizard';
import {assetPhotoPaths} from './services/asset-photos';
import {MEDIA_ROUTES,mediaObjectPath,mediaObjectUrl} from './services/media-routes';
import {OWNER_ONBOARDING_TEXT} from './services/owner-onboarding-text';
import {LISTING_MODERATION_TEXT} from './services/listing-moderation-text';
import {LISTING_ACTIONS_TEXT} from './services/listing-actions-text';
import {SiteContentService} from './home/site-content-service/site-content.service';
import {LanguageService} from './services/language.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SiteTextPipe} from './home/site-text.pipe';
import {Component,Input,Output,EventEmitter,OnInit,OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from './services/reservation-auth.service';
@Component({selector:'app-owner-listings',standalone:true,imports:[MessageLinkComponent,AssetCalendarLinkComponent,ListingDescriptionEditorComponent,AssetDocumentsComponent,CommonModule,FormsModule,RouterModule,SiteTextPipe],templateUrl:'./owner-listings.component.html',styleUrls:['./owner-listings.component.scss']})
export class OwnerListingsComponent implements OnInit,OnDestroy{
 @Input() adminScope:{type:string,id:string}|null=null;@Output() editorClosed=new EventEmitter<void>();@Output() listingSaved=new EventEmitter<void>();
 async loadAdminEditor(){this.error='';try{const headers=await this.auth.headers();const scope=this.adminScope!;const plans=await firstValueFrom(this.http.get<any>('/api/listing-plans'));this.prices=plans.prices;this.billingMode=plans.mode;const data=await firstValueFrom(this.http.get<any>('/api/manage/assets/'+[scope.type,scope.id].map(encodeURIComponent).join('/')+'/content',{headers:headers.set('X-Skip-Media-Resolution','true')}));await this.prepare({...data.asset,id:scope.id,assetType:scope.type},'edit');}catch(e:any){this.error=this.err(e);}}
 creationChoice=false;importBusy=false;importUrl='';importAssetType='';importText='';importRights=false;importResult:any=null;importError='';importPhotoChoices:boolean[]=[];importPreviews:Array<{url:string,file?:File,state:'loading'|'ready'|'error'}>=[];importPreviewsLoading=false;private importPreviewRequest=0;
 ix(key:string){const lang=this.language.currentLanguage;return this.text('ui.listingImport.'+key,LISTING_IMPORT_TEXT[lang]?.[key]||LISTING_IMPORT_TEXT.en[key]||key);}
 startManual(){this.clearImportPreviews();this.creationChoice=false;this.closeEditor(true);this.creating=true;this.focusWizard();}
 private clearImportPreviews(){this.importPreviewRequest++;for(const photo of this.importPreviews)if(photo.url)URL.revokeObjectURL(photo.url);this.importPreviews=[];this.importPhotoChoices=[];this.importPreviewsLoading=false;}
 async previewImport(){if(this.importBusy||!this.importRights||!this.importUrl.trim())return;this.clearImportPreviews();const request=this.importPreviewRequest;this.importBusy=true;this.importError='';this.importResult=null;try{const result=await firstValueFrom(this.http.post<any>('/api/owner/listing-import/preview',{url:this.importUrl,text:this.importText,assetType:this.importAssetType,rightsConfirmed:true},{headers:await this.auth.headers()}));if(request!==this.importPreviewRequest)return;this.importResult=result;this.importPhotoChoices=(result.draft.photos||[]).map(()=>false);this.importPreviews=(result.draft.photos||[]).map(()=>({url:'',state:'loading' as const}));}catch{if(request===this.importPreviewRequest)this.importError=this.ix('failed');}finally{this.importBusy=false;}if(request===this.importPreviewRequest&&this.importResult)void this.loadImportPreviews();}
 async loadImportPreviews(){if(this.importPreviewsLoading||this.importBusy||!this.importResult||!this.importRights)return;const request=this.importPreviewRequest;const sources=this.importResult.draft.photos||[];this.importPreviewsLoading=true;try{const headers=await this.auth.headers();for(let i=0;i<sources.length;i++){if(request!==this.importPreviewRequest)return;const photo=this.importPreviews[i];if(photo.file)continue;photo.state='loading';try{const blob=await firstValueFrom(this.http.post('/api/owner/listing-import/photo',{url:sources[i],rightsConfirmed:true},{headers,responseType:'blob'}));if(request!==this.importPreviewRequest)return;const extension=blob.type==='image/png'?'png':blob.type==='image/webp'?'webp':'jpg';const file=new File([blob],'import-'+(i+1)+'.'+extension,{type:blob.type});if(!listingPhotoFileValid(file))throw Error('invalid_photo');photo.file=file;photo.url=URL.createObjectURL(file);photo.state='ready';}catch{if(request===this.importPreviewRequest){photo.state='error';this.importPhotoChoices[i]=false;}}}}catch{if(request===this.importPreviewRequest)for(const photo of this.importPreviews)if(photo.state==='loading')photo.state='error';}finally{if(request===this.importPreviewRequest)this.importPreviewsLoading=false;}}
 importPreviewFailed(index:number){const photo=this.importPreviews[index];if(!photo)return;if(photo.url)URL.revokeObjectURL(photo.url);photo.url='';photo.file=undefined;photo.state='error';this.importPhotoChoices[index]=false;}
 async applyImport(){if(this.importBusy||!this.importResult||!this.importRights)return;this.importBusy=true;const draft=this.importResult.draft;const files:File[]=[];let failed=0;try{for(let i=0;i<(draft.photos||[]).length;i++){if(!this.importPhotoChoices[i])continue;const preview=this.importPreviews[i];if(preview?.state==='ready'&&preview.file)files.push(preview.file);else failed++;}
 this.startManual();this.form.assetType=draft.assetType;this.changeType();this.form.name=draft.name||'';this.form.description=[draft.description,...(draft.amenities||[])].filter(Boolean).join('\n\n').slice(0,10000);this.form.location={city:draft.location?.city||'',area:'',country:draft.location?.country||'France'};this.form.properties={...(draft.properties||{})};this.form.pricing.basePrice=null;for(const file of files)this.photos.push({file,preview:URL.createObjectURL(file)});this.photosDirty=files.length>0;this.wizardDirty=true;this.message=this.ix(failed?'partialPhotos':'reviewNotice');this.importResult=null;
 }finally{this.importBusy=false;}}
 prefixInput='';prefixChoices:string[]=[];prefixLoading=false;prefixError='';prefixTaken=false;prefixChecked='';prefixTouched=false;private prefixTimer:any;private prefixRequest=0;
 get prefixReady(){return prefixQueryReady(this.prefixInput);}
 get prefixInvalid(){return this.prefixTouched&&(!this.prefixReady||this.prefixTaken||!!this.prefixError);}
 get prefixValidation(){if(this.prefixTouched&&!this.prefixReady)return this.prefixText('Au moins six lettres sont nécessaires.','Enter at least six letters.');if(this.prefixTaken)return this.prefixText('Ce préfixe est déjà utilisé. Choisissez une proposition disponible.','This prefix is already taken. Select an available suggestion.');return this.prefixError;}
 prefixText(fr:string,en:string){return this.language.currentLanguage==='fr'?fr:en;}
 prefixChanged(value:string){this.prefixTouched=true;this.prefixInput=value;this.form.prefix='';this.prefixChoices=[];this.prefixError='';this.prefixTaken=false;this.prefixChecked='';this.prefixLoading=false;const request=++this.prefixRequest;clearTimeout(this.prefixTimer);if(!prefixQueryReady(value))return;this.prefixLoading=true;this.prefixTimer=setTimeout(()=>this.loadPrefixes(request,value),350);}
 choosePrefix(value:string){if(!prefixSelectionValid(value,this.prefixChoices))return;clearTimeout(this.prefixTimer);this.prefixRequest++;this.prefixInput=value;this.form.prefix=value;this.prefixTaken=false;this.prefixError='';this.prefixChecked=value;this.prefixLoading=false;this.wizardDirty=true;}
 async loadPrefixes(request:number,value:string){try{const headers=await this.auth.headers();if(request!==this.prefixRequest)return;const query=prefixQuery(value);const result=await firstValueFrom(this.http.get<{suggestions:string[],available?:boolean,reason?:string}>((this.adminScope?this.url(this.editing)+'/prefixes':'/api/owner/prefixes'),{headers,params:{q:query,...(this.editing?{type:this.editing.assetType,id:this.editing.id}:{})}}));if(request!==this.prefixRequest)return;this.prefixChoices=result.suggestions||[];this.prefixChecked=query;const available=result.available??this.prefixChoices.includes(query);this.prefixTaken=result.reason==='taken'||(!available&&result.reason!=='invalid');if(result.reason==='invalid')this.prefixError=this.prefixText('Utilisez au moins six lettres, avec des chiffres ou tirets si nécessaire.','Use at least six letters, with optional digits or hyphens.');if(available&&this.prefixChoices.includes(query))this.form.prefix=query;}catch{if(request===this.prefixRequest)this.prefixError=this.prefixText('Impossible de vérifier la disponibilité. Réessayez.','Could not check availability. Please retry.');}finally{if(request===this.prefixRequest)this.prefixLoading=false;}}
 prefixValid(){if(this.editing?.prefix&&this.form.prefix===this.editing.prefix&&prefixQuery(this.prefixInput)===this.editing.prefix&&!this.prefixLoading)return true;if(this.editing&&!this.editing.prefix&&!this.prefixInput&&!this.form.prefix&&!this.prefixTouched)return true;return !this.prefixLoading&&!this.prefixInvalid&&this.prefixChecked===prefixQuery(this.prefixInput)&&prefixSelectionValid(this.form.prefix,this.prefixChoices);}
 stripeKnown=false;stripeLoading=false;stripeConnecting=false;stripeStatus:any=null;stripeError='';private stripeOwnerId='';private stripeRequest=0;private submittedDocumentFingerprint='';
 sx(key:string){const lang=this.language.currentLanguage;return this.text('ui.wizardStripe.'+key,WIZARD_STRIPE_TEXT[lang]?.[key]||WIZARD_STRIPE_TEXT.en[key]||key);}
 async loadWizardStripe(){const request=++this.stripeRequest;this.stripeLoading=true;this.stripeKnown=false;this.stripeError='';try{const user=await this.auth.user();const result=await firstValueFrom(this.http.get<any>('/api/owners/'+encodeURIComponent(user.uid)+'/stripe/status',{headers:await this.auth.headers()}));if(request!==this.stripeRequest)return;if(typeof result?.connected!=='boolean')throw Error('invalid_stripe_status');this.stripeOwnerId=user.uid;this.stripeStatus=result;this.stripeKnown=true;}catch(e:any){if(request===this.stripeRequest)this.stripeError=this.sx(e?.error?.error==='legal_documents_not_published'?'legalUnavailable':'statusError');}finally{if(request===this.stripeRequest)this.stripeLoading=false;}}
 async connectWizardStripe(){if(this.adminScope||!this.editing||this.stripeLoading||this.stripeConnecting||!this.stripeKnown)return;this.stripeConnecting=true;const asset=this.editing;try{await this.loadWizardStripe();if(!this.stripeKnown||this.stripeStatus.connected)return;const uid=(await this.auth.user()).uid;if(uid!==this.stripeOwnerId)throw Error('account_changed');const result=await firstValueFrom(this.http.post<any>('/api/owners/'+encodeURIComponent(uid)+'/stripe/connect',{assetType:asset.assetType,assetId:asset.id,resumeWizard:true,returnOrigin:window.location.origin},{headers:await this.auth.headers()}));if(!result?.url)throw Error('stripe_url_missing');const url=new URL(result.url);if(url.protocol!=='https:'||!(url.hostname==='stripe.com'||url.hostname.endsWith('.stripe.com')))throw Error('invalid_stripe_url');window.location.assign(url.href);}catch{this.stripeError=this.sx('connectError');}finally{this.stripeConnecting=false;}}
 async completeWizard(){if(this.busy||this.documentBusy||this.stripeConnecting)return;this.closeEditor(true);this.message=this.sx('savedForLater');await this.refresh();}
 documentsSummary:any=null;documentBusy=false;
 private documentScopeValue:{type:string,id:string}|null=null;
 get documentScope(){if(!this.editing)return null;const a=this.editing;if(this.documentScopeValue?.type!==a.assetType||this.documentScopeValue?.id!==a.id)this.documentScopeValue={type:a.assetType,id:a.id};return this.documentScopeValue;}
 get documentsReady(){return !!this.documentsSummary&&(this.documentsSummary.provided===true||this.documentsSummary.approved===true);}
 documentsUpdated(summary:any){this.documentsSummary=summary;}
 step=0;get steps(){return this.adminScope?LISTING_WIZARD_STEPS:[...LISTING_WIZARD_STEPS,'stripe'];}photos:Array<{path?:string,file?:File,preview:string}>=[];photosLoaded=true;photosDirty=false;wizardDirty=false;uploadProgress='';subscriptionAsset:any=null;
 wx(key:string){const lang=this.language.currentLanguage;return this.text('ui.listingWizard.'+key,LISTING_WIZARD_TEXT[lang]?.[key]||LISTING_WIZARD_TEXT.en[key]||key);}
 stepValid(n:number){if(n===4)return true;if(n===3)return this.documentsReady;return listingStepValid(this.form,n)&&(n!==0||this.prefixValid());}
 nextStep(){if(this.stepValid(this.step)){this.step=Math.min(2,this.step+1);this.focusWizard();}}
 async goToStep(index:number){
  if(this.busy||this.documentBusy||this.stripeConnecting||index<0||index>=this.steps.length)return;
  if(index<3){this.step=index;if(this.editing&&!this.impact)await this.reloadImpact();this.focusWizard();return;}
  if(!this.editing||this.wizardDirty||this.photosDirty){
   if(this.editing&&!this.impact)await this.reloadImpact();
   await this.saveWizard(true);
   if(!this.editing||this.wizardDirty||this.photosDirty||this.step!==3)return;
  }
  this.step=index;this.focusWizard();if(index===4&&!this.adminScope)await this.loadWizardStripe();
 }
 async skipDocuments(){if(this.adminScope)return;await this.goToStep(4);}
 previousStep(){this.goToStep(Math.max(0,this.step-1));}
 focusWizard(){setTimeout(()=>{const el=document.getElementById('listing-editor');el?.scrollIntoView({block:'start',behavior:'smooth'});el?.focus({preventScroll:true});});}
 private clearPhotoPreviews(){for(const photo of this.photos)if(photo.preview.startsWith('blob:'))URL.revokeObjectURL(photo.preview);this.photos=[];}
 ngOnDestroy(){this.clearImportPreviews();this.stripeRequest++;clearTimeout(this.prefixTimer);this.prefixRequest++;this.clearPhotoPreviews();}
 addPhotos(event:Event){const input=event.target as HTMLInputElement;const files=Array.from(input.files||[]);this.error='';if(files.some(f=>!listingPhotoFileValid(f))||files.length+this.photos.length>50){this.error=this.wx('photoError');input.value='';return;}for(const file of files)this.photos.push({file,preview:URL.createObjectURL(file)});this.photosDirty=true;this.wizardDirty=true;input.value='';}
 removePhoto(index:number){const p=this.photos[index];if(p?.preview.startsWith('blob:'))URL.revokeObjectURL(p.preview);this.photos.splice(index,1);this.photosDirty=true;this.wizardDirty=true;}
 movePhoto(index:number,offset:number){const target=index+offset;if(target<0||target>=this.photos.length)return;[this.photos[index],this.photos[target]]=[this.photos[target],this.photos[index]];this.photosDirty=true;this.wizardDirty=true;}
 async openSubscription(a:any){if(this.busy)return;if(this.subscriptionAsset?.id===a.id){this.subscriptionAsset=null;return;}this.subscriptionAsset=a;this.busy=true;this.error='';try{const detail=await firstValueFrom(this.http.get<any>(this.url(a)+'/subscription',{headers:await this.auth.headers()}));a.billing=detail.billing;}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}}
 uiContent:any=null;
 onb(key:string){const lang=this.language.currentLanguage;return this.siteContent?.tFromContent(this.uiContent,'ui.ownerOnboarding.'+key,lang,OWNER_ONBOARDING_TEXT[lang]?.[key]||OWNER_ONBOARDING_TEXT.en[key])||OWNER_ONBOARDING_TEXT.en[key];}

 text(key:string,fallback:string){return this.siteContent?.tFromContent(this.uiContent,key,this.language?.currentLanguage||'fr',fallback)||fallback;}
 moderationLabel(a:any){const status=a.moderation?.status;const lang=this.language?.currentLanguage||'fr';return this.text('ui.listingModeration.'+status,LISTING_MODERATION_TEXT[lang]?.[status]||LISTING_MODERATION_TEXT.en[status]||status);}
 editing:any=null;deleting:any=null;impact:any=null;acknowledged=false;showArchived=false;
 lx(key:string){const lang=this.language?.currentLanguage||'fr';return this.text('ui.listingActions.'+key,LISTING_ACTIONS_TEXT[lang]?.[key]||LISTING_ACTIONS_TEXT.en[key]||key);}
 get visibleRows(){return this.rows.filter(a=>this.showArchived?!!a.deletedAt:!a.deletedAt);}
 billingMode='';rows:any[]=[];busy=false;error='';message='';creating=false;prices:Record<string,number>={};
 types=[{id:'boat',label:'ui.labels.tc94e451ae5dc'},{id:'car',label:'ui.labels.tc9d1737a7efb'},{id:'property',label:'ui.labels.t89104fc18cf2'},{id:'parking',label:'ui.labels.taef05c2870c0'},{id:'pool',label:'ui.labels.t42f9f15e9931'}];
 form:any=this.empty();
 readonly fields:Record<string,Array<{key:string,label:string,type:string}>>={boat:[{key:'boatType',label:'ui.labels.t7b2c95799dfc',type:'text'},{key:'capacity',label:'ui.labels.t288adcf14920',type:'number'},{key:'departurePort',label:'ui.labels.t8141355a2512',type:'text'}],car:[{key:'brand',label:'ui.labels.tb539addf71ad',type:'text'},{key:'model',label:'ui.labels.t9853170f16b4',type:'text'},{key:'seats',label:'ui.labels.t0cd3597453ab',type:'number'},{key:'rangeKm',label:'ui.labels.t43a4bb274dfb',type:'number'}],property:[{key:'bedrooms',label:'ui.labels.ted5b95f74495',type:'number'},{key:'beds',label:'ui.labels.tbe0e99e68559',type:'number'},{key:'bathrooms',label:'ui.labels.tb5331e439cba',type:'number'},{key:'guests',label:'ui.labels.t67d605234783',type:'number'},{key:'surfaceM2',label:'ui.labels.t1ef3f545a51c',type:'number'},{key:'checkIn',label:'ui.labels.tb26bc6807453',type:'time'},{key:'checkOut',label:'ui.labels.t2fb998a9c5c0',type:'time'}],parking:[{key:'widthM',label:'ui.labels.t8b5026d7037d',type:'number'},{key:'lengthM',label:'ui.labels.t1b1b59a7f3e2',type:'number'},{key:'heightLimitM',label:'ui.labels.t30eca4619772',type:'number'},{key:'secured',label:'ui.labels.t85014ef6373a',type:'checkbox'},{key:'cctv',label:'ui.labels.t03a0f44e2ab3',type:'checkbox'},{key:'evCharging',label:'ui.labels.t0c375c73fbd0',type:'checkbox'}],pool:[{key:'lengthM',label:'ui.labels.t1b1b59a7f3e2',type:'number'},{key:'widthM',label:'ui.labels.t8b5026d7037d',type:'number'},{key:'capacity',label:'ui.labels.t25bc0fbf3cbb',type:'number'},{key:'heated',label:'ui.labels.t853940be427f',type:'checkbox'},{key:'indoor',label:'ui.labels.td0e418a36cce',type:'checkbox'}]};
 constructor(private http:HttpClient,private auth:ReservationAuthService,private siteContent:SiteContentService,public language:LanguageService){}
 empty(){return{prefix:'',assetType:'boat',name:'',headline:'',description:'',location:{city:'',area:'',country:'France'},pricing:{basePrice:null,currency:'EUR',pricingUnit:'day'},properties:{},depositType:'percentage',depositPercent:10,securityDeposit:0};}
 get locationRequired():boolean{return ['parking','pool','property'].includes(this.form.assetType);}
 label(type:string){return this.types.find(t=>t.id===type)?.label||type;}
 url(a:any){return `/api/${this.adminScope?'platform/admin':'owner'}/listings/${encodeURIComponent(a.assetType)}/${encodeURIComponent(a.id)}`;}
 path(a:any,tail:string){return `/${a.assetType}/${a.id}/${tail}`;}
 async ngOnInit(){this.uiContent=await this.siteContent?.getContent();if(this.adminScope)await this.loadAdminEditor();else {await this.refresh();const params=new URLSearchParams(window.location.search);const a=this.rows.find(x=>x.assetType===params.get('editType')&&x.id===params.get('editId'));if(a){await this.prepare(a,'edit');if(params.get('wizard')==='stripe'){this.step=4;await this.loadWizardStripe();}}}}
 private deepLinkHandled=false;
 async refresh(){if(this.adminScope)return;if(this.busy)return;this.busy=true;this.error='';try{const plans=await firstValueFrom(this.http.get<any>('/api/listing-plans'));this.prices=plans.prices;this.billingMode=plans.mode;this.rows=await firstValueFrom(this.http.get<any[]>('/api/owner/listings',{headers:await this.auth.headers()}));if(this.subscriptionAsset)this.subscriptionAsset=this.rows.find(a=>a.id===this.subscriptionAsset.id)||null;if(new URLSearchParams(window.location.search).get('billing')==='success')this.message=this.text('ui.labels.tbd4b83f35532','Retour de Stripe : actualisez pour vérifier la confirmation serveur. Le retour seul ne publie pas votre annonce.');}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}await this.applyDeepLink();}
 private async applyDeepLink(){if(this.deepLinkHandled||this.error||!this.rows.length)return;const params=new URLSearchParams(window.location.search),id=params.get('asset'),action=params.get('action');if(!id||!action)return;const asset=this.rows.find(a=>a.id===id&&!a.deletedAt);if(!asset)return;this.deepLinkHandled=true;if(action==='edit')await this.prepare(asset,'edit');if(action==='subscription')await this.openSubscription(asset);}
 changeType(){this.form.properties={};this.form.pricing.pricingUnit=this.form.assetType==='property'?'night':'day';}
 closeEditor(force=false):boolean{if(!force&&this.stripeConnecting)return false;const hadEditor=this.creating||!!this.editing;if(!force&&this.wizardDirty&&typeof window!=='undefined'&&!window.confirm(this.wx('discard')))return false;this.stripeRequest++;this.stripeKnown=false;this.stripeLoading=false;this.stripeStatus=null;this.stripeError='';this.submittedDocumentFingerprint='';clearTimeout(this.prefixTimer);this.prefixRequest++;this.prefixInput='';this.prefixChoices=[];this.prefixLoading=false;this.prefixError='';this.prefixTaken=false;this.prefixChecked='';this.prefixTouched=false;this.clearPhotoPreviews();this.creating=false;this.editing=null;this.deleting=null;this.impact=null;this.acknowledged=false;this.step=0;this.documentsSummary=null;this.documentBusy=false;this.photosLoaded=true;this.photosDirty=false;this.wizardDirty=false;this.form=this.empty();if(this.adminScope&&!force&&hadEditor)this.editorClosed.emit();return true;}
 toggleCreate(){if(this.importBusy)return;if(this.creating||this.editing||this.deleting){this.closeEditor();return;}this.clearImportPreviews();this.creationChoice=!this.creationChoice;this.importResult=null;this.importError='';}
 async prepare(a:any,mode:'edit'|'delete'){
  if(this.busy||a.deletedAt)return;if(!this.closeEditor())return;this.error='';this.message='';
  if(mode==='edit'){this.editing=a;this.form={...this.empty(),prefix:a.prefix||'',assetType:a.assetType,name:a.name||'',headline:a.headline||'',description:a.description||'',location:{city:'',area:'',country:'France',...(a.location||{})},pricing:{...this.empty().pricing,...(a.pricing||{})},properties:{...(a.properties||{})},depositType:a.paymentPolicy?.bookingDeposit?.type||'fixed',depositPercent:Number(a.paymentPolicy?.bookingDeposit?.value||0),securityDeposit:Number(a.paymentPolicy?.securityDeposit?.value||0)};this.prefixInput=a.prefix||'';this.prefixChoices=a.prefix?[a.prefix]:[];this.prefixChecked=a.prefix||'';this.creating=true;this.photos=assetPhotoPaths(a,a.assetType,a.id).map(raw=>{const path=mediaObjectPath(raw)||raw;return {path,preview:mediaObjectUrl(path)};});}
  else this.deleting=a;
  await this.reloadImpact();if(mode==='edit')await this.loadWizardPhotos(a);if(typeof document!=='undefined'){const el=document.getElementById(mode==='delete'?'listing-delete':'listing-editor');el?.scrollIntoView({block:'start',behavior:'smooth'});el?.focus({preventScroll:true});}
 }
 async loadWizardPhotos(a:any){
  this.busy=true;this.photosLoaded=false;
  try{
   const data=await firstValueFrom(this.http.get<any>(`/api/manage/assets/${encodeURIComponent(a.assetType)}/${encodeURIComponent(a.id)}/content`,{headers:(await this.auth.headers()).set('X-Skip-Media-Resolution','true')}));
   const asset=data.asset||a;const paths=assetPhotoPaths(asset,a.assetType,a.id);
   if(a.assetType==='boat'&&asset.media?.configured!==true){const content=data.siteContent?.fr||data.siteContent?.en||{};paths.push(...[content.boatHeroImage,...(Array.isArray(content.galleryImages)?content.galleryImages:[])].filter((v):v is string=>typeof v==='string'&&!!v));}
   this.clearPhotoPreviews();this.photos=[...new Set(paths)].map(raw=>{const path=mediaObjectPath(raw)||raw;return {path,preview:mediaObjectUrl(path)};});this.photosLoaded=true;
  }catch(e:any){this.error=this.wx('saveError')+' '+this.err(e);}finally{this.busy=false;}
 }
 async reloadImpact(){const a=this.editing||this.deleting;if(!a||this.busy)return;this.busy=true;this.impact=null;this.acknowledged=false;this.error='';try{this.impact=await firstValueFrom(this.http.get<any>(this.url(a)+'/impact',{headers:await this.auth.headers()}));}catch(e:any){this.error=this.err(e)||this.lx('loadFailed');}finally{this.busy=false;}}
 async commitListing(){
  if(this.editing){await this.saveWizard();return;}
  const a=this.deleting;if(!a||this.busy||!this.impact||((this.deleting||this.impact.active>0)&&!this.acknowledged))return;
  const removing=!!this.deleting;this.busy=true;this.error='';
  try{const body={revision:this.impact.revision,acknowledgeReservations:this.acknowledged,...(!removing?{listing:this.form}:{})};const options={headers:await this.auth.headers()};if(removing)await firstValueFrom(this.http.delete(this.url(a),{...options,body}));else await firstValueFrom(this.http.patch(this.url(a),body,options));this.closeEditor(true);this.message=this.lx(removing?'deleted':'saved');}
  catch(e:any){this.error=this.err(e);if(e?.status===409||e?.error?.error==='listing_changed_reload_required'){this.impact=null;this.acknowledged=false;}return;}
  finally{this.busy=false;}
  await this.refresh();
 }
 async create(){if(this.step<2){this.nextStep();return;}if(this.step===2){await this.saveWizard(true);return;}await this.finishWizard();}
 async finishWizard(){if(this.busy||this.documentBusy||!this.editing||(!this.adminScope&&!this.documentsReady))return;this.busy=true;this.error='';try{const fingerprint=this.documentsSummary?.fingerprint||'';if(!this.adminScope&&!this.documentsSummary?.approved&&(!fingerprint||fingerprint!==this.submittedDocumentFingerprint)){const scope=this.documentScope!;await firstValueFrom(this.http.post('/api/manage/assets/'+[scope.type,scope.id].map(encodeURIComponent).join('/')+'/documents/submit',{}, {headers:await this.auth.headers()}));this.submittedDocumentFingerprint=fingerprint;}if(!this.adminScope){this.step=4;this.wizardDirty=false;}else{this.closeEditor(true);this.message=this.wx('finishedWithDocuments');this.listingSaved.emit();}}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}if(this.creating&&this.step===4)await this.loadWizardStripe();else if(!this.creating)await this.refresh();}
 async saveWizard(keepOpen=false){
  if(this.busy)return;
  if(!this.photosLoaded){this.step=1;return;}
  if(!this.stepValid(0)){this.step=0;this.focusWizard();return;}
  if(!this.stepValid(2)){this.step=2;this.focusWizard();return;}
  if(this.editing&&(!this.impact||(this.impact.active>0&&!this.acknowledged))){this.step=2;return;}
  this.busy=true;this.error='';this.uploadProgress='';
  try{
   const headers=await this.auth.headers();
   if(!this.editing){
    const a=await firstValueFrom(this.http.post<any>('/api/owner/listings',sanitizedListingForm(this.form),{headers}));
    this.editing=a;this.rows.unshift(a);
    this.impact=await firstValueFrom(this.http.get<any>(this.url(a)+'/impact',{headers}));
   }
   const a=this.editing;
   for(let i=0;i<this.photos.length;i++){
    const photo=this.photos[i];if(!photo.file||photo.path)continue;
    this.uploadProgress=this.wx('uploading')+' '+(i+1)+' / '+this.photos.length;
    const data=new FormData();data.append('file',photo.file,photo.file.name);data.append('category',a.assetType==='boat'?'boat':'gallery');data.append('subject',a.id);data.append('resourceType',a.assetType);data.append('resourceId',a.id);
    const uploaded=await firstValueFrom(this.http.post<any>(MEDIA_ROUTES.upload,data,{headers}));
    if(!uploaded?.path)throw Error(this.wx('photoError'));photo.path=uploaded.path;
   }
   const listing={...sanitizedListingForm(this.form),...(this.photosDirty?{photos:this.photos.map(p=>p.path)}:{})};
   const saved=await firstValueFrom(this.http.patch<any>(this.url(a),{revision:this.impact.revision,acknowledgeReservations:this.acknowledged,listing},{headers}));
   if(this.form.prefix&&saved?.prefix!==this.form.prefix)throw Error(this.prefixText('Le serveur n’a pas confirmé l’enregistrement du préfixe. Mettez aussi le backend à jour puis réessayez.','The server did not confirm saving the prefix. Update the backend too, then retry.'));
   if(saved?.prefix)a.prefix=saved.prefix;
   if(keepOpen){this.photosDirty=false;this.wizardDirty=false;this.impact=null;this.documentsSummary=null;this.step=3;this.message=this.wx('draftBeforeDocuments');this.focusWizard();}else{this.closeEditor(true);this.message=this.wx('saved');if(this.adminScope)this.listingSaved.emit();}
  }catch(e:any){this.error=this.wx('saveError')+' '+this.err(e);if(e?.status===409){this.impact=null;this.acknowledged=false;}}
  finally{this.busy=false;this.uploadProgress='';}
  if(!this.creating)await this.refresh();
 }
 async action(a:any,kind:'checkout'|'portal'|'renewal'|'publication'|'reconcile'|'resubmit'){if(this.busy)return;this.busy=true;this.error='';try{const headers=await this.auth.headers();let result:any;if(kind==='publication'||kind==='resubmit')result=await firstValueFrom(this.http.patch(this.url(a)+'/publication',{published:kind==='resubmit'?true:a.published!==true},{headers}));else result=await firstValueFrom(this.http.post(this.url(a)+'/'+kind,kind==='renewal'?{cancelAtPeriodEnd:!a.billing?.cancelAtPeriodEnd}:{},{headers}));if(result?.url){const url=new URL(result.url);if(url.protocol!=='https:'||!['checkout.stripe.com','billing.stripe.com'].includes(url.hostname))throw Error('Lien Stripe invalide.');window.location.assign(url.href);return;}}catch(e:any){this.error=this.err(e);}finally{this.busy=false;}await this.refresh();}
 err(e:any){const code=e?.error?.error;if(code==='asset_prefix_unavailable'){if(!this.editing?.prefix){this.form.prefix='';this.step=0;this.prefixChanged(this.prefixInput);}return this.prefixText('Ce préfixe vient d’être pris. Choisissez une autre proposition.','This prefix is no longer available. Choose another suggestion.');}if(code==='asset_prefix_immutable')return this.prefixText('L’adresse de cette annonce est déjà définie. Actualisez la page.','This listing address is already set. Refresh the page.');if(code==='invalid_asset_prefix')return this.prefixText('Choisissez un préfixe disponible contenant au moins six lettres.','Choose an available prefix containing at least six letters.');if(code==='test_onboarding_requires_test_billing')return this.onb('billingError');if(code==='listing_changed_reload_required')return this.lx('changed');if(code==='listing_archived')return this.lx('notEditable');if(code==='asset_type_immutable')return this.lx('typeImmutable');if(code==='reservations_acknowledgement_required')return this.lx('acknowledge');return ({authentication_required:'Connectez-vous pour gérer vos annonces.',subscription_exists_use_manage:'Un abonnement existe déjà. Utilisez « Factures et paiement ».',subscription_confirmation_pending:'Paiement en cours de confirmation : actualisez dans quelques instants.',checkout_in_progress:'Une ouverture Stripe est déjà en cours. Réessayez dans quelques instants.',billing_return_url_required:'Le serveur doit configurer BILLING_RETURN_URL.',billing_mode_mismatch:'Le mode Stripe facturation a changé. Contactez l’administrateur.'} as Record<string,string>)[code]||(e?.error?.issues?.some((i:any)=>i.path?.[0]==='location')?'Indiquez la ville et le pays pour ce bien.':null)||e?.error?.message||code||e?.message||'Opération impossible.';}
}
