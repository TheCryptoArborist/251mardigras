import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
await rm('public',{recursive:true,force:true});await cp('game','public',{recursive:true});
const html=await readFile('game/index.html','utf8');await writeFile('app/game-document.ts','export default '+JSON.stringify(html)+';\n');
