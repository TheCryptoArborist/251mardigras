import test from 'node:test';import assert from 'node:assert/strict';import {leaderboardPeriod} from '../lib/leaderboard-period.mjs';
test('Mobile daily reset follows daylight saving with 23-hour and 25-hour days',()=>{
 const spring=leaderboardPeriod('daily',Date.parse('2026-03-08T18:00:00Z'));assert.equal(new Date(spring.start).toISOString(),'2026-03-08T06:00:00.000Z');assert.equal(spring.end-spring.start,23*3600000);
 const fall=leaderboardPeriod('daily',Date.parse('2026-11-01T18:00:00Z'));assert.equal(new Date(fall.start).toISOString(),'2026-11-01T05:00:00.000Z');assert.equal(fall.end-fall.start,25*3600000);
});
test('weekly reset is Monday midnight in Mobile, including Sunday and year boundaries',()=>{
 for(const date of ['2026-11-17T20:00:00Z','2026-11-22T23:59:00Z']){const p=leaderboardPeriod('weekly',Date.parse(date));assert.equal(new Date(p.start).toISOString(),'2026-11-16T06:00:00.000Z');assert.equal(p.resetsAt,'2026-11-23T06:00:00.000Z');}
 const p=leaderboardPeriod('weekly',Date.parse('2027-01-01T12:00:00Z'));assert.equal(new Date(p.start).toISOString(),'2026-12-28T06:00:00.000Z');
});
