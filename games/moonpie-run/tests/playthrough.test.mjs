import test from 'node:test';
import assert from 'node:assert/strict';
import {game} from './helpers/game-harness.mjs';
import {validateRun} from '../lib/run-rules.mjs';
const directions={left:[-1,0],up:[0,-1],down:[0,1],right:[1,0]};

test('swipes, direction buttons and keyboard buffer the same turns',()=>{
 const g=game();g.start();g.beginPlay();const canvas=g.elements.get('game'),player=g.get().player;
 for(const [name,[x,y]] of Object.entries(directions)){
  let prevented=false;g.elements.get('dir-'+name).handlers.get('pointerdown')({preventDefault(){prevented=true}});assert(prevented);assert.equal(player.want,name);
  canvas.handlers.get('pointerdown')({clientX:100,clientY:100,pointerId:1});canvas.handlers.get('pointermove')({clientX:100+x*40,clientY:100+y*40});assert.equal(player.want,name);canvas.handlers.get('pointercancel')();
 }
 let prevented=false;g.docListeners.get('keydown')({key:'ArrowUp',preventDefault(){prevented=true}});assert(prevented);assert.equal(player.want,'up');
 canvas.handlers.get('pointermove')({clientX:190,clientY:100});assert.equal(player.want,'up');
});

test('all three mazes can be cleared through real movement and produce a verifiable full run',()=>{
 const g=game();g.start();
 for(let route=0;route<3;route++){
  g.beginPlay();for(const e of g.get().enemies)e.release=99999;
  const map=g.createMap(route),left=new Set();for(let y=0;y<g.R;y++)for(let x=0;x<g.C;x++)if(map[y][x]===0&&!(x===11&&y===23))left.add(x+','+y);
  let safety=0;
  while(g.get().state==='playing'&&left.size){
   assert(++safety<3000,'route traversal should terminate');
   const player=g.get().player,start=[Math.round(player.x),Math.round(player.y)],queue=[{pos:start,path:[]}],seen=new Set([start.join(',')]);let path;
   for(let i=0;i<queue.length;i++){
    const n=queue[i];if(left.has(n.pos.join(','))){path=n.path;break;}
    for(const [dir,[dx,dy]] of Object.entries(directions)){const p=[n.pos[0]+dx,n.pos[1]+dy],k=p.join(',');if(map[p[1]]?.[p[0]]===0&&!seen.has(k)){seen.add(k);queue.push({pos:p,path:[...n.path,{dir,pos:p}]});}}
   }
   assert(path?.length,'every remaining throw should be reachable');
   for(const step of path){
    player.want=step.dir;let frames=0;
    do{const remaining=player.moving?(1-player.progress)/player.speed:1/player.speed;g.update(Math.min(1/120,remaining));assert(++frames<300,'a tile should be reached promptly: '+JSON.stringify({route,step,player}));}while(g.get().state==='playing'&&(Math.abs(player.x-step.pos[0])>1e-8||Math.abs(player.y-step.pos[1])>1e-8));
    left.delete(step.pos.join(','));if(g.get().state!=='playing')break;
   }
  }
  assert.equal(left.size,0);assert.equal(g.get().state,route===2?'win':'roundwin');if(route<2)g.elements.get('next').onclick();
 }
 assert.equal(g.finished.length,1);const finish=g.finished[0],count=type=>g.tracked.filter(e=>e.type===type).length;
 const payload={...finish,coins:count('coin'),pies:count('pie'),ghosts:0,bonuses:count('bonus'),routes:count('route'),maxChain:0,capturePoints:0,powerChains:Array(count('pie')).fill(0),routeTimes:g.tracked.filter(e=>e.type==='route').map(e=>e.time)};
 assert.equal(payload.coins,506);assert.equal(payload.pies,12);assert.equal(payload.routes,3);assert(validateRun(payload,payload.duration+1).won);
});
