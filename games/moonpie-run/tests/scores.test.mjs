import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {handleScores} from '../lib/score-service.mjs';
import {validateRun} from '../lib/run-rules.mjs';
import {badgeProgress} from '../game/badges.mjs';
function database(){
 const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');for(const entry of JSON.parse(readFileSync(new URL('../drizzle/meta/_journal.json',import.meta.url),'utf8')).entries)sql.exec(readFileSync(new URL('../drizzle/'+entry.tag+'.sql',import.meta.url),'utf8'));
 const db={sql,prepare(query){let args=[];return{bind(...values){args=values;return this},async first(){return sql.prepare(query).get(...args)||null},async all(){return{results:sql.prepare(query).all(...args)}},async run(){return sql.prepare(query).run(...args)}}},async batch(list){sql.exec('BEGIN');try{const results=[];for(const q of list)results.push(await q.run());sql.exec('COMMIT');return results}catch(e){sql.exec('ROLLBACK');throw e}}};return db;
}
async function call(db,path,user,data,{cookie}={}){const headers={};if(cookie)headers.cookie=cookie;if(user)headers['oai-authenticated-user-id']=user;if(data){headers['content-type']='application/json';headers.origin='https://game.test'}const response=await handleScores(new Request('https://game.test'+path,{method:data?'POST':'GET',headers,...(data?{body:JSON.stringify(data)}:{})}),db);return{status:response.status,body:await response.json(),cookie:response.headers.get('set-cookie'),cache:response.headers.get('cache-control')};}
async function run(db,user,fields={}){const created=await call(db,'/api/runs',user,{});assert.equal(created.status,201);db.sql.prepare('UPDATE runs SET started_at=? WHERE id=?').run(Date.now()-250000,created.body.runId);return{runId:created.body.runId,score:450,duration:10,livesLost:3,outcome:'gameover',coins:20,pies:1,ghosts:1,bonuses:0,routes:0,maxChain:1,capturePoints:200,powerChains:[1],routeTimes:[],...fields};}
const victory={score:10610,duration:210,livesLost:0,outcome:'win',coins:506,pies:12,ghosts:0,bonuses:0,routes:3,maxChain:0,capturePoints:0,powerChains:Array(12).fill(0),routeTimes:[60,70,80]};
test('username ownership, case-insensitive uniqueness, rename and public privacy',async()=>{
 const db=database();assert.equal((await call(db,'/api/player',null,{username:'Who'})).status,401);assert.equal((await call(db,'/api/player','a',{username:'MoonPiePilot'})).status,200);assert.equal((await call(db,'/api/player','b',{username:'moonpiepilot'})).status,409);assert.equal((await call(db,'/api/player','b',{username:'<script>'})).status,400);
 const p=await run(db,'a');assert.equal((await call(db,'/api/runs/finish','b',p)).status,404);assert.equal((await call(db,'/api/runs/finish','a',p)).status,200);assert.equal((await call(db,'/api/player','a',{username:'DauphinAce'})).status,200);
 const board=(await call(db,'/api/leaderboard','a')).body;assert.equal(board.entries[0].username,'DauphinAce');assert.equal(board.totalPlayers,1);assert(!JSON.stringify(board).includes('user_id'));assert(!JSON.stringify(board).includes('runId'));db.sql.close();
});
test('a completed run saves once and retries never duplicate stats or badges',async()=>{
 const db=database();await call(db,'/api/player','a',{username:'MoonPiePilot'});const p=await run(db,'a');const first=await call(db,'/api/runs/finish','a',p);assert.equal(first.status,200);assert.equal(first.body.player.stats.runs,1);assert.equal(first.body.player.badges.filter(b=>b.earned).length,3);
 const again=await call(db,'/api/runs/finish','a',p);assert.equal(again.status,200);assert(again.body.alreadySaved);assert.equal(again.body.player.stats.coins,20);assert.equal(again.body.player.stats.runs,1);assert.equal((await call(db,'/api/runs/finish','a',{...p,score:99999})).status,400);db.sql.close();
});
test('choose a username after a run, then save the same pending run',async()=>{
 const db=database(),p=await run(db,'a');const before=await call(db,'/api/runs/finish','a',p);assert.equal(before.status,409);assert(before.body.needsUsername);await call(db,'/api/player','a',{username:'SweetRunner'});assert.equal((await call(db,'/api/runs/finish','a',p)).status,200);db.sql.close();
});
test('a confirmed score can be retried after the original submission window closes',async()=>{
 const db=database();await call(db,'/api/player','a',{username:'RetryRunner'});const p=await run(db,'a');
 assert.equal((await call(db,'/api/runs/finish','a',p)).status,200);
 // Move both recorded timestamps into the past, preserving the accepted run's wall time.
 db.sql.prepare('UPDATE runs SET started_at=started_at-10800000,finished_at=finished_at-10800000 WHERE id=?').run(p.runId);
 const retry=await call(db,'/api/runs/finish','a',p);assert.equal(retry.status,200);assert(retry.body.alreadySaved);assert.equal(retry.body.player.stats.runs,1);db.sql.close();
});
test('rank best runs, keep one entry per player, and retain lifetime achievements',async()=>{
 const db=database();await call(db,'/api/player','a',{username:'DauphinAce'});await call(db,'/api/player','b',{username:'RoyalRunner'});
 await call(db,'/api/runs/finish','a',await run(db,'a'));await call(db,'/api/runs/finish','b',await run(db,'b',victory));
 let board=(await call(db,'/api/leaderboard','a')).body;assert.equal(board.entries[0].username,'RoyalRunner');assert.equal(board.me.rank,2);
 let saved=await call(db,'/api/runs/finish','a',await run(db,'a',victory));assert.equal(saved.status,200);assert(saved.body.player.badges.find(b=>b.id==='untouchable').earned);assert.equal(saved.body.player.stats.runs,2);assert.equal(saved.body.player.stats.coins,526);
 board=(await call(db,'/api/leaderboard','a')).body;assert.equal(board.entries.length,2);assert.equal(board.me.score,10610);assert.equal(board.entries.filter(r=>r.username==='DauphinAce').length,1);
 assert(!badgeProgress({pies:24}).find(b=>b.id==='sweet_tooth').earned);assert(badgeProgress({pies:25}).find(b=>b.id==='sweet_tooth').earned);db.sql.close();
});
test('reject impossible scores, speed, route totals, lives, and cross-origin posts',async()=>{
 const base={...victory};assert.equal(validateRun(base,230).won,true);
 for(const invalid of [{...base,score:base.score+1},{...base,duration:1},{...base,coins:505},{...base,livesLost:4},{...base,outcome:'gameover'},{...base,routeTimes:[0,0,0]}])assert.throws(()=>validateRun(invalid,230));
 const db=database(),req=new Request('https://game.test/api/player',{method:'POST',headers:{origin:'https://other.test','oai-authenticated-user-id':'a'},body:JSON.stringify({username:'Test'})});assert.equal((await handleScores(req,db)).status,403);db.sql.close();
});

async function visitor(db){const response=await call(db,'/api/player');assert.equal(response.status,200);return{...response,cookie:response.cookie.split(';')[0]};}
test('visitors get an opaque browser profile without an account and restore it on return',async()=>{
 const db=database(),first=await visitor(db);assert.equal(first.body.signedIn,false);assert.equal(first.body.canSave,true);assert.equal(first.body.profileKind,'visitor');assert.equal(first.body.player,null);assert.equal(first.cache,'no-store');
 const raw=await call(db,'/api/player');assert(raw.cookie.includes('HttpOnly'));assert(raw.cookie.includes('SameSite=Lax'));assert(raw.cookie.includes('Secure'));
 const row=db.sql.prepare('SELECT * FROM visitor_profiles LIMIT 1').get();assert(!first.cookie.includes(row.token_hash));assert(!JSON.stringify(first.body).includes(row.user_id));
 const saved=await call(db,'/api/player',null,{username:'GuestCollector'},first);assert.equal(saved.status,200);assert.equal(saved.body.signedIn,false);
 const restored=await call(db,'/api/player',null,null,first);assert.equal(restored.body.player.username,'GuestCollector');assert.equal(restored.cookie,null);db.sql.close();
});
test('visitor runs can finish before choosing a name and save once afterward',async()=>{
 const db=database(),guest=await visitor(db),started=await call(db,'/api/runs',null,{},guest);assert.equal(started.status,201);
 db.sql.prepare('UPDATE runs SET started_at=? WHERE id=?').run(Date.now()-25000,started.body.runId);
 const payload={runId:started.body.runId,score:450,duration:10,livesLost:3,outcome:'gameover',coins:20,pies:1,ghosts:1,bonuses:0,routes:0,maxChain:1,capturePoints:200,powerChains:[1],routeTimes:[]};
 assert((await call(db,'/api/runs/finish',null,payload,guest)).body.needsUsername);
 await call(db,'/api/player',null,{username:'MoonPieVisitor'},guest);const saved=await call(db,'/api/runs/finish',null,payload,guest);assert.equal(saved.status,200);assert.equal(saved.body.player.stats.runs,1);assert.equal(saved.body.player.badges.filter(b=>b.earned).length,3);
 const retry=await call(db,'/api/runs/finish',null,payload,guest);assert(retry.body.alreadySaved);assert.equal(retry.body.player.stats.runs,1);
 const restored=await call(db,'/api/player',null,null,guest);assert.equal(restored.body.player.stats.bestScore,450);const board=(await call(db,'/api/leaderboard',null,null,guest)).body;assert.equal(board.me.rank,1);assert.equal(board.entries[0].username,'MoonPieVisitor');assert(!JSON.stringify(board).includes('visitor_'));db.sql.close();
});
test('a second browser cannot claim a visitor name, score, or private profile',async()=>{
 const db=database(),a=await visitor(db),b=await visitor(db);await call(db,'/api/player',null,{username:'OriginalVisitor'},a);
 assert.equal((await call(db,'/api/player',null,{username:'originalvisitor'},b)).status,409);assert.equal((await call(db,'/api/player',null,null,b)).body.player,null);
 const runId=(await call(db,'/api/runs',null,{},a)).body.runId;assert.equal((await call(db,'/api/runs/finish',null,{runId},b)).status,404);
 const tampered={cookie:a.cookie.slice(0,-1)+(a.cookie.endsWith('f')?'a':'f')};assert.equal((await call(db,'/api/player',null,{username:'Hijacked'},tampered)).status,401);
 assert.equal((await call(db,'/api/player',null,null,a)).body.player.username,'OriginalVisitor');db.sql.close();
});
test('signed-in records remain attached to the original account when a visitor cookie exists',async()=>{
 const db=database(),guest=await visitor(db);await call(db,'/api/player',null,{username:'BrowserPlayer'},guest);await call(db,'/api/player','existing-account',{username:'AccountPlayer'});
 const account=await call(db,'/api/player','existing-account',null,guest);assert.equal(account.body.profileKind,'account');assert.equal(account.body.signedIn,true);assert.equal(account.body.player.username,'AccountPlayer');assert.equal((await call(db,'/api/player',null,null,guest)).body.player.username,'BrowserPlayer');db.sql.close();
});
test('expired cookies cannot write records and cross-site writes are rejected',async()=>{
 const db=database(),guest=await visitor(db);await call(db,'/api/player',null,{username:'OldVisitor'},guest);db.sql.prepare('UPDATE visitor_profiles SET expires_at=?').run(Date.now()-1);
 assert.equal((await call(db,'/api/runs',null,{},guest)).status,401);const fresh=await call(db,'/api/player',null,null,guest);assert.equal(fresh.body.player,null);assert(fresh.cookie);
 const req=new Request('https://game.test/api/player',{method:'POST',headers:{cookie:fresh.cookie.split(';')[0],'sec-fetch-site':'cross-site','content-type':'application/json'},body:JSON.stringify({username:'CrossSite'})});assert.equal((await handleScores(req,db)).status,403);db.sql.close();
});

test('period rankings filter runs before selecting each player best and preserve lifetime badges',async()=>{
 const db=database();await call(db,'/api/player','a',{username:'ParadeAce'});await call(db,'/api/player','b',{username:'WeeklyRunner'});
 const {leaderboardPeriod}=await import('../lib/leaderboard-period.mjs'),today=leaderboardPeriod('daily'),week=leaderboardPeriod('weekly');
 const old=await run(db,'a',victory);await call(db,'/api/runs/finish','a',old);db.sql.prepare('UPDATE completed_runs SET finished_at=? WHERE run_id=?').run(week.start-1,old.runId);
 const daily=await run(db,'a');await call(db,'/api/runs/finish','a',daily);
 const weekly=await run(db,'b');await call(db,'/api/runs/finish','b',weekly);db.sql.prepare('UPDATE completed_runs SET finished_at=? WHERE run_id=?').run(week.start,weekly.runId);
 const day=(await call(db,'/api/leaderboard?scope=daily','a')).body;
 assert.equal(day.me.score,450);assert.equal(day.period.timeZone,'America/Chicago');assert.equal(day.period.resetsAt,new Date(today.end).toISOString());assert(day.me.badgeCount>3,'lifetime badges are retained on a daily entry');
 const all=(await call(db,'/api/leaderboard','a')).body;assert.equal(all.me.score,10610);
 const weeklyBoard=(await call(db,'/api/leaderboard?scope=weekly','a')).body;assert.equal(weeklyBoard.totalPlayers,2);assert.equal(weeklyBoard.me.score,450);
 db.sql.prepare('UPDATE completed_runs SET finished_at=? WHERE run_id=?').run(today.end,daily.runId);
 const boundary=(await call(db,'/api/leaderboard?scope=daily','a')).body;assert.equal(boundary.me,null);
 assert.equal((await call(db,'/api/leaderboard?scope=invalid','a')).status,400);db.sql.close();
});

test('public passports expose only named stats, earned badges and recent score summaries',async()=>{
 const db=database();await call(db,'/api/player','secret-account-id',{username:'Public Runner'});await call(db,'/api/runs/finish','secret-account-id',await run(db,'secret-account-id'));
 const publicView=await call(db,'/api/player?username=public%20runner');assert.equal(publicView.status,200);assert.equal(publicView.cookie,null);assert.equal(publicView.body.profile.username,'Public Runner');assert.equal(publicView.body.profile.stats.runs,1);assert.equal(publicView.body.profile.recentRuns[0].score,450);
 const encoded=JSON.stringify(publicView.body);for(const privateField of ['secret-account-id','runId','token','payload','user_id'])assert(!encoded.includes(privateField));
 assert.equal(db.sql.prepare('SELECT COUNT(*) AS n FROM visitor_profiles').get().n,0,'reading a public passport does not create a visitor profile');
 assert.equal((await call(db,'/api/player?username=Unknown')).status,404);db.sql.close();
});
