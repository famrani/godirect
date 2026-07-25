import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { BoatContextService } from '../services/boat-context.service';

@Injectable({ providedIn: 'root' })
export class BoatContextGuard implements CanActivate {
  constructor(private boatContext: BoatContextService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const boatId = route.paramMap.get('boatId');
    if (boatId) this.boatContext.setBoatId(boatId);
    return true;
  }
}
