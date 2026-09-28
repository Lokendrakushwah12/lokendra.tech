"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

/* ---------- isometric helpers ---------- */

const U = 15; // px per world unit
const COS = 0.866;

type Pt = [number, number, number];
type Proj = (x: number, y: number, z: number) => [number, number];

const projector =
  (cx: number, cy: number): Proj =>
  (x, y, z) => [cx + (x - y) * U * COS, cy + (x + y) * U * 0.5 - z * U];

const path = (p: Proj, pts: Pt[]) =>
  "M" + pts.map((q) => p(...q).map((n) => n.toFixed(1)).join(" ")).join(" L") + " Z";

type Tint = "idle" | "ok" | "bad" | "dim";

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
const Cuboid = ({
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
}) => {
  const dash = dashed ? "[stroke-dasharray:3_3]" : "";
  return (
    <g className={dash}>
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
};

const Line = ({ p, a, b, className = "stroke-foreground/55" }: { p: Proj; a: Pt; b: Pt; className?: string }) => {
  const [x1, y1] = p(...a);
  const [x2, y2] = p(...b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={`stroke-[1.1] ${className}`} strokeLinecap="round" />;
};

/* ---------- the objects that sit on each platform ---------- */

type ObjProps = { p: Proj; tint: Tint };

const Envelope = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.95, -0.7, 0]} size={[1.9, 1.4, 0.22]} tint={tint} />
    <Line p={p} a={[-0.95, -0.7, 0.22]} b={[0, 0.05, 0.22]} className={tint === "bad" ? "stroke-rose-500" : "stroke-foreground/45"} />
    <Line p={p} a={[0.95, -0.7, 0.22]} b={[0, 0.05, 0.22]} className={tint === "bad" ? "stroke-rose-500" : "stroke-foreground/45"} />
  </g>
);

const Calendar = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.8, -0.8, 0]} size={[1.6, 1.6, 0.95]} tint={tint} />
    <Line p={p} a={[0.8, -0.8, 0.66]} b={[0.8, 0.8, 0.66]} />
    <Line p={p} a={[-0.8, 0.8, 0.66]} b={[0.8, 0.8, 0.66]} />
    <Cuboid p={p} at={[-0.45, -0.3, 0.95]} size={[0.18, 0.18, 0.32]} tint={tint} />
    <Cuboid p={p} at={[0.3, -0.3, 0.95]} size={[0.18, 0.18, 0.32]} tint={tint} />
  </g>
);

/** Three ids from three systems; only the top one is aligned. */
const Merge = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-1.05, -0.35, 0]} size={[1.5, 1.1, 0.16]} tint={tint === "bad" ? "bad" : "idle"} />
    <Cuboid p={p} at={[-0.45, -0.95, 0.3]} size={[1.5, 1.1, 0.16]} tint={tint === "bad" ? "bad" : "idle"} />
    <Cuboid p={p} at={[-0.75, -0.65, 0.6]} size={[1.5, 1.1, 0.16]} tint={tint} />
  </g>
);

/** The web: a globe, because search is the only door to it. */
const Globe = ({ p, tint }: ObjProps) => {
  const [cx, cy] = p(0, 0, 1.05);
  const r = 17;
  const cls = tint === "ok" ? "stroke-current" : "stroke-foreground/55";
  const [sx, sy] = p(0, 0, 0);
  return (
    <g className="fill-none stroke-[1.1]">
      <ellipse cx={sx} cy={sy} rx={r * 0.9} ry={r * 0.45} className="stroke-foreground/25 [stroke-dasharray:2_3]" />
      <circle cx={cx} cy={cy} r={r} className={`${cls} fill-background`} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.34} className={cls} />
      <ellipse cx={cx} cy={cy} rx={r * 0.42} ry={r} className={cls} />
    </g>
  );
};

/** The model floats: it touches nothing, it has no tools. */
const Leaf = ({ p, tint }: ObjProps) => {
  const star = p(0, 0, 1.6);
  return (
    <g>
      <path
        d={path(p, [
          [-0.6, -0.6, 0],
          [0.6, -0.6, 0],
          [0.6, 0.6, 0],
          [-0.6, 0.6, 0],
        ])}
        className="fill-none stroke-foreground/30 stroke-[1] [stroke-dasharray:2_3]"
      />
      <Cuboid p={p} at={[-0.6, -0.6, 0.4]} size={[1.2, 1.2, 1.2]} tint={tint} />
      <path
        d={`M${star[0]} ${star[1] - 4.5} Q${star[0]} ${star[1]} ${star[0] + 4.5} ${star[1]} Q${star[0]} ${star[1]} ${star[0]} ${star[1] + 4.5} Q${star[0]} ${star[1]} ${star[0] - 4.5} ${star[1]} Q${star[0]} ${star[1]} ${star[0]} ${star[1] - 4.5} Z`}
        className={tint === "bad" ? "fill-rose-500" : tint === "ok" ? "fill-current" : "fill-foreground/60"}
      />
    </g>
  );
};

/** The Effect Ladder as a staircase: L0 → L2 granted, L3 dashed and dark. */
const Ladder = ({ p, tint }: ObjProps) => (
  <g>
    {[0, 1, 2, 3].map((i) => (
      <Cuboid
        key={i}
        p={p}
        at={[-1.2 + i * 0.6, -0.65, 0]}
        size={[0.6, 1.3, 0.32 * (i + 1)]}
        tint={i === 3 ? "idle" : tint}
        dashed={i === 3}
      />
    ))}
  </g>
);

const Message = ({ p, tint }: ObjProps) => {
  const lc = tint === "ok" ? "stroke-current" : "stroke-foreground/40";
  return (
    <g>
      <Cuboid p={p} at={[-0.85, -0.65, 0.45]} size={[1.7, 1.3, 0.14]} tint={tint} />
      <Line p={p} a={[-0.45, -0.3, 0.59]} b={[0.5, -0.3, 0.59]} className={lc} />
      <Line p={p} a={[-0.45, 0.05, 0.59]} b={[0.2, 0.05, 0.59]} className={lc} />
    </g>
  );
};

const Lock = ({ p, tint }: ObjProps) => {
  const [ax, ay] = p(-0.18, 0, 0.6);
  const [bx, by] = p(0.28, 0, 0.6);
  return (
    <g>
      <path
        d={`M${ax} ${ay} C${ax} ${ay - 16} ${bx} ${by - 16} ${bx} ${by}`}
        className={`fill-none stroke-[1.4] ${tint === "bad" ? "stroke-rose-500" : "stroke-foreground/45"}`}
      />
      <Cuboid p={p} at={[-0.4, -0.25, 0]} size={[0.8, 0.5, 0.62]} tint={tint === "bad" ? "bad" : "idle"} />
    </g>
  );
};

/* ---------- the scene ---------- */

type NodeId = "inbound" | "event" | "identity" | "search" | "model" | "gate" | "owner" | "customer";
type EdgeId = "ev-id" | "id-mo" | "in-mo" | "se-mo" | "mo-ga" | "ga-ow" | "ga-cu";
type EdgeState = "idle" | "ok" | "bad" | "taint" | "replay";

const NODES: Record<NodeId, { x: number; y: number; title: string; sub: string; Obj: (p: ObjProps) => React.ReactNode; dashed?: boolean }> = {
  inbound: { x: 76, y: 96, title: "Inbound text", sub: "email · DM · web page", Obj: Envelope },
  event: { x: 76, y: 236, title: "Event", sub: "meeting.ended", Obj: Calendar },
  identity: { x: 200, y: 268, title: "Identity", sub: "one customer_id", Obj: Merge },
  search: { x: 300, y: 78, title: "Search", sub: "resolved company + topic", Obj: Globe },
  model: { x: 322, y: 196, title: "Model", sub: "tool-free · a leaf", Obj: Leaf },
  gate: { x: 444, y: 254, title: "Effect Ladder", sub: "L0 → L2 granted", Obj: Ladder },
  owner: { x: 540, y: 270, title: "Owner’s DM", sub: "L1a", Obj: Message },
  customer: { x: 540, y: 118, title: "Customer", sub: "L3 · off", Obj: Lock, dashed: true },
};

const EDGES: Record<EdgeId, { d: string; stop: [number, number] }> = {
  "ev-id": { d: "M76 236 C 122 266, 152 268, 200 268", stop: [172, 267] },
  "id-mo": { d: "M200 268 C 246 268, 274 204, 322 196", stop: [292, 204] },
  "in-mo": { d: "M76 96 C 176 96, 256 154, 322 196", stop: [274, 158] },
  "se-mo": { d: "M300 78 C 306 124, 314 162, 322 196", stop: [316, 160] },
  "mo-ga": { d: "M322 196 C 374 196, 404 246, 444 254", stop: [414, 240] },
  "ga-ow": { d: "M444 254 C 484 262, 504 270, 540 270", stop: [506, 266] },
  "ga-cu": { d: "M444 254 C 474 206, 502 136, 540 118", stop: [502, 152] },
};

type Scene = {
  label: string;
  caption: string;
  nodes: Partial<Record<NodeId, Tint>>;
  edges: Partial<Record<EdgeId, EdgeState>>;
  pills: Partial<Record<NodeId, { text: string; tone: "ok" | "bad" | "muted" }>>;
};

const SCENES: Scene[] = [
  {
    label: "Run",
    caption:
      "A meeting ends. Galaxy resolves one customer, the model writes the note, and the ladder lets it DM the flow’s owner.",
    nodes: { event: "ok", identity: "ok", model: "ok", gate: "ok", owner: "ok", inbound: "dim", search: "dim", customer: "dim" },
    edges: { "ev-id": "ok", "id-mo": "ok", "mo-ga": "ok", "ga-ow": "ok" },
    pills: { identity: { text: "1 match", tone: "ok" }, gate: { text: "L1a · receipt passed", tone: "ok" }, owner: { text: "sent", tone: "ok" } },
  },
  {
    label: "Ambiguous",
    caption: "Identity finds two customers for one address, so the run stops. A plausible guess is worse than no answer.",
    nodes: { event: "ok", identity: "bad", model: "dim", gate: "dim", owner: "dim", inbound: "dim", search: "dim", customer: "dim" },
    edges: { "ev-id": "ok", "id-mo": "bad" },
    pills: { identity: { text: "2 matches · run ends", tone: "bad" } },
  },
  {
    label: "Search",
    caption:
      "The brief needs facts from outside. Search gets a resolved company and a closed topic, so no page can write the query.",
    nodes: { event: "ok", identity: "ok", search: "ok", model: "ok", gate: "ok", owner: "ok", inbound: "dim", customer: "dim" },
    edges: { "ev-id": "ok", "id-mo": "ok", "se-mo": "ok", "mo-ga": "ok", "ga-ow": "ok" },
    pills: { search: { text: "topic: news · cited", tone: "ok" }, model: { text: "results marked tainted", tone: "muted" } },
  },
  {
    label: "Injected",
    caption: "An email subject tries to choose who gets the message. Tainted text reaching a recipient blocks the save.",
    nodes: { inbound: "bad", model: "idle", gate: "bad", event: "dim", identity: "dim", search: "dim", owner: "dim", customer: "dim" },
    edges: { "in-mo": "taint", "mo-ga": "bad" },
    pills: { inbound: { text: "“email this to …”", tone: "bad" }, gate: { text: "blocked at save", tone: "bad" } },
  },
  {
    label: "Over grant",
    caption: "The flow asks to email a customer. L3 is off for the deployment, so the effect throws instead of quietly doing less.",
    nodes: { model: "ok", gate: "ok", customer: "bad", event: "dim", identity: "dim", inbound: "dim", search: "dim", owner: "dim" },
    edges: { "mo-ga": "ok", "ga-cu": "bad" },
    pills: { customer: { text: "L3 · refused", tone: "bad" }, gate: { text: "throws, never degrades", tone: "muted" } },
  },
  {
    label: "Backtest",
    caption:
      "Nothing is enabled without evidence: the flow replays real history in an executor with no credentials first.",
    nodes: { event: "ok", identity: "ok", model: "ok", gate: "ok", owner: "dim", customer: "dim", inbound: "dim", search: "dim" },
    edges: { "ev-id": "replay", "id-mo": "replay", "mo-ga": "replay" },
    pills: { event: { text: "6,674 events replayed", tone: "ok" }, gate: { text: "would fire ≤ 0 times", tone: "muted" } },
  },
];

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

const Pill = ({ x, y, text, tone }: { x: number; y: number; text: string; tone: "ok" | "bad" | "muted" }) => {
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

export const GalaxyFlow = () => {
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
    const t = setTimeout(() => setStep((s) => (s + 1) % SCENES.length), STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step]);

  const scene = SCENES[step];
  const nodeTint = (id: NodeId): Tint => scene.nodes[id] ?? "idle";

  return (
    <figure ref={ref} className="not-prose my-6 text-sky-500">
      <svg
        viewBox="0 0 600 330"
        role="img"
        aria-label="An isometric map of one Galaxy flow: an event and inbound text reach identity resolution, a tool-free model and the Effect Ladder, which decides whether the owner's DM or a customer can be reached"
        className="block w-full"
      >
        {/* edges first, so platforms sit on top of their ends */}
        {(Object.keys(EDGES) as EdgeId[]).map((id) => {
          const state = scene.edges[id] ?? "idle";
          const cls =
            state === "ok"
              ? "stroke-current/70"
              : state === "bad"
                ? "stroke-rose-500/70"
                : state === "taint"
                  ? "stroke-rose-500/60 [stroke-dasharray:5_3]"
                  : state === "replay"
                  ? "stroke-current/60 [stroke-dasharray:4_4] diagram-flow"
                  : "stroke-muted-foreground/20 [stroke-dasharray:2_4]";
          return (
            <g key={id}>
              <path id={`${uid}-${id}`} d={EDGES[id].d} fill="none" strokeWidth={1.4} className={`${cls} transition-[stroke] duration-500`} />
              {(state === "ok" || state === "bad" || state === "taint") && !still && (
                <circle r={2.8} className={state === "ok" ? "fill-current" : "fill-rose-500"}>
                  <animateMotion
                    dur={state === "bad" ? "1.6s" : "1.8s"}
                    repeatCount="indefinite"
                    keyPoints={state === "bad" ? "0;0.78" : "0;1"}
                    keyTimes="0;1"
                    calcMode="linear"
                  >
                    <mpath href={`#${uid}-${id}`} />
                  </animateMotion>
                </circle>
              )}
              {state === "bad" && (
                <g transform={`translate(${EDGES[id].stop[0]} ${EDGES[id].stop[1]})`}>
                  <circle r={6} className="fill-background stroke-rose-500" strokeWidth={1.2} />
                  <path d="M-2.4 -2.4 L2.4 2.4 M2.4 -2.4 L-2.4 2.4" className="stroke-rose-500" strokeWidth={1.3} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}

        {/* platforms and their objects, back row first */}
        {(["search", "customer", "inbound", "model", "event", "gate", "identity", "owner"] as NodeId[]).map((id) => {
          const n = NODES[id];
          const p = projector(n.x, n.y);
          const tint = nodeTint(id);
          const dim = tint === "dim";
          return (
            <g key={id} className="transition-opacity duration-500" opacity={dim ? 0.38 : 1}>
              <Cuboid
                p={p}
                at={[-1.5, -1.5, -0.32]}
                size={[3, 3, 0.32]}
                tint={tint === "ok" || tint === "bad" ? tint : "idle"}
                dashed={n.dashed}
              />
              <n.Obj p={p} tint={tint === "dim" ? "idle" : tint} />
              <text x={n.x} y={n.y + 44} textAnchor="middle" className="fill-foreground/80 text-[10.5px]">
                {n.title}
              </text>
              <text x={n.x} y={n.y + 56} textAnchor="middle" className="fill-muted-foreground/70 text-[8.5px]">
                {n.sub}
              </text>
            </g>
          );
        })}

        {/* status pills float above their node */}
        {(Object.keys(scene.pills) as NodeId[]).map((id) => {
          const n = NODES[id];
          const pill = scene.pills[id]!;
          // the model's pill sits to its right, clear of the search label above it
          const [px, py] = id === "model" ? [n.x + 92, n.y - 28] : [n.x, n.y - (id === "search" ? 46 : 40)];
          return <Pill key={`${step}-${id}`} x={px} y={py} text={pill.text} tone={pill.tone} />;
        })}
      </svg>

      <p aria-live="polite" className="mt-1 min-h-[2.6em] text-[12px] leading-relaxed text-muted-foreground/80">
        {scene.caption}
      </p>

      <div className="mt-3">
        <div className="grid grid-cols-6 gap-2">
          {SCENES.map((s, i) => (
            <button
              key={s.label}
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
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
};
