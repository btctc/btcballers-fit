type DiagramKind = "backcut" | "dho" | "hammer" | "spain";

type Props = {
  kind: DiagramKind;
  title: string;
};

const orange = "#F4942A";
const white = "#FFFFFF";
const muted = "#9CA3AF";

function Player({ x, y, label, fill = white }: { x: number; y: number; label: string; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="12" fill={fill} stroke="#0A0A0A" strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-btc-black font-mono text-[10px] font-bold">
        {label}
      </text>
    </g>
  );
}

function Arrow({ d, markerId, color = orange }: { d: string; markerId: string; color?: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" markerEnd={`url(#${markerId})`} />;
}

export default function PlayDiagram({ kind, title }: Props) {
  const arrowId = `arrow-${kind}`;

  return (
    <svg viewBox="0 0 320 220" role="img" aria-label={`${title} diagram`} className="h-full w-full">
      <defs>
        <marker id={arrowId} markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L6,3 z" fill={orange} />
        </marker>
      </defs>

      <rect x="1" y="1" width="318" height="218" fill="#0E1015" stroke="rgba(255,255,255,0.14)" />
      <path d="M40 22h240v176H40z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <path d="M105 22v64h110V22" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <path d="M105 86c18 16 92 16 110 0" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <path d="M114 198c0-28 92-28 92 0" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <circle cx="160" cy="58" r="14" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />

      {kind === "backcut" && (
        <>
          <Player x={86} y={128} label="1" fill={orange} />
          <Player x={232} y={126} label="2" />
          <Player x={232} y={96} label="X" fill={muted} />
          <Arrow d="M232 122 C218 102 195 78 162 55" markerId={arrowId} />
          <path d="M90 124 C126 103 158 98 199 104" fill="none" stroke={white} strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
        </>
      )}

      {kind === "dho" && (
        <>
          <Player x={160} y={91} label="5" fill={orange} />
          <Player x={92} y={144} label="1" />
          <Player x={222} y={134} label="3" />
          <Arrow d="M94 140 C113 118 134 103 160 94" markerId={arrowId} />
          <Arrow d="M160 96 C186 105 202 119 220 135" markerId={arrowId} color={white} />
        </>
      )}

      {kind === "hammer" && (
        <>
          <Player x={108} y={128} label="1" fill={orange} />
          <Player x={236} y={166} label="2" />
          <Player x={214} y={130} label="4" />
          <Player x={68} y={74} label="5" />
          <Arrow d="M108 128 C80 142 67 167 71 190" markerId={arrowId} />
          <Arrow d="M214 130 C228 141 236 151 238 164" markerId={arrowId} color={white} />
          <path d="M74 188 C114 173 173 166 224 166" fill="none" stroke={white} strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
        </>
      )}

      {kind === "spain" && (
        <>
          <Player x={106} y={142} label="1" fill={orange} />
          <Player x={155} y={104} label="5" />
          <Player x={186} y={78} label="2" />
          <Player x={210} y={105} label="X" fill={muted} />
          <Arrow d="M106 142 C124 121 136 111 154 104" markerId={arrowId} />
          <Arrow d="M156 104 C159 85 160 68 160 49" markerId={arrowId} />
          <Arrow d="M186 78 C194 88 201 96 209 105" markerId={arrowId} color={white} />
        </>
      )}
    </svg>
  );
}
