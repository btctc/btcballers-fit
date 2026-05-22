type DiagramKind = "backcut" | "dho" | "hammer" | "spain";

type Props = {
  kind: DiagramKind;
  title: string;
};

const orange = "#F4942A";
const white = "#FFFFFF";
const muted = "#9CA3AF";

const descriptions: Record<DiagramKind, string> = {
  backcut: "The wing cuts behind an overplaying defender while the passer leads them to the rim.",
  dho: "The guard sprints tight to the big for a dribble hand-off, then turns the corner.",
  hammer: "The ball drives baseline while the weakside screen frees the corner shooter for the pass.",
  spain: "The ballhandler uses the screen, the screener rolls, and a second player backscreens the roller's defender.",
};

function Player({
  x,
  y,
  label,
  fill = white,
  opacity = 1,
}: {
  x: number;
  y: number;
  label: string;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <circle cx="0" cy="0" r="13" fill={fill} stroke="#0A0A0A" strokeWidth="2" />
      <text x="0" y="4" textAnchor="middle" className="fill-btc-black font-mono text-[10px] font-bold">
        {label}
      </text>
    </g>
  );
}

function MovingPlayer({
  path,
  label,
  fill = white,
  duration = "4.8s",
}: {
  path: string;
  label: string;
  fill?: string;
  duration?: string;
}) {
  return (
    <g className="animated-layer">
      <animateMotion dur={duration} repeatCount="indefinite" path={path} />
      <Player x={0} y={0} label={label} fill={fill} />
    </g>
  );
}

function Arrow({
  d,
  markerId,
  color = orange,
  className = "motion-route",
}: {
  d: string;
  markerId: string;
  color?: string;
  className?: string;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      markerEnd={`url(#${markerId})`}
      className={className}
    />
  );
}

function Screen({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} className="screen-mark">
      <path d="M-16 0H16" stroke={white} strokeWidth="5" strokeLinecap="round" />
      <path d="M-16 -7H16" stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Court() {
  return (
    <>
      <rect x="1" y="1" width="358" height="238" fill="#0E1015" stroke="rgba(255,255,255,0.14)" />
      <path d="M40 22h280v196H40z" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <path d="M125 22v74h110V22" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <path d="M125 96c22 17 88 17 110 0" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <path d="M104 218c0-44 152-44 152 0" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <path d="M158 35h44" stroke="rgba(255,255,255,0.34)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="180" cy="47" r="13" fill="none" stroke="rgba(244,148,42,0.8)" strokeWidth="3" />
      <circle cx="180" cy="47" r="4" fill="rgba(244,148,42,0.65)" />
    </>
  );
}

function DiagramAction({ kind, arrowId, passArrowId }: { kind: DiagramKind; arrowId: string; passArrowId: string }) {
  if (kind === "backcut") {
    const cutPath = "M250 143 C231 113 207 83 180 57";
    const passPath = "M91 151 C126 120 151 82 180 57";
    return (
      <>
        <Arrow d={cutPath} markerId={arrowId} />
        <Arrow d={passPath} markerId={passArrowId} color={white} className="pass-route" />
        <Player x={88} y={154} label="1" fill={orange} />
        <Player x={250} y={143} label="2" opacity={0.35} />
        <Player x={246} y={112} label="X" fill={muted} />
        <MovingPlayer path={cutPath} label="2" />
        <text x="221" y="86" fill={white} opacity="0.55" className="font-mono text-[10px] uppercase tracking-[0.18em]">back cut</text>
      </>
    );
  }

  if (kind === "dho") {
    const guardPath = "M91 158 C114 130 140 106 171 98 C197 104 218 122 239 145";
    return (
      <>
        <Arrow d={guardPath} markerId={arrowId} />
        <Screen x={173} y={100} rotate={-35} />
        <Player x={173} y={98} label="5" fill={orange} />
        <Player x={91} y={158} label="1" opacity={0.35} />
        <Player x={247} y={168} label="3" opacity={0.75} />
        <MovingPlayer path={guardPath} label="1" />
        <text x="128" y="80" fill={white} opacity="0.55" className="font-mono text-[10px] uppercase tracking-[0.18em]">handoff</text>
      </>
    );
  }

  if (kind === "hammer") {
    const drivePath = "M112 134 C86 153 78 178 80 207";
    const shooterPath = "M252 151 C244 167 240 184 242 205";
    const passPath = "M82 203 C128 181 188 187 241 205";
    return (
      <>
        <Arrow d={drivePath} markerId={arrowId} />
        <Arrow d={shooterPath} markerId={arrowId} color={white} />
        <Arrow d={passPath} markerId={passArrowId} color={white} className="pass-route" />
        <Screen x={226} y={177} rotate={82} />
        <Player x={112} y={134} label="1" fill={orange} opacity={0.35} />
        <Player x={252} y={151} label="2" opacity={0.35} />
        <Player x={226} y={177} label="4" />
        <Player x={70} y={82} label="5" opacity={0.75} />
        <MovingPlayer path={drivePath} label="1" fill={orange} />
        <MovingPlayer path={shooterPath} label="2" />
        <text x="185" y="196" fill={white} opacity="0.55" className="font-mono text-[10px] uppercase tracking-[0.18em]">corner pass</text>
      </>
    );
  }

  const guardPath = "M92 160 C119 132 141 118 160 113 C179 101 196 91 213 78";
  const rollPath = "M161 114 C166 93 174 70 180 50";
  const backscreenPath = "M204 83 C214 92 222 103 229 116";

  return (
    <>
      <Arrow d={guardPath} markerId={arrowId} />
      <Arrow d={rollPath} markerId={arrowId} color={white} />
      <Arrow d={backscreenPath} markerId={arrowId} color={white} />
      <Screen x={158} y={118} rotate={-38} />
      <Screen x={216} y={102} rotate={42} />
      <Player x={92} y={160} label="1" fill={orange} opacity={0.35} />
      <Player x={161} y={114} label="5" opacity={0.35} />
      <Player x={204} y={83} label="2" opacity={0.35} />
      <Player x={229} y={116} label="X" fill={muted} />
      <MovingPlayer path={guardPath} label="1" fill={orange} />
      <MovingPlayer path={rollPath} label="5" />
      <MovingPlayer path={backscreenPath} label="2" />
      <text x="189" y="63" fill={white} opacity="0.55" className="font-mono text-[10px] uppercase tracking-[0.18em]">roll + backscreen</text>
    </>
  );
}

export default function PlayDiagram({ kind, title }: Props) {
  const arrowId = `arrow-${kind}`;
  const passArrowId = `pass-arrow-${kind}`;

  return (
    <svg
      viewBox="0 0 360 240"
      role="img"
      aria-label={`${title} animated diagram. ${descriptions[kind]}`}
      className={`play-diagram h-full w-full play-diagram-${kind}`}
    >
      <defs>
        <marker id={arrowId} markerWidth="9" markerHeight="9" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,7 L7,3.5 z" fill={orange} />
        </marker>
        <marker id={passArrowId} markerWidth="9" markerHeight="9" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,7 L7,3.5 z" fill={white} />
        </marker>
      </defs>

      <Court />
      <DiagramAction kind={kind} arrowId={arrowId} passArrowId={passArrowId} />
    </svg>
  );
}
