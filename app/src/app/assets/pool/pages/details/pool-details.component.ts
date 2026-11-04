import {assetPhotoPaths} from '../../../../services/asset-photos';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../../../services/resource-context.service';
import { PrivateMediaService } from '../../../../services/private-media.service';

@Component({selector:'app-pool-details',templateUrl:'./pool-details.component.html',styleUrls:['./pool-details.component.scss'],standalone:false})
export class PoolDetailsComponent implements OnInit {
 asset:any=null; error=''; images:string[]=[];
 readonly kind='pool'; readonly detailLabel='La piscine'; readonly eyebrow='Location de piscine';
 constructor(private http:HttpClient, public ctx:ResourceContextService, private media:PrivateMediaService){}
 ngOnInit(){ this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({next:async a=>{this.asset=await this.media.resolveFirebaseTree(a);this.images=this.assetImages(this.asset);},error:()=>this.error='Ressource introuvable.'}); }
 get p(){return this.asset?.properties||{};} get price(){return this.asset?.pricing||{};}
 private assetImages(a:any):string[]{return assetPhotoPaths(a,this.ctx.resourceType,this.ctx.resourceId).map(path=>this.media.objectUrl(path));}
 get facts():string[]{
  return [`${this.p.lengthM||'-'} × ${this.p.widthM||'-'} m`,`${this.p.capacity||'-'} personnes`,this.p.heated?'Chauffée':'Non chauffée',this.p.indoor?'Intérieure':'Extérieure'];
 }
}
