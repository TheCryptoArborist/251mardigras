export function username(value){
 if(typeof value!=='string')throw new Error('Enter a username.');
 const name=value.trim().replace(/\s+/g,' ');
 if(!/^[A-Za-z0-9][A-Za-z0-9 _.-]{1,19}$/.test(name))throw new Error('Use 2–20 letters, numbers, spaces, periods, dashes or underscores.');
 return{name,key:name.toLowerCase()};
}
export function validateRun(raw,wallSeconds){
 const fail=()=>{throw new Error('This run could not be verified. Please start a new run.');};
 if(!raw||typeof raw!=='object')return fail();
 const ints=['score','coins','pies','ghosts','bonuses','routes','maxChain','capturePoints','livesLost'];
 for(const k of ints)if(!Number.isSafeInteger(raw[k])||raw[k]<0)return fail();
 const {score,coins,pies,ghosts,bonuses,routes,maxChain,capturePoints,livesLost}=raw;
 const duration=Number(raw.duration),times=raw.routeTimes,outcome=raw.outcome;
 if(!['gameover','win','retired'].includes(outcome)||routes>3||livesLost>3||!Number.isFinite(duration)||duration<0||duration>5400||duration>wallSeconds+15||wallSeconds>7200)return fail();
 if(!Array.isArray(times)||times.length!==routes||times.some(x=>typeof x!=='number'||!Number.isFinite(x)||x<0||x>5400)||times.reduce((a,b)=>a+b,0)>duration+1)return fail();
 const counts=[155,173,178],coinsCleared=counts.slice(0,routes).reduce((a,b)=>a+b,0),maxCoins=counts.slice(0,Math.min(3,routes+1)).reduce((a,b)=>a+b,0);
 if(coins<coinsCleared||coins>maxCoins||pies<routes*4||pies>Math.min(12,(routes+1)*4)||bonuses>Math.min(3,routes+1)||ghosts>pies*20||maxChain>ghosts||maxChain>20||capturePoints<ghosts*200||capturePoints>ghosts*1600||capturePoints%200!==0)return fail();
 if(!ghosts&&(maxChain||capturePoints)||ghosts&&!maxChain)return fail();
 if(coins+pies>duration*5.8+5)return fail();
 if((outcome==='win')!==(routes===3)||outcome==='gameover'&&livesLost!==3)return fail();
 const powerChains=raw.powerChains;
 if(!Array.isArray(powerChains)||powerChains.length!==pies||powerChains.some(n=>!Number.isInteger(n)||n<0||n>20)||powerChains.reduce((a,b)=>a+b,0)!==ghosts||Math.max(0,...powerChains)!==maxChain)return fail();
 const expectedCaptures=powerChains.reduce((sum,count)=>{for(let i=0;i<count;i++)sum+=200*2**Math.min(i,3);return sum;},0);
 if(capturePoints!==expectedCaptures)return fail();
 const routeBonus=times.reduce((sum,t)=>sum+500+Math.max(0,1500-Math.floor(t)*5),0);
 if(score!==coins*10+pies*50+bonuses*500+capturePoints+routeBonus)return fail();
 return{score,coins,pies,ghosts,bonuses,routes,maxChain,capturePoints,livesLost,duration,powerChains,routeTimes:times,outcome,won:outcome==='win'};
}
