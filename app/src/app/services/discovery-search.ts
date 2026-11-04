export interface DiscoveryFilters {type?:string;location?:string;startAt?:string;endAt?:string;}
export function localDateTime(iso:string):string {
 if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(iso))return '';
 const day=new Date(iso.slice(0,10)+'T00:00:00Z');if(!Number.isFinite(day.getTime())||day.toISOString().slice(0,10)!==iso.slice(0,10))return '';
 const d=new Date(iso);if(!Number.isFinite(d.getTime()))return '';const p=(n:number)=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
export function discoveryFilters(type:string,location:string,start:string,end:string):DiscoveryFilters {
 if(type&&!['boat','car','property','parking','pool'].includes(type))throw Error('invalidType');if(location.trim().length>200)throw Error('invalidLocation');
 const result:DiscoveryFilters={type:type||undefined,location:location.trim()||undefined};
 if(start||end){const a=new Date(start),b=new Date(end);if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(end)||!Number.isFinite(a.getTime())||!Number.isFinite(b.getTime())||localDateTime(a.toISOString())!==start||localDateTime(b.toISOString())!==end||b<=a)throw Error('invalidDates');result.startAt=a.toISOString();result.endAt=b.toISOString();}return result;
}
