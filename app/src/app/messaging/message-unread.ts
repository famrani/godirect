import type {MessageSummary,MessageNotice} from './message-notification-state';
export function unreadCount(summary:MessageSummary|null|undefined,type='',assetId=''):number {
 if(!summary)return 0;if(!type||!assetId)return Math.max(0,Number(summary.unreadMessages)||0);
 return (summary.latest||[]).filter(t=>t.type===type&&t.assetId===assetId).reduce((sum,t)=>sum+Math.max(0,Number(t.count)||0),0);
}
export function unreadConversation(summary:MessageSummary|null|undefined,type='',assetId=''):MessageNotice|null {
 return (summary?.latest||[]).find(t=>(!type||!assetId||t.type===type&&t.assetId===assetId))||null;
}
export function messagesPage(url:string):boolean{return /^\/messages(?:[/?#]|$)/.test(url);}
export function readAllowed(input:{url:string;visible:boolean;focused:boolean;threadId:string;selectedId:string;streamVisible:boolean;atBottom:boolean}):boolean {
 return messagesPage(input.url)&&input.visible&&input.focused&&!!input.threadId&&input.threadId===input.selectedId&&input.streamVisible&&input.atBottom;
}
