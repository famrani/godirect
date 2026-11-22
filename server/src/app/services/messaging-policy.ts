import {customerConcierge} from './messaging-contact.js';
import {activeDelegation,platformManagement} from './asset-delegation.js';
export interface MessageScope{kind:'reservation'|'subscription'|'asset';type:string;assetId:string;bookingId?:string;audience:'rental'|'management';customerId?:string;recipientId?:string;}
export function messageScope(input:any):MessageScope{
 const s={kind:input?.kind,type:input?.type,assetId:input?.assetId,bookingId:input?.bookingId||'',audience:input?.audience||'management',...(input?.kind==='asset'?{customerId:input?.customerId,recipientId:input?.recipientId}:{})};
 if(!['reservation','subscription','asset'].includes(s.kind)||!['boat','car','property','parking','pool'].includes(s.type)||typeof s.assetId!=='string'||!/^[-\w]{1,128}$/.test(s.assetId)||!['rental','management'].includes(s.audience)||(s.kind==='reservation'&&!/^[-\w]{1,128}$/.test(s.bookingId))||(s.kind==='subscription'&&s.audience!=='management')||(s.kind==='asset'&&(s.audience!=='rental'||typeof s.customerId!=='string'||!/^[-\w]{1,128}$/.test(s.customerId)||s.customerId==='guest'||typeof s.recipientId!=='string'||!/^[-\w]{1,128}$/.test(s.recipientId))))throw Object.assign(Error('invalid_message_scope'),{status:400});
 return s;
}
export function messageContext(root:any,s:MessageScope):any|null{
 const a=root.assets?.[s.type]?.[s.assetId];if(!a||a.deletedAt||!a.ownerId)return null;
 const b=s.kind==='reservation'?root.bookings?.[s.type]?.[s.assetId]?.[s.bookingId||'']:null;
 if(s.kind==='reservation'&&(!b||b.ownerId!==a.ownerId))return null;
 return {...s,ownerId:a.ownerId,customerId:s.kind==='asset'?s.customerId:s.audience==='rental'?String(b?.customerId||''):null,assetName:String(a.name||s.assetId),title:s.kind==='reservation'?String(b?.customerName||''):'',createdAt:0,updatedAt:0};
}
export function canMessage(root:any,user:any,thread:any):boolean{
 if(!user?.uid||!thread)return false;
 let s:MessageScope;try{s=messageScope(thread);}catch{return false;}const current=messageContext(root,s);if(!current||current.ownerId!==thread.ownerId)return false;
 if(s.audience==='rental'&&current.customerId!==thread.customerId)return false;
 if(user.uid===thread.ownerId)return true;
 if(s.kind==='asset')return user.uid===thread.customerId||(user.uid===thread.recipientId&&customerConcierge(root,user.uid,s.type,s.assetId));
 if(s.kind==='reservation'&&s.audience==='rental'&&thread.customerId!=='guest'&&thread.customerId===user.uid)return true;
 if(s.audience==='management'&&platformManagement(root,user.uid,user))return true;
 const grant=activeDelegation(root,user.uid,s.type,s.assetId);
 return grant?.permissions?.[s.kind==='reservation'?'bookings':'content']===true;
}
export function messageParticipants(root:any,thread:any):string[]{
 const candidates=new Set<string>([thread.ownerId]);if(thread.kind==='asset'&&thread.recipientId)candidates.add(thread.recipientId);if(thread.customerId&&thread.customerId!=='guest')candidates.add(thread.customerId);
 for(const uid of Object.keys(root.assetDelegations?.[thread.type]?.[thread.assetId]||{}))candidates.add(uid);
 if(thread.audience==='management')for(const uid of Object.keys(root.backendusers||{}))candidates.add(uid);
 return [...candidates].filter(uid=>canMessage(root,{uid},thread));
}
