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
export function siteOrigin(a:any,id:string):string|null {
 const prefix=String(a?.prefix||id).toLowerCase();
 if(!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(prefix)||portalFor(prefix+'.godirect.fr')!=='asset')return null;
 return `https://${prefix}.godirect.fr`;
}
export async function matchesSite(store:any,host:string,type:string,id:string):Promise<boolean>{
 if(portalFor(host)!=='asset')return true;
 const scope=await domainScope(store,host);return scope?.assetType===type&&scope?.assetId===id;
}
export function installPortalPages(app:any,store:any){
 app.use((req:any,res:any,next:any)=>{if(req.path.startsWith('/api/platform/admin')&&!['admin','local'].includes(portalFor(String(req.headers.host||''))))return res.status(409).json({error:'admin_portal_required',origin:'https://admin.godirect.fr'});return next();});
 app.use(async(req:any,res:any,next:any)=>{try{
  if(portalFor(String(req.headers.host||''))!=='asset'||!req.path.startsWith('/api/'))return next();
  const scope=await domainScope(store,String(req.headers.host||''));
  const scoped=/^\/api\/assets\/(boat|car|property|parking|pool)\/([-\w]+)\/calendar$/.exec(req.path);
  if(scoped&&(scope?.assetType!==scoped[1]||scope?.assetId!==scoped[2]))return res.status(404).json({error:'asset_not_found'});
  if(!req.path.startsWith('/api/messaging/'))return next();
  const thread=/^\/api\/messaging\/threads\/([a-f0-9]{64})(?:\/|$)/.exec(req.path);
  if(thread){const t=(await store.db.ref(`messageThreads/${thread[1]}`).once('value')).val();if(!scope||t?.type!==scope.assetType||t?.assetId!==scope.assetId)return res.status(404).json({error:'message_not_found'});}
  if(req.path==='/api/messaging/contact'){const type=req.method==='GET'?req.query.type:req.body?.type,id=req.method==='GET'?req.query.assetId:req.body?.assetId;if(!scope||type!==scope.assetType||id!==scope.assetId)return res.status(404).json({error:'asset_not_found'});}
  if(req.method==='POST'&&req.path==='/api/messaging/threads'&&(!scope||req.body?.type!==scope.assetType||req.body?.assetId!==scope.assetId))return res.status(404).json({error:'asset_not_found'});
  if(req.method==='GET'&&['/api/messaging/contexts','/api/messaging/threads','/api/messaging/unread'].includes(req.path)){
   const send=res.json.bind(res),belongs=(t:any)=>!!scope&&t?.type===scope.assetType&&t?.assetId===scope.assetId;
   res.json=(data:any)=>{if(Array.isArray(data))return send(data.filter(belongs));if(Array.isArray(data?.latest)){const latest=data.latest.filter(belongs);return send({...data,latest,unreadThreads:latest.length,unreadMessages:latest.reduce((n:number,t:any)=>n+Number(t.count||0),0)});}return send(data);};
  }
  return next();
 }catch(e){next(e);}});
 app.get('/api/asset-site/:type/:id',async(req:any,res:any,next:any)=>{try{
  if(!types.includes(req.params.type)||!/^[-\w]{1,128}$/.test(req.params.id))return res.status(400).json({error:'invalid_asset_scope'});
  const a=(await store.db.ref(`assets/${req.params.type}/${req.params.id}`).once('value')).val();const origin=a&&!a.deletedAt?siteOrigin(a,req.params.id):null;
  return origin?res.json({origin}):res.status(404).json({error:'asset_site_not_found'});
 }catch(e){next(e);}});
 app.use(async(req:any,res:any,next:any)=>{try{
  if(req.method!=='GET'||req.path.startsWith('/api/')||/\.[a-z0-9]{1,6}$/i.test(req.path))return next();
  const host=String(req.headers.host||''),portal=portalFor(host);if(portal==='local')return next();
  const wanted=workspacePortal(req.path);
  if(wanted&&wanted!==portal&&!(wanted==='owner'&&portal==='owner'))return res.redirect(302,portalOrigin(wanted)+req.originalUrl);
  const match=/^\/(boat|car|property|parking|pool)\/([-\w]+)(\/.*)?$/.exec(req.path);
  if(match){const [,type,id,tail]=match;
   if(portal==='asset'){if(!await matchesSite(store,host,type,id))return res.status(404).type('text').send('Ce bien ne fait pas partie de ce site.');}
   else{const a=(await store.db.ref(`assets/${type}/${id}`).once('value')).val(),origin=a&&!a.deletedAt?siteOrigin(a,id):null;
    if(origin)return res.redirect(302,origin+(tail||'/home')+(req.originalUrl.includes('?')?'?'+req.originalUrl.split('?').slice(1).join('?'):''));}
  }
  return next();
 }catch(e){next(e);}});
}
