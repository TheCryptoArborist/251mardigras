const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
const parades=JSON.parse(fs.readFileSync(path.join(ROOT,'dist/parades.json')));
function minutes(t){if(t==='Noon')return 720;const [,h,m,period]=/^(\d+):(\d+) (AM|PM)$/.exec(t);return (+h%12+(period==='PM'?12:0))*60+(+m);}
if(process.env.PARADE_COUNT){const n=Number(process.env.PARADE_COUNT);parades.parades=Array.from({length:n},(_,i)=>({...parades.parades[i%45],name:'Parade '+i})).sort((a,b)=>a.date.localeCompare(b.date)||minutes(a.time)-minutes(b.time));}
let fakeNow=0,drawCalls=0;
const events={};const buttons=['left','right','brake','boost'].map(control=>({dataset:{control},classList:{add(){},remove(){},toggle(){}},listeners:{},addEventListener(type,fn){this.listeners[type]=fn;},setPointerCapture(){}}));
const gradient={addColorStop(){}};
const context=new Proxy({measureText:s=>({width:s.length*29}),createLinearGradient:()=>gradient,setTransform(){},drawImage(){drawCalls++}}, {get:(o,k)=>k in o?o[k]:(...args)=>{if(args.some(a=>typeof a==='number'&&!Number.isFinite(a)))throw Error('Non-finite draw coordinate: '+k);}});
const els={};const el=id=>els[id]??=( {id,hidden:true,textContent:'',innerHTML:'',value:'cup',style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},getContext:()=>context,getBoundingClientRect:()=>({width:1360,height:936}),addEventListener(){},setAttribute(){},replaceChildren(){},append(){},focus(){},setPointerCapture(){}} );
const document={getElementById:el,createElement:t=>el('created'+Math.random()),querySelector:s=>el('mode'),querySelectorAll:s=>s==='[data-control]'?buttons:[],addEventListener(){},fonts:{ready:Promise.resolve()},activeElement:el('startBtn'),body:el('body')};
const box={document,window:{devicePixelRatio:1,addEventListener(type,fn){events[type]=fn;}},navigator:{getGamepads:()=>[]},performance:{now:()=>fakeNow},fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(parades)}),requestAnimationFrame(){},setTimeout:()=>0,clearTimeout(){},console,localStorage:{getItem:()=>null,setItem(){}}};box.globalThis=box;
const frame={width:256,height:180};
box.window.MotorwayArt={load:()=>Promise.resolve(),cars:Array(6).fill(frame),props:Object.fromEntries(['brick','stucco','oak','grandstand','float','oakTall','pit','crowd','lamp'].map(n=>[n,{width:280,height:280}])),gate:()=>({width:640,height:280}),backdrop(){}};
let src=fs.readFileSync(path.join(ROOT,'dist/game.js'),'utf8');
src=src.replace(/\}\)\(\);\s*$/,`globalThis.qa={start,update,render,hit,finishZ,updateUI,prepare,input,pause,resume,get:()=>({state,z,speed,playerX,steer,timer,score,lives,charge,elapsed,stage,passed,countdown,traffic:traffic.length}),set:v=>{if('z'in v)z=v.z;if('speed'in v)speed=v.speed;if('x'in v)playerX=v.x;if('mode'in v)mode=v.mode;if('state'in v)state=v.state;if('timer'in v)timer=v.timer;if('lives'in v)lives=v.lives;if('invulnerable'in v)invulnerable=v.invulnerable;},keys,clearTraffic:()=>traffic=[],clearPickups:()=>pickups=[],setPickup:p=>pickups=[p]};})();`);
vm.runInNewContext(src,box);

(async()=>{
 for(let i=0;i<20;i++)await Promise.resolve();
 const q=box.qa;
 q.start();q.set({state:'racing'});
 const key=(type,k)=>events[type]({key:k,preventDefault(){},repeat:false});
 const pointer=(type,id)=>buttons[0].listeners[type]({pointerId:id,preventDefault(){}});
 // Releasing one source must not cancel another held source.
 key('keydown','ArrowLeft');key('keydown','a');key('keyup','a');
 assert.equal(q.input().turn,-1,'arrow remains held after A released');
 pointer('pointerdown',1);key('keyup','ArrowLeft');
 assert.equal(q.input().turn,-1,'touch remains held after keyboard released');
 pointer('pointerdown',2);pointer('pointerup',1);
 assert.equal(q.input().turn,-1,'second finger remains held');
 pointer('pointercancel',2);assert.equal(q.input().turn,0);
 key('keydown','d');q.pause();q.resume();assert.equal(q.input().turn,0,'pause clears all inputs');
 const pad={axes:[1],buttons:[]};
 box.navigator.getGamepads=()=>[pad];assert.equal(q.input().turn,0,'unmapped controllers ignored');
 pad.mapping='standard';assert.equal(q.input().turn,1,'standard controller axis');
 pad.axes=[0.1];assert.equal(q.input().turn,0,'controller dead zone');
 pad.buttons[0]={pressed:true};assert(q.input().boost);pad.buttons[1]={pressed:true};assert(q.input().brake);
 box.navigator.getGamepads=()=>[];
 // A terminal guardrail collision must not collect a pickup or advance the clock afterward.
 q.set({state:'racing',x:1.35,speed:7600,invulnerable:0,lives:1});
 q.setPickup({z:1500,x:1.13,kind:'moonpie',taken:false});
 const before=q.get();q.update(1/60);
 assert.equal(q.get().state,'ended');assert.equal(q.get().score,before.score);assert.equal(q.get().timer,before.timer);
 // Changed lineups still drive through both checkpoints and every billboard.
 q.start();q.clearTraffic();q.clearPickups();q.set({mode:'cruise',state:'racing',x:0});
 const checkpoints=[];
 for(let i=0;i<40000&&q.get().state==='racing';i++){
  const prev=q.get();q.keys.left=prev.playerX>-.29;q.keys.right=prev.playerX<-.31;q.update(1/60);
  if(q.get().stage!==prev.stage)checkpoints.push(q.get().stage);
 }
 assert.equal(q.get().state,'ended');assert.equal(q.get().passed,parades.parades.length);
 assert.deepEqual(checkpoints,[1,2]);q.updateUI();
 assert.equal(els.paradesPassed.textContent,parades.parades.length+' / '+parades.parades.length+' PARADES');
 console.log(JSON.stringify({passed:true,parades:parades.parades.length,checks:['overlapping keyboard and touch inputs','multiple pointers and cancellation','pause clears inputs','standard gamepad mapping and dead zone','terminal collision stops update','complete cruise with dynamic stage boundaries and HUD']}));
})().catch(e=>{console.error(e);process.exit(1);});
