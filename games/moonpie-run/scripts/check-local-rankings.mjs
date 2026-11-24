// Seed only a fresh, isolated local D1, then verify the built HTTP API.
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {leaderboardPeriod} from '../lib/leaderboard-period.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const fixtureRoot=path.join(root,'.wrangler','ranking-qa-'+crypto.randomUUID());
await mkdir(fixtureRoot,{recursive:true});
const wrangler=path.join(root,'node_modules/wrangler/bin/wrangler.js');
const preload=new URL('../scripts/sites-env.mjs',import.meta.url).href;
const run=args=>{
 const result=spawnSync(process.execPath,['--import',preload,wrangler,...args],{cwd:root,encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,result.stderr||'Local Wrangler command failed');
};
run(['d1','migrations','apply','DB','--config','wrangler.local.jsonc','--local','--persist-to',fixtureRoot]);
const now=Date.now(),daily=leaderboardPeriod('daily',now),weekly=leaderboardPeriod('weekly',now);
const statements=[];
const quote=s=>"'"+String(s).replaceAll("'","''")+"'";
function player(id){
 statements.push(`INSERT INTO players VALUES (${quote(id)},${quote(id)},${quote(id.toLowerCase())},0,0);`);
 // Deliberately deterministic lifetime fixtures: every medal earned, even
 // when the selected period contains only a small run.
 statements.push(`INSERT INTO player_stats (user_id,coins,pies,ghosts,bonuses,routes,wins,perfect_wins,max_chain,best_score,runs) VALUES (${quote(id)},1000,25,50,1,3,1,1,4,200,12);`);
}
function completed(id,user,{score=100,duration=10,time=daily.start,routes=0}={}){
 statements.push(`INSERT INTO runs (id,user_id,started_at,finished_at,rules_version) VALUES (${quote(id)},${quote(user)},${time-100000},${time},'1.6');`);
 statements.push(`INSERT INTO completed_runs VALUES (${quote(id)},${quote(user)},${score},${routes},0,0,${duration},${time},'{}');`);
}
for(const id of ['TieA','TieB','Earlier','Faster','MoreRoutes','History','DailyBefore','DailyEnd','WeeklyBefore','WeeklyStart','WeeklyEnd'])player(id);
completed('a-tie','TieA',{time:daily.start+1});completed('b-tie','TieB',{time:daily.start+1});
completed('early','Earlier');
completed('fast','Faster',{duration:9});completed('routes','MoreRoutes',{routes:1});
completed('old-high','History',{score:200,time:weekly.start-1});
completed('current-low','History',{score:50});
completed('day-before','DailyBefore',{time:daily.start-1});
completed('day-end','DailyEnd',{time:daily.end});
completed('week-before','WeeklyBefore',{time:weekly.start-1});
completed('week-start','WeeklyStart',{time:weekly.start});
completed('week-end','WeeklyEnd',{time:weekly.end});
player('Recent');
for(let i=0;i<12;i++)completed('recent-'+String(i).padStart(2,'0'),'Recent',{score:i,time:daily.start+Math.floor(i/2)});
const sqlPath=path.join(fixtureRoot,'fixtures.sql');await writeFile(sqlPath,statements.join('\n'));
run(['d1','execute','DB','--config','wrangler.local.jsonc','--local','--persist-to',fixtureRoot,'--file',sqlPath]);
const server=spawn(process.execPath,['--import',preload,wrangler,'dev','--config','dist/server/wrangler.json','--local','--persist-to',fixtureRoot,'--ip','127.0.0.1','--port','8792','--inspector-port','0'],{cwd:root,windowsHide:true,stdio:['pipe','pipe','pipe']});
let logs='';server.stdout.on('data',d=>{logs=(logs+d).slice(-16000)});server.stderr.on('data',d=>{logs=(logs+d).slice(-16000)});
const origin='http://127.0.0.1:8792';
async function get(endpoint){const response=await fetch(origin+endpoint,{redirect:'error'});assert.equal(response.status,200);return response.json();}
try{
 for(let i=0;!logs.includes('Ready on http://127.0.0.1:8792');i++){
  assert.equal(server.exitCode,null,'Local Worker exited before readiness');assert(i<100,'Local Worker readiness timeout');
  await new Promise(r=>setTimeout(r,100));
 }
 for(const scope of ['daily','weekly','all']){
  const period=leaderboardPeriod(scope,now),board=await get('/api/leaderboard?scope='+scope);
  assert.equal(board.period.start,period.start,'Period changed during test; rerun');assert.equal(board.period.end,period.end);
  assert.equal(board.period.timeZone,'America/Chicago');
  const entries=board.entries,find=id=>entries.find(e=>e.username===id);
  assert.equal(find('History').score,scope==='all'?200:50);
  assert.equal(find('History').badgeCount,12,'Lifetime medals survive period filtering');
  assert.equal(entries.filter(e=>e.username==='History').length,1);
  const ordered=entries.filter(e=>['MoreRoutes','Faster','Earlier','TieA','TieB'].includes(e.username)).map(e=>e.username);
  assert.deepEqual(ordered,['MoreRoutes','Faster','Earlier','TieA','TieB']);
  assert.deepEqual(entries.map(e=>e.rank),entries.map((_,i)=>i+1));
  for(const [name,time] of [['DailyBefore',daily.start-1],['DailyEnd',daily.end],['WeeklyBefore',weekly.start-1],['WeeklyStart',weekly.start],['WeeklyEnd',weekly.end]]){
   assert.equal(!!find(name),time>=period.start&&time<period.end,scope+' '+name);
  }
  assert.equal(board.totalPlayers,entries.length);
  console.log('PASS '+scope+': inclusive start/exclusive end, personal best, lifetime medals, tie order and player count');
 }
 const recent=(await get('/api/player?username=Recent')).profile;
 assert.deepEqual(recent.recentRuns.map(r=>r.score),[11,10,9,8,7,6,5,4,3,2]);
 assert.equal(recent.badges.filter(b=>b.earned).length,12);
 console.log('PASS public recent runs: newest first, ten-run limit, twelve earned medals');
 console.log('Isolated local fixtures retained at '+fixtureRoot);
}finally{
 if(process.platform==='win32')spawnSync('taskkill',['/PID',String(server.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});
 else server.kill('SIGTERM');
}
