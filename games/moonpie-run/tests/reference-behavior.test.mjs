// Protect MoonPie Run's approved interpretation of the maze-chase reference.
// These are not assertions of cycle-exact Deluxe Pacman emulation.
import test from 'node:test';
import assert from 'node:assert/strict';
import {game} from './helpers/game-harness.mjs';

function running(){
 const g=game();g.start();g.beginPlay();
 for(const enemy of g.get().enemies)enemy.release=99999;
 return g;
}

test('a blocked buffered turn continues down the corridor until a legal intersection',()=>{
 const g=running(),p=g.get().player;
 p.want='left';g.update(.05);p.want='up';
 let turned=false;
 for(let frame=0;frame<240;frame++){
  g.update(1/120);
  if(p.dir==='up'){assert.equal(p.x,7);assert(p.y<=23);turned=true;break;}
  assert.equal(p.y,23);assert(p.x>=7);
 }
 assert(turned,'buffered turn must happen at the first open intersection');
});

test('reversing player input mid-tile preserves position and retraces the corridor',()=>{
 const g=running(),p=g.get().player;
 p.want='left';g.update(.05);const x=p.x,y=p.y;
 assert(p.moving);p.want='right';g.update(0);
 assert.equal(p.x,x);assert.equal(p.y,y);
 g.update(1/120);assert.equal(p.dir,'right');assert(p.x>x);assert(p.x<11);assert.equal(p.y,y);
});

test('four ghost captures double rewards and a new MoonPie resets the chain',()=>{
 const g=running();g.activatePower();
 for(const enemy of g.get().enemies){
  g.captureEnemy(enemy);
  // Capture freeze must end before the next gameplay encounter.
  g.update(g.CAPTURE_HOLD+.001);
 }
 assert.deepEqual(g.tracked.filter(e=>e.type==='ghost').map(e=>e.points),[200,400,800,1600]);
 assert.equal(g.get().score,3050);
 g.activatePower();g.captureEnemy(g.get().enemies[0]);
 assert.equal(g.tracked.filter(e=>e.type==='ghost').at(-1).points,200);
});

test('pause freezes the power window, actors and ranked active time',()=>{
 const g=running();g.activatePower();
 g.docListeners.get('keydown')({key:'p',repeat:false});
 const before=g.get(),position={x:before.player.x,y:before.player.y};
 for(let i=0;i<400;i++)g.update(.05);
 const after=g.get();assert.equal(after.state,'paused');
 assert.equal(after.powerTime,before.powerTime);assert.equal(after.activeTime,before.activeTime);
 assert.equal(after.player.x,position.x);assert.equal(after.player.y,position.y);
 g.docListeners.get('keydown')({key:'p',repeat:false});g.update(.05);
 assert.equal(g.get().state,'playing');assert(g.get().powerTime<before.powerTime);
});
