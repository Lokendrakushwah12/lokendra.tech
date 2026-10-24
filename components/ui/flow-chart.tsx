/** Challenge against skill, after Csikszentmihalyi's flow model. */

type Figure = { head: [number, number]; torso: string; limbs: string[]; extra?: React.ReactNode };

// pictograms drawn around the feet at (0, 0), up is negative
const FIGURES: Record<string, Figure> = {
  anxiety: {
    head: [0, -23.5],
    torso: "M0 -19 V-9",
    limbs: ["M0 -9 L-2.4 0", "M0 -9 L2.4 0", "M0 -18 L-4.5 -21.5 L-1.8 -25", "M0 -18 L4.5 -21.5 L1.8 -25"],
  },
  arousal: {
    head: [0, -23.5],
    torso: "M0 -19 V-9",
    limbs: ["M0 -9 L-2.4 0", "M0 -9 L2.4 0", "M0 -17.5 L-3.2 -10", "M0 -17.5 L3.2 -10"],
    extra: <path d="M0 -13.4 L-1.4 -14.8 A0.8 0.8 0 0 1 0 -16 A0.8 0.8 0 0 1 1.4 -14.8 Z" className="fill-background stroke-none" />,
  },
  flow: {
    head: [4, -22.5],
    torso: "M-1 -9 L2.5 -18.5",
    limbs: ["M2.5 -18 L6.5 -26", "M2.5 -17.5 L-1.5 -14.5", "M-1 -9 L-4.5 -5 L-2 -1", "M-1 -9 L-6.5 -9.5 L-9.5 -6.5"],
    extra: <circle cx={8.6} cy={-29.6} r={2.3} className="fill-emerald-500 stroke-none motion-safe:animate-pulse" />,
  },
  worry: {
    head: [3.6, -17],
    torso: "M-3 -7.5 L1.6 -15",
    limbs: ["M-3 -7.5 L3.5 -7.5 L3.5 0", "M1.6 -14.5 L4.2 -8.5 L4.6 -15.5"],
  },
  boredom: {
    head: [0.5, -21.5],
    torso: "M-3 -8 L-0.8 -17.5",
    limbs: ["M-3 -8 L3.5 -8 L2.5 0", "M-0.8 -17 L3.5 -10 L1.8 -18.5"],
  },
  control: {
    head: [3, -23.5],
    torso: "M3 -19 V-9",
    limbs: ["M3 -9 L0.8 0", "M3 -9 L5.2 0", "M3 -17.5 L-2.5 -16", "M3 -17.5 L5.8 -10.5"],
    extra: (
      <g className="fill-none" strokeWidth={1.3}>
        <circle cx={-6} cy={-15} r={3.8} />
        <path d="M-6 -15 V-11.2 M-6 -15 L-9.3 -16.9 M-6 -15 L-2.7 -16.9" />
      </g>
    ),
  },
  apathy: {
    head: [8, -10],
    torso: "M-2 -3 L5.5 -7.5",
    limbs: ["M-2 -3 L-10 -1", "M-2 -3 L-6 -6.5 L-10.5 -3", "M5.5 -7.5 L4 -13 L8.5 -12.5"],
  },
  relaxation: {
    head: [0, -21],
    torso: "M0 -16.5 V-7",
    limbs: ["M0 -15 L-5 -10 L-6.5 -6", "M0 -15 L5 -10 L6.5 -6", "M-7.5 -2.5 L4 -6", "M7.5 -2.5 L-4 -6"],
  },
};

const ROWS = [
  { band: "fill-emerald-500/10", cells: ["anxiety", "arousal", "flow"] },
  { band: "fill-amber-500/10", cells: ["worry", "boredom / arousal", "control"] },
  { band: "fill-violet-500/10", cells: ["apathy", "boredom", "relaxation"] },
];
const LEVELS = ["low", "avg", "high"];

const X0 = 38;
const Y0 = 6;
const CW = 66;
const CH = 58;
const RIGHT = X0 + CW * 3;
const BOTTOM = Y0 + CH * 3;

const Pictogram = ({ name, x, y }: { name: string; x: number; y: number }) => {
  const f = FIGURES[name];
  const flow = name === "flow";
  // solid strokes faded as one group, so overlapping limbs don't darken at the joints
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={flow ? 0.75 : 0.45}
        className="fill-none stroke-foreground"
      >
        <path d={f.torso} strokeWidth={3.4} />
        {f.limbs.map((d) => (
          <path key={d} d={d} strokeWidth={2.2} />
        ))}
        <circle cx={f.head[0]} cy={f.head[1]} r={3} className="fill-foreground stroke-none" />
        {name !== "flow" && f.extra}
      </g>
      {/* the ball stays at full colour */}
      {name === "flow" && f.extra}
    </g>
  );
};

const FlowChart = () => (
  <figure className="w-full max-w-[15rem] shrink-0">
    <svg
      viewBox={`0 0 250 ${BOTTOM + 28}`}
      role="img"
      aria-label="Flow model: challenge on the vertical axis, skill on the horizontal. High challenge with low skill is anxiety, low challenge with high skill is relaxation, and high challenge with high skill is flow."
      className="block w-full"
    >
      {ROWS.map((row, r) => (
        <g key={r}>
          <rect x={X0} y={Y0 + r * CH} width={CW * 3} height={CH} className={row.band} />
          {row.cells.map((label, c) => {
            const cx = X0 + c * CW + CW / 2;
            const cy = Y0 + r * CH + CH / 2;
            const flow = label === "flow";
            const [a, b] = label.split(" / ");
            return (
              <g key={label}>
                <Pictogram name={a} x={cx} y={cy + (b ? 6 : 10)} />
                <text
                  x={cx}
                  y={b ? cy + 15 : cy + 21}
                  textAnchor="middle"
                  className={flow ? "fill-foreground text-[8.5px] font-medium" : "fill-muted-foreground text-[7.5px]"}
                >
                  {b ? (
                    <>
                      <tspan x={cx}>{a} /</tspan>
                      <tspan x={cx} dy={8.5}>
                        {b}
                      </tspan>
                    </>
                  ) : (
                    a
                  )}
                </text>
              </g>
            );
          })}
        </g>
      ))}

      <path
        d={`M${X0} ${BOTTOM} V${Y0 - 2} M${X0} ${BOTTOM} H${RIGHT + 4}`}
        className="fill-none stroke-foreground/40"
        strokeWidth={1}
      />
      <path d={`M${X0 - 2.5} ${Y0 + 2} L${X0} ${Y0 - 3} L${X0 + 2.5} ${Y0 + 2}`} className="fill-none stroke-foreground/40" strokeWidth={1} />
      <path
        d={`M${RIGHT} ${BOTTOM - 2.5} L${RIGHT + 5} ${BOTTOM} L${RIGHT} ${BOTTOM + 2.5}`}
        className="fill-none stroke-foreground/40"
        strokeWidth={1}
      />

      {LEVELS.map((level, i) => (
        <g key={level} className="fill-muted-foreground/70 text-[7.5px]">
          <text x={X0 - 5} y={Y0 + (2 - i) * CH + CH / 2 + 2.5} textAnchor="end">
            {level}
          </text>
          <text x={X0 + i * CW + CW / 2} y={BOTTOM + 11} textAnchor="middle">
            {level}
          </text>
        </g>
      ))}
      <text
        transform={`translate(8 ${Y0 + CH * 1.5}) rotate(-90)`}
        textAnchor="middle"
        className="fill-muted-foreground text-[7.5px] uppercase tracking-wider"
      >
        challenge
      </text>
      <text x={RIGHT + 6} y={BOTTOM + 22} textAnchor="end" className="fill-muted-foreground text-[7.5px] uppercase tracking-wider">
        skill
      </text>
    </svg>
  </figure>
);

export default FlowChart;
