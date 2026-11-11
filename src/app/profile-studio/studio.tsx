"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Upload, RotateCw, Move, LockKeyhole, Sparkles, Check } from "lucide-react";
import { loadSocietyArtwork } from "./society-artwork";
import { drawPhraseRibbon } from "./phrase-ribbon";
import { drawBottomBadge, type BadgeBackground } from "./badge-layout";
import { getClassicOpening, makePortraitOpening, type PortraitOpening } from "./portrait-layout";
import societies from "./societies.json";
import s from "./studio.module.css";

type Frame = "classic" | "beads" | "jester" | "royal" | "balcony" | "moonpie" | "oak" | "canopy" | "natural";
type Badge = "logo" | "jester" | "king" | "hero" | "none" | `society:${string}`;
const frames: { id: Frame; name: string; description: string }[] = [
  { id: "classic", name: "Classic MG251", description: "Fine gold trim · the original" },
  { id: "beads", name: "Throw Me Something", description: "Purple & gold parade beads" },
  { id: "jester", name: "Jester’s Court", description: "Velvet, bells & masquerade" },
  { id: "royal", name: "Royal Procession", description: "Gilded scrolls & crown jewels" },
  { id: "balcony", name: "Balcony Nights", description: "Ironwork, lanterns & bead garlands" },
  { id: "moonpie", name: "MoonPie Magic", description: "Mobile’s favorite parade throw" },
  { id: "oak", name: "Royal Oak Wreath", description: "Purple & gold oak leaves and acorns" },
  { id: "canopy", name: "Carnival Canopy", description: "Golden branches, leaves & roots" },
  { id: "natural", name: "Natural Canopy", description: "Living green leaves & natural wood" }
];
const accents = [
  { id: "logo" as const, name: "Mobile Mardi Gras", src: "/images/mardi-gras-mobile-logo.png" },
  { id: "jester" as const, name: "Carnival Jester", src: "/images/schedule/mardi-gras-jester-icon.webp" },
  { id: "king" as const, name: "Carnival King", src: "/images/schedule/mardi-gras-king-icon.webp" },
  { id: "hero" as const, name: "Tree Hero", src: "/images/profile-studio/badges/tree-hero.webp" }
];
const gold = "#f3cf72";

function circle(c: CanvasRenderingContext2D, x: number, y: number, r: number, fill?: string | CanvasGradient, stroke?: string, width = 1) {
  c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
}
function star(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath(); c.moveTo(x, y-r); c.quadraticCurveTo(x+2,y-2,x+r,y); c.quadraticCurveTo(x+2,y+2,x,y+r); c.quadraticCurveTo(x-2,y+2,x-r,y); c.quadraticCurveTo(x-2,y-2,x,y-r); c.fillStyle=gold;c.fill();
}
function drawFrame(c: CanvasRenderingContext2D, frame: Frame, artwork?: HTMLImageElement) {
  if(frame!=="classic"&&frame!=="beads") {
    if(artwork){c.save();circle(c,512,512,500);c.clip();c.drawImage(artwork,12,12,1000,1000);c.restore();}
    return;
  }
  const gradient=c.createLinearGradient(70,40,940,940);gradient.addColorStop(0,"#ffe8a4");gradient.addColorStop(.32,"#bb8536");gradient.addColorStop(.6,"#fff0b8");gradient.addColorStop(1,"#cc9d40");
  circle(c,512,512,478,undefined,"#311044",45);c.strokeStyle=gradient;c.lineWidth=5;c.beginPath();c.arc(512,512,498,0,Math.PI*2);c.stroke();circle(c,512,512,454,undefined,gold,3);
  if(frame==="classic") {circle(c,512,512,478,undefined,gold,2);for(let i=0;i<96;i++){const a=i*Math.PI/48;circle(c,512+487*Math.cos(a),512+487*Math.sin(a),2.5,"#fce1a0");} [0,Math.PI].forEach(a=>star(c,512+478*Math.cos(a),512+478*Math.sin(a),14));}
  if(frame==="beads") { for(let i=0;i<76;i++){const a=i*Math.PI*2/76;const x=512+478*Math.cos(a),y=512+478*Math.sin(a);const g=c.createRadialGradient(x-5,y-5,1,x,y,17);g.addColorStop(0,i%2?"#a365cd":"#fff3b4");g.addColorStop(.4,i%2?"#6b2f8d":"#e7bb51");g.addColorStop(1,i%2?"#341045":"#95611c");circle(c,x,y,17,g,gold,1);}}
 }
function FrameThumbnail({frame,artwork}:{frame:Frame;artwork?:HTMLImageElement}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const c=ref.current?.getContext("2d");if(!c)return;c.clearRect(0,0,180,180);c.save();c.scale(180/1024,180/1024);circle(c,512,512,451,"#5b3670");drawFrame(c,frame,artwork);c.restore();},[frame,artwork]);
  return <canvas ref={ref} width={180} height={180} aria-hidden="true"/>;
}

function SocietyThumbnail({ src, removeWhite, round = false }: { src: string; removeWhite: boolean; round?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    const element = ref.current;
    if (!element) return;
    const draw = () => { void loadSocietyArtwork(src, removeWhite, round).then(image => {
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
  }, [src, removeWhite, round]);
  return <canvas ref={ref} width={136} height={136} aria-hidden="true"/>;
}

export default function ProfileStudio() {
  const canvas=useRef<HTMLCanvasElement>(null),photo=useRef<HTMLImageElement|null>(null),fileInput=useRef<HTMLInputElement>(null);
  const [frame,setFrame]=useState<Frame>("classic"),[badge,setBadge]=useState<Badge>("none"),[phrase,setPhrase]=useState("");
  const [hasPhoto,setHasPhoto]=useState(false),[zoom,setZoom]=useState(1),[x,setX]=useState(0),[y,setY]=useState(0),[rotation,setRotation]=useState(0),[badgeSize,setBadgeSize]=useState(176);
  const [error,setError]=useState(""),[status,setStatus]=useState(""),[revision,setRevision]=useState(0);
  const [shareFiles,setShareFiles]=useState<{renderer:unknown;revision:number;profile:File|null;frame:File}|null>(null);
  const [nativeImageShare,setNativeImageShare]=useState(false);
  const [societySearch,setSocietySearch]=useState("");
  const [badgeBacking,setBadgeBacking]=useState<BadgeBackground>("purple");
  const [removeSocietyWhite,setRemoveSocietyWhite]=useState(true);
  const [societyImage,setSocietyImage]=useState<{id:string;removeWhite:boolean;image:HTMLCanvasElement}|null>(null);
  const portraitOpenings=useRef<Partial<Record<Frame,PortraitOpening>>>({});
  const photoLayer=useRef<HTMLCanvasElement|null>(null);
  const [frameArtwork,setFrameArtwork]=useState<Partial<Record<Frame,HTMLImageElement>>>({});
  useEffect(()=>{
    let cancelled=false;
    for(const entry of frames.filter(item=>item.id!=="classic"&&item.id!=="beads")){
      const image=new Image();
      image.onload=()=>{
        if(cancelled)return;
        try {
          portraitOpenings.current[entry.id]=makePortraitOpening(image);
          setFrameArtwork(current=>({...current,[entry.id]:image}));
        } catch { setError("This frame’s photo opening could not load. Please choose another frame."); }
      };
      image.onerror=()=>{if(!cancelled)setError("A frame could not load. Please refresh or choose another frame.");};
      image.src=`/images/profile-studio/frames/${entry.id}-v2.webp`;
    }
    return ()=>{cancelled=true;};
  },[]);
  const selectedSociety=societies.find(item=>item.id===badge);
  const selectedArtwork=selectedSociety??accents.find(item=>item.id===badge);
  const artworkRemoveWhite=selectedSociety?removeSocietyWhite:false;
  const artworkRound=!selectedSociety&&(badge==="jester"||badge==="king");
  const visibleSocieties=societies.filter(item=>item.name.toLocaleLowerCase().includes(societySearch.trim().toLocaleLowerCase()));
  const artworkReady=!selectedArtwork||(societyImage?.id===badge&&societyImage.removeWhite===artworkRemoveWhite);
  const frameReady=frame==="classic"||frame==="beads"||Boolean(frameArtwork[frame]);
  const exportReady=artworkReady&&frameReady;
  useEffect(()=>{
    if(!selectedArtwork)return;
    let cancelled=false;
    void loadSocietyArtwork(selectedArtwork.src,artworkRemoveWhite,artworkRound).then(image=>{
      if(!cancelled)setSocietyImage({id:selectedArtwork.id,removeWhite:artworkRemoveWhite,image});
    }).catch(()=>{if(!cancelled)setError("This society logo could not load. Please try another logo.");});
    return ()=>{cancelled=true;};
  },[selectedArtwork,artworkRemoveWhite,artworkRound]);
  const drag=useRef<{x:number;y:number;ox:number;oy:number}|null>(null),loadId=useRef(0);
  const reset=()=>{setZoom(1);setX(0);setY(0);setRotation(0);};

  const render=useCallback((c:CanvasRenderingContext2D,frameOnly=false)=>{
    c.clearRect(0,0,1024,1024);
    if(!frameOnly){
      const opening=portraitOpenings.current[frame]??getClassicOpening();
      const layer=photoLayer.current??document.createElement("canvas");
      if(!photoLayer.current){layer.width=layer.height=1024;photoLayer.current=layer;}
      const p=layer.getContext("2d");
      if(!p)return;
      p.clearRect(0,0,1024,1024);p.save();
      p.fillStyle="#30163f";p.fillRect(0,0,1024,1024);
      if(photo.current){
        const im=photo.current,swap=rotation%180!==0;
        const w=swap?im.naturalHeight:im.naturalWidth,h=swap?im.naturalWidth:im.naturalHeight;
        const scale=Math.max(opening.width/w,opening.height/h)*zoom;
        p.translate(opening.x+opening.width/2+x,opening.y+opening.height/2+y);
        p.rotate(rotation*Math.PI/180);
        p.drawImage(im,-im.naturalWidth*scale/2,-im.naturalHeight*scale/2,im.naturalWidth*scale,im.naturalHeight*scale);
      } else {
        const g=p.createLinearGradient(200,100,800,900);g.addColorStop(0,"#71458d");g.addColorStop(1,"#2e153e");
        p.fillStyle=g;p.fillRect(0,0,1024,1024);circle(p,512,395,108,"#c3a2d64a");
        p.beginPath();p.ellipse(512,753,230,216,0,0,Math.PI*2);p.fillStyle="#c3a2d633";p.fill();
        p.textAlign="center";p.fillStyle="#f4dfaa";p.font="600 27px system-ui";p.fillText("Your photo goes here",512,605);
      }
      p.restore();p.save();p.globalCompositeOperation="destination-in";p.drawImage(opening.mask,0,0);p.restore();
      c.drawImage(layer,0,0);
    }
    drawPhraseRibbon(c,phrase,portraitOpenings.current[frame]??getClassicOpening());
    drawFrame(c,frame,frameArtwork[frame]);
    if(badge!=="none"){
      if(societyImage?.id===badge&&societyImage.removeWhite===artworkRemoveWhite){
        drawBottomBadge(c,societyImage.image,badgeSize,badgeBacking);
      }

    }
  },[frame,badge,phrase,zoom,x,y,rotation,badgeSize,badgeBacking,societyImage,artworkRemoveWhite,frameArtwork]);
  useEffect(()=>{const c=canvas.current?.getContext("2d");if(c)render(c);},[render,revision,hasPhoto]);
  // Prepare files before the tap: iOS requires share() during the user gesture.
  useEffect(()=>{
    if(!exportReady)return;
    let cancelled=false;
    const timer=window.setTimeout(()=>{
      const makeFile=(frameOnly:boolean)=>new Promise<File>((resolve,reject)=>{
        const out=document.createElement("canvas");out.width=out.height=1024;
        const c=out.getContext("2d");if(!c){reject(new Error("Canvas unavailable"));return;}
        render(c,frameOnly);
        out.toBlob(blob=>blob?resolve(new File([blob],`mg251-${frame}-${frameOnly?"frame":"profile"}.png`,{type:"image/png"})):reject(new Error("PNG unavailable")),"image/png");
      });
      void Promise.all([hasPhoto?makeFile(false):Promise.resolve(null),makeFile(true)]).then(([profile,frameFile])=>{
        if(cancelled)return;
        setShareFiles({renderer:render,revision,profile,frame:frameFile});
        const mobile=window.matchMedia("(max-width:760px), (pointer:coarse)").matches;
        setNativeImageShare(mobile&&Boolean(typeof navigator.share==="function"&&typeof navigator.canShare==="function"&&navigator.canShare({files:[frameFile]})));
      }).catch(()=>{if(!cancelled)setError("The image could not be prepared. Please adjust your frame and try again.");});
    },120);
    return ()=>{cancelled=true;window.clearTimeout(timer);};
  },[render,revision,hasPhoto,frame,exportReady]);
  const filesReady=exportReady&&shareFiles?.renderer===render&&shareFiles.revision===revision;
  async function upload(file?:File){if(!file)return;setError("");setStatus("");if(!["image/jpeg","image/png","image/webp"].includes(file.type)){setError("Choose a JPG, PNG, or WebP photo. On an iPhone, export HEIC photos as JPG first.");return;}if(file.size>20*1024*1024){setError("Please choose a photo smaller than 20 MB.");return;}
    const current=++loadId.current,url=URL.createObjectURL(file),im=new Image();im.onload=()=>{URL.revokeObjectURL(url);if(current!==loadId.current)return;photo.current=im;reset();setHasPhoto(true);setRevision(v=>v+1);setStatus("Photo ready. Drag the preview to position it.");};im.onerror=()=>{URL.revokeObjectURL(url);if(current===loadId.current)setError("This photo could not be opened. Try another JPG, PNG, or WebP.");};im.src=url;
  }
  function download(frameOnly=false,forceDownload=false){if(!exportReady)return;setError("");
    const file=filesReady?(frameOnly?shareFiles?.frame:shareFiles?.profile):null;
    if(!forceDownload&&nativeImageShare&&file){
      // Share only the PNG so the sheet offers image actions rather than a link preview.
      void navigator.share({files:[file],title:"My Mardi Gras profile picture"}).then(()=>setStatus("Share sheet closed. Your phone handles saving and sharing.")).catch((error:unknown)=>{
        if(error instanceof Error&&error.name==="AbortError")return;
        setStatus("Sharing could not open. Use Download PNG instead, then save the image from your downloads.");
      });return;
    }
const out=document.createElement("canvas");out.width=out.height=1024;const c=out.getContext("2d");if(!c){setError("Your browser could not create the image. Please try again.");return;}render(c,frameOnly);out.toBlob(blob=>{if(!blob){setError("The image could not be saved. Please try again.");return;}const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`mg251-${frame}-${frameOnly?"frame":"profile"}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);setStatus("PNG ready. Check your downloads or Files app.");},"image/png");}
  return <div className={s.studio}><div className={s.inner}>
    <div className={s.eyebrow}>Made for Mobile · Mardi Gras 2027</div>
    <div className={s.intro}><div><h1>Your photo.<br/>A little more Mardi Gras.</h1><p>Pick a frame. Make it yours. Take the parade with you.</p></div><span className={s.pill}><Sparkles size={13} style={{display:"inline",marginRight:6}}/> MG251 Profile Studio</span></div>
    <div className={s.mobilePhotoStart}>
      <button type="button" className={s.primary} onClick={()=>fileInput.current?.click()}><Upload size={20}/>{hasPhoto?"Choose a different photo":"Choose a photo from your camera roll"}</button>
      <p>Your photo stays on your device. No sign-in needed.</p>
      {error&&<p role="alert" className={s.error}>{error}</p>}
    </div>
    <div className={s.layout}>
      <div className={s.controls}>
        <section className={s.section}><h2><span className={s.number}>1</span>Add your photo</h2><label className={s.upload}><Upload size={26}/><strong>{hasPhoto?"Choose a different photo":"Choose your profile photo"}</strong><small>JPG, PNG or WebP · Up to 20 MB</small><input ref={fileInput} className={s.file} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose your profile photo" onChange={e=>{void upload(e.target.files?.[0]);e.target.value="";}}/></label>{error&&<p role="alert" className={`${s.error} ${s.desktopUploadError}`}>{error}</p>}
          <div className={s.sliders}>{[{label:"Zoom",value:zoom,set:setZoom,min:.5,max:3,step:.01,display:`${zoom.toFixed(2)}×`},{label:"Move left / right",value:x,set:setX,min:-400,max:400,step:1,display:""},{label:"Move up / down",value:y,set:setY,min:-400,max:400,step:1,display:""}].map(v=><label key={v.label}><div className={s.rangeLabel}>{v.label}<span>{v.display}</span></div><input className={s.range} type="range" min={v.min} max={v.max} step={v.step} value={v.value} aria-label={v.label} disabled={!hasPhoto} onChange={e=>v.set(Number(e.target.value))}/></label>)}</div>
          <div className={s.cropActions}><button className={s.secondary} disabled={!hasPhoto} onClick={()=>{setRotation(r=>(r+90)%360);setX(0);setY(0);}}><RotateCw size={14}/> Rotate 90°</button><button className={s.secondary} disabled={!hasPhoto} onClick={reset}>Reset crop</button><button className={s.secondary} disabled={!hasPhoto} onClick={()=>{++loadId.current;photo.current=null;setHasPhoto(false);reset();setStatus("");}}>Remove photo</button></div>
        </section>
        <section className={s.section}><h2><span className={s.number}>2</span>Find your frame</h2><p className={s.collectionIntro}>Made for Mobile. Choose your Carnival style.</p><div className={s.frameGrid}>{frames.map(f=><button key={f.id} className={`${s.choice} ${s.frameChoice}`} aria-label={f.name} aria-pressed={frame===f.id} onClick={()=>setFrame(f.id)}><FrameThumbnail frame={f.id} artwork={frameArtwork[f.id]}/><span>{f.name}</span><small>{f.description}</small>{frame===f.id&&<Check size={12} style={{position:"absolute",right:8,top:8,width:12,height:12}}/>}</button>)}</div>{!frameReady&&<p className={s.small} role="status">Loading your frame…</p>}</section>
        <section className={s.section}><h2><span className={s.number}>3</span>Make it yours</h2><p className={s.collectionIntro}>Keep it simple, add a Mobile Mardi Gras emblem, or represent your society.</p><div className={s.badgeGrid}>
          <button className={`${s.choice} ${s.accentChoice}`} aria-pressed={badge==="none"} onClick={()=>setBadge("none")}><span className={s.noArtwork} aria-hidden="true">—</span>No artwork</button>
          {accents.map(item=><button key={item.id} className={`${s.choice} ${s.accentChoice}`} aria-pressed={badge===item.id} onClick={()=>setBadge(item.id)}><span className={s.accentThumb}><SocietyThumbnail src={item.src} removeWhite={false} round={item.id==="jester"||item.id==="king"}/></span>{item.name}</button>)}
        </div>
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
          {badge!=="none"&&<label className={s.label} style={{display:"block",marginTop:18}}>Badge background<select className={s.select} aria-label="Badge background" value={badgeBacking} onChange={e=>setBadgeBacking(e.target.value as BadgeBackground)}><option value="purple">Purple</option><option value="gold">Gold</option><option value="none">Logo only</option></select><span className={s.small}>Backing adapts to your logo’s shape and keeps it clear of your photo.</span></label>}
          {badge!=="none"&&<label style={{display:"block",marginTop:18}}><div className={s.rangeLabel}>Badge size<span>{badgeSize===176?"Default":"Custom"}</span></div><input className={s.range} aria-label="Badge size" type="range" min="80" max="300" value={badgeSize} onChange={e=>setBadgeSize(Number(e.target.value))}/></label>}
          <label className={s.label} style={{display:"block",marginTop:20}}>Say it your way<select className={s.select} value={phrase} onChange={e=>setPhrase(e.target.value)}><option value="">No wording</option>{["Ready for Mardi Gras","Meet Me on the Route","Mobile Mardi Gras 2027"].map(p=><option key={p}>{p}</option>)}</select></label><p className={s.small}>Your download has transparent corners. Frame-only downloads also have a transparent center.</p>
        </section>
      </div>
      <div className={s.preview}><div className={s.previewHead}><span>YOUR PROFILE PREVIEW</span><span>1024 × 1024 PNG</span></div>
        <div className={s.canvasWrap}><canvas ref={canvas} className={s.canvas} width={1024} height={1024} role="img" aria-label={`Profile picture preview with ${frames.find(f=>f.id===frame)?.name} frame${hasPhoto?" and your photo":""}`} onPointerDown={e=>{if(!hasPhoto)return;e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,ox:x,oy:y};}} onPointerMove={e=>{if(!drag.current)return;const d=drag.current,scale=1024/e.currentTarget.getBoundingClientRect().width;setX(Math.max(-400,Math.min(400,d.ox+(e.clientX-d.x)*scale)));setY(Math.max(-400,Math.min(400,d.oy+(e.clientY-d.y)*scale)));}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}/></div>
        <p className={s.hint}><Move size={13} style={{display:"inline",marginRight:6}}/>{hasPhoto?"Drag your photo to position it, or use the sliders.":"Start with your photo, or download a frame on its own."}<br/>Photo fits the frame’s inner opening. Zoom out for more space.</p>
        <div className={s.downloadRow}><button className={s.primary} disabled={!hasPhoto||!filesReady} onClick={()=>download()}><Download size={17}/> {nativeImageShare?"Save or share profile picture":"Download profile picture"}</button><button className={s.secondary} disabled={!filesReady} onClick={()=>download(true)}><Download size={16}/> {nativeImageShare?"Save or share frame only":"Download frame only"}</button></div>
        {nativeImageShare&&<><p className={s.small}>Choose Save Image, Messages, or another app in your phone’s share sheet. Available actions depend on your phone.</p><button className={s.downloadFallback} disabled={!filesReady} onClick={()=>download(!hasPhoto,true)}>Download PNG instead</button></>}
        {exportReady&&!filesReady&&<p className={s.small} role="status">Preparing your PNG…</p>}
        <div className={s.privacy}><LockKeyhole size={13}/> Your photo stays on your device. No sign-in needed.</div><div role="status" className={s.status}>{status}</div>
      </div>
    </div><p className={s.footerNote}>Made for the parade route. Made for you. · MG251.xyz</p>
  </div></div>;
}
