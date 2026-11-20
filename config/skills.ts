// Skills I use, mine and other people's. To track a new one, add a row to its
// creator's list below (or add a creator to `creators` first).

export const creators = {
  lokendra: {
    name: "Lokendra",
    url: "https://github.com/Lokendrakushwah12/claude-s",
    repo: "https://github.com/Lokendrakushwah12/claude-s/tree/main/skills",
  },
  arlan: {
    name: "Arlan Marat",
    url: "https://design.how",
    repo: "https://github.com/arla6ka/design.how/tree/main/skills",
  },
  vercel: {
    name: "Vercel",
    url: "https://github.com/vercel-labs/skills",
    repo: "https://github.com/vercel-labs/skills/tree/main/skills",
  },
  emil: {
    name: "Emil Kowalski",
    url: "https://aiforui.dev/skills",
    repo: "https://aiforui.dev/skills",
  },
  lucas: {
    name: "Lucas Marques",
    url: "https://hairline.lucasmarkes.com",
    repo: "https://github.com/lucasmarkes/hairline/tree/main/skills",
  },
  jakub: {
    name: "Jakub Antalik",
    url: "https://transitions.dev",
    repo: "https://github.com/Jakubantalik/transitions.dev/tree/main/skills",
  },
  benji: {
    name: "Benji Taylor",
    url: "https://github.com/benjitaylor/skills",
    repo: "https://github.com/benjitaylor/skills/tree/main",
  },
  dan: {
    name: "Dan McAteer",
    url: "https://github.com/DannyMac180/skills",
    repo: "https://github.com/DannyMac180/skills/tree/main",
  },
  meng: {
    name: "Meng To",
    url: "https://fil.design/skills",
    repo: "https://fil.design/skills",
  },
  krehel: {
    name: "Jakub Krehel",
    url: "https://jakub.kr/skills",
    repo: "https://github.com/jakubkrehel/skills/tree/main/skills",
  },
  // one-skill creators: every row below passes its own link
  filip: {
    name: "Filip Wojda",
    url: "https://www.regards.design/skill",
    repo: "",
  },
  leon: { name: "Leon Lin", url: "https://tasteskill.dev", repo: "" },
  dipesh: { name: "Dipesh", url: "https://diip3sh.github.io/feel", repo: "" },
  ryan: { name: "Ryan", url: "https://skills.wheresryan.sh/anatomy", repo: "" },
  anshu: { name: "Anshu Chimala", url: "https://anshu.dev", repo: "" },
  rea: { name: "REA", url: "https://rea.tools", repo: "" },
  tobi: { name: "Tobi", url: "https://x.com/tobiadonadon_", repo: "" },
} as const;

export type CreatorId = keyof typeof creators;

export type Skill = {
  name: string;
  description: string;
  creator: CreatorId;
  href: string;
};

// a row is [name, description, link?]; the link defaults to `<creator repo>/<name>`
const by = (
  creator: CreatorId,
  rows: [name: string, description: string, href?: string][],
): Skill[] =>
  rows.map(([name, description, href]) => ({
    name,
    description,
    creator,
    href: href ?? `${creators[creator].repo}/${name}`,
  }));

export const skills: Skill[] = [
  ...by("lokendra", [
    ["claude-s", "Runs the video skills"],
    ["story-video", "Turns a story into a video"],
    ["promo-video", "Makes a product launch promo"],
    ["explainer-lesson", "Animates a narrated lesson"],
    ["explorable-explainer", "Builds an interactive explainer"],
    ["faceless-video", "Makes a faceless video"],
    ["music-video", "Animates a lyric video"],
    ["type-film", "Makes a brand motion film"],
    ["ugc-edit", "Edits talking-head footage"],
    ["aura-edit", "Makes a beat-synced hype edit"],
    ["amv-edit", "Cuts an anime music video"],
    ["archive-footage", "Finds public-domain film"],
    ["x-video-frames", "Pulls frames from a video link"],
    [
      "plan-artifact",
      "Builds a decision-ready plan page",
      "https://github.com/Lokendrakushwah12/lokendra.tech/tree/main/skills/plan-artifact",
    ],
    [
      "blog-engine",
      "Builds an SEO/AEO blog engine",
      "https://github.com/Lokendrakushwah12/lokendra.tech/tree/main/skills/blog-engine",
    ],
  ]),
  ...by("arlan", [
    ["design-system-boss", "Runs the others"],
    ["build-design-system", "Builds a system"],
    ["migrate-design-system", "Migrates onto it"],
    ["token-mapping", "Maps values to tokens"],
    ["component-docs", "Documents a component"],
    ["ui-review", "Reviews a screen"],
    ["make-font", "Makes your own font"],
    ["make-motion", "Makes a motion graphics video"],
    ["make-logo", "Makes your own logo"],
  ]),
  ...by("vercel", [["find-skills", "Finds a skill to install"]]),
  ...by("emil", [
    ["ask-emil", "Picks the right skill"],
    ["emil-design-eng", "Builds with a design engineer's eye"],
    ["break-ui", "Breaks a UI with bad data"],
    ["animate", "Builds an animation"],
    ["choreograph", "Moves elements together"],
    ["gestures", "Builds drag and swipe"],
    ["apple-design", "Adds Apple-style motion"],
    ["mobile-native", "Makes a web app feel native"],
    ["prototype", "Builds several variants"],
    ["pick-ui-library", "Picks a UI library"],
    ["animation-vocabulary", "Names a motion pattern"],
    ["animation-performance", "Checks animations hit 60fps"],
    ["review-animations", "Reviews animations"],
    ["find-animation-opportunities", "Finds where motion helps"],
    ["improve-animations", "Audits all motion"],
    ["remove-animations", "Removes needless animations"],
    ["animate-expo", "Animates Expo apps"],
    ["ask-sonner", "Sets up Sonner toasts"],
    ["learn-taste", "Turns corrections into rules"],
  ]),
  ...by("krehel", [
    ["better-interface", "Runs every better-* review"],
    ["better-ui", "Polishes UI details"],
    ["better-typography", "Fixes type scale and spacing"],
    ["better-colors", "Builds palettes and checks contrast"],
    ["better-accessibility", "Fixes focus, keyboard and ARIA"],
    ["better-layout", "Fixes grouping and alignment"],
    ["better-writing", "Improves product copy"],
    ["interface-review", "Reviews a whole interface"],
    ["explain-interface", "Explains how a UI was built"],
    ["state-machine", "Renders every state of a component"],
    ["break", "Stress tests a component"],
    ["variant", "Builds variants of a component"],
    ["upskill", "Suggests skills from past sessions"],
    ["afk", "Prepares improvements while you're away"],
    [
      "make-interfaces-feel-better",
      "Applies the small UI details",
      "https://github.com/jakubkrehel/make-interfaces-feel-better",
    ],
  ]),
  ...by("lucas", [
    ["hairline-create", "Draws an isometric figure"],
    ["hairline-adopt", "Rebuilds an SVG as a figure"],
  ]),
  ...by("jakub", [["transitions-ui-generation", "Shows UI being generated"]]),
  ...by("benji", [["stageshow", "Makes faux UI stills"]]),
  ...by("dan", [["be-ambitious", "Deepens a prompt"]]),
  ...by("meng", [["html-demo", "Demos an app in live HTML"]]),
  ...by("filip", [
    [
      "regards",
      "Researches its own art direction",
      "https://github.com/filipwojda/regards-skill",
    ],
  ]),
  ...by("leon", [
    [
      "taste-skill",
      "Gives an agent art direction",
      "https://github.com/Leonxlnx/taste-skill",
    ],
  ]),
  ...by("dipesh", [
    [
      "feel",
      "Builds physics-based interactions",
      "https://github.com/diip3sh/feel",
    ],
  ]),
  ...by("ryan", [
    [
      "anatomy",
      "Draws isometric machines",
      "https://github.com/wheresryan22/anatomy",
    ],
  ]),
  ...by("anshu", [
    [
      "dream-loop",
      "Makes 3D visuals in Blender",
      "https://github.com/achimala/dream-loop",
    ],
  ]),
  ...by("rea", [["rea", "Reverse engineers anything", "https://rea.tools"]]),
  // given out by DM, so there is no repo to link and "un-slop" is my label for it
  ...by("tobi", [
    [
      "un-slop",
      "Redesigns apps that look AI-made",
      "https://x.com/tobiadonadon_/status/2106432288686850124",
    ],
  ]),
];
