"use client";

import { Cuboid, Cylinder, IsoStory, Line, mark, path, type IsoNode, type IsoScene, type ObjProps, type Proj, type Pt, type Tint } from "./iso";

/* ---------- shared little objects ---------- */

const polyline = (p: Proj, pts: Pt[]) => "M" + pts.map((q) => p(...q).join(" ")).join(" L");

/** Three sheets, slightly out of line: a document, or a ledger. */
const Sheets = ({ p, tint }: ObjProps) => (
  <g>
    {[0, 1, 2].map((i) => (
      <Cuboid key={i} p={p} at={[-0.75 - 0.08 * i, -0.95 + 0.06 * i, 0.18 * i]} size={[1.5, 1.9, 0.07]} tint={i === 2 ? tint : "idle"} />
    ))}
    {[-0.5, -0.1, 0.3].map((y, i) => (
      <Line key={y} p={p} a={[-0.7, y, 0.43]} b={[i === 2 ? 0 : 0.45, y, 0.43]} className={mark(tint)} />
    ))}
  </g>
);

/** A parcel: a shared package. */
const Parcel = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.7, -0.7, 0]} size={[1.4, 1.4, 0.8]} tint={tint} />
    <Line p={p} a={[-0.7, 0, 0.8]} b={[0.7, 0, 0.8]} className={mark(tint)} />
    <Line p={p} a={[0.7, 0, 0.8]} b={[0.7, 0, 0]} className={mark(tint)} />
  </g>
);

const Db = ({ p, tint }: ObjProps) => <Cylinder p={p} r={0.85} h={1.1} bands={[0.37, 0.74]} tint={tint} />;

/* ============ AI extraction ============ */

const Tags = ({ p, tint }: ObjProps) => (
  <g>
    {[
      [-0.95, -0.95],
      [0.2, -0.95],
      [-0.95, 0.2],
      [0.2, 0.2],
    ].map(([x, y], i) => (
      // the second tag is "customer", the doc type this file resolves to
      <Cuboid key={i} p={p} at={[x, y, 0]} size={[0.75, 0.75, 0.3]} tint={i === 1 ? tint : "idle"} />
    ))}
  </g>
);

const MapGrid = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-1.1, -0.9, 0]} size={[2.2, 1.8, 0.12]} tint={tint} />
    {[-0.35, 0.4].map((x) => (
      <Line key={x} p={p} a={[x, -0.9, 0.12]} b={[x, 0.9, 0.12]} className={mark(tint)} />
    ))}
    {[-0.3, 0.3].map((y) => (
      <Line key={y} p={p} a={[-1.1, y, 0.12]} b={[1.1, y, 0.12]} className={mark(tint)} />
    ))}
  </g>
);

const CheckCube = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.65, -0.65, 0]} size={[1.3, 1.3, 1]} tint={tint} />
    <path
      d={polyline(p, [
        [-0.4, 0.05, 1],
        [-0.05, 0.35, 1],
        [0.45, -0.35, 1],
      ])}
      className={`fill-none stroke-[1.6] ${mark(tint)}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

const Erp = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.8, -0.6, 0]} size={[1.6, 1.2, 1.15]} tint={tint} />
    {[0.42, 0.8].map((z) => (
      <g key={z}>
        <Line p={p} a={[0.8, -0.6, z]} b={[0.8, 0.6, z]} className={mark(tint)} />
        <Line p={p} a={[-0.8, 0.6, z]} b={[0.8, 0.6, z]} className={mark(tint)} />
      </g>
    ))}
  </g>
);

/** A spreadsheet that goes round once: export, fix, re-upload. */
const FixLoop = ({ p, tint }: ObjProps) => {
  const [cx, cy] = p(0, 0, 0.95);
  const rx = 13;
  const ry = 7;
  const end = (120 * Math.PI) / 180;
  const ex = cx + rx * Math.cos(end);
  const ey = cy + ry * Math.sin(end);
  // arrowhead along the tangent at the end of the arc
  const tx = -rx * Math.sin(end);
  const ty = ry * Math.cos(end);
  const len = Math.hypot(tx, ty);
  const [ux, uy] = [tx / len, ty / len];
  const head = (a: number) => `${ex - 5 * (ux * Math.cos(a) - uy * Math.sin(a))} ${ey - 5 * (ux * Math.sin(a) + uy * Math.cos(a))}`;
  return (
    <g>
      <Cuboid p={p} at={[-0.95, -0.75, 0]} size={[1.9, 1.5, 0.1]} tint={tint} />
      <Line p={p} a={[-0.3, -0.75, 0.1]} b={[-0.3, 0.75, 0.1]} className={mark(tint)} />
      <Line p={p} a={[-0.95, 0, 0.1]} b={[0.95, 0, 0.1]} className={mark(tint)} />
      <path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${ex} ${ey}`} className={`fill-none stroke-[1.3] ${mark(tint)}`} />
      <path d={`M${head(0.5)} L${ex} ${ey} L${head(-0.5)}`} className={`fill-none stroke-[1.3] ${mark(tint)}`} strokeLinecap="round" />
    </g>
  );
};

type XN = "upload" | "classify" | "map" | "extract" | "verify" | "ingest" | "resolve";
type XE = "up-cl" | "cl-ma" | "ma-ex" | "ex-ve" | "ve-in" | "ve-re" | "re-in";

const X_NODES: Record<XN, IsoNode> = {
  upload: { x: 66, y: 170, title: "Upload", sub: "customer file", Obj: Sheets },
  classify: { x: 178, y: 104, title: "Classify", sub: "doc type", Obj: Tags },
  map: { x: 290, y: 170, title: "Column mapping", sub: "→ DTO schema", Obj: MapGrid },
  extract: { x: 402, y: 104, title: "Extraction", sub: "fields + values", Obj: Db },
  verify: { x: 516, y: 170, title: "Verification", sub: "mandatory fields?", Obj: CheckCube, pill: [0, -52] },
  ingest: { x: 516, y: 292, title: "Ingest", sub: "into the ERP", Obj: Erp, pill: [-96, -6] },
  resolve: { x: 290, y: 292, title: "Bulk error resolution", sub: "xlsx → fix → re-upload", Obj: FixLoop },
};

const X_EDGES: Record<XE, { d: string; stop?: [number, number] }> = {
  "up-cl": { d: "M66 170 C 100 130, 140 104, 178 104" },
  "cl-ma": { d: "M178 104 C 220 104, 250 150, 290 170" },
  "ma-ex": { d: "M290 170 C 330 150, 360 104, 402 104" },
  "ex-ve": { d: "M402 104 C 444 104, 480 150, 516 170" },
  "ve-in": { d: "M516 170 L 516 292" },
  "ve-re": { d: "M516 170 C 470 236, 360 248, 290 292" },
  "re-in": { d: "M290 292 C 370 312, 440 312, 516 292" },
};

const X_SCENES: IsoScene<XN, XE>[] = [
  {
    label: "Classify",
    caption: "A customer file comes in and is classified by document type: food safety, customer, vendor or recipe.",
    nodes: { upload: "ok", classify: "ok", map: "dim", extract: "dim", verify: "dim", ingest: "dim", resolve: "dim" },
    edges: { "up-cl": "ok" },
    pills: { upload: { text: "4,500 rows", tone: "muted" }, classify: { text: "customer", tone: "ok" } },
  },
  {
    label: "Extract",
    caption: "Its columns are mapped onto the backend DTO schema, then the fields and values are extracted.",
    nodes: { map: "ok", extract: "ok", verify: "dim", ingest: "dim", resolve: "dim" },
    edges: { "cl-ma": "ok", "ma-ex": "ok" },
    pills: { map: { text: "columns → DTO fields", tone: "ok" } },
  },
  {
    label: "Verify",
    caption: "A verification layer checks that every mandatory field is present. Rows that pass are ingested into the ERP.",
    nodes: { verify: "ok", ingest: "ok", resolve: "dim" },
    edges: { "ex-ve": "ok", "ve-in": "ok" },
    pills: { verify: { text: "mandatory fields present", tone: "ok" }, ingest: { text: "ingested", tone: "ok" } },
  },
  {
    label: "Resolve",
    caption: "Rows with missing or invalid fields go to bulk error resolution: export as xlsx, fix, re-upload, ingest.",
    nodes: { verify: "ok", resolve: "bad", ingest: "ok" },
    edges: { "ve-re": "taint", "re-in": "ok" },
    pills: { resolve: { text: "missing / invalid rows", tone: "bad" } },
  },
  {
    label: "Duplicates",
    caption: "I also fixed rows being wrongly flagged DUPLICATE during ingestion, and load-tested it against a 4,500-row file.",
    nodes: { upload: "ok", verify: "ok", ingest: "ok" },
    edges: { "up-cl": "ok", "cl-ma": "ok", "ma-ex": "ok", "ex-ve": "ok", "ve-in": "ok" },
    pills: { verify: { text: "no false DUPLICATE flags", tone: "ok" }, upload: { text: "load-tested", tone: "muted" } },
  },
];

export const ExtractionPipeline = () => (
  <IsoStory
    tone="text-violet-500"
    h={360}
    label="Documents are classified, mapped to the backend DTO schema, extracted, then verified; rows with missing mandatory fields go through bulk error resolution before they are ingested"
    nodes={X_NODES}
    order={["classify", "extract", "upload", "map", "verify", "resolve", "ingest"]}
    edges={X_EDGES}
    scenes={X_SCENES}
  />
);

/* ============ splitting the monolith ============ */

const ROUTE_POS: [number, number][] = [
  [-1.45, -1.2],
  [-0.35, -1.2],
  [0.75, -1.2],
  [-1.45, 0.2],
  [-0.35, 0.2],
  [0.75, 0.2],
];
// operator-mode, workflow and production: the back row moves to kos
const MOVING = [0, 1, 2];
const movedBy = (step: number) => (step < 2 ? [] : step === 2 ? [0, 1] : MOVING);
const depthOrder = [0, 1, 3, 2, 4, 5];

const Routes = ({ p, tint, keep }: ObjProps & { keep: (i: number) => boolean }) => (
  <g>
    {depthOrder.filter(keep).map((i) => (
      <Cuboid key={i} p={p} at={[ROUTE_POS[i][0], ROUTE_POS[i][1], 0]} size={[0.7, 0.7, 0.7]} tint={MOVING.includes(i) ? tint : "idle"} />
    ))}
  </g>
);

const Dashboard = (props: ObjProps) => <Routes {...props} keep={(i) => !movedBy(props.step).includes(i)} />;
const Kos = (props: ObjProps) => <Routes {...props} keep={(i) => movedBy(props.step).includes(i)} />;

type MN = "dashboard" | "kos" | "auth" | "core";
type ME = "da-ko" | "da-au" | "au-ko" | "co-da" | "co-ko";

const M_NODES: Record<MN, IsoNode> = {
  dashboard: { x: 150, y: 205, size: 4, title: "apps/dashboard", sub: "the monolith", Obj: Dashboard },
  kos: { x: 450, y: 205, size: 4, title: "apps/kos", sub: "standalone Next.js app", Obj: Kos },
  auth: { x: 300, y: 85, size: 2.4, title: "packages/auth", sub: "extracted first", Obj: Parcel },
  core: { x: 300, y: 290, size: 2.4, title: "dashboard-core", sub: "shared deps, temporary", Obj: Parcel },
};

const M_EDGES: Record<ME, { d: string }> = {
  "da-ko": { d: "M150 205 C 240 165, 360 165, 450 205" },
  "da-au": { d: "M150 205 C 180 130, 240 95, 300 85" },
  "au-ko": { d: "M300 85 C 360 95, 420 130, 450 205" },
  "co-da": { d: "M300 290 C 240 292, 180 262, 150 205" },
  "co-ko": { d: "M300 290 C 360 292, 420 262, 450 205" },
};

const M_SCENES: IsoScene<MN, ME>[] = [
  {
    label: "Monolith",
    caption: "Operator-mode, workflow and production lived inside one dashboard app: one deploy and 16–18 minute CI builds.",
    nodes: { dashboard: "ok", kos: "dim", auth: "dim", core: "dim" },
    edges: {},
    pills: { dashboard: { text: "one deploy · 16–18 min", tone: "muted" } },
    dashed: ["kos", "auth", "core"],
  },
  {
    label: "Extract auth",
    caption: "Every route needs auth, so it moved into a shared package before anything else did.",
    nodes: { auth: "ok", kos: "dim", core: "dim" },
    edges: { "da-au": "ok" },
    pills: { auth: { text: "every route needs it", tone: "ok" } },
    dashed: ["kos", "core"],
  },
  {
    label: "Migrate",
    caption: "Routes moved one at a time over 34 commits. Anything more than one route needed was parked in dashboard-core, so both apps could import it.",
    nodes: { kos: "ok", core: "ok" },
    edges: { "da-ko": "ok", "co-da": "ok", "co-ko": "ok" },
    pills: { kos: { text: "routes arriving", tone: "ok" }, core: { text: "both apps import it", tone: "muted" } },
  },
  {
    label: "Two apps",
    caption: "Two apps with their own deploys, and CI down from 16–18 minutes to 7–9. The dashboard stayed as a rollback target.",
    nodes: { dashboard: "ok", kos: "ok", auth: "ok", core: "dim" },
    edges: { "da-au": "ok", "au-ko": "ok" },
    pills: {
      kos: { text: "7–8 min · own deploy", tone: "ok" },
      dashboard: { text: "9–10 min · rollback target", tone: "ok" },
      core: { text: "folds into kos", tone: "muted" },
    },
    dashed: ["core"],
  },
];

export const MonolithSplit = () => (
  <IsoStory
    tone="text-amber-500"
    h={350}
    label="Routes move one at a time from the monolithic dashboard app into a standalone kos app; auth is extracted into a shared package first and shared dependencies are parked in dashboard-core until the last route lands"
    nodes={M_NODES}
    order={["auth", "dashboard", "kos", "core"]}
    edges={M_EDGES}
    scenes={M_SCENES}
  />
);

/* ============ root-cause work ============ */

/** A screen standing up, with the address field it failed to fill. */
const Screen = ({ p, tint }: ObjProps) => {
  const face = 0.02; // the plane of the screen's front
  const field: Pt[] = [
    [-0.8, face, 0.25],
    [0.6, face, 0.25],
    [0.6, face, 0.5],
    [-0.8, face, 0.5],
  ];
  return (
    <g>
      <Cuboid p={p} at={[-1, -0.1, 0]} size={[2, 0.12, 1.35]} tint={tint === "bad" ? "idle" : tint} />
      <Line p={p} a={[-0.8, face, 1.08]} b={[0.25, face, 1.08]} className="stroke-foreground/45" />
      <Line p={p} a={[-0.8, face, 0.82]} b={[-0.1, face, 0.82]} className="stroke-foreground/35" />
      <path d={path(p, field)} className={`fill-none stroke-[1.1] [stroke-dasharray:2_2] ${mark(tint)}`} />
    </g>
  );
};

const Api = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.9, -0.7, 0]} size={[1.8, 1.4, 0.18]} tint="idle" />
    <Cuboid p={p} at={[-0.9, -0.7, 0.5]} size={[1.8, 1.4, 0.18]} tint={tint} />
    <path
      d={path(p, [
        [-0.5, -0.25, 0.68],
        [0.5, -0.25, 0.68],
        [0.5, 0.25, 0.68],
        [-0.5, 0.25, 0.68],
      ])}
      className={`fill-none stroke-[1.1] [stroke-dasharray:2_2] ${mark(tint)}`}
    />
  </g>
);

/** 12 rows, 4 of them broken: roughly the 119 of 326. */
const BROKEN = [1, 4, 6, 11];
const Rows = ({ p, tint }: ObjProps) => (
  <g>
    {Array.from({ length: 12 }, (_, i) => ({ i, x: -1.15 + (i % 4) * 0.6, y: -0.85 + Math.floor(i / 4) * 0.6 }))
      .sort((a, b) => a.x + a.y - (b.x + b.y))
      .map(({ i, x, y }) => (
        <Cuboid key={i} p={p} at={[x, y, 0]} size={[0.45, 0.45, 0.14]} tint={tint === "bad" && BROKEN.includes(i) ? "bad" : "idle"} />
      ))}
  </g>
);

const Crate = ({ p, tint }: ObjProps) => (
  <g>
    <Cuboid p={p} at={[-0.7, -0.7, 0]} size={[1.4, 1.4, 1]} tint={tint} />
    <Line p={p} a={[0.7, -0.7, 0]} b={[0.7, 0.7, 1]} className={mark(tint)} />
    <Line p={p} a={[-0.7, 0.7, 0]} b={[0.7, 0.7, 1]} className={mark(tint)} />
  </g>
);

type IN = "ui" | "api" | "db" | "rows" | "batch" | "aud";
type IE = "ui-api" | "api-db" | "db-ro" | "ro-ba" | "ba-au";

const I_NODES: Record<IN, IsoNode> = {
  ui: { x: 140, y: 80, title: "Sales order screen", sub: "address renders blank", Obj: Screen, pill: [118, 0] },
  api: { x: 140, y: 175, title: "/erp/sales-orders", sub: "address returns null", Obj: Api, pill: [118, 0] },
  db: { x: 140, y: 270, title: "sales_order", sub: "address_id → null", Obj: Db },
  rows: { x: 300, y: 270, title: "Affected rows", sub: "null foreign keys", Obj: Rows },
  batch: { x: 460, y: 270, title: "One ERP batch", sub: "single write window", Obj: Crate },
  aud: { x: 460, y: 125, title: "*_aud tables", sub: "bounded the blast radius", Obj: Sheets },
};

const I_EDGES: Record<IE, { d: string }> = {
  "ui-api": { d: "M140 80 L 140 175" },
  "api-db": { d: "M140 175 L 140 270" },
  "db-ro": { d: "M140 270 C 190 292, 250 292, 300 270" },
  "ro-ba": { d: "M300 270 C 350 248, 410 248, 460 270" },
  "ba-au": { d: "M460 270 C 494 226, 494 170, 460 125" },
};

const dimAll = (except: IN[]): Partial<Record<IN, Tint>> =>
  Object.fromEntries((Object.keys(I_NODES) as IN[]).filter((k) => !except.includes(k)).map((k) => [k, "dim" as Tint]));

const I_SCENES: IsoScene<IN, IE>[] = [
  {
    label: "Symptom",
    caption: "It started as a blank address on the sales order screen.",
    nodes: { ...dimAll(["ui"]), ui: "bad" },
    edges: {},
    pills: { ui: { text: "address renders blank", tone: "bad" } },
  },
  {
    label: "API",
    caption: "The API was already returning null, so the screen was only the messenger.",
    nodes: { ...dimAll(["ui", "api"]), api: "bad" },
    edges: { "ui-api": "taint" },
    pills: { api: { text: "address: null", tone: "bad" } },
  },
  {
    label: "Database",
    caption: "In the database, 119 of 326 sales orders had null address foreign keys.",
    nodes: { ...dimAll(["api", "db", "rows"]), db: "bad", rows: "bad" },
    edges: { "api-db": "taint", "db-ro": "taint" },
    pills: { rows: { text: "119 of 326 orders", tone: "bad" } },
  },
  {
    label: "Cause",
    caption: "Every affected row traced back to a single ERP migration batch.",
    nodes: { ...dimAll(["rows", "batch"]), rows: "bad", batch: "bad" },
    edges: { "ro-ba": "taint" },
    pills: { batch: { text: "one migration batch", tone: "bad" } },
  },
  {
    label: "Bounded",
    caption: "Postgres audit tables bounded the damage to one write window, not a guess. The same method bounded 11 vendor address overwrites.",
    nodes: { ...dimAll(["batch", "aud"]), aud: "ok" },
    edges: { "ba-au": "ok" },
    pills: { aud: { text: "one write window", tone: "ok" } },
  },
];

export const IncidentTrace = () => (
  <IsoStory
    tone="text-emerald-500"
    h={345}
    label="A blank address on the sales order screen traced down through the API to null address foreign keys in the database, back to a single ERP migration batch, and bounded with audit tables"
    nodes={I_NODES}
    order={["ui", "aud", "api", "db", "rows", "batch"]}
    edges={I_EDGES}
    scenes={I_SCENES}
  />
);
