import type {FirebaseService} from './firebase.service.js';
export const CONCIERGE_PERMISSIONS=['content','bookings','customers','payments'] as const;
export type ConciergePermission=typeof CONCIERGE_PERMISSIONS[number];
export function activeDelegation(root:any,uid:string,type:string,id:string):any|null{
 const a=root?.assets?.[type]?.[id],g=root?.assetDelegations?.[type]?.[id]?.[uid];
 return a&&!a.deletedAt&&g?.active===true&&g.conciergeId===uid&&g.ownerId===a.ownerId&&g.assetType===type&&g.assetId===id&&g.ownerId!==uid?g:null;
}
export function delegatedPermission(root:any,uid:string,type:string,id:string,permission:ConciergePermission):boolean{return activeDelegation(root,uid,type,id)?.permissions?.[permission]===true;}
export function platformManagement(root:any,uid:string,claims?:any):boolean{const p=root?.backendusers?.[uid]||{};return !!uid&&((claims?.uid===uid&&(claims.admin===true||claims.role==='admin'))||p.isAdmin===true||p.roles?.admin===true||['admin','superadmin'].includes(String(p.role||'').trim().toLowerCase()));}
export function assetPermission(root:any,uid:string,type:string,id:string,permission:ConciergePermission,claims?:any):boolean{const a=root?.assets?.[type]?.[id];return !!a&&((permission==='content'&&platformManagement(root,uid,claims))||a.ownerId===uid||(!a.deletedAt&&delegatedPermission(root,uid,type,id,permission)));}
export function delegatedAssets(root:any,uid:string):any[]{const out:any[]=[];for(const type of ['boat','car','property','parking','pool'])for(const [id,a]of Object.entries<any>(root?.assets?.[type]||{})){const g=activeDelegation(root,uid,type,id);if(g)out.push({id,coverImage:a.media?.cover||a.media?.hero||a.media?.gallery?.[0]||a.coverImage||null,assetType:type,createdAt:a.createdAt||null,location:{city:String(a.location?.city||''),area:String(a.location?.area||''),country:String(a.location?.country||'')},name:String(a.name||id),ownerId:a.ownerId,ownerName:String(root.backendusers?.[a.ownerId]?.displayName||root.backendusers?.[a.ownerId]?.email||a.ownerId),prefix:String(a.prefix||id),permissions:Object.fromEntries(CONCIERGE_PERMISSIONS.map(p=>[p,g.permissions?.[p]===true]))});}return out;}
export async function hasAssetPermission(store:FirebaseService,uid:string,type:string,id:string,permission:ConciergePermission,claims?:any):Promise<boolean>{
 const [asset,grant,profile]=await Promise.all([store.db.ref(`assets/${type}/${id}`).once('value'),store.db.ref(`assetDelegations/${type}/${id}/${uid}`).once('value'),store.db.ref(`backendusers/${uid}`).once('value')]);
 return assetPermission({backendusers:{[uid]:profile.val()},assets:{[type]:{[id]:asset.val()}},assetDelegations:{[type]:{[id]:{[uid]:grant.val()}}}},uid,type,id,permission,claims);
}
export function conciergeBookingView(b:any):any{const view={...b,managementPermissions:{financial:false}};if(view.workflow){view.workflow={...view.workflow};for(const field of ['depositPaidProof','balancePaidProof','warrantyProvidedProof'])if(view.workflow[field])view.workflow[field]={kind:view.workflow[field].kind};}delete view.warrantyConsent;delete view.checkoutOperations;delete view.warrantyCharges;return view;}
