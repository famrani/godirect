export interface AssetSearch {type:string;location:string;startAt:string;endAt:string;}
const invalid=(message:string)=>Object.assign(new Error(message),{status:400});
export function parseAssetSearch(query:any={}):AssetSearch {
 const read=(key:string)=>{const v=query[key];if(v===undefined)return '';if(typeof v!=='string')throw invalid('invalid_search');return v.trim();};
 const type=read('type').toLowerCase(),location=read('location'),startAt=read('startAt'),endAt=read('endAt');
 if(type&&!['boat','car','property','parking','pool'].includes(type))throw invalid('invalid_asset_type');
 if(location.length>200)throw invalid('invalid_location');
 const valid=(v:string)=>/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v.slice(0,10)+'T00:00:00Z').toISOString().slice(0,10)===v.slice(0,10);
 if((startAt||endAt)&&(!valid(startAt)||!valid(endAt)||Date.parse(endAt)<=Date.parse(startAt)))throw invalid('invalid_search_dates');
 return {type,location,startAt,endAt};
}
function normalize(v:string){return v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
export function locationMatches(asset:any,query:string):boolean {
 if(!query)return true;const l=asset.location||{};const values=['city','area','region','country'].map(k=>typeof l[k]==='string'?l[k]:'');
 if(/^[A-Za-z]{2}$/.test(l.country||''))for(const lang of ['fr','en'])try{values.push(new Intl.DisplayNames([lang],{type:'region'}).of(l.country.toUpperCase())||'');}catch{}
 const text=normalize(values.join(' ')),tokens=normalize(query).split(' ').filter(Boolean);return !!tokens.length&&tokens.every(t=>text.includes(t));
}
export function overlapsSearch(b:any,startAt:string,endAt:string):boolean {
 b=b||{};if(['cancelled','rejected','canceled','refused'].includes(String(b.status||'').toLowerCase()))return false;
 const a=Date.parse(b.startAt),z=Date.parse(b.endAt);if(!Number.isFinite(a)||!Number.isFinite(z)||z<=a)return true;
 return a<Date.parse(endAt)&&z>Date.parse(startAt);
}
export function legacySearchInterval(b:any):any {
 if(b.startAt&&b.endAt)return b;const date=String(b.outingDate||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)return {...b,startAt:'',endAt:''};
 const midnight=(day:string)=>{const utc=Date.parse(day+'T00:00:00Z');const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(utc));return utc-(Number(parts.find(p=>p.type==='hour')?.value)*60+Number(parts.find(p=>p.type==='minute')?.value))*60000;};
 const next=new Date(Date.parse(date+'T00:00:00Z')+86400000).toISOString().slice(0,10);return {...b,startAt:new Date(midnight(date)).toISOString(),endAt:new Date(midnight(next)).toISOString()};
}
