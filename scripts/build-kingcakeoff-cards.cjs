const sharp = require('sharp');
const path = require('path');
const root = path.resolve(__dirname, '..');
const asset = p => path.join(root, 'public', p);
async function card(square) {
 const w=square?1080:1200,h=square?1080:630;
 const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#211033"/><rect x="24" y="24" width="${w-48}" height="${h-48}" rx="20" fill="none" stroke="#f3cc63" stroke-opacity=".6"/>${square?'<rect x="290" y="42" width="500" height="500" rx="18" fill="white"/>':'<rect x="40" y="40" width="480" height="480" rx="18" fill="white"/>'}<g font-family="DejaVu Sans, sans-serif" text-anchor="${square?'middle':'start'}"><text x="${square?540:565}" y="${square?587:103}" font-size="18" letter-spacing="3" fill="#f3cc63">9TH ANNUAL · MOBILE, ALABAMA</text><text x="${square?540:560}" y="${square?655:184}" font-size="${square?58:56}" font-weight="bold" fill="#fff9ee">King Cake-Off</text><text x="${square?540:565}" y="${square?706:228}" font-size="${square?25:23}" fill="#e0d3ec">The countdown is on!</text><text x="${square?540:565}" y="${square?779:306}" font-size="${square?33:30}" font-weight="bold" fill="#f3cc63">Friday, January 15, 2027</text><text x="${square?540:565}" y="${square?826:354}" font-size="${square?31:29}" fill="#fff9ee">5:00–7:30 PM Central</text><text x="${square?540:565}" y="${square?879:411}" font-size="${square?24:23}" fill="#e0d3ec">Arthur R. Outlaw</text><text x="${square?540:565}" y="${square?913:445}" font-size="${square?24:23}" fill="#e0d3ec">Mobile Convention Center</text><text x="${square?540:565}" y="${square?949:487}" font-size="20" fill="#e0d3ec">King cake tastings · Live music · Family fun</text></g><path d="M40 ${h-94}H${w-40}" stroke="#f3cc63" stroke-opacity=".45"/>${square?'':`<text x="126" y="${h-48}" font-family="DejaVu Sans, sans-serif" font-size="${square?24:25}" font-weight="bold" fill="#f3cc63">Countdown powered by MG251.xyz</text>`}${square?'':`<text x="1160" y="582" text-anchor="end" font-family="DejaVu Sans, sans-serif" font-size="17" fill="#e0d3ec">mg251.xyz/kingcakeoff</text>`}</svg>`;
 const logoSize=square?480:460;
 const event=await sharp(asset('images/kingcakeoff/official-event-branding.png')).resize(logoSize,logoSize,{fit:'contain'}).png().toBuffer();
 const mg=await sharp(asset('images/mardi-gras-mobile-logo.png')).resize(58,58,{fit:'contain'}).png().toBuffer();
 const layers=[{input:event,left:square?300:50,top:square?52:50}];
 if(square){
  const footer=await sharp(Buffer.from('<svg width="700" height="64" xmlns="http://www.w3.org/2000/svg"><text x="0" y="42" font-family="DejaVu Sans, sans-serif" font-size="24" font-weight="bold" fill="#f3cc63">Countdown powered by MG251.xyz</text></svg>')).trim().png().toBuffer({resolveWithObject:true});
  const left=Math.round((w-58-14-footer.info.width)/2);
  layers.push({input:mg,left,top:h-80},{input:footer.data,left:left+72,top:Math.round(h-80+(58-footer.info.height)/2)});
 }else{layers.push({input:mg,left:55,top:h-80});}
 await sharp(Buffer.from(svg)).composite(layers).png().toFile(asset(`images/kingcakeoff/share-${square?'square-v2':'landscape-v1'}.png`));
}
(async()=>{await card(false);await card(true)})();
