const assert=require('node:assert/strict');
const {setup}=require('./audit.cjs');
(async()=>{
 {const {q,els,event}=await setup();q.pause();assert.equal(els.gameui.inert,true);q.schedule();event('keydown','Escape');assert.equal(q.get().state,'paused');assert.equal(els.scheduleModal.hidden,true);assert.equal(els.pauseModal.hidden,false);event('keydown','Escape');assert.equal(q.get().state,'racing');assert.equal(els.gameui.inert,false);}
 {const {q,event}=await setup();event('keydown','A');event('keyup','a');assert.equal(q.input().turn,0);event('keydown','ArrowLeft');event('keydown','a');event('keyup','a');assert.equal(q.input().turn,-1);event('keyup','ArrowLeft');assert.equal(q.input().turn,0);}
 // Compare real frame scheduling at several rates, retaining actual simulation updates.
 const runs=[];
 for(const fps of [10,20,30,60,120]){const {q}=await setup();q.empty();q.frame(1000);for(let i=1;i<=fps*2;i++)q.frame(1000+i*1000/fps);runs.push(q.get());}
 for(const s of runs){assert(Math.abs(s.elapsed-2)<1e-6);assert(Math.abs(s.z-runs[0].z)<1e-6);assert(Math.abs(s.timer-73)<1e-6);}
 {const {q}=await setup();q.frame(1000);q.frame(2000);assert.equal(q.get().state,'paused');assert.equal(q.get().elapsed,0);q.resume();q.frame(5000);q.frame(5100);assert(Math.abs(q.get().elapsed-.1)<1e-6);}
 {const {q}=await setup();q.empty();q.set({mode:'cruise',speed:5100});q.keys.boost=true;q.update(1/60);assert(q.get().boostActive);q.keys.brake=true;q.update(1/60);assert.equal(q.get().boostActive,false);q.pause();assert.equal(q.get().boostActive,false);}
 {const {q}=await setup();q.set({invulnerable:2,x:0,speed:0});const car=q.get().traffic[0];car.z=1500;car.x=0;car.speed=0;q.update(1/60);assert.equal(car.hit,false);q.set({invulnerable:0});q.update(1/60);assert.equal(car.hit,true);assert.equal(q.get().lives,2);}
 {const {q}=await setup();q.empty();q.set({speed:7600,z:q.checkpointZ(1)-100,x:0});q.update(1/60);assert.equal(q.get().stage,1);assert.equal(q.milestoneZ(1),q.checkpointZ(1)+1500);const end=q.finishZ();assert.equal(q.milestoneZ(3),end+1500);q.set({z:end-10,speed:7600});q.update(1/60);assert.equal(q.get().state,'ended');assert.equal(q.get().passed,45);assert.equal(q.get().z,end);}
 for(const [width,height] of [[320,568],[390,844],[844,390],[1920,1080]]){
  const {q,draws}=await setup({width,height});q.empty();
  const rival={width:256,height:215};q.get().traffic.push({z:1500,x:0,speed:0,width:520,img:rival,kind:'traffic',hit:false});q.render(1000);
  const rivalDraw=draws.find(a=>a[0]===rival),playerDraw=draws.at(-1);assert(rivalDraw);assert(Math.abs(rivalDraw[3]-playerDraw[3])<.5,`${width}x${height}: consistent car scale`);assert(Math.abs(playerDraw[4]/playerDraw[3]-215/256)<1e-6);
 }
 {const {q}=await setup();const schedule=require('../dist/parades.json');q.validateSchedule(schedule);
  for(const mutate of [d=>d.parades[0].date='2027-02-30',d=>d.parades[0].time='25:00 PM',d=>d.parades[1]={...d.parades[0]},d=>d.parades.reverse(),d=>d.timezone='UTC',d=>d.captured='invalid']){const data=JSON.parse(JSON.stringify(schedule));mutate(data);assert.throws(()=>q.validateSchedule(data));}
 }
 {const {q,saved}=await setup({storedScore:'corrupted'});q.set({z:7400,x:-.58,speed:7600,charge:99});q.update(1/60);assert.equal(q.get().score,5);assert.equal(q.get().charge,100);q.update(1/60);assert.equal(q.get().score,5);q.finish(true);assert.equal(saved['mg251-motorway-cup'],'5');}
 console.log('PASS: Escape, key normalization, fixed-step timing, stall/resume, cruise boost, invulnerable collisions, milestones, and four viewport car scales.');
})().catch(e=>{console.error(e);process.exitCode=1;});
