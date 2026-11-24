'use strict';
// Art is drawn only inside the same solid rectangles used by the maze collisions.
window.MobileArt=(()=>{
 const atlas=new Image(),reference=new Image(),cache=new Map();
 const sprites=[[101,84,438,473],[738,96,400,462],[107,681,431,515],[660,701,548,472]];
 const api={readyToPlay:false,failed:false};
 const load=(img,url)=>new Promise((resolve,reject)=>{img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Unable to load '+url));img.src=url;});
 api.loaded=Promise.all([load(atlas,'assets/downtown-sprites.png'),load(reference,'assets/mobile-artwork-reference.png')]).then(()=>{
  api.readyToPlay=true;cache.clear();
  const banner=document.getElementById('skyline'),b=banner.getContext('2d');b.imageSmoothingEnabled=false;
  b.drawImage(reference,0,29,1122,231,0,0,1122,231);
  const preview=document.getElementById('street-preview'),p=preview.getContext('2d');p.imageSmoothingEnabled=false;p.clearRect(0,0,390,180);
  for(let i=0;i<3;i++)p.drawImage(atlas,...sprites[i],i*132+3,5,122,162);
  p.fillStyle='#bd9459';p.fillRect(0,168,390,1);
 }).catch(e=>{api.failed=true;throw e;});
 function rect(g,x,y,w,h,fill){g.fillStyle=fill;g.fillRect(x,y,w,h);}
 function lamp(g,x,y){
  rect(g,x-1,y+5,2,19,'#a6814c');rect(g,x-3,y+23,6,2,'#c69f62');
  g.fillStyle='#f4d58a';g.beginPath();g.moveTo(x-4,y-3);g.lineTo(x,y-8);g.lineTo(x+4,y-3);g.closePath();g.fill();
  rect(g,x-4,y-3,8,10,'#765039');rect(g,x-2,y-1,4,6,'#ffe4a2');
  rect(g,x-5,y-4,10,1,'#d4b16d');rect(g,x-5,y+7,10,1,'#d4b16d');
 }
 function sign(g,label,x,y,w){
  w=Math.min(w-8,63);rect(g,x+4,y,w,11,'#1a0d25');g.strokeStyle='#e7c677';g.lineWidth=.7;g.strokeRect(x+4.5,y+.5,w-1,10);
  g.fillStyle='#f7dda0';g.font='bold 6px monospace';g.textAlign='center';g.fillText(label,x+4+w/2,y+7.6);
 }
 function board(map,scene,T,C,R,level){
  const layer=document.createElement('canvas');layer.width=C*T;layer.height=R*T;const g=layer.getContext('2d');g.imageSmoothingEnabled=false;
  rect(g,0,0,C*T,R*T,'#170b25');
  // Low-contrast paving leaves the doubloons and characters as the brightest features.
  for(let y=1;y<R-1;y++)for(let x=1;x<C-1;x++)if(!map[y][x]){
   rect(g,x*T,y*T,T,T,'#1b0d2a');
   if((x+y)%3===0)rect(g,x*T+6,y*T+17,7,.6,'#c8945210');
  }
  // Masonry around the outside, with lamps confined to the solid perimeter.
  for(let y=0;y<R;y++)for(let x=0;x<C;x++)if(x===0||y===0||x===C-1||y===R-1){
   rect(g,x*T,y*T,T,T,'#56304f');
   for(let j=0;j<3;j++){rect(g,x*T+(j%2?0:6),y*T+j*8,17,6,j%2?'#815368':'#6b3e5b');rect(g,x*T+(j%2?1:7),y*T+j*8,15,1,'#b78778');}
  }
  g.strokeStyle='#e2b86c';g.lineWidth=1.5;g.strokeRect(T-2,T-2,(C-2)*T+4,(R-2)*T+4);
  if(api.readyToPlay){
   scene.buildings.forEach((block,i)=>{
    const [x,y,w,h]=block,px=x*T,py=y*T,pw=w*T,ph=h*T;
    g.save();g.beginPath();g.rect(px,py,pw,ph);g.clip();
    rect(g,px,py,pw,ph,'#301631');
    g.drawImage(atlas,...sprites[(i+level)%3],px+1,py+1,pw-2,ph-3);
    rect(g,px,py+ph-3,pw,3,'#c18a84');
    if(i===3)sign(g,'DAUPHIN ST',px,py+ph*.65,pw);
    if(i===scene.buildings.length-1)sign(g,'ROYAL ST',px,py+ph*.68,pw);
    g.restore();
   });
   const [x,y,w,h]=scene.park;g.save();g.beginPath();g.rect(x*T,y*T,w*T,h*T);g.clip();
   rect(g,x*T,y*T,w*T,h*T,'#2b1239');g.drawImage(atlas,...sprites[3],x*T+1,y*T+1,w*T-2,h*T-2);g.restore();
  }else{
   for(const [x,y,w,h] of [...scene.buildings,scene.park])rect(g,x*T,y*T,w*T,h*T,'#3c214b');
  }
  for(const y of [4,10,17,22]){lamp(g,12,y*T);lamp(g,C*T-12,y*T);}
  return layer;
 }
 api.pie=(g,x,y,r)=>{
  g.save();g.imageSmoothingEnabled=false;
  // Reuse the approved concept's chocolate-and-marshmallow power-up artwork.
  g.drawImage(reference,68,339,84,66,x-r-1.2,y-r*.8,2*r+2.4,r*1.65);g.restore();
 };
 api.paint=(g,map,scene,T,C,R,level)=>{
  const k=level+':'+api.readyToPlay;if(!cache.has(k))cache.set(k,board(map,scene,T,C,R,level));
  g.drawImage(cache.get(k),0,0);
 };
 api.shimmer=(g,scene,T,time)=>{
  if(!api.readyToPlay)return;const [x,y,w,h]=scene.park;
  g.save();g.fillStyle='#ffeab3';
  for(let i=0;i<8;i++){const px=(x+w*(.34+(i%4)*.105))*T,py=(y+h*(.51+((time*.3+i*.13)%1)*.3))*T;g.globalAlpha=.35+.4*Math.sin(time*4+i)**2;g.fillRect(px,py,1,2);}
  g.restore();
 };
 return api;
})();
