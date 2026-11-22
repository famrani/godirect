import { Pipe, PipeTransform } from '@angular/core';
import { boatPath } from './boat-routing';

@Pipe({ name: 'resourceRoute', standalone: true })
export class ResourceRoutePipe implements PipeTransform {
  transform(value: string | any[] | null | undefined): string {
    if (value == null) return boatPath('/home');
    let route: string;
    if (Array.isArray(value)) {
      route = '/' + value.map(v => String(v ?? '').replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
    } else {
      route = String(value);
    }
    if (/^(?:https?:|mailto:|tel:|javascript:)/i.test(route) || route.startsWith('#')) return route;
    if (/^\/(?:boat|property|parking|car|pool)\/[a-z0-9][a-z0-9_-]*(?:\/|$)/i.test(route)) return route;
    if(/^\/(account|owner|platform)(?:[/?#]|$)/.test(route))return route;
    if(typeof window!=='undefined'&&window.location.pathname.startsWith('/account/'))return route==='/home'?'/':`/account${route}`;
    return boatPath(route || '/home');
  }
}
