import {domainAssetId} from './asset-domain.js';
import {portalFor,workspacePortal,portalOrigin} from './portal-policy.js';
const types=['boat','car','property','parking','pool'];
export async function domainScope(store:any,host:string):Promise<any|null>{
 const slug=domainAssetId(host);if(!slug)return null;
 const alias=(await store.db.ref(`assetPrefixes/${slug}`).once('value')).val();
 if(alias&&types.includes(alias.assetType)&&typeof alias.assetId==='string'){
  const a=(await store.db.ref(`assets/${alias.assetType}/${alias.assetId}`).once('value')).val();
  return a&&!a.deletedAt?{assetType:alias.assetType,assetId:alias.assetId}:null;
 }
 const all=(await store.db.ref('assets').once('value')).val()||{};
 const matches=types.flatMap(type=>Object.entries<any>(all[type]||{}).filter(([id,a])=>a&&!a.deletedAt&&(id===slug||String(a.prefix||'').toLowerCase()===slug)).map(([id])=>({assetType:type,assetId:id})));
 return matches.length===1?matches[0]:null;
}
// Always derive preview ownership from the verified session, never from a supplied owner ID.
export async function customerScopeFilter(store:any,host:string,uid:string,preview:boolean):Promise<(row:any)=>boolean>{
 if(portalFor(host)==='asset'){
   const slug=domainAssetId(host);if(!slug||!uid)return ()=>false;
   const alias=(await store.db.ref('assetPrefixes/'+slug).once('value')).val();
   const all=(await store.db.ref('assets').once('value')).val()||{};
   const entries=types.flatMap(t=>Object.entries<any>(all[t]||{}).map(([id,a])=>({t,id,a})));
   const owners=new Set(entries.filter(x=>x.id===slug||x.a?.prefix===slug).map(x=>x.a?.ownerId).filter(Boolean));
   const anchor=all[alias?.assetType]?.[alias?.assetId];
   const owner=alias?(alias.ownerId&&(!anchor||anchor.ownerId===alias.ownerId)?alias.ownerId:null):owners.size===1?[...owners][0]:null;
   if(!owner)return ()=>false;
   const keys=new Set(entries.filter(x=>x.a?.ownerId===owner).map(x=>x.t+'/'+x.id));
   return row=>row.customerId===uid&&(row.ownerId?row.ownerId===owner:keys.has(row.assetType+'/'+row.assetId));
 }
 if(!preview)return ()=>true;
 if(!uid||!['owner','local'].includes(portalFor(host)))return ()=>false;
 const all=(await store.db.ref('assets').once('value')).val()||{};
 const keys=new Set(types.flatMap(t=>Object.entries<any>(all[t]||{}).filter(([,a])=>a?.ownerId===uid&&!a.deletedAt).map(([id])=>t+'/'+id)));
 return row=>keys.has(row.assetType+'/'+row.assetId);
}
export function siteOrigin(a:any,id:string):string|null {
 const type=a?.assetType||a?.type;
 return types.includes(type)&&/^[-\w]{1,128}$/.test(id)?'https://godirect.fr/'+type+'/'+id+'/home':null;
}
export async function matchesSite(store:any,host:string,type:string,id:string):Promise<boolean>{
 if(portalFor(host)!=='asset')return true;
 if(!types.includes(type)||!/^[-\w]{1,128}$/.test(id))return false;
 const slug=domainAssetId(host);if(!slug)return false;
 const [alias,asset]=await Promise.all(['assetPrefixes/'+slug,'assets/'+type+'/'+id].map(async p=>(await store.db.ref(p).once('value')).val()));
 if(alias?.ownerId)return !!asset&&!asset.deletedAt&&asset.ownerId===alias.ownerId;
 const scope=await domainScope(store,host);if(!scope||!asset?.ownerId||asset.deletedAt)return false;
 const anchor=(await store.db.ref('assets/'+scope.assetType+'/'+scope.assetId).once('value')).val();return asset.ownerId===anchor?.ownerId;
}
export function installPortalPages(app:any,store:any){
 app.use((req:any,res:any,next:any)=>{if(req.path.startsWith('/api/platform/admin')&&!['admin','local'].includes(portalFor(String(req.headers.host||''))))return res.status(409).json({error:'admin_portal_required',origin:'https://admin.godirect.fr'});return next();});
 app.use(async(req:any,res:any,next:any)=>{try{
  if(portalFor(String(req.headers.host||''))!=='asset'||!req.path.startsWith('/api/'))return next();
  const host=String(req.headers.host||'');
  const scoped=/^\/api\/assets\/(boat|car|property|parking|pool)\/([-\w]+)\/calendar$/.exec(req.path);
  if(scoped&&!await matchesSite(store,String(req.headers.host||''),scoped[1],scoped[2]))return res.status(404).json({error:'asset_not_found'});
  if(!req.path.startsWith('/api/messaging/'))return next();
  const thread=/^\/api\/messaging\/threads\/([a-f0-9]{64})(?:\/|$)/.exec(req.path);
  if(thread){const t=(await store.db.ref(`messageThreads/${thread[1]}`).once('value')).val();if(!await matchesSite(store,host,t?.type,t?.assetId))return res.status(404).json({error:'message_not_found'});}
  if(req.path==='/api/messaging/contact'){const type=req.method==='GET'?req.query.type:req.body?.type,id=req.method==='GET'?req.query.assetId:req.body?.assetId;if(!await matchesSite(store,host,type,id))return res.status(404).json({error:'asset_not_found'});}
  if(req.method==='POST'&&req.path==='/api/messaging/threads'&&(!await matchesSite(store,host,req.body?.type,req.body?.assetId)))return res.status(404).json({error:'asset_not_found'});
  if(req.method==='GET'&&['/api/messaging/contexts','/api/messaging/threads','/api/messaging/unread'].includes(req.path)){
   const slug=domainAssetId(host)!,alias=(await store.db.ref('assetPrefixes/'+slug).once('value')).val(), assets=(await store.db.ref('assets').once('value')).val()||{}, legacy=alias?.ownerId?null:await domainScope(store,host);
   const send=res.json.bind(res),belongs=(t:any)=>{const a=assets[t?.type]?.[t?.assetId];return !!a&&!a.deletedAt&&(alias?.ownerId?a.ownerId===alias.ownerId:!!legacy&&!!a.ownerId&&a.ownerId===assets[legacy.assetType]?.[legacy.assetId]?.ownerId);};
   res.json=(data:any)=>{if(Array.isArray(data))return send(data.filter(belongs));if(Array.isArray(data?.latest)){const latest=data.latest.filter(belongs);return send({...data,latest,unreadThreads:latest.length,unreadMessages:latest.reduce((n:number,t:any)=>n+Number(t.count||0),0)});}return send(data);};
  }
  return next();
 }catch(e){next(e);}});
 app.get('/api/asset-site/:type/:id',async(req:any,res:any,next:any)=>{try{
  if(!types.includes(req.params.type)||!/^[-\w]{1,128}$/.test(req.params.id))return res.status(400).json({error:'invalid_asset_scope'});
  const a=(await store.db.ref(`assets/${req.params.type}/${req.params.id}`).once('value')).val();const origin=a&&!a.deletedAt?siteOrigin({...a,assetType:req.params.type},req.params.id):null;
  return origin?res.json({origin}):res.status(404).json({error:'asset_site_not_found'});
 }catch(e){next(e);}});
 app.use(async(req:any,res:any,next:any)=>{try{
  if(req.method!=='GET'||req.path.startsWith('/api/')||req.path.startsWith('/__/')||/\.[a-z0-9]{1,6}$/i.test(req.path))return next();
  const host=String(req.headers.host||''),portal=portalFor(host);if(portal==='local')return next();
  const root='https://godirect.fr', path=req.path, query=req.originalUrl.slice(path.length);
  const wanted=workspacePortal(path);
  if(wanted==='admin'&&portal!=='admin')return res.redirect(302,'https://admin.godirect.fr'+req.originalUrl);
  if(portal==='admin'||portal==='concierge'||host.toLowerCase().replace(/:\d+$/,'').replace(/\.$/,'')==='owner.godirect.fr')return next();
  const short=/^\/b\/([a-z0-9][a-z0-9-]{0,62})\/?$/.exec(path);
  if(short)return res.redirect(302,'https://'+short[1]+'.godirect.fr/'+query);
  if(portal==='asset'&&/^\/account\/(bookings|login|signup|forgotpwd|accept-terms)\/?$/.test(path))return next();
  if(portal==='asset'){
   if(/^\/(?:espaces|(?:boat|car|property|parking|pool)\/[^/]+\/espaces)\/?$/.test(path))return res.redirect(302,'/');
   if(/^\/asset-calendar\/(?:boat|car|property|pool|parking)\/[-\w]+\/?$/.test(path))return next();
   if(/^\/owner\/(?:listings|customers|site-settings)(?:\/|$)/.test(path)||path==='/'||path==='/messages'||path==='/site-client'||path==='/account/ratings'||path==='/owner/activity/reservations'||path==='/owner/activity/ratings'||path==='/site-management')return next();
   const selected=/^\/(boat|car|property|pool|parking)\/([-\w]+)(?:\/|$)/.exec(path);
   if(selected)return await matchesSite(store,host,selected[1],selected[2])?next():res.sendStatus(404);
   const scope=await domainScope(store,host);
   if(!scope)return res.status(404).send('Annonce introuvable.');
   const base='/'+scope.assetType+'/'+scope.assetId;
   const global=/^\/(?:messages|account|legal|faq|contact|owner|concierge|asset-calendar)(?:\/|$)/.test(path);
   const target=global||path.startsWith(base+'/')?path:base+path;
   return res.redirect(302,root+target+query);
  }
  if(host.split(':')[0]!=='godirect.fr'){
   const target=path==='/'&&portal==='client'?'/locations':path;
   return res.redirect(302,root+target+query);
  }
  return next();
 }catch(e){next(e);}});
}
