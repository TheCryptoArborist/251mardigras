const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../dist/tilt.js'),'utf8');
function setup(permission, supported=true){
 const listeners={},nodes={},timers=new Map();let now=1000,id=0;
 const node=key=>nodes[key]??={textContent:'',hidden:false,disabled:false,setAttribute(k,v){this[k]=v;},addEventListener(k,v){this[k]=v;}};
 const document={hidden:false,querySelectorAll:s=>[node(s)],addEventListener:(k,v)=>listeners[k]=v};
 const window={isSecureContext:true,DeviceOrientationEvent:supported?{}:undefined,screen:{orientation:{angle:0,addEventListener:(k,v)=>listeners.orientation=v}},addEventListener:(k,v)=>listeners[k]=v,removeEventListener:k=>delete listeners[k]};
 if(permission)window.DeviceOrientationEvent.requestPermission=permission;
 vm.runInNewContext(source,{window,document,performance:{now:()=>now},setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id)});
 return {window,document,nodes,toggle:()=>node('[data-tilt-toggle]').click(),center:()=>node('[data-tilt-center]').click(),turn:()=>window.MotorwayTilt.turn(),sample:(beta,gamma)=>listeners.deviceorientation?.({beta,gamma}),advance:ms=>now+=ms,events:listeners,timers};
}
(async()=>{
 let calls=0;const t=setup(async()=>{calls++;return 'granted';});await t.toggle();assert.equal(calls,1);
 t.sample(30,0);assert.equal(t.turn(),0);t.sample(30,2);assert.equal(t.turn(),0);t.sample(30,20);assert(t.turn()>0);t.sample(30,-20);assert(t.turn()<0);
 t.center();t.sample(30,20);assert.equal(t.turn(),0);t.sample(30,40);assert(t.turn()>0);
 t.advance(751);assert.equal(t.turn(),0);t.sample(30,40);assert.equal(t.turn(),0);
 for(const angle of [90,270]){t.window.screen.orientation.angle=angle;t.events.orientation();t.sample(0,0);t.sample(20,0);assert.equal(Math.sign(t.turn()),angle===90?1:-1);}
 t.document.hidden=true;assert.equal(t.turn(),0);t.events.visibilitychange();t.document.hidden=false;t.sample(20,0);assert.equal(t.turn(),0);
 t.sample(null,null);assert.equal(t.turn(),0);await t.toggle();assert.equal(t.turn(),0);assert(!t.events.deviceorientation);
 const denied=setup(async()=>'denied');await denied.toggle();assert(!denied.events.deviceorientation);assert.match(denied.nodes['[data-tilt-status]'].textContent,/not allowed/);
 const missing=setup();await missing.toggle();[...missing.timers.values()][0]();assert(!missing.events.deviceorientation);assert.match(missing.nodes['[data-tilt-status]'].textContent,/No motion/);
 const unsupported=setup(null,false);assert(unsupported.nodes['[data-tilt-toggle]'].disabled);
 const {q}=await require('./audit.cjs').setup({tiltTurn:.65});assert.equal(q.input().turn,.65);q.keys.left=true;assert.equal(q.input().turn,-1);q.keys.left=false;q.keys.right=true;assert.equal(q.input().turn,1);
 console.log('PASS: tilt permission, calibration, dead zone, both landscape orientations, stale/missing signals, hidden page, denial, and touch fallback.');
})().catch(e=>{console.error(e);process.exitCode=1;});
