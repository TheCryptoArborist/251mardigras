"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Upload, RotateCw, Move, LockKeyhole, Sparkles, Check } from "lucide-react";
import { loadSocietyArtwork } from "./society-artwork";
import societies from "./societies.json";
import s from "./studio.module.css";

type Frame = "classic" | "beads" | "skyline" | "mask" | "royal" | "arcade";
type Badge = "logo" | "mask" | "moonpie" | "none" | `society:${string}`;
const frames: { id: Frame; name: string }[] = [
  { id: "classic", name: "Classic MG251" }, { id: "beads", name: "Throw Me Something" },
  { id: "skyline", name: "Mobile Skyline" }, { id: "mask", name: "Masquerade" },
  { id: "royal", name: "Carnival Royalty" }, { id: "arcade", name: "Mardi Gras Arcade" }
];
const gold = "#f3cf72", purple = "#542075";

function circle(c: CanvasRenderingContext2D, x: number, y: number, r: number, fill?: string | CanvasGradient, stroke?: string, width = 1) {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}
function star(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath(); c.moveTo(x, y-r); c.quadraticCurveTo(x+2,y-2,x+r,y); c.quadraticCurveTo(x+2,y+2,x,y+r); c.quadraticCurveTo(x-2,y+2,x-r,y); c.quadraticCurveTo(x-2,y-2,x,y-r); c.fillStyle=gold;c.fill();
}
function mask(c: CanvasRenderingContext2D, x: number, y: number, size: number) {
  c.save(); c.translate(x,y); c.scale(size/200,size/200);
  c.beginPath(); c.moveTo(-96,-28);c.bezierCurveTo(-42,-55,-24,-20,0,-12);c.bezierCurveTo(24,-20,42,-55,96,-28);c.bezierCurveTo(91,44,35,58,0,15);c.bezierCurveTo(-35,58,-91,44,-96,-28);c.closePath();
  c.fillStyle=purple;c.fill();c.strokeStyle=gold;c.lineWidth=6;c.stroke();
  [-1,1].forEach(k=>{c.save();c.translate(k*47,0);c.rotate(k*-.17);c.beginPath();c.ellipse(0,0,24,11,0,0,Math.PI*2);c.fillStyle="#20102f";c.fill();c.lineWidth=3;c.stroke();c.restore();});
  star(c,0,-28,12);c.restore();
}
function crown(c: CanvasRenderingContext2D, x: number, y: number, size: number) {
  c.save(); c.translate(x,y);c.scale(size/200,size/200);
  c.beginPath();c.moveTo(-87,24);c.lineTo(-100,-52);c.lineTo(-49,-17);c.lineTo(0,-78);c.lineTo(49,-17);c.lineTo(100,-52);c.lineTo(87,24);c.closePath();c.fillStyle=gold;c.fill();c.strokeStyle="#fff0ba";c.lineWidth=4;c.stroke();
  c.fillStyle=purple;c.fillRect(-83,7,166,17);[-100,0,100].forEach((v,i)=>circle(c,v,i===1?-78:-52,9,gold));[-49,0,49].forEach(v=>circle(c,v,0,7,purple));c.restore();
}
function skyline(c: CanvasRenderingContext2D) {
  c.save();c.fillStyle=gold;c.strokeStyle=gold;c.lineWidth=4;
  // Mobile's stepped RSA Battle House tower and pointed Renaissance Riverview tower.
  c.beginPath();c.moveTo(240,825);c.lineTo(240,794);c.lineTo(288,794);c.lineTo(288,760);c.lineTo(331,760);c.lineTo(331,788);c.lineTo(373,788);c.lineTo(373,706);c.lineTo(397,706);c.lineTo(397,678);c.lineTo(413,678);c.lineTo(413,650);c.lineTo(433,650);c.lineTo(433,615);c.lineTo(446,650);c.lineTo(463,650);c.lineTo(463,678);c.lineTo(479,678);c.lineTo(479,706);c.lineTo(501,706);c.lineTo(501,794);c.lineTo(532,794);c.lineTo(532,747);c.lineTo(557,747);c.lineTo(557,704);c.lineTo(578,681);c.lineTo(599,704);c.lineTo(599,747);c.lineTo(620,747);c.lineTo(620,778);c.lineTo(657,778);c.lineTo(657,735);c.lineTo(696,735);c.lineTo(696,785);c.lineTo(744,785);c.lineTo(744,825);c.closePath();c.fill();
  c.fillStyle="#42205d";for(let x=393;x<486;x+=19)for(let y=720;y<809;y+=21)c.fillRect(x,y,7,10);for(let x=560;x<610;x+=17)for(let y=763;y<813;y+=19)c.fillRect(x,y,6,9);c.restore();
}
function drawFrame(c: CanvasRenderingContext2D, frame: Frame) {
  const gradient=c.createLinearGradient(70,40,940,940);gradient.addColorStop(0,"#ffe8a4");gradient.addColorStop(.32,"#bb8536");gradient.addColorStop(.6,"#fff0b8");gradient.addColorStop(1,"#cc9d40");
  circle(c,512,512,478,undefined,"#311044",45);c.strokeStyle=gradient;c.lineWidth=5;c.beginPath();c.arc(512,512,498,0,Math.PI*2);c.stroke();circle(c,512,512,454,undefined,gold,3);
  if(frame==="classic") {circle(c,512,512,478,undefined,gold,2);for(let i=0;i<96;i++){const a=i*Math.PI/48;circle(c,512+487*Math.cos(a),512+487*Math.sin(a),2.5,"#fce1a0");} [0,Math.PI].forEach(a=>star(c,512+478*Math.cos(a),512+478*Math.sin(a),14));}
  if(frame==="beads") { for(let i=0;i<76;i++){const a=i*Math.PI*2/76;const x=512+478*Math.cos(a),y=512+478*Math.sin(a);const g=c.createRadialGradient(x-5,y-5,1,x,y,17);g.addColorStop(0,i%2?"#a365cd":"#fff3b4");g.addColorStop(.4,i%2?"#6b2f8d":"#e7bb51");g.addColorStop(1,i%2?"#341045":"#95611c");circle(c,x,y,17,g,gold,1);}}
  if(frame==="skyline") {c.save();circle(c,512,512,455);c.clip();c.fillStyle="#36104ee8";c.fillRect(220,815,590,160);skyline(c);c.restore();}
  if(frame==="mask") {[-1,1].forEach(k=>{c.save();c.translate(512+k*447,512);c.rotate(k*Math.PI/2);for(let j=0;j<4;j++){c.beginPath();c.ellipse(j*10,0,12,58-j*7,-.5+j*.35,0,Math.PI*2);c.fillStyle=j%2?gold:purple;c.fill();c.strokeStyle=gold;c.lineWidth=2;c.stroke();}c.restore();});mask(c,512,92,165);}
  if(frame==="royal") {crown(c,512,126,208);for(let i=0;i<24;i++){const a=i*Math.PI/12;circle(c,512+479*Math.cos(a),512+479*Math.sin(a),7,i%2?gold:"#a366d0",gold,2);}}
  if(frame==="arcade") {for(let i=0;i<48;i++){const a=i*Math.PI/24;c.save();c.translate(512+479*Math.cos(a),512+479*Math.sin(a));c.rotate(a);c.fillStyle=i%2?gold:"#a56bcd";c.fillRect(-8,-8,16,16);c.restore();}c.save();c.fillStyle="#2d1044";c.fillRect(340,75,344,62);c.strokeStyle=gold;c.lineWidth=3;c.strokeRect(340,75,344,62);c.font="bold 30px monospace";c.fillStyle=gold;c.textAlign="center";c.fillText("MG251 ARCADE",512,116);c.restore();}
}
function FrameIcon({frame}:{frame:Frame}) {
  return <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="43" fill="#2f1443" stroke="#e9c46c" strokeWidth="2"/><circle cx="50" cy="50" r="36" fill="#5f3977" stroke="#e9c46c" strokeWidth="1"/>{frame==="beads"&&Array.from({length:24},(_,i)=><circle key={i} cx={50+41*Math.cos(i*Math.PI/12)} cy={50+41*Math.sin(i*Math.PI/12)} r="4" fill={i%2?"#864aa6":"#f3cf72"} stroke="#e9c46c" strokeWidth=".5"/>)}{frame==="skyline"&&<path d="M19 74V65H30V53H39V38L44 26L49 38V53H55V62H62V48L68 41L74 48V65H82V76Z" fill={gold}/ >}{frame==="mask"&&<path d="M20 36Q38 26 50 40Q62 26 80 36Q76 68 50 48Q24 68 20 36M29 41L40 43M60 43L71 41" fill={purple} stroke={gold} strokeWidth="3"/>}{frame==="royal"&&<path d="M29 30L24 12L39 20L50 5L61 20L76 12L71 30Z" fill={gold}/ >}{frame==="arcade"&&<><path d="M25 16H75V32H25Z" fill={purple} stroke={gold}/><text x="50" y="27" textAnchor="middle" fill={gold} fontSize="9" fontFamily="monospace">MG251</text></>}{frame==="classic"&&<path d="M50 5L52 10L57 12L52 14L50 19L48 14L43 12L48 10Z" fill={gold}/ >}</svg>;
}
function BadgeIcon({badge}:{badge:Badge}) {return <svg viewBox="0 0 60 60" aria-hidden="true">{badge==="logo"?<><circle cx="30" cy="30" r="25" fill={purple} stroke={gold} strokeWidth="2"/><text x="30" y="35" textAnchor="middle" fontSize="13" fontWeight="bold" fill={gold}>MG251</text></>:badge==="mask"?<path d="M5 21Q20 11 30 25Q40 11 55 21Q51 48 30 33Q9 48 5 21M13 26L22 28M38 28L47 26" fill={purple} stroke={gold} strokeWidth="3"/>:badge==="moonpie"?<><circle cx="30" cy="30" r="23" fill="#bd8c35" stroke={gold} strokeWidth="2"/><path d="M9 30Q30 42 51 30" stroke="#ffedb7" strokeWidth="6"/><text x="30" y="26" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3f174f">MOONPIE</text></>:<><circle cx="30" cy="30" r="21" fill="none" stroke="#c6aed3"/><path d="M15 45L45 15" stroke="#c6aed3"/></>}</svg>;}

function SocietyThumbnail({ src, removeWhite }: { src: string; removeWhite: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    const element = ref.current;
    if (!element) return;
    const draw = () => { void loadSocietyArtwork(src, removeWhite).then(image => {
      if (cancelled) return;
      const c = element.getContext("2d"); if (!c) return;
      c.clearRect(0, 0, 136, 136);
      const scale = 128 / Math.max(image.width, image.height);
      const w = image.width * scale, h = image.height * scale;
      c.drawImage(image, (136 - w) / 2, (136 - h) / 2, w, h);
    }).catch(() => { /* The named button remains usable for a retry. */ }); };
    if (!("IntersectionObserver" in window)) { draw(); return () => { cancelled = true; }; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); draw(); }
    }, { rootMargin: "100px" });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); };
  }, [src, removeWhite]);
  return <canvas ref={ref} width={136} height={136} aria-hidden="true"/>;
}

export default function ProfileStudio() {
  const canvas=useRef<HTMLCanvasElement>(null),photo=useRef<HTMLImageElement|null>(null),logo=useRef<HTMLImageElement|null>(null),fileInput=useRef<HTMLInputElement>(null);
  const [frame,setFrame]=useState<Frame>("classic"),[badge,setBadge]=useState<Badge>("logo"),[phrase,setPhrase]=useState("");
  const [hasPhoto,setHasPhoto]=useState(false),[zoom,setZoom]=useState(1),[x,setX]=useState(0),[y,setY]=useState(0),[rotation,setRotation]=useState(0),[badgeSize,setBadgeSize]=useState(168);
  const [error,setError]=useState(""),[status,setStatus]=useState(""),[revision,setRevision]=useState(0);
  const [societySearch,setSocietySearch]=useState("");
  const [removeSocietyWhite,setRemoveSocietyWhite]=useState(true);
  const [societyImage,setSocietyImage]=useState<{id:string;removeWhite:boolean;image:HTMLCanvasElement}|null>(null);
  const selectedSociety=societies.find(item=>item.id===badge);
  const visibleSocieties=societies.filter(item=>item.name.toLocaleLowerCase().includes(societySearch.trim().toLocaleLowerCase()));
  const artworkReady=!selectedSociety||(societyImage?.id===badge&&societyImage.removeWhite===removeSocietyWhite);
  useEffect(()=>{
    if(!selectedSociety)return;
    let cancelled=false;
    void loadSocietyArtwork(selectedSociety.src,removeSocietyWhite).then(image=>{
      if(!cancelled)setSocietyImage({id:selectedSociety.id,removeWhite:removeSocietyWhite,image});
    }).catch(()=>{if(!cancelled)setError("This society logo could not load. Please try another logo.");});
    return ()=>{cancelled=true;};
  },[selectedSociety,removeSocietyWhite]);
  const drag=useRef<{x:number;y:number;ox:number;oy:number}|null>(null),loadId=useRef(0);
  const reset=()=>{setZoom(1);setX(0);setY(0);setRotation(0);};
  useEffect(()=>{const im=new Image();im.onload=()=>{logo.current=im;setRevision(v=>v+1);};im.src="/images/mardi-gras-mobile-logo.png";},[]);
  const render=useCallback((c:CanvasRenderingContext2D,frameOnly=false)=>{
    c.clearRect(0,0,1024,1024);
    if(!frameOnly){c.save();circle(c,512,512,457);c.clip();c.fillStyle="#30163f";c.fillRect(0,0,1024,1024);
      if(photo.current){const im=photo.current,swap=rotation%180!==0;const w=swap?im.naturalHeight:im.naturalWidth,h=swap?im.naturalWidth:im.naturalHeight;const scale=Math.max(916/w,916/h)*zoom;c.translate(512+x,512+y);c.rotate(rotation*Math.PI/180);c.drawImage(im,-im.naturalWidth*scale/2,-im.naturalHeight*scale/2,im.naturalWidth*scale,im.naturalHeight*scale);}
      else {const g=c.createLinearGradient(200,100,800,900);g.addColorStop(0,"#71458d");g.addColorStop(1,"#2e153e");c.fillStyle=g;c.fillRect(0,0,1024,1024);circle(c,512,395,108,"#c3a2d64a");c.beginPath();c.ellipse(512,753,230,216,0,0,Math.PI*2);c.fillStyle="#c3a2d633";c.fill();c.textAlign="center";c.fillStyle="#f4dfaa";c.font="600 27px system-ui";c.fillText("Your photo goes here",512,605);}
      c.restore();}
    drawFrame(c,frame);
    if(phrase){c.save();c.translate(512,512);c.font="bold 27px system-ui";c.fillStyle="#fff0bc";c.textAlign="center";const chars=[...phrase.toUpperCase()],radius=478;const widths=chars.map(ch=>c.measureText(ch).width+3);let a=-Math.PI/2-widths.reduce((sum,v)=>sum+v,0)/radius/2;chars.forEach((ch,i)=>{const delta=widths[i]/radius;c.save();c.rotate(a+delta/2);c.translate(radius,0);c.rotate(Math.PI/2);c.fillText(ch,0,9);c.restore();a+=delta;});c.restore();}
    if(badge!=="none"){const by=Math.min(frame==="skyline"?850:879,953-badgeSize/2);
      if(badge.startsWith("society:")&&societyImage?.id===badge&&societyImage.removeWhite===removeSocietyWhite){
        const im=societyImage.image,scale=badgeSize/Math.max(im.width,im.height);
        const w=im.width*scale,h=im.height*scale;
        c.save();c.shadowColor="#180a27";c.shadowBlur=5;
        c.drawImage(im,512-w/2,by-h/2,w,h);c.restore();
      }
      if(badge==="logo"){circle(c,512,by,badgeSize/2+5,"#2e103f",gold,4);if(logo.current)c.drawImage(logo.current,512-badgeSize/2,by-badgeSize/2,badgeSize,badgeSize);}
      if(badge==="mask"){circle(c,512,by,badgeSize/2,"#2e103f",gold,3);mask(c,512,by,badgeSize*.88);}
      if(badge==="moonpie"){circle(c,512,by,badgeSize/2,"#b18032",gold,4);c.save();c.beginPath();c.ellipse(512,by+14,badgeSize*.43,badgeSize*.16,0,0,Math.PI);c.strokeStyle="#fff0bc";c.lineWidth=11;c.stroke();c.font=`bold ${Math.round(badgeSize*.14)}px system-ui`;c.textAlign="center";c.fillStyle="#381348";c.fillText("MOONPIE",512,by-8);c.restore();}
    }
  },[frame,badge,phrase,zoom,x,y,rotation,badgeSize,societyImage,removeSocietyWhite]);
  useEffect(()=>{const c=canvas.current?.getContext("2d");if(c)render(c);},[render,revision,hasPhoto]);
  async function upload(file?:File){if(!file)return;setError("");setStatus("");if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Choose a JPG, PNG, or WebP photo. On an iPhone, export HEIC photos as JPG first.");return;}if(file.size>20*1024*1024){setError("Please choose a photo smaller than 20 MB.");return;}
    const current=++loadId.current,url=URL.createObjectURL(file),im=new Image();im.onload=()=>{URL.revokeObjectURL(url);if(current!==loadId.current)return;photo.current=im;reset();setHasPhoto(true);setRevision(v=>v+1);setStatus("Photo ready. Drag the preview to position it.");};im.onerror=()=>{URL.revokeObjectURL(url);if(current===loadId.current)setError("This photo could not be opened. Try another JPG, PNG, or WebP.");};im.src=url;
  }
  function download(frameOnly=false){if(!artworkReady)return;setError("");const out=document.createElement("canvas");out.width=out.height=1024;const c=out.getContext("2d");if(!c){setError("Your browser could not create the image. Please try again.");return;}render(c,frameOnly);out.toBlob(blob=>{if(!blob){setError("The image could not be saved. Please try again.");return;}const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`mg251-${frame}-${frameOnly?"frame":"profile"}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);setStatus("PNG ready. Check your downloads or Files app.");},"image/png");}
  return <div className={s.studio}><div className={s.inner}>
    <div className={s.eyebrow}>Made for Mobile · Mardi Gras 2027</div>
    <div className={s.intro}><div><h1>Your photo.<br/>A little more Mardi Gras.</h1><p>Pick a frame. Make it yours. Take the parade with you.</p></div><span className={s.pill}><Sparkles size={13} style={{display:"inline",marginRight:6}}/> MG251 Profile Studio</span></div>
    <div className={s.layout}>
      <div className={s.preview}><div className={s.previewHead}><span>YOUR PROFILE PREVIEW</span><span>1024 × 1024 PNG</span></div>
        <div className={s.canvasWrap}><canvas ref={canvas} className={s.canvas} width={1024} height={1024} role="img" aria-label={`Profile picture preview with ${frames.find(f=>f.id===frame)?.name} frame${hasPhoto?" and your photo":""}`} onPointerDown={e=>{if(!hasPhoto)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,ox:x,oy:y};}} onPointerMove={e=>{if(!drag.current)return;const d=drag.current,scale=1024/e.currentTarget.getBoundingClientRect().width;setX(Math.max(-400,Math.min(400,d.ox+(e.clientX-d.x)*scale)));setY(Math.max(-400,Math.min(400,d.oy+(e.clientY-d.y)*scale)));}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}/></div>
        <p className={s.hint}><Move size={13} style={{display:"inline",marginRight:6}}/>{hasPhoto?"Drag your photo to position it, or use the sliders.":"Start with your photo, or download a frame on its own."}<br/>Artwork stays inside the circular profile crop.</p>
        <div className={s.downloadRow}><button className={s.primary} disabled={!hasPhoto||!artworkReady} onClick={()=>download()}><Download size={17}/> Download profile picture</button><button className={s.secondary} disabled={!artworkReady} onClick={()=>download(true)}><Download size={16}/> Download frame only</button></div>
        <div className={s.privacy}><LockKeyhole size={13}/> Your photo stays on your device. No sign-in needed.</div><div role="status" className={s.status}>{status}</div>
      </div>
      <div className={s.controls}>
        <section className={s.section}><h2><span className={s.number}>1</span>Add your photo</h2><label className={s.upload}><Upload size={26}/><strong>{hasPhoto?"Choose a different photo":"Choose your profile photo"}</strong><small>JPG, PNG or WebP · Up to 20 MB</small><input ref={fileInput} className={s.file} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose your profile photo" onChange={e=>{void upload(e.target.files?.[0]);e.target.value="";}}/></label>{error&&<p role="alert" className={s.error}>{error}</p>}
          <div className={s.sliders}>{[{label:"Zoom",value:zoom,set:setZoom,min:1,max:3,step:.01,display:`${zoom.toFixed(2)}×`},{label:"Move left / right",value:x,set:setX,min:-400,max:400,step:1,display:""},{label:"Move up / down",value:y,set:setY,min:-400,max:400,step:1,display:""}].map(v=><label key={v.label}><div className={s.rangeLabel}>{v.label}<span>{v.display}</span></div><input className={s.range} type="range" min={v.min} max={v.max} step={v.step} value={v.value} aria-label={v.label} disabled={!hasPhoto} onChange={e=>v.set(Number(e.target.value))}/></label>)}</div>
          <div className={s.cropActions}><button className={s.secondary} disabled={!hasPhoto} onClick={()=>{setRotation(r=>(r+90)%360);setX(0);setY(0);}}><RotateCw size={14}/> Rotate 90°</button><button className={s.secondary} disabled={!hasPhoto} onClick={reset}>Reset crop</button><button className={s.secondary} disabled={!hasPhoto} onClick={()=>{++loadId.current;photo.current=null;setHasPhoto(false);reset();setStatus("");}}>Remove photo</button></div>
        </section>
        <section className={s.section}><h2><span className={s.number}>2</span>Find your frame</h2><div className={s.frameGrid}>{frames.map(f=><button key={f.id} className={s.choice} aria-pressed={frame===f.id} onClick={()=>setFrame(f.id)}><FrameIcon frame={f.id}/>{f.name}{frame===f.id&&<Check size={12} style={{position:"absolute",right:6,top:6,width:12,height:12}}/>}</button>)}</div></section>
        <section className={s.section}><h2><span className={s.number}>3</span>Add a finishing touch</h2><div className={s.badgeGrid}>{([{id:"logo",name:"MG251"},{id:"mask",name:"Mask"},{id:"moonpie",name:"MoonPie"},{id:"none",name:"No badge"}] as {id:Badge;name:string}[]).map(b=><button key={b.id} className={s.choice} aria-pressed={badge===b.id} onClick={()=>setBadge(b.id)}><BadgeIcon badge={b.id}/>{b.name}</button>)}</div>
          <div className={s.societyPanel}>
            <h3>Society logos <span>{societies.length}</span></h3>
            <p className={s.small}>Choose your society to place its logo at the bottom of your profile picture.</p>
            <label className={s.cleanupToggle}><input type="checkbox" checked={removeSocietyWhite} onChange={e=>setRemoveSocietyWhite(e.target.checked)}/> Remove white background</label>
            <p className={s.small}>Clears outside white space and fits the logo closely. Turn off to keep its original background.</p>
            <label className={s.label} htmlFor="society-search">Find a society</label>
            <input id="society-search" type="search" className={s.select} placeholder="Search society names…" value={societySearch} onChange={e=>setSocietySearch(e.target.value)}/>
            <p className={s.societyCount} role="status">{visibleSocieties.length} of {societies.length} societies{selectedSociety?` · Selected: ${selectedSociety.name}`:""}{!artworkReady?" · Loading logo…":""}</p>
            <div className={s.societyGrid} role="group" aria-label="Society logos">
              {visibleSocieties.map(item=><button key={item.id} className={s.choice} aria-label={item.name} aria-pressed={badge===item.id} onClick={()=>{setError("");setBadge(item.id as Badge);}}>
                <span className={s.societyThumb}><SocietyThumbnail src={item.src} removeWhite={removeSocietyWhite}/></span>
                <span>{item.name}</span>
                {badge===item.id&&<Check size={12} style={{position:"absolute",right:6,top:6,width:12,height:12}}/>}
              </button>)}
            </div>
            {visibleSocieties.length===0&&<p className={s.small}>No societies match. Try a shorter name or clear the search.</p>}
          </div>
          {badge!=="none"&&<label style={{display:"block",marginTop:18}}><div className={s.rangeLabel}>Badge size<span>{badgeSize===168?"Original":"Custom"}</span></div><input className={s.range} aria-label="Badge size" type="range" min="110" max="300" value={badgeSize} onChange={e=>setBadgeSize(Number(e.target.value))}/></label>}
          <label className={s.label} style={{display:"block",marginTop:20}}>Say it your way<select className={s.select} value={phrase} onChange={e=>setPhrase(e.target.value)}><option value="">No wording</option>{["Ready for Mardi Gras","Meet Me on the Route","Mobile Mardi Gras 2027"].map(p=><option key={p}>{p}</option>)}</select></label><p className={s.small}>Your download has transparent corners. Frame-only downloads also have a transparent center.</p>
        </section>
      </div>
    </div><p className={s.footerNote}>Made for the parade route. Made for you. · MG251.xyz</p>
  </div></div>;
}
