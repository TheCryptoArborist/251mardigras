import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createContext, Script } from 'node:vm';
export type Control = [number, number, number, number];
export const MAX_TICKS = 14000;
const ROOT = join(process.cwd(), 'games/moonpie-motorway/dist');
let rules: Promise<{ source: string; schedule: string; hash: string; season: number }> | undefined;
export function getRules() {
  return rules ??= Promise.all([readFile(join(ROOT, 'game.js'), 'utf8'), readFile(join(ROOT, 'parades.json'), 'utf8')]).then(([source, schedule]) => ({source, schedule, hash:createHash('sha256').update(source).update(schedule).digest('hex'), season:JSON.parse(schedule).season}));
}
export function validateControls(ticks: unknown, controls: unknown): asserts controls is Control[] {
  if (!Number.isInteger(ticks) || Number(ticks) < 1 || Number(ticks) > MAX_TICKS || !Array.isArray(controls) || !controls.length || controls.length > Number(ticks)) throw Error('Invalid recording.');
  let previous=-1;
  for (const row of controls) {
    if (!Array.isArray(row) || row.length!==4 || !Number.isInteger(row[0]) || row[0]<=previous || row[0]>=Number(ticks) || typeof row[1]!=='number' || !Number.isFinite(row[1]) || Math.abs(row[1])>1 || ![0,1].includes(row[2]) || ![0,1].includes(row[3])) throw Error('Invalid controls.');
    previous=row[0];
  }
  if (controls[0][0]!==0) throw Error('Missing initial controls.');
}
// Execute our own trusted game source, never client code. Render/audio/DOM are
// stubbed; physics, seeded traffic, pickups and Cup rules remain the same code.
export async function verifyReplay(ticks: number, controls: Control[]) {
  validateControls(ticks, controls);
  const {source,schedule}=await getRules();
  const noop=()=>{};
  const context2d=new Proxy({measureText:(s:string)=>({width:s.length*8}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k as keyof typeof o]:noop});
  const makeElement=()=>({hidden:true,value:'cup',style:{setProperty:noop},classList:{toggle:noop,add:noop,remove:noop},getContext:()=>context2d,getBoundingClientRect:()=>({width:1280,height:800}),addEventListener:noop,setAttribute:noop,replaceChildren:noop,append:noop,focus:noop});
  const elements=new Map<string,ReturnType<typeof makeElement>>();
  const el=(id:string)=>{let element=elements.get(id);if(!element){element=makeElement();elements.set(id,element);}return element;};
  const sprite={width:256,height:215};
  const box: Record<string,unknown> & {result?:{score:number;ticks:number;parades:number}}={document:{getElementById:el,createElement:()=>el('canvas'),querySelector:()=>el('mode'),querySelectorAll:()=>[],addEventListener:noop},window:{addEventListener:noop,MotorwayArt:{cars:Array(6).fill(sprite),props:Object.fromEntries(['brick','stucco','oak','grandstand','float','oakTall','pit','crowd','lamp'].map(k=>[k,sprite])),gate:()=>sprite}},navigator:{getGamepads:()=>[]},performance:{now:()=>0},localStorage:{getItem:()=>null,setItem:noop},setTimeout:()=>0,clearTimeout:noop,requestAnimationFrame:noop,console:{error:noop},recording:controls,totalTicks:ticks,scheduleJSON:schedule};
  const fetchStart=source.indexOf("fetch('parades.json')");
  if(fetchStart<0)throw Error('Replay rules unavailable.');
  const initialization=source.slice(0,fetchStart).replace(/function input\(\)\{[\s\S]*?\}\nfunction hit/,'function input(){return replayInput;}\nfunction hit');
  const script=initialization+`let replayInput={turn:0,brake:false,boost:false};data=JSON.parse(scheduleJSON);validateSchedule(data);prepare();start();state='racing';countdown=0;let cursor=0;
  for(let tick=0;tick<totalTicks;tick++){if(state!=='racing')throw Error('Recording continues after finish');if(cursor<recording.length&&recording[cursor][0]===tick){const r=recording[cursor++];replayInput={turn:r[1],brake:!!r[2],boost:!!r[3]};}update(STEP);}
  if(state!=='ended'||z<finishZ()||lives<=0||timer<=0)throw Error('Complete Carnival Cup to post a score.');globalThis.result={score,ticks:totalTicks,parades:passed};})();`;
  new Script(script).runInContext(createContext(box,{codeGeneration:{strings:false,wasm:false}}),{timeout:10000});
  return box.result as {score:number;ticks:number;parades:number};
}
