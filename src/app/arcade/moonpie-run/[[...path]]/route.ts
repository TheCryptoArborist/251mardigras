// Keep the game and its shared scores under the MG251 address.
const UPSTREAM = 'https://moonpie-run-mobile.arborist63.chatgpt.site';
const BASE = '/arcade/moonpie-run';
const API = new Set(['api/player', 'api/leaderboard', 'api/runs', 'api/runs/finish']);
const FILES = new Set(['style.css', 'progress.css', 'layout-fixes.css', 'art.js', 'audio.js', 'progress.js', 'game.js', 'badges.mjs', 'run-outbox.mjs', 'assets/downtown-sprites.png', 'assets/mobile-artwork-reference.png']);
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
type Context = { params: Promise<{ path?: string[] }> };

async function serve(request: Request, context: Context) {
  const { path = [] } = await context.params;
  const resource = path.join('/');
  const api = API.has(resource);
  if (resource && !api && !FILES.has(resource)) return new Response('Not found', { status: 404 });
  if (request.method === 'POST' && !api) return new Response('Method not allowed', { status: 405 });
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  if (request.method === 'POST' && ((origin && origin !== url.origin) || request.headers.get('sec-fetch-site') === 'cross-site')) {
    return Response.json({ error: 'Please submit from the game page.' }, { status: 403 });
  }
  if (Number(request.headers.get('content-length')) > 16000) return new Response('Request too large', { status: 413 });
  const headers = new Headers();
  if (api) {
    headers.set('accept', 'application/json');
    // Only the game's anonymous profile cookie belongs at the game service.
    const profile = request.headers.get('cookie')?.split(';').map(v => v.trim()).find(v => /^moonpie-player=[a-f0-9]{64}$/.test(v));
    if (profile) headers.set('cookie', profile);
    if (request.method === 'POST') {
      headers.set('origin', UPSTREAM);
      headers.set('content-type', 'application/json');
    }
  }
  const body = request.method === 'POST' ? await request.text() : undefined;
  if (body && body.length > 16000) return new Response('Request too large', { status: 413 });
  try {
    const response = await fetch(`${UPSTREAM}/${resource}${url.search}`, {
      method: request.method, headers, body, redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(15000)
    });
    if (response.status >= 300 && response.status < 400) throw new Error('Unexpected game redirect');
    const output = new Headers({
      'content-type': response.headers.get('content-type') || 'application/octet-stream',
      'cache-control': api || !resource ? 'no-store' : 'public, max-age=300',
      'x-content-type-options': 'nosniff'
    });
    // Keep the existing profile capability scoped to this game, never to the whole site.
    for (const cookie of response.headers.getSetCookie()) {
      if (cookie.startsWith('moonpie-player=')) output.append('set-cookie', cookie.replace(/;\s*Path=[^;]*/i, `; Path=${BASE}`).replace(/;\s*Domain=[^;]*/ig, ''));
    }
    if (request.method === 'HEAD') return new Response(null, { status: response.status, headers: output });
    if (!resource) {
      const html = (await response.text()).replace('<head>', `<head><base href="${BASE}/"><meta name="moonpie-api-base" content="${BASE}">`);
      return new Response(html, { status: response.status, headers: output });
    }
    if (resource === 'progress.js') {
      // Relative modules/assets use the base above; scope absolute score API calls too.
      const original = await response.text();
      // Config-aware clients are served verbatim. Retain v1.14 compatibility
      // until Sites has been released and the rollback window has closed.
      if (original.includes("document.querySelector('meta[name=\"moonpie-api-base\"]')")) {
        return new Response(original, { status: response.status, headers: output });
      }
      const source = original.replace('fetch(path,{', `fetch('${BASE}'+path,{`);
      if (!source.includes(`fetch('${BASE}'+path,{`)) throw new Error('Game API integration changed');
      return new Response(source, { status: response.status, headers: output });
    }
    return new Response(response.body, { status: response.status, headers: output });
  } catch {
    return Response.json({ error: 'The game is temporarily unavailable. Please try again shortly.' }, { status: 502, headers: { 'cache-control': 'no-store' } });
  }
}
export const GET = serve;
export const HEAD = serve;
export const POST = serve;
