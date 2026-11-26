import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ReservationAuthService} from './reservation-auth.service';
import {portalFor} from './portal-policy';
import {mediaObjectUrl} from './media-routes';
export function portfolioCover(a:any){const raw=a?.media?.cover||a?.media?.hero||a?.media?.gallery?.[0]||a?.coverImage;const s=typeof raw==='string'?raw:raw?.url||raw?.path||'';return mediaObjectUrl(s)||(/^https:\/\//.test(s)||/^\/?assets\//.test(s)?s:'');}
@Injectable({providedIn:'root'})export class ManagementEntryService{
 constructor(private http:HttpClient,private auth:ReservationAuthService){}
 async open(a:any,role:'owner'|'concierge'){const tab=window.open('about:blank','_blank');if(!tab)throw Error('popup_blocked');try{tab.opener=null;tab.document.title='GoDirect';tab.document.body.textContent='Ouverture du site…';const r=await firstValueFrom(this.http.post<any>('/api/management-entry',{type:a.assetType,id:a.id,role},{headers:await this.auth.headers()}));
 const origin=new URL(r.origin);if(origin.protocol!=='https:'||portalFor(origin.hostname)!=='asset')throw Error('Site indisponible');
 if(tab.closed)return;const doc=tab.document;const f=doc.createElement('form');f.method='post';f.action=window.location.origin+'/api/management-departure';const i=doc.createElement('input');i.type='hidden';i.name='code';i.value=r.code;f.append(i);doc.body.append(f);f.submit();}catch(e){tab.close();throw e;}}
}
