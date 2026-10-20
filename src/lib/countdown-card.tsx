import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { TARGET_EVENT_NAME, type CardFormat, type CountdownSnapshot } from "@/lib/countdown-share";

export const COUNTDOWN_CARD_SIZES: Record<CardFormat, { width: number; height: number }> = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
  preview: { width: 1200, height: 630 }
};

const gold = "#ffd45a";
const cream = "#fff5d4";
const lavender = "#e6d5f4";
const green = "#55b891";
const flex: CSSProperties = { display: "flex" };
let logoDataPromise: Promise<string> | undefined;

function getOriginalLogo() {
  logoDataPromise ??= readFile(join(process.cwd(), "public/images/mardi-gras-mobile-logo.png"))
    .then((buffer) => `data:image/png;base64,${buffer.toString("base64")}`)
    .catch((error) => { logoDataPromise = undefined; throw error; });
  return logoDataPromise;
}

export async function renderCountdownCard(snapshot: CountdownSnapshot, format: CardFormat, headers?: HeadersInit) {
  const logo = await getOriginalLogo();
  const size = COUNTDOWN_CARD_SIZES[format];

  return new ImageResponse(
    <div style={{ ...flex, width: "100%", height: "100%", position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #1b0732 0%, #3d105f 55%, #622285 100%)", color: cream, fontFamily: "sans-serif" }}>
      <CardDecorations width={size.width} height={size.height} />
      {format === "preview"
        ? <PreviewCard snapshot={snapshot} logo={logo} />
        : <PortraitCard snapshot={snapshot} logo={logo} story={format === "story"} />}
    </div>,
    { ...size, headers }
  );
}

function CardDecorations({ width, height }: { width: number; height: number }) {
  return (
    <>
      <div style={{ ...flex, position: "absolute", top: 24, left: 24, width: width - 48, height: height - 48, border: "3px solid rgba(255,212,90,0.7)", borderRadius: 36 }} />
      <div style={{ ...flex, position: "absolute", top: -130, left: width - 330, width: 460, height: 460, borderRadius: 999, background: "rgba(255,212,90,0.06)", border: "35px solid rgba(255,212,90,0.08)" }} />
      <div style={{ ...flex, position: "absolute", top: height - 290, left: -155, width: 440, height: 440, borderRadius: 999, border: "32px solid rgba(85,184,145,0.13)" }} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <div key={index} style={{ ...flex, position: "absolute", left: index % 2 === 0 ? 43 + (index % 3) * 11 : width - 62 - (index % 3) * 9, top: 110 + index * ((height - 240) / 8), width: index % 3 === 0 ? 10 : 7, height: index % 3 === 0 ? 10 : 24, borderRadius: index % 3 === 0 ? 99 : 2, background: index % 2 === 0 ? gold : green, opacity: 0.48, transform: `rotate(${index * 31}deg)` }} />
      ))}
    </>
  );
}

function OriginalLogo({ logo, size }: { logo: string; size: number }) {
  return (
    <div style={{ ...flex, width: size, height: size, flexShrink: 0, borderRadius: 24, overflow: "hidden", border: "2px solid rgba(255,212,90,0.75)" }}>
      {/* ImageResponse embeds the unchanged local artwork in the exported PNG. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={size} height={size} alt="Mardi Gras - Mobile, Alabama" style={{ objectFit: "contain" }} />
    </div>
  );
}

function CountdownNumber({ snapshot, preview = false, story = false }: { snapshot: CountdownSnapshot; preview?: boolean; story?: boolean }) {
  if (snapshot.expired) {
    return (
      <div style={{ ...flex, flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", textAlign: "center" }}>
        <div style={{ ...flex, fontSize: preview ? 60 : story ? 110 : 98, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, color: gold }}>Make your parade plans</div>
        <div style={{ ...flex, marginTop: 22, fontSize: preview ? 20 : 29, color: lavender }}>Check the latest schedule</div>
      </div>
    );
  }

  return (
    <div style={{ ...flex, flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div style={{ ...flex, fontSize: preview ? 186 : story ? 300 : 270, fontWeight: 700, lineHeight: 0.94, letterSpacing: preview ? -9 : -14, color: gold }}>{snapshot.days === 0 ? "<1" : String(snapshot.days)}</div>
      <div style={{ ...flex, marginTop: preview ? 10 : 20, fontSize: preview ? 34 : story ? 58 : 52, fontWeight: 700, letterSpacing: preview ? 4 : 7, color: cream }}>{snapshot.days <= 1 ? "DAY TO GO" : "DAYS TO GO"}</div>
    </div>
  );
}

function PortraitCard({ snapshot, logo, story }: { snapshot: CountdownSnapshot; logo: string; story: boolean }) {
  return (
    <div style={{ ...flex, position: "absolute", top: story ? 230 : 76, right: 76, bottom: story ? 250 : 66, left: 76, flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...flex, width: "100%", alignItems: "center", justifyContent: "center" }}>
        <OriginalLogo logo={logo} size={story ? 160 : 142} />
        <div style={{ ...flex, marginLeft: 28, flexDirection: "column" }}>
          <div style={{ ...flex, color: gold, fontSize: story ? 28 : 26, fontWeight: 700, letterSpacing: 4 }}>MOBILE, ALABAMA</div>
          <div style={{ ...flex, marginTop: 10, color: cream, fontSize: story ? 48 : 44, fontWeight: 700, letterSpacing: -1 }}>Mardi Gras 2027</div>
        </div>
      </div>
      <div style={{ ...flex, marginTop: story ? 62 : 46, color: gold, fontSize: story ? 34 : 30, fontWeight: 700, letterSpacing: 4, textAlign: "center" }}>FIRST DOWNTOWN PARADE</div>
      <div style={{ ...flex, width: "100%", height: story ? 390 : 344, marginTop: 14, flexShrink: 0 }}>
        <CountdownNumber snapshot={snapshot} story={story} />
      </div>
      <div style={{ ...flex, width: 90, height: 6, marginTop: story ? 35 : 26, background: green, borderRadius: 3 }} />
      <div style={{ ...flex, flexDirection: "column", alignItems: "center", marginTop: story ? 34 : 28, textAlign: "center" }}>
        <div style={{ ...flex, fontSize: story ? 70 : 62, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>{TARGET_EVENT_NAME}</div>
        <div style={{ ...flex, marginTop: 18, fontSize: story ? 42 : 38, fontWeight: 700, color: gold }}>January 22, 2027</div>
        <div style={{ ...flex, marginTop: 10, fontSize: story ? 36 : 32, color: lavender }}>6:30 PM CT</div>
        {snapshot.expired ? <div style={{ ...flex, marginTop: 14, fontSize: 23, color: lavender }}>The scheduled start has passed.</div> : null}
      </div>
      <div style={{ ...flex, width: "100%", marginTop: "auto", paddingTop: 26, flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ ...flex, fontSize: story ? 94 : 84, fontWeight: 700, lineHeight: 1, letterSpacing: -3, color: gold }}>MG251.xyz</div>
        <div style={{ ...flex, marginTop: 18, fontSize: story ? 30 : 28, fontWeight: 700, color: cream }}>Parade schedule • Route maps • Live coverage</div>
        <div style={{ ...flex, marginTop: 28, fontSize: story ? 21 : 20, color: lavender }}>Countdown as of {snapshot.dateLabel}</div>
      </div>
    </div>
  );
}

function PreviewCard({ snapshot, logo }: { snapshot: CountdownSnapshot; logo: string }) {
  return (
    <div style={{ ...flex, position: "absolute", top: 52, right: 64, bottom: 48, left: 64, flexDirection: "column" }}>
      <div style={{ ...flex, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ ...flex, alignItems: "center" }}>
          <OriginalLogo logo={logo} size={94} />
          <div style={{ ...flex, marginLeft: 22, flexDirection: "column" }}>
            <div style={{ ...flex, fontSize: 20, color: gold, fontWeight: 700, letterSpacing: 3 }}>MOBILE, ALABAMA</div>
            <div style={{ ...flex, marginTop: 8, fontSize: 34, color: cream, fontWeight: 700 }}>Mardi Gras 2027</div>
          </div>
        </div>
        <div style={{ ...flex, maxWidth: 285, flexDirection: "column", alignItems: "flex-end", textAlign: "right", color: lavender }}>
          <div style={{ ...flex, fontSize: 15, letterSpacing: 2 }}>COUNTDOWN AS OF</div>
          <div style={{ ...flex, marginTop: 7, fontSize: 18 }}>{snapshot.dateLabel}</div>
        </div>
      </div>
      <div style={{ ...flex, flex: 1, alignItems: "center", gap: 40, paddingTop: 12, paddingBottom: 14 }}>
        <div style={{ ...flex, width: 415, height: 255, flexShrink: 0 }}><CountdownNumber snapshot={snapshot} preview /></div>
        <div style={{ ...flex, width: 6, height: 190, borderRadius: 3, background: green }} />
        <div style={{ ...flex, flex: 1, flexDirection: "column" }}>
          <div style={{ ...flex, fontSize: 22, color: gold, fontWeight: 700, letterSpacing: 2 }}>FIRST DOWNTOWN PARADE</div>
          <div style={{ ...flex, marginTop: 18, fontSize: 49, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>{TARGET_EVENT_NAME}</div>
          <div style={{ ...flex, marginTop: 18, fontSize: 32, fontWeight: 700, color: gold }}>January 22, 2027</div>
          <div style={{ ...flex, marginTop: 8, fontSize: 27, color: lavender }}>6:30 PM CT</div>
          {snapshot.expired ? <div style={{ ...flex, marginTop: 12, fontSize: 18, color: lavender }}>The scheduled start has passed.</div> : null}
        </div>
      </div>
      <div style={{ ...flex, alignItems: "center", justifyContent: "space-between", paddingTop: 18, borderTop: "2px solid rgba(255,212,90,0.3)" }}>
        <div style={{ ...flex, fontSize: 57, fontWeight: 700, lineHeight: 1, color: gold, letterSpacing: -2 }}>MG251.xyz</div>
        <div style={{ ...flex, maxWidth: 610, fontSize: 23, fontWeight: 700, color: cream }}>Parade schedule • Route maps • Live coverage</div>
      </div>
    </div>
  );
}
