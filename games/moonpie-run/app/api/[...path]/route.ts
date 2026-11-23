import {env} from 'cloudflare:workers';
import {handleScores} from '../../../lib/score-service.mjs';
export const dynamic='force-dynamic';
export function GET(request:Request){return handleScores(request,env.DB)}
export function POST(request:Request){return handleScores(request,env.DB)}
