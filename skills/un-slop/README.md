# un-slop

A skill for designing app screens that do not look AI-generated. It replaces
"make it clean and modern" with a process:

```
concept -> directions -> design -> render -> critique -> refine
```

- **Concept:** start from a concrete thing in the app's own world (a running
  app built around an athletics track), not from adjectives.
- **Directions:** build the same key screen three genuinely different ways
  before committing to one.
- **Render:** screenshot the screens at real iPhone resolution and judge the
  pixels, not the code.
- **Critique:** scan the source for the usual tells, then review the images
  against a catalogue of them.
- **Refine:** fix, re-render, repeat, with a stop rule.

## Install

**Any agent** via [vercel-labs/skills](https://github.com/vercel-labs/skills):

```bash
npx skills add Lokendrakushwah12/lokendra.tech --skill un-slop
```

**By hand:**

```bash
git clone https://github.com/Lokendrakushwah12/lokendra.tech.git
cp -R lokendra.tech/skills/un-slop ~/.claude/skills/
```

## Use it

> "redesign the home screen of my habit app, it looks like every other app"

> "the onboarding looks vibe-coded. give it some personality"

> "design the paywall for my language app, but not the usual gradient card"

## What's in here

- `SKILL.md` — the six steps and what each one is there to prevent
- `references/concepts.md` — where concepts come from, and how to tell a concept
  from a mood
- `references/slop-patterns.md` — the tells, why each reads as generated, and
  what to do instead
- `scripts/render.mjs` — renders HTML screens at 393 x 852 points, 3x, with
  headless Chrome, plus a side-by-side sheet for comparing directions
- `scripts/slop-scan.mjs` — finds the tells that can be found in source (14
  rules: purple gradients, gradient text, frosted glass, uniform radius and
  shadow, emoji icons, stock copy and more)

Both scripts need Node and nothing else; `render.mjs` also needs Chrome,
Chromium, Edge or Brave installed. Each has a `--self-test`.

## What it won't do

- **Guarantee taste.** A clean scan is not a good design. The scan is a
  tripwire; the judgement happens on the rendered images.
- **Trade usability for concept.** Contrast, touch targets and platform
  navigation win every conflict.
- **Give an iPhone-accurate render off macOS.** The system font is only
  Apple's San Francisco on a Mac; elsewhere the script says so.

## Provenance

The workflow is [Tobi](https://x.com/tobiadonadon_)'s, from
["How to Stop Making your Apps Look Like AI Slop"](https://x.com/tobiadonadon_/status/2106430529113301163):
start from a concept, explore three directions, render at iPhone resolution,
critique for the signs of generated UI, refine. Their own skill is shared
privately and I have not seen it. This is an independent implementation written
from that public description; the concept tests, the catalogue of tells and both
scripts are mine.

## Evaluation

Three tasks (a sleep app's home screen, restyling a generic invoice dashboard,
a paywall with a fixed brand colour) were run once with the skill and once
without, and graded on 27 assertions: **25/27 with the skill, 13/27 without**,
at about 46% more tokens and twice the time.

Most of that gap is process. Without the skill every run designed one direction
and never compared alternatives, and those steps are what the assertions check,
so that part is circular. Asked separately which final image looked less
generated, the graders picked the with-skill screen in all three tasks, but
that was one grader per task and not blind. One run per configuration.

Two revisions came from reading the runs. On the dashboard the with-skill run
rewrote the banner copy after being told not to change what was on the page,
where the run without the skill left it and proposed a replacement; the skill
now treats words, order and icons as content. On the paywall it claimed 44pt
touch targets that its SwiftUI did not deliver; the skill now asks for each
control to be checked in the built code. The skill has not been re-run since.
The prompts and the dashboard fixture are in `evals/`.
