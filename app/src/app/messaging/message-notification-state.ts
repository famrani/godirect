export interface MessageNotice {id:string;lastMessageId:string;assetName:string;type?:string;assetId?:string;count?:number;}
export interface MessageSummary {unreadMessages:number;unreadThreads:number;latest:MessageNotice[];}
/** Tracks message IDs, not totals: another conversation can be read while a new one arrives. */
export class MessageNotificationState {
 private seen=new Map<string,string>();private initialized=false;
 reset(){this.seen.clear();this.initialized=false;}
 accept(summary:MessageSummary):MessageNotice|null {
  let notice:MessageNotice|null=null;
  for(const item of summary.latest||[]){const previous=this.seen.get(item.id);if(this.initialized&&(previous===undefined||item.lastMessageId>previous)&&!notice)notice=item;this.seen.set(item.id,item.lastMessageId);}
  const current=new Set((summary.latest||[]).map(x=>x.id));for(const id of this.seen.keys())if(!current.has(id))this.seen.delete(id);
  this.initialized=true;return notice;
 }
}
