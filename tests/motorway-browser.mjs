// Real-browser integration check; database and submissions are disposable/local only.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {NetlifyDB} from '@netlify/database-dev';
import pg from 'pg';
import {chromium} from 'playwright';
const require=createRequire(import.meta.url);
const {setup}=require('../games/moonpie-motorway/tests/audit.cjs');
const db=new NetlifyDB();let server,browser,pool;
const port=Number(process.env.MOTORWAY_TEST_PORT||3187),origin=`http://localhost:${port}`,url=origin+'/play/moonpie-motorway';
let serverLog='';
try {
 const connectionString=await db.start();await db.applyMigrations('./netlify/database/migrations');pool=new pg.Pool({connectionString});
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--port',String(port)],{env:{...process.env,NETLIFY_DB_URL:connectionString},stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',x=>serverLog+=x);server.stderr.on('data',x=>serverLog+=x);
 let ready=false;for(let i=0;i<120;i++){try{if((await fetch(url)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert(ready,serverLog);
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.locator('#startBtn:not([disabled])').waitFor();
 await page.locator('#garageLeaderboard').click();await page.getByText('No finishers yet.',{exact:false}).waitFor();
 await page.locator('#closeLeaderboard').click();
 const sessionResponse=page.waitForResponse(r=>r.url().endsWith('/api/runs')&&r.request().method()==='POST');
 await page.locator('#startBtn').click();assert.equal((await sessionResponse).status(),201);
 await page.locator('#pauseBtn').click();await page.locator('#pauseModal').waitFor({state:'visible'});
 await page.locator('#pauseLeaderboard').click();assert(await page.locator('#leaderboardDialog').evaluate(x=>x.open));
 await page.keyboard.press('Escape');assert(await page.locator('#pauseModal').isVisible(),'closing board preserves pause');
 // Feed a real winning physics recording into the community UI, without waiting
 // three minutes or using timing-sensitive browser steering. Gameplay is paused.
 const {q}=await setup();const inputs=[];
 while(q.get().state==='racing'&&inputs.length<14000){const s=q.get(),threats=s.traffic.filter(c=>{const d=c.z-(s.z+1500);return d>-900&&d<8000;});const cost=lane=>threats.reduce((n,c)=>n+(Math.abs(c.x-lane)<.32?100:0),0)+Math.abs(lane-s.playerX)*2;const target=[-.6,0,.6].sort((a,b)=>cost(a)-cost(b))[0];q.keys.left=s.playerX>target+.025;q.keys.right=s.playerX<target-.025;inputs.push(q.input());q.update(1/60);}
 assert.equal(q.get().passed,45);
 // Start a new test browser identity to avoid the deliberate session throttle.
 await context.clearCookies();
 const recorded=page.waitForResponse(r=>r.url().endsWith('/api/runs')&&r.request().method()==='POST');
 await page.evaluate(()=>window.MotorwayCommunity.start('cup'));const run=await (await recorded).json();assert(run.id);
 await pool.query("UPDATE motorway_runs SET started_at=now()-interval '5 minutes' WHERE id=$1",[run.id]);
 await page.evaluate(({inputs,score})=>{for(const input of inputs)window.MotorwayCommunity.tick(input);window.MotorwayCommunity.finish({won:true,mode:'cup',score});document.querySelector('#pauseModal').hidden=true;document.querySelector('#resultsModal').hidden=false;}, {inputs,score:q.get().score});
 await page.locator('#racerNickname').fill('Browser Racer');await page.locator('#saveScoreBtn').click();await page.getByText('Your weekly best: #1',{exact:false}).waitFor({timeout:20000});
 await page.locator('#shareScoreBtn').click();assert((await page.locator('#facebookShare').getAttribute('href')).includes('mg251.xyz'));
 const downloadEvent=page.waitForEvent('download');await page.locator('#downloadScoreCard').click();const download=await downloadEvent;await mkdir('artifacts',{recursive:true});await download.saveAs('artifacts/motorway-browser-score.png');await page.locator('#closeShare').click();
 await page.locator('#resultsLeaderboard').click();await page.locator('#boardPodium .podium-name').waitFor();assert.equal(await page.locator('#boardPodium .podium-name').textContent(),'Browser Racer');
 for(const [name,width,height] of [['desktop',1440,1000],['phone',390,844],['landscape',844,390]]){await page.setViewportSize({width,height});await page.screenshot({path:`artifacts/motorway-leaderboard-${name}.png`,fullPage:true});assert(await page.locator('#leaderboardDialog').evaluate(x=>x.scrollWidth<=x.clientWidth),'dialog has no horizontal overflow: '+name);}
 await page.locator('#boardPeriod').selectOption('season');await page.locator('#boardPodium .podium-name').waitFor();await page.locator('#shareBoardBtn').click();assert((await page.locator('#facebookShare').getAttribute('href')).includes('board%3Dseason'));
 await page.locator('#closeShare').click();await page.locator('#closeLeaderboard').click();
 const metadata=await (await context.request.get(url+'?score='+run.id)).text();assert(metadata.includes('Browser Racer'));
 const card=await context.request.get(url+'/share.png?score='+run.id);assert.equal(card.status(),200);assert.equal(card.headers()['content-type'],'image/png');
 await page.route('**/api/leaderboard*',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Rankings temporarily unavailable'})}));
 await page.locator('#resultsLeaderboard').click();await page.getByText('Rankings temporarily unavailable',{exact:true}).waitFor();assert(await page.locator('#shareBoardBtn').isDisabled());assert.deepEqual(errors,[]);
 console.log('PASS: real Next route, local Postgres, browser score save, pause/dialog behavior, weekly/season rankings, mobile layouts, image download, metadata, and outage recovery.');
} catch(error){console.error(serverLog.slice(-5000));throw error;} finally {await browser?.close();if(server){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}await pool?.end();await db.stop();}
