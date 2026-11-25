'use strict';
(() => {
 const $=id=>document.getElementById(id),BASE='https://mg251.xyz/play/moonpie-motorway';
 let run=null,board=null,saved=null,savedRank=null,period='week',shareSnapshot=null,cardFile=null,cardGeneration=0,boardGeneration=0,shareLogo=null,shareArt=null;
 const rankTitles=["", "Port City Champion", "Silver Contender", "Bronze Contender", "Parade Pace Setter", "MoonPie Maverick", "Bead Bandit", "Royal Street Renegade", "Carnival Charger", "Throw Collector", "Port City Challenger", "MoonPie Pursuer", "Bead Chaser", "Float Follower", "Downtown Dasher", "Royal Street Rider", "Carnival Cruiser", "Parade Pathfinder", "Confetti Comet", "MoonPie Outlaw", "Bienville Blazer", "Mask Runner", "Throw Hunter", "Port City Rookie", "Last-Lap Legend", "Wildcard on Wheels"];
 const rankTitle=rank=>rankTitles[rank]||'';
 const status=text=>{$('rankStatus').textContent=text;};
 async function api(path,body){
  const response=await fetch(path,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(12000)});
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Shared rankings are not available on this preview. Your local best is still saved.');
  const data=await response.json();if(!response.ok)throw Error(data.error||'Rankings are unavailable. Please try again.');return data;
 }
 window.MotorwayCommunity={
  start(mode){
   const next={mode,id:null,error:null,ticks:0,controls:[],last:'',won:false};run=next;saved=null;savedRank=null;$('saveScoreForm').hidden=true;$('shareScoreBtn').hidden=true;status('');
   if(mode==='cup')next.ready=api('api/runs',{mode}).then(data=>{next.id=data.id;}).catch(error=>{next.error=error.message;});
  },
  tick(input){if(!run||run.mode!=='cup')return;const row=[input.turn,input.brake?1:0,input.boost?1:0],key=row.join(',');if(key!==run.last){run.controls.push([run.ticks,...row]);run.last=key;}run.ticks++;},
  finish(result){
   if(!run)return;Object.assign(run,result);$('saveScoreForm').hidden=!(result.mode==='cup'&&result.won);$('shareScoreBtn').hidden=false;$('shareScoreBtn').textContent='Challenge a friend';
   status(result.mode==='cruise'?'Scenic Cruise is just for fun. Complete Carnival Cup to join the rankings.':result.won?'Save your completed Cup run to join the leaderboard.':'Complete all three Cup stages to post a ranked score.');
   if(result.won&&result.mode==='cup')try{$('racerNickname').value=localStorage.getItem('motorway-nickname')||'';}catch{}
  }
 };
 $('saveScoreForm').addEventListener('submit',async event=>{
  event.preventDefault();const current=run;if(!current?.won)return;const nickname=$('racerNickname').value.trim();
  if(!/^[A-Za-z0-9][A-Za-z0-9 _-]{2,19}$/.test(nickname)){status('Choose a nickname with 3–20 letters, numbers, spaces, dashes or underscores.');return;}
  $('saveScoreBtn').disabled=true;status('Verifying your run…');
  try{
   await current.ready;if(current.error)throw Error(current.error);if(!current.id)throw Error('This run was not registered. Try a new Carnival Cup run.');
   const result=await api('api/runs/finish',{id:current.id,nickname,ticks:current.ticks,controls:current.controls});
   if(run!==current)return;saved=result.score;$('saveScoreForm').hidden=true;$('shareScoreBtn').hidden=false;
   try{localStorage.setItem('motorway-nickname',nickname);}catch{}
   status('Score verified and saved!');
   try{const standings=await api('api/leaderboard?period=week');if(run===current){savedRank=standings.personal?.id===saved.id?standings.personal.rank:null;status(standings.personal?`Your weekly best: #${standings.personal.rank} · ${standings.personal.score} throws.${standings.next?` Next to beat: ${standings.next.score} throws.`:' You lead the pack!'}`:'Saved to the season standings.');}}catch{/* Saving succeeded even if the follow-up standings request fails. */}
  }catch(error){if(run===current)status(error.message);}finally{$('saveScoreBtn').disabled=false;}
 });
 async function loadBoard(){
  const requested=period,request=++boardGeneration;board=null;$('boardCount').textContent='TOP 25 RACERS';$('boardTable').hidden=true;$('boardPodium').replaceChildren();$('personalStanding').hidden=true;$('shareSpotBtn').hidden=true;$('boardRows').replaceChildren();$('boardMessage').textContent='Loading standings…';$('shareBoardBtn').disabled=true;
  try{const data=await api('api/leaderboard?period='+requested);if(request!==boardGeneration)return;board=data;
   $('boardMessage').textContent=data.entries.length?(data.personal?`Your best: #${data.personal.rank}, ${data.personal.score} throws.${data.next?` Next to beat: ${data.next.score} throws.`:''}`:'Complete Carnival Cup to join these racers.'):'No finishers yet. Be the first to set a score!';
   $('boardCount').textContent=`TOP 25 · ${data.total??data.entries.length} ${(data.total??data.entries.length)===1?'RACER':'RACERS'}`;
   for(const row of data.entries.slice(0,25)){
    if(row.rank<=3){
     const card=document.createElement('article');card.className='podium-card podium-'+row.rank;
     const trophy=document.createElement('img');trophy.className='podium-trophy';trophy.src='assets/trophy-'+['','gold','silver','bronze'][row.rank]+'.svg';trophy.alt=['','Gold first-place trophy','Silver second-place trophy','Bronze third-place trophy'][row.rank];card.append(trophy);
     for(const [tag,cls,text] of [['span','podium-medal','#'+row.rank+' · '+rankTitle(row.rank)],['strong','podium-name',row.nickname],['b','podium-score',String(row.score)],['span','podium-detail','THROWS · '+formatTime(row.ticks)]]){const el=document.createElement(tag);el.className=cls;el.textContent=text;card.append(el);}
     $('boardPodium').append(card);
    }else{
     const tr=document.createElement('tr');tr.className=row.rank<=10?'rank-elite':'rank-chaser';
     for(const value of ['#'+row.rank,row.nickname+(data.personal?.id===row.id?' · YOU':''),row.score,formatTime(row.ticks)]){const td=document.createElement('td');td.textContent=String(value);if(tr.children.length===1){const title=document.createElement('small');title.className='rank-title';title.textContent=rankTitle(row.rank);td.append(title);}tr.append(td);}$('boardRows').append(tr);
    }
   }
   $('boardTable').hidden=!data.entries.some(row=>row.rank>3);
   if(data.personal){$('personalStanding').hidden=false;$('personalRank').textContent='#'+data.personal.rank;$('personalSummary').textContent=`${data.personal.nickname}${rankTitle(data.personal.rank)?` · ${rankTitle(data.personal.rank)}`:''} · ${data.personal.score} throws · ${formatTime(data.personal.ticks)}`;$('shareSpotBtn').hidden=false;}
   $('shareBoardBtn').disabled=false;
  }catch(error){if(request===boardGeneration)$('boardMessage').textContent=error.message;}
 }
 function formatTime(ticks){const seconds=Math.floor(ticks/60);return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');}
 function openBoard(){window.MotorwayGame?.pause();$('leaderboardDialog').showModal();loadBoard();}
 for(const id of ['garageLeaderboard','pauseLeaderboard','resultsLeaderboard'])$(id).addEventListener('click',openBoard);
 $('closeLeaderboard').addEventListener('click',()=>$('leaderboardDialog').close());
 $('boardPeriod').addEventListener('change',()=>{period=$('boardPeriod').value;loadBoard();});
 $('retryBoard').addEventListener('click',loadBoard);
 for(const id of ['leaderboardDialog','shareDialog']){
  $(id).addEventListener('keydown',event=>event.stopPropagation());
  $(id).addEventListener('cancel',event=>{event.preventDefault();$(id).close();});
 }
 function shareInfo(){
  const snap=shareSnapshot,score=snap.score,rank=snap.rank;
  const intro=snap.target==='board'?`The ${snap.period==='week'?'weekly':'season'} MoonPie Motorway leaderboard is calling.`:snap.verified?`${score.nickname} collected ${score.score} throws in Carnival Cup.${rank?` #${rank} on the ${snap.period==='week'?'weekly':'season'} leaderboard at last check.${rankTitle(rank)?` ${rankTitle(rank)}.`:''}`:''}`:`I collected ${score.score} throws in ${score.mode==='cruise'?'Scenic Cruise':'MoonPie Motorway'}. Unranked run, full bragging energy.`;
  const brag={challenge:'Your move. Come chase these throws.',playful:'All throws, no luck. Think you can do better?',friendly:'Your next race has a score to beat. Come take a shot!'}[$('shareTone').value]||'Think you can catch me?';
  return {title:'MoonPie Motorway · Challenge accepted?',text:intro+' '+brag+' Play free on MG251.',url:snap.target==='board'?BASE+'?board='+snap.period:snap.verified?BASE+'?score='+encodeURIComponent(score.id):BASE};
 }
 function refreshShare(){
  const info=shareInfo(),caption=info.text+'\n'+info.url;$('shareDescription').textContent=info.text;$('shareLink').value=info.url;
  $('facebookShare').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(info.url);
  $('whatsappShare').href='https://wa.me/?text='+encodeURIComponent(caption);
  $('xShare').href='https://twitter.com/intent/tweet?text='+encodeURIComponent(info.text)+'&url='+encodeURIComponent(info.url);
  $('emailShare').href='mailto:?subject='+encodeURIComponent(info.title)+'&body='+encodeURIComponent(caption);
  $('smsShare').href='sms:' + (/iPad|iPhone|iPod/.test(navigator.userAgent||'')?'&':'?')+'body='+encodeURIComponent(caption);
 }
 function openShare(target){
  shareSnapshot=target==='board'?{target,period,entries:board.entries.map(row=>({...row}))}:target==='spot'?{target,period,score:{...board.personal},rank:board.personal.rank,verified:true}:{target,period:'week',score:saved?{...saved}:{nickname:'My run',score:run.score||0,ticks:run.ticks,mode:run.mode},rank:savedRank,verified:!!saved};
  $('shareTone').value='challenge';refreshShare();$('shareMessage').textContent='';$('nativeShare').hidden=!navigator.share;$('shareDialog').showModal();prepareCard();
 }
 $('shareScoreBtn').addEventListener('click',()=>{if(run)openShare('score');});
 $('shareSpotBtn').addEventListener('click',()=>{if(board?.personal)openShare('spot');});
 $('shareBoardBtn').addEventListener('click',()=>{if(board)openShare('board');});
 $('shareTone').addEventListener('change',refreshShare);
 $('closeShare').addEventListener('click',()=>{$('shareDialog').close();});
 $('nativeShare').addEventListener('click',async()=>{try{if(!navigator.share)return;await navigator.share(shareInfo());}catch(error){if(error.name!=='AbortError')$('shareMessage').textContent='Sharing was unavailable. Copy your brag + play link or use a platform button.';}});
 async function copy(text){try{await navigator.clipboard.writeText(text);$('shareMessage').textContent='Copied. Paste it into your message, post, or Story link.';}catch{$('shareMessage').textContent='Copy manually: '+text;$('shareLink').focus();$('shareLink').select();}}
 $('copyShare').addEventListener('click',()=>copy(shareInfo().url));
 $('copyCaption').addEventListener('click',()=>{const info=shareInfo();return copy(info.text+'\n'+info.url);});
 function loadShareLogo(){
  if(!shareLogo)shareLogo=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{shareLogo=null;reject(Error('Brand image unavailable'));};img.src='assets/mg251-logo.png';});
  return shareLogo;
 }
 function loadShareArt(){
  if(!shareArt)shareArt=Promise.all(['share-race-square.jpg','trophy-gold.svg','trophy-silver.svg','trophy-bronze.svg'].map(name=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Share artwork unavailable'));img.src='assets/'+name;}))).catch(error=>{shareArt=null;throw error;});
  return shareArt;
 }
 async function prepareCard(){
  const generation=++cardGeneration;cardFile=null;$('instagramShare').disabled=true;$('downloadScoreCard').disabled=true;
  try{
   const [logo,art]=await Promise.all([loadShareLogo(),loadShareArt()]);if(generation!==cardGeneration)return;
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;const ctx=canvas.getContext('2d'),snap=shareSnapshot;
   ctx.drawImage(art[0],0,0,1080,1080);const bg=ctx.createLinearGradient(0,0,0,1080);bg.addColorStop(0,'#10091ddd');bg.addColorStop(.3,'#10091d99');bg.addColorStop(.7,'#10091dbb');bg.addColorStop(.78,'#10091d22');bg.addColorStop(.86,'#10091d22');bg.addColorStop(.93,'#10091ddd');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1080);
   ctx.shadowColor='#000';ctx.shadowBlur=5;
   ctx.strokeStyle='#f9cf66';ctx.lineWidth=6;ctx.strokeRect(38,38,1004,1004);ctx.drawImage(logo,70,65,180,180);ctx.fillStyle='#f9cf66';ctx.textAlign='center';ctx.font='800 64px "Barlow Condensed",sans-serif';ctx.fillText('MOONPIE MOTORWAY',650,145,730);ctx.font='700 23px Barlow,sans-serif';ctx.fillText('MG251 / PORT CITY BRAGGING RIGHTS',650,205,730);
   if(snap.target==='board'){
    ctx.font='800 52px "Barlow Condensed",sans-serif';ctx.fillText(snap.period==='week'?'THIS WEEK’S TOP 25':'SEASON TOP 25',540,300);
    if(!snap.entries.length){ctx.font='700 40px Barlow,sans-serif';ctx.fillText('THE FIRST CROWN IS UP FOR GRABS.',540,540,900);}
    snap.entries.filter(row=>row.rank<=3).forEach(row=>{const x={1:540,2:220,3:860}[row.rank],y=row.rank===1?310:330;ctx.drawImage(art[row.rank],x-66,y,132,165);ctx.textAlign='center';ctx.fillStyle=['','#f9cf66','#d8e6f3','#e9b087'][row.rank];ctx.font='700 24px Barlow,sans-serif';ctx.fillText(row.nickname,x,505,280);ctx.font='800 30px Barlow,sans-serif';ctx.fillText(String(row.score)+' throws',x,540);});
    snap.entries.filter(row=>row.rank>3).slice(0,22).forEach((row,i)=>{const col=i<11?0:1,n=i<11?i:i-11,x=75+col*480,y=578+n*23;ctx.fillStyle=row.rank<=10?'#fff2d5':'#d3c5dc';ctx.font=(row.rank<=10?'700':'500')+' 19px Barlow,sans-serif';ctx.textAlign='left';ctx.fillText('#'+row.rank+' '+row.nickname,x,y,320);ctx.textAlign='right';ctx.fillText(String(row.score),x+440,y);});
   }else{
    const score=snap.score;if(snap.rank&&snap.rank<=3)ctx.drawImage(art[snap.rank],790,335,180,225);ctx.fillStyle='#fff2d5';ctx.font='700 48px Barlow,sans-serif';ctx.fillText(score.nickname,540,335,900);
    ctx.fillStyle='#f9cf66';ctx.font='900 160px "Barlow Condensed",sans-serif';ctx.fillText(String(score.score),540,520);ctx.font='700 34px Barlow,sans-serif';ctx.fillText('THROWS · '+(score.mode==='cruise'?'SCENIC CRUISE':'CARNIVAL CUP'),540,585);
    ctx.fillStyle='#fff2d5';ctx.font='800 56px "Barlow Condensed",sans-serif';ctx.fillText(snap.rank?'#'+snap.rank+' · '+(snap.period==='week'?'WEEKLY':'SEASON')+' RANK':snap.verified?'VERIFIED CUP FINISH':'UNRANKED RUN',540,700);
    if(rankTitle(snap.rank)){ctx.font='800 31px Barlow,sans-serif';ctx.fillStyle='#f9cf66';ctx.fillText(rankTitle(snap.rank),540,737,900);}ctx.fillStyle='#fff2d5';ctx.font='500 23px Barlow,sans-serif';ctx.fillText(snap.rank?'Rank at last check · '+formatTime(score.ticks):formatTime(score.ticks),540,775);
   }
   ctx.textAlign='center';ctx.fillStyle='#f9cf66';ctx.font='800 48px "Barlow Condensed",sans-serif';ctx.fillText('BIG TALK? BEAT THIS.',540,955);ctx.fillStyle='#fff2d5';ctx.font='600 26px Barlow,sans-serif';ctx.fillText('PLAY FREE · mg251.xyz/play/moonpie-motorway',540,998);ctx.font='400 16px Barlow,sans-serif';ctx.fillText('Snapshot · '+new Date().toLocaleDateString('en-US'),540,1027);
   canvas.toBlob(blob=>{if(generation!==cardGeneration)return;if(!blob){$('shareMessage').textContent='Image unavailable. Share the play link instead.';return;}cardFile=new File([blob],'moonpie-motorway-challenge.png',{type:'image/png'});$('instagramShare').disabled=false;$('downloadScoreCard').disabled=false;},'image/png');
  }catch{$('shareMessage').textContent='Image unavailable. You can still share your brag + play link.';}
 }
 function downloadCard(){if(!cardFile)return;const url=URL.createObjectURL(cardFile),a=document.createElement('a');a.href=url;a.download=cardFile.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);$('shareMessage').textContent='Image downloaded. Copy your brag + play link, then add both to your post.';}
 $('downloadScoreCard').addEventListener('click',downloadCard);
 $('instagramShare').addEventListener('click',async()=>{
  if(!cardFile)return;
  try{
   if(navigator.share&&navigator.canShare?.({files:[cardFile]})){await navigator.share({...shareInfo(),files:[cardFile]});}
   else {downloadCard();$('shareMessage').textContent='Image downloaded for Instagram. Copy your brag + play link, upload the image, and paste the link into your caption or Story link sticker.';}
  }catch(error){if(error.name!=='AbortError')$('shareMessage').textContent='Image sharing was unavailable. Download the image and copy your brag + play link instead.';}
 });
 const query=new URLSearchParams(location.search);
 if(query.has('board')){period=query.get('board')==='season'?'season':'week';$('boardPeriod').value=period;openBoard();}
 if(query.has('score'))api('api/scores/'+encodeURIComponent(query.get('score'))).then(score=>{$('challengeBanner').hidden=false;$('challengeText').textContent=`${score.nickname} finished Carnival Cup with ${score.score} throws. Can you beat it?`;}).catch(()=>{});
})();
