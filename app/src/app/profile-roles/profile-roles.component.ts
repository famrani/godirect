import {Component,Input,OnInit,OnChanges,OnDestroy,SimpleChanges} from '@angular/core';import {CommonModule} from '@angular/common';import {HttpClient} from '@angular/common/http';import {firstValueFrom,timeout} from 'rxjs';
import {ReservationAuthService} from '../services/reservation-auth.service';import {AssetAccessService} from '../services/asset-access.service';import {LanguageService} from '../services/language.service';import {accountHeaderText} from '../services/account-header';
@Component({selector:'app-profile-roles',standalone:true,imports:[CommonModule],templateUrl:'./profile-roles.component.html',styleUrls:['./profile-roles.component.scss']})
export class ProfileRolesComponent implements OnInit,OnChanges,OnDestroy{
 @Input() refreshKey='';uid='';roles:string[]=[];primaryRole='';loading=false;error=false;private sequence=0;
 constructor(private http:HttpClient,private auth:ReservationAuthService,public access:AssetAccessService,public language:LanguageService){}
 t(key:string){return accountHeaderText(this.language.currentLanguage,key);}
 label(role:string){return this.t(({customer:'client',assetOwner:'assetOwnerRole',concierge:'concierge',admin:'admin'} as Record<string,string>)[role]||role);}
 ngOnInit(){void this.refresh();}ngOnChanges(changes:SimpleChanges){if(changes['refreshKey']&&!changes['refreshKey'].firstChange)void this.refresh();}ngOnDestroy(){this.sequence++;this.roles=[];this.primaryRole='';}
 async refresh(){const sequence=++this.sequence;this.loading=true;this.error=false;this.roles=[];this.primaryRole='';try{const uid=(await this.auth.user()).uid;this.uid=uid;const data=await firstValueFrom(this.http.get<any>('/api/me/roles',{headers:await this.auth.headers()}).pipe(timeout(10000)));if(sequence!==this.sequence||(await this.auth.user()).uid!==uid||data.uid!==uid)return;const allowed=['customer','assetOwner','concierge','admin'];this.roles=Array.isArray(data.roles)?[...new Set<string>(data.roles.filter((r:any)=>allowed.includes(r)))]:[];this.primaryRole=this.roles.includes(data.primaryRole)?data.primaryRole:this.roles[0]||'';}catch{if(sequence===this.sequence)this.error=true;}finally{if(sequence===this.sequence)this.loading=false;}}
}
