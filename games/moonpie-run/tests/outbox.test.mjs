import test from 'node:test';
import assert from 'node:assert/strict';
import {RunOutbox} from '../game/run-outbox.mjs';
const storage=()=>{const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)}};
const item=id=>({localId:'local-'+id,payload:{runId:id,score:450}});
test('migrates a waiting run, restores several runs, and deduplicates IDs',()=>{
 const s=storage();s.setItem('moonpie-pending-run',JSON.stringify(item('a')));const q=new RunOutbox(s);q.add(item('b'));q.add(item('a'));
 assert.equal(s.getItem('moonpie-pending-run'),null);assert.deepEqual(new RunOutbox(s).items.map(p=>p.payload.runId),['a','b']);
});
test('a new run added during saving is drained, and concurrent saves share one request',async()=>{
 const q=new RunOutbox(storage());q.add(item('a'));let release;const gate=new Promise(r=>release=r),sent=[],saved=[];
 const send=async p=>{sent.push(p.runId);if(p.runId==='a')await gate;return{saved:true}};
 const first=q.drain(send,p=>saved.push(p.payload.runId));q.add(item('b'));assert.equal(q.drain(send),first);release();await first;
 assert.deepEqual(sent,['a','b']);assert.deepEqual(saved,['a','b']);assert.equal(q.items.length,0);
});
test('a connection error keeps all scores through reload until confirmed',async()=>{
 const s=storage(),q=new RunOutbox(s);q.add(item('a'));q.add(item('b'));let calls=0;
 await q.drain(async()=>{calls++;throw new Error('Offline')});assert.equal(calls,1);assert.equal(q.items.length,2);assert(!q.items[0].blocked);
 const restored=new RunOutbox(s),saved=[];await restored.drain(async p=>({alreadySaved:p.runId==='a'}),p=>saved.push(p.payload.runId));
 assert.deepEqual(saved,['a','b']);assert.equal(new RunOutbox(s).items.length,0);
});
test('permanent validation failures remain visible while later valid runs save',async()=>{
 const q=new RunOutbox(storage());q.add(item('a'));q.add(item('b'));const saved=[];
 await q.drain(async p=>{if(p.runId==='a')throw Object.assign(new Error('Run expired'),{status:400});return{saved:true}},p=>saved.push(p.payload.runId));
 assert.deepEqual(saved,['b']);assert.equal(q.items[0].payload.runId,'a');assert(q.items[0].blocked);q.dismiss('a');assert.equal(q.items.length,0);
});
test('choosing a username and temporary server errors are retryable',async()=>{
 for(const error of [Object.assign(new Error('Choose username'),{status:409,needsUsername:true}),Object.assign(new Error('Busy'),{status:503})]){
  const q=new RunOutbox(storage());q.add(item('a'));await q.drain(async()=>{throw error});assert(!q.items[0].blocked);q.dismiss('a');assert.equal(q.items.length,1);await q.drain(async()=>({saved:true}));assert.equal(q.items.length,0);
 }
});
