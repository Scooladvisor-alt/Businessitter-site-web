import { ImageResponse } from "next/og";
import { logoSvg } from "@/components/ui/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg()).toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#f6f4ef",
      }}
    >
      {/* Centré sur la lettre « B » (l'étoile déborde en haut à droite). */}
      <img
        src={logo}
        alt=""
        width={119}
        height={158}
        style={{ position: "absolute", left: 45, top: -4 }}
      />
    </div>,
    size,
  );
}
