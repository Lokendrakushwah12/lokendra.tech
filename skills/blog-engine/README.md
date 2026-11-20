# blog-engine

A skill for building a self-hosted **SEO/AEO blog engine**: a scheduled job that
finds the posts worth fixing, suggests the fix small enough to review in
seconds, writes new posts for search demand nothing on the blog answers, and
then measures whether any of it worked.

The agent only suggests. A person approves, and separate code does the writing.

## Install

**Any agent** via [vercel-labs/skills](https://github.com/vercel-labs/skills):

```bash
npx skills add Lokendrakushwah12/lokendra.tech --skill blog-engine
```

**By hand:**

```bash
git clone https://github.com/Lokendrakushwah12/lokendra.tech.git
cp -R lokendra.tech/skills/blog-engine ~/.claude/skills/
```

## Use it

Describe what you want; the skill triggers on its own:

> "our blog is on sanity and nobody has touched most posts in a year. i want a
> weekly job that says which are worth updating and suggests the fix, but no llm
> editing the site on its own"

> "i rank at position 8-15 for a bunch of queries and get no clicks. what should
> i fix and what should i write next?"

> "my boss wants to know if the 30 seo edits we made last quarter worked"

## The three parts

| Part | Question | Needs |
|---|---|---|
| **Audit** | Which existing post is worth fixing, and how? | Search Console data, read access to posts |
| **Generator** | What demand do we have no post for? | the audit's data, a source of truth for facts and code |
| **Measurement** | Did that edit or post do anything? | a table and two scheduled readings |

### Audit

Posts are ranked by headroom, not age. Each is scored three ways and the largest
decides the fix:

| Lever | Estimates | Fix |
|---|---|---|
| `recover` | clicks lost versus the previous 28 days | undo the regression |
| `ctr` | clicks the post's position should have earned | title and description |
| `rank` | clicks a page-two post would gain on page one | content push |

A suggestion can change the SEO title, the SEO description, or one exact phrase
or link. Anything bigger is a person's job.

### Generator

Topics come from near-misses: queries the site already shows for at positions
5-20 with no dedicated post. Every draft passes four checks in code before it is
saved anywhere: strategy, structure, code provenance (every snippet carries the
docs URL it came from), and cannibalization (no existing post already owns the
query).

### Measurement

Every live edit gets a before-snapshot of the post **and of the whole blog for
the same dates**, re-read at 28 and 56 days. A post up 20% means nothing if the
blog is up 20%.

## What's in here

- `SKILL.md` — the guide: the three parts, the write path, the surface, checks
- `references/scoring.md` — the levers, the click-through curve, guardrails
- `references/gates.md` — topic selection and the four gates
- `references/write-path.md` — the approve handler, and the git-native version
  for blogs with no CMS
- `references/measurement.md` — the control, cooldowns, and the three AI-answer
  segments (crawl, cite, click)
- `assets/opportunity.ts` — dependency-free scorer with a self-check
- `assets/schema.sql` — the tables

## What it won't do

- **Forecast.** The opportunity number orders the queue. It is not a promise of
  clicks.
- **Rewrite posts.** Edits are one swap.
- **Publish on its own**, apart from two mechanical classes: a dead link with a
  known replacement, and filling an empty SEO field.
- **Pretend citation data is solid.** It is thin and mostly manual.

## Provenance

The design follows [harsehaj](https://x.com/harsehaj)'s write-up of blogEO, the
engine they built at Browserbase:
["how i built an SEO/AEO blog engine"](https://x.com/harsehaj/status/2091690736211112005).
The three levers, the no-write-tool rule, the four gates and the blog-wide
control are theirs. This skill generalises them beyond one stack (a CMS or posts
in git, Slack or pull requests), scores query rows instead of page averages to
reduce the over-count they note, and adds a fitted click-through curve.

It pairs with [ai-visibility](https://github.com/Lokendrakushwah12/ai-visibility),
which builds the crawl capture and citation probes that the measurement part
leaves as optional.

## Evaluation

Three tasks (Sanity + Slack audit, a solo MDX blog from CSV exports, fixing a
generator and measuring past edits) were run once with the skill and once
without, and graded on 32 assertions: **32/32 with the skill, 12/32 without**,
at about twice the tokens.

Read that gap with care. The assertions were written from the skill's own
design, six of them hang on one choice (an approve-and-write path the baseline
did not build), and several pass either way. One run per configuration, so
there is no variance estimate.

Three revisions came from reading the runs: compiling snippets against the SDK
(a baseline's idea, and a better catch for invented APIs than a source URL
alone), making the cooldown block instead of warn, and fixing the baseline
window at approval. The skill has not been re-run since those changes. The
prompts are in `evals/`.
