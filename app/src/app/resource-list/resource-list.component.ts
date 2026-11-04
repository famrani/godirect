import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceRegistryService, ResourceRegistryItem } from '../services/resource-registry.service';
import { validAssetType } from '../services/boat-routing';

@Component({ standalone:false,selector: 'app-resource-list', templateUrl: './resource-list.component.html', styleUrls: ['./resource-list.component.scss'] })
export class ResourceListComponent implements OnInit {
  type = ''; items: Array<ResourceRegistryItem & {resourceId:string;resourceType:string}> = []; loading = true; error=false; filters:any={};
  constructor(public registry: ResourceRegistryService, private route: ActivatedRoute, private router: Router) {}
  async ngOnInit() {
    this.type = (this.route.snapshot.paramMap.get('assetType') || this.route.snapshot.data['assetType'] || '').toLowerCase();
    if (!validAssetType(this.type)) { this.router.navigate(['/']); return; }
    const q=this.route.snapshot.queryParamMap;this.filters={type:this.type,location:q.get('location')||undefined,startAt:q.get('startAt')||undefined,endAt:q.get('endAt')||undefined};try{this.items=await this.registry.search(this.filters);}catch{this.error=true;}finally{this.loading=false;}
  }
  open(item: any) { this.router.navigate(['/', this.type, item.resourceId, 'home'],{queryParams:this.filters}); }
  back() { this.router.navigate(['/'],{queryParams:this.filters}); }
}
