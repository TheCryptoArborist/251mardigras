import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { getRules, validateControls, verifyReplay } from './motorway-replay';
import { motorwayDB, rankings } from './motorway-rankings';
const COOKIE='motorway-player';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function playerHash(request:Request){const value=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);return value&&/^[a-f0-9]{64}$/.test(value)?createHash('sha256').update(value).digest('hex'):null;}
export function nickname(value:unknown){if(typeof value!=='string'||!/^[A-Za-z0-9][A-Za-z0-9 _-]{2,19}$/.test(value.trim())||/^(admin|moderator|mg251|official)$/i.test(value.trim()))throw Error('Use a nickname of 3–20 letters, numbers, spaces, dashes or underscores.');return value.trim();}
function json(data:unknown,status=200,headers:Record<string,string>={}){return Response.json(data,{status,headers:{'cache-control':'no-store',...headers}});}
async function body(request:Request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw Error('Send JSON.');
 const reader=request.body?.getReader();if(!reader)throw Error('Missing request.');let size=0;const chunks=[];
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>400000){await reader.cancel();throw Error('Recording is too large.');}chunks.push(value);}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function publicScore(id:string){if(!uuid.test(id))return null;const {rows}=await motorwayDB().pool.query('SELECT id,nickname,score,ticks,season,finished_at FROM motorway_runs WHERE id=$1 AND finished_at IS NOT NULL AND hidden=false',[id]);return rows[0]||null;}
export async function motorwayAPI(request:Request,resource:string){
 try {
  const url=new URL(request.url),hash=playerHash(request),rules=await getRules();
  if(request.method==='GET'){
   if(resource==='api/leaderboard')return json(await rankings(rules.season,url.searchParams.get('period')||'week',hash||undefined));
   if(resource.startsWith('api/scores/')){const score=await publicScore(resource.slice(11));return score?json(score):json({error:'Score not found.'},404);}
   return json({error:'Not found.'},404);
  }
  if(request.method!=='POST')return json({error:'Method not allowed.'},405);
  if(request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'Please submit from the game page.'},403);
  if(!['api/runs','api/runs/finish'].includes(resource))return json({error:'Not found.'},404);
  const data=await body(request);
  if(!data||typeof data!=='object'||Array.isArray(data))return json({error:'Invalid request.'},400);
  if(resource==='api/runs'){
   if(data.mode!=='cup')return json({error:'Ranked runs use Carnival Cup.'},400);
   const token=randomBytes(32).toString('hex'),identity=hash||createHash('sha256').update(token).digest('hex'),id=randomUUID();
   const client=await motorwayDB().pool.connect();
   try{
    await client.query('BEGIN');await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[identity]);
    const {rows}=await client.query("SELECT count(*)::int AS count,max(started_at) AS latest FROM motorway_runs WHERE player_hash=$1 AND started_at>now()-interval '1 hour'",[identity]);
    if(rows[0].count>=30||(rows[0].latest&&Date.now()-new Date(rows[0].latest).getTime()<10000)){await client.query('ROLLBACK');return json({error:'Please wait before starting another ranked run.'},429);}
    await client.query('INSERT INTO motorway_runs(id,player_hash,rules_hash,season) VALUES($1,$2,$3,$4)',[id,identity,rules.hash,rules.season]);await client.query('COMMIT');
   }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
   return json({id,rules:rules.hash},201,hash?{}:{'set-cookie':`${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/play/moonpie-motorway; Max-Age=31536000${url.protocol==='https:'?'; Secure':''}`});
  }
  if(!hash||!uuid.test(data.id||''))return json({error:'Start a new ranked Cup run first.'},400);
  const name=nickname(data.nickname);validateControls(data.ticks,data.controls);
  const db=motorwayDB();const {rows}=await db.pool.query('SELECT * FROM motorway_runs WHERE id=$1 AND player_hash=$2',[data.id,hash]);const run=rows[0];
  if(!run)return json({error:'Run not found.'},404);
  if(run.finished_at)return json({score:await publicScore(run.id)});
  const wall=Date.now()-new Date(run.started_at).getTime();
  if(wall>7200000||wall<data.ticks*1000/60-1500||run.rules_hash!==rules.hash)return json({error:'This run expired or the game was updated. Start a new Cup run.'},409);
  const attempt=await db.pool.query("UPDATE motorway_runs SET attempts=attempts+1,last_attempt_at=now() WHERE id=$1 AND player_hash=$2 AND finished_at IS NULL AND attempts<5 AND (last_attempt_at IS NULL OR last_attempt_at<now()-interval '10 seconds') RETURNING id",[run.id,hash]);
  if(!attempt.rows.length)return json({error:'Please wait 10 seconds before retrying. After five unsuccessful checks, start a new Cup run.'},429);
  let result;try{result=await verifyReplay(data.ticks,data.controls);}catch{return json({error:'The server could not verify a completed Cup run. Please try a new run.'},422);}
  await db.pool.query('UPDATE motorway_runs SET nickname=$1,score=$2,ticks=$3,finished_at=now() WHERE id=$4 AND player_hash=$5 AND finished_at IS NULL',[name,result.score,result.ticks,run.id,hash]);
  return json({score:await publicScore(run.id)});
 }catch(error){
  if(error instanceof SyntaxError||error instanceof Error&&/Invalid|Missing|Send JSON|too large|nickname|initial controls/.test(error.message))return json({error:error.message},400);
  console.error('Motorway leaderboard unavailable:',error instanceof Error?error.message:'unknown error');
  return json({error:'Rankings are temporarily unavailable. You can still play; try saving again shortly.'},503);
 }
}
