'use strict';
(() => {
const $=id=>document.getElementById(id),app=$('app'),display=$('track'),displayCtx=display.getContext('2d',{alpha:false}),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});
const SEG=200, ROAD=1800, DEPTH=1.05, CAM=1050, VIEW=190, GAP=30000, START=25000, PLAYER_Z=1500, CAR_WIDTH=520, STEP=1/60;
const stages=[{name:'Royal Street & Bienville',sky:['#25143e','#9b638d','#efd096'],ground:'#786778',road:'#2b2932'},{name:'Government Street' ,sky:['#24123e','#764576','#c69079'],ground:'#675468',road:'#272530'},{name:'Broad & Spring Hill',sky:['#170f2d','#4e2c64','#ac718b'],ground:'#554559',road:'#201f29'}];
const keys={left:false,right:false,brake:false,boost:false};
const heldKeys=new Set(),touchPointers=new Map();
let accumulator=0,boostActive=false,renderDirty=true,lastRenderState='',reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
function focalWidth(){return Math.min(W,H*1.5);}
function checkpointZ(index){return START+(stageBoundary(index)-1)*GAP;}
function milestoneZ(index){return index===3?finishZ()+PLAYER_Z:checkpointZ(index)+PLAYER_Z;}
function syncInputs(){for(const k in keys)keys[k]=[...heldKeys].some(key=>keyMap[key]===k)||[...touchPointers.values()].some(t=>t.control===k);}
function stageBoundary(index){return Math.ceil(data.parades.length*index/stages.length);}
let W=1280,H=800,DPR=1,data=null,segments=[],billboards=[],sprites={},traffic=[],pickups=[],scenery=[],mode='cup',state='attract',z=0,speed=0,playerX=0,steer=0,timer=75,score=0,lives=3,charge=100,elapsed=0,stage=0,passed=0,invulnerable=0,shake=0,flash=0,countdown=0,gameStart=0,attractZ=12000,lastFrame=0,lastUi=0,currentCard=-1,bannerTimeout=0,toastTimeout=0,scheduleFrom='attract',focusBefore=null,muted=true,audio=null,engine=null,engineGain=null,rngSeed=251;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function rand(){rngSeed=(rngSeed*1664525+1013904223)>>>0;return rngSeed/4294967296;}
function resize(){
 const b=app.getBoundingClientRect(),ratio=Math.min(2,window.devicePixelRatio||1);
 // The world uses a deliberate arcade framebuffer, while HTML controls and
 // parade captions stay sharp at the display's native resolution.
 W=Math.round(clamp(b.width*.60,360,800));H=Math.round(W*b.height/b.width);DPR=1;
 renderDirty=true;canvas.width=W;canvas.height=H;display.width=Math.round(b.width*ratio);display.height=Math.round(b.height*ratio);
 ctx.imageSmoothingEnabled=false;displayCtx.imageSmoothingEnabled=false;
}
window.addEventListener('resize',resize);resize();
function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')];}
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function poly(c,pts,fill){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.closePath();c.fillStyle=fill;c.fill();}
function mask(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#f9cf66';c.beginPath();c.moveTo(-34,-8);c.quadraticCurveTo(-15,-22,0,-6);c.quadraticCurveTo(15,-22,34,-8);c.lineTo(26,10);c.quadraticCurveTo(9,19,0,8);c.quadraticCurveTo(-9,19,-26,10);c.closePath();c.fill();c.fillStyle='#32154a';c.beginPath();c.ellipse(-15,-1,9,5,.2,0,Math.PI*2);c.ellipse(15,-1,9,5,-.2,0,Math.PI*2);c.fill();c.restore();}
function splitName(name){const words=name.split(' ');if(name.length<20)return[name];let best=1,dist=Infinity;for(let i=1;i<words.length;i++){let d=Math.abs(words.slice(0,i).join(' ').length-words.slice(i).join(' ').length);if(d<dist){dist=d;best=i;}}return[words.slice(0,best).join(' '),words.slice(best).join(' ')];}
function makeBillboard(p){const[c,g]=makeCanvas(440,315);g.scale(.5,.5);const grad=g.createLinearGradient(0,10,880,450);grad.addColorStop(0,'#612d85');grad.addColorStop(1,'#2a123d');g.fillStyle='#27152c';g.fillRect(190,430,33,200);g.fillRect(657,430,33,200);g.fillStyle='#b2863e';g.fillRect(190,430,8,200);g.fillRect(657,430,8,200);rr(g,3,20,874,440,18,'#1b1029');g.lineWidth=13;rr(g,12,25,856,425,16,grad,'#edc35f');g.lineWidth=2;rr(g,30,44,820,387,10,null,'#fce4a570');
for(let i=0;i<9;i++){g.fillStyle='#fff2b9';g.beginPath();g.arc(60+i*95,28,5,0,7);g.fill();}
mask(g,440,90,.8);const lines=splitName(p.name);g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff3d9';g.shadowColor='#10071c';g.shadowOffsetY=4;g.shadowBlur=0;let font=lines.length===1?76:72;while(font>32){g.font=`800 ${font}px "Barlow Condensed",Impact,Arial,sans-serif`;if(lines.every(t=>g.measureText(t).width<760))break;font--;}
lines.forEach((l,i)=>g.fillText(l,440,lines.length===1?220:181+i*88));g.shadowOffsetY=0;g.strokeStyle='#c9a05888';g.lineWidth=2;g.beginPath();g.moveTo(100,325);g.lineTo(780,325);g.stroke();g.fillStyle='#f9cf66';g.font='700 46px Barlow,Arial,sans-serif';let label=`${p.dateLabel} · ${p.time}`;while(g.measureText(label).width>745){font=Number(g.font.match(/\d+/)[0])-1;g.font=`700 ${font}px Barlow,Arial,sans-serif`;}g.fillText(label,440,375);return c;}
function makeBeads(){const[c,g]=makeCanvas(170,170);g.shadowColor='#f9cf66';g.shadowBlur=9;for(let i=0;i<20;i++){let a=i/20*Math.PI*2;g.beginPath();g.arc(85+Math.cos(a)*53,84+Math.sin(a)*65,8,0,7);g.fillStyle=i%2?'#f3be51':'#ffe6a1';g.fill();}mask(g,85,92,.7);return c;}
function makeMoonpie(){const[c,g]=makeCanvas(170,160);g.shadowColor='#fac864';g.shadowBlur=9;g.fillStyle='#ca8d43';g.beginPath();g.ellipse(85,83,65,56,0,0,7);g.fill();g.shadowBlur=0;g.fillStyle='#fff1cc';g.beginPath();g.ellipse(85,92,63,42,0,0,Math.PI);g.fill();g.fillStyle='#a15e2d';g.beginPath();g.ellipse(85,76,65,48,0,0,7);g.fill();g.strokeStyle='#eab969';g.lineWidth=4;g.stroke();g.fillStyle='#492059';g.beginPath();g.ellipse(85,73,44,28,0,0,7);g.fill();g.fillStyle='#ffe197';g.textAlign='center';g.font='bold 17px Arial';g.fillText('MOON',85,70);g.fillText('PIE',85,88);return c;}
function makeCone(){const[c,g]=makeCanvas(130,170);g.fillStyle='#191120';g.beginPath();g.ellipse(65,150,60,15,0,0,7);g.fill();poly(g,[[65,5],[111,145],[19,145]],'#dca94a');poly(g,[[45,65],[85,65],[96,99],[34,99]],'#fff0d0');rr(g,7,144,116,14,4,'#dda848');return c;}
// Original decorative signs and park fountain; Route A inspiration, not navigation.
function makeRouteSign(label){
 const[c,g]=makeCanvas(560,330);g.fillStyle='#84788b';g.fillRect(260,150,22,180);
 rr(g,8,10,544,154,12,'#173e37','#f9cf66');g.textAlign='center';g.fillStyle='#f9cf66';g.font='700 24px Barlow,Arial,sans-serif';g.fillText('MOBILE · ROUTE A',280,48);
 g.fillStyle='#fff2d5';let size=48;do{g.font=`800 ${size--}px "Barlow Condensed",Arial,sans-serif`;}while(g.measureText(label).width>500&&size>22);g.fillText(label,280,118);return c;
}
function makeParkFountain(){
 const[c,g]=makeCanvas(440,330);g.fillStyle='#273e32';g.beginPath();g.ellipse(220,289,215,36,0,0,7);g.fill();
 for(const [x,y,w,h]of[[220,265,175,43],[220,168,108,25],[220,90,55,15]]){g.fillStyle='#d6c2a2';g.beginPath();g.ellipse(x,y,w,h,0,0,7);g.fill();g.fillStyle='#79abb6';g.beginPath();g.ellipse(x,y-7,w-13,h*.52,0,0,7);g.fill();}
 g.fillStyle='#d6c2a2';g.fillRect(207,72,26,195);g.strokeStyle='#acdce3';g.lineWidth=5;
 for(const side of[-1,1]){g.beginPath();g.moveTo(220,76);g.quadraticCurveTo(220+side*105,98,220+side*95,245);g.stroke();g.beginPath();g.moveTo(220,44);g.quadraticCurveTo(220+side*44,30,220+side*45,87);g.stroke();}
 g.fillStyle='#f9cf66';g.beginPath();g.arc(220,52,8,0,7);g.fill();return c;
}
function makeBusinessBoard(name,website,logo,light,facebook=false){
 const extra=facebook?220:0;const[c,g]=makeCanvas(880,600+extra);g.fillStyle='#433748';g.fillRect(145,450+extra,28,150);g.fillRect(707,450+extra,28,150);
 g.lineWidth=9;rr(g,8,8,864,480+extra,18,'#211033','#f9cf66');
 rr(g,30,27,820,275+extra,8,light?'#ffffff':'#211033');
 if(logo){const scale=Math.min(760/logo.width,(245+extra)/logo.height),w=logo.width*scale,h=logo.height*scale;g.drawImage(logo,440-w/2,164+extra/2-h/2,w,h);}
 g.translate(0,extra);g.textAlign='center';g.fillStyle='#fff2d5';g.font='800 '+(facebook?46:64)+'px "Barlow Condensed",Arial,sans-serif';g.fillText(name,440,370);
 g.strokeStyle='#f9cf6680';g.lineWidth=2;g.beginPath();g.moveTo(70,392);g.lineTo(810,392);g.stroke();g.fillStyle='#f9cf66';g.font='700 49px Barlow,Arial,sans-serif';if(facebook){
  // Facebook's white f on blue, followed by the exact page handle.
  rr(g,102,408,58,58,7,'#0866ff');g.fillStyle='#fff';g.beginPath();g.moveTo(137,466);g.lineTo(137,441);g.lineTo(145,441);g.lineTo(147,431);g.lineTo(137,431);g.lineTo(137,425);g.quadraticCurveTo(137,421,142,421);g.lineTo(147,421);g.lineTo(147,412);g.lineTo(139,412);g.quadraticCurveTo(126,412,126,425);g.lineTo(126,431);g.lineTo(119,431);g.lineTo(119,441);g.lineTo(126,441);g.lineTo(126,466);g.closePath();g.fill();
  g.fillStyle='#f9cf66';g.font='700 43px Barlow,Arial,sans-serif';g.fillText(website,475,453);
 }else g.fillText(website,440,453);return c;
}
function prepare(){
 const art=window.MotorwayArt;
 sprites={car:art.cars[1],carLeft:art.cars[0],carRight:art.cars[2],rival:art.cars[3],rivals:art.cars.slice(3),beads:makeBeads(),moonpie:makeMoonpie(),cone:makeCone(),...art.props};
 billboards=data.parades.map((p,i)=>({z:START+i*GAP,offset:i%2?-2.35:2.35,img:makeBillboard(p),width:3700,kind:'billboard',index:i}));
 const total=finishZ();
 segments=Array.from({length:Math.ceil(total/SEG)+VIEW+3},(_,i)=>({z:i*SEG,y:Math.sin(i*SEG/155000)*1500+Math.sin(i*SEG/67000)*550,curve:Math.sin(i*SEG/86000)*.65+Math.sin(i*SEG/190000)*.32,p1:{},p2:{},visible:false}));
 scenery=[];
 const types={brick:[3.7,2600],stucco:[3.7,2400],oak:[3.7,4200],oakTall:[3.6,3200],grandstand:[3.3,4400],float:[3.0,3300],pit:[3.3,3000],crowd:[3.4,2100],lamp:[2.8,1350]};
 const areas=[['brick','oak','oakTall','lamp','stucco','crowd','oak'],['stucco','grandstand','float','crowd','stucco','lamp','pit'],['brick','crowd','float','oak','brick','grandstand','lamp']];
 function place(zz,side,type){
  // Reserve the closest roadside space for the approved parade billboards.
  if(billboards.some(b=>Math.sign(b.offset)===side&&Math.abs(b.z-zz)<4800))return;
  const [offset,width]=types[type];scenery.push({z:zz,offset:offset*side,img:sprites[type],width,kind:'scenery'});
 }
 for(let zz=4500,i=0;zz<total+25000;zz+=6100,i++){
  const area=areas[zz>=milestoneZ(2)?2:zz>=milestoneZ(1)?1:0],side=i%2?1:-1;
  place(zz,side,area[i%area.length]);
  if(i%2===0)place(zz+1700,-side,area[(i+3)%area.length]);
 }
 for(const [zz,label] of [[8000,'MOBILE · START'],[milestoneZ(1),'CARNIVAL CHECKPOINT'],[milestoneZ(2),'FAT TUESDAY FINALE'],[milestoneZ(3),'CIVIC CENTER · FINISH']])scenery.push({z:zz,offset:0,img:art.gate(label),width:5300,kind:'gate'});
 // Set signs between parade boards; leave their lettering and sight lines intact.
 const routeStops=[[.025,'ROYAL STREET'],[.13,'BIENVILLE SQUARE'],[.25,'CONCEPTION STREET'],[.37,'GOVERNMENT STREET'],[.49,'SPANISH PLAZA'],[.60,'WASHINGTON AVENUE'],[.72,'BROAD STREET'],[.84,'SPRING HILL AVENUE'],[.96,'CIVIC CENTER AREA']];
 for(const [fraction,label]of routeStops){const zz=START+fraction*(total-START-12000),near=billboards.reduce((a,b)=>Math.abs(b.z-zz)<Math.abs(a.z-zz)?b:a),side=-Math.sign(near.offset);scenery.push({z:zz,offset:side*2.8,img:makeRouteSign(label),width:2300,kind:'scenery'});}
 scenery.push({z:START+.16*(total-START-12000),offset:-4.8,img:makeParkFountain(),width:3300,kind:'scenery'});
 // One board for each requested business in every stage, in both game modes.
 const businessBoards=[{id:'lemon',name:"Lemon T’s",website:'www.lemon-ts.com',light:false,fraction:.30},{id:'pops',name:'Pop’s Midtown',website:'popsmidtown.com',light:true,fraction:.68},{id:'nicknacks',name:'NickNacks Custom 3D Prints',website:'nicknackscustoms',light:true,facebook:true,fraction:.49,sections:[0]}];
 for(const business of businessBoards){const img=makeBusinessBoard(business.name,business.website,art.businessLogos?.[business.id],business.light,business.facebook);for(const section of business.sections||[0,1,2]){const from=section?milestoneZ(section):START,to=milestoneZ(section+1),zz=from+(to-from)*business.fraction,near=billboards.reduce((a,b)=>Math.abs(b.z-zz)<Math.abs(a.z-zz)?b:a),side=-Math.sign(near.offset);scenery=scenery.filter(o=>o.kind!=='scenery'||Math.sign(o.offset)!==side||Math.abs(o.z-zz)>5000);scenery.push({z:zz,offset:side*2.7,img,width:3700,kind:'business',business:business.id,section});}}
 $('paradeCount').textContent=data.parades.length+' PARADES. ONE JOYRIDE.';$('scheduleCount').textContent=data.parades.length+' Mobile parades';buildSchedule();updateScheduleCopy();$('startBtn').disabled=false;$('loading').hidden=true;updateCard(0);
}
function resetObjects(){rngSeed=251;traffic=[];pickups=[];const end=finishZ();for(let zz=35000,i=0;zz<end;zz+=19000,i++){traffic.push({z:zz,x:(i%3-1)*.64,speed:2200+rand()*1500,width:520,img:sprites.rivals[i%3],kind:'traffic',hit:false});if(i%4===2)traffic.push({z:zz+4200,x:((i+1)%3-1)*.64,speed:2400+rand()*1300,width:520,img:sprites.rivals[i%3],kind:'traffic',hit:false});}
for(let zz=9000,i=0;zz<end;zz+=4200,i++){const moon=i%10===6;pickups.push({z:zz,x:(Math.floor(i/4)%3-1)*.58,width:moon?430:420,img:moon?sprites.moonpie:sprites.beads,kind:moon?'moonpie':'beads',taken:false});}for(let zz=95000,i=0;zz<end;zz+=88000,i++)traffic.push({z:zz,x:(i%2?.88:-.88),speed:0,width:400,img:sprites.cone,kind:'cone',hit:false});}
function finishZ(){return START+(data.parades.length-1)*GAP+35000;}
function validateSchedule(d){
 if(!d||!Number.isInteger(d.season)||!Array.isArray(d.parades)||d.parades.length<3)throw Error('Schedule data is incomplete');
 for(const key of ['captured','lastVerifiedBySource']){const value=d[key],date=new Date(value+'T12:00:00Z');if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)throw Error('Invalid schedule metadata');}
 if(d.timezone!=='America/Chicago')throw Error('Schedule must use Central Time');
 let previous='';const seen=new Set();
 for(const p of d.parades){
  if(!p||!['name','date','dateLabel','time','route'].every(k=>typeof p[k]==='string'&&p[k].trim()))throw Error('Incomplete parade record');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||Number(p.date.slice(0,4))!==d.season)throw Error('Invalid parade date');
  const date=new Date(p.date+'T12:00:00Z');if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==p.date)throw Error('Invalid parade date');
  const time=p.time.toLowerCase()==='noon'?['','12','00','PM']:/^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(p.time);
  if(!time||+time[1]<1||+time[1]>12||+time[2]>59)throw Error('Invalid parade time');
  const minutes=(+time[1]%12+(time[3]==='PM'?12:0))*60+(+time[2]);
  const order=p.date+' '+String(minutes).padStart(4,'0'),key=p.name+'|'+p.date+'|'+p.time+'|'+p.route;
  if(order<previous||seen.has(key))throw Error('Parades must be unique and chronological');previous=order;seen.add(key);
 }
}
function updateScheduleCopy(){
 const label=date=>new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Chicago'});
 const first=data.parades[0],last=data.parades.at(-1),range=label(first.date)+' – '+label(last.date);
 $('seasonEyebrow').textContent='CARNIVAL SEASON · '+data.season;$('lineupBtn').textContent=data.season+' parade list';
 $('seasonRange').textContent=range;$('scheduleRange').textContent=range;$('lineupEyebrow').textContent='THE '+data.season+' LINEUP';
 $('sourceSeason').textContent=data.season+' parade information from ';$('snapshotDate').textContent=label(data.captured);
 $('scheduleNote').textContent='Snapshot of MG251’s schedule, retrieved '+label(data.captured)+'. The source lists '+label(data.lastVerifiedBySource)+' as its last verification date. Dates, times, and routes can change; check MG251 before heading downtown.';
}
function buildSchedule(){let d='';$('paradeList').replaceChildren();for(const p of data.parades){if(d!==p.date){d=p.date;const title=document.createElement('div');title.className='parade-day';title.textContent=new Date(p.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}).toUpperCase();$('paradeList').append(title);}const row=document.createElement('div');row.className='parade-row';const n=document.createElement('strong'),t=document.createElement('span');n.textContent=p.name;t.textContent=p.time+' · '+p.route;row.append(n,t);$('paradeList').append(row);}}
function updateCard(idx){idx=clamp(idx,0,data.parades.length-1);if(currentCard===idx)return;currentCard=idx;const p=data.parades[idx];$('cardName').textContent=p.name;$('cardDate').textContent=`${p.dateLabel} · ${p.time} CT`;$('cardLabel').textContent=`ON THE ROADSIDE · PARADE ${idx+1} OF ${data.parades.length}`;$('a11yStatus').textContent=`Billboard: ${p.name}, ${p.dateLabel}, ${p.time} Central Time.`;}
function announce(title,sub,duration=2300){$('bannerTitle').textContent=title;$('bannerSub').textContent=sub;$('banner').hidden=false;clearTimeout(bannerTimeout);bannerTimeout=setTimeout(()=>$('banner').hidden=true,duration);}
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('toast').hidden=true,1800);}
function syncDialogs(){const open=[...document.querySelectorAll('.modal')].some(m=>!m.hidden);for(const el of document.querySelectorAll('.intro,.topbar,.gameui'))el.inert=open;}
function setRacing(on){app.classList.toggle('racing',on);$('pauseBtn').hidden=!on;}
function start(){if(!data||!segments.length)return;clearInputs();accumulator=0;boostActive=false;flash=0;renderDirty=true;mode=document.querySelector('input[name="mode"]:checked').value;window.MotorwayCommunity?.start(mode);state='countdown';z=0;speed=0;playerX=0;steer=0;timer=75;elapsed=0;score=0;lives=3;charge=100;stage=0;passed=0;invulnerable=0;shake=0;currentCard=-1;countdown=3;lastFrame=0;resetObjects();updateCard(0);for(const id of['pauseModal','resultsModal','scheduleModal'])$(id).hidden=true;setRacing(true);$('modeLabel').textContent=mode==='cup'?'CARNIVAL CUP':'SCENIC CRUISE';$('timerLabel').textContent=mode==='cup'?'TIME':'CRUISE';$('stageLabel').textContent='STAGE 01 / 03';$('stageName').textContent=stages[0].name;clearTimeout(bannerTimeout);$('banner').hidden=false;$('bannerTitle').textContent='3';$('bannerSub').textContent='COLLECT THROWS · WATCH THE BILLBOARDS';updateUI();if(!muted)initAudio();syncDialogs();$('pauseBtn').focus({preventScroll:true});}
function pause(){boostActive=false;if(state!=='racing'&&state!=='countdown')return;state='paused';clearInputs();$('banner').hidden=true;$('pauseModal').hidden=false;syncDialogs();$('resumeBtn').focus();}
function resume(){if(state!=='paused')return;state=countdown>0?'countdown':'racing';$('pauseModal').hidden=true;lastFrame=0;accumulator=0;if(countdown>0){$('banner').hidden=false;$('bannerTitle').textContent=Math.ceil(countdown);}syncDialogs();$('pauseBtn').focus({preventScroll:true});if(audio)audio.resume();}
function garage(){state='attract';clearInputs();setRacing(false);for(const id of['pauseModal','resultsModal','scheduleModal','banner','toast'])$(id).hidden=true;syncDialogs();$('startBtn').focus();}
function finish(won){window.MotorwayCommunity?.finish({won,mode,score,elapsed});boostActive=false;state='ended';clearInputs();$('banner').hidden=true;$('resultsModal').hidden=false;$('resultEyebrow').textContent=mode==='cup'?'CARNIVAL CUP':'SCENIC CRUISE';$('resultTitle').textContent=won?'You made it to Mardi Gras!':lives<=0?'Time for a pit stop.':'The clock beat you.';$('resultText').textContent=won?'From the first Carnival parade to Fat Tuesday, you cruised the whole season. Check the current schedule and pick your spot along the real parade route.':'Your Carnival run is over. Give it another go, or choose Scenic Cruise for a relaxed drive with no timer or lost lives.';$('finalScore').textContent=score.toLocaleString();$('finalParades').textContent=passed;$('finalTime').textContent=formatTime(elapsed);let best=0;try{const stored=Number(localStorage.getItem('mg251-motorway-'+mode)||0);best=Number.isFinite(stored)&&stored>=0?stored:0;if(won&&score>best){best=score;localStorage.setItem('mg251-motorway-'+mode,String(best));}}catch{}$('bestRun').textContent=best?`Best completed ${mode==='cup'?'Cup':'Cruise'} on this device: ${best.toLocaleString()} throws`:'Complete the route to set your first local best.';syncDialogs();$('againBtn').focus();tone(won?660:130,.3);}
function schedule(){if(!data)return;scheduleFrom=state;focusBefore=document.activeElement;if(state==='racing'||state==='countdown'){state='paused';clearInputs();}else if(state==='attract'){state='browsing';} $('pauseModal').hidden=true;$('resultsModal').hidden=true;$('scheduleModal').hidden=false;syncDialogs();$('closeSchedule').focus();}
function closeSchedule(){ $('scheduleModal').hidden=true;if(scheduleFrom==='racing'||scheduleFrom==='countdown'||scheduleFrom==='paused'){state='paused';$('pauseModal').hidden=false;syncDialogs();$('resumeBtn').focus();}else{state=scheduleFrom;if(state==='ended')$('resultsModal').hidden=false;syncDialogs();if(focusBefore)focusBefore.focus();}lastFrame=0;}
function clearInputs(){heldKeys.clear();touchPointers.clear();for(const k in keys)keys[k]=false;document.querySelectorAll('.drive-buttons .down').forEach(b=>b.classList.remove('down'));}
function formatTime(t){return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');}
function initAudio(){if(audio)return;try{audio=new(window.AudioContext||window.webkitAudioContext)();engine=audio.createOscillator();engine.type='sawtooth';const f=audio.createBiquadFilter();f.type='lowpass';f.frequency.value=270;engineGain=audio.createGain();engineGain.gain.value=0;engine.connect(f);f.connect(engineGain);engineGain.connect(audio.destination);engine.start();}catch{toast('Audio is unavailable in this browser.');}}
function tone(freq,len=.12){if(muted||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*1.3,audio.currentTime+len);g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+len);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+len);}
function audioTick(){if(!audio||!engineGain)return;const driving=state==='racing'||state==='countdown';engine.frequency.setTargetAtTime(43+speed/7600*105,audio.currentTime,.08);engineGain.gain.setTargetAtTime(muted||!driving?0:.016+(speed/7600)*.012,audio.currentTime,.05);}
function input(){let left=keys.left?1:0,right=keys.right?1:0,brake=keys.brake,boost=keys.boost;try{for(const gp of navigator.getGamepads?.()||[]){if(!gp||gp.mapping!=='standard')continue;const axis=gp.axes?.[0]||0;if(axis<-.15)left=Math.max(left,-axis);if(axis>.15)right=Math.max(right,axis);if(gp.buttons[14]?.pressed)left=1;if(gp.buttons[15]?.pressed)right=1;brake=brake||gp.buttons[1]?.pressed||gp.buttons[6]?.pressed;boost=boost||gp.buttons[0]?.pressed||gp.buttons[7]?.pressed;}}catch{}return{turn:Math.round(clamp(right-left,-1,1)*1000)/1000,brake:!!brake,boost:!!boost};}
function hit(){if(invulnerable>0)return false;invulnerable=2.6;shake=.55;flash=.14;speed*=.34;charge=Math.max(0,charge-12);if(mode==='cup'){lives--;toast(lives?`Watch the road! ${lives} ${lives===1?'life':'lives'} left.`:'Three bumps — time for the garage.');if(lives<=0){finish(false);return true;}}else toast('A little bump. Keep cruising!');tone(90,.22);return true;}
function update(dt){if(state==='countdown'){countdown-=dt;const n=Math.ceil(countdown);if(countdown<=0){state='racing';$('bannerTitle').textContent='LET’S ROLL!';$('bannerSub').textContent='MOBILE, ALABAMA · '+data.season;clearTimeout(bannerTimeout);bannerTimeout=setTimeout(()=>$('banner').hidden=true,1700);tone(660,.2);}else $('bannerTitle').textContent=n;return;}if(state!=='racing')return;elapsed+=dt;const inp=input();window.MotorwayCommunity?.tick(inp);steer=lerp(steer,inp.turn,Math.min(1,dt*7));let base=mode==='cup'?7600:5100;const boosted=inp.boost&&charge>1&&speed>1700&&!inp.brake;boostActive=boosted;if(boosted){base*=1.32;charge=Math.max(0,charge-dt*23);}else charge=Math.min(100,charge+dt*4.5);if(inp.brake)base=1500;if(Math.abs(playerX)>1.02)base*=.48;const accel=inp.brake?7500:speed>base?4300:3600;speed+=clamp(base-speed,-accel*dt,accel*dt);const seg=segments[Math.floor(z/SEG)]||segments[0];playerX+=steer*dt*(1.03+speed/7600*.70);playerX-=seg.curve*(speed/7600)**2*dt*.25;playerX=clamp(playerX,-1.4,1.4);z+=speed*dt;invulnerable=Math.max(0,invulnerable-dt);shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt);if(Math.abs(playerX)>1.13){playerX=Math.sign(playerX)*1.13;if(speed>2000){hit();if(state==='ended')return;}else speed=Math.min(speed,1600);}
for(const car of traffic){car.z+=car.speed*dt;if(Math.abs(car.z-(z+PLAYER_Z))>1200||Math.abs(playerX-car.x)>.4)car.hit=false;if(Math.abs(car.z-(z+PLAYER_Z))<650+speed*dt&&Math.abs(playerX-car.x)<(car.kind==='cone'?.15:.23)&&!car.hit){car.hit=hit();if(state==='ended')return;}}
for(const item of pickups){if(!item.taken&&Math.abs(item.z-(z+PLAYER_Z))<650+speed*dt&&Math.abs(playerX-item.x)<.24){item.taken=true;score+=item.kind==='moonpie'?25:5;charge=Math.min(100,charge+(item.kind==='moonpie'?28:4));tone(item.kind==='moonpie'?740:460,.08);}}
while(passed<data.parades.length&&z>billboards[passed].z)passed++;const next=Math.min(data.parades.length-1,passed);updateCard(next);let nextStage=passed>=stageBoundary(2)?2:passed>=stageBoundary(1)?1:0;if(nextStage>stage){stage=nextStage;if(mode==='cup'){timer=75;lives=Math.min(3,lives+1);}announce(stages[stage].name,mode==='cup'?'CHECKPOINT · CLOCK & ONE LIFE REFILLED':'THE NEXT CHAPTER OF CARNIVAL',2700);tone(880,.2);$('stageLabel').textContent=`STAGE 0${stage+1} / 03`;$('stageName').textContent=stages[stage].name;}
if(mode==='cup'){timer-=dt;if(timer<=0){timer=0;finish(false);return;}}if(z>=finishZ()){z=finishZ();passed=data.parades.length;finish(true);} }
function updateUI(){$('speed').innerHTML=Math.round(speed/7600*120)+'<span>MPH</span>';$('score').textContent=score.toLocaleString();$('timer').textContent=mode==='cup'?Math.ceil(timer):'∞';$('timer').classList.toggle('low',mode==='cup'&&timer<15);$('lives').textContent=mode==='cup'?'◆'.repeat(Math.max(0,lives))+'◇'.repeat(3-Math.max(0,lives)):'∞';$('lives').setAttribute('aria-label',mode==='cup'?`${lives} lives`:'Unlimited lives');$('progress').style.width=clamp(z/finishZ()*100,0,100)+'%';$('paradesPassed').textContent=passed+' / '+data.parades.length+' PARADES';$('boostBtn').style.setProperty('--charge',charge+'%');}
function project(point,worldX,worldY,worldZ,cameraY){const scale=DEPTH/Math.max(1,worldZ);point.x=W/2+worldX*scale*focalWidth()/2;point.y=(1-(worldY-cameraY)*scale)*H/2;point.w=scale*ROAD*focalWidth()/2;point.scale=scale;point.z=worldZ;}
function quad(x1,y1,w1,x2,y2,w2,fill){poly(ctx,[[Math.round(x1-w1),Math.ceil(y1)+1],[Math.round(x1+w1),Math.ceil(y1)+1],[Math.round(x2+w2),Math.floor(y2)],[Math.round(x2-w2),Math.floor(y2)]],fill);}
function background(theme,t){window.MotorwayArt.backdrop(ctx,W,H,['racing','countdown','paused','ended'].includes(state)?stage:0,playerX,t);}
function drawObject(o,camZ,playerCamX,cameraY,g=ctx){const distance=o.z-camZ;if(distance<330||distance>VIEW*SEG)return;const idx=Math.floor(o.z/SEG),s=segments[idx];if(!s||!s.visible||!s.p1.scale)return;const frac=(o.z%SEG)/SEG,p=s.p1,p2=s.p2;const roadx=lerp(p.x,p2.x,frac),groundy=lerp(p.y,p2.y,frac),w=DEPTH/distance*ROAD*focalWidth()/2;const offset=o.offset??o.x;const x=roadx+offset*w;const sw=o.width/ROAD*w,sh=sw*o.img.height/o.img.width;if(sw<2)return;let yy=groundy-sh;if(o.kind==='beads'||o.kind==='moonpie')yy-=sh*.42+Math.sin(elapsed*1000/240+o.z)*sh*.09;const bottom=yy+sh;const clip=s.clip??H;if(yy>clip||x+sw/2<0||x-sw/2>W)return;g.save();g.imageSmoothingEnabled=o.kind==='billboard'||o.kind==='business';g.beginPath();g.rect(0,0,W,Math.max(0,clip));g.clip();g.drawImage(o.img,x-sw/2,yy,sw,sh);g.restore();}
function render(now){
 const active=['racing','countdown','paused','ended'].includes(state),camZ=active?z:attractZ;if(active)now=elapsed*1000;
 const displayStage=active?stage:0,theme=stages[displayStage];
 ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;ctx.save();
 if(!reducedMotion&&shake>0&&state==='racing')ctx.translate(Math.round(Math.sin(now*.11)*shake*7),Math.round(Math.cos(now*.13)*shake*4));
 background(theme,camZ);
 if(!segments.length){ctx.restore();return;}
 const base=Math.floor(camZ/SEG),pct=(camZ%SEG)/SEG,cameraY=lerp(segments[base]?.y||0,segments[base+1]?.y||0,pct)+CAM;
 let xx=0,dx=-(segments[base]?.curve||0)*pct,maxY=H;
 for(let n=0;n<VIEW;n++){
  const idx=base+n,s=segments[idx],s2=segments[idx+1];if(!s||!s2)break;s.visible=false;
  const px=active?playerX:Math.sin(now/7000)*.12;
  project(s.p1,xx-px*ROAD,s.y,s.z-camZ,cameraY);project(s.p2,xx+dx-px*ROAD,s2.y,s2.z-camZ,cameraY);
  xx+=dx;dx+=s.curve;s.clip=maxY;
  if(s.p1.z<=DEPTH||s.p2.y>=s.p1.y||s.p2.y>=maxY)continue;
  s.visible=true;const a=s.p1,b=s.p2,alt=Math.floor(idx/4)%2;
  // A real circuit surface: a sandy verge, striped curbs, pale edge lines,
  // textured charcoal asphalt, lane dashes, and dimensional metal Armco.
  quad(a.x,a.y,a.w*1.22,b.x,b.y,b.w*1.22,'#a28b7a');
  quad(a.x,a.y,a.w*1.105,b.x,b.y,b.w*1.105,alt?'#f0d58d':'#634075');
  quad(a.x,a.y,a.w,b.x,b.y,b.w,alt?theme.road:['#2d2a34','#282631','#22212b'][displayStage]);
  for(const side of[-1,1])quad(a.x+a.w*.955*side,a.y,a.w*.008,b.x+b.w*.955*side,b.y,b.w*.008,'#e1d8bc');
  if(alt)for(const lane of[-1/3,1/3])quad(a.x+a.w*lane,a.y,a.w*.008,b.x+b.w*lane,b.y,b.w*.008,'#e4ded0');
  if(idx%3===0&&a.w>80){
   for(let j=0;j<5;j++){
    const lane=((idx*37+j*43)%180)/100-.9;
    ctx.fillStyle=j%2?'#d5ced00c':'#00000020';
    ctx.fillRect(Math.round(a.x+a.w*lane),Math.round(lerp(a.y,b.y,.5)),Math.max(1,Math.round(a.w*.018)),1);
   }
  }
  // Alternating blocks on the start and finish stripe recede with the road.
  if((s.z>=6000&&s.z<6400)||(s.z>=milestoneZ(3)&&s.z<milestoneZ(3)+400)){
   for(let j=0;j<12;j++)quad(a.x+a.w*(-1+(j+.5)/6),a.y,a.w/12,b.x+b.w*(-1+(j+.5)/6),b.y,b.w/12,(j+idx)%2?'#ece6d4':'#292331');
  }
  for(const side of[-1,1]){
   const ax=a.x+a.w*1.27*side,bx=b.x+b.w*1.27*side,ha=Math.min(H*.17,a.scale*110*H/2),hb=Math.min(H*.17,b.scale*110*H/2);
   poly(ctx,[[ax,a.y-ha],[bx,b.y-hb],[bx,b.y-hb*.45],[ax,a.y-ha*.45]],alt?'#a8a0ad':'#89818f');
   poly(ctx,[[ax,a.y-ha],[bx,b.y-hb],[bx,b.y-hb+Math.max(1,hb*.12)],[ax,a.y-ha+Math.max(1,ha*.12)]],'#ddd3cf');
   if(idx%8===0&&a.w>25){ctx.fillStyle='#4c414f';ctx.fillRect(Math.round(ax),Math.round(a.y-ha),Math.max(1,a.w*.009),ha);}
  }
  maxY=b.y;
 }
 // Composite sprites at the display resolution. The track and skyline retain
 // arcade pixels; parade lettering keeps the readability of the first design.
 displayCtx.save();displayCtx.setTransform(1,0,0,1,0,0);displayCtx.imageSmoothingEnabled=false;
 displayCtx.drawImage(canvas,0,0,display.width,display.height);
 displayCtx.setTransform(display.width/W,0,0,display.height/H,0,0);
 if(!reducedMotion&&shake>0&&state==='racing')displayCtx.translate(Math.round(Math.sin(now*.11)*shake*7),Math.round(Math.cos(now*.13)*shake*4));
 let objects=scenery.filter(o=>o.z>camZ+350&&o.z<camZ+VIEW*SEG).concat(billboards.filter(o=>o.z>camZ+350&&o.z<camZ+VIEW*SEG));
 if(active)objects=objects.concat(traffic.filter(o=>o.z>camZ+350&&o.z<camZ+VIEW*SEG),pickups.filter(o=>!o.taken&&o.z>camZ+350&&o.z<camZ+VIEW*SEG));
 objects.sort((a,b)=>b.z-a.z);for(const o of objects)drawObject(o,camZ,0,cameraY,displayCtx);
 const turn=active?steer:-.05,carW=CAR_WIDTH*DEPTH*focalWidth()/(2*PLAYER_Z),carH=carW*(sprites.car.height/sprites.car.width),bottom=H*(1+CAM*DEPTH/PLAYER_Z)/2;
 const carX=Math.round(W/2+turn*carW*.065),bounce=!reducedMotion&&active&&speed>1000?Math.round(Math.sin(now/57)*.55):0,carY=Math.round(bottom-carH+bounce);
 displayCtx.save();displayCtx.translate(carX,carY);
 displayCtx.fillStyle='#14111bb0';displayCtx.beginPath();displayCtx.ellipse(0,carH*.93,carW*.51,carH*.13,0,0,7);displayCtx.fill();
 if(active&&Math.abs(playerX)>1.04&&state==='racing'){
  for(let i=0;i<9;i++){const trail=(now/25+i*11)%55;displayCtx.fillStyle=i%2?'#b7a18f70':'#e5c27b70';displayCtx.fillRect(Math.round((i%2?1:-1)*carW*.35+Math.sin(i*3)*9),Math.round(carH*.90+trail*.5),3+trail*.05,2+trail*.04);}
 }
 // Boost feedback follows the actual boost state in either mode.
 if(active&&boostActive&&state==='racing'){
  for(const side of[-1,1]){const flame=12+Math.sin(now/29)*5;poly(displayCtx,[[side*carW*.11-3,carH*.89],[side*carW*.11+3,carH*.89],[side*carW*.11,carH*.89+flame]],'#f5bd52');}
 }
 if(reducedMotion||!(invulnerable>0&&Math.floor(now/100)%2)){
  const frame=turn<-.19?sprites.carLeft:turn>.19?sprites.carRight:sprites.car;
  displayCtx.drawImage(frame,-carW/2,0,carW,carH);
 }
 displayCtx.restore();
 if(!reducedMotion&&state==='racing'&&boostActive){displayCtx.fillStyle='#f2d89970';for(let i=0;i<10;i++){let yy=H*.53+(i*47+now*.35)%(H*.39),x=i%2?W*.97:W*.03;displayCtx.fillRect(x,yy,1,12+i%4*3);}}
 if(!reducedMotion&&flash>0){displayCtx.fillStyle='#ffe9c440';displayCtx.fillRect(0,0,W,H);}
 displayCtx.restore();ctx.restore();
}
function frame(now){
 const wallDt=lastFrame?Math.max(0,(now-lastFrame)/1000):0;lastFrame=now;
 // Long foreground stalls pause rather than silently dropping race time or
 // replaying seconds of collisions before the player can react.
 if(wallDt>.5&&(state==='racing'||state==='countdown')){pause();accumulator=0;}
 else if(state==='racing'||state==='countdown'){
  accumulator+=wallDt;
  while(accumulator+1e-9>=STEP){update(STEP);accumulator=Math.max(0,accumulator-STEP);if(state!=='racing'&&state!=='countdown'){accumulator=0;break;}}
 }else accumulator=0;
 if(state==='attract'){attractZ+=Math.min(wallDt,.05)*800;if(attractZ>18000)attractZ=12000;}
 if(renderDirty||state!==lastRenderState||['attract','racing','countdown'].includes(state)){render(now);renderDirty=false;lastRenderState=state;}
 if(now-lastUi>80&&state!=='attract'&&data){updateUI();lastUi=now;}audioTick();requestAnimationFrame(frame);
}
const keyMap={ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right',ArrowDown:'brake',s:'brake',S:'brake',' ':'boost'};
window.addEventListener('keydown',e=>{if(e.defaultPrevented)return;if(!['racing','countdown','paused'].includes(state))return;if(keyMap[e.key]&&$('scheduleModal').hidden){e.preventDefault();if(state!=='paused'){heldKeys.add(e.key.length===1?e.key.toLowerCase():e.key);syncInputs();}}if(!e.repeat&&(e.key==='p'||e.key==='P'||e.key==='Escape')){e.preventDefault();if(!$('scheduleModal').hidden)closeSchedule();else if(state==='paused')resume();else pause();}});
window.addEventListener('keyup',e=>{if(keyMap[e.key]){heldKeys.delete(e.key.length===1?e.key.toLowerCase():e.key);syncInputs();}});window.addEventListener('blur',()=>{clearInputs();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInputs();pause();}});
for(const button of document.querySelectorAll('[data-control]')){const k=button.dataset.control;button.addEventListener('pointerdown',e=>{if(!['racing','countdown'].includes(state))return;e.preventDefault();touchPointers.set(e.pointerId,{control:k,button});syncInputs();button.classList.add('down');button.setPointerCapture(e.pointerId);});for(const ev of['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,e=>{touchPointers.delete(e.pointerId);syncInputs();button.classList.toggle('down',[...touchPointers.values()].some(t=>t.button===button));});}
$('startBtn').addEventListener('click',start);$('againBtn').addEventListener('click',start);$('resumeBtn').addEventListener('click',resume);$('pauseBtn').addEventListener('click',pause);$('quitBtn').addEventListener('click',garage);$('garageBtn').addEventListener('click',garage);for(const id of['lineupBtn','pauseLineupBtn','resultsLineupBtn'])$(id).addEventListener('click',schedule);for(const id of['closeSchedule','closeScheduleBottom'])$(id).addEventListener('click',closeSchedule);
document.querySelectorAll('input[name="mode"]').forEach(i=>i.addEventListener('change',()=>{$('modeHint').textContent=i.value==='cup'?'Three stages. Three lives. Beat the clock.':'A slower drive. No clock. Unlimited lives.';}));
$('soundBtn').addEventListener('click',()=>{muted=!muted;initAudio();if(audio)audio.resume();$('soundBtn').classList.toggle('active',!muted);$('soundBtn').setAttribute('aria-pressed',String(!muted));$('soundBtn').setAttribute('aria-label',muted?'Turn sound on':'Turn sound off');$('soundBtn').innerHTML=muted?'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM16 9l6 6m0-6-6 6"/></svg>':'<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4zM15 8q5 4 0 8m3-11q9 7 0 14"/></svg>';});
$('fullscreenBtn').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await app.requestFullscreen();}catch{toast('Full screen is unavailable here. You can still play in this window.');}});
document.addEventListener('keydown',e=>{const open=[...document.querySelectorAll('.modal')].reverse().find(m=>!m.hidden);if(!open)return;if(e.key==='Escape'&&!$('scheduleModal').hidden){e.preventDefault();closeSchedule();return;}if(e.key!=='Tab')return;const a=[...open.querySelectorAll('button,a[href],input')].filter(el=>!el.hidden),first=a[0],last=a[a.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
window.addEventListener('gamepadconnected',()=>toast('Controller connected · D-pad steers · A boosts · B brakes'));
window.MotorwayGame={pause};
fetch('parades.json').then(r=>{if(!r.ok)throw Error('Schedule could not load');return r.json();}).then(async d=>{validateSchedule(d);data=d;try{await Promise.all([document.fonts.load('800 72px "Barlow Condensed"'),document.fonts.load('700 46px Barlow')]);await document.fonts.ready;}catch{}await window.MotorwayArt.load();prepare();requestAnimationFrame(frame);}).catch(e=>{$('loading').hidden=true;$('loadError').hidden=false;$('loadError').textContent='The game artwork or parade lineup could not load. Please refresh to try again.';$('startBtn').disabled=true;console.error(e);});
})();
