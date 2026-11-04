// Default is read-only. --apply is required to write uiTranslations.
const fs=require('node:fs'),path=require('node:path');
const catalog=require('./page-translations.json'),knownOld=require('./legacy-untranslated-values.json');
function mergeTranslations(input){const root=structuredClone(input||{});let added=0,repaired=0,preserved=0;
 for(const [language,entries]of Object.entries(catalog)){root[language]??={};for(const [key,value]of Object.entries(entries)){
  const parts=key.split('.');let node=root[language];let valid=true;
  for(const part of parts.slice(0,-1)){if(node[part]!==undefined&&(node[part]===null||typeof node[part]!=='object'||Array.isArray(node[part]))){valid=false;break;}node=node[part]??={};}
  if(!valid){preserved++;continue;}const leaf=parts.at(-1),old=node[leaf];
  if(old===undefined||old===null||(typeof old==='string'&&!old.trim())){node[leaf]=value;added++;}
  else if(typeof old==='string'&&old===knownOld[key]&&value!==old){node[leaf]=value;repaired++;}
  else if(old!==value)preserved++;
 }}return {value:root,added,repaired,preserved};
}
module.exports={mergeTranslations,catalog};
async function main(){const args=process.argv.slice(2);let source;
 const at=args.indexOf('--check-export');
 if(at>=0){const data=JSON.parse(fs.readFileSync(args[at+1],'utf8'));source=data.uiTranslations||{};const result=mergeTranslations(source);console.log(JSON.stringify({dryRun:true,added:result.added,repaired:result.repaired,preservedCustom:result.preserved}));return;}
 require('dotenv').config();const admin=require('firebase-admin');
 if(!process.env.FIREBASE_DATABASE_URL||!process.env.FIREBASE_SERVICE_ACCOUNT)throw Error('Set FIREBASE_DATABASE_URL and FIREBASE_SERVICE_ACCOUNT');
 const key=JSON.parse(fs.readFileSync(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT),'utf8'));
 const app=admin.initializeApp({credential:admin.credential.cert(key),databaseURL:process.env.FIREBASE_DATABASE_URL},'page-translations');
 try{const ref=app.database().ref('uiTranslations');const result=mergeTranslations((await ref.once('value')).val());console.log(JSON.stringify({dryRun:!args.includes('--apply'),added:result.added,repaired:result.repaired,preservedCustom:result.preserved}));
  if(args.includes('--apply')){const tx=await ref.transaction(old=>mergeTranslations(old).value,undefined,false);if(!tx.committed)throw Error('Translation update did not commit');console.log('uiTranslations updated.');}
 }finally{await app.delete();}
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1;});
