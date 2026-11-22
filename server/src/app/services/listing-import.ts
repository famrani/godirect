import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {Request,Response} from 'express';
import {FirebaseService} from './firebase.service.js';
import {requireUser} from './stripe-auth.service.js';
const fail=(status:number,error:string)=>Object.assign(new Error(error),{status});
const suffix=(host:string,root:string)=>host===root||host.endsWith('.'+root);
export function listingUrl(raw:unknown){
 let u:URL;try{u=new URL(String(raw));}catch{throw fail(400,'import_invalid_url');}
 if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443')||u.href.length>2048)throw fail(400,'import_invalid_url');
 const h=u.hostname.toLowerCase();let provider='';
 if(suffix(h,'clickandboat.com'))provider='clickandboat';
 if(['airbnb.com','airbnb.fr','airbnb.co.uk','airbnb.es','airbnb.it','airbnb.de'].some(x=>suffix(h,x)))provider='airbnb';
 if(suffix(h,'booking.com'))provider='booking';
 if(suffix(h,'lacentrale.fr'))provider='lacentrale';
 if(suffix(h,'leboncoin.fr'))provider='leboncoin';
 if(suffix(h,'seloger.com'))provider='seloger';
 if(!provider)throw fail(400,'import_unsupported_provider');
 if(provider==='airbnb'&&!/^\/rooms\/[0-9]+(?:\/|$)/.test(u.pathname))throw fail(400,'import_listing_url_required');
 if(provider==='booking'&&!/^\/hotel\//.test(u.pathname))throw fail(400,'import_listing_url_required');
 if(provider==='clickandboat'&&(u.pathname==='/'||u.pathname.length<12))throw fail(400,'import_listing_url_required');
 if(provider==='lacentrale'&&!/^\/auto-occasion-annonce-[0-9]+\.html$/.test(u.pathname))throw fail(400,'import_listing_url_required');
 if(provider==='leboncoin'&&!/^\/(?:ad\/)?[a-z_]+\/[0-9]+(?:\.htm)?\/?$/.test(u.pathname))throw fail(400,'import_listing_url_required');
 if(provider==='seloger'&&!/^\/annonces\/(?:locations|location|achat|vente|locations-vacances)\/.+\/[0-9]+\.htm(?:l)?\/?$/.test(u.pathname))throw fail(400,'import_listing_url_required');
 let assetType=provider==='clickandboat'?'boat':provider==='lacentrale'?'car':'property';
 if(provider==='leboncoin'){const category=u.pathname.split('/').filter(Boolean)[u.pathname.startsWith('/ad/')?1:0];if(category==='voitures')assetType='car';else if(['nautisme','locations_de_bateaux'].includes(category))assetType='boat';else if(['parkings','parking'].includes(category))assetType='parking';}
 if(provider==='seloger'&&/\/(?:parking|parkings|garage|garages)(?:\/|$)/i.test(u.pathname))assetType='parking';
 u.search='';u.hash='';return{url:u,provider,assetType};
}
export function publicIpv4(ip:string){const v=ip.split('.').map(Number);if(v.length!==4||v.some(n=>!Number.isInteger(n)||n<0||n>255))return false;const[a,b,c]=v;return !(a===0||a===10||a===127||a>=224||(a===100&&b>=64&&b<=127)||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&(b===168||b===0||b===88))||(a===198&&(b===18||b===19||(b===51&&c===100)))||(a===203&&b===0&&c===113));}
const mediaRoots=['static1.clickandboat.com','static2.clickandboat.com','static3.clickandboat.com','cdn.clickandboat.com','images.clickandboat.com','a0.muscache.com','a1.muscache.com','a2.muscache.com','cf.bstatic.com','photo.lacentrale.fr','img.leboncoin.fr','v.seloger.com','mms.seloger.com'];
export function photoUrl(raw:unknown){let u:URL;try{u=new URL(String(raw));}catch{throw fail(400,'import_invalid_photo');}if(u.protocol!=='https:'||u.username||u.password||(u.port&&u.port!=='443')||u.href.length>4096||!mediaRoots.includes(u.hostname))throw fail(400,'import_invalid_photo');return u;}
async function download(url:URL,photo=false,hops=0):Promise<{body:Buffer,type:string}>{
 let dnsTimer:ReturnType<typeof setTimeout>|undefined;const records=await Promise.race([lookup(url.hostname,{all:true,family:4}),new Promise<never>((_resolve,reject)=>{dnsTimer=setTimeout(()=>reject(fail(504,'import_timeout')),7000);})]).finally(()=>{if(dnsTimer)clearTimeout(dnsTimer);});if(!records.length||records.some(x=>!publicIpv4(x.address)))throw fail(400,'import_network_denied');
 const max=photo?12*1024*1024:2*1024*1024;
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>req.destroy(fail(504,'import_timeout')),9000);
  const req=https.get(url,{agent:false,family:4,lookup:((_h:any,_o:any,cb:any)=>cb(null,records[0].address,4)) as any,headers:{'User-Agent':'GoDirect-ListingImport/1.0','Accept':photo?'image/jpeg,image/png,image/webp':'text/html','Accept-Encoding':'identity'}},res=>{
   const status=res.statusCode||0;
   if([301,302,303,307,308].includes(status)){clearTimeout(timer);res.resume();if(hops>=2||!res.headers.location){reject(fail(422,'import_redirect_blocked'));return;}try{const next=new URL(res.headers.location,url);if(photo)photoUrl(next.href);else{const a=listingUrl(url.href),b=listingUrl(next.href);if(a.provider!==b.provider)throw fail(422,'import_redirect_blocked');}download(next,photo,hops+1).then(resolve,reject);}catch(e){reject(e);}return;}
   const type=String(res.headers['content-type']||'').split(';')[0].toLowerCase();
   if(status!==200||(!photo&&!['text/html','application/xhtml+xml'].includes(type))||(photo&&!['image/jpeg','image/png','image/webp'].includes(type))||res.headers['content-encoding']&&res.headers['content-encoding']!=='identity'){clearTimeout(timer);res.resume();reject(fail(422,'import_page_unavailable'));return;}
   if(Number(res.headers['content-length'])>max){req.destroy(fail(413,'import_too_large'));return;}
   const chunks:Buffer[]=[];let size=0;
   res.on('data',(chunk:Buffer)=>{size+=chunk.length;if(size>max)req.destroy(fail(413,'import_too_large'));else chunks.push(chunk);});
   res.on('error',reject);res.on('aborted',()=>reject(fail(422,'import_page_unavailable')));res.on('end',()=>{clearTimeout(timer);resolve({body:Buffer.concat(chunks),type});});
  });req.on('error',e=>{clearTimeout(timer);reject(e);});
 });
}
function plain(v:any,max=10000):string{return typeof v==='string'?v.replace(/<[^>]*>/g,' ').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim().slice(0,max):'';}
function attrs(tag:string){const out:Record<string,string>={};for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g))out[m[1].toLowerCase()]=m[2]??m[3];return out;}
export function extractListing(html:string,provider:string,assetType:string){
 const nodes:any[]=[];let visited=0;const visit=(v:any,depth=0)=>{if(!v||typeof v!=='object'||depth>12||++visited>2500)return;if(!Array.isArray(v))nodes.push(v);for(const x of Object.values(v))if(x&&typeof x==='object')visit(x,depth+1);};
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){if(attrs(m[1]).type?.toLowerCase()!=='application/ld+json')continue;try{visit(JSON.parse(m[2]));}catch{}}
 const types=(n:any)=>[].concat(n['@type']||[]).join(' ');
 const listing=nodes.find(n=>/VacationRental|Apartment|House|Boat|Vehicle|Car|Product|Accommodation|HotelRoom/.test(types(n)))||{};
 const accommodation=listing.containsPlace||listing;const meta:Record<string,string>={};
 for(const m of html.matchAll(/<meta\b[^>]*>/gi)){const a=attrs(m[0]);if(a.property||a.name)meta[a.property||a.name]=a.content||'';}
 const name=plain(listing.name||meta['og:title']||(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)||[])[1],120);
 const description=plain(listing.description||meta['og:description']||meta.description,10000);
 const address=listing.address||{};const properties:Record<string,any>={};
 const number=(v:any,max=10000)=>{const n=Number(typeof v==='object'?v?.value:v);return Number.isFinite(n)&&n>0&&n<=max?n:undefined;};
 if(assetType==='car'){for(const [key,value]of Object.entries({brand:typeof listing.brand==='string'?listing.brand:listing.brand?.name,model:listing.model,seats:listing.vehicleSeatingCapacity||listing.seatingCapacity})){if(key==='seats'){const n=number(value);if(n!==undefined)properties.seats=n;}else{const v=plain(value,120);if(v)properties[key]=v;}}}
 const mapping=assetType==='property'?{bedrooms:accommodation.numberOfBedrooms,bathrooms:accommodation.numberOfBathroomsTotal,beds:accommodation.numberOfBeds,guests:accommodation.occupancy,surfaceM2:accommodation.floorSize}:{capacity:listing.occupancy||listing.seatingCapacity};
 for(const [k,v] of Object.entries(mapping)){const n=number(v);if(n!==undefined)properties[k]=n;}
 const images:any[]=([] as any[]).concat(listing.image||[],listing.photo||[],meta['og:image']||[],meta['twitter:image']||[]);const photos:string[]=[];
 for(const image of images){try{const value=photoUrl(typeof image==='string'?image:image?.contentUrl||image?.url).href;if(!photos.includes(value))photos.push(value);}catch{}}
 const offer=Array.isArray(listing.offers)?listing.offers[0]:listing.offers;const price=number(offer?.price,1000000000);
 const amenities=[].concat(accommodation.amenityFeature||[]).filter((x:any)=>x?.value!==false).map((x:any)=>plain(x?.name,100)).filter(Boolean).slice(0,40);
 return{assetType,name,description,location:{city:plain(address.addressLocality,120),country:plain(typeof address.addressCountry==='string'?address.addressCountry:address.addressCountry?.name,80)},properties,photos:photos.slice(0,20),amenities,referencePrice:price?{amount:price,currency:plain(offer?.priceCurrency,5)}:null,provider};
}
export class ListingImportService{
 private users=new Map<string,{at:number,count:number,active:boolean}>();
 constructor(private firebase:FirebaseService){}
 private async authorized(req:Request){const uid=await requireUser(req,this.firebase);const now=Date.now();if(this.users.size>1000)for(const[k,v]of this.users)if(now-v.at>60000&&!v.active)this.users.delete(k);let entry=this.users.get(uid);if(!entry||now-entry.at>60000&&!entry.active){entry={at:now,count:0,active:false};this.users.set(uid,entry);}if(entry.active||++entry.count>25)throw fail(429,'import_rate_limited');entry.active=true;return entry;}
 preview=async(req:Request,res:Response)=>{const entry=await this.authorized(req);try{if(req.body?.rightsConfirmed!==true)throw fail(400,'import_rights_required');const source=listingUrl(req.body?.url);const pasted=String(req.body?.text||'').trim();if(pasted.length>30000)throw fail(400,'import_text_too_long');let html='',fallback=false;try{if(!pasted){html=(await download(source.url)).body.toString('utf8');}}catch{fallback=true;}
 const selected=String(req.body?.assetType||'');if(selected&&!['boat','car','property','parking','pool'].includes(selected))throw fail(400,'import_invalid_asset_type');const draft=extractListing(html,source.provider,source.provider==='leboncoin'&&selected?selected:source.assetType);if(pasted){const lines=pasted.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);draft.name=plain(lines.shift()||'',120);draft.description=plain(lines.join('\n'),10000);}
 res.setHeader('Cache-Control','no-store');return res.json({draft,sourceUrl:source.url.href,needsManualInput:fallback||!draft.name||!draft.description,requiresPriceConfirmation:true,requiresPhotoRights:true});
 }finally{entry.active=false;}};
 photo=async(req:Request,res:Response)=>{const entry=await this.authorized(req);try{if(req.body?.rightsConfirmed!==true)throw fail(400,'import_rights_required');const result=await download(photoUrl(req.body?.url),true);const b=result.body;const valid=result.type==='image/jpeg'?b[0]===255&&b[1]===216&&b[2]===255:result.type==='image/png'?b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):b.subarray(0,4).toString()==='RIFF'&&b.subarray(8,12).toString()==='WEBP';if(!valid)throw fail(422,'import_invalid_photo');res.setHeader('Cache-Control','no-store');return res.type(result.type).send(b);}finally{entry.active=false;}};
}
