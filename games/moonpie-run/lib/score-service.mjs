import {badgeProgress,EMPTY_STATS} from '../game/badges.mjs';
import {visitorProfile} from './visitor-profile.mjs';
import {leaderboardPeriod} from './leaderboard-period.mjs';
import {username,validateRun} from './run-rules.mjs';
const json=(data,status=200,cookie=null)=>Response.json(data,{status,headers:{'cache-control':'no-store',...(cookie?{'set-cookie':cookie}:{})}});
const statNames={coins:'coins',pies:'pies',ghosts:'ghosts',bonuses:'bonuses',routes:'routes',wins:'wins',perfectWins:'perfect_wins',maxChain:'max_chain',bestScore:'best_score',runs:'runs'};
const toStats=row=>Object.fromEntries(Object.entries(statNames).map(([k,col])=>[k,Number(row?.[col])||0]));
async function player(db,id){const p=await db.prepare('SELECT username FROM players WHERE user_id = ?').bind(id).first();if(!p)return null;const stats=toStats(await db.prepare('SELECT * FROM player_stats WHERE user_id = ?').bind(id).first());return{username:p.username,stats,badges:badgeProgress(stats)};}
const ranking=`WITH personal AS (SELECT c.*,ROW_NUMBER() OVER(PARTITION BY c.user_id ORDER BY c.score DESC,c.cleared_routes DESC,c.active_seconds ASC,c.finished_at ASC,c.run_id ASC) AS personal_rank FROM completed_runs c WHERE c.finished_at>=? AND c.finished_at<?), ranked AS (SELECT b.*,p.username,ROW_NUMBER() OVER(ORDER BY b.score DESC,b.cleared_routes DESC,b.active_seconds ASC,b.finished_at ASC,b.run_id ASC) AS rank FROM personal b JOIN players p ON p.user_id=b.user_id WHERE b.personal_rank=1) `;
async function leaderboard(db,id,scope){
 const period=leaderboardPeriod(scope),args=[period.start,period.end];
 const rows=await db.prepare(ranking+'SELECT r.*,s.coins,s.pies,s.ghosts,s.bonuses,s.routes,s.wins,s.perfect_wins,s.max_chain,s.best_score,s.runs FROM ranked r LEFT JOIN player_stats s ON s.user_id=r.user_id ORDER BY rank LIMIT 25').bind(...args).all();
 const clean=r=>({rank:r.rank,username:r.username,score:r.score,routes:r.cleared_routes,won:!!r.won,duration:r.active_seconds,badgeCount:badgeProgress(toStats(r)).filter(b=>b.earned).length});
 const me=id?await db.prepare(ranking+'SELECT r.*,s.* FROM ranked r LEFT JOIN player_stats s ON s.user_id=r.user_id WHERE r.user_id=?').bind(...args,id).first():null;
 const count=await db.prepare('SELECT COUNT(DISTINCT user_id) AS count FROM completed_runs WHERE finished_at>=? AND finished_at<?').bind(...args).first();
 return{period,entries:rows.results.map(clean),me:me?clean(me):null,totalPlayers:Number(count.count)};
}
async function body(req){if(Number(req.headers.get('content-length'))>16000)throw new Error('Request is too large.');const text=await req.text();if(text.length>16000)throw new Error('Request is too large.');try{return JSON.parse(text)}catch{throw new Error('Invalid request.')}}
async function digest(value){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(value)));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function handleScores(req,db){
 const url=new URL(req.url),path=url.pathname;let identity=null;const reply=(data,status=200)=>json(data,status,identity?.cookie);
 if(req.method==='POST'){
  const origin=req.headers.get('origin');if(origin&&origin!==url.origin)return json({error:'Please submit from the game page.'},403);
  if(req.headers.get('sec-fetch-site')==='cross-site')return json({error:'Please submit from the game page.'},403);
 }
 if(!db)return json({error:'Scores are temporarily unavailable. Your game can still continue.'},503);
 try{
  if(path==='/api/player'&&req.method==='GET'&&url.searchParams.has('username')){
   const name=username(url.searchParams.get('username')),found=await db.prepare('SELECT user_id FROM players WHERE username_key=?').bind(name.key).first();
   if(!found)return reply({error:'Player not found.'},404);
   const profile=await player(db,found.user_id),recent=await db.prepare('SELECT score,cleared_routes,won,active_seconds,finished_at FROM completed_runs WHERE user_id=? ORDER BY finished_at DESC,run_id DESC LIMIT 10').bind(found.user_id).all();
   return reply({profile:{...profile,recentRuns:recent.results.map(r=>({score:r.score,routes:r.cleared_routes,won:!!r.won,duration:r.active_seconds,finishedAt:new Date(r.finished_at).toISOString()}))}});
  }
  identity=await visitorProfile(req,db,{create:path==='/api/player'&&req.method==='GET'});const id=identity.id;
  if(req.method==='POST'&&!id)return reply({error:'Your browser could not restore your player profile. Refresh the game with cookies enabled.',needsProfile:true},401);
  const profile={signedIn:identity.signedIn,canSave:!!id,profileKind:identity.kind};
  if(path==='/api/player'&&req.method==='GET')return reply({...profile,player:await player(db,id)});
  if(path==='/api/leaderboard'&&req.method==='GET')return reply(await leaderboard(db,id,url.searchParams.get('scope')||'all'));
  if(path==='/api/player'&&req.method==='POST'){
   const name=username((await body(req)).username),now=Date.now();
   try{await db.prepare('INSERT INTO players (user_id,username,username_key,created_at,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET username=excluded.username,username_key=excluded.username_key,updated_at=excluded.updated_at').bind(id,name.name,name.key,now,now).run();}
   catch(e){if(String(e).includes('UNIQUE'))return reply({error:'That username is already taken. Try another.'},409);throw e;}
   return reply({...profile,player:await player(db,id)});
  }
  if(path==='/api/runs'&&req.method==='POST'){
   const now=Date.now(),recent=await db.prepare('SELECT COUNT(*) AS count FROM runs WHERE user_id=? AND started_at>?').bind(id,now-60000).first();
   if(recent.count>=10)return reply({error:'Please wait a moment before starting another ranked run.'},429);
   const runId=crypto.randomUUID();await db.prepare('INSERT INTO runs (id,user_id,started_at,rules_version) VALUES (?,?,?,?)').bind(runId,id,now,'1.6').run();return reply({runId},201);
  }
  if(path==='/api/runs/finish'&&req.method==='POST'){
   const raw=await body(req);if(typeof raw.runId!=='string')return reply({error:'Start a new run before saving.'},400);
   const stored=await db.prepare('SELECT * FROM runs WHERE id=? AND user_id=?').bind(raw.runId,id).first();if(!stored)return reply({error:'This run does not belong to your player profile.'},404);
   const now=Date.now(),result=validateRun(raw,((stored.finished_at||now)-stored.started_at)/1000),hash=await digest(result);
   if(stored.finished_at){if(stored.payload_digest!==hash)return reply({error:'This run has already been saved.'},409);return reply({saved:true,alreadySaved:true,player:await player(db,id)});}
   if(!await player(db,id))return reply({error:'Choose a username to save this run.',needsUsername:true},409);
   const won=result.won?1:0,perfect=won&&!result.livesLost?1:0;
   try{
    await db.batch([
     db.prepare('UPDATE runs SET finished_at=?,payload_digest=? WHERE id=? AND user_id=? AND finished_at IS NULL').bind(now,hash,raw.runId,id),
     db.prepare('INSERT INTO completed_runs (run_id,user_id,score,cleared_routes,lives_lost,won,active_seconds,finished_at,payload_json) VALUES (?,?,?,?,?,?,?,?,?)').bind(raw.runId,id,result.score,result.routes,result.livesLost,won,result.duration,now,JSON.stringify(result)),
     db.prepare(`INSERT INTO player_stats (user_id,coins,pies,ghosts,bonuses,routes,wins,perfect_wins,max_chain,best_score,runs) VALUES (?,?,?,?,?,?,?,?,?,?,1) ON CONFLICT(user_id) DO UPDATE SET coins=player_stats.coins+excluded.coins,pies=player_stats.pies+excluded.pies,ghosts=player_stats.ghosts+excluded.ghosts,bonuses=player_stats.bonuses+excluded.bonuses,routes=player_stats.routes+excluded.routes,wins=player_stats.wins+excluded.wins,perfect_wins=player_stats.perfect_wins+excluded.perfect_wins,max_chain=MAX(player_stats.max_chain,excluded.max_chain),best_score=MAX(player_stats.best_score,excluded.best_score),runs=player_stats.runs+1`).bind(id,result.coins,result.pies,result.ghosts,result.bonuses,result.routes,won,perfect,result.maxChain,result.score)
    ]);
   }catch(e){const existing=await db.prepare('SELECT payload_digest FROM runs WHERE id=? AND finished_at IS NOT NULL').bind(raw.runId).first();if(existing?.payload_digest!==hash)throw e;}
   return reply({saved:true,player:await player(db,id)});
  }
  return reply({error:'Not found.'},404);
 }catch(e){
  const message=String(e?.message||e);
  if(message.includes('could not be verified')||message.startsWith('Use 2–20')||['Choose All time, Today or This week.','Enter a username.','Invalid request.','Request is too large.'].includes(message))return reply({error:message},400);
  console.error('Score service failed:',message);return reply({error:'Scores could not be saved right now. Please try again.'},503);
 }
}
