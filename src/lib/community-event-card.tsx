import { readFile, realpath, stat } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties, ReactNode } from "react";
import type { CommunityEvent } from "@/lib/community-events";
import { EVENT_CARD_SIZES, formatCommunityEventShareDate, type CardFormat } from "@/lib/community-event-share";

const purple = "#34125f";
const purpleDark = "#21083f";
const purpleDeep = "#17042f";
const gold = "#ffc928";
const goldShade = "#d69b16";
const cream = "#fffaf0";
const goldSoft = "#fff4cf";
const flex: CSSProperties = { display: "flex" };
const MAX_FLYER_BYTES = 8 * 1024 * 1024;
const MAX_FLYER_PIXELS = 20_000_000;
const FLYER_TIMEOUT_MS = 5_000;
let logoDataPromise: Promise<string> | undefined;

type Flyer = { data: string; width: number; height: number };

function originalLogo() {
  logoDataPromise ??= readFile(join(process.cwd(), "public/images/mardi-gras-mobile-logo.png"))
    .then((buffer) => `data:image/png;base64,${buffer.toString("base64")}`)
    .catch((error) => { logoDataPromise = undefined; throw error; });
  return logoDataPromise;
}

function allowedRemoteFlyer(url: URL, uploadPath?: string) {
  if (url.protocol !== "https:" || url.port || url.username || url.password) return false;
  const prefix = url.hostname === "www.jotform.com" ? "/uploads/"
    : uploadPath && url.hostname === "files.jotform.com" ? "/jufs/" : null;
  if (!prefix || !url.pathname.startsWith(prefix)) return false;
  if (uploadPath === undefined) return true;
  try {
    return decodeURIComponent(url.pathname.slice(prefix.length)) === uploadPath;
  } catch {
    return false;
  }
}

async function readRemoteFlyer(source: string) {
  let url = new URL(source);
  if (!allowedRemoteFlyer(url)) throw new Error("Flyer source is not allowed");
  // Jotform redirects uploads to its file host with an encoded copy of the
  // same path. A redirect may never select another upload or another host.
  const uploadPath = decodeURIComponent(url.pathname.slice("/uploads/".length));
  const signal = AbortSignal.timeout(FLYER_TIMEOUT_MS);
  for (let redirects = 0; redirects <= 2; redirects++) {
    if (!allowedRemoteFlyer(url, uploadPath)) throw new Error("Flyer source is not allowed");
    const response = await fetch(url, { signal, redirect: "manual", cache: "no-store" });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location || redirects === 2) throw new Error("Flyer redirect is unavailable");
      url = new URL(location, url);
      continue;
    }
    if (!response.ok || !response.body) throw new Error("Flyer is unavailable");
    const declaredSize = Number(response.headers.get("content-length"));
    if (declaredSize > MAX_FLYER_BYTES) {
      await response.body.cancel();
      throw new Error("Flyer is too large");
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > MAX_FLYER_BYTES) throw new Error("Flyer is too large");
        chunks.push(value);
      }
    } catch (error) {
      await reader.cancel().catch(() => undefined);
      throw error;
    } finally {
      reader.releaseLock();
    }
    return Buffer.concat(chunks, length);
  }
  throw new Error("Flyer is unavailable");
}

async function readLocalFlyer(source: string) {
  const path = decodeURIComponent(source);
  if (!path.startsWith("/images/event-flyers/") || /[\\\0?#]/.test(path)
    || path.split("/").some((part) => part === "." || part === "..")) {
    throw new Error("Flyer path is not allowed");
  }
  const directory = await realpath(join(process.cwd(), "public/images/event-flyers"));
  const file = await realpath(resolve(process.cwd(), "public", `.${path}`));
  if (!file.startsWith(`${directory}${sep}`)) throw new Error("Flyer path is not allowed");
  const details = await stat(file);
  if (!details.isFile() || details.size > MAX_FLYER_BYTES) throw new Error("Flyer is unavailable");
  const bytes = await readFile(file);
  if (bytes.byteLength > MAX_FLYER_BYTES) throw new Error("Flyer is too large");
  return bytes;
}

function rasterInfo(bytes: Buffer) {
  if (bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { mime: "image/png", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 <= bytes.length) {
      if (bytes[offset] !== 0xff) break;
      while (bytes[offset + 1] === 0xff) offset++;
      const marker = bytes[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      const length = bytes.readUInt16BE(offset + 2);
      if (length < 2 || offset + 2 + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 7) {
        return { mime: "image/jpeg", width: bytes.readUInt16BE(offset + 7), height: bytes.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  throw new Error("Flyer is not a supported raster image");
}

async function loadFlyer(event: CommunityEvent): Promise<Flyer | null> {
  if (!event.flyerUrl) return null;
  // The route supplies an approved record; request parameters never select a
  // filesystem path or remote URL. Restrict that record's image source as well.
  const bytes = event.flyerUrl.startsWith("/")
    ? await readLocalFlyer(event.flyerUrl)
    : await readRemoteFlyer(event.flyerUrl);
  const { mime, width, height } = rasterInfo(bytes);
  if (!width || !height || width > 12_000 || height > 12_000 || width * height > MAX_FLYER_PIXELS) {
    throw new Error("Flyer dimensions are too large");
  }
  return { data: `data:${mime};base64,${bytes.toString("base64")}`, width, height };
}

export async function renderCommunityEventCard(event: CommunityEvent, format: CardFormat, headers?: HeadersInit) {
  const [logo, flyerResult] = await Promise.all([
    originalLogo(),
    loadFlyer(event).then((flyer) => ({ flyer, failed: false }), () => ({ flyer: null, failed: true }))
  ]);
  const render = async (flyer: Flyer | null, failed: boolean) => {
    const cardHeaders = new Headers(headers);
    cardHeaders.set("Content-Type", "image/png");
    cardHeaders.set("X-Community-Event-Flyer", flyer ? "included" : failed ? "unavailable" : "none");
    if (failed) {
      cardHeaders.set("Cache-Control", "no-store");
      cardHeaders.set("Netlify-CDN-Cache-Control", "no-store");
    }
    const response = new ImageResponse(
      <EventCard event={event} format={format} logo={logo} flyer={flyer} />,
      { ...EVENT_CARD_SIZES[format], headers: cardHeaders }
    );
    // Finish decoding before returning so a damaged remote image can fall back
    // to a complete details card instead of sending a broken PNG stream.
    const png = await response.arrayBuffer();
    return new Response(png, { headers: response.headers });
  };
  try {
    return await render(flyerResult.flyer, flyerResult.failed);
  } catch (error) {
    if (!flyerResult.flyer) throw error;
    return render(null, true);
  }
}

function CardFrame({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <div style={{ ...flex, position: "relative", width: "100%", height: "100%", overflow: "hidden", background: `linear-gradient(145deg, ${purpleDeep} 0%, ${purple} 58%, ${purpleDark} 100%)`, color: cream, fontFamily: "sans-serif" }}>
      <div style={{ ...flex, position: "absolute", top: 20, left: 20, width: width - 40, height: height - 40, border: "1px solid rgba(255,201,40,0.28)", borderRadius: 34 }} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", top: 0, left: 0 }}>
        {[
          `M -55 -35 C 110 25, 335 50, 505 -65`,
          `M ${width - 420} -65 C ${width - 230} 50, ${width - 30} 25, ${width + 60} -35`,
          `M -55 ${height + 35} C 110 ${height - 25}, 335 ${height - 50}, 505 ${height + 65}`,
          `M ${width - 420} ${height + 65} C ${width - 230} ${height - 50}, ${width - 30} ${height - 25}, ${width + 60} ${height + 35}`
        ].map((path) => <path key={path} d={path} fill="none" stroke={goldShade} strokeWidth="11" strokeLinecap="round" strokeDasharray="0 24" opacity="0.8" />)}
        {[0.24, 0.55, 0.78].map((position, index) => (
          <g key={position} transform={`translate(${index % 2 ? width - 34 : 34} ${height * position})`} opacity="0.65">
            <path d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z" fill={gold} />
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}

function EventCard({ event, format, logo, flyer }: { event: CommunityEvent; format: CardFormat; logo: string; flyer: Flyer | null }) {
  const preview = format === "preview";
  const story = format === "story";
  const square = format === "square";
  const { width, height } = EVENT_CARD_SIZES[format];
  const landscapeFlyer = flyer ? flyer.width / flyer.height >= 1.25 : false;
  const sideBySide = Boolean(flyer) && (preview || (!story && !landscapeFlyer));
  const logoSize = preview ? 62 : story ? 90 : square ? 76 : 82;
  const imageWidth = preview ? (landscapeFlyer ? 510 : 310) : square ? 410 : 500;
  const imageHeight = preview ? 365 : square ? 650 : 850;

  return (
    <CardFrame width={width} height={height}>
      <div style={{ ...flex, position: "absolute", top: story ? 230 : preview ? 40 : square ? 64 : 68, right: story ? 82 : preview ? 56 : square ? 64 : 68, bottom: story ? 245 : preview ? 36 : square ? 58 : 64, left: story ? 82 : preview ? 56 : square ? 64 : 68, flexDirection: "column" }}>
        <div style={{ ...flex, alignItems: "center", flexShrink: 0 }}>
          <div style={{ ...flex, width: logoSize, height: logoSize, border: `2px solid ${goldShade}`, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={logoSize} height={logoSize} alt="Mardi Gras - Mobile, Alabama" style={{ objectFit: "contain" }} />
          </div>
          <div style={{ ...flex, flexDirection: "column", marginLeft: preview ? 18 : 24 }}>
            <div style={{ ...flex, fontSize: preview ? 25 : story ? 36 : 31, fontWeight: 700, WebkitTextStroke: `0.5px ${cream}` }}>MOBILE MARDI GRAS</div>
            <div style={{ ...flex, marginTop: 7, fontSize: preview ? 17 : story ? 23 : 20, letterSpacing: 3, color: gold }}>COMMUNITY EVENTS</div>
          </div>
        </div>
        <div style={{ ...flex, flex: 1, minHeight: 0, width: "100%", marginTop: preview ? 24 : 28, marginBottom: preview ? 20 : 26, alignItems: "center", justifyContent: "center", flexDirection: sideBySide ? "row" : "column", gap: sideBySide ? 30 : story ? 30 : 24 }}>
          {flyer && <FlyerArtwork flyer={flyer} width={sideBySide ? imageWidth : story ? 916 : square ? 952 : 944} height={sideBySide ? imageHeight : landscapeFlyer ? (square ? 300 : story ? 360 : 350) : 680} />}
          <EventDetails event={event} format={format} withFlyer={Boolean(flyer)} sideBySide={sideBySide} landscapeFlyer={landscapeFlyer} />
        </div>
        <div style={{ ...flex, width: "100%", alignItems: "center", justifyContent: "space-between", flexShrink: 0, paddingTop: preview ? 14 : 20, borderTop: "1px solid rgba(255,201,40,0.35)" }}>
          <div style={{ ...flex, fontSize: preview ? 48 : story ? 76 : square ? 60 : 68, fontWeight: 700, lineHeight: 1, letterSpacing: -2, color: gold, WebkitTextStroke: `0.8px ${gold}` }}>MG251.xyz</div>
          <div style={{ ...flex, flexDirection: "column", alignItems: "flex-end", textAlign: "right", fontSize: preview ? 18 : story ? 25 : 23, lineHeight: 1.4, color: goldSoft }}>
            <div style={flex}>Event details</div>
            <div style={flex}>Community calendar</div>
          </div>
        </div>
      </div>
    </CardFrame>
  );
}

function FlyerArtwork({ flyer, width, height }: { flyer: Flyer; width: number; height: number }) {
  const scale = Math.min((width - 20) / flyer.width, (height - 20) / flyer.height);
  const imageWidth = Math.round(flyer.width * scale);
  const imageHeight = Math.round(flyer.height * scale);
  return (
    <div style={{ ...flex, width, height, alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${goldShade}`, borderRadius: 18, background: purpleDeep }}>
      {/* Keep the original image bytes and full artwork; never crop or overlay it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flyer.data} width={imageWidth} height={imageHeight} alt="Event flyer" style={{ objectFit: "contain" }} />
    </div>
  );
}

function EventDetails({ event, format, withFlyer, sideBySide, landscapeFlyer }: { event: CommunityEvent; format: CardFormat; withFlyer: boolean; sideBySide: boolean; landscapeFlyer: boolean }) {
  const preview = format === "preview";
  const story = format === "story";
  const square = format === "square";
  const centered = !sideBySide;
  const titleSize = withFlyer
    ? preview ? (landscapeFlyer ? (event.title.length > 40 ? 38 : 44) : 50) : sideBySide ? (square ? 50 : 56) : story ? (landscapeFlyer ? 74 : 64) : square ? 48 : 60
    : preview ? (event.title.length > 28 ? 56 : 72) : story ? 102 : square ? 82 : 94;
  const bodySize = withFlyer ? (preview ? 27 : story ? 34 : 30) : preview ? 31 : story ? 46 : square ? 37 : 42;
  const dateLines = formatCommunityEventShareDate(event).split(" • ");
  const venue = event.locationLabel || event.venueName || event.cityStateZip;
  const address = !event.locationLabel && !withFlyer ? [event.venueAddress, event.cityStateZip].filter(Boolean).join(", ") : "";

  return (
    <div style={{ ...flex, ...(sideBySide ? { flex: 1 } : { width: "100%" }), minWidth: 0, flexDirection: "column", alignItems: centered ? "center" : "flex-start", textAlign: centered ? "center" : "left" }}>
      {!withFlyer && <div style={{ ...flex, maxWidth: "100%", marginBottom: preview ? 14 : 24, fontSize: preview ? 19 : 25, letterSpacing: 2, color: gold }}>{event.eventType}</div>}
      <div style={{ ...flex, width: "100%", justifyContent: centered ? "center" : "flex-start", fontSize: titleSize, fontWeight: 700, lineHeight: 1.07, letterSpacing: titleSize > 70 ? -2.5 : -1.5, WebkitTextStroke: `${withFlyer ? 0.7 : 1.2}px ${cream}` }}>{event.title}</div>
      <div style={{ ...flex, maxWidth: "100%", marginTop: preview ? 14 : 18, fontSize: withFlyer ? (preview ? 25 : 28) : preview ? 27 : story ? 37 : 32, lineHeight: 1.25, color: goldSoft }}>Hosted by {event.organization}</div>
      <div style={{ ...flex, width: "100%", flexDirection: "column", alignItems: centered ? "center" : "flex-start", marginTop: preview ? 20 : 24, fontSize: bodySize, fontWeight: 700, lineHeight: 1.28, color: gold }}>
        {dateLines.map((line, index) => <div key={index} style={{ ...flex, maxWidth: "100%", justifyContent: centered ? "center" : "flex-start" }}>{line}</div>)}
      </div>
      {venue && <div style={{ ...flex, maxWidth: "100%", marginTop: preview ? 16 : 20, fontSize: bodySize, lineHeight: 1.25, color: cream }}>{venue}</div>}
      {address && <div style={{ ...flex, maxWidth: "100%", marginTop: 10, fontSize: preview ? 23 : story ? 30 : 27, lineHeight: 1.3, color: goldSoft }}>{address}</div>}
    </div>
  );
}
