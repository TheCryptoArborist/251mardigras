import { shareImage } from "@/lib/motorway-share";
import { motorwayAPI } from "@/lib/motorway-api";
import { serveMotorway } from "@/lib/moonpie-motorway-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path?: string[] }> };
export async function GET(request: Request, context: Context) {
  const {path=[]}=await context.params;
  if(path.join("/")==="share.png")return shareImage(new URL(request.url));
  if(path[0]==="api")return motorwayAPI(request,path.join("/"));
  return serveMotorway("GET", path, request.url);
}
export async function HEAD(request: Request, context: Context) {
  const response=await GET(request,context);
  return new Response(null,{status:response.status,headers:response.headers});
}

export async function POST(request: Request, context: Context) {
  return motorwayAPI(request, ((await context.params).path||[]).join("/"));
}
