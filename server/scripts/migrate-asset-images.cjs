// Run from server/. Dry run by default. Does not modify Firebase or object permissions.
const fs=require('node:fs'),path=require('node:path');require('dotenv').config();
const args=process.argv.slice(2),value=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];};
const source=path.resolve(value('--source')||'../app/src/assets/img');
const bucketName=value('--bucket')||process.env.GCS_BUCKET||process.env.GCS_MEDIA_BUCKET||'ailla-poc.appspot.com';
const apply=args.includes('--apply');const folders={boat:'boats',car:'cars',parking:'parking',pool:'pool',property:'property'};
const files=[];
function walk(dir,base,type){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const local=path.join(dir,entry.name);if(entry.isDirectory())walk(local,base,type);else if(entry.isFile()&&/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name))files.push({local,destination:`assets/${folders[type]}/${path.relative(base,local).split(path.sep).join('/')}`});}}
for(const type of Object.keys(folders)){const dir=path.join(source,type);if(fs.existsSync(dir))walk(dir,dir,type);}
if(!files.length){console.error('No asset photos found. Check --source (expected src/assets/img).');process.exitCode=1;}else{
(async()=>{
 console.log(`${apply?'COPY':'DRY RUN'}: ${files.length} images -> gs://${bucketName}/assets/`);
 if(!apply){for(const f of files)console.log(`${f.local} -> ${f.destination}`);console.log('Add --apply to copy. Existing objects are never overwritten.');return;}
 const {Storage}=require('@google-cloud/storage');const storage=new Storage({keyFilename:process.env.GCS_SERVICE_ACCOUNT||process.env.FIREBASE_SERVICE_ACCOUNT||undefined});const bucket=storage.bucket(bucketName);let copied=0,skipped=0,failed=0;
 for(const file of files){try{await bucket.upload(file.local,{destination:file.destination,preconditionOpts:{ifGenerationMatch:0}});copied++;}catch(e){if(Number(e.code)===412){skipped++;}else{failed++;console.error(`Failed: ${file.destination} (${e.code||'error'})`);}}}
 console.log(`Copied ${copied}; already present ${skipped}; failed ${failed}. Firebase unchanged; bucket stays private.`);if(failed)process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1;});}
