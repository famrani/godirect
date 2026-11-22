import admin from 'firebase-admin';
export const MESSAGE_NODES=['messageThreads','messageMessages','messageOperations','messageReads','messageSignals'];
const denies=(v:any)=>v===undefined||v===false||v==='false';
function grants(node:any):boolean{if(!node||typeof node!=='object')return false;if(!denies(node['.read'])||!denies(node['.write']))return true;return Object.entries(node).some(([k,v])=>!k.startsWith('.')&&grants(v));}
export function messagingRulesPrivate(json:any,nodes=MESSAGE_NODES):boolean{
 const r=json?.rules;if(!r||!denies(r['.read'])||!denies(r['.write']))return false;
 if(Object.entries(r).some(([k,v])=>k.startsWith('$')&&grants(v)))return false;
 return nodes.every(k=>r[k]&&[false,'false'].includes(r[k]['.read'])&&[false,'false'].includes(r[k]['.write'])&&!Object.entries(r[k]).some(([key,v])=>!key.startsWith('.')&&grants(v)));
}
export async function verifyMessagingRules(nodes=MESSAGE_NODES):Promise<boolean>{
 const credential=admin.app().options.credential;if(!credential)return false;
 const access=await credential.getAccessToken();const base=String(process.env.FIREBASE_DATABASE_URL||'').replace(/\/$/,'');if(!/^https:\/\//.test(base))return false;
 const r=await fetch(base+'/.settings/rules.json',{headers:{Authorization:'Bearer '+access.access_token},signal:AbortSignal.timeout(10000)});if(!r.ok)return false;return messagingRulesPrivate(await r.json(),nodes);
}
