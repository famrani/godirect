import {randomUUID} from 'node:crypto';import {canMessage,messageParticipants} from './messaging-policy.js';
const fail=(code:string,status=403)=>Object.assign(Error(code),{status});
export function clearedConversation(root:any,id:string,uid:string):any{return root.messageOperations?.[id]?._cleared?.[uid]||{};}
export function reopenConversation(root:any,id:string,uid:string){const c=root.messageOperations?.[id]?._cleared?.[uid];if(c)c.hidden=false;}
export function personalThread(root:any,id:string,thread:any,uid:string):any {const c=clearedConversation(root,id,uid),empty=String(thread.lastMessageId||'')<=String(c.through||'')||!!c.messages?.[thread.lastMessageId];return {...thread,id,preview:empty?'':String(thread.preview||''),previewDeleted:!empty&&thread.previewDeleted===true};}
export function hiddenConversation(thread:any,state:any):boolean{return state?.hidden===true&&String(thread.lastMessageId||'')<=String(state.through||'');}
export function clearConversation(root:any,id:string,user:any):void {
 const t=root.messageThreads?.[id];if(!canMessage(root,user,t))throw fail('message_access_denied');const keys=Object.keys(root.messageMessages?.[id]||{});const through=[...keys,String(t.lastMessageId||'')].sort().at(-1)||'';
 root.messageOperations??={};root.messageOperations[id]??={};root.messageOperations[id]._cleared??={};root.messageOperations[id]._cleared[user.uid]={...clearedConversation(root,id,user.uid),through,hidden:true,at:Date.now()};root.messageReads??={};root.messageReads[id]??={};if(String(root.messageReads[id][user.uid]||'')<through)root.messageReads[id][user.uid]=through;
 root.messageSignals??={};root.messageSignals[user.uid]={at:Date.now(),nonce:randomUUID()};
}
export function deleteOwnMessage(root:any,id:string,messageId:string,user:any):void {
 const t=root.messageThreads?.[id];if(!canMessage(root,user,t))throw fail('message_access_denied');const m=root.messageMessages?.[id]?.[messageId];if(!m)throw fail('message_not_found',404);
 if(m.senderId===user.uid){
  if(m.deletedAt)return;
  root.messageMessages[id][messageId]={senderId:m.senderId,senderName:m.senderName||'',createdAt:m.createdAt,deletedAt:Date.now(),deletedBy:user.uid};
  if(t.lastMessageId===messageId){t.preview='';t.previewDeleted=true;}
  root.messageSignals??={};for(const uid of messageParticipants(root,t))root.messageSignals[uid]={at:Date.now(),nonce:randomUUID()};
  return;
 }
 root.messageOperations??={};root.messageOperations[id]??={};root.messageOperations[id]._cleared??={};root.messageOperations[id]._cleared[user.uid]??={};
 const state=root.messageOperations[id]._cleared[user.uid];state.messages??={};state.messages[messageId]=true;
 root.messageSignals??={};root.messageSignals[user.uid]={at:Date.now(),nonce:randomUUID()};
}
