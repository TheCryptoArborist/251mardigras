import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

import {game} from './helpers/game-harness.mjs';
const tick=(g,seconds)=>{for(let left=seconds;left>1e-8;left-=.02)g.update(Math.min(.02,left));};
test('last life freezes, folds away, then saves once and shows game over',()=>{
 const g=game();g.start();g.beginPlay();g.set({lives:1});g.loseLife();g.loseLife();
 assert.equal(g.get().state,'dying');assert.equal(g.get().lives,0);assert.equal(g.finished.length,0);
 const before=g.get(),x=before.player.x,y=before.player.y;tick(g,.2);assert.equal(g.get().player.x,x);assert.equal(g.get().player.y,y);
 assert(!g.events.some(e=>e.name==='death'));tick(g,.1);assert.equal(g.events.filter(e=>e.name==='death').length,1);
 tick(g,1.11);assert.equal(g.get().state,'dying');assert.equal(g.finished.length,0);
 tick(g,.5);assert.equal(g.get().state,'gameover');assert.equal(g.finished.length,1);assert.equal(g.finished[0].outcome,'gameover');assert.equal(g.finished[0].livesLost,3);assert.equal(g.get().activeTime,before.activeTime);
 tick(g,1);assert.equal(g.finished.length,1);
});
test('a remaining life uses the same death sequence and preserves the current route',()=>{
 const g=game();g.start();g.beginPlay();g.loseLife();tick(g,g.DEATH_HOLD+g.DEATH_FOLD+g.DEATH_TAIL+.02);
 assert.equal(g.get().state,'ready');assert.equal(g.get().lives,2);assert.equal(g.finished.length,0);
 tick(g,1.26);assert.equal(g.get().state,'playing');assert.equal(g.get().lives,2);
});
test('death pose removes the mask, opens upward to a sliver, and disappears',()=>{
 const g=game(),start=g.deathPose(g.DEATH_HOLD),half=g.deathPose(g.DEATH_HOLD+g.DEATH_FOLD/2),end=g.deathPose(g.DEATH_HOLD+g.DEATH_FOLD);
 assert(start.visible&&start.mask===1);assert(half.mouth>Math.PI/2);assert.equal(half.mask,0);assert.equal(end.mouth,Math.PI);assert.equal(end.visible,false);
});
test('MoonPie reverses moving ghosts without a position jump and spares returning eyes',()=>{
 const g=game();g.start();g.beginPlay();const [e,eyes]=g.get().enemies;
 Object.assign(e,{release:0,dir:'right',moving:true,fromX:7,fromY:12,toX:8,toY:12,progress:.3,x:7.3,y:12});
 Object.assign(eyes,{release:0,returning:true,dir:'up'});g.activatePower();
 assert.equal(e.dir,'left');assert.equal(e.fromX,8);assert.equal(e.toX,7);assert(Math.abs(e.progress-.7)<1e-8);assert.equal(e.x,7.3);assert.equal(eyes.dir,'up');assert.equal(g.get().powerTime,8);
});
test('capture freezes actors and power/score clocks, then resumes returning eyes',()=>{
 const g=game();g.start();g.beginPlay();g.activatePower();const e=g.get().enemies[0];g.captureEnemy(e);const before=g.get();
 assert.equal(before.state,'capture');assert.equal(before.score,250);assert(e.returning);
 tick(g,.5);assert.equal(g.get().state,'capture');assert.equal(g.get().powerTime,before.powerTime);assert.equal(g.get().activeTime,before.activeTime);assert.equal(g.get().roundTime,before.roundTime);
 tick(g,.2);assert.equal(g.get().state,'playing');assert.equal(g.get().capture,null);assert(e.returning);
});
test('hidden pages and the player dialog cannot skip the death sequence',()=>{
 const g=game();g.start();g.beginPlay();g.loseLife();tick(g,.4);const before=g.get().deathTime;
 g.document.hidden=true;tick(g,3);assert.equal(g.get().deathTime,before);g.document.hidden=false;
 g.docListeners.get('moonpie:panel')({detail:{open:true}});tick(g,3);assert.equal(g.get().deathTime,before);
 g.docListeners.get('moonpie:panel')({detail:{open:false}});tick(g,.1);assert(g.get().deathTime>before);
});
test('frightened faces flash together only near expiry and chase phases alternate',()=>{
 const g=game();assert(!g.frightenedAppearance(3,0).warning);assert(g.frightenedAppearance(1,0).warning);assert(!g.frightenedAppearance(0,0).frightened);
 assert.equal(g.ghostPhase(6.99),'scatter');assert.equal(g.ghostPhase(7),'chase');assert.equal(g.ghostPhase(27),'scatter');assert.equal(g.ghostPhase(1000),'chase');
});

function audio(){
 const calls=[],nodes=[];
 const param=()=>({value:0,setValueAtTime(...v){calls.push(['set',...v])},exponentialRampToValueAtTime(...v){assert(v[0]>0);calls.push(['ramp',...v])},setValueCurveAtTime(){},setTargetAtTime(){},cancelScheduledValues(){}});
 const node=()=>{const n={frequency:param(),detune:param(),gain:param(),Q:param(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param(),connect(){},disconnect(){},setPeriodicWave(){},start(t){calls.push(['start',t])},stop(t){calls.push(['stop',t])}};nodes.push(n);return n;};
 const ctx={state:'running',currentTime:0,destination:{},createGain:node,createOscillator:node,createDynamicsCompressor:node,createBiquadFilter:node,createPeriodicWave:()=>({})};
 const window={};vm.runInNewContext(readFileSync(new URL('../game/audio.js',import.meta.url),'utf8'),{window,console});
 const sound=new window.MoonPieAudio({enabled:true,context:ctx});sound.unlock();return{sound,calls,nodes};
}
test('audio switches one chase/power/return cue at a time and stops on pause',()=>{
 const {sound}=audio();sound.sync({state:'playing'});assert.deepEqual([...sound.beds.keys()],['chase']);
 sound.event('power');sound.sync({state:'playing',powerTime:8});assert.deepEqual([...sound.beds.keys()],['power']);
 sound.sync({state:'playing',powerTime:7,returning:1});assert.deepEqual([...sound.beds.keys()],['return']);
 sound.sync({state:'playing',powerTime:6,returning:0});assert.deepEqual([...sound.beds.keys()],['power']);sound.sync({state:'paused'});assert.equal(sound.beds.size,0);
});
test('death chirps fit the fold timing and a resumed cue plays only its remaining tail',()=>{
 const {sound,calls}=audio();sound.event('death');const stops=calls.filter(c=>c[0]==='stop').map(c=>c[1]);assert.equal(stops.length,12);assert(Math.max(...stops)<1.18);assert(Math.max(...stops)>1.14);
 const resumed=audio();resumed.sound.event('death',{offset:1});const tail=resumed.calls.filter(c=>c[0]==='stop').map(c=>c[1]);assert(tail.length<12);assert(Math.max(...tail)<.18);
});
test('muting clears cues and cannot create another oscillator',()=>{
 const {sound,nodes}=audio();sound.sync({state:'playing',powerTime:8});sound.setEnabled(false);const before=nodes.length;sound.event('death');sound.event('power');sound.sync({state:'playing'});assert.equal(nodes.length,before);assert.equal(sound.beds.size,0);
});
