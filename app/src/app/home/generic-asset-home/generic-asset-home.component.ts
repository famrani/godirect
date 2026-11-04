import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../services/resource-context.service';
@Component({selector:'app-generic-asset-home',templateUrl:'./generic-asset-home.component.html',styleUrls:['./generic-asset-home.component.scss'],standalone:false})
export class GenericAssetHomeComponent implements OnInit {
 @Input() kind:'parking'|'property'='parking'; asset:any=null; error='';
 constructor(private http:HttpClient, public ctx:ResourceContextService){}
 ngOnInit(){this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({next:a=>this.asset=a,error:()=>this.error='Ressource introuvable.'});}
 get p(){return this.asset?.properties||{};} get price(){return this.asset?.pricing||{};}
 get isParking(){return this.kind==='parking';}
}
