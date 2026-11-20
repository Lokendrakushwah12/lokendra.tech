# The tells

What makes an interface read as generated, why, and what to do instead. Use
this on the rendered images in the critique step. The ones marked **scan** are
also caught by `scripts/slop-scan.mjs`.

None of these is forbidden. Each is a default, and the problem is a screen made
only of defaults. One deliberate gradient is a choice; a gradient on the
header, the button and the avatar ring is habit. For every hit, ask what it is
doing there. If the answer is "nothing in particular", remove it.

## Colour

| Tell | Why it reads as generated | Instead |
|---|---|---|
| Indigo-to-purple or blue-to-violet gradient (**scan**) | The most common default in generated UI | A flat colour from the concept's palette; a gradient only where the real thing has one (a sky, a glaze) |
| Gradient text on headings (**scan**) | Decoration with no source | Solid text; put the emphasis in size or weight |
| Tinted circle or rounded square behind every icon (**scan**) | Component-library default | The icon alone, or a mark that belongs to the concept |
| Soft coloured blobs blurred in the background (**scan**) | Fills empty space without meaning | Leave the space empty, or use a texture the concept provides |
| Five or six accent colours used once each | No palette decision was made | Two or three colours, each with a rule for where it appears |
| Dark mode that is pure grey with one neon accent | The default dark theme | Derive dark from the concept too: night on the track, ink on dark paper |

## Shape and surface

| Tell | Why | Instead |
|---|---|---|
| Everything is a rounded card with a soft shadow (**scan**) | The universal container | Ask what each card would be if it were not a card: a row, a ruled line, a number on the background |
| The same large radius on every element (**scan**) | One token applied everywhere | A radius scale tied to size, or the concept's own shape (a ticket's notch, a tab's corner) |
| Frosted-glass panels (**scan**) | Trend applied without a layer to justify it | Opaque surfaces; blur only over real content that scrolls underneath |
| Pill badges on everything | Cheap way to add colour | Plain text labels, or one badge type with one meaning |
| Cards that scale up on hover or press (**scan**) | Default interaction flourish | A pressed state that fits the material: an ink press, a lane highlight |

## Layout

| Tell | Why | Instead |
|---|---|---|
| Greeting, then a row of stat tiles, then a list of cards | The template dashboard | Lead with the one thing the person opened the app for; let the data's shape set the layout |
| Three or four equal tiles in a grid (**scan**) | Symmetry by default | Unequal weights; the most important item gets the most room |
| Everything centred (**scan**) | Avoids deciding an alignment | A strong left edge or a grid borrowed from the concept |
| Every section has the same heading, subheading and card rhythm | One block repeated | Vary the density: a tight list, then one large element, then a quiet line |
| A hero illustration on every empty state | Filler | One line of useful text and the action |

## Typography

| Tell | Why | Instead |
|---|---|---|
| One neutral sans at three sizes for everything (**scan** flags Inter or Poppins as the only family) | Safe default | A type choice the concept makes: a display face for numerals or titles, the system face for reading |
| Headings only slightly larger than body | Timid hierarchy | A real jump in scale; one thing on the screen is much bigger than the rest |
| Large numbers with a tiny grey label under each, repeated | Stat-tile habit | Put the number in a sentence, or give one number the stage |
| All-caps tracking-wide micro labels over every section | Decoration | Sentence-case labels, only where a label is needed |

## Copy

Copy is content, not look. In a redesign, report these and propose a
replacement; do not rewrite the user's words unless they asked for that. The
same goes for removing an icon that carries meaning or reordering items.

| Tell | Why | Instead |
|---|---|---|
| "Welcome back, Alex", with a wave emoji (**scan**) | The stock opener | Start with the content, or say something only this app would say |
| "Unlock", "Elevate", "Supercharge", "Seamless", "Effortless", "All-in-one" (**scan**) | Marketing filler | The specific thing the person gets |
| Emoji as icons or bullets (**scan**) | Fastest way to add "personality" | Icons or marks drawn in the concept's material; or no icon |
| Lorem ipsum or "John Doe", "Item 1" | Design was never tested on content | Real, awkward content: a long title, a zero, a missing photo |

## Motion

| Tell | Why | Instead |
|---|---|---|
| Everything fades up on load | Default entrance | One motion that shows the concept, and stillness elsewhere |
| Springy bounce on every tap | Library default | Motion borrowed from how the real thing moves |

## The image-only checks

These cannot be scanned. Do them on the render.

- **Swap test.** Hide the logo; could this be any other app?
- **Concept trace.** Point at two elements that carry the concept.
- **Squint.** One focal point survives; the rest recede.
- **Gap count.** List the distinct vertical gaps. More than four or five means
  no spacing system.
- **Edge check.** Do left edges line up down the screen, or does every block
  have its own inset?
- **Thumb check.** Primary action reachable; targets at least 44pt; nothing
  important under the home indicator or the status bar.
- **Contrast.** Body text passes against its background, including text on
  colour and text on images.

## Reporting

One line per finding: screen, element, the tell, the fix. Then render again and
check each line off. Do not report a tell you have decided to keep without
saying why it stays.
