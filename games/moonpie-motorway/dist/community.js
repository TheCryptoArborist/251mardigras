'use strict';
(() => {
 const $=id=>document.getElementById(id),BASE='https://mg251.xyz/play/moonpie-motorway';
 let run=null,board=null,saved=null,savedRank=null,period='week',shareTarget='score';
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
   if(!run)return;Object.assign(run,result);$('saveScoreForm').hidden=!(result.mode==='cup'&&result.won);$('shareScoreBtn').hidden=true;
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
  const requested=period;board=null;$('boardRows').replaceChildren();$('boardMessage').textContent='Loading standings…';$('shareBoardBtn').disabled=true;
  try{const data=await api('api/leaderboard?period='+requested);if(period!==requested)return;board=data;
   $('boardMessage').textContent=data.entries.length?(data.personal?`Your best: #${data.personal.rank}, ${data.personal.score} throws.${data.next?` Next to beat: ${data.next.score} throws.`:''}`:'Complete Carnival Cup to join these racers.'):'No finishers yet. Be the first to set a score!';
   for(const row of data.entries){const tr=document.createElement('tr');for(const value of ['#'+row.rank,row.nickname,row.score,formatTime(row.ticks)]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}$('boardRows').append(tr);}
   $('shareBoardBtn').disabled=false;
  }catch(error){if(period===requested)$('boardMessage').textContent=error.message;}
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
  if(shareTarget==='board')return {title:`MoonPie Motorway ${period==='week'?'weekly':'season'} leaderboard`,text:'Can you top the MoonPie Motorway leaderboard? Race through Mobile Mardi Gras on MG251.',url:BASE+'?board='+period};
  return {title:'My MoonPie Motorway score',text:`${saved.nickname} collected ${saved.score} throws in Carnival Cup.${savedRank?` Weekly rank #${savedRank} when saved.`:''} Can you beat it?`,url:BASE+'?score='+encodeURIComponent(saved.id)};
 }
 function openShare(target){shareTarget=target;const info=shareInfo();$('shareDescription').textContent=info.text;$('facebookShare').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(info.url);$('shareMessage').textContent='';$('shareDialog').showModal();}
 $('shareScoreBtn').addEventListener('click',()=>{if(saved)openShare('score');});
 $('shareBoardBtn').addEventListener('click',()=>{if(board)openShare('board');});
 $('closeShare').addEventListener('click',()=>$('shareDialog').close());
 $('nativeShare').addEventListener('click',async()=>{try{if(!navigator.share){$('shareMessage').textContent='Use Copy link, Facebook, or Download image on this browser.';return;}await navigator.share(shareInfo());}catch(error){if(error.name!=='AbortError')$('shareMessage').textContent='Sharing was unavailable. Try copying the link.';}});
 $('copyShare').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(shareInfo().url);$('shareMessage').textContent='Link copied.';}catch{$('shareMessage').textContent=shareInfo().url;}});
 $('downloadScoreCard').addEventListener('click',async()=>{
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;const ctx=canvas.getContext('2d');
  ctx.fillStyle='#211033';ctx.fillRect(0,0,1080,1080);ctx.strokeStyle='#f9cf66';ctx.lineWidth=8;ctx.strokeRect(42,42,996,996);
  ctx.fillStyle='#f9cf66';ctx.textAlign='center';ctx.font='900 82px "Barlow Condensed",sans-serif';ctx.fillText('MOONPIE MOTORWAY',540,180);ctx.font='700 34px Barlow,sans-serif';ctx.fillText('MG251 · MOBILE MARDI GRAS',540,245);
  ctx.fillStyle='#fff2d5';
  if(shareTarget==='score'){
   ctx.font='700 52px Barlow,sans-serif';ctx.fillText(saved.nickname,540,410,900);ctx.fillStyle='#f9cf66';ctx.font='900 160px "Barlow Condensed",sans-serif';ctx.fillText(String(saved.score),540,610);ctx.font='700 40px Barlow,sans-serif';ctx.fillText('THROWS · CARNIVAL CUP',540,680);ctx.fillStyle='#fff2d5';ctx.font='600 32px Barlow,sans-serif';ctx.fillText((savedRank?'Weekly #'+savedRank+' when saved · ':'Verified finish · ')+formatTime(saved.ticks),540,750);
  }else{
   ctx.font='700 40px Barlow,sans-serif';ctx.fillText(period==='week'?'THIS WEEK’S LEADERS':'SEASON LEADERS',540,350);
   board.entries.slice(0,5).forEach((row,i)=>{ctx.textAlign='left';ctx.font='600 36px Barlow,sans-serif';ctx.fillText('#'+row.rank+'  '+row.nickname,100,445+i*65,660);ctx.textAlign='right';ctx.fillStyle='#f9cf66';ctx.fillText(String(row.score),980,445+i*65);ctx.fillStyle='#fff2d5';});
   ctx.textAlign='center';ctx.font='500 25px Barlow,sans-serif';ctx.fillText('Standings captured '+new Date().toLocaleDateString('en-US'),540,830);
  }
  ctx.textAlign='center';ctx.fillStyle='#f9cf66';ctx.font='800 40px Barlow,sans-serif';ctx.fillText('CAN YOU BEAT IT?',540,910);ctx.fillStyle='#fff2d5';ctx.font='500 28px Barlow,sans-serif';ctx.fillText('mg251.xyz/play/moonpie-motorway',540,968);
  canvas.toBlob(blob=>{if(!blob){$('shareMessage').textContent='Image unavailable. Try copying the link.';return;}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mg251-moonpie-motorway.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);$('shareMessage').textContent='Square image ready for Instagram or Facebook. Add the game link to your post.';},'image/png');
 });
 const query=new URLSearchParams(location.search);
 if(query.has('board')){period=query.get('board')==='season'?'season':'week';$('boardPeriod').value=period;openBoard();}
 if(query.has('score'))api('api/scores/'+encodeURIComponent(query.get('score'))).then(score=>{$('challengeBanner').hidden=false;$('challengeText').textContent=`${score.nickname} finished Carnival Cup with ${score.score} throws. Can you beat it?`;}).catch(()=>{});
})();
