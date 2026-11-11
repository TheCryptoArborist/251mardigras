import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Mardi Gras Profile Studio — custom frames and 59 society logos at MG251.xyz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProfileStudioShareImage() {
  const logo = await readFile(join(process.cwd(), "public/images/mardi-gras-mobile-logo.png"));
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", padding: "64px", color: "#fff9ed", background: "linear-gradient(120deg, #190b29, #3c1856)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", position: "absolute", top: 20, right: 20, bottom: 20, left: 20, border: "2px solid #e8c364", borderRadius: 26 }} />
      <div style={{ display: "flex", flexDirection: "column", width: 720 }}>
        <div style={{ color: "#e8c364", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>MADE FOR MOBILE • MG251.XYZ</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}><span>Mardi Gras</span><span style={{ color: "#f1d77b" }}>Profile Studio</span></div>
        <div style={{ marginTop: 25, fontSize: 27, color: "#eee2f6" }}>Your photo. Your society. Your Mardi Gras.</div>
        <div style={{ marginTop: 15, fontSize: 23, color: "#d9c9e7" }}>Custom frames • 59 society logos</div>
        <div style={{ display: "flex", alignSelf: "flex-start", marginTop: 30, padding: "13px 23px", background: "#e8c364", color: "#251034", borderRadius: 30, fontSize: 22, fontWeight: 700 }}>Create your profile picture — free</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 320, height: 320, border: "7px solid #e8c364", borderRadius: 999, background: "#2a113f", padding: 15 }}>
        <img src={`data:image/png;base64,${logo.toString("base64")}`} width={280} height={280} alt="" style={{ objectFit: "contain" }} />
      </div>
    </div>, size
  );
}
