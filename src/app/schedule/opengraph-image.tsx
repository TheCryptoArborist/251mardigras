import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "2027 Mobile Mardi Gras Parade Schedule on MG251.xyz";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default async function ScheduleOpenGraphImage() {
  const jesterBuffer = await readFile(join(process.cwd(), "public/images/social/schedule-jester.png"));
  const jesterImage = jesterBuffer.buffer.slice(
    jesterBuffer.byteOffset,
    jesterBuffer.byteOffset + jesterBuffer.byteLength
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          padding: "58px 64px",
          color: "white",
          background: "linear-gradient(135deg, #21043d 0%, #3f0a67 58%, #6f1688 100%)",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <div style={{ position: "absolute", top: 18, right: 18, bottom: 18, left: 18, border: "3px solid #f8c93a", borderRadius: 34, display: "flex" }} />
        <div style={{ position: "absolute", width: 420, height: 420, right: -90, top: -120, borderRadius: 999, background: "rgba(248,201,58,0.16)", display: "flex" }} />
        <div style={{ position: "absolute", width: 330, height: 330, left: 250, bottom: -230, borderRadius: 999, background: "rgba(255,255,255,0.08)", display: "flex" }} />

        <div style={{ width: 735, display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", color: "#ffd95c", fontSize: 24, fontWeight: 800, letterSpacing: 5 }}>
            MG251.XYZ • MOBILE, ALABAMA
          </div>
          <div style={{ marginTop: 24, fontSize: 70, lineHeight: 1.02, fontWeight: 900, letterSpacing: -2 }}>
            2027 Mobile Mardi Gras Parade Schedule
          </div>
          <div style={{ marginTop: 24, color: "#f8eefd", fontSize: 30, fontWeight: 700 }}>
            Dates • Start Times • Route Maps
          </div>
          <div style={{ marginTop: 30, alignSelf: "flex-start", display: "flex", padding: "14px 24px", borderRadius: 999, background: "#f8c93a", color: "#2b0645", fontSize: 25, fontWeight: 900 }}>
            January 22 – February 9, 2027
          </div>
        </div>

        <div style={{ width: 330, marginLeft: "auto", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <div style={{ width: 280, height: 280, overflow: "hidden", borderRadius: 999, border: "7px solid #fff2b5", boxShadow: "0 0 0 5px #d69b16, 0 18px 50px rgba(0,0,0,0.38)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img
              src={jesterImage as unknown as string}
              width="298"
              height="298"
              alt=""
              style={{ borderRadius: 999 }}
            />
          </div>
          <div style={{ position: "absolute", right: 0, bottom: 104, width: 112, height: 112, borderRadius: 999, border: "5px solid #fff2b5", background: "#2b0645", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 28px rgba(0,0,0,0.35)" }}>
            <img src="https://mg251.xyz/images/mardi-gras-mobile-logo.png" width="102" height="102" alt="" style={{ borderRadius: 999 }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
