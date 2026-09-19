import {
  Box,
  Caption,
  Frame,
  IcAlert,
  IcApp,
  IcCheck,
  IcDb,
  IcDoc,
  IcPackage,
  IcSheet,
  IcSplit,
  IcTag,
  Link,
  Pill,
} from "./parts";

/** Monorepo → two apps: extract auth, migrate route by route, then fold core in. */
export const MonolithSplit = () => (
  <Frame
    h={440}
    label="Step one extracts auth into a shared package; step two migrates routes one at a time, parking shared dependencies in dashboard-core so both apps can use them, and folds dashboard-core into kos once the last route lands, while apps/dashboard continues to serve the other teams and no team is ever blocked"
  >
    {/* ---------- step 1 ---------- */}
    <Caption x={20} y={20}>step 1 - extract the shared foundation</Caption>
    <Box x={20} y={30} w={156} h={46} title="webapp-monorepo" sub="one deploy · 16–18 min" icon={IcSplit} />
    <Link d="M180 53 L 216 53" flow />
    <Box x={220} y={30} w={148} h={46} title="packages/auth" sub="pulled out first" icon={IcPackage} accent />
    <Caption x={380} y={50} accent>every route needs it,</Caption>
    <Caption x={380} y={63}>so it moves before anything else</Caption>

    <line x1={20} y1={98} x2={580} y2={98} className="stroke-border" strokeDasharray="3 4" />

    {/* ---------- step 2 ---------- */}
    <Caption x={20} y={120}>step 2 - migrate, one route at a time</Caption>
    <Box x={20} y={132} w={150} h={46} title="apps/dashboard" sub="routes leaving" icon={IcApp} />
    <Link d="M174 155 L 232 155" flow />
    <Caption x={178} y={148} accent>route by route</Caption>
    <Box x={236} y={132} w={150} h={46} title="apps/kos" sub="routes arriving" icon={IcApp} accent />

    {/* shared dependency parking */}
    <Box x={104} y={214} w={202} h={46} title="packages/dashboard-core" sub="deps more than one route needs" icon={IcPackage} accent />
    <Link d="M150 214 L 150 198 L 95 198 L 95 183" dashed />
    <Link d="M262 214 L 262 198 L 311 198 L 311 183" dashed />
    <Caption x={320} y={232}>both apps import it while the</Caption>
    <Caption x={320} y={245}>migration is still in flight</Caption>

    <line x1={20} y1={282} x2={580} y2={282} className="stroke-border" strokeDasharray="3 4" />

    {/* ---------- end state ---------- */}
    <Caption x={20} y={304}>end state - what depends on what</Caption>
    <Pill x={20} y={318} w={140} text="packages/ui" />
    <Pill x={20} y={342} w={140} text="packages/auth" />
    <Pill x={20} y={366} w={140} text="packages/dashboard-core" accent />

    {/* one bus instead of six crossing lines */}
    <Link d="M164 327 L 196 327" arrow={false} muted />
    <Link d="M164 351 L 196 351" arrow={false} muted />
    <Link d="M164 375 L 196 375" arrow={false} muted dashed />
    <Link d="M196 327 L 196 385" arrow={false} muted />
    <Link d="M196 333 L 242 333" muted />
    <Link d="M196 385 L 242 385" muted />

    <Box x={246} y={312} w={150} h={42} title="apps/kos" sub="7–8 min · own deploy" icon={IcApp} accent />
    <Box x={246} y={364} w={150} h={42} title="apps/dashboard" sub="9–10 min · own deploy" icon={IcApp} />

    <Caption x={408} y={328} accent>dashboard-core is temporary -</Caption>
    <Caption x={408} y={341}>it folds into kos once the last</Caption>
    <Caption x={408} y={354}>route lands. dashboard stays.</Caption>

    <Caption x={20} y={424} accent>no freeze - every team kept shipping throughout · two apps, two independent deploys</Caption>
  </Frame>
);

/** Upload → classify → map to DTO → extract → verify → resolve → ingest. */
export const ExtractionPipeline = () => (
  <Frame
    h={250}
    tone="violet"
    label="Documents are classified, mapped to the backend DTO schema, extracted, then verified; missing mandatory fields are fixed inline or through bulk error resolution before ingest"
  >
    <Box x={16} y={40} w={96} h={44} title="upload" sub="document" icon={IcDoc} accent />

    <Link d="M116 62 L 148 62" flow />
    <Box x={152} y={40} w={104} h={44} title="classify" sub="doc type" icon={IcTag} />
    <Pill x={152} y={92} w={58} text="food safety" />
    <Pill x={214} y={92} w={58} text="customer" />
    <Pill x={152} y={114} w={58} text="vendor" />
    <Pill x={214} y={114} w={58} text="recipe" />

    <Link d="M260 62 L 284 62" flow />
    <Box x={288} y={40} w={148} h={44} title="column mapping" sub="→ backend DTO schema" icon={IcSheet} />

    <Link d="M440 62 L 456 62" flow />
    <Box x={460} y={40} w={124} h={44} title="extraction" sub="fields + values" icon={IcDb} />

    {/* verification gate */}
    <Link d="M522 88 L 522 116" flow />
    <Box x={432} y={120} w={152} h={46} title="verification layer" sub="mandatory fields present?" icon={IcCheck} accent />

    {/* happy path */}
    <Link d="M432 143 L 392 143" />
    <Box x={268} y={121} w={120} h={44} title="ingest" sub="into the ERP" icon={IcCheck} accent />

    {/* failure path → bulk resolution loop */}
    <Link d="M508 170 L 508 194" dashed />
    <Box x={300} y={192} w={208} h={44} title="bulk error resolution" sub="export xlsx → edit → re-upload" icon={IcAlert} />
    <Link d="M300 214 C 250 214, 250 160, 268 152" dashed />
    <Caption x={300} y={182}>missing / invalid</Caption>

    <Caption x={16} y={214}>4,500-row file</Caption>
    <Caption x={16} y={228}>load-tested</Caption>
    <Caption x={16} y={150} accent>false DUPLICATE</Caption>
    <Caption x={16} y={164} accent>flagging fixed</Caption>
  </Frame>
);

/** A UI symptom traced down through the API and DB to a single migration batch. */
export const IncidentTrace = () => (
  <Frame
    h={218}
    tone="rose"
    label="A blank address in the sales order UI traced down through the API to null address foreign keys in the database, and back to a single ERP migration batch"
  >
    {/* layer bands */}
    {[
      { y: 26, label: "ui" },
      { y: 92, label: "api" },
      { y: 158, label: "db" },
    ].map((l) => (
      <g key={l.label}>
        <line x1={64} y1={l.y + 22} x2={584} y2={l.y + 22} className="stroke-border" strokeDasharray="3 4" />
        <text x={22} y={l.y + 26} className="fill-muted-foreground/50 text-[10px]">{l.label}</text>
      </g>
    ))}

    <Box x={72} y={26} w={150} h={44} title="sales order screen" sub="address renders blank" icon={IcApp} accent />
    <Caption x={236} y={52} accent>the symptom</Caption>

    <Link d="M147 74 L 147 90" flow />
    <Box x={72} y={92} w={150} h={44} title="/erp/sales-orders" sub="address returns null" icon={IcDoc} />

    <Link d="M147 140 L 147 156" flow />
    <Box x={72} y={158} w={150} h={44} title="sales_order" sub="address_id → null" icon={IcDb} accent />

    {/* the scope of the damage */}
    <Link d="M226 180 L 268 180" />
    <Box x={272} y={158} w={126} h={44} title="119 of 326" sub="rows affected" icon={IcAlert} accent />

    {/* the cause */}
    <Link d="M402 180 L 444 180" flow />
    <Box x={448} y={158} w={136} h={44} title="one ERP batch" sub="single write window" icon={IcDb} accent />

    <Link d="M516 156 C 516 120, 516 110, 516 92" dashed />
    <Box x={448} y={92} w={136} h={44} title="*_aud tables" sub="bounded the blast radius" icon={IcSheet} />
    <Caption x={448} y={74}>audit trail, not guesswork</Caption>
  </Frame>
);
