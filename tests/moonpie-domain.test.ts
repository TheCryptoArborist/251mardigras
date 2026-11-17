import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GET,POST} from '../src/app/arcade/moonpie-run/[[...path]]/route';
const root='https://mg251.xyz/arcade/moonpie-run';
const context=(path:string[]=[])=>({params:Promise.resolve({path})});

test('serve the game under MG251 and scope score calls to the game path',async()=>{
 const original=globalThis.fetch;
 try{
 globalThis.fetch=async()=>new Response('<html><head></head><body>game</body></html>',{headers:{'content-type':'text/html'}});
 const html=await GET(new Request(root),context());assert.equal(html.status,200);assert.equal(html.headers.get('location'),null);assert.match(await html.text(),/<base href="\/arcade\/moonpie-run\/">/);
 globalThis.fetch=async()=>new Response('fetch(path,{method:"GET"})',{headers:{'content-type':'text/javascript'}});
 assert.match(await (await GET(new Request(root+'/progress.js'),context(['progress.js']))).text(),/fetch\('\/arcade\/moonpie-run'\+path,/);
 }finally{globalThis.fetch=original}
});

test('forward only the game profile and keep its cookie under the game path',async()=>{
 const original=globalThis.fetch;let seen:RequestInit|undefined;
 try{
 globalThis.fetch=async(_url,init)=>{seen=init;return new Response('{}',{headers:{'set-cookie':`moonpie-player=${'b'.repeat(64)}; Path=/; HttpOnly; SameSite=Lax; Secure`}})};
 const response=await POST(new Request(root+'/api/player',{method:'POST',headers:{origin:'https://mg251.xyz',cookie:`admin=private; moonpie-player=${'a'.repeat(64)}`,'oai-authenticated-user-id':'spoof'},body:'{}'}),context(['api','player']));
 assert.equal(response.status,200);const headers=new Headers(seen?.headers);assert.equal(headers.get('cookie'),`moonpie-player=${'a'.repeat(64)}`);assert.equal(headers.get('oai-authenticated-user-id'),null);assert.equal(headers.get('origin'),'https://moonpie-run-mobile.arborist63.chatgpt.site');assert.match(response.headers.get('set-cookie')!,/Path=\/arcade\/moonpie-run; HttpOnly/);assert.equal(response.headers.get('cache-control'),'no-store');
 }finally{globalThis.fetch=original}
});

test('reject foreign writes, unknown paths and redirects without forwarding a browser',async()=>{
 const original=globalThis.fetch;let calls=0;
 try{
 globalThis.fetch=async()=>{calls++;return new Response(null,{status:302,headers:{location:'https://example.org/'}})};
 assert.equal((await POST(new Request(root+'/api/player',{method:'POST',headers:{origin:'https://example.org'},body:'{}'}),context(['api','player']))).status,403);
 assert.equal((await GET(new Request(root+'/anything'),context(['anything']))).status,404);assert.equal(calls,0);
 const response=await GET(new Request(root),context());assert.equal(response.status,502);assert.equal(response.headers.get('location'),null);
 }finally{globalThis.fetch=original}
});
