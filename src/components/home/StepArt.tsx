/**
 * Petites illustrations des quatre étapes (SVG + animations CSS déclenchées
 * lorsque l'étape est atteinte — voir `.step-art` dans globals.css).
 */

const S = { warm: "#ffbf80", lilac: "#bab5f2", cool: "#84e4d9", line: "rgb(255 255 255 / 0.22)" };

function Understand() {
  return (
    <>
      <rect
        className="sa-pop"
        x="5"
        y="11"
        width="29"
        height="16"
        rx="8"
        fill="none"
        stroke={S.warm}
        strokeWidth="1.6"
      />
      <rect
        className="sa-pop"
        style={{ "--d": "0.35s" } as React.CSSProperties}
        x="22"
        y="29"
        width="29"
        height="16"
        rx="8"
        fill="none"
        stroke={S.cool}
        strokeWidth="1.6"
      />
      {[31, 36.5, 42].map((cx, i) => (
        <circle
          key={cx}
          className="sa-blink"
          style={{ "--d": `${0.8 + i * 0.18}s` } as React.CSSProperties}
          cx={cx}
          cy="37"
          r="1.7"
          fill={S.cool}
        />
      ))}
    </>
  );
}

function Identify() {
  const nodes = [8, 18, 28, 38, 48];
  return (
    <>
      <line x1="8" y1="28" x2="48" y2="28" stroke={S.line} strokeWidth="1.4" />
      {nodes.map((cx, i) => (
        <circle
          key={cx}
          className={i === 1 || i === 2 ? "sa-mark" : undefined}
          style={{ "--d": `${0.45 + i * 0.22}s` } as React.CSSProperties}
          cx={cx}
          cy="28"
          r="3.2"
          fill="#3a4151"
        />
      ))}
      <circle
        className="sa-scan"
        cx="8"
        cy="28"
        r="7.5"
        fill="none"
        stroke={S.lilac}
        strokeWidth="1.4"
      />
    </>
  );
}

function Recommend() {
  return (
    <>
      <rect
        x="13"
        y="7"
        width="29"
        height="40"
        rx="5"
        fill="none"
        stroke="rgb(255 255 255 / 0.35)"
        strokeWidth="1.6"
      />
      {[
        [19, 17, 36],
        [19, 23.5, 32],
        [19, 30, 34],
      ].map(([x1, y, x2], i) => (
        <line
          key={y}
          className="sa-draw"
          style={{ "--d": `${0.15 + i * 0.22}s` } as React.CSSProperties}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke={S.lilac}
          strokeWidth="1.8"
          strokeLinecap="round"
          pathLength={1}
        />
      ))}
      <g className="sa-pop" style={{ "--d": "0.9s" } as React.CSSProperties}>
        <circle cx="41" cy="42" r="7.5" fill={S.cool} />
        <path
          d="M37.6 42.2l2.3 2.3 4.4-4.6"
          fill="none"
          stroke="#05060a"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  );
}

function Build() {
  const blocks = [
    { y: 35, color: S.warm },
    { y: 24, color: S.lilac },
    { y: 13, color: S.cool },
  ];
  return (
    <>
      {blocks.map((block, i) => (
        <rect
          key={block.y}
          className="sa-drop"
          style={{ "--d": `${0.1 + i * 0.28}s` } as React.CSSProperties}
          x="13"
          y={block.y}
          width="30"
          height="9"
          rx="3"
          fill="none"
          stroke={block.color}
          strokeWidth="1.6"
        />
      ))}
    </>
  );
}

const ARTS = [Understand, Identify, Recommend, Build];

export function StepArt({ index }: { index: number }) {
  const Art = ARTS[index] ?? Understand;
  return (
    <svg viewBox="0 0 56 56" className="step-art size-12" aria-hidden="true" focusable="false">
      <Art />
    </svg>
  );
}
