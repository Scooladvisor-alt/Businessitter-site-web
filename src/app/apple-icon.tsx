import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#05060a",
        backgroundImage:
          "radial-gradient(circle at 80% 15%, rgba(255,200,143,0.25), transparent 55%)",
      }}
    >
      <svg width="112" height="112" viewBox="0 0 32 32">
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
    </div>,
    size,
  );
}
