---
name: un-slop
description: Design or redesign app screens so they do not look AI-generated — start from a concrete visual concept taken from the app's own world, explore three genuinely different directions before committing, render the screens at real phone resolution, then scan and critique the pixels for the usual tells (interchangeable rounded cards, soft purple gradients, template dashboards, emoji icons) and refine. Use this whenever the user asks to design, redesign, restyle or polish a mobile or web app UI, wants it to look less generic, less templated, less "vibe-coded" or less like AI made it, asks for a distinctive visual identity or art direction for an app, says the app "looks like every other app", "has no personality" or "looks like a template", or asks for onboarding, home, paywall or dashboard screens — even when they only say "make it look good", "make it premium" or "clean it up".
---

# Un-slop

AI-built interfaces are usually attractive and almost always the same: the same
rounded cards, the same soft gradient, the same dashboard. Put ten side by side
and they read as one product. Attractive and different are not the same thing,
and this skill is about the second one.

The cause is not taste, it is process. A model asked for "clean, modern,
premium" has nothing to design *from*, so it returns the average of every
interface it has seen, commits to it in the first response, and never looks at
the result. So the fix is a process:

```
concept -> directions -> design -> render -> critique -> refine
```

Each step exists to block one specific failure. Do not skip one because the
request seems small; a single screen goes through the same six steps, just
faster.

## Before anything: read the app

For a redesign, read the existing screens and note what must not change: the
information on each screen, the actions available, the navigation. This skill
changes the visual language, not what the app does. Then find out, from the
code or by asking once:

- what the app is *for* and the moment someone opens it (on a run, in bed, at a
  shop counter);
- the stack the real screens are built in (SwiftUI, React Native, Flutter, web);
- any fixed brand elements (a logo, a colour the user will not give up).

## 1. Concept

Adjectives are not a concept. "Clean", "minimal", "premium", "playful" and
"modern" describe every app, so they select nothing. A concept is **a concrete
thing from the app's own world that the interface can be built out of**: an
object, a place, a material, a printed artefact, a ritual.

- A running app built around an athletics track.
- A sleep app that feels like a village going to sleep, window by window.
- A plant app made of paper cut-outs.
- An Italian course that borrows from Neapolitan playing cards.

Write at least five candidates before choosing any. The first one or two are
the average again; the useful ones arrive after the obvious are on the page.
`references/concepts.md` has where to look for candidates and the tests that
separate a concept from a mood.

A real concept decides things. For each candidate, say in one line what it does
to all five of: **typography, layout, colour, illustration or material, motion**.
If it only changes the palette, it is a theme, not a concept; drop it.

## 2. Three directions

Committing to the first idea is the single biggest reason AI design is
predictable. So do not design the app yet. Take the three strongest candidates
and build **the same one key screen** in each, usually the screen people see
most.

The three must differ in kind, not in tint. Three concepts, three layouts,
three type systems. If you could turn one into another by swapping colour
tokens, you have one direction and two recolours.

Build each as a single self-contained HTML file sized to a phone viewport. HTML
is the sketching medium here even when the app is native: it is fast, it
renders anywhere, and nothing about it leaks into the real codebase.

Render the three and compare them side by side (step 4 has the command). Then
choose, and write down why in two or three lines: which one is most clearly
*this* app, which survives real content, which the user's constraints rule out.
If the user is in the conversation, show them the comparison with your
recommendation and let them pick; otherwise pick and say so.

## 3. Design

Now carry the chosen direction across the real screens.

- **Derive the system from the concept**, then reuse it: the type scale, the
  spacing unit, the shapes, the palette and where each colour is allowed.
  Write these down as tokens before the second screen, or the screens drift.
- **Use real content.** Real names, real numbers, a long title, an empty list.
  Placeholder text hides exactly the problems that make a layout a template.
- **Spend the concept in a few places, fully.** Three elements that carry it
  completely beat thirty that hint at it. A concept sprayed on every control
  turns into a theme park and gets in the way of using the app.
- **Usability does not bend.** Text contrast, 44pt touch targets, readable body
  size, a visible focus and pressed state, and the platform's standard
  navigation gestures all stay. If the concept fights one of these, the
  concept gives way.

## 4. Render

Do not judge a design from its code. The problems that matter (weak hierarchy,
uneven spacing, a screen that looks like a template) are only visible in
pixels, at the size a person will hold.

```bash
node scripts/render.mjs screens/            # every .html in the folder
node scripts/render.mjs a.html b.html c.html --sheet compare.png
```

`scripts/render.mjs` screenshots each file with headless Chrome at 393 x 852
points and 3x scale (1179 x 2556 pixels, a current iPhone). `--sheet` also
writes one image with the screens side by side, which is the one to look at
when comparing directions. It needs Chrome, Chromium, Edge or Brave installed
and nothing else. Run it with `--help` for other devices and sizes.

For Apple's San Francisco in these sketches, write the family as
`-apple-system, system-ui, sans-serif`. `system-ui` is what Chrome resolves to
San Francisco on macOS; `-apple-system` on its own is a Safari name, and Chrome
falls back to a serif for it, which is easy to mistake for a design choice.

Then **open the images and look at them**. On another OS the system font is not
Apple's; say so rather than claiming an iPhone-accurate render. When the app
runs in a simulator or a browser, screenshot the real thing too once it is
implemented: the HTML sketch and the shipped screen are different artefacts.

## 5. Critique

Two passes, because they catch different things.

**The scan** finds the tells that can be found in source:

```bash
node scripts/slop-scan.mjs screens/ src/
```

It reports patterns such as indigo-to-purple gradients, gradient text, frosted
glass cards, emoji used as icons, the same radius and shadow on everything, and
stock hero copy, with file and line. It is a tripwire, not a verdict: a clean
scan does not mean the design is good, and a hit is a question ("is this here
for a reason?"), not an automatic failure.

**The look** is done on the rendered images, as a reviewer who did not make
them. `references/slop-patterns.md` has the full catalogue. The checks that
decide most cases:

- **Swap test.** Cover the logo. Could this screen belong to a different app in
  a different category? If yes, the concept is not in it yet.
- **Concept trace.** Point at the elements that carry the concept. Fewer than
  two on a screen means it has reverted to the average.
- **One focal point.** Squint. One thing should win. If four things are the
  same weight, there is no hierarchy.
- **Card count.** If the screen is a stack of identical rounded rectangles, ask
  what each would be if it were not a card: a row, a line of text, a number on
  the background.
- **Every gradient and shadow has a job.** Decoration that could be deleted
  without anyone noticing should be deleted.
- **Spacing has a rhythm.** Gaps come from a small set of values. Count the
  distinct gaps on the screen; more than four or five is drift.

Write the findings as a short list, each tied to a screen and an element.

## 6. Refine

Fix what the critique found, render again, look again. Usually two passes;
stop at three. If a screen is still generic after three, the problem is
upstream: the concept is too weak to decide anything, so go back to step 1 for
that screen rather than polishing further.

Stop when the swap test fails for the right reason on every screen, the scan's
remaining hits are each deliberate, and nothing in the usability list was
traded away.

## Then build it

Implement the chosen design in the app's real stack, from the tokens. Do not
paste the HTML sketch into a native app. Run it, screenshot it at device size,
and put it through steps 4 and 5 once more, because fonts, safe areas and real
data change things.

## What to show the user

1. The concept in one sentence, and the two it beat with one line each on why.
2. The side-by-side of the three directions.
3. The final screens, rendered.
4. What the critique found and what changed because of it.
5. Anything left that you would still fix, and anything the concept gave up to
   usability.

## Reference files

- `references/concepts.md` — where concepts come from, the five things a
  concept must decide, tests for a weak one, worked examples
- `references/slop-patterns.md` — the catalogue of tells, why each reads as
  generated, and what to do instead
- `scripts/render.mjs` — render HTML screens at phone resolution, with an
  optional side-by-side sheet
- `scripts/slop-scan.mjs` — scan source for the tells that can be found in code
