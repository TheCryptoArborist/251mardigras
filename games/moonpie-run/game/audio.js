'use strict';
// Original synthesized arcade audio. Scheduling uses the audio clock, not timers.
window.MoonPieAudio=class MoonPieAudio {
 static DEATH_SECONDS=1.14;
 constructor({enabled=false,context=null}={}){
  this.enabled=enabled;this.ctx=context;this.master=null;this.voices=new Set();this.beds=new Map();this.lastState='title';this.chomps=0;this.mode='idle';this.noise=null;this.available=!!(context||window.AudioContext||window.webkitAudioContext);
 }
 unlock(){
  if(!this.enabled||!this.available)return false;
  try{
   this.ctx??=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});
   if(!this.master){
    this.master=this.ctx.createGain();this.master.gain.value=.68;
    this.compressor=this.ctx.createDynamicsCompressor();this.compressor.threshold.value=-16;this.compressor.knee.value=12;this.compressor.ratio.value=4;this.compressor.attack.value=.003;this.compressor.release.value=.12;
    this.master.connect(this.compressor);this.compressor.connect(this.ctx.destination);
   }
   if(this.ctx.state==='suspended'&&typeof this.ctx.startRendering!=='function')this.ctx.resume().catch(()=>{});
   return this.ctx.state!=='closed';
  }catch{this.available=false;return false;}
 }
 setEnabled(on){
  this.enabled=!!on;
  if(!on){this.hush();if(this.master){this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.004);}}
  else if(this.unlock()){this.master.gain.cancelScheduledValues(this.ctx.currentTime);this.master.gain.setTargetAtTime(.68,this.ctx.currentTime,.008);}
 }
 _dispose(v){
  this.voices.delete(v);for(const n of v.nodes)try{n.disconnect();}catch{}
 }
 _stopVoice(v){
  if(v.stopping)return;v.stopping=true;const t=this.ctx.currentTime;
  v.gain.gain.cancelScheduledValues(t);v.gain.gain.setTargetAtTime(0,t,.003);
  try{v.source.stop(t+.018);}catch{this._dispose(v);}
 }
 _clearVoices(){for(const v of this.voices)this._stopVoice(v);}
 _chipWave(){
  if(!this.chipWave){const real=new Float32Array(16),imag=new Float32Array(16);for(let h=1;h<16;h+=2)imag[h]=Math.sin(h*Math.PI/2)/(h*h);imag[2]=.12;imag[4]=.035;this.chipWave=this.ctx.createPeriodicWave(real,imag);}
  return this.chipWave;
 }
 _tone({freq=440,to=null,duration=.12,delay=0,type='triangle',volume=.1,group='effect',filter=null,curve=null,detune=0}={}){
  if(!this.unlock())return;
  const t=this.ctx.currentTime+.006+delay,o=this.ctx.createOscillator(),amp=this.ctx.createGain(),nodes=[o,amp];if(type==='arcade')o.setPeriodicWave(this._chipWave());else o.type=type;o.detune.value=detune;
  o.frequency.setValueAtTime(freq,t);
  if(curve)o.frequency.setValueCurveAtTime(new Float32Array(curve),t,duration*.94);
  else if(to!==null)o.frequency.exponentialRampToValueAtTime(Math.max(20,to),t+duration*.9);
  if(filter){const f=this.ctx.createBiquadFilter();f.type=filter.type||'lowpass';f.Q.value=filter.q||1;f.frequency.setValueAtTime(filter.from,t);if(filter.to)f.frequency.exponentialRampToValueAtTime(filter.to,t+duration*.9);o.connect(f);f.connect(amp);nodes.push(f);}else o.connect(amp);
  amp.gain.setValueAtTime(.0001,t);amp.gain.exponentialRampToValueAtTime(Math.max(.001,volume),t+Math.min(type==='arcade'?.002:.007,duration*.1));amp.gain.exponentialRampToValueAtTime(Math.max(.001,volume*(type==='arcade'?.85:.55)),t+duration*(type==='arcade'?.78:.55));amp.gain.exponentialRampToValueAtTime(.0001,t+duration);amp.connect(this.master);
  const v={source:o,gain:amp,nodes,group,stopping:false};this.voices.add(v);o.onended=()=>this._dispose(v);o.start(t);o.stop(t+duration+.015);return v;
 }
 _noiseHit(delay=0,duration=.1,volume=.05,highpass=900){
  if(!this.unlock())return;
  if(!this.noise){this.noise=this.ctx.createBuffer(1,Math.ceil(this.ctx.sampleRate*.35),this.ctx.sampleRate);const a=this.noise.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
  const t=this.ctx.currentTime+.006+delay,src=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),amp=this.ctx.createGain();src.buffer=this.noise;f.type='highpass';f.frequency.value=highpass;src.connect(f);f.connect(amp);amp.connect(this.master);
  amp.gain.setValueAtTime(.0001,t);amp.gain.exponentialRampToValueAtTime(volume,t+.003);amp.gain.exponentialRampToValueAtTime(.0001,t+duration);
  const v={source:src,gain:amp,nodes:[src,f,amp],group:'music',stopping:false};this.voices.add(v);src.onended=()=>this._dispose(v);src.start(t);src.stop(t+duration+.01);
 }
 _brass(freq,delay,duration,volume=.1){
  this._tone({freq,delay,duration,volume,type:'sawtooth',group:'music',filter:{from:2000,to:650}});
  this._tone({freq,delay,duration,volume:volume*.32,type:'triangle',group:'music',detune:7});
 }
 _jingle(victory=false){
  this.hush();if(!this.unlock())return;
  // A short, original blues-colored horn phrase and a marching rhythm.
  const phrase=victory?[[523,.16],[622,.10],[659,.16],[784,.22],[1047,.28],[932,.12],[784,.16],[1047,.48]]:[[392,.15],[466,.10],[523,.19],[622,.09],[659,.09],[784,.20],[659,.14],[523,.30]];
  let time=0;for(const [f,d] of phrase){this._brass(f,time,d*.9);time+=d;}
  const beat=.24;
  for(let i=0;i<Math.ceil(time/beat);i++){
   const at=i*beat;
   if(i%2===0)this._tone({freq:135,to:45,delay:at,duration:.13,volume:.12,type:'sine',group:'music'});
   else this._noiseHit(at,.085,.055,1100);
   this._noiseHit(at+.12,.045,.018,4800);
  }
  if(victory)for(const f of [523,659,784])this._brass(f,time-.12,.48,.055);
 }
 _death(offset=0){
  this.hush();const notes=[1480,1380,1240,1080,930,790,650,520,405,300,210];let at=0;
  for(const [i,freq] of notes.entries()){
   const duration=.073+i*.0025,end=at+duration;
   if(end>offset){const part=Math.max(0,(offset-at)/duration);this._tone({freq:freq*Math.pow(.56,part),to:freq*.56,delay:Math.max(0,at-offset),duration:end-Math.max(at,offset),volume:.22-i*.006,type:'arcade',group:'death'});}
   at=end;
  }
  const duration=MoonPieAudio.DEATH_SECONDS-at;
  if(offset<MoonPieAudio.DEATH_SECONDS){const part=Math.max(0,(offset-at)/duration);this._tone({freq:118*Math.pow(.3,part),to:35,delay:Math.max(0,at-offset),duration:MoonPieAudio.DEATH_SECONDS-Math.max(at,offset),volume:.13,type:'arcade',group:'death'});}
 }
 event(name,detail={}){
  if(!this.enabled)return;
  if(name==='ready'||name==='victory'){this._jingle(name==='victory');return;}
  if(name==='death'){this._death(Math.max(0,Number(detail.offset)||0));return;}
  if(name==='chomp'){
   this._duckBeds(.07);const high=++this.chomps%2===1;
   this._tone({freq:high?780:240,to:high?220:730,duration:.092,volume:.27,type:'arcade',filter:{type:'lowpass',q:.8,from:2300,to:1200}});return;
  }
  if(name==='power'){
   this._stopBed('chase');this._tone({freq:720,to:190,duration:.11,volume:.18,type:'arcade'});return;
  }
  if(name==='capture'){
   for(const kind of [...this.beds.keys()])this._stopBed(kind);
   this._tone({freq:260,to:1700,duration:.23,volume:.2,type:'arcade',filter:{from:2600,to:3500}});return;
  }
  if(name==='bonus'){
   for(const [i,f] of [659,784,1047,1319].entries())this._tone({freq:f,delay:i*.065,duration:.16,volume:.09,type:'triangle'});return;
  }
  if(name==='toggle')this._tone({freq:587,to:784,duration:.12,volume:.07});
 }
 _bed(kind,rate=0){
  let bed=this.beds.get(kind);
  if(bed){if(rate!==bed.rate){bed.lfo.frequency.setTargetAtTime(rate,this.ctx.currentTime,.05);bed.rate=rate;}return;}
  const o=this.ctx.createOscillator(),lfo=this.ctx.createOscillator(),depth=this.ctx.createGain(),gain=this.ctx.createGain(),filter=this.ctx.createBiquadFilter(),t=this.ctx.currentTime;
  const config={chase:{type:'arcade',freq:430,depth:155,volume:.048,cutoff:1700},power:{type:'arcade',freq:370,depth:-250,volume:.052,cutoff:1800},return:{type:'arcade',freq:1250,depth:420,volume:.038,cutoff:3300}}[kind];
  if(config.type==='arcade')o.setPeriodicWave(this._chipWave());else o.type=config.type;o.frequency.value=config.freq;lfo.type=kind==='power'?'sawtooth':'triangle';lfo.frequency.value=rate;depth.gain.value=config.depth;lfo.connect(depth);depth.connect(o.frequency);filter.type='lowpass';filter.frequency.value=config.cutoff;o.connect(filter);filter.connect(gain);gain.connect(this.master);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(config.volume,t+.035);
  bed={source:o,lfo,depth,gain,filter,rate,volume:config.volume};this.beds.set(kind,bed);o.start(t);lfo.start(t);
 }
 _duckBeds(duration){
  if(!this.ctx)return;const t=this.ctx.currentTime;
  for(const b of this.beds.values()){
   b.gain.gain.cancelScheduledValues(t);b.gain.gain.setValueAtTime(Math.max(.0001,b.gain.gain.value),t);
   b.gain.gain.setTargetAtTime(b.volume*.25,t,.004);b.gain.gain.setTargetAtTime(b.volume,t+duration,.015);
  }
 }
 _stopBed(kind){
  const b=this.beds.get(kind);if(!b)return;this.beds.delete(kind);const t=this.ctx.currentTime;
  b.gain.gain.cancelScheduledValues(t);b.gain.gain.setTargetAtTime(0,t,.004);b.source.onended=()=>{for(const n of [b.source,b.lfo,b.depth,b.gain,b.filter])try{n.disconnect();}catch{}};
  try{b.source.stop(t+.025);b.lfo.stop(t+.025);}catch{}
 }
 hush(){for(const k of [...this.beds.keys()])this._stopBed(k);this._clearVoices();this.mode='idle';}
 sync({state='title',powerTime=0,returning=0,level=0,progress=0,visible=true}={}){
  if(!this.enabled||!visible){this.hush();this.lastState=state;return;}
  // sync never creates/unlocks the context; a start, sound or resume gesture does.
  if(!this.master||this.ctx.state==='closed'){this.lastState=state;return;}
  if(state!=='playing'){
   for(const k of [...this.beds.keys()])this._stopBed(k);
   if(state==='paused'&&this.lastState!=='paused')this._clearVoices();
   this.mode='idle';this.lastState=state;return;
  }
  // One background cue at a time: returning eyes take priority over frightened mode.
  const mode=returning>0?'return':powerTime>0?'power':'chase';
  for(const kind of [...this.beds.keys()])if(kind!==mode)this._stopBed(kind);
  this._bed(mode,mode==='return'?7.5:mode==='power'?8.4:(2.3+level*.25+Math.floor(progress*5)*.3));
  this.mode=mode;this.lastState=state;
 }
};
