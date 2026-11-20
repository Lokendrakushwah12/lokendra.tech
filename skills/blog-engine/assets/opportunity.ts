// Opportunity scoring for a blog audit. Dependency-free: copy it in and adapt
// the thresholds. Run the self-check with `npx tsx opportunity.ts`.
//
// Every number this returns is an estimate for ORDERING a queue. None of it is
// a forecast; see references/scoring.md for why.

export type Lever = "recover" | "ctr" | "rank";

/** One row of search data: a page, or better, one query for a page. */
export type Row = { clicks: number; impressions: number; position: number };

export type Score = {
  /** the lever with the most headroom, or null when the post is unranked */
  lever: Lever | null;
  /** estimated clicks for that lever over one window */
  clicks: number;
  byLever: Record<Lever, number>;
  /** too few impressions for any estimate to mean something */
  lowVisibility: boolean;
  /** a measured loss; sorts above every estimate */
  realLoss: boolean;
};

export type Options = {
  /** impressions per window below which a post is not ranked at all */
  minImpressions?: number;
  /** a real loss needs BOTH of these, so 4 clicks -> 2 pages nobody */
  minAbsoluteDrop?: number;
  minRelativeDrop?: number;
  /** position a page-two query is assumed to reach if the content push works */
  pageOneTarget?: number;
  curve?: CtrCurve;
};

/** [position upper bound, expected click-through rate], ascending. */
export type CtrCurve = ReadonlyArray<readonly [number, number]>;

// A rough organic curve to start from. It is an industry-shaped guess, not your
// site: brand queries, featured snippets and AI Overviews all bend it. Replace
// it with fitCtrCurve() over your own query rows as soon as you have them.
export const DEFAULT_CURVE: CtrCurve = [
  [1, 0.28],
  [2, 0.15],
  [3, 0.1],
  [5, 0.06],
  [7, 0.04],
  [10, 0.025],
  [Infinity, 0.01],
];

export function expectedCtr(position: number, curve: CtrCurve = DEFAULT_CURVE): number {
  if (!(position > 0)) return 0;
  for (const [upTo, ctr] of curve) if (position <= upTo) return ctr;
  return 0;
}

/**
 * Fit the curve from your own data: the click-through rate actually earned in
 * each position band, pooled across queries. Bands with too little data keep
 * the default, because a band fitted on forty impressions is noise.
 */
export function fitCtrCurve(rows: Row[], minImpressionsPerBand = 2000): CtrCurve {
  return DEFAULT_CURVE.map(([upTo, fallback], i) => {
    const from = i === 0 ? 0 : DEFAULT_CURVE[i - 1][0];
    const band = rows.filter((r) => r.position > from && r.position <= upTo);
    const impressions = sum(band, (r) => r.impressions);
    const ctr = impressions >= minImpressionsPerBand ? sum(band, (r) => r.clicks) / impressions : fallback;
    return [upTo, ctr] as const;
  });
}

/**
 * Score one post. `current` and `previous` are the same-length windows (28 days
 * each is the usual choice). Pass one Row per query when you have query-level
 * data; a single page-level Row works but over-counts, because a page's average
 * position blends every query it shows for.
 */
export function scorePost(current: Row[], previous: Row[], options: Options = {}): Score {
  const {
    minImpressions = 500,
    minAbsoluteDrop = 30,
    minRelativeDrop = 0.25,
    pageOneTarget = 8,
    curve = DEFAULT_CURVE,
  } = options;

  const clicksNow = sum(current, (r) => r.clicks);
  const clicksBefore = sum(previous, (r) => r.clicks);
  const impressions = sum(current, (r) => r.impressions);

  const lost = Math.max(0, clicksBefore - clicksNow);
  const realLoss = lost >= minAbsoluteDrop && clicksBefore > 0 && lost / clicksBefore >= minRelativeDrop;

  const byLever: Record<Lever, number> = {
    recover: lost,
    // page one already: clicks the position should have earned and did not
    ctr: sum(
      current.filter((r) => r.position > 0 && r.position <= 10),
      (r) => Math.max(0, expectedCtr(r.position, curve) * r.impressions - r.clicks),
    ),
    // page two: clicks at a modest page-one position, minus what it gets now.
    // Conservative on purpose: impressions rise too once a query reaches page
    // one, and this ignores that.
    rank: sum(
      current.filter((r) => r.position > 10 && r.position <= 20),
      (r) => Math.max(0, expectedCtr(pageOneTarget, curve) * r.impressions - r.clicks),
    ),
  };

  // No edit fixes "nobody searches for this". A real loss still surfaces, since
  // the post had traffic to lose.
  const lowVisibility = impressions < minImpressions;
  if (lowVisibility && !realLoss) {
    return { lever: null, clicks: 0, byLever, lowVisibility, realLoss };
  }

  const lever = realLoss
    ? "recover"
    : (Object.keys(byLever) as Lever[]).reduce((a, b) => (byLever[b] > byLever[a] ? b : a));
  return { lever, clicks: Math.round(byLever[lever]), byLever, lowVisibility, realLoss };
}

/** Queue order: measured losses first, then by estimated clicks, unranked last. */
export function compareScores(a: Score, b: Score): number {
  if (a.realLoss !== b.realLoss) return a.realLoss ? -1 : 1;
  if ((a.lever === null) !== (b.lever === null)) return a.lever === null ? 1 : -1;
  return b.clicks - a.clicks;
}

function sum<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((total, item) => total + pick(item), 0);
}

// --- self-check -------------------------------------------------------------

function check(label: string, ok: boolean): void {
  if (!ok) throw new Error(`self-check failed: ${label}`);
  console.log(`ok  ${label}`);
}

export function demo(): void {
  // The worked example in references/scoring.md.
  const ranked = scorePost(
    [{ clicks: 857, impressions: 329_454, position: 9.4 }],
    [{ clicks: 860, impressions: 320_000, position: 9.6 }],
  );
  check("ranks-but-no-clicks post picks the ctr lever", ranked.lever === "ctr");
  check(`its headroom is about 7,380 (got ${ranked.clicks})`, Math.abs(ranked.clicks - 7380) <= 5);

  const invisible = scorePost(
    [{ clicks: 0, impressions: 40, position: 4 }],
    [{ clicks: 0, impressions: 35, position: 4 }],
  );
  check("tiny impressions are unranked, however bad the click rate", invisible.lever === null && invisible.lowVisibility);

  const dropped = scorePost(
    [{ clicks: 120, impressions: 9_000, position: 6 }],
    [{ clicks: 400, impressions: 21_000, position: 4 }],
  );
  check("a measured loss picks recover", dropped.lever === "recover" && dropped.realLoss && dropped.clicks === 280);

  const wobble = scorePost(
    [{ clicks: 2, impressions: 900, position: 14 }],
    [{ clicks: 4, impressions: 900, position: 14 }],
  );
  check("4 clicks -> 2 is not a real loss", !wobble.realLoss && wobble.lever === "rank");

  check("a measured loss sorts above a bigger estimate", compareScores(dropped, ranked) < 0);
  check("unranked sorts last", compareScores(invisible, wobble) > 0);

  const fitted = fitCtrCurve([{ clicks: 900, impressions: 3_000, position: 1 }]);
  check("a band with enough data is refitted", fitted[0][1] === 0.3);
  check("a band without data keeps the default", fitted[1][1] === DEFAULT_CURVE[1][1]);
}

if (process.argv[1]?.endsWith("opportunity.ts")) demo();
