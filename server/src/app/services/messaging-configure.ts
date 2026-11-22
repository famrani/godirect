import 'dotenv/config';import admin from 'firebase-admin';import fs from 'node:fs/promises';import os from 'node:os';import path from 'node:path';import {createHash} from 'node:crypto';
import {FirebaseService} from './firebase.service.js';import {MESSAGE_NODES,messagingRulesPrivate} from './messaging-storage.js';
async function configure(apply:boolean){
 const store=new FirebaseService();await store.initFirebase();try{
  const credential=admin.app().options.credential;if(!credential)throw Error('firebase_credential_missing');const token=await credential.getAccessToken();const base=String(process.env.FIREBASE_DATABASE_URL||'').replace(/\/$/,'');if(!/^https:\/\//.test(base))throw Error('invalid_database_url');const url=base+'/.settings/rules.json';const headers={Authorization:'Bearer '+token.access_token};
  const response=await fetch(url,{headers:{...headers,'X-Firebase-ETag':'true'},signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('firebase_rules_access_denied');const old=await response.json() as any;
  if(!apply){console.log(JSON.stringify({messagingRulesPrivate:messagingRulesPrivate(old)}));return;}
  const next=JSON.parse(JSON.stringify(old));next.rules??={};for(const key of MESSAGE_NODES)next.rules[key]={...next.rules[key],'.read':false,'.write':false};
  if(!messagingRulesPrivate(next))throw Error('parent_rules_grant_access_fix_parent_rules_first');
  const backup=path.join(os.tmpdir(),'godirect-rules-before-messaging-'+Date.now()+'.json');await fs.writeFile(backup,JSON.stringify(old,null,2),{mode:0o600});
  const check=await fetch(url,{headers,signal:AbortSignal.timeout(10000)});if(!check.ok)throw Error('firebase_rules_access_denied');const current=await check.json();const hash=(v:any)=>createHash('sha256').update(JSON.stringify(v)).digest('hex');if(hash(old)!==hash(current))throw Error('firebase_rules_changed_retry');
  const etag=response.headers.get('etag');const result=await fetch(url,{method:'PUT',headers:{...headers,'Content-Type':'application/json',...(etag?{'if-match':etag}:{})},body:JSON.stringify(next),signal:AbortSignal.timeout(10000)});if(!result.ok)throw Error('firebase_rules_update_failed');
  console.log(JSON.stringify({applied:true,backup,conditionalWrite:!!etag,restartGoDirect:true}));
 }finally{await admin.app().delete();}
}
if(process.argv.includes('--apply-messaging-rules')||process.argv.includes('--check-messaging-rules'))void configure(process.argv.includes('--apply-messaging-rules')).catch(e=>{console.error('[Messaging rules]',String(e.message));process.exitCode=1;});
