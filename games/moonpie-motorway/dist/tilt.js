'use strict';
// Optional device input. Only the resulting steering value enters race replays.
window.MotorwayTilt = (() => {
  const buttons = [...document.querySelectorAll('[data-tilt-toggle]')];
  const centers = [...document.querySelectorAll('[data-tilt-center]')];
  const notes = [...document.querySelectorAll('[data-tilt-status]')];
  let enabled=false, pending=false, neutral=null, value=0, last=0, timeout=0, generation=0;
  const supported = window.isSecureContext && !!window.DeviceOrientationEvent;
  const angle = () => window.screen?.orientation?.angle ?? window.orientation ?? 0;
  function show(message) {
    for (const b of buttons) { b.textContent=enabled?'Turn tilt off':'Enable tilt steering'; b.disabled=pending||!supported; b.setAttribute('aria-pressed',String(enabled)); }
    for (const b of centers) b.hidden=!enabled;
    for (const n of notes) n.textContent=message;
  }
  function reset() { neutral=null;value=0;last=0; }
  function disable(message) {
    generation++;enabled=false;pending=false;reset();clearTimeout(timeout);
    window.removeEventListener('deviceorientation',sample);
    show(message);
  }
  function sample(event) {
    if (!enabled || document.hidden || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return;
    const r=Math.PI/180, a=angle()*r;
    // Project gravity onto the screen's horizontal axis in either landscape direction.
    const x=Math.sin(event.gamma*r)*Math.cos(event.beta*r), y=Math.sin(event.beta*r);
    const roll=Math.asin(Math.max(-1,Math.min(1,x*Math.cos(a)+y*Math.sin(a))))/r;
    const now=performance.now();
    if (neutral===null || now-last>750) { neutral=roll;show('Tilt is on. Lean left or right to steer. Recenter in your comfortable grip.'); }
    last=now;clearTimeout(timeout);
    const delta=roll-neutral, magnitude=Math.max(0,Math.abs(delta)-3)/22;
    value=Math.sign(delta)*Math.min(1,magnitude);
  }
  async function toggle() {
    if (enabled) return disable('Tilt is off. Use the steering buttons.');
    if (!supported || pending) return;
    const request=++generation;pending=true;show('Allow motion access, then hold your phone in a comfortable driving position.');
    try {
      // iPhone/iPad require this permission call directly from a button gesture.
      const permission=window.DeviceOrientationEvent.requestPermission;
      if (permission && await permission.call(window.DeviceOrientationEvent)!=='granted') throw Error('denied');
      if (request!==generation) return;
      pending=false;enabled=true;reset();window.addEventListener('deviceorientation',sample);
      show('Hold your phone comfortably while tilt connects…');
      timeout=setTimeout(()=>disable('No motion signal. Use the steering buttons or try enabling tilt again.'),5000);
    } catch { if(request===generation)disable('Motion access was not allowed. Steering buttons still work.'); }
  }
  function recenter() { if(enabled){reset();show('Hold your phone comfortably. Centering on the next motion reading…');} }
  for(const b of buttons)b.addEventListener('click',toggle);
  for(const b of centers)b.addEventListener('click',recenter);
  window.addEventListener('orientationchange',recenter);
  window.screen?.orientation?.addEventListener('change',recenter);
  window.addEventListener('blur',reset);
  document.addEventListener('visibilitychange',reset);
  show(supported?'Optional: hold your phone comfortably, enable tilt, then lean to steer.':'Tilt is unavailable in this browser. Use the steering buttons.');
  return { turn:()=>enabled&&!document.hidden&&neutral!==null&&performance.now()-last<=750?Math.round(value*100)/100:0 };
})();
