import {env} from 'cloudflare:workers';
import {handleScores} from '../../../lib/score-service.mjs';
export const dynamic='force-dynamic';
export function GET(request:Request){return handleScores(request,env.DB)}
export async function POST(request:Request){
 // Consume the incoming stream before D1 awaits or early responses. The
 // Vinext/Workers adapter can otherwise outlive the request body's lifetime.
 const body=await request.text();
 return handleScores(new Request(request.url,{method:request.method,headers:request.headers,body}),env.DB);
}
