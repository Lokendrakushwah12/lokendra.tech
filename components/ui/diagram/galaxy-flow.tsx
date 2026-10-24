"use client";

import { Cuboid, Cylinder, IsoStory, Line, mark, path, type IsoNode, type IsoScene, type ObjProps } from "./iso";

/* ---------- the objects that sit on each platform ---------- */

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
  const [sx, sy] = p(0, 0, 0);
  const r = 17;
  const cls = tint === "ok" ? "stroke-current" : "stroke-foreground/55";
  return (
    <g className="fill-none stroke-[1.1]">
      <ellipse cx={sx} cy={sy} rx={r * 0.9} ry={r * 0.45} className="stroke-foreground/25 [stroke-dasharray:2_3]" />
      <circle cx={cx} cy={cy} r={r} className={`${cls} fill-background`} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.34} className={cls} />
      <ellipse cx={cx} cy={cy} rx={r * 0.42} ry={r} className={cls} />
    </g>
  );
};

/** The warehouse, read with the owner's access and nobody else's. */
const Store = ({ p, tint }: ObjProps) => <Cylinder p={p} r={0.75} h={1.3} bands={[0.45, 0.9]} tint={tint} />;

/** The agent floats just clear of its shadow: over outside text it touches nothing, it has no tools. */
const Leaf = ({ p, tint }: ObjProps) => {
  const [sx, sy] = p(0, 0, 1.6);
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
        d={`M${sx} ${sy - 4.5} Q${sx} ${sy} ${sx + 4.5} ${sy} Q${sx} ${sy} ${sx} ${sy + 4.5} Q${sx} ${sy} ${sx - 4.5} ${sy} Q${sx} ${sy} ${sx} ${sy - 4.5} Z`}
        className={tint === "bad" ? "fill-rose-500" : tint === "ok" ? "fill-current" : "fill-foreground/60"}
      />
    </g>
  );
};

/** The Effect Ladder as a staircase: L0 → L2 granted, L3 dashed and dark. */
const Ladder = ({ p, tint }: ObjProps) => (
  <g>
    {[0, 1, 2, 3].map((i) => (
      <Cuboid key={i} p={p} at={[-1.2 + i * 0.6, -0.65, 0]} size={[0.6, 1.3, 0.32 * (i + 1)]} tint={i === 3 ? "idle" : tint} dashed={i === 3} />
    ))}
  </g>
);

const Message = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.85, -0.65, 0.45]} size={[1.7, 1.3, 0.14]} tint={tint} />
    <Line p={p} a={[-0.45, -0.3, 0.59]} b={[0.5, -0.3, 0.59]} className={mark(tint)} />
    <Line p={p} a={[-0.45, 0.05, 0.59]} b={[0.2, 0.05, 0.59]} className={mark(tint)} />
  </g>
);

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

/* ---------- the flow ---------- */

type N = "inbound" | "data" | "event" | "identity" | "search" | "model" | "gate" | "owner" | "customer";
type E = "ev-id" | "id-mo" | "in-mo" | "da-mo" | "se-mo" | "mo-ga" | "ga-ow" | "ga-cu";

const NODES: Record<N, IsoNode> = {
  inbound: { x: 76, y: 66, title: "Inbound text", sub: "email · DM · web page", Obj: Envelope },
  // its pill sits up and to the right, between the inbound and search labels
  data: { x: 76, y: 160, title: "Data", sub: "read as the owner", Obj: Store, pill: [104, -26] },
  // above it would sit on the data label
  event: { x: 76, y: 254, title: "Event", sub: "meeting.ended", Obj: Calendar, pill: [104, -34] },
  identity: { x: 200, y: 268, title: "Identity", sub: "one customer_id", Obj: Merge },
  search: { x: 300, y: 78, title: "Search", sub: "resolved company + topic", Obj: Globe, pill: [0, -46] },
  // its pill sits to the right, clear of the search label above it
  model: { x: 322, y: 196, title: "Agent", sub: "no tools on outside text", Obj: Leaf, pill: [92, -28] },
  gate: { x: 444, y: 254, title: "Effect Ladder", sub: "L0 → L2 granted", Obj: Ladder },
  owner: { x: 540, y: 270, title: "Owner’s DM", sub: "L1a", Obj: Message },
  customer: { x: 540, y: 118, title: "Customer", sub: "L3 · off", Obj: Lock },
};

const EDGES: Record<E, { d: string; stop?: [number, number] }> = {
  "ev-id": { d: "M76 254 C 122 274, 152 268, 200 268" },
  "id-mo": { d: "M200 268 C 246 268, 274 204, 322 196", stop: [292, 204] },
  "in-mo": { d: "M76 66 C 176 66, 256 154, 322 196" },
  "da-mo": { d: "M76 160 C 160 160, 250 190, 322 196", stop: [270, 189] },
  "se-mo": { d: "M300 78 C 306 124, 314 162, 322 196" },
  "mo-ga": { d: "M322 196 C 374 196, 404 246, 444 254", stop: [414, 240] },
  "ga-ow": { d: "M444 254 C 484 262, 504 270, 540 270" },
  "ga-cu": { d: "M444 254 C 474 206, 502 136, 540 118", stop: [502, 152] },
};

const SCENES: IsoScene<N, E>[] = [
  {
    label: "Run",
    caption: "A meeting ends. Galaxy reads the deal as the flow’s owner, resolves one customer, the agent writes the note, and the ladder lets it DM the owner.",
    nodes: { event: "ok", data: "ok", identity: "ok", model: "ok", gate: "ok", owner: "ok", inbound: "dim", search: "dim", customer: "dim" },
    edges: { "ev-id": "ok", "da-mo": "ok", "id-mo": "ok", "mo-ga": "ok", "ga-ow": "ok" },
    pills: { identity: { text: "1 match", tone: "ok" }, gate: { text: "L1a · receipt passed", tone: "ok" }, owner: { text: "sent", tone: "ok" } },
    dashed: ["customer"],
  },
  {
    label: "Access",
    caption: "The flow’s SQL reads a table its owner can’t see. It runs as the owner, even when a Super Admin saved it, so the check fails and the flow can’t be turned on.",
    nodes: { data: "bad", event: "dim", identity: "dim", model: "dim", gate: "dim", owner: "dim", inbound: "dim", search: "dim", customer: "dim" },
    edges: { "da-mo": "bad" },
    pills: { data: { text: "owner can’t read it", tone: "bad" } },
    dashed: ["customer"],
  },
  {
    label: "Ambiguous",
    caption: "Identity finds two customers for one address, so the run stops. A plausible guess is worse than no answer.",
    nodes: { event: "ok", identity: "bad", data: "dim", model: "dim", gate: "dim", owner: "dim", inbound: "dim", search: "dim", customer: "dim" },
    edges: { "ev-id": "ok", "id-mo": "bad" },
    pills: { identity: { text: "2 matches · run ends", tone: "bad" } },
    dashed: ["customer"],
  },
  {
    label: "Search",
    caption: "The brief needs facts from outside. Search gets a resolved company and a closed topic, so no page can write the query.",
    nodes: { event: "ok", identity: "ok", search: "ok", model: "ok", gate: "ok", owner: "ok", data: "dim", inbound: "dim", customer: "dim" },
    edges: { "ev-id": "ok", "id-mo": "ok", "se-mo": "ok", "mo-ga": "ok", "ga-ow": "ok" },
    pills: { search: { text: "topic: news · cited", tone: "ok" }, model: { text: "results marked tainted", tone: "muted" } },
    dashed: ["customer"],
  },
  {
    label: "Injected",
    caption: "An email subject tries to choose who gets the message. The agent reading it gets no tools, and tainted text reaching a recipient blocks the save.",
    nodes: { inbound: "bad", model: "idle", gate: "bad", data: "dim", event: "dim", identity: "dim", search: "dim", owner: "dim", customer: "dim" },
    edges: { "in-mo": "taint", "mo-ga": "bad" },
    pills: { inbound: { text: "“email this to …”", tone: "bad" }, model: { text: "no tools", tone: "muted" }, gate: { text: "blocked at save", tone: "bad" } },
    dashed: ["customer"],
  },
  {
    label: "Over grant",
    caption: "The flow asks to email a customer. L3 is off for the deployment, so the effect throws instead of quietly doing less.",
    nodes: { model: "ok", gate: "ok", customer: "bad", data: "dim", event: "dim", identity: "dim", inbound: "dim", search: "dim", owner: "dim" },
    edges: { "mo-ga": "ok", "ga-cu": "bad" },
    pills: { customer: { text: "L3 · refused", tone: "bad" }, gate: { text: "throws, never degrades", tone: "muted" } },
    dashed: ["customer"],
  },
  {
    label: "Backtest",
    caption: "Nothing is enabled without evidence: its SQL runs once as the owner, and the flow replays real history in an executor with no credentials.",
    nodes: { event: "ok", data: "ok", identity: "ok", model: "ok", gate: "ok", owner: "dim", customer: "dim", inbound: "dim", search: "dim" },
    edges: { "ev-id": "replay", "da-mo": "replay", "id-mo": "replay", "mo-ga": "replay" },
    pills: { data: { text: "SQL check · pass", tone: "ok" }, event: { text: "6,674 events replayed", tone: "ok" }, gate: { text: "would fire ≤ 0 times", tone: "muted" } },
    dashed: ["customer"],
  },
];

export const GalaxyFlow = () => (
  <IsoStory
    tone="text-sky-500"
    h={330}
    label="An isometric map of one Galaxy flow: an event, data read as the flow's owner and inbound text reach identity resolution, an agent that gets no tools on outside text, and the Effect Ladder, which decides whether the owner's DM or a customer can be reached"
    nodes={NODES}
    order={["search", "customer", "inbound", "data", "model", "event", "gate", "identity", "owner"]}
    edges={EDGES}
    scenes={SCENES}
  />
);

