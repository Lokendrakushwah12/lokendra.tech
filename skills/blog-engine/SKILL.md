---
name: blog-engine
description: Build a self-hosted SEO/AEO blog engine — a scheduled job that audits existing posts by how many clicks a fix would actually win back, drafts small reviewable edits, generates new posts for search demand nothing on the blog answers, gates every draft on automated checks, and measures each change against a before-snapshot and a blog-wide control at 28 and 56 days. The agent only suggests; a human approves and separate code does the writing. Use this whenever the user wants to grow blog or docs traffic from Google or AI answers, asks which posts to refresh or update first, wants a content audit, a Search Console opportunity report, "why do we rank but get no clicks", automated or weekly blog generation, programmatic SEO with review, a way to tell whether SEO edits worked, or to check whether ChatGPT/Claude/AI Overviews cite their posts — even when they only say "our blog is dead", "fix our SEO", "what should we write next" or "set up a content pipeline".
---

# Blog engine

Builds the loop that a neglected blog is missing: find the change worth making,
propose it small enough to review in seconds, let a person approve it, then find
out whether it worked.

Three parts, worth building in this order. Each is useful alone.

| Part | Question | Needs |
|---|---|---|
| **Audit** | Which existing post is worth fixing, and how? | Search Console export or API, read access to the posts |
| **Generator** | What demand do we have no post for? | the audit's data, a source of truth for facts and code |
| **Measurement** | Did that edit or post do anything? | a table and two scheduled readings |

Build the audit first if the user has no preference. It needs no new content, it
pays back in days, and the generator reuses all of its data pulls.

The value is not the drafting. Any model can rewrite a title. It is the ordering
(fix what has headroom, not what is old), the write path (nothing the agent
produces reaches the site without a person), and the control (a number that
moved is not evidence until you know what the rest of the blog did).

## Find out what the user has first

The design is the same on every stack; the adapters differ. Ask or read the repo
for four things before writing code:

- **Where posts live** — a CMS with an API (Sanity, Contentful, Ghost, WordPress)
  or files in git (MDX, Markdown). This decides the write path.
- **Where search data comes from** — Search Console API, or a CSV export if
  there is no API access yet. An export is enough to ship the audit.
- **Where the team already works** — Slack, Discord, GitHub, email. The engine
  reports there. Do not build a dashboard nobody will open; a tool with its own
  login is the fragmentation this exists to fix.
- **What counts as true** — product docs, a changelog, a pricing page. Fact
  checks and code snippets are verified against this, never against memory.

A solo developer with MDX in git and no Slack is a first-class case, not a
degraded one: the approval surface is a pull request, approving is merging, and
the "server-side handler" is the CI that merges it. Say so rather than asking
them to set up Slack.

## The one design decision

**The agent gets no write tool.** It can read, score, draft and post a
suggestion. It cannot change the site. A separate piece of code, with tests,
performs the write when a person clicks approve, and it re-validates everything
the agent claimed before it does.

Hold this line even when it is inconvenient, for two reasons:

- The worst a bad run can do is post a bad suggestion. Without the split, the
  worst a bad run can do is publish it.
- It puts each kind of change where it is cheap. Judgement (what is worth
  fixing, what good writing is) lives in prompt or skill files that are edited
  weekly. The write path is code, changes rarely, and is the only part that
  needs to be correct.

`references/write-path.md` has the handler's checks, the lock, and the two edit
classes that may skip approval.

## Part 1 — Audit

One run, then it ends. Button clicks are handled later by the write path,
independent of the agent's session.

1. **Pull** post metadata, search performance for the last 28 days and the 28
   before, and last run's scores. Batch the pulls; do not fetch per post.
2. **Hygiene scan every post** — broken links, dead images and embeds, empty SEO
   title or description, old product names or positioning. These are cheap, so
   run them on everything.
3. **Score every post by opportunity** and rank. See below.
4. **Fact-check only the top of the queue** against the source of truth.
5. **Draft small edits** for the flagged posts.
6. **Persist** each suggestion and a snapshot of the run, then post the summary
   with one card per suggestion.

### Rank by headroom, not age

"This post is old" is not a reason to touch it. The question to rank by is: *if
this post were improved, how many more visitors would arrive?* Score each post
three ways against the previous window; the largest estimate wins and decides
what kind of fix to draft.

| Lever | Estimates | So the fix is |
|---|---|---|
| `recover` | clicks lost versus the previous window | find and undo the regression |
| `ctr` | page-one clicks the post should have earned at its position and did not | title and description |
| `rank` | clicks a page-two post would gain on page one | a content push |

`assets/opportunity.ts` implements all three with the guardrails, dependency-free.
`references/scoring.md` explains the arithmetic, including a worked example where
a post with 329,454 impressions at position 9.4 and 857 clicks scores about 7,400
recoverable clicks, which is what puts it at the top of the queue.

Two guardrails, both because the estimate is soft:

- **Low impressions are not an opportunity.** A terrible click rate on a query
  nobody searches is not headroom, and no edit fixes "nobody is looking for
  this". Mark the post low-visibility and drop it from the ranking.
- **A real loss outranks any estimate.** A post that genuinely lost traffic
  surfaces regardless of its score. Require both a material absolute drop and a
  real proportional one, so a post going from 4 clicks to 2 does not page anyone.

Score from query-level rows when the data allows it. A page's average position
blends every query it appears for, so scoring the page as one row over-counts
the headroom. The estimate orders the queue well either way; do not present it
as a forecast.

### Ration the expensive checks

Cheap checks run on every post. Comparing a post's claims against the docs costs
real tokens, so run it on the top ~15 flagged posts, plus a small rotating
buffer drawn from the rest so that low-traffic posts are not left unverified
forever.

For that check: load the real page (never recall it), flag only direct
contradictions, and quote the source line with its URL. A fact-check that cannot
show its source is an opinion.

### Keep edits small

A suggestion may change the SEO title, the SEO description, or swap one exact
phrase or link. If the fix cannot be expressed as one clean swap, the card offers
only Edit and Skip, and a person writes it.

This is the right line for public prose. A one-swap edit can be judged in the
time it takes to read it; a rewritten section cannot, so it gets approved
unread, and unread approvals are how an engine like this ruins a blog.

## Part 2 — Generator

The audit cannot fix a blog where most posts get no traffic, because the traffic
is not there to recover. The generator goes where it is.

**The richest source is near-misses**: queries where the site already gets
meaningful impressions (150+ in the window is a workable floor) at positions
5-20, and no post is dedicated to the query. Search is already showing the site
for these; it has nothing good to show.

1. **Pick a topic** from the near-miss list, or take a requested one. A
   requested topic is not a pre-approved topic: it still gets classified,
   checked against the strategy, and run through the cannibalization check. If
   it fails, stop and ask rather than quietly writing something adjacent.
2. **Write the draft**, with every code snippet copied from the source of truth
   and carrying the URL it came from.
3. **Self-review against the writing checklist.** This is where quality is
   judged.
4. **Gate on four automated checks** before anything is saved. See below.
5. **Save as an unlisted draft** and post the card with Approve and Discard.
6. On approve, the write path publishes it and enrols it for measurement.

### The four gates

A draft that fails never reaches the CMS, so a bad run leaves nothing to clean
up. `references/gates.md` has each check in detail.

| Gate | Passes when |
|---|---|
| **Strategy** | no banned terms; the post maps to a real content cluster and reader |
| **Structure** | the post opens with a labelled summary, plus a few structural rules |
| **Code provenance** | every snippet has an http(s) source URL, and compiles against the SDK where there is one. No invented code |
| **Cannibalization** | none of the target queries is already owned by an existing post |

Give the agent two redraft attempts, then stop with no draft. An engine that
retries until something passes will eventually pass something bad.

**Cannibalization is not retryable.** A second post on a query the site already
ranks for splits the ranking between the two. Rephrasing the draft to slip past
the check produces exactly that. Identify the post that owns the query and hand
it to the audit as an edit instead.

**Gate facts and structure in code; leave taste to the checklist.** It is
tempting to keep adding prose rules to the gate. Hardcoded taste is
unmaintainable, and it is in the wrong place: whether the writing is good is the
checklist's job, done by the agent before the gate runs.

### One rule, one file

Keep three separate instruction files: **strategy** (which topics, clusters,
readers, banned terms), **writing** (voice, structure, the checklist), and
**pipeline** (the steps and tools). Two copies of a rule become two different
rules within a month. If the pipeline file starts describing what good writing
is, that sentence is in the wrong file.

## Part 3 — Measurement

Without this, the engine produces activity and no evidence. `assets/schema.sql`
has the tables; `references/measurement.md` has the method and its limits.

**Edits have a before.** When an approved edit goes live, record the post's
search numbers for the 28 days before, and **the whole blog's numbers for the
same dates**. Re-read both at 28 and 56 days.

Fix the baseline window in the approve handler, at the moment of the write:
store its start and end dates on the edit's row there, and fetch the numbers
there too if the handler can reach the search data. Leaving it to "the next
weekly run" computes the window from whenever that run happens, so the baseline
drifts into days after the edit, and a failed run leaves no baseline at all.

The blog-wide reading is the part people skip, and it is the part that makes the
number mean anything. A post up 20% tells you nothing if the whole blog is up
20%. Report the post's change *relative to* the blog's change over the same
dates, and say plainly when the difference is inside the noise.

**New posts have no before.** Measure them as a growth curve with the same 28
and 56 day readings and the same blog-wide numbers alongside.

**Put a cooldown on every edited post, and enforce it.** A second edit inside
the measurement window makes both unreadable. The audit does not draft for a
post in cooldown, and the write path refuses an edit to one. A warning is not
enough: a card can sit unapproved for a week and be clicked after another edit
to the same post has gone live.

**Order the approve handler so one failure cannot block the next step**: publish,
then enrol for measurement, then record. A failed recording must not stop
enrolment, and a failed enrolment must not stop the publish.

### Whether AI answers quote the posts

Search Console says whether Google sends people. It says nothing about ChatGPT,
Claude or Perplexity. "AI referral" is three different questions, with three
different data sources, and they must not be summed:

| Segment | Asks | Where it comes from |
|---|---|---|
| **crawl** | Does an engine fetch the page? | server logs |
| **cite** | Does it name or link the post in an answer? | probes, or a visibility tool's export |
| **click** | Does anyone arrive from it? | referrer domain; AI Overviews are folded into normal search data |

Expect the posts that win in search and the posts that get cited to be
different sets. Track them per post so the report can say *why* a post is not
cited (not crawled, crawled but never cited, cited but never clicked) rather
than only that it is not.

If the `ai-visibility` skill is installed, use it for the crawl and cite
segments; it builds exactly that capture and the probes. Otherwise ship click
first, since it needs no new infrastructure, and say that crawl is deferred.

## The surface

Report into the place the team already works, on a fixed weekly rhythm. Three
messages is enough:

- **New draft** — the week's generated post with its Approve card and a note on
  what was written and why this query.
- **Audit** — the ranked queue, hygiene findings, and one card per suggestion.
- **Results** — growth curves, the state of each measured edit, per-post AEO
  diagnosis.

The same pieces should also be callable on demand ("how is this post doing",
"draft a post about X", "run the audit").

A card starts as a suggestion and ends as a link to the live change. The states
in between need care; `references/write-path.md` covers them.

## What to tell the user it will not do

Say these up front. An engine sold as more than it is gets switched off.

- **The opportunity estimate is not a forecast.** It ranks the queue. Quoting it
  as "this edit will add 7,000 clicks" is a promise nobody can keep.
- **It will not rewrite posts.** Edits are one swap. Anything larger is a
  person's job, and the engine says so on the card.
- **Fact-checking is rationed**, so an unflagged post is not a verified post.
- **Citation data is thin.** Most visibility tools are export-only and probes
  are small samples. Treat week-to-week citation movement as noise.
- **Nothing publishes itself**, apart from the two auto-apply classes in
  `references/write-path.md`.

## Verify it works

Do not stop at "the job ran". Check, in this order:

1. Run the scorer's self-check (`assets/opportunity.ts` has one) and confirm the
   worked example comes out near 7,380.
2. Run the audit in dry mode and confirm it **writes nothing and posts
   nothing**. A dry run that still posts cards is not a dry run.
3. Feed the scorer a post with a huge CTR gap and tiny impressions; it must come
   back low-visibility and unranked.
4. Give the code-provenance gate a draft with one snippet missing its source
   URL; the draft must be refused and nothing saved.
5. Give the generator a topic an existing post already ranks for; it must stop
   and name the owning post, not produce a reworded draft.
6. Click approve twice, or from two accounts; exactly one write happens.
7. Approve an edit while the post has an unsaved draft in the CMS; the write
   must refuse.
8. After a real approve, confirm the before-snapshot row holds both the post's
   numbers and the blog-wide numbers for the same dates, and that those dates
   end before the edit went live.
9. Approve a second edit to a post in cooldown; the write must refuse.

## Reference files

- `references/scoring.md` — the three levers, the CTR curve and how to fit your
  own, the guardrails, the worked example, what the estimate cannot tell you
- `references/gates.md` — the four generator gates, near-miss selection,
  cannibalization, the redraft limit
- `references/write-path.md` — the approve handler, re-validation, the lock,
  stale drafts, auto-apply classes, adapters for a CMS and for posts in git
- `references/measurement.md` — before-snapshots, the blog-wide control, new
  post curves, cooldowns, the three AEO segments, reading results honestly
- `assets/opportunity.ts` — dependency-free scorer with a self-check
- `assets/schema.sql` — tables for runs, scores, edits, generated posts and AEO
  signals, for Postgres with SQLite notes
