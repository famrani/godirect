import { Component } from '@angular/core';
import { ResourceContextService } from '../../services/resource-context.service';
@Component({selector:'app-resource-home',template:`<app-car-home *ngIf="type==='car'"></app-car-home><app-generic-asset-home *ngIf="type==='parking'" kind="parking"></app-generic-asset-home><app-generic-asset-home *ngIf="type==='property'" kind="property"></app-generic-asset-home><app-generic-asset-home *ngIf="type==='pool'" kind="pool"></app-generic-asset-home><app-home *ngIf="type==='boat'"></app-home>`,standalone:false})
export class ResourceHomeComponent { constructor(private ctx:ResourceContextService){} get type(){return this.ctx.resourceType;} }
