import {Component,EventEmitter,Output} from '@angular/core';import {CommonModule} from '@angular/common';import {Router,RouterModule} from '@angular/router';
import {AssetAccessService} from '../services/asset-access.service';import {LanguageService} from '../services/language.service';import {HomeRole,homeRolesCopy} from './home-roles.text';
@Component({selector:'app-home-roles',standalone:true,imports:[CommonModule,RouterModule],templateUrl:'./home-roles.component.html',styleUrls:['./home-roles.component.scss']})
export class HomeRolesComponent{
 @Output() publishAsset=new EventEmitter<void>();readonly roles:HomeRole[]=['customer','assetOwner','concierge'];selected:HomeRole='concierge';
 constructor(public access:AssetAccessService,public language:LanguageService,private router:Router){}
 get copy(){return homeRolesCopy(this.language.currentLanguage);}get journey(){return this.copy.roles[this.selected];}
 select(role:HomeRole){if(this.roles.includes(role))this.selected=role;}
 explore(){if(typeof document!=='undefined')document.getElementById('how-roles')?.scrollIntoView({behavior:typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
 joinConcierge(){if(this.access.isAuthenticated){void this.router.navigate(['/concierge']);return;}try{localStorage.removeItem('redirectAfterLogin');sessionStorage.setItem('redirectAfterLogin','/concierge');}catch{}void this.router.navigate(['/account/signup'],{queryParams:{returnUrl:'/concierge'}});}
}
