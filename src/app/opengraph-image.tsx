import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { posterSvg } from "@/components/system/poster-geometry";
import { logoSvg } from "@/components/ui/logo-paths";
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
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg()).toString("base64")}`;

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            alignSelf: "flex-start",
            padding: "12px 26px 12px 18px",
            borderRadius: 999,
            backgroundColor: "#f6f4ef",
            color: "#0a0a0b",
          }}
        >
          <img src={logo} alt="" width={34} height={45} />
          <span style={{ fontSize: 30, letterSpacing: "-0.035em" }}>Businessister</span>
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
            <span>{fr("Intégrez l'IA à votre entreprise.")}</span>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span>Faites</span>
              <span
                style={{
                  marginLeft: 18,
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: 76,
                  letterSpacing: "-0.01em",
                  color: "#f3a9b2",
                }}
              >
                bien plus
              </span>
              <span>.</span>
            </div>
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
              border: "1px solid rgba(255,255,255,0.22)",
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#84e4d9" }} />
            {fr("Audit gratuit et sans engagement")}
          </div>
          <span style={{ fontSize: 24, color: "#8b91a1" }}>businessister.com</span>
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
