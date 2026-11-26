import {assetDomainSlug} from '../services/asset-domain';
import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';import {FormsModule,NgForm} from '@angular/forms';import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';
import {PlatformLayoutComponent} from '../layout/platform-layout/platform-layout.component';import {LanguageService} from '../services/language.service';import {SiteContentService} from '../home/site-content-service/site-content.service';import {CONTACT_TEXT} from './contact-page.text';
@Component({standalone:true,imports:[CommonModule,FormsModule,PlatformLayoutComponent],templateUrl:'./contact-page.component.html',styleUrls:['./contact-page.component.scss']})
export class ContactPageComponent implements OnInit{
 readonly email='famrani@alldigitalnetwork.com';readonly phone='+33685266510';uiContent:any;busy=false;sent=false;error='';form={name:'',email:'',topic:'general',message:'',website:''};
 constructor(private http:HttpClient,public language:LanguageService,private content:SiteContentService){}
 ngOnInit(){if(typeof location!=='undefined' && assetDomainSlug(location.hostname)){location.replace('/contact?ngsw-bypass=true');return;}void this.content.getContent().then(c=>this.uiContent=c).catch(()=>{});}
 t(key:string){const lang=this.language.currentLanguage;return this.content.tFromContent(this.uiContent,'ui.contact.'+key,lang,CONTACT_TEXT[lang]?.[key]||CONTACT_TEXT.en[key]);}
 async submit(form:NgForm){if(this.busy||form.invalid)return;this.busy=true;this.sent=false;this.error='';try{const result=await firstValueFrom(this.http.post<{ok:boolean}>('/api/contact',{...this.form,language:this.language.currentLanguage}));if(!result?.ok)throw Error('send_failed');this.sent=true;this.form.message='';form.form.markAsPristine();}catch(e:any){this.error=e?.status===429?'rateLimit':e?.status===503?'unavailable':'error';}finally{this.busy=false;}}
}
