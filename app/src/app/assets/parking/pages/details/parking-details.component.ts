import {assetPhotoPaths} from '../../../../services/asset-photos';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceContextService } from '../../../../services/resource-context.service';
import { PrivateMediaService } from '../../../../services/private-media.service';

@Component({selector:'app-parking-details',templateUrl:'./parking-details.component.html',styleUrls:['./parking-details.component.scss'],standalone:false})
export class ParkingDetailsComponent implements OnInit {
 asset:any=null; error=''; images:string[]=[];
 readonly kind='parking'; readonly detailLabel='Le parking'; readonly eyebrow='Location de parking';
 constructor(private http:HttpClient, public ctx:ResourceContextService, private media:PrivateMediaService){}
 ngOnInit(){ this.http.get<any>(`/api/assets/${encodeURIComponent(this.ctx.resourceId)}`).subscribe({next:async a=>{this.asset=await this.media.resolveFirebaseTree(a);this.images=this.assetImages(this.asset);},error:()=>this.error='Ressource introuvable.'}); }
 get p(){return this.asset?.properties||{};} get price(){return this.asset?.pricing||{};}
 private assetImages(a:any):string[]{return assetPhotoPaths(a,this.ctx.resourceType,this.ctx.resourceId).map(path=>this.media.objectUrl(path));}
 get facts():string[]{
  return [this.p.secured?'Sécurisé':'Accès standard',this.p.cctv?'Vidéosurveillance':'Sans vidéosurveillance',this.p.evCharging?'Recharge électrique':'Sans recharge',`${this.p.widthM||'-'} × ${this.p.lengthM||'-'} m`,`${this.p.heightLimitM||'-'} m max`];
 }
}
