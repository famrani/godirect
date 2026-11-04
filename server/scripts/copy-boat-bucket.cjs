#!/usr/bin/env node
// Requires the gcloud CLI, not local image files or Node packages.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
function plan(m){
 if(!/^[a-z0-9][a-z0-9._-]+$/.test(m.sourceBucket)||!/^[a-z0-9][a-z0-9._-]+$/.test(m.destinationBucket))throw Error('Invalid bucket');
 const prefix=m.destinationPrefix.replace(/\/+$/,'');if(prefix!=='assets/boats')throw Error('Expected destination prefix assets/boats');
 const root=String(m.sourceRootFallback||'').replace(/^\/+|\/+$/g,'');if(root.includes('..')||!/^[-a-zA-Z0-9_/]*$/.test(root))throw Error('Invalid source root');
 return [...new Set(m.paths)].map(p=>{const match=/^boat\/([a-zA-Z0-9_-]+)\/img\/([a-zA-Z0-9._/-]+\.(?:jpg|jpeg|png|gif|webp|avif|svg))$/i.exec(p);if(!match||p.includes('..'))throw Error('Invalid image path');return {sources:[`gs://${m.sourceBucket}/${p}`,...(root?[`gs://${m.sourceBucket}/${root}/${p}`]:[])],destination:`gs://${m.destinationBucket}/${prefix}/${match[1]}/img/${match[2]}`};});
}
function main(args=process.argv.slice(2),run=(a)=>execFileSync('gcloud',a,{encoding:'utf8',stdio:['ignore','pipe','pipe']})){
 const val=k=>{const i=args.indexOf(k);if(i<0)return null;if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing value: '+k);return args[i+1];};
 const m=JSON.parse(fs.readFileSync(val('--manifest')||path.join(__dirname,'boat-bucket-manifest.json'),'utf8'));const rows=plan(m);const account=val('--account'),auth=account?['--account',account]:[];const apply=args.includes('--apply'),check=args.includes('--check');
 const errorText=e=>String(e.stderr||e.message||e);const missing=e=>/\b404\b|not found|notfound|does not exist/i.test(errorText(e))&&!/\b403\b|permission|forbidden/i.test(errorText(e));
 function exists(uri){try{run(['storage','objects','describe',uri,'--format=value(name)',...auth]);return true;}catch(e){if(missing(e))return false;throw e;}}
 console.log(`${apply?'COPY':check?'CHECK':'DRY RUN'}: ${rows.length} images. Target gs://${m.destinationBucket}/assets/boats/`);
 let copied=0,skipped=0,absent=0,failed=0;
 for(const row of rows){
  if(!apply&&!check){console.log(`${row.sources[0]} -> ${row.destination}`);continue;}
  try{
   if(exists(row.destination)){skipped++;console.log('EXISTS '+row.destination);continue;}
   let source;for(const candidate of row.sources){if(exists(candidate)){source=candidate;break;}}
   if(!source){absent++;console.error('MISSING '+row.sources.join(' OR '));continue;}
   if(check&&!apply){console.log('READY '+source+' -> '+row.destination);continue;}
   try{run(['storage','cp',source,row.destination,'--if-generation-match=0','--quiet',...auth]);copied++;console.log('COPIED '+row.destination);}
   catch(e){if(/\b412\b|conditionNotMet|precondition.*fail/i.test(errorText(e))){skipped++;console.log('EXISTS '+row.destination);}else throw e;}
  }catch(e){failed++;console.error('FAILED '+row.destination+'\n'+errorText(e));if(/\b403\b|permission|forbidden|not.*logged|login required/i.test(errorText(e))){console.error('Stopped: verify read access to the source bucket and write access to the destination.');break;}}
 }
 console.log(`Copied ${copied}; existing ${skipped}; missing sources ${absent}; errors ${failed}. Firebase unchanged.`);
 if(!apply&&!check)console.log('No GCP access or writes. Use --check to verify, --apply to copy.');
 return failed||absent?1:0;
}
module.exports={plan,main};if(require.main===module){try{process.exitCode=main();}catch(e){console.error(e.message);process.exitCode=1;}}
