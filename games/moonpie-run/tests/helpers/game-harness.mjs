import {readFileSync} from 'node:fs';
import vm from 'node:vm';
export function game(){
 const elements=new Map(),events=[],finished=[],tracked=[],listeners=new Map(),docListeners=new Map();
 const ctx=new Proxy({},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},querySelector:()=>element('label'),focus(){},handlers:new Map(),addEventListener(n,fn){this.handlers.set(n,fn)},setPointerCapture(){},getContext:()=>ctx});return elements.get(id);}
 const document={hidden:false,body:element('body'),getElementById:element,querySelector:element,querySelectorAll:selector=>selector==='[data-dir]'?['left','up','down','right'].map(dir=>{const e=element('dir-'+dir);e.dataset.dir=dir;return e;}):[],addEventListener:(n,fn)=>docListeners.set(n,fn)};
 class Audio{static DEATH_SECONDS=1.14;constructor(){this.available=true}unlock(){}hush(){events.push('hush')}sync(){}event(n,d){events.push({name:n,detail:d})}setEnabled(){}}
 const window={MoonPieAudio:Audio,MobileArt:{readyToPlay:true,loaded:{then:()=>({catch(){}})},paint(){},shimmer(){},pie(){}},MoonPieProgress:{begin(){},track(type,data){tracked.push({type,...data})},finish(data){finished.push(data)}},addEventListener:(n,fn)=>listeners.set(n,fn)};
 const context={window,document,module:{exports:{}},localStorage:{getItem(){},setItem(){}},requestAnimationFrame(){},console};
 vm.runInNewContext(readFileSync(new URL('../../game/game.js',import.meta.url),'utf8'),context);
 const api=context.module.exports;return{...api,...api.testing,events,finished,tracked,document,listeners,docListeners,elements};
}
