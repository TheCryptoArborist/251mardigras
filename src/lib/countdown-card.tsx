import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties } from "react";
import { COUNTDOWN_CARD_SIZES, TARGET_EVENT_NAME, TARGET_FULL_DATE_LABEL, formatCountdownRemaining, type CardFormat, type CountdownSnapshot } from "@/lib/countdown-share";

const purple = "#34125f";
const purpleDark = "#21083f";
const purpleDeep = "#17042f";
const gold = "#ffc928";
const goldShade = "#d69b16";
const cream = "#fffaf0";
const goldSoft = "#fff4cf";
const flex: CSSProperties = { display: "flex" };
const [targetDateLabel, targetTimeLabel] = TARGET_FULL_DATE_LABEL.split(" • ");
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
    <div style={{ ...flex, width: "100%", height: "100%", position: "relative", overflow: "hidden", background: `linear-gradient(145deg, ${purpleDeep} 0%, ${purple} 52%, ${purpleDark} 100%)`, color: cream, fontFamily: "sans-serif" }}>
      <CardDecorations width={size.width} height={size.height} />
      {format === "preview"
        ? <PreviewCard snapshot={snapshot} logo={logo} />
        : <PortraitCard snapshot={snapshot} logo={logo} format={format} />}
    </div>,
    { ...size, headers }
  );
}

function CardDecorations({ width, height }: { width: number; height: number }) {
  const beadPaths = width > height ? [
    `M -55 -35 C 110 25, 335 50, 505 -65`,
    `M ${width - 420} -65 C ${width - 230} 50, ${width - 30} 25, ${width + 60} -35`,
    `M -55 ${height + 35} C 110 ${height - 25}, 335 ${height - 50}, 505 ${height + 65}`,
    `M ${width - 420} ${height + 65} C ${width - 230} ${height - 50}, ${width - 30} ${height - 25}, ${width + 60} ${height + 35}`
  ] : [
    `M -55 0 C 110 130, 335 135, 505 -65`,
    `M ${width - 420} -65 C ${width - 230} 150, ${width - 30} 145, ${width + 60} -5`,
    `M -65 ${height - 130} C 80 ${height + 15}, 260 ${height + 20}, 400 ${height + 50}`,
    `M ${width - 430} ${height + 55} C ${width - 230} ${height - 100}, ${width - 35} ${height - 95}, ${width + 65} ${height - 10}`
  ];
  const confetti = [
    [0.035, 0.18, 24], [0.965, 0.22, -32], [0.055, 0.34, -24], [0.945, 0.39, 36],
    [0.035, 0.56, 34], [0.965, 0.62, -22], [0.060, 0.77, -34], [0.940, 0.82, 24],
    [0.235, 0.035, 28], [0.735, 0.030, -30], [0.165, 0.960, -28], [0.660, 0.965, 32]
  ];

  return (
    <>
      <div style={{ ...flex, position: "absolute", top: 20, left: 20, width: width - 40, height: height - 40, border: "1px solid rgba(255,201,40,0.28)", borderRadius: 34 }} />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="bead-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={goldSoft} />
            <stop offset="45%" stopColor={gold} />
            <stop offset="100%" stopColor={goldShade} />
          </linearGradient>
        </defs>
        {beadPaths.map((path, index) => (
          <g key={path} opacity={index < 2 ? 0.8 : 0.65}>
            <path d={path} fill="none" stroke={goldShade} strokeWidth="2" />
            <path d={path} fill="none" stroke="url(#bead-gold)" strokeWidth={index % 2 === 0 ? 14 : 11} strokeDasharray={index % 2 === 0 ? "0 24" : "0 20"} strokeLinecap="round" />
          </g>
        ))}
        {confetti.map(([x, y, rotation], index) => (
          <g key={index} transform={`translate(${width * x} ${height * y}) rotate(${rotation})`} opacity={index % 3 === 0 ? 0.9 : 0.65}>
            {index % 3 === 0
              ? <path d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" fill={gold} />
              : <rect x="-4" y="-12" width="8" height="24" rx="2" fill={index % 3 === 1 ? cream : goldShade} />}
          </g>
        ))}
      </svg>
    </>
  );
}

function OriginalLogo({ logo, size }: { logo: string; size: number }) {
  return (
    <div style={{ ...flex, width: size, height: size, flexShrink: 0, borderRadius: 20, overflow: "hidden", border: `2px solid ${goldShade}` }}>
      {/* ImageResponse embeds the unchanged local artwork in the exported PNG. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={size} height={size} alt="Mardi Gras - Mobile, Alabama" style={{ objectFit: "contain" }} />
    </div>
  );
}

function PosterHeadline({ snapshot, format }: { snapshot: CountdownSnapshot; format: CardFormat }) {
  const wide = format === "preview" || format === "square";
  const story = format === "story";
  const underMinute = !snapshot.expired && snapshot.totalMilliseconds < 60_000;
  const first = snapshot.expired ? "MAKE YOUR" : underMinute ? "IT’S ALMOST" : "THE COUNTDOWN";
  const second = snapshot.expired ? "PARADE PLANS" : underMinute ? "PARADE TIME!" : "IS ON!";

  return (
    <div style={{ ...flex, width: "100%", flexDirection: "column", alignItems: "center", textAlign: "center", fontWeight: 700, lineHeight: 1.02, letterSpacing: wide ? -1.5 : -2 }}>
      {wide ? (
        <div style={{ ...flex, fontSize: format === "preview" ? 54 : 55, color: cream, WebkitTextStroke: `1.5px ${cream}` }}>{first} {second}</div>
      ) : (
        <div style={{ ...flex, width: "100%", flexDirection: "column", alignItems: "center" }}>
          <div style={{ ...flex, fontSize: story ? 70 : 61, color: cream, WebkitTextStroke: `1.5px ${cream}` }}>{first}</div>
          <div style={{ ...flex, marginTop: 5, fontSize: story ? 108 : 92, color: gold, WebkitTextStroke: `2px ${gold}` }}>{second}</div>
        </div>
      )}
    </div>
  );
}

function CountdownNumbers({ snapshot, format }: { snapshot: CountdownSnapshot; format: CardFormat }) {
  const preview = format === "preview";
  const story = format === "story";
  const square = format === "square";
  const underMinute = snapshot.totalMilliseconds < 60_000;

  if (snapshot.expired || underMinute) {
    return (
      <div style={{ ...flex, flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", textAlign: "center" }}>
        <div style={{ ...flex, maxWidth: preview ? 570 : 800, fontSize: preview ? 53 : square ? 65 : story ? 86 : 78, fontWeight: 700, lineHeight: 1.12, letterSpacing: -2, color: gold, WebkitTextStroke: `1.5px ${gold}` }}>{formatCountdownRemaining(snapshot)}</div>
        <div style={{ ...flex, marginTop: preview ? 18 : 24, fontSize: preview ? 21 : square ? 24 : 29, color: goldSoft }}>{snapshot.expired ? "Check the latest parade schedule" : "TO THE SCHEDULED START"}</div>
      </div>
    );
  }

  return (
    <div style={{ ...flex, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <div style={{ ...flex, width: "100%", gap: preview ? 14 : 16 }}>
        {[
          { value: snapshot.days, label: "DAYS" },
          { value: snapshot.hours, label: "HOURS" },
          { value: snapshot.minutes, label: "MINUTES" }
        ].map(({ value, label }) => (
          <div key={label} style={{ ...flex, flex: 1, minWidth: 0, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ ...flex, fontSize: snapshot.days > 99 ? (preview ? 108 : square ? 164 : story ? 160 : 164) : preview ? 142 : square ? 174 : story ? 230 : 204, fontWeight: 700, lineHeight: 1, letterSpacing: preview ? -4 : -7, color: gold, WebkitTextStroke: `${preview ? 2.5 : 3.5}px ${gold}` }}>{label === "DAYS" ? String(value) : String(value).padStart(2, "0")}</div>
            <div style={{ ...flex, marginTop: preview ? 12 : 18, fontSize: preview ? 20 : square ? 25 : 28, fontWeight: 700, letterSpacing: preview ? 2 : 3.5, color: cream, WebkitTextStroke: `0.4px ${cream}` }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortraitCard({ snapshot, logo, format }: { snapshot: CountdownSnapshot; logo: string; format: Exclude<CardFormat, "preview"> }) {
  const story = format === "story";
  const square = format === "square";

  return (
    <div style={{ ...flex, position: "absolute", top: story ? 250 : square ? 104 : 120, right: story ? 96 : square ? 80 : 88, bottom: story ? 270 : square ? 92 : 104, left: story ? 96 : square ? 80 : 88, flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...flex, width: "100%", alignItems: "center", justifyContent: "center" }}>
        <OriginalLogo logo={logo} size={story ? 150 : square ? 92 : 124} />
        <div style={{ ...flex, marginLeft: square ? 22 : 28, flexDirection: "column" }}>
          <div style={{ ...flex, color: goldSoft, fontSize: story ? 28 : square ? 22 : 25, fontWeight: 700, letterSpacing: 4 }}>MOBILE, ALABAMA</div>
          <div style={{ ...flex, marginTop: 9, color: cream, fontSize: story ? 50 : square ? 36 : 42, fontWeight: 700, letterSpacing: -1, WebkitTextStroke: `0.5px ${cream}` }}>Mardi Gras 2027</div>
        </div>
      </div>
      <div style={{ ...flex, width: "100%", marginTop: story ? 60 : square ? 24 : 38 }}><PosterHeadline snapshot={snapshot} format={format} /></div>
      <div style={{ ...flex, width: "100%", height: story ? 306 : square ? 196 : 264, marginTop: story ? 46 : square ? 18 : 28, flexShrink: 0 }}>
        <CountdownNumbers snapshot={snapshot} format={format} />
      </div>
      <div style={{ ...flex, alignItems: "center", gap: 16, marginTop: story ? 20 : square ? 14 : 10, color: goldSoft, fontSize: story ? 27 : square ? 22 : 25, fontWeight: 700, letterSpacing: 2, textAlign: "center" }}>
        <div style={{ ...flex, width: square ? 35 : 45, height: 2, background: goldShade }} />
        <span>FIRST DOWNTOWN PARADE</span>
        <div style={{ ...flex, width: square ? 35 : 45, height: 2, background: goldShade }} />
      </div>
      <div style={{ ...flex, flexDirection: "column", alignItems: "center", marginTop: story ? 42 : square ? 24 : 28, textAlign: "center" }}>
        <div style={{ ...flex, fontSize: story ? 84 : square ? 58 : 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, WebkitTextStroke: `1px ${cream}` }}>{TARGET_EVENT_NAME}</div>
        <div style={{ ...flex, marginTop: story ? 24 : square ? 14 : 16, fontSize: story ? 46 : square ? 34 : 40, fontWeight: 700, color: goldSoft }}>{targetDateLabel}</div>
        <div style={{ ...flex, marginTop: story ? 12 : square ? 8 : 10, fontSize: story ? 40 : square ? 29 : 34, color: cream }}>{targetTimeLabel}</div>
      </div>
      <div style={{ ...flex, width: "100%", marginTop: "auto", paddingTop: story ? 36 : square ? 20 : 24, flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ ...flex, fontSize: story ? 112 : square ? 72 : 90, fontWeight: 700, lineHeight: 1, letterSpacing: -3, color: gold, WebkitTextStroke: `1px ${gold}` }}>MG251.xyz</div>
        <div style={{ ...flex, marginTop: story ? 22 : square ? 14 : 16, fontSize: story ? 30 : square ? 24 : 26, fontWeight: 700, color: cream }}>Parade schedule • Route maps • Live coverage</div>
        <div style={{ ...flex, marginTop: story ? 32 : square ? 20 : 26, fontSize: story ? 22 : square ? 18 : 20, color: goldSoft }}>Countdown as of {snapshot.dateLabel}</div>
      </div>
    </div>
  );
}

function PreviewCard({ snapshot, logo }: { snapshot: CountdownSnapshot; logo: string }) {
  return (
    <div style={{ ...flex, position: "absolute", top: 44, right: 64, bottom: 42, left: 64, flexDirection: "column" }}>
      <div style={{ ...flex, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ ...flex, alignItems: "center" }}>
          <OriginalLogo logo={logo} size={78} />
          <div style={{ ...flex, marginLeft: 22, flexDirection: "column" }}>
            <div style={{ ...flex, fontSize: 19, color: goldSoft, fontWeight: 700, letterSpacing: 3 }}>MOBILE, ALABAMA</div>
            <div style={{ ...flex, marginTop: 8, fontSize: 30, color: cream, fontWeight: 700, WebkitTextStroke: `0.5px ${cream}` }}>Mardi Gras 2027</div>
          </div>
        </div>
        <div style={{ ...flex, maxWidth: 300, flexDirection: "column", alignItems: "flex-end", textAlign: "right", color: goldSoft }}>
          <div style={{ ...flex, fontSize: 15, letterSpacing: 2 }}>COUNTDOWN AS OF</div>
          <div style={{ ...flex, marginTop: 7, fontSize: 18 }}>{snapshot.dateLabel}</div>
        </div>
      </div>
      <div style={{ ...flex, width: "100%", marginTop: 22 }}><PosterHeadline snapshot={snapshot} format="preview" /></div>
      <div style={{ ...flex, alignItems: "center", gap: 30, height: 234, marginTop: 12, flexShrink: 0 }}>
        <div style={{ ...flex, width: 620, height: 215, flexShrink: 0 }}><CountdownNumbers snapshot={snapshot} format="preview" /></div>
        <div style={{ ...flex, flex: 1, flexDirection: "column" }}>
          <div style={{ ...flex, fontSize: 18, color: goldSoft, fontWeight: 700, letterSpacing: 1.5 }}>FIRST DOWNTOWN PARADE</div>
          <div style={{ ...flex, marginTop: 16, fontSize: 46, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5, WebkitTextStroke: `0.7px ${cream}` }}>{TARGET_EVENT_NAME}</div>
          <div style={{ ...flex, marginTop: 16, fontSize: 30, fontWeight: 700, color: goldSoft }}>{targetDateLabel}</div>
          <div style={{ ...flex, marginTop: 8, fontSize: 27, color: cream }}>{targetTimeLabel}</div>
        </div>
      </div>
      <div style={{ ...flex, alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 16, borderTop: "1px solid rgba(255,201,40,0.35)" }}>
        <div style={{ ...flex, fontSize: 54, fontWeight: 700, lineHeight: 1, color: gold, letterSpacing: -2, WebkitTextStroke: `0.8px ${gold}` }}>MG251.xyz</div>
        <div style={{ ...flex, maxWidth: 610, fontSize: 23, fontWeight: 700, color: cream }}>Parade schedule • Route maps • Live coverage</div>
      </div>
    </div>
  );
}
