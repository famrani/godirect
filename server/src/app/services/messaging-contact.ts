import {activeDelegation} from './asset-delegation.js';
export function customerConcierge(root:any,uid:string,type:string,assetId:string):boolean {
 const grant=activeDelegation(root,uid,type,assetId);return !!grant&&(grant.permissions?.customers===true||grant.permissions?.bookings===true);
}
export function assetMessageContacts(root:any,type:string,assetId:string):any[]{
 const a=root.assets?.[type]?.[assetId];if(!a||a.deletedAt||!a.ownerId)return [];
 const name=(uid:string,fallback:string)=>{const p=root.backendusers?.[uid]||{},g=root.assetDelegations?.[type]?.[assetId]?.[uid]||{};return String(p.displayName||g.displayName||[p.firstName||p.firstname,p.lastName||p.lastname].filter(Boolean).join(' ')||fallback);};
 const contacts=[{id:a.ownerId,role:'owner',name:name(a.ownerId,'Propriétaire')}];
 for(const uid of Object.keys(root.assetDelegations?.[type]?.[assetId]||{}).sort())if(customerConcierge(root,uid,type,assetId))contacts.push({id:uid,role:'concierge',name:name(uid,'Concierge')});return contacts;
}
export function defaultMessageContact(contacts:any[]):string {const concierges=contacts.filter(c=>c.role==='concierge');return (concierges.length===1?concierges[0]:contacts[0])?.id||'';}
