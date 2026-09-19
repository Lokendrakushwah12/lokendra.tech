import type { ReactNode } from "react";

export const AMBER = "#f59e0b";
export const MUTED = "currentColor";

/** Accent hue per diagram; accents read it via currentColor. */
const TONE = {
  amber: "text-amber-500",
  violet: "text-violet-500",
  rose: "text-rose-500",
} as const;

export type Tone = keyof typeof TONE;

export const Frame = ({
  children,
  label,
  h = 200,
  w = 600,
  tone = "amber",
}: {
  children: ReactNode;
  label: string;
  h?: number;
  w?: number;
  tone?: Tone;
}) => (
  <figure className="not-prose overflow-hidden">
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
      className={`block w-full ${TONE[tone]}`}
    >
      <Defs />
      {children}
    </svg>
  </figure>
);

const Defs = () => (
  <defs>
    <marker
      id="dg-arrow"
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="5"
      markerHeight="5"
      orient="auto-start-reverse"
    >
      <path d="M 0 1 L 8 5 L 0 9" fill="none" strokeWidth={1.5} className="stroke-muted-foreground/60" />
    </marker>
  </defs>
);

/** Boxed step. Pass an icon via `icon`, a title, and an optional sub-label. */
export const Box = ({
  x,
  y,
  w = 116,
  h = 46,
  title,
  sub,
  icon,
  accent = false,
  dim = false,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  icon?: (p: { x: number; y: number; accent?: boolean }) => ReactNode;
  accent?: boolean;
  dim?: boolean;
}) => (
  <g opacity={dim ? 0.45 : 1}>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      className={`fill-background ${accent ? "stroke-current" : "stroke-border"}`}
      strokeOpacity={accent ? 0.4 : 0.6}
      strokeWidth={1}
    />
    {icon?.({ x: x + 11, y: y + h / 2 - 6, accent })}
    <text
      x={icon ? x + 30 : x + 12}
      y={sub ? y + h / 2 - 2 : y + h / 2 + 4}
      className="fill-foreground/80 text-[11px]"
    >
      {title}
    </text>
    {sub && (
      <text x={icon ? x + 30 : x + 12} y={y + h / 2 + 12} className="fill-muted-foreground/70 text-[9px]">
        {sub}
      </text>
    )}
  </g>
);

/** Small pill, for enumerating categories or packages. */
export const Pill = ({
  x,
  y,
  text,
  w = 78,
  accent = false,
}: {
  x: number;
  y: number;
  text: string;
  w?: number;
  accent?: boolean;
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={18}
      rx={4}
      className={accent ? "fill-current stroke-current" : "fill-muted/60 stroke-border"}
      fillOpacity={accent ? 0.15 : 1}
      strokeOpacity={accent ? 0.45 : 1}
      strokeWidth={0.75}
    />
    <text x={x + w / 2} y={y + 12.5} textAnchor="middle" className={`text-[9px] ${accent ? "fill-current" : "fill-muted-foreground/80"}`}>
      {text}
    </text>
  </g>
);

export const Link = ({
  d,
  dashed = false,
  flow = false,
  muted = false,
  arrow = true,
}: {
  d: string;
  dashed?: boolean;
  flow?: boolean;
  muted?: boolean;
  arrow?: boolean;
}) => (
  <path
    d={d}
    fill="none"
    strokeWidth={1.5}
    markerEnd={arrow ? "url(#dg-arrow)" : undefined}
    className={[
      muted ? "stroke-muted-foreground/25" : "stroke-muted-foreground/50",
      dashed ? "[stroke-dasharray:4_4]" : "",
      flow ? "diagram-flow" : "",
    ].join(" ")}
  />
);

export const Caption = ({ x, y, children, accent = false, anchor = "start" }: { x: number; y: number; children: string; accent?: boolean; anchor?: "start" | "middle" | "end" }) => (
  <text x={x} y={y} textAnchor={anchor} className={`text-[9.5px] ${accent ? "fill-current" : "fill-muted-foreground/60"}`}>
    {children}
  </text>
);

/* ---------- icons (16px grid, stroked) ---------- */
const ico = (accent?: boolean) =>
  `fill-none ${accent ? "stroke-current" : "stroke-muted-foreground/70"}`;

export const IcDoc = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <path d="M2 1h6l3 3v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
    <path d="M8 1v3h3M3.5 7h5M3.5 9.5h3.5" />
  </g>
);

export const IcSplit = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <circle cx="2.5" cy="6" r="1.6" /><circle cx="10" cy="2.5" r="1.6" /><circle cx="10" cy="9.5" r="1.6" />
    <path d="M4 5.2 8.5 3M4 6.8 8.5 9" />
  </g>
);

export const IcPackage = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <path d="M6 1 11 3.5v5L6 11 1 8.5v-5L6 1z" /><path d="M1 3.5 6 6l5-2.5M6 6v5" />
  </g>
);

export const IcApp = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <rect x="1" y="2" width="10" height="8" rx="1.2" /><path d="M1 4.5h10M3 3.2h.01M4.6 3.2h.01" />
  </g>
);

export const IcDb = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <ellipse cx="6" cy="3" rx="4.5" ry="1.8" /><path d="M1.5 3v6c0 1 2 1.8 4.5 1.8S10.5 10 10.5 9V3" /><path d="M1.5 6c0 1 2 1.8 4.5 1.8S10.5 7 10.5 6" />
  </g>
);

export const IcCheck = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.4} strokeLinecap="round" transform={`translate(${x},${y})`}>
    <circle cx="6" cy="6" r="5" strokeWidth={1.2} /><path d="m3.6 6.2 1.8 1.8L8.6 4.6" />
  </g>
);

export const IcAlert = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} strokeLinecap="round" transform={`translate(${x},${y})`}>
    <path d="M6 1.4 11.2 10H.8L6 1.4z" /><path d="M6 5v2.4M6 9h.01" />
  </g>
);

export const IcSheet = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <rect x="1" y="1.5" width="10" height="9" rx="1.2" /><path d="M1 4.5h10M4.5 4.5v6M7.5 4.5v6" />
  </g>
);

export const IcTag = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g className={ico(accent)} strokeWidth={1.2} transform={`translate(${x},${y})`}>
    <path d="M1.2 6.2V1.8A.8.8 0 0 1 2 1h4.4l4.4 4.4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4 0L1.2 6.2z" /><path d="M3.6 3.6h.01" />
  </g>
);
