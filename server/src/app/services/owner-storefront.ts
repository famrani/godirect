import {listingPublic} from './listing-billing.service.js';
import {domainAssetId} from './asset-domain.js';
const types=['boat','car','pool','property','parking'];
const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]!));
export function installOwnerStorefront(app:any,store:any){
 app.use(async(req:any,res:any,next:any)=>{try{
  if(!['GET','HEAD'].includes(req.method))return next();
  const slug=domainAssetId(req.hostname), path=req.path;
  if(!slug)return next();
  if(path==='/')return next();
  if(path!=='/api/site-home'&&path!=='/contact'&&!path.startsWith('/bien/'))return next();
  res.set('Cache-Control','no-store');
  const read=async(p:string)=>(await store.db.ref(p).once('value')).val();
  const [assets,alias]=await Promise.all([read('assets'),read('assetPrefixes/'+slug)]);
  const all=types.flatMap(type=>Object.entries<any>(assets?.[type]||{}).map(([id,a])=>({id,type,a})));
  const anchor=alias&&assets?.[alias.assetType]?.[alias.assetId];
  const owners=new Set(all.filter(x=>x.id===slug||x.a.prefix===slug).map(x=>x.a.ownerId).filter(Boolean));
  const uid=alias?(alias.ownerId&&(!anchor||anchor.ownerId===alias.ownerId)?alias.ownerId:anchor?.ownerId===alias.ownerId?anchor?.ownerId:null):owners.size===1?[...owners][0]:null;
  if(!uid)return res.status(404).send('Site introuvable.');
  const page=(title:string,body:string)=>res.type('html').send(`<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · ${esc(slug)}</title><style>body{margin:0;background:#f8f6f1;color:#173b36;font:1rem/1.6 system-ui}header,main,footer{max-width:66rem;margin:auto;padding:1rem}header,footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1rem;border-bottom:1px solid #d2dcd4}a{color:#165853}article{background:white;border-radius:12px;padding:1.2rem}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:1rem}nav{display:flex;flex-wrap:wrap;gap:1rem}main{min-height:55vh}p{white-space:pre-line}</style><header><a href="/"><strong>${esc(slug)}</strong></a><nav><a href="/">Les biens</a><a href="/account/bookings">Mes réservations</a><a href="/contact">Contact</a></nav></header><main><h1>${esc(title)}</h1>${body}</main><footer><span>© ${new Date().getFullYear()} ${esc(slug)}.godirect.fr powered by <a href="https://godirect.fr">GoDirect.fr</a></span><nav><a href="https://godirect.fr/legal">Conditions générales</a><a href="https://godirect.fr/faq">FAQ</a><a href="/contact">Nous contacter</a></nav></footer></html>`);
  if(path==='/contact'){const c=await read('owners/'+uid+'/publicContact')||{};
   const lines=[c.email&&`<p>Email : <a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p>`,c.phone&&`<p>Téléphone : <a href="tel:${esc(String(c.phone).replace(/[^0-9+]/g,''))}">${esc(c.phone)}</a></p>`,c.address&&`<p>Adresse : ${esc(c.address)}</p>`].filter(Boolean);
   return page('Contacter le propriétaire',lines.join('')||'<p>Le propriétaire n’a pas encore publié ses coordonnées.</p>');}
  const rows=all.filter(x=>x.a.ownerId===uid&&!x.a.deletedAt);
  const photo=(a:any)=>{const raw=a.media?.cover||a.media?.gallery?.[0],v=typeof raw==='string'?raw:raw?.path||'';return typeof v==='string'&&/^assets\/[\w/ .-]+$/.test(v)&&!v.includes('..')?'<img loading="lazy" alt="" style="width:100%;max-height:20rem;object-fit:cover;border-radius:8px" src="/api/media/object?path='+esc(encodeURIComponent(v))+'">':'';};
  const detail=(x:any)=>'/bien/'+encodeURIComponent(x.type)+'/'+encodeURIComponent(x.id);
  if(path==='/api/site-home'){const home=await read('owners/'+uid+'/siteHome')||{};const cards=await Promise.all(rows.map(async x=>{if(!await listingPublic(store,x.type,x.id,x.a))return null;const image=photo(x.a).match(/src="([^"]+)"/)?.[1];return {name:x.a.name,city:x.a.location?.city||'',headline:x.a.headline||'',image:image||'',base:'/'+encodeURIComponent(x.type)+'/'+encodeURIComponent(x.id),type:x.type,id:x.id};}));return res.json({title:home.title||slug,intro:home.intro||'',cards:cards.filter(Boolean)});}
  const x=rows.find(r=>detail(r)===path);if(!x||!await listingPublic(store,x.type,x.id,x.a))return res.sendStatus(404);
  return page(x.a.name,`<article>${photo(x.a)}<p>${esc(x.a.description)}</p><a href="/${encodeURIComponent(x.type)}/${encodeURIComponent(x.id)}/home">Disponibilités et réservation sur GoDirect</a></article>`);
 }catch(e){next(e);}});
}
