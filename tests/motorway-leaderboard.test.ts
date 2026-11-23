import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';

import { motorwayAPI, nickname, playerHash } from '../src/lib/motorway-api';
import { motorwayDB, rankings } from '../src/lib/motorway-rankings';
import { getRules, validateControls, verifyReplay } from '../src/lib/motorway-replay';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {setup}=require('../games/moonpie-motorway/tests/audit.cjs');
async function winningRecording(){
 const {q}=await setup();let previous='',ticks=0;const controls:any[]=[];
 while(q.get().state==='racing'&&ticks<14000){
  const s=q.get(),threats=s.traffic.filter((c:any)=>{const d=c.z-(s.z+1500);return d>-900&&d<8000;});
  const cost=(lane:number)=>threats.reduce((n:number,c:any)=>n+(Math.abs(c.x-lane)<.32?100:0),0)+Math.abs(lane-s.playerX)*2;
  const target=[-.6,0,.6].sort((a,b)=>cost(a)-cost(b))[0];q.keys.left=s.playerX>target+.025;q.keys.right=s.playerX<target-.025;
  const input=q.input(),row=[input.turn,input.brake?1:0,input.boost?1:0],key=row.join(',');if(key!==previous){controls.push([ticks,...row]);previous=key;}q.update(1/60);ticks++;
 }
 assert.equal(q.get().passed,45);assert.equal(q.get().lives,3);return {ticks,controls,expectedScore:q.get().score};
}
test('recordings are validated and actual Cup physics determines score',async()=>{
 for(const bad of [[],[[0,Infinity,0,0]],[[0,2,0,0]],[[1,0,0,0]],[[0,0,0,0],[0,0,0,0]]])assert.throws(()=>validateControls(10,bad));
 assert.throws(()=>nickname('<script>'));assert.throws(()=>nickname('admin'));
 await assert.rejects(verifyReplay(100,[[0,0,0,0]]));
 const run=await winningRecording();const result=await verifyReplay(run.ticks,run.controls);assert.equal(result.score,run.expectedScore);assert.equal(result.parades,45);
});
test('durable rankings: sessions, replay verification, retries, player best, periods, ownership',async()=>{
 const {NetlifyDB}=await import('@netlify/database-dev');const local=new NetlifyDB();const previous=process.env.NETLIFY_DB_URL;
 try{
  process.env.NETLIFY_DB_URL=await local.start();await local.applyMigrations('./netlify/database/migrations');
  const origin='http://localhost:3000';
  const send=(resource:string,data?:unknown,cookie='',originHeader=origin)=>motorwayAPI(new Request(origin+'/play/moonpie-motorway/'+resource,{method:data?'POST':'GET',headers:{origin:originHeader,'content-type':'application/json',cookie},body:data?JSON.stringify(data):undefined}),resource.split('?')[0]);
  assert.equal((await send('api/runs',{mode:'cup'},'','https://other.example')).status,403);
  assert.equal((await send('api/runs',{mode:'cruise'})).status,400);
  const start=await send('api/runs',{mode:'cup'});assert.equal(start.status,201);const {id}=await start.json();const cookie=start.headers.get('set-cookie')!.split(';')[0];assert(cookie);
  assert.equal((await send('api/runs',{mode:'cup'},cookie)).status,429);
  const recording=await winningRecording();
  assert.equal((await send('api/runs/finish',{id,nickname:'Moon Racer',...recording},cookie)).status,409,'cannot finish before real elapsed time');
  await motorwayDB().pool.query("UPDATE motorway_runs SET started_at=now()-interval '5 minutes' WHERE id=$1",[id]);
  const payload={id,nickname:'Moon Racer',ticks:recording.ticks,controls:recording.controls,score:999999};
  const result=await send('api/runs/finish',payload,cookie);assert.equal(result.status,200);assert.equal((await result.json()).score.score,recording.expectedScore,'client score ignored');
  const again=await send('api/runs/finish',payload,cookie);assert.equal(again.status,200);assert.equal((await again.json()).score.id,id);
  assert.equal((await send('api/runs/finish',payload)).status,400);
  const second=await send('api/runs',{mode:'cup'});const stranger=second.headers.get('set-cookie')!.split(';')[0];assert.equal((await send('api/runs/finish',payload,stranger)).status,404);
  const {season}=await getRules();let board=await rankings(season,'week');assert.equal(board.entries.length,1);assert.equal(board.entries[0].nickname,'Moon Racer');assert(!JSON.stringify(board).includes('player_hash'));
  await motorwayDB().pool.query("INSERT INTO motorway_runs(id,player_hash,rules_hash,season,started_at,finished_at,nickname,score,ticks) SELECT gen_random_uuid(),'competitor-'||i,$1,$2,now()-interval '5 minutes',now(),'Racer '||i,$3+i,11000 FROM generate_series(1,30) i",[(await getRules()).hash,season,recording.expectedScore]);
  const personal=await rankings(season,'week',playerHash(new Request(origin,{headers:{cookie}}))!);assert.equal(personal.total,31);assert.equal(personal.entries.length,25);assert.equal(personal.personal?.rank,31);assert.equal(personal.next?.rank,30);assert.equal(personal.next?.score,recording.expectedScore+1);
  await motorwayDB().pool.query("DELETE FROM motorway_runs WHERE player_hash LIKE 'competitor-%'");
  const otherId=(await second.json()).id;await motorwayDB().pool.query("UPDATE motorway_runs SET started_at=now()-interval '3 hours' WHERE id=$1",[otherId]);assert.equal((await send('api/runs/finish',{...payload,id:otherId},stranger)).status,409);
  await motorwayDB().pool.query("INSERT INTO motorway_runs(id,player_hash,rules_hash,season,started_at,finished_at,nickname,score,ticks) SELECT gen_random_uuid(),player_hash,rules_hash,season,started_at,now(),'Second best',score-5,ticks FROM motorway_runs WHERE id=$1",[id]);
  board=await rankings(season,'season');assert.equal(board.entries.length,1,'one best per racer');assert.equal(board.entries[0].id,id);
  await motorwayDB().pool.query("UPDATE motorway_runs SET finished_at=now()-interval '14 days' WHERE finished_at IS NOT NULL");
  assert.equal((await rankings(season,'week')).entries.length,0);assert.equal((await rankings(season,'season')).entries.length,1);
  await motorwayDB().pool.query('UPDATE motorway_runs SET hidden=true WHERE finished_at IS NOT NULL');assert.equal((await rankings(season,'season')).entries.length,0);
 }finally{await motorwayDB().pool.end();if(previous===undefined)delete process.env.NETLIFY_DB_URL;else process.env.NETLIFY_DB_URL=previous;await local.stop();}
});
