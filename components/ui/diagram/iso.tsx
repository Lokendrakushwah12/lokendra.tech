"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

/* ---------- isometric projection ---------- */

export const U = 15; // px per world unit
const COS = 0.866;

export type Pt = [number, number, number];
export type Proj = (x: number, y: number, z: number) => [number, number];

export const projector =
  (cx: number, cy: number): Proj =>
  (x, y, z) => [cx + (x - y) * U * COS, cy + (x + y) * U * 0.5 - z * U];

export const path = (p: Proj, pts: Pt[]) =>
  "M" + pts.map((q) => p(...q).map((n) => n.toFixed(1)).join(" ")).join(" L") + " Z";

export type Tint = "idle" | "ok" | "bad" | "dim";

const faceClass = (tint: Tint, top = false) =>
  [
    "stroke-[1.1] [stroke-linejoin:round]",
    tint === "ok"
      ? `stroke-current ${top ? "fill-current/10" : "fill-background"}`
      : tint === "bad"
        ? `stroke-rose-500 ${top ? "fill-rose-500/10" : "fill-background"}`
        : "stroke-foreground/55 fill-background",
  ].join(" ");

/** A box: right face (x max), left face (y max), then the top. */
export const Cuboid = ({
  p,
  at: [x, y, z],
  size: [dx, dy, dz],
  tint = "idle",
  dashed = false,
}: {
  p: Proj;
  at: Pt;
  size: Pt;
  tint?: Tint;
  dashed?: boolean;
}) => (
  <g className={dashed ? "[stroke-dasharray:3_3]" : ""}>
    <path
      d={path(p, [
        [x + dx, y, z + dz],
        [x + dx, y + dy, z + dz],
        [x + dx, y + dy, z],
        [x + dx, y, z],
      ])}
      className={faceClass(tint)}
    />
    <path
      d={path(p, [
        [x, y + dy, z + dz],
        [x + dx, y + dy, z + dz],
        [x + dx, y + dy, z],
        [x, y + dy, z],
      ])}
      className={faceClass(tint)}
    />
    <path
      d={path(p, [
        [x, y, z + dz],
        [x + dx, y, z + dz],
        [x + dx, y + dy, z + dz],
        [x, y + dy, z + dz],
      ])}
      className={faceClass(tint, true)}
    />
  </g>
);

/** Upright cylinder centred on the platform, with optional bands. */
export const Cylinder = ({ p, r, h, z = 0, bands = [], tint = "idle" }: { p: Proj; r: number; h: number; z?: number; bands?: number[]; tint?: Tint }) => {
  const rx = r * U * 1.2247;
  const ry = r * U * 0.7071;
  const [bx, by] = p(0, 0, z);
  const [tx, ty] = p(0, 0, z + h);
  const stroke = tint === "ok" ? "stroke-current" : tint === "bad" ? "stroke-rose-500" : "stroke-foreground/55";
  const topFill = tint === "ok" ? "fill-current/10" : tint === "bad" ? "fill-rose-500/10" : "fill-background";
  return (
    <g className={`stroke-[1.1] ${stroke}`}>
      <path d={`M${tx - rx} ${ty} L${bx - rx} ${by} A${rx} ${ry} 0 0 0 ${bx + rx} ${by} L${tx + rx} ${ty} Z`} className="fill-background" />
      {bands.map((b) => {
        const [cx, cy] = p(0, 0, z + b);
        return <path key={b} d={`M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`} className="fill-none" />;
      })}
      <ellipse cx={tx} cy={ty} rx={rx} ry={ry} className="fill-background" />
      {tint !== "idle" && <ellipse cx={tx} cy={ty} rx={rx} ry={ry} className={topFill} />}
    </g>
  );
};

export const Line = ({ p, a, b, className = "stroke-foreground/55" }: { p: Proj; a: Pt; b: Pt; className?: string }) => {
  const [x1, y1] = p(...a);
  const [x2, y2] = p(...b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={`stroke-[1.1] ${className}`} strokeLinecap="round" />;
};

/** Line colour for detail marks drawn on an object. */
export const mark = (tint: Tint) =>
  tint === "ok" ? "stroke-current" : tint === "bad" ? "stroke-rose-500" : "stroke-foreground/40";

/* ---------- a story: nodes, edges and the scenes that light them ---------- */

export type ObjProps = { p: Proj; tint: Tint; step: number };
export type EdgeState = "idle" | "ok" | "bad" | "taint" | "replay";
export type PillTone = "ok" | "bad" | "muted";

export type IsoNode = {
  x: number;
  y: number;
  title: string;
  sub: string;
  Obj: (p: ObjProps) => ReactNode;
  /** platform side, in world units */
  size?: number;
  /** where its status pill sits, relative to the node centre */
  pill?: [number, number];
};

export type IsoScene<N extends string, E extends string> = {
  label: string;
  caption: string;
  nodes: Partial<Record<N, Tint>>;
  edges: Partial<Record<E, EdgeState>>;
  pills: Partial<Record<N, { text: string; tone: PillTone }>>;
  /** nodes that do not exist yet in this scene */
  dashed?: N[];
};

const STEP_MS = 4800;

const REDUCE = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(REDUCE);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );

const Pill = ({ x, y, text, tone }: { x: number; y: number; text: string; tone: PillTone }) => {
  const w = text.length * 5.1 + 20;
  const dot = tone === "ok" ? "fill-current" : tone === "bad" ? "fill-rose-500" : "fill-muted-foreground";
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - 9}
        width={w}
        height={18}
        rx={9}
        className={`fill-background ${tone === "bad" ? "stroke-rose-500/50" : "stroke-border"}`}
        strokeWidth={0.9}
      />
      <circle cx={x - w / 2 + 9} cy={y} r={2.2} className={dot} />
      <text x={x - w / 2 + 15} y={y + 3.2} className="fill-foreground/75 text-[8.5px]">
        {text}
      </text>
    </g>
  );
};

const edgeClass: Record<EdgeState, string> = {
  ok: "stroke-current/70",
  bad: "stroke-rose-500/70",
  taint: "stroke-rose-500/60 [stroke-dasharray:5_3]",
  replay: "stroke-current/60 [stroke-dasharray:4_4] diagram-flow",
  idle: "stroke-muted-foreground/20 [stroke-dasharray:2_4]",
};

export function IsoStory<N extends string, E extends string>({
  tone,
  h,
  label,
  nodes,
  order,
  edges,
  scenes,
}: {
  /** text colour class; every accent reads it via currentColor */
  tone: string;
  h: number;
  label: string;
  nodes: Record<N, IsoNode>;
  /** paint order, back to front */
  order: N[];
  edges: Record<E, { d: string; stop?: [number, number] }>;
  scenes: IsoScene<N, E>[];
}) {
  const uid = useId().replace(/:/g, "");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const still = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // play only while on screen, and never for reduced motion
  useEffect(() => {
    if (still || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [still]);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % scenes.length), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, scenes.length]);

  const scene = scenes[step];

  return (
    <figure ref={ref} className={`not-prose my-6 ${tone}`}>
      <svg viewBox={`0 0 600 ${h}`} role="img" aria-label={label} className="block w-full">
        {/* edges first, so platforms sit on top of their ends */}
        {(Object.keys(edges) as E[]).map((id) => {
          const state = scene.edges[id] ?? "idle";
          const stop = edges[id].stop;
          return (
            <g key={id}>
              <path
                id={`${uid}-${id}`}
                d={edges[id].d}
                fill="none"
                strokeWidth={1.4}
                className={`${edgeClass[state]} transition-[stroke] duration-500`}
              />
              {(state === "ok" || state === "bad" || state === "taint") && !still && (
                <circle r={2.8} className={state === "ok" ? "fill-current" : "fill-rose-500"}>
                  <animateMotion
                    dur={state === "bad" ? "1.6s" : "1.8s"}
                    repeatCount="indefinite"
                    keyPoints={state === "bad" && stop ? "0;0.78" : "0;1"}
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#${uid}-${id}`} />
                  </animateMotion>
                </circle>
              )}
              {state === "bad" && stop && (
                <g transform={`translate(${stop[0]} ${stop[1]})`}>
                  <circle r={6} className="fill-background stroke-rose-500" strokeWidth={1.2} />
                  <path d="M-2.4 -2.4 L2.4 2.4 M2.4 -2.4 L-2.4 2.4" className="stroke-rose-500" strokeWidth={1.3} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}

        {/* platforms and their objects */}
        {order.map((id) => {
          const n = nodes[id];
          const s = n.size ?? 3;
          const p = projector(n.x, n.y);
          const tint = scene.nodes[id] ?? "idle";
          const labelY = n.y + (s / 2) * U + 21.5;
          return (
            <g key={id} className="transition-opacity duration-500" opacity={tint === "dim" ? 0.38 : 1}>
              <Cuboid
                p={p}
                at={[-s / 2, -s / 2, -0.32]}
                size={[s, s, 0.32]}
                tint={tint === "ok" || tint === "bad" ? tint : "idle"}
                dashed={scene.dashed?.includes(id)}
              />
              <n.Obj p={p} tint={tint === "dim" ? "idle" : tint} step={step} />
              <text x={n.x} y={labelY} textAnchor="middle" className="fill-foreground/80 text-[10.5px]">
                {n.title}
              </text>
              <text x={n.x} y={labelY + 12} textAnchor="middle" className="fill-muted-foreground/70 text-[8.5px]">
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* status pills float above their node */}
        {(Object.keys(scene.pills) as N[]).map((id) => {
          const n = nodes[id];
          const pill = scene.pills[id]!;
          const [dx, dy] = n.pill ?? [0, -((n.size ?? 3) / 2) * U - 17.5];
          return <Pill key={`${step}-${id}`} x={n.x + dx} y={n.y + dy} text={pill.text} tone={pill.tone} />;
        })}
      </svg>

      <p aria-live="polite" className="mt-1 min-h-[2.6em] text-[12px] leading-relaxed text-muted-foreground/80">
        {scene.caption}
      </p>

      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${scenes.length}, minmax(0, 1fr))` }}>
        {scenes.map((sc, i) => (
          <button
            key={sc.label}
            type="button"
            onClick={() => setStep(i)}
            aria-pressed={i === step}
            className="group cursor-pointer text-left"
          >
            <span className="block h-[3px] overflow-hidden rounded-full bg-border">
              <span
                key={i === step ? `${step}-${playing}` : "rest"}
                className="block h-full rounded-full bg-current"
                style={{
                  width: i < step || (i === step && !playing) ? "100%" : i === step ? undefined : "0%",
                  animation: i === step && playing ? `galaxy-fill ${STEP_MS}ms linear forwards` : undefined,
                }}
              />
            </span>
            <span
              className={`mt-1.5 block truncate text-[10.5px] transition-colors ${
                i === step ? "text-foreground/80" : "text-muted-foreground/60 group-hover:text-muted-foreground"
              }`}
            >
              {sc.label}
            </span>
          </button>
        ))}
      </div>
    </figure>
  );
}
