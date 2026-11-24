'use strict';
/* Original raster artwork for the Carnival racer. Sprite atlases are unpacked
   once, then the road renderer reuses the small, pixel-aligned frames. */
window.MotorwayArt = (() => {
  const art = { cars: [], props: {}, skyline: null, ready: false };
  const make = (w,h) => { const c=document.createElement('canvas');c.width=w;c.height=h;return c; };
  function image(url) {
    return new Promise((resolve,reject)=>{
      const im=new Image(); im.onload=()=>resolve(im);
      im.onerror=()=>reject(new Error('Could not load game artwork: '+url));
      im.src=url;
    });
  }
  function carFrame(sheet,col,row) {
    const c=make(256,215),g=c.getContext('2d');
    g.imageSmoothingEnabled=false;
    // All steering frames share the same origin and tire contact baseline.
    g.drawImage(sheet,col*512,row*512+65,512,430,0,0,256,215);
    return c;
  }
  function propFrame(sheet,col,row) {
    const size=sheet.width/3, tile=make(size,size), t=tile.getContext('2d');
    t.drawImage(sheet,col*size,row*size,size,size,0,0,size,size);
    const pixels=t.getImageData(0,0,size,size).data;
    let x1=size,y1=size,x2=0,y2=0;
    for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
      if(pixels[(y*size+x)*4+3]>48) {
        x1=Math.min(x1,x);x2=Math.max(x2,x);
        y1=Math.min(y1,y);y2=Math.max(y2,y);
      }
    }
    x1=Math.max(0,x1-2); y1=Math.max(0,y1-2);
    x2=Math.min(size,x2+3); y2=Math.min(size,y2+3);
    const w=x2-x1,h=y2-y1, targetW=280;
    const c=make(targetW,Math.max(1,Math.round(targetW*h/w))),g=c.getContext('2d');
    g.imageSmoothingEnabled=false;
    g.drawImage(tile,x1,y1,w,h,0,0,c.width,c.height);
    return c;
  }
  art.load=async()=>{
    const [cars,props,sky,lemon,pops,nicknacks]=await Promise.all([
      image('assets/race-cars-v3.webp'),
      image('assets/carnival-scenery-v2.webp'),
      image('assets/mobile-skyline-v2.webp'),
      image('assets/lemon-ts-logo.png'),
      image('assets/pops-midtown-logo.jpg'),
      image('assets/nicknacks-logo.jpg')
    ]);
    for(let row=0;row<2;row++)for(let col=0;col<3;col++)art.cars.push(carFrame(cars,col,row));
    const names=['brick','stucco','oak','grandstand','float','oakTall','pit','crowd','lamp'];
    names.forEach((n,i)=>art.props[n]=propFrame(props,i%3,Math.floor(i/3)));
    art.businessLogos={lemon,pops,nicknacks}; art.skyline=sky; art.ready=true;
  };
  art.backdrop=(g,w,h,stage,bend,z)=>{
    const horizon=Math.ceil(h*.505);
    const sky=g.createLinearGradient(0,0,0,horizon);
    sky.addColorStop(0,['#705180','#4b365e','#211a3a'][stage]);
    sky.addColorStop(1,['#c99caa','#b28697','#775771'][stage]);
    g.fillStyle=sky;g.fillRect(0,0,w,h);
    const im=art.skyline;
    if(im){
      const iw=Math.max(w*1.1,h*.54*im.width/im.height),ih=iw*im.height/im.width;
      const drift=Math.sin(z/180000)*w*.026-bend*w*.008;
      g.drawImage(im,(w-iw)/2+drift,horizon-ih,iw,ih);
      if(stage){g.fillStyle=stage===1?'#251b4845':'#19163388';g.fillRect(0,0,w,horizon);}
    }
    if(stage===2){
      g.fillStyle='#fff1c9';
      for(let i=0;i<24;i++)g.fillRect((i*117+33)%w,12+(i*37)%(horizon*.42),1,1);
    }
    g.fillStyle=['#786778','#675468','#554559'][stage];
    g.fillRect(0,horizon,w,h-horizon);
    // Pebbles and dry Carnival confetti give the verge texture without the
    // old flat, horizontal bands running across the whole screen.
    const scroll=Math.floor(z/440)%43;
    for(let i=0;i<230;i++){
      const yy=horizon+((i*73+scroll)%(Math.max(1,h-horizon)));
      const xx=(i*139+((i%7)*17))%w;
      const size=yy>h*.8?2:1;
      g.fillStyle=i%6===0?'#d2af7548':i%2?'#3d304b40':'#b19ba52e';
      g.fillRect(xx,yy,size+(i%3===0?1:0),size);
    }
  };
  art.gate=(label)=>{
    const c=make(640,280),g=c.getContext('2d');
    g.fillStyle='#25232d';g.fillRect(24,45,22,235);g.fillRect(594,45,22,235);
    g.fillStyle='#aa9fa6';g.fillRect(27,45,5,235);g.fillRect(597,45,5,235);
    g.fillStyle='#cfac60';g.fillRect(18,270,36,10);g.fillRect(588,270,36,10);
    g.fillStyle='#21162e';g.fillRect(16,12,608,72);
    for(let y=0;y<2;y++)for(let x=0;x<38;x++){
      g.fillStyle=(x+y)%2?'#342040':'#f8e8bd';g.fillRect(16+x*16,12+y*12,16,12);
    }
    g.fillStyle='#f8d17b';g.font='800 27px "Barlow Condensed",monospace';g.textAlign='center';
    g.fillText(label,320,68);
    for(let x=50;x<600;x+=32){g.strokeStyle='#b1a5b175';g.lineWidth=2;g.beginPath();g.moveTo(x,85);g.lineTo(x+15,107);g.lineTo(x+30,85);g.stroke();}
    return c;
  };
  return art;
})();
