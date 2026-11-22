import {Injectable} from '@angular/core';import {HttpClient} from '@angular/common/http';import {firstValueFrom} from 'rxjs';import {ReservationAuthService} from './reservation-auth.service';import {LanguageService} from './language.service';
@Injectable({providedIn:'root'})export class LegalService{
 constructor(private http:HttpClient,private auth:ReservationAuthService,private language:LanguageService){}
 content():Promise<any>{return firstValueFrom(this.http.get('/api/public-content',{params:{language:this.language.currentLanguage}}));}
 catalog(role='customer'):Promise<any>{return firstValueFrom(this.http.get('/api/legal/catalog',{params:{role,language:this.language.currentLanguage}}));}
 async status(role='customer'):Promise<any>{return firstValueFrom(this.http.get('/api/me/legal',{headers:await this.auth.headers(),params:{role,language:this.language.currentLanguage}}));}
 async accept(catalog:any,name:string,adult:boolean):Promise<any>{if(catalog.language!==this.language.currentLanguage)throw Object.assign(new Error('legal_language_changed_reload'),{status:409});return firstValueFrom(this.http.post('/api/me/legal/accept',{role:catalog.role,language:catalog.language,bundleHash:catalog.bundleHash,documents:catalog.documents.map((d:any)=>({id:d.id,version:d.version,sha256:d.sha256,revisionKey:d.revisionKey})),signerName:name,adultConfirmed:adult,accepted:true},{headers:await this.auth.headers()}));}
 async ensure(){try{await this.auth.user();}catch{return null;}const roles:any=await firstValueFrom(this.http.get('/api/me/roles',{headers:await this.auth.headers()}));if(roles.roles?.includes('admin')||roles.isAdmin===true)return null;const role=roles.roles?.includes('concierge')?'concierge':roles.roles?.includes('assetOwner')?'assetOwner':'customer';return{...await this.status(role),role};}
 async receipt(hash:string):Promise<any>{return firstValueFrom(this.http.get('/api/me/legal/receipts/'+hash,{headers:await this.auth.headers()}));}
}
