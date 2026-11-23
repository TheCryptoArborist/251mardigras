// Verify preserved source against the exact canonical import, without network
// access, deployment credentials, or any database operation.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const moduleRoot=fileURLToPath(new URL('../',import.meta.url));
const git=(...args)=>execFileSync('git',args,{cwd:moduleRoot,encoding:'utf8'}).trim();
const repoRoot=git('rev-parse','--show-toplevel');
const prefix=path.relative(repoRoot,moduleRoot).split(path.sep).join('/');
if(prefix!=='games/moonpie-run')throw new Error('Run this check from the MG251 repository game module.');
const baseline='9cbe858';
const tree=git('rev-parse',`${baseline}:${prefix}`);
assert.equal(tree,'d910203511bc7a5b1c0359f8628dc7edb650ed9c','Canonical import tree changed');
// Reviewed integration edits only. New files do not replace baseline files.
const integrationEdits=new Set(['README.md','package.json','game/progress.js','app/api/[...path]/route.ts']);
const entries=git('ls-tree','-r','--full-tree',`${baseline}:${prefix}`).split('\n');
assert.equal(entries.length,140,'Canonical import file count changed');
const errors=[];let checked=0;
for(const entry of entries){
 const [metadata,file]=entry.split('\t');
 if(integrationEdits.has(file))continue;
 const expected=metadata.split(' ')[2];
 try{
  // Git applies checkout clean filters, so Windows CRLF is not a false change.
  let actual=git('hash-object',path.join(moduleRoot,file));
  if(file==='game/index.html'){
   // The only approved document edit loads the isolated responsive fixes.
   const document=readFileSync(path.join(moduleRoot,file),'utf8').replace(/\r\n/g,'\n');
   const restored=document.replace('<link rel="stylesheet" href="layout-fixes.css?v=1">\n','');
   actual=execFileSync('git',['hash-object','--stdin'],{cwd:moduleRoot,encoding:'utf8',input:restored}).trim();
  }
  if(actual!==expected)errors.push(file);
 }catch{errors.push(file+' (missing/unreadable)');}
 checked++;
}
const originalPackage=JSON.parse(git('show',`${baseline}:${prefix}/package.json`));
const currentPackage=JSON.parse(readFileSync(path.join(moduleRoot,'package.json'),'utf8'));
for(const field of ['dependencies','devDependencies','overrides','engines','type']){
 assert.deepEqual(currentPackage[field],originalPackage[field],`Unreviewed package ${field} change`);
}
if(errors.length)throw new Error('Protected canonical files changed:\n'+errors.join('\n'));
console.log(`PASS: ${checked} protected canonical files match; package dependencies/runtime unchanged.`);
console.log('Includes artwork, audio, gameplay, backend, schema/migrations, identity and original tests.');
console.log('This source check does not verify live database contents, backups or browser profiles.');
