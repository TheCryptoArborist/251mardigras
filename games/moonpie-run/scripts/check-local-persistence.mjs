// Real HTTP + local D1 integration; never point this at a deployed game.
import assert from 'node:assert/strict';
import {RunOutbox} from '../game/run-outbox.mjs';
const origin='http://127.0.0.1:8791';
const suffix=crypto.randomUUID().replaceAll('-','').slice(0,10);
function client(){
 let cookie='';
 return async function call(path,data,expected=200){
  const response=await fetch(origin+path,{redirect:'error',method:data?'POST':'GET',headers:{...(cookie?{cookie}:{}),...(data?{'content-type':'application/json',origin}: {})},...(data?{body:JSON.stringify(data)}:{})});
  const set=response.headers.get('set-cookie');if(set)cookie=set.split(';')[0];
  const text=await response.text();
  assert(response.headers.get('content-type')?.includes('application/json'),`${path}: ${response.status} ${text.slice(0,150)}`);
  const result=JSON.parse(text);
  assert.equal(response.status,expected,`${path} status: ${result.error||'unexpected response'}`);
  assert.equal(response.headers.get('cache-control'),'no-store');
  return result;
 };
}
const a=client(),b=client();
assert.equal((await a('/api/player')).profileKind,'visitor');
await b('/api/player');
const name='QA'+suffix,renamed='QR'+suffix;
await a('/api/player',{username:name});
await b('/api/player',{username:name.toLowerCase()},409);
assert.equal((await b('/api/player')).player,null);
await a('/api/player',{username:renamed});
assert.equal((await a('/api/player')).player.username,renamed);
const makeRun=async()=>({runId:(await a('/api/runs',{},201)).runId,score:10,duration:1,livesLost:0,outcome:'retired',coins:1,pies:0,ghosts:0,bonuses:0,routes:0,maxChain:0,capturePoints:0,powerChains:[],routeTimes:[]});
const first=await makeRun();
// Parallel duplicate HTTP requests exercise actual D1 transaction serialization.
await Promise.all([a('/api/runs/finish',first),a('/api/runs/finish',first)]);
await b('/api/runs/finish',first,404);
assert.equal((await a('/api/player')).player.stats.runs,1);
assert.equal((await a('/api/player')).player.stats.coins,1);
assert.equal((await a('/api/runs/finish',first)).alreadySaved,true);
await a('/api/runs/finish',{...first,score:20,coins:2},409);
console.log('PASS profile creation/rename, independent cookie ownership, parallel duplicate finish and changed-payload rejection');

// Exercise the unmodified client queue against HTTP, with an in-memory
// Storage implementation. Browser sessionStorage/lifecycle remains separate QA.
const values=new Map();const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
let queue=new RunOutbox(storage);
const lost=await makeRun(),next=await makeRun();
queue.add({payload:lost});queue.add({payload:next});
await queue.drain(async payload=>{await a('/api/runs/finish',payload);throw new Error('Simulated response loss after server commit');});
assert.equal(queue.items.length,2);
assert.equal((await a('/api/player')).player.stats.runs,2);
queue=new RunOutbox(storage);const saved=[];
await queue.drain(p=>a('/api/runs/finish',p),(item,result)=>saved.push(result));
assert.equal(saved[0].alreadySaved,true);
assert.equal(queue.items.length,0);
assert.equal((await a('/api/player')).player.stats.runs,3);
assert.equal((await a('/api/player')).player.stats.coins,3);
console.log('PASS response-loss recovery, queue restoration and two-score drain without duplicate lifetime increments');

const invalid={...await makeRun(),score:99999},valid=await makeRun();
queue.add({payload:invalid});queue.add({payload:valid});
const errors=[];
await queue.drain(async p=>{
 if(p.runId===invalid.runId){const result=await a('/api/runs/finish',p,400);throw Object.assign(new Error(result.error),{status:400});}
 return a('/api/runs/finish',p);
},()=>{},item=>errors.push(item.error));
assert.equal(queue.items.length,1);assert.equal(queue.items[0].blocked,true);assert.match(errors[0],/could not be verified/);
assert.equal((await a('/api/player')).player.stats.runs,4);
const publicView=await b('/api/player?username='+renamed);
assert.equal(publicView.profile.recentRuns.length,4);
assert.equal(publicView.profile.stats.coins,4);
for(const field of ['user_id','runId','token','payload','visitor_'])assert(!JSON.stringify(publicView).includes(field));
assert.equal(publicView.profile.badges.length,12);
assert.deepEqual(publicView.profile.badges.filter(x=>x.earned).map(x=>x.id),['first_throw']);
for(const scope of ['daily','weekly','all']){
 const board=await a('/api/leaderboard?scope='+scope);
 assert.equal(board.me.username,renamed);assert.equal(board.me.score,10);
 assert.equal(board.period.timeZone,'America/Chicago');
}
console.log('PASS permanent-error retention with later successful score, public privacy/recent runs/badges and all ranking scopes');
console.log('Local fixtures retained under '+renamed+'; no production database used.');
