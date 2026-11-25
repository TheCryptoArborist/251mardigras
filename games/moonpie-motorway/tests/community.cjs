const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),script=fs.readFileSync(path.join(root,'dist/community.js'),'utf8'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
for(const match of script.matchAll(/\$\('([^']+)'\)/g))assert(html.includes(`id="${match[1]}"`),`missing element ${match[1]}`);
function setup(unavailable=false){
 const nodes={},requests=[],shared=[];let paused=0;
 const node=id=>nodes[id]??={id,hidden:false,disabled:false,value:'',textContent:'',children:[],listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},replaceChildren(){this.children=[];},append(child){this.children.push(child);},showModal(){this.open=true;},close(){this.open=false;}};
 const score={id:'26f2a66c-4daa-42ba-9b16-9f5ae658546b',nickname:'Port Racer',score:760,ticks:10985};
 const board={entries:[{...score,rank:2}],personal:{...score,rank:2},next:{score:800}};
 const box={window:{MotorwayGame:{pause(){paused++;}}},document:{getElementById:node,createElement:()=>node('created'+Math.random())},location:{search:''},URLSearchParams,URL,AbortSignal,navigator:{share:async value=>shared.push(value),clipboard:{writeText:async value=>shared.push(value)}},localStorage:{getItem:()=>'',setItem(){}},setTimeout,fetch:async(url,options)=>{
  requests.push({url,body:options.body?JSON.parse(options.body):null});
  if(unavailable)return new Response('<html>private preview</html>',{status:404,headers:{'content-type':'text/html'}});
  return Response.json(url==='api/runs'?{id:score.id}:url==='api/runs/finish'?{score}:board);
 }};
 vm.runInNewContext(script,box);return {box,nodes,requests,shared,paused:()=>paused};
}
(async()=>{
 const {box,nodes,requests,shared,paused}=setup(),game=box.window.MotorwayCommunity;
 game.start('cup');for(let i=0;i<3;i++)game.tick({turn:0,brake:false,boost:false});game.tick({turn:1,brake:false,boost:true});game.finish({mode:'cup',won:true,score:760});
 assert.equal(nodes.saveScoreForm.hidden,false);nodes.racerNickname.value='Port Racer';await nodes.saveScoreForm.listeners.submit({preventDefault(){}});
 const finish=requests.find(r=>r.url==='api/runs/finish').body;assert.equal(finish.ticks,4);assert.equal(JSON.stringify(finish.controls),JSON.stringify([[0,0,0,0],[3,1,0,1]]));assert.equal(finish.score,undefined);
 assert.equal(nodes.saveScoreForm.hidden,true);assert.equal(nodes.shareScoreBtn.hidden,false);assert(nodes.rankStatus.textContent.includes('#2'));
 nodes.shareScoreBtn.listeners.click();await nodes.nativeShare.listeners.click();assert(shared[0].url.startsWith('https://mg251.xyz/play/moonpie-motorway?score='));assert(nodes.facebookShare.href.startsWith('https://www.facebook.com/sharer/'));
 nodes.garageLeaderboard.listeners.click();await new Promise(r=>setImmediate(r));assert.equal(paused(),1);assert.equal(nodes.leaderboardDialog.open,true);assert.equal(nodes.boardPodium.children.length,1);
 nodes.shareBoardBtn.listeners.click();await nodes.copyShare.listeners.click();assert.equal(shared.at(-1),'https://mg251.xyz/play/moonpie-motorway?board=week&card=race-trophies-1');
 nodes.shareSpotBtn.listeners.click();await nodes.copyCaption.listeners.click();assert(shared.at(-1).includes('#2 on the weekly'));assert(shared.at(-1).includes('?score='));assert(nodes.smsShare.href.startsWith('sms:'));assert(nodes.whatsappShare.href.includes('mg251.xyz'));
 nodes.shareTone.value='playful';nodes.shareTone.listeners.change();assert(nodes.shareDescription.textContent.includes('All throws, no luck'));
 const native=box.navigator.share;box.navigator.share=undefined;nodes.shareSpotBtn.listeners.click();assert(nodes.nativeShare.hidden);box.navigator.share=native;
 game.start('cruise');game.finish({mode:'cruise',won:true,score:40});assert.equal(nodes.saveScoreForm.hidden,true);assert(nodes.rankStatus.textContent.includes('just for fun'));assert.equal(nodes.shareScoreBtn.hidden,false);nodes.shareScoreBtn.listeners.click();await nodes.copyCaption.listeners.click();assert(shared.at(-1).includes('Unranked run'));assert(!shared.at(-1).includes('?score='));
 const offline=setup(true);offline.box.window.MotorwayCommunity.start('cup');offline.box.window.MotorwayCommunity.finish({mode:'cup',won:true});offline.nodes.racerNickname.value='Port Racer';await offline.nodes.saveScoreForm.listeners.submit({preventDefault(){}});assert(offline.nodes.rankStatus.textContent.includes('not available on this preview'));assert.equal(offline.nodes.saveScoreBtn.disabled,false);
 console.log('PASS: finish-screen submission, input recording, rank feedback, leaderboard, MG251 share links, Cruise exclusion, and unavailable-service recovery.');
})().catch(e=>{console.error(e);process.exitCode=1;});

// Business boards must appear once per stage without entering the parade count.
(async()=>{const {setup}=require('./audit.cjs');const {q}=await setup();const s=q.get();for(const id of ['lemon','pops']){const boards=s.scenery.filter(o=>o.business===id);require('node:assert/strict').equal(boards.length,3);require('node:assert/strict').deepEqual(Array.from(boards,b=>b.section),[0,1,2]);}const nick=s.scenery.filter(o=>o.business==='nicknacks');assert.equal(nick.length,1);assert.equal(nick[0].section,0);require('node:assert/strict').equal(s.billboards.length,45);console.log('PASS: Lemon and Pop’s appear in all three stages, NickNacks appears in stage one; parade count preserved.');})().catch(e=>{console.error(e);process.exitCode=1;});
