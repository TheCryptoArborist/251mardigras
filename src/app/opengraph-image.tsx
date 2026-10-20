import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "MG251 — Mobile Mardi Gras 2027 visitor guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function HomeOpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/mardi-gras-mobile-logo.png"));

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", padding: "64px 66px", position: "relative", color: "white", background: "linear-gradient(135deg, #17042f, #34125f 70%, #561d75)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", top: 20, right: 20, bottom: 20, left: 20, display: "flex", border: "2px solid #d69b16", borderRadius: 28 }} />
      <div style={{ display: "flex", flexDirection: "column", width: 710 }}>
        <div style={{ color: "#ffc928", fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>MG251.XYZ • MOBILE, ALABAMA</div>
        <div style={{ marginTop: 25, fontSize: 83, lineHeight: 1.03, fontWeight: 900, letterSpacing: -3 }}>Mobile Mardi Gras</div>
        <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.4, color: "#f1e8ff" }}>Parades • Events • Route Maps</div>
        <div style={{ marginTop: 6, fontSize: 28, color: "#f1e8ff" }}>Live Coverage • Local Tips</div>
        <div style={{ marginTop: 32, alignSelf: "flex-start", display: "flex", padding: "13px 24px", borderRadius: 999, background: "#ffc928", color: "#21083f", fontSize: 23, fontWeight: 800 }}>Your guide to the 2027 season</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 320, height: 320, border: "4px solid #ffc928", borderRadius: 999, background: "#21083f" }}>
        {/* Original MG251 artwork, embedded locally so sharing never depends on another request. */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width="302" height="302" style={{ objectFit: "contain" }} />
      </div>
    </div>,
    size
  );
}
