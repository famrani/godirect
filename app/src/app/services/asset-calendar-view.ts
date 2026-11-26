const parisFormatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'});
export function parisDay(value:number|string):string{
 const parts=parisFormatter.formatToParts(new Date(value));
 const get=(key:string)=>parts.find(p=>p.type===key)?.value||'';return `${get('year')}-${get('month')}-${get('day')}`;
}
export function calendarEventOnDay(event:any,key:string):boolean{
 const start=Date.parse(event.startAt),end=Date.parse(event.endAt);
 return Number.isFinite(start)&&Number.isFinite(end)&&end>start&&parisDay(start)<=key&&parisDay(end-1)>=key;
}
export function monthCells(year:number,month:number):Array<{key:string;day:number;inMonth:boolean}>{
 const first=new Date(Date.UTC(year,month,1)),offset=(first.getUTCDay()+6)%7;
 return Array.from({length:42},(_,i)=>{const date=new Date(Date.UTC(year,month,1-offset+i));return {key:date.toISOString().slice(0,10),day:date.getUTCDate(),inMonth:date.getUTCMonth()===month};});
}
