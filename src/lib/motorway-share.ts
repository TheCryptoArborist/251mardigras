import { createElement as h } from 'react';
import { ImageResponse } from 'next/og';
import { publicScore } from './motorway-api';
import { rankings } from './motorway-rankings';
import { getRules } from './motorway-replay';
const BASE='https://mg251.xyz/play/moonpie-motorway';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
async function content(url:URL){
 const id=url.searchParams.get('score');const period=url.searchParams.get('board')==='season'?'season':'week';
 if(id){const row=await publicScore(id);if(row)return {title:`${row.nickname}: ${row.score} throws!`,description:'All throws, no luck. Think you can beat this verified Carnival Cup finish? Play free on MG251.',lines:[`${row.nickname} · ${row.score} throws`],query:'?score='+row.id};}
 if(url.searchParams.has('board')){const rules=await getRules(),board=await rankings(rules.season,period);return {title:period==='week'?'This week’s Motorway leaders':'Motorway season leaders',description:'Big talk? Prove it. Chase the top 25 and claim Port City bragging rights. Play MoonPie Motorway free on MG251.',lines:board.entries.slice(0,3).map(r=>`#${r.rank} ${r.nickname} · ${r.score} throws`),query:'?board='+period};}
 return {title:'MoonPie Motorway · MG251',description:'Race through Mobile Mardi Gras, collect throws, and challenge your friends.',lines:['Carnival Cup · Port City bragging rights'],query:''};
}
export async function shareMetadata(url:URL){
 let data;try{data=await content(url);}catch{data=await content(new URL(BASE));}
 return `<meta property="og:type" content="website"><meta property="og:title" content="${escape(data.title)}"><meta property="og:description" content="${escape(data.description)}"><meta property="og:url" content="${BASE+escape(data.query)}"><meta property="og:image" content="${BASE}/share.png${escape(data.query)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">`;
}
export async function shareImage(url:URL){
 let data;try{data=await content(url);}catch{data=await content(new URL(BASE));}
 const line=(text:string,size:number,color='#fff2d5')=>h('div',{style:{display:'flex',fontSize:size,color,marginBottom:24}},text);
 return new ImageResponse(h('div',{style:{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:64,background:'linear-gradient(135deg, #45205c, #140b20)',border:'12px solid #f9cf66',fontFamily:'sans-serif'}},line('MG251 · MOONPIE MOTORWAY',45,'#f9cf66'),line(data.title,40),...data.lines.map((text,i)=>line(text,34,['#f9cf66','#c7d8ea','#df9a6b'][i]||'#fff2d5')),line('BIG TALK? BEAT THIS.',32,'#f9cf66'),line('Play free: mg251.xyz/play/moonpie-motorway',24)),{width:1200,height:630,headers:{'cache-control':'public, max-age=60'}});
}
