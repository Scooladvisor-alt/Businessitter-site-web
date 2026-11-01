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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6f4ef",
      }}
    >
      <img src={logo} alt="" width={96} height={128} />
    </div>,
    size,
  );
}
