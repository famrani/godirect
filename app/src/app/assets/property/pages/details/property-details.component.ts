import {assetPhotoPaths} from '../../../../services/asset-photos';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../../../services/resource-context.service';
import { PrivateMediaService } from '../../../../services/private-media.service';

@Component({selector:'app-property-details',templateUrl:'./property-details.component.html',styleUrls:['./property-details.component.scss'],standalone:false})
export class PropertyDetailsComponent implements OnInit {
 asset:any=null; error=''; images:string[]=[];
 readonly kind='property'; readonly detailLabel='Le logement'; readonly eyebrow='Location de logement';
 constructor(private http:HttpClient, public ctx:ResourceContextService, private media:PrivateMediaService){}
 ngOnInit(){ this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({next:async a=>{this.asset=await this.media.resolveFirebaseTree(a);this.images=this.assetImages(this.asset);},error:()=>this.error='Ressource introuvable.'}); }
 get p(){return this.asset?.properties||{};} get price(){return this.asset?.pricing||{};}
 private assetImages(a:any):string[]{return assetPhotoPaths(a,this.ctx.resourceType,this.ctx.resourceId).map(path=>this.media.objectUrl(path));}
 get facts():string[]{
  return [`${this.p.bedrooms||'-'} chambres`,`${this.p.beds||'-'} lits`,`${this.p.bathrooms||'-'} salles de bain`,`${this.p.guests||'-'} voyageurs`,`${this.p.surfaceM2||'-'} m²`];
 }
}
