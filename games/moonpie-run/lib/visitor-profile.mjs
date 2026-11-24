const COOKIE='moonpie-player',LIFETIME=365*24*60*60;
const hash=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');

// A random, HttpOnly browser capability owns only this game's visitor records.
// Platform sign-in keeps using the existing, trusted Site identity unchanged.
export async function visitorProfile(req,db,{create=false}={}){
 const accountId=req.headers.get('oai-authenticated-user-id');
 if(accountId)return{id:accountId,kind:'account',signedIn:true};
 const token=(req.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
 const now=Date.now();
 if(token&&/^[a-f0-9]{64}$/.test(token)){
  const row=await db.prepare('SELECT user_id FROM visitor_profiles WHERE token_hash=? AND expires_at>?').bind(await hash(token),now).first();
  if(row)return{id:row.user_id,kind:'visitor',signedIn:false};
 }
 if(!create)return{id:null,kind:'visitor',signedIn:false};
 const fresh=[...crypto.getRandomValues(new Uint8Array(32))].map(n=>n.toString(16).padStart(2,'0')).join(''),id='visitor_'+crypto.randomUUID();
 await db.prepare('INSERT INTO visitor_profiles (token_hash,user_id,created_at,expires_at) VALUES (?,?,?,?)').bind(await hash(fresh),id,now,now+LIFETIME*1000).run();
 return{id,kind:'visitor',signedIn:false,cookie:COOKIE+'='+fresh+'; Path=/; Max-Age='+LIFETIME+'; HttpOnly; SameSite=Lax'+(new URL(req.url).protocol==='https:'?'; Secure':'')};
}
