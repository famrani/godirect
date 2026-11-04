import {createHash} from 'node:crypto';
const terminal=new Set(['cancelled','canceled','rejected','refused','completed','finished']);
function stable(v:any):string {if(Array.isArray(v))return '['+v.map(stable).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+stable(v[k])).join(',')+'}';return JSON.stringify(v)??'null';}
/** Both booking stores are read: legacy boats can still have R22.4 reservations. No customer data leaves this helper. */
export function listingImpact(asset:any,canonical:any,legacy:any,billing:any,type:string,id:string){
 const rows=new Map<string,any>();const scopedLegacy:Record<string,any>={};
 for(const [key,b]of Object.entries<any>(canonical||{}))if(b)rows.set(String(b.id||key),b);
 if(type==='boat')for(const [key,b]of Object.entries<any>(legacy||{}))if(b&&String(b.assetId||b.boatId||'alegria')===id&&(!b.assetType||b.assetType==='boat')){const k=String(b.id||key);scopedLegacy[key]=b;const existing=rows.get(k);if(!existing||terminal.has(String(existing.status||'').toLowerCase())&&!terminal.has(String(b.status||'').toLowerCase()))rows.set(k,b);}
 const bookings=[...rows.values()];
 const active=bookings.filter(b=>!terminal.has(String(b.status||'').toLowerCase())||['refund_pending','refund_failed','review_required'].includes(b.cancellation?.status));
 const pending=active.filter(b=>!['confirmed','approved'].includes(String(b.status||'').toLowerCase()));
 return {pending:pending.length,confirmed:active.length-pending.length,active:active.length,total:bookings.length,subscriptionContinues:!!billing&&!['canceled','incomplete_expired'].includes(billing.status),revision:createHash('sha256').update(stable({asset,canonical:canonical||{},legacy:scopedLegacy,billing:billing||null})).digest('hex')};
}
