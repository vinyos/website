import { ImageResponse } from "next/og";

export const alt = "Vinyos Quote — KI-Kalkulation für CNC-Drehteile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#faf9f5",
          backgroundImage:
            "linear-gradient(to right, rgba(63,125,123,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(63,125,123,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
            <path d="M20 8 V31 M9 31 H31" stroke="#3f7d7b" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <div style={{ display: "flex", fontSize: "40px", color: "#141413", fontWeight: 600 }}>
            vinyos
            <span style={{ color: "#57564f", fontWeight: 400, marginLeft: "10px" }}>quote</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 700,
            color: "#141413",
            letterSpacing: "-2px",
            lineHeight: 1.15,
            marginTop: "48px",
            maxWidth: "950px",
          }}
        >
          Vom Zeichnungssatz zum Angebotspreis — in Minuten.
        </div>
        <div style={{ display: "flex", fontSize: "28px", color: "#57564f", marginTop: "28px" }}>
          KI-Kalkulation für CNC-Drehteile · Hosting in der EU
        </div>
      </div>
    ),
    { ...size }
  );
}
