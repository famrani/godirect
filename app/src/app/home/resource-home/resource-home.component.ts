import { Component } from '@angular/core';
import { ResourceContextService } from '../../services/resource-context.service';
@Component({selector:'app-resource-home',template:`<app-simple-listing [assetType]="type" [assetId]="id"></app-simple-listing>`,standalone:false})
export class ResourceHomeComponent { constructor(private ctx:ResourceContextService){} get id(){return this.ctx.resourceId;} get type(){return this.ctx.resourceType;} }
