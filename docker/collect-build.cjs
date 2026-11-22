const fs=require('node:fs'),path=require('node:path');
function collect(kind,source,output,target){
 const root=path.resolve(source);let candidates=[];
 if(output!=='auto')candidates=[path.resolve(root,output)];
 else if(kind==='frontend'){
  candidates=[path.join(root,'www')];
  const dist=path.join(root,'dist');
  if(fs.existsSync(dist))for(const entry of fs.readdirSync(dist,{withFileTypes:true})){if(entry.isDirectory()){candidates.push(path.join(dist,entry.name,'browser'),path.join(dist,entry.name));}}
  candidates.push(path.join(dist,'browser'),dist);
 }else throw Error('An explicit backend output directory is required');
 const entry=kind==='frontend'?'index.html':'index.js';
 candidates=[...new Set(candidates)].filter(dir=>fs.existsSync(path.join(dir,entry)));
 if(candidates.length!==1)throw Error(`Expected one ${kind} build containing ${entry}; found ${candidates.length}. Set ${kind==='frontend'?'FRONTEND_OUTPUT':'BACKEND_OUTPUT'} explicitly.`);
 const selected=fs.realpathSync(candidates[0]);
 if(!selected.startsWith(root+path.sep))throw Error('Build output must be inside the project');
 fs.mkdirSync(target,{recursive:true});fs.cpSync(selected,target,{recursive:true});
 console.log(`${kind}: ${path.relative(root,selected)} -> ${target}`);return selected;
}
module.exports={collect};
if(require.main===module){try{const [kind,source,output,target]=process.argv.slice(2);if(!['frontend','backend'].includes(kind)||!source||!output||!target)throw Error('Usage: collect-build.cjs frontend|backend SOURCE OUTPUT TARGET');collect(kind,source,output,target);}catch(e){console.error(e.message);process.exitCode=1;}}
