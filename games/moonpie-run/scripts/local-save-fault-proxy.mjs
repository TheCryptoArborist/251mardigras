// Local browser QA only. The game is forwarded unchanged; finish responses
// can be failed to exercise the real browser's outbox and pending-status UI.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const control=new URL('../.wrangler/save-fault-mode.txt',import.meta.url);
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:8793');
  if(url.origin!=='http://127.0.0.1:8793'){res.writeHead(400).end();return;}
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const mode=(await readFile(control,'utf8').catch(()=> 'pass')).trim();
  if(req.method==='POST'&&url.pathname==='/api/runs/finish'&&mode==='disconnect'){res.destroy();return;}
  if(req.method==='POST'&&url.pathname==='/api/runs/finish'&&['transient','permanent'].includes(mode)){
   res.writeHead(mode==='transient'?503:400,{'content-type':'application/json','cache-control':'no-store'});
   res.end(JSON.stringify({error:mode==='transient'?'Local QA: score service temporarily unavailable.':'Local QA: permanent validation rejection.'}));return;
  }
  const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value&&!['host','connection','content-length','accept-encoding'].includes(key))headers.set(key,Array.isArray(value)?value.join(','):value);
  if(headers.get('origin')==='http://127.0.0.1:8793')headers.set('origin','http://127.0.0.1:8791');
  const response=await fetch('http://127.0.0.1:8791'+url.pathname+url.search,{method:req.method,headers,redirect:'manual',...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});
  const output={};response.headers.forEach((v,k)=>{if(!['content-encoding','content-length','transfer-encoding'].includes(k))output[k]=v});
  res.writeHead(response.status,output);res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(502,{'content-type':'application/json'}).end(JSON.stringify({error:'Local QA upstream unavailable.'}));}
}).listen(8793,'127.0.0.1',()=>console.log('Local-only save fault proxy: http://127.0.0.1:8793; modes: pass / transient / permanent / disconnect in .wrangler/save-fault-mode.txt'));
