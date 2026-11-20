# Scoring a post by opportunity

The audit ranks by one question: *if this post were improved, how many more
visitors would arrive?* Everything here serves ordering the queue. None of it is
a forecast.

`assets/opportunity.ts` implements what follows. Read this for the reasoning and
the limits, then adapt the thresholds to the site's size.

## Windows

Compare the last 28 days with the 28 before. Twenty-eight is four whole weeks, so
weekday patterns cancel out; a 30-day window does not line up and adds a wobble
that looks like a trend.

Search Console data lags by two to three days. End the window where the data is
complete, not today, or the current window is always short and every post looks
like it is declining.

## The three levers

Score every post three ways. The largest wins, and the winner decides what kind
of fix to draft, which is the point: a post that lost traffic and a post nobody
clicks need different work.

### recover

```
recover = max(0, clicks in previous window - clicks in current window)
```

A regression. Something changed: a competitor, a title rewrite, an indexing
problem, a broken page. The fix is to find out what and undo it.

### ctr

For rows already on page one (position 10 or better):

```
ctr = max(0, expectedCtr(position) x impressions - clicks)
```

The post is being shown and not chosen. The fix is the title and description,
the only two things the searcher sees.

### rank

For rows on page two (position 11 to 20):

```
rank = max(0, expectedCtr(page-one target) x impressions - clicks)
```

The post is close and not visible. The fix is a content push: depth, internal
links, matching the query's actual intent.

This is deliberately conservative. Impressions themselves rise when a query
moves to page one, and the formula ignores that. Underestimating keeps `rank`
from drowning out measured losses.

## The click-through curve

`ctr` and `rank` need a model of how many clicks a position should earn. The
shipped default is a rough organic curve:

| Position | Expected click-through |
|---|---|
| 1 | 28% |
| 2 | 15% |
| 3 | 10% |
| 4-5 | 6% |
| 6-7 | 4% |
| 8-10 | 2.5% |
| 11+ | 1% |

Treat it as a placeholder. Real curves vary a lot by site and query type: brand
queries click far above it, and queries answered on the results page (featured
snippets, AI Overviews) click far below it at every position.

**Fit your own as soon as you can.** `fitCtrCurve()` pools the site's own query
rows into the same bands and uses the click-through rate actually earned,
keeping the default for any band with too little data. A fitted curve turns the
question from "worse than the internet's average" into "worse than our own posts
at the same position", which is the comparison a title fix can actually close.

## Worked example

A post with 329,454 impressions at average position 9.4 produced 857 clicks in
28 days.

| | |
|---|---|
| actual click-through | 857 / 329,454 = 0.26% |
| expected at position 9.4 | 2.5% |
| gap | 2.24 percentage points |
| gap x impressions | about 7,380 clicks |

That is what puts it at the top of the queue, above every post that is merely
old. The scorer's self-check reproduces this number.

## Why the estimate over-counts

Search Console's page-level position is an average across every query the page
appeared for. A page at "position 9.4" might be at 3 for one query and 40 for
fifty others. Applying one curve value to the blended average over-counts the
real headroom.

Two ways to tighten it, in order of effort:

1. **Score query rows, not page rows.** Pull `page x query` and pass one row per
   query. Each query is scored at its own position, and the sum is far closer
   to the truth. Do this when the API is available.
2. **Fit the curve**, as above.

Even with both, present the number as "about N clicks of headroom", used for
ordering. Never as "this edit will add N clicks".

## Guardrails

**Low visibility.** Below a floor of impressions per window (500 is a starting
point; lower it for small blogs), a post is not ranked at all. A 0% click rate
on 40 impressions is not an opportunity. Label these posts low-visibility in the
report so they are visibly excluded rather than silently missing; they are
candidates for the generator's cannibalization check or for deletion, not for
editing.

**Real loss.** A measured drop surfaces above every estimate. Require both:

- a material absolute drop (30 clicks is a starting point), and
- a real proportional one (25%).

Either alone misfires. Absolute only: a huge post that wobbled 2%. Proportional
only: a post that went from 4 clicks to 2.

**Cooldown.** Skip posts inside a measurement window. See
`references/measurement.md`.

## Sizing the thresholds

The defaults suit a blog with tens of thousands of monthly impressions. For a
small blog, scale `minImpressions` and `minAbsoluteDrop` down until the queue
holds a workable number of posts, roughly five to fifteen a week. A queue of
sixty is a queue nobody reads.

## What the report should show per post

The lever, the estimate, and the three inputs that produced it (clicks,
impressions, position, with the previous window's clicks). A bare score invites
argument; the inputs let the reviewer see in one line why the post is there.
