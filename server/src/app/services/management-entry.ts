import {randomBytes} from 'node:crypto';
import {matchesSite} from './portal-sites.js';
import {activeDelegation} from './asset-delegation.js';
import {isAssetType} from './asset-paths.service.js';
import {portalFor} from './portal-policy.js';
export function installManagementEntry(app:any,store:any,formParser:any){
 const codes=new Map<string,{type:string,id:string,uid:string,origin:string,source:string,expires:number}>();
 const wrap=(fn:any)=>(q:any,s:any,n:any)=>{s.set('Cache-Control','no-store');Promise.resolve(fn(q,s)).catch(n);};
 app.post('/api/management-entry',wrap(async(q:any,s:any)=>{
 const host=q.hostname,source='https://'+host;
 if(!['owner','concierge'].includes(portalFor(host))||q.headers.origin!==source)return s.sendStatus(403);
 const token=/^Bearer (.+)$/.exec(q.headers.authorization||'')?.[1];let user;try{user=await store.auth.verifyIdToken(token,true);}catch{return s.sendStatus(401);}
 const {type,id,role}=q.body;if(!isAssetType(type)||typeof id!=='string'||!/^[-\w]{1,128}$/.test(id))return s.sendStatus(400);
 const val=async(p:string)=>(await store.db.ref(p).once('value')).val();
 const a=await val('assets/'+type+'/'+id);if(!a||a.deletedAt)return s.sendStatus(404);
 const grant=role==='concierge'?await val('assetDelegations/'+type+'/'+id+'/'+user.uid):null;
 if(!(role==='owner'&&a.ownerId===user.uid||role==='concierge'&&activeDelegation({assets:{[type]:{[id]:a}},assetDelegations:{[type]:{[id]:{[user.uid]:grant}}}},user.uid,type,id)))return s.sendStatus(403);
 const prefix=String(a.prefix||'').toLowerCase();
 if(!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(prefix))return s.sendStatus(404);
 const destHost=prefix+'.godirect.fr',origin='https://'+destHost;
 if(portalFor(destHost)!=='asset'||!await matchesSite(store,destHost,type,id))return s.sendStatus(409);
 for(const [k,c] of codes)if(c.expires<Date.now())codes.delete(k);
 if(codes.size>=2000)return s.sendStatus(429);
 const code=randomBytes(32).toString('hex');codes.set(code,{type,id,uid:user.uid,origin,source,expires:Date.now()+60000});return s.json({origin,code});}));
 // Use a same-origin departure document with an explicit origin-only policy.
 // A cross-origin form from a no-referrer document can otherwise send Origin: null.
 app.post('/api/management-departure',formParser,wrap(async(q:any,s:any)=>{
 const k=q.body?.code,c=codes.get(k),src='https://'+q.hostname;
 if(!c||c.expires<Date.now()||c.source!==src||!['owner','concierge'].includes(portalFor(q.hostname))||
 !(q.headers.origin===src||q.headers['sec-fetch-site']==='same-origin'))return s.status(403).send('Départ indisponible. Rouvrez le site depuis Mes biens.');
 const dest=new URL(c.origin);if(dest.protocol!=='https:'||!/^[-a-z0-9]+\.godirect\.fr$/.test(dest.host)||portalFor(dest.hostname)!=='asset')return s.sendStatus(403);
 const nonce=randomBytes(16).toString('hex');
 s.set('Referrer-Policy','strict-origin');s.set('Content-Security-Policy',"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action "+dest.origin+"; script-src 'nonce-"+nonce+"'");
 return s.type('html').send('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="referrer" content="strict-origin"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ouverture du site</title><form method="post" action="'+dest.origin+'/api/management-arrival"><input type="hidden" name="code" value="'+k+'"><button>Continuer vers mon site</button></form><script nonce="'+nonce+'">document.forms[0].submit()</script></html>');}));
 app.post('/api/management-arrival',formParser,wrap(async(q:any,s:any)=>{
 const k=q.body?.code,c=codes.get(k);if(!c||c.expires<Date.now())return s.status(403).send('Lien expiré ou déjà utilisé. Rouvrez le site depuis Mes biens.');
 if(q.headers.origin!==c.source)return s.status(403).send('Origine du portail non reconnue. Rouvrez le site depuis Mes biens.');
 if('https://'+q.hostname!==c.origin)return s.status(403).send('Ce lien correspond à un autre site. Revenez à Mes biens.');
 codes.delete(k);const next=randomBytes(32).toString('hex');codes.set(next,{...c,source:c.origin,expires:Date.now()+60000});
 s.cookie('__Host-gd-entry',next,{httpOnly:true,secure:true,sameSite:'strict',path:'/',maxAge:60000});return s.redirect(303,'/site-management?type='+encodeURIComponent(c.type)+'&id='+encodeURIComponent(c.id));}));
 app.post('/api/management-session',wrap(async(q:any,s:any)=>{
 const k=/(?:^|;\s*)__Host-gd-entry=([a-f0-9]{64})(?:;|$)/.exec(q.headers.cookie||'')?.[1]||'',c=codes.get(k);
 if(!c||c.expires<Date.now()||q.headers.origin!==c.origin||'https://'+q.hostname!==c.origin||c.source!==c.origin)return s.sendStatus(401);
 codes.delete(k);s.clearCookie('__Host-gd-entry',{secure:true,httpOnly:true,sameSite:'strict',path:'/'});return s.json({token:await store.auth.createCustomToken(c.uid)});}));
}
