import test from 'node:test';
import assert from 'node:assert/strict';
import {badgeProgress} from '../game/badges.mjs';

test('all twelve medallions unlock at the approved stat boundary and cap display progress',()=>{
 const expected=[['first_throw','coins',1],['dauphin_collector','coins',100],['doubloon_royalty','coins',1000],['moonpie_moment','pies',1],['sweet_tooth','pies',25],['ghost_catcher','ghosts',1],['phantom_dauphin','ghosts',50],['street_sweep','maxChain',4],['golden_catch','bonuses',1],['parade_starter','routes',1],['port_city_royalty','wins',1],['untouchable','perfectWins',1]];
 assert.deepEqual(badgeProgress().map(b=>b.id),expected.map(([id])=>id));
 for(const [id,metric,threshold] of expected){
  const find=value=>badgeProgress({[metric]:value}).find(b=>b.id===id);
  assert.equal(find(threshold-1).earned,false,id);
  assert.equal(find(threshold).earned,true,id);
  assert.equal(find(threshold+10).value,threshold,id);
  assert.equal(find(-1).value,0,id);
 }
});
