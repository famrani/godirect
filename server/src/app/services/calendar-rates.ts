const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'});
export const dayKey=(v:number)=>fmt.format(v);
const D=86400000;
export function days(a:string,z:string){const valid=(k:string)=>typeof k==='string'&&/^\d{4}-\d\d-\d\d$/.test(k)&&Number.isFinite(Date.parse(k))&&new Date(Date.parse(k)).toISOString().slice(0,10)===k;
 if(!valid(a)||!valid(z)||z<a||Date.parse(z)-Date.parse(a)>365*D)return [];
 return Array.from({length:1+(Date.parse(z)-Date.parse(a))/D},(_,i)=>new Date(Date.parse(a)+i*D).toISOString().slice(0,10));}
export function blocked(a:any,start:string,end:string){const first=dayKey(Date.parse(start)),last=dayKey(Date.parse(end)-1);return Object.entries<any>(a?.calendarDays||{}).some(([k,v])=>v?.blocked&&k>=first&&k<=last);}
export function periodTotal(a:any,start:string,n:number,hour:boolean){const base=Number(a.pricing?.basePrice||0),t=Date.parse(start),d=Date.parse(dayKey(t));let sum=base*n;
 for(const [k,v] of Object.entries<any>(a.calendarDays||{})){if(typeof v?.rate!=='number')continue;
 if(!hour){const i=(Date.parse(k)-d)/D;if(i>=0&&i<n)sum+=v.rate-base;}
 else{const guess=Math.floor((Date.parse(k)-t)/3600000);for(let i=Math.max(0,guess-3);i<Math.min(n,guess+26);i++)if(dayKey(t+i*3600000)===k)sum+=v.rate-base;}}
 return Math.round(sum*100)/100;}
