// Observational audit probes: records current behavior, not a release acceptance suite.
// Canvas, DOM, audio and hardware are mocked; these measurements are not browser FPS.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'dist/game.js'),'utf8');
const parades=JSON.parse(fs.readFileSync(path.join(root,'dist/parades.json')));
async function setup({width=1360,height=936,storedScore=null}={}){
 const events={window:{},document:{}},els={},draws=[],saved={};
 const context=new Proxy({drawImage(...args){draws.push(args);},measureText(s){return {width:s.length*12};},createLinearGradient(){return {addColorStop(){}};}},{get:(o,k)=>k in o?o[k]:()=>{}});
 const el=id=>els[id]??={id,hidden:true,value:'cup',textContent:'',style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},getContext:()=>context,getBoundingClientRect:()=>({width,height}),addEventListener(){},setAttribute(){},replaceChildren(){},append(){},focus(){},setPointerCapture(){}};
 const on=target=>(type,fn)=>(events[target][type]??=[]).push(fn);
 const document={getElementById:el,createElement:()=>el('canvas'+Math.random()),querySelector:()=>el('mode'),querySelectorAll:s=>s==='.modal'?[el('pauseModal'),el('resultsModal'),el('scheduleModal')]:s==='.intro,.topbar,.gameui'?[el('intro'),el('topbar'),el('gameui')]:[],addEventListener:on('document'),fonts:{ready:Promise.resolve(),load:()=>Promise.resolve()}};
 const sprite={width:256,height:215};
 const box={document,window:{devicePixelRatio:1,addEventListener:on('window'),MotorwayArt:{load:()=>Promise.resolve(),cars:Array(6).fill(sprite),props:Object.fromEntries(['brick','stucco','oak','grandstand','float','oakTall','pit','crowd','lamp'].map(k=>[k,sprite])),gate:()=>sprite,backdrop(){}}},navigator:{getGamepads:()=>[]},performance:{now:()=>0},fetch:async()=>({ok:true,json:async()=>parades}),requestAnimationFrame(){},setTimeout:()=>0,clearTimeout(){},console,localStorage:{getItem:()=>storedScore,setItem(key,value){saved[key]=value;}}};
 const expose=`globalThis.q={start,update,render,frame,pause,resume,schedule,closeSchedule,input,finish,validateSchedule,finishZ,milestoneZ,checkpointZ,keys,get:()=>({state,z,speed,playerX,steer,timer,score,lives,charge,elapsed,stage,passed,countdown,traffic,scenery,billboards,boostActive}),set:v=>{if('state'in v)state=v.state;if('z'in v)z=v.z;if('speed'in v)speed=v.speed;if('mode'in v)mode=v.mode;if('x'in v)playerX=v.x;if('invulnerable'in v)invulnerable=v.invulnerable;if('countdown'in v)countdown=v.countdown;if('charge'in v)charge=v.charge;},empty:()=>{traffic=[];pickups=[];}};})();`;
 vm.runInNewContext(source.replace(/\}\)\(\);\s*$/,expose),box);
 for(let i=0;i<30;i++)await Promise.resolve();
 const event=(type,key)=>{const e={key,repeat:false,preventDefault(){this.defaultPrevented=true;}};for(const target of ['document','window'])for(const fn of events[target][type]||[])fn(e);};
 const q=box.q;q.start();q.set({state:'racing',countdown:0});return {q,els,event,draws,saved};
}
module.exports={setup};
if(require.main===module)(async()=>{
 const results={method:'actual game.js evaluated with mocked DOM/canvas; no browser performance claims',observations:{}};
 {const {q,els,event}=await setup();q.pause();q.schedule();event('keydown','Escape');results.observations.escapeFromPauseSchedule={state:q.get().state,pauseHidden:els.pauseModal.hidden,scheduleHidden:els.scheduleModal.hidden};}
 {const {q,event}=await setup();event('keydown','A');event('keyup','a');results.observations.shiftReleasedBeforeLetter={turn:q.input().turn};}
 results.observations.elapsedAfterTenWallSeconds={};
 for(const fps of [10,20,30,60,120]){const {q}=await setup();q.empty();q.set({mode:'cruise'});q.frame(1000);for(let i=1;i<=fps*10;i++)q.frame(1000+i*1000/fps);results.observations.elapsedAfterTenWallSeconds[fps]=Number(q.get().elapsed.toFixed(3));}
 {const {q}=await setup();q.empty();q.set({mode:'cruise',speed:5100});q.keys.boost=true;for(let i=0;i<60;i++)q.update(1/60);results.observations.cruiseBoost={speed:q.get().speed,charge:q.get().charge,boostActive:q.get().boostActive};}
 {const {q}=await setup();q.set({invulnerable:2,x:0,speed:0});const car=q.get().traffic[0];car.z=1500;car.x=0;car.speed=0;q.update(1/60);results.observations.invulnerableTrafficContact={markedPermanentlyHit:car.hit,lives:q.get().lives};}
 {const {q}=await setup();const end=q.finishZ();results.observations.checkpoints={logical:[q.get().billboards[14].z,q.get().billboards[29].z,end],gantries:q.get().scenery.filter(o=>o.kind==='gate').map(o=>o.z),finishStripeStart:q.milestoneZ(3)};}
 results.observations.fullRunsWithTraffic=[];
 for(const mode of ['cup','cruise'])for(const lane of [-.6,0,.6]){
  const {q}=await setup();q.set({mode});
  for(let i=0;i<60*600&&q.get().state==='racing';i++){const s=q.get();q.keys.left=s.playerX>lane+.01;q.keys.right=s.playerX<lane-.01;q.update(1/60);}
  const s=q.get();results.observations.fullRunsWithTraffic.push({mode,lane,state:s.state,seconds:Math.round(s.elapsed),parades:s.passed,lives:s.lives,score:s.score,won:s.z===q.finishZ()});
 }
 console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
