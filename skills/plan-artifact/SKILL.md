---
name: plan-artifact
description: >-
  Build a decision-ready plan page (an Artifact) that a manager or the whole org can read in one
  screen and an engineer can execute: the outcome as measured before/after numbers, the one
  decision needed, where the time or cost goes today, a phased timeline with "done when" checks,
  risks with fallbacks, rejected alternatives with evidence, and a folded evidence section. Every
  number comes from a run, a log or an API and is tagged measured or estimate; the mechanism is
  explained with small animated, interactive figures. Use for any "make a plan", "proposal",
  "roadmap", "write this up for my manager", "speed up X", "cut cost of Y", "migration plan",
  "phase this work", or when turning an investigation into something people will act on.
---

# Plan artifact

A plan page has two readers. The **manager** reads the first screen and decides. The **engineer**
reads the rest and executes. Build for both, in that order. The reference build is the CI page this
skill came from: 4.5 minutes to under one, in ten working days, with no rule switched off.

## 1. Measure before you write

- **Audit first.** Pull the real data before you plan anything: the last 150 to 1,000 runs, jobs,
  requests or invoices. Split the thing being improved into its parts (for a pipeline: waiting,
  setup, running) at p50 and p95. Fix the biggest bucket first, and let the data, not the
  request, say where that is.
- **Every number has a source.** That means a command you ran, a log line, an API response, or a
  timed run (median of 3 cold runs, with the machine named). Mark anything else `estimate` and say
  what it is scaled from.
- **Define each headline metric in one sentence,** such as where the clock starts and stops, and
  which runs count. Each phase is measured again the same way when it ships.
- **Word the outcome as narrowly as the data allows.** Say "PR waiting removed", not "engineering
  hours saved". Say "runner-minutes", not dollars, unless you know the rate. A manager reads every
  word literally.
- **Seed a test when the before-state is clean.** If the current system reports zero problems, you
  can't compare tools on it. Write one input with one known violation per rule or case, and run
  every option on that.
- Keep the constants in one block at the top of the script. Every readout, table and sentence comes
  from those constants, so the prose and the figures can't disagree.

## 2. The page structure

Write the sections in this order. Leave a section out only if it truly has nothing in it.

1. **Eyebrow + h1 + dek.** The eyebrow is `proposal · <system> · <scope> · <start> → <end>`. The h1
   is the outcome, not the activity ("PR checks in under a minute"). The dek is two sentences: the
   pain today, and the promise with its one guardrail ("…without switching off a single rule").
2. **Outcome strip.** Four numbers at most, each shown as `before → after`, with the before struck
   through. Below it, one line saying what is measured and what is estimated.
3. **Decision needed.** One boxed paragraph: what you need, from whom, by when, and where you
   land without it. If nothing needs approval, say "no decision needed: this ships without
   sign-off".
4. **01 Where it goes today.** One sentence, then the figure that shows the breakdown, with a
   control that replays it after each phase.
5. **02 Plan.** The timeline figure. Then a table with one row per phase: result after it, the gain
   per month, the saving, and a status tag (`measured`, `estimate`, `needs approval`). Then one card
   per phase:
   - **change:** what ships, in a sentence or two
   - **where:** the files or systems it touches, in code font
   - **done when:** 2–3 conditions anyone can check, joined by `·`, e.g. "step <3s median over 50
     runs · a seeded violation goes red"
   - **also day 1:** only for work that must start early
6. **03 Risks and fallbacks.** A three-column table: `if` / `then` / `we land at`. Every risk ends in
   a number or "no worse than today".
7. **04 Why not the alternatives.** The options you rejected, with the evidence that rejected them,
   ideally a figure where the reader can switch between options.
8. **05 Rules we keep.** Two to four guardrails that hold throughout, such as "the full check
   guards main", "never check less", "old and new side by side", "one PR per phase with
   before/after numbers".
9. **Evidence, folded.** One `<details>` holding sample sizes, date ranges, medians and how each
   estimate was scaled.

Numbered `h2`s (`01`–`05`) only, because the order is real. Nothing above the outcome strip but the
title block.

## 3. Timelines

- **Compress by running things in parallel.** Ask "can this be done in a week or ten days?" before
  the user does. Anything slow that needs no attention, like a shadow run of a new tool, a cost
  approval or a data backfill, starts on day 1 as a dashed background row.
- **The long pole is usually a person, not code.** Put the approval request on day 1, name the date
  it's needed by, and say where you land without it.
- One phase is one PR or one change, with its own before/after. Phases that are code-only and need
  no sign-off go first.
- Flag holidays that fall inside the window.

## 4. Figures

**Take the techniques, not the figures.** `reference/example.html` is one finished page, kept to
show the section order, the hierarchy and how data drives a figure. It is not a template. A plan
for a migration, a cost cut or a launch that comes out looking like that CI page has failed.

From the reference, reuse only the mechanics: the `fig()` / `spring()` / `label()` helpers, which
come from the `explorable-explainer` skill, the pattern of one data block at the top of the script
that every readout is computed from, and the outcome / decision / phase-card markup. Then:

- **Invent every figure from this plan's own parts and units.** Draw the thing the plan changes:
  a request path, a cost curve, a schema moving between databases, a rollout across regions. A
  stacked-time replay and a day Gantt fit only when the problem really is time through a pipeline
  on a calendar. For anything else, find the shape that this topic has and others don't.
- Two or three figures are usually enough: what it looks like today, what changes over the plan,
  and the evidence against the alternatives. Each makes one claim, has one control and at most
  three readouts, opens on a still frame that makes sense on its own, autoplays until the reader
  touches it, and respects `prefers-reduced-motion`.
- Captions say how to read the figure and which numbers in it are measured.

## 5. Look and copy

- **The look follows the subject.** Pick the palette, type pairing and figure style from what the
  plan is about and who reads it (an infra plan, a product launch, a finance case), using the
  `artifact-design` guidance. Do not reuse the reference's colours or fonts by default. When the
  user names a theme or a past page to match, follow them exactly.
- **Hierarchy holds whatever the look:** the outcome numbers are the biggest text after the h1, the
  decision box is the most prominent element on the page, and nothing above the outcome strip
  but the title block.
- **Copy:** short declarative sentences. No hype, no "let's dive in", no em-dash asides, no recap
  paragraph at the end. Sections are a figure or a table plus at most two short paragraphs.
- **When the user asks only for UI changes, change only the UI.** Keep every section, sentence and
  number. When they ask for structure, keep the figures they liked.
- Pages are private by default. Remind the user to share from the page's Share menu before sending
  the link.

## 6. Check before publishing

- Run the script once (`node -e "new Function(js)"`) to catch syntax errors.
- Take a headless Chrome screenshot of the whole page and look at it: `--headless=new
  --window-size=1000,6500 --virtual-time-budget=3000 --screenshot=...`.
- Check for overflow at the narrowest headless width (Chrome's headless minimum is 500px, so a
  400px screenshot looks clipped when it isn't): read `scrollWidth === innerWidth` from a test copy.
- Render the light theme too (`--blink-settings=preferredColorScheme=1`).
- Check that every number on the page appears in the evidence or the constants, and that every
  estimate is tagged.
- Make sure no wide table pushes a status column out of view; drop a column that the timeline
  already shows.

## 7. Publish

Publish with the Artifact tool: the `icon` `chart` and a one-sentence `description`. Update the
same file path so the URL doesn't change. Report the link, the four outcome numbers, what is
measured versus estimated, and the decision needed.
