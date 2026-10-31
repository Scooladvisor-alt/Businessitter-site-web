import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { posterSvg } from "@/components/system/poster-geometry";
import { fr } from "@/lib/typography";

export const alt = fr(
  "Businessister — Intégration d'intelligence artificielle sur mesure pour les entreprises",
);
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDir = join(process.cwd(), "assets/fonts");
const interTight = readFileSync(join(fontsDir, "InterTight-Medium.ttf"));
const instrumentSerif = readFileSync(join(fontsDir, "InstrumentSerif-Italic.ttf"));

export default function OpengraphImage() {
  const network = `data:image/svg+xml;base64,${Buffer.from(posterSvg("order", 0.9)).toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#05060a",
        backgroundImage:
          "radial-gradient(circle at 12% 0%, rgba(255,200,143,0.22), transparent 45%), radial-gradient(circle at 92% 100%, rgba(134,230,218,0.18), transparent 50%)",
        color: "#f4f1ea",
        fontFamily: "Inter Tight",
        padding: "64px 72px",
      }}
    >
      <img
        src={network}
        alt=""
        width={620}
        height={500}
        style={{ position: "absolute", right: -90, top: 60, opacity: 0.55 }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="m" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffc88f" />
                <stop offset="0.55" stopColor="#f3a9b2" />
                <stop offset="1" stopColor="#86e6da" />
              </linearGradient>
            </defs>
            <rect x="4" y="3" width="4.6" height="26" rx="2.3" fill="#f4f1ea" />
            <circle cx="16.2" cy="19.6" r="7.1" fill="none" stroke="#f4f1ea" strokeWidth="4.6" />
            <circle cx="25.7" cy="6.5" r="3.3" fill="url(#m)" />
          </svg>
          <span style={{ fontSize: 34, letterSpacing: "-0.035em" }}>Businessister</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
            }}
          >
            <span>{fr("L'intelligence artificielle,")}</span>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span
                style={{
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: 74,
                  letterSpacing: "-0.01em",
                  color: "#86e6da",
                }}
              >
                {fr("pensée")}
              </span>
              <span style={{ marginLeft: 18 }}>{fr("pour votre entreprise.")}</span>
            </div>
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#aab0bd", lineHeight: 1.4 }}>
            {fr("Agents IA · Automatisation des processus · Outils sur mesure")}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 24,
              padding: "12px 22px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#84e4d9" }} />
            {fr("Audit gratuit et sans engagement")}
          </div>
          <span style={{ fontSize: 22, letterSpacing: "0.16em", color: "#8b91a1" }}>
            BUSINESSISTER.COM
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter Tight", data: interTight, style: "normal", weight: 500 },
        { name: "Instrument Serif", data: instrumentSerif, style: "italic", weight: 400 },
      ],
    },
  );
}
