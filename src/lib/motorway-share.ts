import { createElement as h } from 'react';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { publicScore } from './motorway-api';
import { rankings } from './motorway-rankings';
import { getRules } from './motorway-replay';
const BASE='https://mg251.xyz/play/moonpie-motorway';
// Bump when artwork changes so social crawlers request a new page and image.
const CARD_VERSION='race-trophies-1';
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
async function content(url:URL){
 const id=url.searchParams.get('score');const period=url.searchParams.get('board')==='season'?'season':'week';
 if(id){const row=await publicScore(id);if(row)return {title:`${row.nickname}: ${row.score} throws!`,description:'All throws, no luck. Think you can beat this verified Carnival Cup finish? Play free on MG251.',lines:[`${row.nickname} · ${row.score} throws`],query:'?score='+row.id};}
 if(url.searchParams.has('board')){const rules=await getRules(),board=await rankings(rules.season,period);return {title:period==='week'?'This week’s Motorway leaders':'Motorway season leaders',description:'Big talk? Prove it. Chase the top 25 and claim Port City bragging rights. Play MoonPie Motorway free on MG251.',lines:board.entries.slice(0,3).map(r=>`#${r.rank} ${r.nickname} · ${r.score} throws`),query:'?board='+period};}
 return {title:'MoonPie Motorway · MG251',description:'Race through Mobile Mardi Gras, collect throws, and challenge your friends.',lines:['Carnival Cup · Port City bragging rights'],query:''};
}
export async function shareMetadata(url:URL){
 let data;try{data=await content(url);}catch{data=await content(new URL(BASE));}
 const query=data.query+(data.query?'&':'?')+'card='+CARD_VERSION;
 return `<meta property="og:type" content="website"><meta property="og:title" content="${escape(data.title)}"><meta property="og:description" content="${escape(data.description)}"><meta property="og:url" content="${BASE+escape(query)}"><meta property="og:image" content="${BASE}/share.png${escape(query)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">`;
}
let trophyData: Promise<string[]> | undefined;
let sceneData: Promise<string> | undefined;
let logoData: Promise<string> | undefined;
export async function shareImage(url:URL){
 const logo=await (logoData??=readFile(join(process.cwd(),'games/moonpie-motorway/dist/assets/mg251-logo.png')).then(bytes=>'data:image/png;base64,'+bytes.toString('base64')).catch(error=>{logoData=undefined;throw error;}));
 const trophies=url.searchParams.has('board')?await (trophyData??=Promise.all(['gold','silver','bronze'].map(metal=>readFile(join(process.cwd(),`games/moonpie-motorway/dist/assets/trophy-${metal}.svg`)).then(bytes=>'data:image/svg+xml;base64,'+bytes.toString('base64')))).catch(error=>{trophyData=undefined;throw error;})):[];
 const scene=await (sceneData??=readFile(join(process.cwd(),'games/moonpie-motorway/dist/assets/share-race-wide.jpg')).then(bytes=>'data:image/jpeg;base64,'+bytes.toString('base64')).catch(error=>{sceneData=undefined;throw error;}));
 let data;try{data=await content(url);}catch{data=await content(new URL(BASE));}
 const line=(text:string,size:number,color='#fff2d5')=>h('div',{style:{display:'flex',fontSize:size,color,marginBottom:14}},text);
 return new ImageResponse(h('div',{style:{width:'100%',height:'100%',display:'flex',position:'relative',background:'#140b20',border:'12px solid #f9cf66',fontFamily:'sans-serif'}},
 h('img',{src:scene,width:1200,height:630,style:{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}}),
 h('div',{style:{position:'absolute',top:0,left:0,width:'100%',height:'100%',background:'linear-gradient(90deg,rgba(16,9,29,0.92),rgba(16,9,29,0.6) 60%,rgba(16,9,29,0.15))'}}),
 h('div',{style:{display:'flex',position:'relative',flexDirection:'column',padding:36,width:'100%'}},
 h('div',{style:{display:'flex',alignItems:'center',gap:24,marginBottom:16}},h('img',{src:logo,width:110,height:110,alt:'Mardi Gras - Mobile, AL'}),line('MG251 · MOONPIE MOTORWAY',36,'#f9cf66')),line(data.title,32),...data.lines.map((text,i)=>trophies[i]?h('div',{style:{display:'flex',alignItems:'center',gap:12,height:54}},h('img',{src:trophies[i],width:44,height:54}),line(text,26,['#f9cf66','#c7d8ea','#df9a6b'][i])):line(text,26,'#f9cf66')),
 h('div',{style:{display:'flex',position:'absolute',bottom:72,left:36,fontSize:30,color:'#f9cf66'}},'BIG TALK? BEAT THIS.'),h('div',{style:{display:'flex',position:'absolute',bottom:28,left:36,fontSize:23,color:'#fff2d5'}},'Play free: mg251.xyz/play/moonpie-motorway'))),{width:1200,height:630,headers:{'cache-control':'public, max-age=60'}});
}
