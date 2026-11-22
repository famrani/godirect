import {messageParticipants} from './messaging-policy.js';
const fail=(code:string,status=400)=>Object.assign(Error(code),{status});
export interface PrebookingDetails {startAt:string;endAt:string;guests?:number;pickupLocation?:string;returnLocation?:string;additionalDriver?:boolean;childSeat?:boolean;driverAge?:number;licenseCountry?:string;vehiclePlate?:string;}
export function prebookingDetails(input:any,type:string):PrebookingDetails|null {
 if(input===undefined||input===null)return null;
 const date=(v:any)=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(v)||!Number.isFinite(Date.parse(v)))throw fail('invalid_prebooking_dates');const [y,m,d]=v.slice(0,10).split('-').map(Number),check=new Date(Date.UTC(y,m-1,d));if(check.getUTCFullYear()!==y||check.getUTCMonth()+1!==m||check.getUTCDate()!==d)throw fail('invalid_prebooking_dates');return new Date(v).toISOString();};
 const startAt=date(input.startAt),endAt=date(input.endAt);if(Date.parse(endAt)<=Date.parse(startAt)||Date.parse(endAt)-Date.parse(startAt)>366*2*86400000)throw fail('invalid_prebooking_dates');
 const p:PrebookingDetails={startAt,endAt};
 if(['boat','property','pool'].includes(type)&&input.guests!==undefined){const n=Number(input.guests);if(!Number.isInteger(n)||n<1||n>1000)throw fail('invalid_prebooking_guests');p.guests=n;}
 const text=(key:'pickupLocation'|'returnLocation'|'licenseCountry'|'vehiclePlate',max:number)=>{if(input[key]!==undefined){if(typeof input[key]!=='string'||input[key].length>max)throw fail('invalid_prebooking_details');p[key]=input[key].trim();}};
 if(type==='car'){text('pickupLocation',240);text('returnLocation',240);text('licenseCountry',3);for(const key of ['additionalDriver','childSeat'] as const)if(input[key]!==undefined){if(typeof input[key]!=='boolean')throw fail('invalid_prebooking_details');p[key]=input[key];}if(input.driverAge!==undefined){const n=Number(input.driverAge);if(!Number.isInteger(n)||n<18||n>100)throw fail('invalid_prebooking_details');p.driverAge=n;}}
 if(type==='parking')text('vehiclePlate',30);return p;
}
/** Called inside the booking transaction, after normal price and availability checks. */
export function linkPrebooking(root:any,booking:any,threadId?:string):void {
 if(!threadId)return;const t=root.messageThreads?.[threadId];
 if(!/^[a-f0-9]{64}$/.test(threadId)||!t||t.kind!=='asset'||!t.prebooking||t.type!==booking.assetType||t.assetId!==booking.assetId||t.ownerId!==booking.ownerId||t.customerId!==booking.customerId)throw fail('prebooking_access_denied',403);
 if(Date.parse(t.prebooking.startAt)!==Date.parse(booking.startAt)||Date.parse(t.prebooking.endAt)!==Date.parse(booking.endAt))throw fail('prebooking_dates_changed',409);
 if(t.linkedBookingId&&t.linkedBookingId!==booking.id)throw fail('prebooking_already_booked',409);
 t.linkedBookingId=booking.id;t.updatedAt=Date.now();booking.messageThreadId=threadId;root.messageSignals??={};for(const uid of messageParticipants(root,t))root.messageSignals[uid]={at:Date.now(),bookingId:booking.id};
}
export function bookingMessageContext(root:any,t:any):any {
 const id=t.kind==='reservation'?t.bookingId:t.linkedBookingId,b=root.bookings?.[t.type]?.[t.assetId]?.[id];
 if(!id||!b||b.ownerId!==t.ownerId||(t.audience==='rental'&&b.customerId!==t.customerId))return null;
 return {id,startAt:b.startAt,endAt:b.endAt,status:b.status,guests:b.rental?.guests,pickupLocation:b.rental?.pickupLocation,returnLocation:b.rental?.returnLocation,additionalDriver:b.extras?.additionalDriver,childSeat:b.extras?.childSeat,rentalAmount:b.pricing?.rentalAmount,currency:b.pricing?.currency};
}
