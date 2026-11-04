import { Component } from '@angular/core';
import { ResourceContextService } from '../../services/resource-context.service';
@Component({selector:'app-resource-booking',template:`<app-car-booking *ngIf="type==='car'"></app-car-booking><app-generic-asset-booking *ngIf="type==='parking'" kind="parking"></app-generic-asset-booking><app-generic-asset-booking *ngIf="type==='property'" kind="property"></app-generic-asset-booking><app-generic-asset-booking *ngIf="type==='pool'" kind="pool"></app-generic-asset-booking><app-generic-asset-booking *ngIf="type==='boat'" kind="boat"></app-generic-asset-booking>`,standalone:false})
export class ResourceBookingComponent { constructor(private ctx:ResourceContextService){} get type(){return this.ctx.resourceType;} }
