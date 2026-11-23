const ZONE='America/Chicago';
function parts(time){return Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(time)).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));}
function midnight(y,m,d){const target=Date.UTC(y,m-1,d);let stamp=target;for(let i=0;i<4;i++){const p=parts(stamp);stamp+=target-Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second);}return stamp;}
export function leaderboardPeriod(scope='all',now=Date.now()){
 if(!['all','daily','weekly'].includes(scope))throw new Error('Choose All time, Today or This week.');
 if(scope==='all')return{scope,label:'All time',timeZone:ZONE,start:0,end:8640000000000000,resetsAt:null};
 const p=parts(now),date=new Date(Date.UTC(p.year,p.month-1,p.day));
 if(scope==='weekly')date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);
 const start=midnight(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate());date.setUTCDate(date.getUTCDate()+(scope==='daily'?1:7));
 const end=midnight(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate());
 return{scope,label:scope==='daily'?'Today':'This week',timeZone:ZONE,start,end,resetsAt:new Date(end).toISOString()};
}
