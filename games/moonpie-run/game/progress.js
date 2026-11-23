import {BADGES,EMPTY_STATS,badgeProgress,combineStats} from './badges.mjs?v=1.14';
import {RunOutbox} from './run-outbox.mjs?v=1.14';
const $=id=>document.getElementById(id),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let medalSerial=0;
function icon(kind){
 const id='medal-'+(++medalSerial),gold='url(#'+id+'-gold)',purple='url(#'+id+'-purple)';
 const star=(x,y,s=1)=>'<path d="M0 -7 2 -2 7 0 2 2 0 7 -2 2 -7 0 -2 -2Z" transform="translate('+x+' '+y+') scale('+s+')" fill="#fff0b0"/>';
 const fleur='<path d="M0 -15C-12 -6 -5 -2 -2 1C-17 -9 -18 4 -6 6L-3 4 -4 10H4L3 4 6 6C18 4 17 -9 2 1C5 -2 12 -6 0 -15Z"/>';
 const coin=(x,y,r=13)=>'<g transform="translate('+x+' '+y+')"><circle r="'+r+'" fill="'+gold+'" stroke="#6d3e24" stroke-width="2"/><circle r="'+(r-3)+'" fill="none" stroke="#fff1b6" stroke-width="1"/><g transform="scale('+(r/24)+')" fill="#6e3e46">'+fleur+'</g></g>';
 const crown='<path d="M-23 -12 -17 13H17L23 -12 9 -3 0 -21 -9 -3Z" fill="'+gold+'" stroke="#fff0b8" stroke-width="1.4"/><path d="M-17 15H17V21H-17Z" fill="#d8a442" stroke="#ffe49c"/><path d="M-10 8H10" stroke="#7d4262" stroke-width="2"/><path d="m0 -4 4 5-4 5-4-5Z" fill="#7837a1"/>'+[-23,0,23].map((x,i)=>'<circle cx="'+x+'" cy="'+(i===1?-22:-13)+'" r="3" fill="#fff0af"/>').join('');
 const ghost=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-13 16V-3C-13 -22 13 -22 13 -3V16L7 11 0 16 -7 11Z" fill="'+purple+'" stroke="#ffe7a3" stroke-width="1.7"/><ellipse cx="-5" cy="-2" rx="3.2" ry="4.2" fill="#fff0bb"/><ellipse cx="5" cy="-2" rx="3.2" ry="4.2" fill="#fff0bb"/><circle cx="-4" cy="-1" r="1.5" fill="#341243"/><circle cx="6" cy="-1" r="1.5" fill="#341243"/><path d="M-4 8Q0 4 4 8" fill="none" stroke="#f6cc76"/></g>';
 const pie=(x,y,s=1)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><ellipse cy="5" rx="23" ry="11" fill="#59343b" stroke="#f3cb7a" stroke-width="1.2"/><path d="M-23 -4V4C-23 15 23 15 23 4V-4" fill="#b88851" stroke="#ffe2a1" stroke-width="1.2"/><path d="M-22 0C-12 9 12 9 22 0" fill="none" stroke="#fff0c0" stroke-width="4"/><ellipse cy="-5" rx="23" ry="10" fill="'+gold+'" stroke="#fff0bd" stroke-width="1.3"/><path d="m-11 -6 4 3 4-4 4 3 4-3 5 3" fill="none" stroke="#996039" stroke-width="1.5"/><circle cx="-14" cy="-7" r="1" fill="#754033"/><circle cx="13" cy="-4" r="1" fill="#754033"/></g>';
 const mask='<path d="M-26 -10Q-14 -20 0 -9Q14 -20 26 -10L20 5Q10 15 0 3Q-10 15 -20 5Z" fill="'+purple+'" stroke="#ffe6a0" stroke-width="2"/><path d="M-19 -5Q-11 -12 -4 -4Q-10 3 -17 0ZM19 -5Q11 -12 4 -4Q10 3 17 0Z" fill="#ffe6a0"/>';
 const art={
 first_throw:coin(0,0,25)+star(-23,-24,.6)+star(25,20,.5),
 dauphin_collector:coin(-15,10,17)+coin(17,9,17)+coin(0,-10,21)+star(26,-20,.65),
 doubloon_royalty:coin(-17,20,12)+coin(17,20,12)+'<g transform="translate(0 -7)">'+crown+'</g>',
 moonpie_moment:'<path d="M21 -27A26 26 0 1 0 25 14A22 22 0 0 1 21 -27" fill="#bc83d0"/>'+pie(0,7,1.1)+star(23,-18,.8),
 sweet_tooth:pie(-10,16,.8)+pie(13,3,.8)+pie(-6,-11,.8)+star(24,-24,.6),
 ghost_catcher:ghost(-5,1,1.25)+'<path d="M11 7 27 28" stroke="#e9bb62" stroke-width="4"/><ellipse cx="13" cy="3" rx="11" ry="14" transform="rotate(-35 13 3)" fill="#f9dc8c18" stroke="#ffe6a3" stroke-width="2"/><path d="m5 -4 14 16M8 -8 15 19M3 2 25 1M4 8 23 -5" stroke="#f7d88b" stroke-width=".7"/>',
 phantom_dauphin:'<path d="M-28 27Q-21 -1 -13 -17H13Q21 -1 28 27L12 21 0 30 -12 21Z" fill="#713794" stroke="#ddb16d"/>'+ghost(0,0,1.2)+'<g transform="translate(0 -8) scale(.6)">'+mask+'</g>'+star(-24,-23,.6),
 street_sweep:[[-17,-15],[17,-15],[-17,17],[17,17]].map(([x,y])=>ghost(x,y,.65)).join('')+star(0,0,1.2),
 golden_catch:'<path d="m0 -32 9 10 15-2-2 15 10 9-10 9 2 15-15-2-9 10-9-10-15 2 2-15-10-9 10-9-2-15 15 2Z" fill="#d99b3e"/>'+coin(0,0,23)+star(25,-26,.8)+star(-25,26,.5),
 parade_starter:'<path d="M-20 29V-29" stroke="#ffe7a0" stroke-width="4"/><circle cx="-20" cy="-29" r="4" fill="#f6cd77"/><path d="M-18 -25Q-3 -32 10 -23L26 -22 16 -10 25 4Q7 -2 -4 3L-18 2Z" fill="'+purple+'" stroke="#ffdfa0" stroke-width="1.6"/><g transform="translate(1 -9) scale(.7)" fill="#f3ca78">'+fleur+'</g><path d="M-24 29H-13" stroke="#dba957" stroke-width="3"/>',
 port_city_royalty:'<path d="M-29 25V2H-18V25M-12 25V-8L-5 -20 2 -8V25M9 25V-2H23V25M-31 29H31" fill="#a36abb" stroke="#f2d08b" stroke-width="1.6"/><g transform="translate(0 -17) scale(.68)">'+crown+'</g><path d="M-7 -2V18M-24 8V18M15 4V18" stroke="#ffe8ab" stroke-width="2"/>',
 untouchable:'<path d="M0 -33 28 -22V1C28 22 0 34 0 34S-28 22 -28 1V-22Z" fill="'+gold+'" stroke="#fff0be" stroke-width="2"/><path d="M0 -26 21 -18V1C21 16 0 26 0 26S-21 16 -21 1V-18Z" fill="'+purple+'" stroke="#a66bbe"/><g transform="translate(0 -5) scale(.66)">'+mask+'</g><path d="m-9 11 6 6L12 2" fill="none" stroke="#ffdf88" stroke-width="4" stroke-linecap="round"/>'+star(-28,-27,.6)+star(27,23,.5)
 };
 const rim=Array.from({length:48},(_,i)=>{const a=i*Math.PI/24,r=i%2?43:46;return(50+Math.cos(a)*r)+','+(49+Math.sin(a)*r)}).join(' ');
 return '<svg class="medal-art" viewBox="0 0 100 110" aria-hidden="true"><defs><linearGradient id="'+id+'-gold" x2=".8" y2="1"><stop stop-color="#fff0b5"/><stop offset=".27" stop-color="#edc568"/><stop offset=".55" stop-color="#ab702d"/><stop offset=".78" stop-color="#fbe09a"/><stop offset="1" stop-color="#b57a33"/></linearGradient><radialGradient id="'+id+'-purple" cx=".35" cy=".22" r=".9"><stop stop-color="#ba80d6"/><stop offset=".45" stop-color="#75429a"/><stop offset="1" stop-color="#321449"/></radialGradient><radialGradient id="'+id+'-core"><stop stop-color="#51315e"/><stop offset="1" stop-color="#1a0b2b"/></radialGradient></defs><path d="M20 70 14 105 29 98 39 108 47 76M80 70 86 105 71 98 61 108 53 76" fill="'+purple+'" stroke="#d6ac60" stroke-width="1.2"/><polygon points="'+rim+'" fill="'+gold+'" stroke="#6e4235" stroke-width="1.5"/><circle cx="50" cy="49" r="40" fill="'+purple+'" stroke="#fff0b1" stroke-width="1"/><circle cx="50" cy="49" r="36" fill="url(#'+id+'-core)" stroke="#d1a157" stroke-width="1.3"/><circle cx="50" cy="49" r="38" fill="none" stroke="#e9bf73" stroke-dasharray=".4 4.6" stroke-width="1.7" stroke-linecap="round"/><g transform="translate(50 49) scale(.85)">'+(art[kind]||art.first_throw)+'</g><path d="M22 84Q50 95 78 84L76 94Q50 105 24 94Z" fill="'+gold+'" stroke="#754630"/><path d="M32 92H43M57 92H68" stroke="#875032" stroke-width="1"/><path d="m50 87 2 3 4 1-4 1-2 3-2-3-4-1 4-1Z" fill="#64304f"/></svg>';
}
async function api(path,data){const r=await fetch((document.querySelector('meta[name="moonpie-api-base"]')?.content || '')+path,{method:data?'POST':'GET',credentials:'same-origin',headers:data?{'content-type':'application/json'}:{},...(data?{body:JSON.stringify(data)}:{})});let result;try{result=await r.json()}catch{throw new Error('Scores are temporarily unavailable. Please try again.')}if(!r.ok){const e=new Error(result.error||'Please try again.');Object.assign(e,result,{status:r.status});throw e;}return result;}
class Progress {
 constructor(){
  this.scope='all';this.boardRequest=0;this.profileRequest=0;this.detail=null;this.player=null;this.signedIn=false;this.canSave=false;this.profileKind='visitor';this.base={...EMPTY_STATS};this.run=null;this.summary=null;this.loading=true;this.profileError='';this.board=null;this.boardError='';this.tab='leaderboard';this.notified=new Set();this.queue=[];this.noticeTimer=null;
  let storage;try{storage=sessionStorage;}catch{}this.outbox=new RunOutbox(storage);
  this.bind();this.profilePromise=this.loadProfile();
 }
 bind(){
  window.addEventListener('online',()=>{if(this.player)this.savePending()});
  $('player-button').onclick=()=>{this.open('profile');setTimeout(()=>$('username-input')?.focus(),20)};
  $('leaderboard-button').onclick=()=>this.open('leaderboard');$('badges-button').onclick=()=>this.open('badges');
  $('progress-close').onclick=()=>this.close();$('progress-dialog').addEventListener('cancel',e=>{e.preventDefault();this.close()});
  for(const b of document.querySelectorAll('[data-scope]'))b.onclick=()=>{this.scope=b.dataset.scope;this.loadBoard()};
  const tabs=[...document.querySelectorAll('[data-progress-tab]')];for(const [i,b] of tabs.entries()){b.onclick=()=>this.switchTab(b.dataset.progressTab);b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].focus();this.switchTab(tabs[n].dataset.progressTab);};}
 }
 async loadProfile(){
  this.loading=true;this.profileError='';this.renderProfile();
  try{const data=await api('/api/player');this.signedIn=data.signedIn;this.canSave=!!data.canSave;this.profileKind=data.profileKind||'account';this.adopt(data.player);}
  catch(e){this.profileError=e.message;}finally{this.loading=false;this.renderProfile();this.refresh(false);if(this.player)this.savePending();}
 }
 adopt(player){this.player=player;this.base={...EMPTY_STATS,...player?.stats};for(const b of badgeProgress(this.base))if(b.earned)this.notified.add(b.id);document.dispatchEvent(new CustomEvent('moonpie:profile',{detail:{bestScore:this.base.bestScore}}));}
 begin(){
  const startingBadges=badgeProgress(this.stats()).filter(b=>b.earned).map(b=>b.id);this.summary=null;
  const run={startingBadges,localId:crypto.randomUUID(),coins:0,pies:0,ghosts:0,bonuses:0,routes:0,maxChain:0,capturePoints:0,powerChains:[],routeTimes:[],score:0,won:false,livesLost:0,finished:false,remoteId:null};this.run=run;
  run.remote=Promise.resolve(this.profilePromise).then(async()=>{if(!this.canSave)return null;try{const result=await api('/api/runs',{});run.remoteId=result.runId;return result.runId}catch(e){run.error=e.message;return null;}});
  if(this.player)this.savePending();this.refresh(false);
 }
 track(type,data={}){
  const r=this.run;if(!r||r.finished)return;r.score=data.score??r.score;
  if(type==='coin')r.coins++;if(type==='pie'){r.pies++;r.powerChains.push(0);}
  if(type==='ghost'){if(r.powerChains.length)r.powerChains[r.powerChains.length-1]++;r.ghosts++;r.maxChain=Math.max(r.maxChain,data.chain||1);r.capturePoints+=data.points||0;}
  if(type==='bonus')r.bonuses++;if(type==='route'){r.routes++;r.routeTimes.push(data.time);}
  this.refresh(true);
 }
 async finish({score,duration,livesLost,outcome}){
  const r=this.run;if(!r||r.finished)return;r.finished=true;r.score=score;r.won=outcome==='win';r.livesLost=livesLost;this.refresh(true);
  const earned=badgeProgress(this.stats()).filter(b=>b.earned&&!r.startingBadges.includes(b.id)).map(b=>b.id);
  const summary={score,localId:r.localId,coins:r.coins,ghosts:r.ghosts,routes:r.routes,earned,status:'Preparing your run…',saved:false};
  this.summary=summary;this.renderRunRecap();const runId=await r.remote;
  if(!runId){summary.status=r.error||'This run could not connect to score saving. Refresh before your next run.';this.renderRunRecap();return;}
  const payload={runId,score,duration,livesLost,outcome,coins:r.coins,pies:r.pies,ghosts:r.ghosts,bonuses:r.bonuses,routes:r.routes,maxChain:r.maxChain,capturePoints:r.capturePoints,powerChains:[...r.powerChains],routeTimes:[...r.routeTimes]};
  this.outbox.add({payload,localId:r.localId});this.refresh(false);summary.status=this.player?'Saving your score and badges…':'Choose a username to save this run.';this.renderRunRecap();this.renderPending();
  if(this.player)await this.savePending();
 }
 async savePending(){
  if(!this.player||!this.outbox.items.some(p=>!p.blocked))return;
  const draining=this.outbox.drain(payload=>api('/api/runs/finish',payload),(item,data)=>{
   this.adopt(data.player);if(this.run?.localId===item.localId)this.run=null;
   if(this.summary?.localId===item.localId){this.summary.saved=true;this.summary.status='Score and badges saved.';}
   this.board=null;this.refresh(false);
  },(item,error)=>{
   if(this.summary?.localId===item.localId)this.summary.status=error.message;
   if(item.blocked&&this.run?.localId===item.localId)this.run=null;this.refresh(false);
  });
  this.renderPending();await draining;
  const waiting=this.outbox.items.find(p=>p.localId===this.summary?.localId);if(waiting)this.summary.status=waiting.error||'Your run is waiting to save. Open save status to retry.';
  this.renderPending();this.renderRunRecap();
  if(this.summary?.saved||$('progress-dialog').open&&this.tab==='leaderboard')await this.loadBoard();
 }
 stats(){
  let stats={...this.base};const ids=new Set();
  for(const item of this.outbox.items)if(!item.blocked){stats=combineStats(stats,{...item.payload,won:item.payload.outcome==='win'});ids.add(item.localId);}
  return this.run&&!ids.has(this.run.localId)?combineStats(stats,this.run):stats;
 }
 renderRunRecap(){
  const s=this.summary,el=$('run-recap');if(!s||!el)return;el.hidden=false;
  const earned=s.earned.map(id=>BADGES.find(b=>b.id===id)).filter(Boolean);
  el.innerHTML='<div class="run-metrics"><span><b>'+s.coins+'</b> DOUBLOONS</span><span><b>'+s.ghosts+'</b> GHOSTS</span><span><b>'+s.routes+'/3</b> ROUTES</span></div>'+(earned.length?'<div class="run-earned"><small>'+earned.length+' NEW '+(earned.length===1?'BADGE':'BADGES')+'</small><div>'+earned.slice(0,2).map(b=>'<span>'+icon(b.id)+escape(b.name)+'</span>').join('')+(earned.length>2?'<button id="recap-badges">+'+(earned.length-2)+' more →</button>':'')+'</div></div>':'<div class="run-earned"><small>KEEP COLLECTING TO EARN YOUR NEXT BADGE</small></div>')+(s.saved&&this.board?.me&&this.board.period?.scope==='all'?'<div class="recap-rank">LEADERBOARD BEST <b>#'+this.board.me.rank+'</b> · '+this.board.me.score.toLocaleString()+' POINTS</div>':'');
  if(s.saved){const share=document.createElement('button');share.className='small-action recap-share';share.textContent='Share this score ↗';share.onclick=()=>this.shareScore(s.score,'RUN SCORE');el.append(share);}
  if($('recap-badges'))$('recap-badges').onclick=()=>this.open('badges');
  $('run-save-status').textContent=s.status;
  $('save-run').textContent=s.saved?'View leaderboard & badges →':this.player?'Leaderboard & save status →':'Choose username & save →';
 }
 refresh(notify){
  const badges=badgeProgress(this.stats());$('player-name').textContent=this.player?.username||'Choose username';$('player-name').title=this.player?.username||'Set your player username';$('badge-count').textContent=badges.filter(b=>b.earned).length+'/'+BADGES.length;
  if(notify)for(const b of badges)if(b.earned&&!this.notified.has(b.id)){this.notified.add(b.id);this.queue.push(b);}
  this.showNextNotice();this.renderRunRecap();if($('progress-dialog').open&&this.tab==='badges')this.renderBadges();
 }
 showNextNotice(){
  if(this.noticeTimer||!this.queue.length)return;const b=this.queue.shift(),el=$('badge-notice');el.innerHTML='<span>'+icon(b.id)+'</span><div><small>BADGE EARNED</small><b>'+escape(b.name)+'</b></div>';el.classList.add('visible');
  this.noticeTimer=setTimeout(()=>{el.classList.remove('visible');this.noticeTimer=setTimeout(()=>{this.noticeTimer=null;this.showNextNotice()},250)},2700);
 }
 open(tab='leaderboard'){
  this.focus=document.activeElement;if(!$('progress-dialog').open){$('progress-dialog').showModal();document.dispatchEvent(new CustomEvent('moonpie:panel',{detail:{open:true}}));}
  this.renderProfile();this.switchTab(tab);
 }
 close(){if(!$('progress-dialog').open)return;$('progress-dialog').close();document.dispatchEvent(new CustomEvent('moonpie:panel',{detail:{open:false}}));this.focus?.focus?.({preventScroll:true});}
 switchTab(tab,playerName){this.tab=tab;for(const b of document.querySelectorAll('[data-progress-tab]'))b.setAttribute('aria-selected',String(b.dataset.progressTab===tab));$('board-panel').hidden=tab!=='leaderboard';$('badges-panel').hidden=tab!=='badges';$('player-detail').hidden=tab!=='profile';if(tab==='badges')this.renderBadges();else if(tab==='profile')this.loadPlayer(playerName||this.player?.username);else this.loadBoard();}
 renderProfile(){
  const el=$('profile-panel');if(!el)return;
  if(this.loading){el.innerHTML='<p class="muted">Loading your player profile…</p>';return;}
  if(this.profileError){el.innerHTML='<p class="profile-message">'+escape(this.profileError)+'</p><button class="small-action" id="retry-profile">Retry profile</button>';$('retry-profile').onclick=()=>{this.profilePromise=this.loadProfile()};return;}
  if(!this.canSave){el.innerHTML='<p class="profile-message">Your player profile is unavailable. Refresh the game to try again.</p>';return;}
  el.innerHTML='<form id="username-form"><div><label for="username-input">YOUR PARADE NAME</label><p>Your parade name, saved stats and earned badges appear in your public player profile. '+(this.profileKind==='visitor'?'No account needed.':'')+'</p></div><div class="username-fields"><input id="username-input" name="username" autocomplete="nickname" autocapitalize="none" spellcheck="false" maxlength="20" minlength="2" required placeholder="MoonPieRunner" value="'+escape(this.player?.username||'')+'"><button class="small-action" type="submit">'+(this.player?'Update name':'Save name')+'</button></div><span id="username-message" class="profile-message" aria-live="polite">2–20 characters · letters, numbers, spaces, _ . -</span></form><p class="profile-footnote">'+(this.profileKind==='visitor'?'This browser remembers your name, scores and badges. Clearing its cookies starts a new profile.':'Your scores and badges are saved to your signed-in profile.')+'</p><div id="pending-panel"></div>';
  $('username-form').onsubmit=async e=>{
   e.preventDefault();const button=e.currentTarget.querySelector('button'),name=$('username-input').value.trim();button.disabled=true;$('username-message').textContent='Saving…';
   try{const result=await api('/api/player',{username:name});this.signedIn=result.signedIn;this.canSave=!!result.canSave;this.profileKind=result.profileKind;this.adopt(result.player);this.refresh(false);this.renderProfile();if(this.tab==='profile')this.loadPlayer(this.player.username);$('username-message').textContent='Username saved.';if(this.outbox.items.some(p=>!p.blocked))await this.savePending();else if(this.tab==='leaderboard')this.loadBoard();}
   catch(err){$('username-message').textContent=err.message;button.disabled=false;}
  };this.renderPending();
 }
 renderPending(){
  const el=$('pending-panel');if(!el)return;const items=this.outbox.items;
  if(!items.length){el.innerHTML='';return;}
  const saving=!!this.outbox.inFlight,ready=items.some(p=>!p.blocked);
  el.innerHTML='<div class="pending-heading"><strong>'+items.length+' '+(items.length===1?'RUN':'RUNS')+' WAITING TO SAVE</strong>'+(this.player&&ready?'<button class="small-action" id="retry-save" '+(saving?'disabled':'')+'>'+(saving?'Saving…':'Save runs →')+'</button>':'')+'</div><div class="pending-list">'+items.map(item=>'<div class="pending-run"><div><strong>'+Number(item.payload.score).toLocaleString()+' POINTS</strong><p>'+escape(item.error||(this.player?'Kept in this tab until saved.':'Save a username to post this run.'))+'</p></div>'+(item.blocked?'<button class="dismiss-run" data-dismiss="'+escape(item.payload.runId)+'">Dismiss</button>':'')+'</div>').join('')+'</div>';
  if($('retry-save'))$('retry-save').onclick=()=>this.savePending();
  for(const button of el.querySelectorAll('[data-dismiss]'))button.onclick=()=>{this.outbox.dismiss(button.dataset.dismiss);this.renderPending();this.refresh(false);};
 }
 async loadBoard(){
  const request=++this.boardRequest,scope=this.scope;for(const b of document.querySelectorAll('[data-scope]'))b.setAttribute('aria-pressed',String(b.dataset.scope===scope));$('board-status').textContent='Loading high scores…';$('leaderboard-rows').innerHTML='';$('your-rank').textContent='';$('board-empty').hidden=true;$('board-reset').textContent='';try{const board=await api('/api/leaderboard?scope='+scope);if(request!==this.boardRequest)return;this.board=board;this.boardError='';this.renderBoard();this.renderRunRecap();}catch(e){if(request!==this.boardRequest)return;this.boardError=e.message;$('board-status').textContent=e.message;$('leaderboard-rows').innerHTML='';$('board-empty').hidden=false;$('board-empty').textContent='Use Refresh to try again.';}
 }
 renderBoard(){
  const b=this.board;if(!b)return;$('board-status').textContent=b.totalPlayers+' '+(b.totalPlayers===1?'player':'players')+' · Best run per player · '+b.period.label;$('board-empty').hidden=b.entries.length>0;$('board-empty').textContent='No scores in this period yet. Set the first Port City record.';$('board-reset').textContent=b.period.resetsAt?'Resets '+new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(b.period.resetsAt))+' · Mobile time':'Lifetime rankings · Period rankings use Mobile time';
  $('leaderboard-rows').innerHTML=b.entries.map(r=>'<tr class="'+(r.username===this.player?.username?'your-row':'')+'"><td class="rank rank-'+r.rank+'">'+String(r.rank).padStart(2,'0')+'</td><td><button class="player-link" data-player="'+escape(r.username)+'">'+escape(r.username)+'</button><small>'+r.routes+' '+(r.routes===1?'route':'routes')+' cleared'+(r.won?' · FINISHER':'')+'</small></td><td class="board-score">'+r.score.toLocaleString()+'</td><td class="badge-total">'+r.badgeCount+'/'+BADGES.length+'</td></tr>').join('');
  for(const button of $('leaderboard-rows').querySelectorAll('[data-player]'))button.onclick=()=>{this.switchTab('profile',button.dataset.player)};
  $('your-rank').textContent=b.me?'Your '+b.period.label.toLowerCase()+' best: #'+b.me.rank+' · '+b.me.score.toLocaleString()+' points':this.player?'Finish a run in this period to claim your rank.':'Choose a username to join the leaderboard.';
 }
 async loadPlayer(name){
  const request=++this.profileRequest,el=$('player-detail');
  if(!name){el.innerHTML='<div class="profile-empty"><h3>Your player passport</h3><p>Save your parade name above to start your profile. Finish a run to add stats and achievements.</p></div>';return;}
  el.innerHTML='<p class="muted">Loading player passport…</p>';
  try{
   const result=await api('/api/player?username='+encodeURIComponent(name));if(request!==this.profileRequest)return;
   const p=result.profile;this.detail=p;const earned=p.badges.filter(b=>b.earned);
   el.innerHTML='<div class="passport"><small>PORT CITY PLAYER PASSPORT</small><h3>'+escape(p.username)+'</h3><div class="passport-stats">'+[['PERSONAL BEST',p.stats.bestScore],['RUNS PLAYED',p.stats.runs],['ROUTES CLEARED',p.stats.routes],['WINS',p.stats.wins],['DOUBLOONS',p.stats.coins],['GHOSTS CAUGHT',p.stats.ghosts]].map(([label,value])=>'<div><b>'+Number(value).toLocaleString()+'</b><span>'+label+'</span></div>').join('')+'</div>'+(p.stats.runs?'<button id="share-best" class="small-action">Share personal best ↗</button>':'<p>First run coming soon.</p>')+'<p id="share-message" class="profile-message" role="status"></p></div><h3 class="passport-heading">'+earned.length+' earned badges</h3><div class="passport-badges">'+(earned.length?earned.map(b=>'<span title="'+escape(b.description)+'">'+icon(b.id)+escape(b.name)+'</span>').join(''):'<p>Finish runs to earn badges.</p>')+'</div><h3 class="passport-heading">Recent runs</h3><div class="recent-runs">'+(p.recentRuns.length?p.recentRuns.map(r=>'<div><span><b>'+r.score.toLocaleString()+' points</b><small>'+new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(r.finishedAt))+' · Mobile time</small></span><span>'+r.routes+'/3 routes'+(r.won?' · FINISHER':'')+'</span></div>').join(''):'<p>No saved runs yet.</p>')+'</div>';
   if($('share-best'))$('share-best').onclick=()=>this.shareScore(p.stats.bestScore,'PERSONAL BEST',p.username,earned.length);
  }catch(e){if(request===this.profileRequest)el.innerHTML='<p class="profile-message">'+escape(e.message)+'</p>';}
 }
 async shareScore(score,label='RUN SCORE',name=this.player?.username,badges=this.player?.badges?.filter(b=>b.earned).length||0){
  if(!name)return;
  const button=document.activeElement;if(button?.tagName==='BUTTON')button.disabled=true;
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1080;const c=canvas.getContext('2d');
  const gradient=c.createLinearGradient(0,0,1080,1080);gradient.addColorStop(0,'#47215e');gradient.addColorStop(1,'#160b25');c.fillStyle=gradient;c.fillRect(0,0,1080,1080);
  c.strokeStyle='#ecc575';c.lineWidth=3;c.strokeRect(34,34,1012,1012);
  const text=(value,y,size,color='#f5d58e',bold=false)=>{c.fillStyle=color;c.font=(bold?'bold ':'')+size+'px Arial, sans-serif';c.textAlign='center';c.fillText(value,540,y,950)};
  text('MG251 · MARDI GRAS ARCADE',95,25);
  const skyline=$('skyline');if(skyline&&window.MobileArt?.readyToPlay)c.drawImage(skyline,58,133,964,198);else text('MOONPIE RUN',258,85,'#fce3a4',true);
  text(name,414,50,'#fff0cf',true);text(label,478,26);text(Number(score).toLocaleString(),620,128,'#ffe39d',true);text('POINTS',672,25);
  text(badges+' BADGES EARNED',752,26);text('Think you can beat this haul?',840,37,'#f8ead7');
  text('PLAY AT MG251.XYZ',931,34,'#ffe39d',true);text('mg251.xyz/arcade/moonpie-run',983,27);
  try{
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Could not create your score card.');
   const file=new File([blob],'MoonPie-Run-'+name.replace(/[^a-z0-9_-]/gi,'-')+'-'+score+'.png',{type:'image/png'});
   const url='https://mg251.xyz/arcade/moonpie-run',text=name+' scored '+Number(score).toLocaleString()+' points in MoonPie Run! Think you can beat this haul?';
   if(navigator.canShare?.({files:[file]})&&navigator.share){await navigator.share({title:'MoonPie Run · '+label,text,url,files:[file]});}
   else{const link=document.createElement('a'),download=URL.createObjectURL(blob);link.href=download;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(download),30000);if($('share-message'))$('share-message').textContent='Score card downloaded. Add it to your favorite social app with the game link.';}
  }catch(e){if(e.name!=='AbortError'){if($('share-message'))$('share-message').textContent=e.message;else alert(e.message);}}
  finally{if(button?.isConnected)button.disabled=false;}
 }
 renderBadges(){
  const stats=this.stats(),badges=badgeProgress(stats),earned=badges.filter(b=>b.earned).length;$('trophy-status').textContent=earned+' of '+BADGES.length+' badges earned';
  const next=badges.filter(b=>!b.earned).sort((a,b)=>b.value/b.target-a.value/a.target)[0];
  $('collection-summary').innerHTML='<div class="collection-total"><b>'+earned+'<span> / '+BADGES.length+'</span></b><p>MEDALS COLLECTED</p></div><div class="collection-next"><small>'+(next?'NEXT IN REACH':'COLLECTION COMPLETE')+'</small><strong>'+escape(next?.name||'Port City legend')+'</strong><p>'+(next?Math.max(0,next.target-next.value).toLocaleString()+' to go · '+escape(next.description):'Every medal earned. Keep the good times running.')+'</p><div class="collection-track"><i style="width:'+earned/BADGES.length*100+'%"></i></div></div>';
  const category=b=>['coins','bonuses'].includes(b.metric)?'THE DOUBLOON VAULT':b.metric==='pies'?'SWEET SUCCESS':['ghosts','maxChain'].includes(b.metric)?'THE MYSTIC CHASE':'PARADE ROYALTY';
  $('badge-grid').innerHTML=badges.map((b,i)=>'<article class="achievement '+(b.earned?'earned':'locked')+'"><div class="achievement-top"><span>'+category(b)+'</span><small>'+String(i+1).padStart(2,'0')+'</small></div><div class="medallion">'+icon(b.id)+'</div><div class="achievement-copy"><span class="achievement-state">'+(b.earned?'✦ MEDAL EARNED':b.value?'IN PROGRESS':'YET TO UNLOCK')+'</span><h3>'+escape(b.name)+'</h3><p>'+escape(b.description)+'</p></div><div class="achievement-progress"><div><span>'+(b.earned?'COMPLETE':'PROGRESS')+'</span><b>'+b.value.toLocaleString()+' <small>/ '+b.target.toLocaleString()+'</small></b></div><progress max="'+b.target+'" value="'+b.value+'" aria-label="'+escape(b.name)+' progress"></progress></div></article>').join('');
  $('trophy-footnote').textContent=this.outbox.items.some(p=>!p.blocked)?'New badges are waiting for your run to save.':this.run?'Finish your run to save new badges.':this.player?(this.profileKind==='visitor'?'Your saved achievements return when you use this browser.':'Your saved achievements follow your player profile.'):'Choose a username to save earned badges with your run.';
 }
}
window.MoonPieProgress=new Progress();
$('refresh-board').onclick=()=>window.MoonPieProgress.loadBoard();
await import('./game.js?v=1.14');
