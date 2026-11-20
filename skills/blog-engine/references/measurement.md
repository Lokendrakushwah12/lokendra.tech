# Measuring whether it worked

An engine that edits and never measures produces a changelog. This is the part
that turns it into evidence, and the part most builds leave out.

## Edits: a before, and a control

When an approved edit goes live, record two things for the 28 days before:

- the **post's** clicks, impressions and average position;
- the **whole blog's** clicks and impressions for the same dates.

Then re-read both at 28 and at 56 days, over a window of the same length.

**The window is fixed when the edit goes live.** The approve handler stores the
baseline's start and end dates on the edit's row as part of enrolment. Search
data lags two to three days, so the window ends at the last complete day, not
at the moment of approval. Two ways to get the numbers, in order of preference:

1. fetch them in the handler, right after the write;
2. if the handler cannot reach the search data (a git-native setup where
   enrolment runs in CI, say), store the dates, mark the baseline pending, and
   let a scheduled job fill it in. Search Console keeps well over a year of
   history, so a later fetch for the stored dates returns the same numbers.

What does not work is computing the window from the time the job runs. That
quietly moves the baseline past the edit, so some of the "before" is after. A
pending baseline is retried until it is filled, and reported while it is not.

The blog-wide reading is the control. Search traffic moves for reasons that have
nothing to do with the edit: an algorithm update, a season, a product launch,
a competitor going down. If the post is up 20% and the blog is up 20%, the edit
did nothing measurable. If the post is up 20% and the blog is flat, it probably
did.

Report the difference, not the raw change:

```
post change  = post clicks after / post clicks before - 1
blog change  = blog clicks after / blog clicks before - 1
lift         = post change - blog change
```

Exclude the edited post from the blog total when the post is large enough to
move it; otherwise a big post is partly its own control.

### Why two readings

Twenty-eight days catches a title change, which takes effect as soon as the page
is recrawled. Fifty-six catches a content change, which takes longer to rank,
and shows whether an early jump held. A single reading at 28 days declares
content edits failures before they have had time to work.

## New posts: a curve

A generated post has no before. Record its numbers at 28 and 56 days after
publish, with the blog-wide numbers for the same dates alongside, and judge it
against the target queries it was written for: is it now the page receiving
those queries' impressions, and at what position?

A new post that takes the impressions and sits at position 12 has worked as a
generator output and is now an audit candidate. That hand-off is the loop
closing.

## Cooldown

When an edit goes live, the post is locked out of further suggestions until the
56-day reading. Two edits inside one window cannot be told apart.

Enforce it in two places, and make both block rather than warn:

- **the audit** does not draft for a post in cooldown, and says how many it
  skipped so the exclusion is visible;
- **the write path** refuses an edit to a post in cooldown, and puts the reason
  on the card. This is the one that matters. A suggestion drafted before the
  cooldown began can be approved after it started, and the audit's skip never
  sees it.

The exception is hygiene: a newly dead link can be fixed during a cooldown,
because it does not change what is being measured.

## Reading results honestly

- **Small numbers are noise.** A post going from 12 clicks to 19 is "up 58%" and
  means nothing. Below roughly a hundred clicks per window, report the direction
  and the raw counts, not a percentage.
- **One post proves little; a class of edits can.** The useful question is "do
  title rewrites on `ctr`-lever posts work here?", answered across twenty edits.
  Group results by lever and edit kind in the weekly report.
- **Report losses.** An edit with a negative lift at 56 days should be listed
  with a suggestion to revert, using the stored `before`. An engine that only
  reports wins is not measuring.
- **Position can improve while clicks fall**, when impressions shift toward
  queries the post ranks worse for. Read clicks first, position second.

## AI answers: three segments

Search data covers Google's results, including AI Overviews, which are folded
into normal performance numbers. It covers nothing from ChatGPT, Claude or
Perplexity. Split "AI referral" into three questions; they have different
sources and different fixes, and adding them together produces a number that
means nothing.

| Segment | Asks | Source | If it is zero |
|---|---|---|---|
| **crawl** | Does an engine fetch the page? | server or CDN logs, by user agent | check robots rules, rendering, and whether the page is linked at all |
| **cite** | Is the post named or linked in answers? | probes run against the models, or a visibility tool's export | the page is readable and not chosen: answer the question more directly, earlier |
| **click** | Does anyone arrive? | referrer domain on the analytics the site already has | cited and not clicked is common; the answer satisfied the reader |

Store each as its own row per post, per engine, per date
(`blog_aeo_signals` in `assets/schema.sql`), so the report can give a diagnosis
per post rather than a total.

Practical notes:

- **Click is the cheapest to ship**, because it needs no new infrastructure:
  classify sessions by referrer domain (`chatgpt.com`, `claude.ai`,
  `perplexity.ai` and so on).
- **Cite is usually a manual export.** Several visibility tools expose citation
  data only as a downloadable file. Write a parser that maps each row back to a
  post slug, and record the export date, because the data is as fresh as the
  last time someone downloaded it.
- **Crawl needs raw request logs**, which client-side analytics never sees,
  since crawlers do not run JavaScript. It often sits behind infrastructure
  access that takes time to get. Defer it openly rather than faking it.
- The `ai-visibility` skill builds the crawl capture and the citation probes in
  full. Use it for those two segments if it is available.

Expect the search winners and the cited posts to be different sets. A post can
be the site's best search performer and almost never cited. That is the reason
to track both, and the reason not to assume an SEO fix helps citations.

Citation counts move on tiny samples. Do not report week-to-week citation
changes as trends; report which posts are cited at all, and which segment each
uncited post is stuck at.

## The weekly results message

Lead with what a person can act on:

1. edits that reached a reading this week, with lift against the blog, grouped
   by lever;
2. generated posts that reached a reading, against their target queries;
3. anything with a negative lift at 56 days, with the revert offered;
4. the per-post AEO diagnosis for posts that changed segment;
5. posts leaving cooldown, which are eligible for the audit again.

State the blog-wide change for the period once, at the top, so every lift below
it is read in context.
