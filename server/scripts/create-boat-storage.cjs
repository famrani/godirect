#!/usr/bin/env node
// Dry run by default. Never changes Firebase, permissions or existing objects.
const fs=require('node:fs'),path=require('node:path');
try{require('dotenv').config();}catch{}
const args=process.argv.slice(2);function arg(k){const i=args.indexOf(k);if(i<0)return null;if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Missing value for '+k);return args[i+1];}
function findHarbornestImages(){
 const found=new Set();
 for(const start of [process.cwd(),__dirname]){
  let parent=path.resolve(start);
  for(let level=0;level<5;level++){
   const roots=[path.join(parent,'harbornest-1')];
   if(path.basename(parent)==='harbornest-1')roots.push(parent);
   for(const root of roots)for(const relative of ['src/assets/img','app/src/assets/img','assets/img']){
    const candidate=path.join(root,relative);
    if(fs.existsSync(candidate)&&fs.statSync(candidate).isDirectory())found.add(fs.realpathSync(candidate));
   }
   const next=path.dirname(parent);if(next===parent)break;parent=next;
  }
 }
 if(found.size!==1)throw Error(found.size?'Several harbornest-1 image folders found. Specify --source with the exact assets/img directory.':'harbornest-1 assets/img not found. Specify --source /absolute/path/harbornest-1/src/assets/img (or app/src/assets/img).');
 return [...found][0];
}
async function main(){
 const manifest=JSON.parse(fs.readFileSync(arg('--manifest')||path.join(__dirname,'boat-media-manifest.json'),'utf8'));
 const bucketName=arg('--bucket')||manifest.targetBucket;
 if(!bucketName||bucketName.includes('/'))throw Error('Invalid bucket name');
 const foldersOnly=args.includes('--folders-only'),apply=args.includes('--apply');
 const explicitSource=arg('--source');
 const source=foldersOnly?null:(explicitSource?path.resolve(explicitSource):findHarbornestImages());
 if(source&&(!fs.existsSync(source)||!fs.statSync(source).isDirectory()))throw Error('Source assets/img directory not found: '+source);
 if(source)console.log('SOURCE '+source);
 const paths=[...new Set(manifest.paths)];if(!paths.length)throw Error('Empty manifest');
 for(const p of paths)if(typeof p!=='string'||!/^boat\/[A-Za-z0-9_-]+\/img\/[A-Za-z0-9._/-]+\.(png|jpe?g|webp|gif|avif|svg)$/i.test(p)||p.includes('..'))throw Error('Invalid manifest path');
 const folders=new Set();for(const p of paths){const parts=p.split('/');for(let i=1;i<parts.length;i++)folders.add(parts.slice(0,i).join('/')+'/');}
 const plans=paths.map(p=>({destination:p,local:source?path.resolve(source,p.split('/img/')[1]):null}));
 const missing=source?plans.filter(p=>!fs.existsSync(p.local)||!fs.statSync(p.local).isFile()):[];
 console.log(`${apply?'APPLY':'DRY RUN'} gs://${bucketName}: ${folders.size} folder markers, ${paths.length} referenced images`);
 if(!apply){for(const f of [...folders].sort())console.log('FOLDER '+f);if(!foldersOnly)for(const p of plans)console.log(`${missing.includes(p)?'MISSING':'COPY'} ${p.local} -> ${p.destination}`);console.log('No writes. Add --apply to execute.');return;}
 const {Storage}=require('@google-cloud/storage');const storage=new Storage({keyFilename:process.env.GCS_SERVICE_ACCOUNT||process.env.FIREBASE_SERVICE_ACCOUNT||undefined});const bucket=storage.bucket(bucketName);let copied=0,existing=0,failed=0;
 async function create(action,label){try{await action();copied++;}catch(e){if(Number(e.code)===412)existing++;else{failed++;console.error(`FAILED ${label}: ${e.code||e.message}`);}}}
 for(const f of [...folders].sort())await create(()=>bucket.file(f).save(Buffer.alloc(0),{resumable:false,preconditionOpts:{ifGenerationMatch:0}}),f);
 if(!foldersOnly)for(const p of plans){if(missing.includes(p)){console.error('MISSING '+p.local);continue;}await create(()=>bucket.upload(p.local,{destination:p.destination,preconditionOpts:{ifGenerationMatch:0}}),p.destination);}
 console.log(`Created/copied ${copied}; already present ${existing}; errors ${failed}; missing images ${foldersOnly?0:missing.length}.`);
 console.log('Firebase and permissions unchanged; no existing object overwritten.');if(failed||(!foldersOnly&&missing.length))process.exitCode=1;
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
