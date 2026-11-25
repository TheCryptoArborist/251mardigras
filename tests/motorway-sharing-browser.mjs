// Synthetic standings and OS-share adapters; never submits to a live leaderboard.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
const root=resolve('games/moonpie-motorway/dist');
const server=createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+'/'))throw Error();const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff':'font/woff'})[extname(file)]||'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
const entries=Array.from({length:25},(_,i)=>({id:'score-'+i,rank:i+1,nickname:i===0?'MoonPie Monarch':'Port Racer '+(i+1),score:1200-i*20,ticks:10000+i*10}));
try{
 await mkdir('artifacts',{recursive:true});
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
  await context.addInitScript(mobile=>{window.shares=[];window.copied=[];Object.defineProperty(navigator,'share',{configurable:true,value:mobile?async(data)=>{window.shares.push({text:data.text,url:data.url,files:data.files?.map(f=>({name:f.name,type:f.type,size:f.size}))});}:undefined});Object.defineProperty(navigator,'canShare',{value:()=>mobile});Object.defineProperty(navigator,'clipboard',{value:{writeText:async(text)=>window.copied.push(text)}});},mobile);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const personal=mobile?{...entries[7],id:'outside-top25',rank:32}:entries[7];
  await page.route('**/api/leaderboard?*',route=>route.fulfill({json:{entries,personal,next:entries[6],total:80}}));
  await page.goto(origin);await page.locator('#startBtn:not([disabled])').waitFor();await page.locator('#garageLeaderboard').click();await page.locator('.podium-card').first().waitFor();
  assert.equal(await page.locator('.podium-card').count(),3);assert.equal(await page.locator('#boardRows tr').count(),22);assert.equal(await page.locator('.rank-elite').count(),7);assert.equal(await page.locator('.rank-chaser').count(),15);
  assert(await page.locator('#leaderboardDialog').evaluate(e=>e.scrollWidth<=e.clientWidth));await page.screenshot({path:`artifacts/sharing-board-${mobile?'mobile':'desktop'}.png`});
  await page.locator('#shareSpotBtn').click();assert.match(await page.locator('#shareDescription').textContent(),new RegExp('#'+personal.rank+' on the weekly'));assert.match(await page.locator('#shareLink').inputValue(),new RegExp('mg251.xyz.*score='+personal.id));
  await page.locator('#copyCaption').click();assert.match(await page.evaluate(()=>window.copied.at(-1)),/Your move.*\nhttps:\/\/mg251.xyz/s);
  for(const selector of ['#facebookShare','#smsShare','#whatsappShare','#xShare','#emailShare'])assert((await page.locator(selector).getAttribute('href')).includes('mg251.xyz'));
  await page.locator('#shareTone').selectOption('playful');assert.match(await page.locator('#shareDescription').textContent(),/All throws, no luck/);
  await page.screenshot({path:`artifacts/sharing-options-${mobile?'mobile':'desktop'}.png`});assert(await page.locator('#shareDialog').evaluate(e=>e.scrollWidth<=e.clientWidth));
  if(mobile){await page.locator('#nativeShare').click();await page.locator('#instagramShare').click();const shares=await page.evaluate(()=>window.shares);assert.equal(shares.length,2);assert(shares[1].files[0].size>1000);assert.equal(shares[1].files[0].type,'image/png');assert(shares[1].url.includes('?score='));}
  else{assert(await page.locator('#nativeShare').isHidden());const download=page.waitForEvent('download');await page.locator('#instagramShare').click();await(await download).saveAs('artifacts/sharing-score-card.png');}
  await page.locator('#closeShare').click();await page.locator('#shareBoardBtn').click();const download=page.waitForEvent('download');await page.locator('#downloadScoreCard').click();await(await download).saveAs('artifacts/sharing-top25-card.png');
  await page.locator('#closeShare').click();await page.locator('#closeLeaderboard').click();
  await page.evaluate(()=>{window.MotorwayCommunity.start('cruise');window.MotorwayCommunity.finish({mode:'cruise',won:true,score:235});document.querySelector('#resultsModal').hidden=false;});await page.locator('#shareScoreBtn').click();assert.match(await page.locator('#shareDescription').textContent(),/Unranked run/);assert.equal(await page.locator('#shareLink').inputValue(),'https://mg251.xyz/play/moonpie-motorway');
  assert.deepEqual(errors,[]);await context.close();
 }
 console.log('PASS: top-25 tiers, mobile/desktop layouts, ranked and unranked sharing, captions, direct platform links, native file sharing, and image downloads.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
