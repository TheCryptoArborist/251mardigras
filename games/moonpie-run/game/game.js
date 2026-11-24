'use strict';
(() => {
const art=window.MobileArt;
const progress=window.MoonPieProgress||{begin(){},track(){},finish(){}};
let panelOpen=false,activeTime=0,suspended=false;
const DEATH_HOLD=.28,DEATH_FOLD=window.MoonPieAudio.DEATH_SECONDS||1.14,DEATH_TAIL=.36,CAPTURE_HOLD=.68;
let deathTime=0,deathSoundStarted=false,capture=null,eatPause=0,modeClock=0,ghostMode='scatter';
const C=23,R=25,T=24,canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id),dirs={left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}},opposite={left:'right',right:'left',up:'down',down:'up'};
const routes=[{name:'DAUPHIN STREET',subtitle:'The downtown dash',speed:5.3,enemy:3.65,power:8},{name:'BIENVILLE SQUARE',subtitle:'A little park-side mischief',speed:5.5,enemy:4.05,power:7},{name:'WATERFRONT FINALE',subtitle:'One last haul for the Port City',speed:5.65,enemy:4.35,power:6}];
let state='title',level=0,score=0,lives=3,best=0,map=[],items=new Map(),total=0,player,enemies=[],powerTime=0,chain=0,elapsed=0,roundTime=0,phaseTime=0,invincible=0,bonus=null,bonusSpawned=false,particles=[],popups=[],toastTime=0,last=0,soundOn=false;
try{best=Number(localStorage.getItem('moonpie-run-best-v1'))||0;soundOn=localStorage.getItem('moonpie-run-sound-v1')==='on';}catch{}
best=Math.max(best,progress.base?.bestScore||0);
document.addEventListener('moonpie:profile',e=>{best=Math.max(best,e.detail.bestScore||0);try{localStorage.setItem('moonpie-run-best-v1',String(best));}catch{}updateHUD();});
const sound=new window.MoonPieAudio({enabled:soundOn});
function key(x,y){return y*C+x;}
function open(x,y){return x>=0&&x<C&&y>=0&&y<R&&map[y][x]===0;}
function routeScenery(n){
 let buildings=[[2,2,5,6],[8,2,7,6],[16,2,5,6],[2,9,5,7],[16,9,5,7],[2,17,5,6],[8,17,7,6],[16,17,5,6]];
 if(n===1)buildings=[[2,2,5,6],[8,2,3,6],[12,2,3,6],[16,2,5,6],[2,9,5,7],[16,9,5,3],[16,13,5,3],[2,17,5,6],[8,18,7,5],[16,17,5,6]];
 if(n===2)buildings=[[2,2,5,6],[8,2,7,5],[16,2,5,6],[2,9,5,3],[2,13,5,3],[16,9,5,3],[16,13,5,3],[2,17,5,6],[8,17,3,6],[12,17,3,6],[16,17,5,6]];
 return{buildings,park:[8,9,7,7]};
}
function createMap(n){
 const grid=Array.from({length:R},(_,y)=>Array.from({length:C},(_,x)=>x===0||y===0||x===C-1||y===R-1?1:0));
 const scene=routeScenery(n);
 for(const [x,y,w,h] of [...scene.buildings,scene.park])for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++)grid[row][col]=1;
 return grid;
}
function actor(x,y,speed,dir='left'){return{x,y,fromX:x,fromY:y,toX:x,toY:y,progress:0,moving:false,dir,want:dir,speed,chomp:0};}
function resetActors(){player=actor(11,23,routes[level].speed);enemies=[actor(7,12,routes[level].enemy,'left'),actor(11,8,routes[level].enemy*.96,'up'),actor(15,12,routes[level].enemy*.93,'right'),actor(11,16,routes[level].enemy*.90,'down')];enemies.forEach((e,i)=>{e.id=i;e.release=1.8+i*1.4;e.returning=false;});powerTime=0;chain=0;invincible=2.5;deathTime=0;deathSoundStarted=false;eatPause=0;capture=null;modeClock=0;ghostMode='scatter';}
function setupRound(){map=createMap(level);items=new Map();for(let y=1;y<R-1;y++)for(let x=1;x<C-1;x++)if(open(x,y)&&!(x===11&&y===23))items.set(key(x,y),'coin');[[1,1],[21,1],[1,23],[21,23]].forEach(([x,y])=>items.set(key(x,y),'pie'));total=items.size;roundTime=0;bonus=null;bonusSpawned=false;particles=[];popups=[];resetActors();updateHUD();}
function addScore(n){score+=n;if(score>best){best=score;try{localStorage.setItem('moonpie-run-best-v1',String(best));}catch{}}updateHUD();}
function updateHUD(){
 $('score').textContent=String(score).padStart(6,'0');$('best').textContent=String(best).padStart(6,'0');$('route-number').innerHTML=String(level+1).padStart(2,'0')+' <em>/ 03</em>';$('route-name').textContent=routes[level].name;
 $('lives').textContent='◆ '.repeat(Math.max(0,lives)).trim()||'—';$('lives').setAttribute('aria-label',lives+' lives remaining');$('beads-left').textContent=state==='title'?'READY TO ROLL':items.size+' TO COLLECT';const p=total?Math.round((total-items.size)/total*100):0;$('route-fill').style.width=p+'%';$('progress-percent').textContent=p+'%';$('progress-label').textContent=state==='title'?'THE THROWS ARE WAITING':'ROUTE '+(level+1)+' COLLECTION';
 $('pause').disabled=!['playing','paused','ready'].includes(state);$('pause').innerHTML=state==='paused'?'▶ <span>RESUME</span>':'Ⅱ <span>PAUSE</span>';$('pause').setAttribute('aria-label',state==='paused'?'Resume game':'Pause game');
}
function showOverlay(content){$('overlay-content').innerHTML=content;$('overlay').classList.remove('hidden');$('overlay').classList.toggle('is-results',content.includes('id="run-recap"'));$('game-window').classList.toggle('show-results',content.includes('id="run-recap"'));$('game-window').classList.add('show-overlay');$('overlay').scrollTop=0;}
const maskArt='<svg class="overlay-art" viewBox="0 0 100 82" aria-hidden="true"><path d="M46 43L81 20A37 37 0 1 0 81 66Z" fill="#ffd866"/><path d="M9 17Q27 7 43 19Q60 7 77 17L68 32Q54 41 43 28Q27 41 16 31Z" fill="#8436b9" stroke="#ffe4a1" stroke-width="2"/><ellipse cx="28" cy="23" rx="9" ry="5" fill="#ffe7a1"/><ellipse cx="57" cy="23" rx="9" ry="5" fill="#ffe7a1"/><ellipse cx="31" cy="23" rx="3" ry="4" fill="#341048"/><ellipse cx="60" cy="23" rx="3" ry="4" fill="#341048"/><circle cx="88" cy="43" r="6" fill="#efc45e" stroke="#ffe5a2" stroke-width="2"/></svg>';
function title(){state='title';setupRound();showOverlay(maskArt+'<span class="eyebrow">MOBILE, ALABAMA · AFTER DARK</span><h2>Let the good<br>times run.</h2><p>Collect the doubloons. Grab a MoonPie to chase the rascals. Clear all three parade routes.</p><button class="start-button" id="start">LET’S ROLL <span>→</span></button><span class="hint">ARROW KEYS / WASD · SWIPE ON MOBILE<br>3 LIVES · NO ACCOUNT NEEDED · JUST PLAY</span>');$('start').onclick=start;$('start').disabled=!art.readyToPlay;if(!art.readyToPlay)$('start').textContent='LOADING ARTWORK…';}
function finishTrackedRun(outcome){progress.finish({score,duration:activeTime,livesLost:3-lives,outcome});}
function runSaveMarkup(){return '<div class="run-save"><div id="run-recap" hidden></div><span id="run-save-status">Preparing your run…</span><button class="secondary" id="save-run">Leaderboard & badges →</button></div>';}
function wireRunSave(){$('save-run').onclick=()=>progress.open?.('leaderboard');}
function start(){if(!art.readyToPlay)return;document.querySelector('.arcade').classList.add('is-started');if(window.matchMedia?.('(max-width: 760px)').matches)document.querySelector('.arcade').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});if(['playing','paused','ready','dying','capture','roundwin'].includes(state))finishTrackedRun('retired');initAudio();level=0;score=0;lives=3;elapsed=0;activeTime=0;progress.begin();setupRound();ready('The parade is rolling!');}
function ready(msg,respawn=false){state='ready';phaseTime=respawn?1.25:2;showOverlay('<span class="eyebrow">ROUTE '+String(level+1).padStart(2,'0')+' · '+routes[level].name+'</span><h2>'+msg+'</h2><p>'+routes[level].subtitle+'</p><span class="hint">GET READY…</span>');if(!respawn)playJingle();updateHUD();}
function beginPlay(){initAudio();state='playing';$('overlay').classList.add('hidden');$('game-window').classList.remove('show-overlay');canvas.focus({preventScroll:true});updateHUD();syncAudio();}
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('visible');toastTime=2.5;}
function togglePause(){if(state==='playing'){state='paused';showOverlay(maskArt+'<span class="eyebrow">TAKE A BREATHER</span><h2>Parade break.</h2><p>Your throws are right where you left them.</p><button class="start-button" id="resume">KEEP ROLLING →</button><button class="secondary" id="restart">Restart run</button>');$('resume').onclick=togglePause;$('restart').onclick=start;}else if(state==='paused'){beginPlay();}updateHUD();syncAudio();}
function loseLife(){
 if(state==='dying'||state==='gameover')return;
 lives--;powerTime=0;eatPause=0;capture=null;state='dying';deathTime=0;deathSoundStarted=false;
 particles=[];popups=[];$('toast').classList.remove('visible');toastTime=0;sound.hush();updateHUD();syncAudio();
}
function showGameOver(){
 state='gameover';showOverlay(maskArt+'<span class="eyebrow">THAT’S A WRAP</span><h2>A good haul.<br>One more run?</h2><p>You bagged <b>'+score.toLocaleString()+'</b> points on route '+(level+1)+'. Your personal best is '+best.toLocaleString()+'.</p><button class="start-button" id="again">ROLL AGAIN →</button>'+runSaveMarkup());$('again').onclick=start;wireRunSave();finishTrackedRun('gameover');updateHUD();
}
function reverseEnemy(e){
 if(e.returning||e.release>0)return;
 e.dir=opposite[e.dir];
 if(e.moving){const x=e.fromX,y=e.fromY;e.fromX=e.toX;e.fromY=e.toY;e.toX=x;e.toY=y;e.progress=1-e.progress;}
 else e.reversePending=true;
}
function ghostPhase(time){
 const phases=[7,20,7,20,5,20,5];for(let i=0;i<phases.length;i++){if(time<phases[i])return i%2?'chase':'scatter';time-=phases[i];}return 'chase';
}
function activatePower(){
 powerTime=routes[level].power;chain=0;eatPause=.05;enemies.forEach(reverseEnemy);
 addScore(50);toast('MOONPIE POWER · Chase the rascals!');sound.event('power');progress.track('pie',{score});
}
function captureEnemy(e){
 chain++;const pts=200*Math.pow(2,Math.min(chain-1,3));addScore(pts);e.returning=true;
 capture={id:e.id,x:e.x,y:e.y,points:pts};state='capture';phaseTime=CAPTURE_HOLD;
 sound.event('capture',{chain});progress.track('ghost',{score,chain,points:pts});updateHUD();
}
function completeRound(){const timeBonus=Math.max(0,1500-Math.floor(roundTime)*5);addScore(500+timeBonus);progress.track('route',{score,time:roundTime});powerTime=0;state=level===2?'win':'roundwin';burst(11,12,70,'#f2cb73');playJingle(true);if(state==='win'){showOverlay(maskArt+'<span class="eyebrow">ALL THREE ROUTES CLEARED</span><h2>Royalty of<br>the Port City.</h2><p>'+score.toLocaleString()+' points. Every throw collected. The last MoonPie is yours.</p><button class="start-button" id="next">TAKE ANOTHER LAP →</button><span class="hint">PERSONAL BEST · '+best.toLocaleString()+'</span>'+runSaveMarkup());$('next').onclick=start;wireRunSave();finishTrackedRun('win');}else{showOverlay(maskArt+'<span class="eyebrow">ROUTE '+(level+1)+' COMPLETE</span><h2>That’s how<br>Mobile rolls.</h2><p>Route bonus: '+(500+timeBonus).toLocaleString()+' points.<br>Next stop: '+routes[level+1].name+'.</p><button class="start-button" id="next">NEXT PARADE ROUTE →</button>');$('next').onclick=()=>{level++;setupRound();ready('The chase continues.');};}updateHUD();}
function direction(d){if(!dirs[d])return;if(state==='title'||state==='gameover'||state==='win')return;player.want=d;}
function chooseEnemy(e){
 const options=Object.keys(dirs).filter(d=>open(Math.round(e.x)+dirs[d].x,Math.round(e.y)+dirs[d].y));let choices=options.filter(d=>d!==opposite[e.dir]);if(!choices.length)choices=options;
 if(e.reversePending){e.reversePending=false;if(choices.length&&open(Math.round(e.x)+dirs[e.dir].x,Math.round(e.y)+dirs[e.dir].y))return e.dir;}
 if(e.returning)return bestDirection(e,{x:11,y:8},choices,false);
 if(powerTime>0)return bestDirection(e,{x:player.x,y:player.y},choices,true);
 const scatter=ghostMode==='scatter';const corners=[{x:1,y:1},{x:21,y:1},{x:1,y:23},{x:21,y:23}];let target=scatter?corners[e.id]:{x:Math.round(player.x),y:Math.round(player.y)};
 if(!scatter&&e.id===1){const d=dirs[player.dir];target={x:Math.max(1,Math.min(21,target.x+d.x*4)),y:Math.max(1,Math.min(23,target.y+d.y*4))};}
 if(!scatter&&e.id===2){const d=dirs[player.dir],lead={x:player.x+d.x*2,y:player.y+d.y*2};target={x:Math.round(lead.x*2-enemies[0].x),y:Math.round(lead.y*2-enemies[0].y)};}
 if(!scatter&&e.id===3&&Math.hypot(e.x-player.x,e.y-player.y)<8)target=corners[3];
 return bestDirection(e,target,choices,false);
}
function bestDirection(e,target,choices,flee){
 // Breadth-first distances respect walls, unlike a straight-line chase.
 const tx=Math.round(target.x),ty=Math.round(target.y),dist=new Map(),queue=[];
 if(open(tx,ty)){dist.set(key(tx,ty),0);queue.push([tx,ty]);}
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const d of Object.values(dirs)){let nx=x+d.x,ny=y+d.y,k=key(nx,ny);if(open(nx,ny)&&!dist.has(k)){dist.set(k,dist.get(key(x,y))+1);queue.push([nx,ny]);}}}
 const ranked=choices.map(d=>{const p=dirs[d],x=Math.round(e.x)+p.x,y=Math.round(e.y)+p.y;let distance=dist.get(key(x,y));if(distance===undefined)distance=Math.hypot(x-target.x,y-target.y);return{d,value:distance};});ranked.sort((a,b)=>flee?b.value-a.value:a.value-b.value);return ranked[0]?.d||e.dir;
}
function moveActor(a,dt,isPlayer){
 if(isPlayer&&eatPause>0){eatPause=Math.max(0,eatPause-dt);return;}
 let distance=dt*(isPlayer?a.speed:a.returning?8.2:powerTime>0?a.speed*.62:a.speed);
 // Buffered turns occur at intersections; opposite inputs reverse immediately.
 if(isPlayer&&a.moving&&a.want===opposite[a.dir]){const x=a.fromX,y=a.fromY;a.fromX=a.toX;a.fromY=a.toY;a.toX=x;a.toY=y;a.progress=1-a.progress;a.dir=a.want;}
 let guard=0;while(distance>0&&guard++<8){
  if(!a.moving){const ix=Math.round(a.x),iy=Math.round(a.y);let d=isPlayer?a.want:chooseEnemy(a);if(!open(ix+dirs[d].x,iy+dirs[d].y)){if(isPlayer&&open(ix+dirs[a.dir].x,iy+dirs[a.dir].y))d=a.dir;else break;}
   a.dir=d;a.fromX=ix;a.fromY=iy;a.toX=ix+dirs[d].x;a.toY=iy+dirs[d].y;a.progress=0;a.moving=true;
  }
  const step=Math.min(distance,1-a.progress);a.progress+=step;distance=Math.max(0,distance-step);if(distance<1e-9)distance=0;if(isPlayer)a.chomp+=step*Math.PI*2;a.x=a.fromX+(a.toX-a.fromX)*a.progress;a.y=a.fromY+(a.toY-a.fromY)*a.progress;
  if(a.progress>=.999999){a.x=a.toX;a.y=a.toY;a.moving=false;a.progress=0;if(isPlayer)collect();else if(a.returning&&a.x===11&&a.y===8){a.returning=false;a.release=1.5;}if(state!=='playing'||isPlayer&&eatPause>0)break;}
 }
}
function collect(){const k=key(Math.round(player.x),Math.round(player.y)),item=items.get(k);if(item){items.delete(k);if(item==='pie'){activatePower();}else{eatPause=.016;addScore(10);sound.event('chomp');progress.track('coin',{score});}
 if(!bonusSpawned&&items.size<=total*.55){bonusSpawned=true;bonus={x:11,y:16,time:18};toast('GOLDEN DOUBLOON · Find it beside the fountain');}
 if(!items.size){completeRound();return;}updateHUD();}
 if(bonus&&Math.hypot(player.x-bonus.x,player.y-bonus.y)<.5){addScore(500);popups.push({x:player.x,y:player.y,text:'+500',life:1.4});burst(player.x,player.y,25,'#f9dc83');bonus=null;sound.event('bonus');progress.track('bonus',{score});toast('GOLDEN DOUBLOON · +500');}}
function burst(x,y,n,color){for(let i=0;i<n;i++)particles.push({x:(x+.5)*T,y:(y+.5)*T,vx:(Math.random()-.5)*150,vy:(Math.random()-.6)*150,life:.5+Math.random()*.7,color});}
function update(dt){
 if(panelOpen||suspended||document.hidden){syncAudio();return;}
 if(!['paused','capture','dying'].includes(state))elapsed+=dt;if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('toast').classList.remove('visible');}
 if(state==='dying'){
  deathTime+=dt;
  if(!deathSoundStarted&&deathTime>=DEATH_HOLD){deathSoundStarted=true;sound.event('death',{offset:deathTime-DEATH_HOLD});}
  if(deathTime>=DEATH_HOLD+DEATH_FOLD+DEATH_TAIL){if(lives<=0)showGameOver();else{resetActors();ready('Keep it rolling.',true);}}
  syncAudio();return;
 }
 if(state==='capture'){phaseTime-=dt;if(phaseTime<=0){state='playing';capture=null;updateHUD();}syncAudio();return;}
 if(state==='ready'){phaseTime-=dt;if(phaseTime<=0)beginPlay();}
 if(state==='playing'){
  roundTime+=dt;activeTime+=dt;if(powerTime<=0){modeClock+=dt;const next=ghostPhase(modeClock);if(next!==ghostMode){ghostMode=next;enemies.forEach(reverseEnemy);}}invincible=Math.max(0,invincible-dt);powerTime=Math.max(0,powerTime-dt);if(bonus){bonus.time-=dt;if(bonus.time<=0)bonus=null;}
  // Small fixed substeps prevent actors crossing through one another.
  const steps=Math.ceil(dt/(1/120));for(let s=0;s<steps&&state==='playing';s++){const sub=dt/steps;moveActor(player,sub,true);if(state!=='playing')break;for(const e of enemies){if(e.release>0)e.release-=sub;else moveActor(e,sub,false);if(Math.hypot(e.x-player.x,e.y-player.y)<.68&&!e.returning&&e.release<=0){if(powerTime>0){captureEnemy(e);break;}else if(invincible<=0){loseLife();break;}}}}
 }
 if(state!=='paused'){particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=65*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);popups.forEach(p=>{p.y-=dt*.7;p.life-=dt;});popups=popups.filter(p=>p.life>0);}
 $('power-fill').style.width=(powerTime/routes[level].power*100)+'%';$('power').classList.toggle('active',powerTime>0);$('power').classList.toggle('ending',powerTime>0&&powerTime<=2);$('power').querySelector('span').textContent=powerTime>0?'CHASE MODE · '+Math.ceil(powerTime)+'s':'MOONPIE POWER';document.querySelector('.arcade').classList.toggle('powered',powerTime>0);syncAudio();
}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
function drawDoubloon(x,y,r=4.3){
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#875325';ctx.beginPath();ctx.arc(.5,.7,r+.25,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#efc45e';ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#fff0ae';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(0,0,r-1,0,Math.PI*2);ctx.stroke();
 // Embossed carnival fleur and a milled edge read as coins rather than dots.
 ctx.fillStyle='#9a642e';ctx.beginPath();ctx.moveTo(0,-2.5);ctx.lineTo(1.25,-.5);ctx.lineTo(.55,.5);ctx.lineTo(2.3,-.3);ctx.lineTo(2.1,1.1);ctx.lineTo(.4,1.3);ctx.lineTo(.7,2.5);ctx.lineTo(-.7,2.5);ctx.lineTo(-.4,1.3);ctx.lineTo(-2.1,1.1);ctx.lineTo(-2.3,-.3);ctx.lineTo(-.55,.5);ctx.lineTo(-1.25,-.5);ctx.closePath();ctx.fill();
 ctx.fillStyle='#fff6c4';ctx.fillRect(-2.6,-2.3,1.2,.8);ctx.restore();
}
function drawPie(x,y,r=9){
 if(art.readyToPlay&&art.pie){art.pie(ctx,x,y,r);return;}
 ctx.save();ctx.translate(x,y);
 // Thick chocolate cookies with a visible marshmallow center.
 ctx.fillStyle='#4f2925';ctx.beginPath();ctx.ellipse(0,2.2,r,r*.75,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff0ce';ctx.beginPath();ctx.ellipse(0,.9,r*.96,r*.66,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#83502f';ctx.beginPath();ctx.ellipse(0,-1,r,r*.66,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#d4a05c';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,-1.6,r-1.6,r*.45,0,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle='#e8c184';for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.arc(Math.cos(a)*r*.5,-1.6+Math.sin(a)*r*.27,.7,0,Math.PI*2);ctx.fill();}
 ctx.fillStyle='#f7d997';ctx.font='bold 6px Georgia';ctx.textAlign='center';ctx.fillText('M',0,.6);ctx.restore();
}
function mouthOpening(a){return a.moving?[.015,.42,.82,.42][Math.floor((a.chomp%(Math.PI*2))/(Math.PI/2))]:.015;}
function bodyWedge(mouth){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,10.2,mouth,Math.PI*2-mouth);ctx.closePath();}
function deathPose(time){const t=Math.max(0,Math.min(1,(time-DEATH_HOLD)/DEATH_FOLD));return{fold:t,mouth:.015+(Math.PI-.015)*t,mask:Math.max(0,1-t*3.5),visible:time<DEATH_HOLD+DEATH_FOLD};}
function drawDyingPlayer(){
 if(deathTime<DEATH_HOLD){drawPlayer();return;}const pose=deathPose(deathTime);if(!pose.visible)return;
 ctx.save();ctx.translate((player.x+.5)*T,(player.y+.5)*T);ctx.rotate(-Math.PI/2);
 ctx.fillStyle='#ffd866';bodyWedge(pose.mouth);ctx.fill();
 ctx.save();ctx.clip();ctx.globalAlpha=pose.mask;drawCarnivalMask();ctx.restore();ctx.restore();
}
function drawPlayer(){
 const x=(player.x+.5)*T,y=(player.y+.5)*T;ctx.save();ctx.translate(x,y);
 if(invincible>0&&state==='playing')ctx.globalAlpha=.5+.5*Math.abs(Math.sin(elapsed*11));
 if(powerTime>0){ctx.strokeStyle='#ffe3a2';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,12+Math.sin(elapsed*10),0,Math.PI*2);ctx.stroke();}
 // The open wedge points along the current movement direction.
 if(player.dir==='left')ctx.scale(-1,1);else ctx.rotate({right:0,down:Math.PI/2,up:-Math.PI/2}[player.dir]);
 const mouth=state==='title'?.65:mouthOpening(player);
 ctx.shadowColor='#f2cb73';ctx.shadowBlur=powerTime>0?13:4;
 ctx.fillStyle='#ffd866';bodyWedge(mouth);ctx.fill();ctx.shadowBlur=0;drawCarnivalMask();ctx.restore();
}
function drawCarnivalMask(){
 // A full two-eye masquerade mask matches the approved purple-and-gold character.
 // Its wide silhouette stays readable at the actual 24-pixel game scale.
 ctx.fillStyle='#8436b9';ctx.strokeStyle='#ffe4a1';ctx.lineWidth=.7;
 ctx.beginPath();ctx.moveTo(-10.5,-8.5);
 ctx.quadraticCurveTo(-5.5,-11,0,-7.7);ctx.quadraticCurveTo(4.5,-10.8,10,-8.2);
 ctx.lineTo(7.7,-3.8);ctx.quadraticCurveTo(3.6,-1.8,0,-5.1);
 ctx.quadraticCurveTo(-4.6,-1.6,-8.5,-4.1);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle='#ffe7a1';ctx.beginPath();ctx.ellipse(-4.5,-6.3,2.55,1.55,-.1,0,Math.PI*2);ctx.ellipse(4,-6.3,2.55,1.55,.1,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#341048';ctx.beginPath();ctx.ellipse(-3.8,-6.2,.95,1.15,0,0,Math.PI*2);ctx.ellipse(4.7,-6.2,.95,1.15,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#ffe3a1';ctx.fillRect(-9,-8,1,1);ctx.fillRect(8,-7.6,1,1);
}
function frightenedAppearance(remaining,time){return remaining>0?{frightened:true,warning:remaining<=2,flash:remaining<=2&&Math.floor(remaining/.22)%2===0}:{frightened:false,warning:false,flash:false};}
function ghostOutline(id=0){
 // One continuous rounded head and a flowing, scalloped hem. No pointed ears.
 const ripple=Math.sin(elapsed*7+id)*1.1;
 ctx.beginPath();ctx.moveTo(-10,9);ctx.lineTo(-10,-1);
 ctx.bezierCurveTo(-10,-14,10,-14,10,-1);ctx.lineTo(10,9);
 ctx.quadraticCurveTo(7.5,5.6+ripple,5,9);
 ctx.quadraticCurveTo(2.5,5.6-ripple,0,9);
 ctx.quadraticCurveTo(-2.5,5.6+ripple,-5,9);
 ctx.quadraticCurveTo(-7.5,5.6-ripple,-10,9);ctx.closePath();
}
function ghostEyes(e,afraid=false){
 const d=dirs[e.dir]||dirs.left,eyeY=afraid?-2:-1.8;
 ctx.fillStyle='#fff8e7';ctx.beginPath();ctx.ellipse(-4.1,eyeY,3.35,4,0,0,Math.PI*2);ctx.ellipse(4.1,eyeY,3.35,4,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#38204f';ctx.beginPath();
 for(const x of [-4.1,4.1])ctx.ellipse(x+(afraid?0:d.x*1.25),eyeY+(afraid?.8:d.y*1.5),1.55,2,0,0,Math.PI*2);
 ctx.fill();
}
function drawFrightened(e,appearance){
 const flash=appearance.flash;ctx.fillStyle=flash?'#ffe3a0':'#5730a0';ghostOutline(e.id);ctx.fill();
 // Plain frightened eyes and a zigzag mouth replace the masked chase face.
 ctx.fillStyle=flash?'#5730a0':'#ffe7a1';ctx.fillRect(-5,-3,2.8,2.8);ctx.fillRect(2.2,-3,2.8,2.8);
 ctx.strokeStyle=flash?'#5730a0':'#ffe7a1';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-6,5);ctx.lineTo(-4,3);ctx.lineTo(-2,5);ctx.lineTo(0,3);ctx.lineTo(2,5);ctx.lineTo(4,3);ctx.lineTo(6,5);ctx.stroke();
}
function drawEnemy(e){
 const x=(e.x+.5)*T,y=(e.y+.5)*T;ctx.save();ctx.translate(x,y);ctx.translate(0,Math.sin(elapsed*6+e.id)*.8);
 if(e.returning){ghostEyes(e);ctx.restore();return;}
 if(powerTime>0){drawFrightened(e,frightenedAppearance(powerTime,elapsed));ctx.restore();return;}
 const colors=['#ad6fdb','#f0c568','#c28ade','#bd944f'];
 ctx.shadowColor=colors[e.id];ctx.shadowBlur=2;ctx.fillStyle=colors[e.id];ghostOutline(e.id);ctx.fill();ctx.shadowBlur=0;
 ctx.strokeStyle='#f2d89466';ctx.lineWidth=.7;ctx.stroke();
 // A subtle eye mask supplies the carnival detail without altering the silhouette.
 ctx.fillStyle='#43205470';ctx.beginPath();ctx.ellipse(-4.1,-1.6,4.4,5,-.12,0,Math.PI*2);ctx.ellipse(4.1,-1.6,4.4,5,.12,0,Math.PI*2);ctx.fill();
 ghostEyes(e);
 ctx.fillStyle='#fff0c1';ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(1.7,5.7);ctx.lineTo(0,7.4);ctx.lineTo(-1.7,5.7);ctx.closePath();ctx.fill();ctx.restore();
}

function draw(){
 art.paint(ctx,map,routeScenery(level),T,C,R,level);
 art.shimmer(ctx,routeScenery(level),T,elapsed);
 for(const [k,type] of items){const x=(k%C+.5)*T,y=(Math.floor(k/C)+.5)*T;if(type==='pie'){ctx.save();ctx.globalAlpha=Math.floor(elapsed/.18)%2===0?1:.22;ctx.shadowBlur=0;drawPie(x,y,9.4);ctx.restore();}else{drawDoubloon(x,y);}}
 if(bonus){let x=(bonus.x+.5)*T,y=(bonus.y+.5)*T;ctx.save();ctx.translate(x,y);ctx.rotate(elapsed*.9);ctx.fillStyle='#f9d678';ctx.shadowColor='#edc463';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#90632e';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#7c4a40';ctx.font='bold 10px serif';ctx.textAlign='center';ctx.fillText('M',0,3.5);ctx.restore();}
 if(state!=='gameover'&&(state!=='dying'||deathTime<DEATH_HOLD))enemies.filter(e=>state!=='capture'||e.id!==capture?.id).forEach(drawEnemy);
 if(state==='dying')drawDyingPlayer();else if(state!=='capture'&&state!=='gameover')drawPlayer();
 if(state==='capture'&&capture){ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#241038';ctx.strokeText(String(capture.points),(capture.x+.5)*T,(capture.y+.5)*T+4);ctx.fillStyle='#ffe7a1';ctx.fillText(String(capture.points),(capture.x+.5)*T,(capture.y+.5)*T+4);}
 particles.forEach(p=>{ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillStyle=p.color;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.life*4);ctx.fillRect(-2,-2,4,3);ctx.restore();});ctx.globalAlpha=1;
 ctx.font='bold 13px monospace';ctx.textAlign='center';popups.forEach(p=>{ctx.fillStyle='#ffe1a1';ctx.globalAlpha=Math.min(1,p.life*2);ctx.fillText(p.text,(p.x+.5)*T,(p.y+.5)*T-10);});ctx.globalAlpha=1;
 // Gentle glass scanlines are static to keep the playfield crisp.
 ctx.fillStyle='#00000010';for(let y=0;y<R*T;y+=4)ctx.fillRect(0,y,C*T,1);
}
function initAudio(){sound.unlock();}
function syncAudio(){sound.sync({state:panelOpen||suspended?'paused':state,powerTime,returning:enemies.filter(e=>e.returning).length,level,progress:total?(total-items.size)/total:0,visible:!document.hidden});}
function playJingle(full=false){sound.event(full?'victory':'ready');}
function updateSound(){
 $('sound').innerHTML='♪ <span>'+(sound.available?'SOUND '+(soundOn?'ON':'OFF'):'SOUND UNAVAILABLE')+'</span>';
 $('sound').disabled=!sound.available;$('sound').setAttribute('aria-label','Turn sound '+(soundOn?'off':'on'));$('sound').setAttribute('aria-pressed',String(soundOn&&sound.available));
}
$('sound').onclick=()=>{soundOn=!soundOn;try{localStorage.setItem('moonpie-run-sound-v1',soundOn?'on':'off');}catch{}sound.setEnabled(soundOn);updateSound();if(soundOn){if(state==='dying')resumeEffects();else sound.event('toggle');syncAudio();}};$('pause').onclick=togglePause;
const keyMap={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',a:'left',d:'right',w:'up',s:'down'};
document.addEventListener('keydown',e=>{if(panelOpen)return;const d=keyMap[e.key]||keyMap[e.key.toLowerCase()];if(d){if(['playing','ready','paused'].includes(state))e.preventDefault();direction(d);}if((e.key==='p'||e.key==='P'||e.key==='Escape')&&!e.repeat)togglePause();if(e.key==='Enter'&&state==='title'&&(e.target===document.body||e.target===canvas))start();});
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();direction(b.dataset.dir);}));
let touchStart=null;canvas.addEventListener('pointerdown',e=>{touchStart={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;if(Math.max(Math.abs(dx),Math.abs(dy))>12){direction(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touchStart={x:e.clientX,y:e.clientY};}});canvas.addEventListener('pointerup',()=>touchStart=null);canvas.addEventListener('pointercancel',()=>touchStart=null);
document.addEventListener('moonpie:panel',e=>{panelOpen=!!e.detail.open;if(panelOpen)sound.hush();else{resumeEffects();syncAudio();if(state==='playing')canvas.focus({preventScroll:true});}});
function resumeEffects(){initAudio();if(state==='dying'&&deathSoundStarted&&deathTime<DEATH_HOLD+DEATH_FOLD)sound.event('death',{offset:Math.max(0,deathTime-DEATH_HOLD)});}
document.addEventListener('visibilitychange',()=>{if(document.hidden){sound.hush();if(state==='playing')togglePause();}else resumeEffects();});
window.addEventListener('blur',()=>{sound.hush();if(state==='playing')togglePause();else suspended=true;});
window.addEventListener('focus',()=>{suspended=false;resumeEffects();syncAudio();});window.addEventListener('pagehide',()=>sound.hush());
function frame(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;update(dt);draw();requestAnimationFrame(frame);}
updateSound();title();requestAnimationFrame(frame);
art.loaded.then(()=>{document.querySelector('.arcade').dataset.art='ready';if(state==='title'){$('start').disabled=false;$('start').textContent='LET’S ROLL →';}draw();}).catch(()=>{document.querySelector('.arcade').dataset.art='failed';showOverlay('<h2>Artwork could not load.</h2><p>Reload to try again.</p><button class="start-button" id="retry-art">RETRY →</button>');$('retry-art').onclick=()=>window.location.reload();});
// Pure map functions are shared with the local reachability check.
if(typeof module!=='undefined')module.exports={createMap,C,R,deathPose,ghostPhase,reverseEnemy,frightenedAppearance,DEATH_HOLD,DEATH_FOLD,DEATH_TAIL,CAPTURE_HOLD,testing:{start,beginPlay,update,draw,loseLife,collect,captureEnemy,activatePower,get:()=>({state,lives,score,activeTime,roundTime,powerTime,player,enemies,deathTime,capture,modeClock,ghostMode}),set:values=>{if('lives'in values)lives=values.lives;if('powerTime'in values)powerTime=values.powerTime;}}};
})();
