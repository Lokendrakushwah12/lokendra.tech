import type { UserData } from "@/types";

const userData: UserData = {
  personalInfo: {
    name: "LOKENDRA KUSHWAH",
    profession: "SOFTWARE ENGINEER",
    email: "Lokendrakushwah8051@gmail.com",
    github: "https://github.com/lokendrakushwah12",
    twitter: "https://x.com/lokendratwt",
  },
  about:
    "Hello, I'm Lokendra. A software engineer who codes and designs with purpose. I build standout products by blending problem-solving with design thinking — getting 1% better every day.",
  experience: [
    {
      id: 1,
      role: "Software Engineer",
      company: "Keychain",
      startDate: "Sep 2025",
      endDate: "Present",
      link: "https://www.keychain.com/",
      description:
        "Migrated operator-mode, workflow and production routes out of the monolithic dashboard into a standalone Next.js app (34 commits, rollback path retained), cutting CI build times from 16-18 min to 7-9 min.\nOwned frontend releases end to end: sequenced dependent FE/BE merges across three services and resolved release-branch conflicts — 10 features shipped in one release with zero rollbacks.\nBuilt Customer AI extraction (data layer, review/approval and bulk error-resolution UI) and fixed false DUPLICATE flagging in ingestion, load-tested against a 4,500-row customer file.\nRoot-caused production incidents: traced 119 of 326 sales orders with null address foreign keys to one ERP migration batch and bounded 11 vendor address overwrites via Postgres audit tables.\nOwned the sales demo platform: cut provisioning from 1 engineering day to under 30 minutes, re-synced environments ~2 months behind production, and caught a 40s+ Start Production regression before live demos.\nLed a UI overhaul of the internal AI platform (261 files, +9.2K LOC): design tokens behind every colour utility, a shared Base UI library, dagre-routed workflow graphs.",
    },
    {
      id: 2,
      role: "Frontend Engineer",
      company: "Induced AI",
      startDate: "Apr 2025",
      endDate: "Sep 2025",
      link: "https://www.induced.ai/",
      description:
        "Worked on the Venus codebase to ship features like AI chat, the screener page, and citations in markdown content, plus bug fixes.\nBuilt Validex, a rule-based document validation engine with configurable compliance presets, validating 2,000+ documents at 94% accuracy.\nBuilt Insure-Gather, extracting fields from driving licences, Emirates IDs and vehicle documents to auto-fill insurance portals via iframe — cutting per-policy entry from 1-2 hours to under 2 minutes.\nShipped Tmhcc, a multi-agent data-processing platform for underwriting, and Docs, a unified documentation system (MDX, OpenAPI, Fuma Docs) with a live API playground over 50+ endpoints.\nLeveraged Zustand, React Query, Next.js, and Tailwind CSS across projects to ensure state management, responsive UIs, and efficient data fetching.",
    },
    {
      id: 3,
      role: "SDE Intern",
      company: "Unolo",
      startDate: "Feb 2025",
      endDate: "Apr 2025",
      link: "https://unolo.com",
      description:
        "Delivered custom fields for employee management end to end, adopted by 4+ client organisations (50-1,000 employees each) to define their own employee schema without engineering involvement.\nShipped automated punch-out detection and attendance timeline visualization, eliminating manual attendance entry in favour of fully digital tracking.\nEnhanced UX by adding confirmation dialogs, filters, and permission attributes for improved security.",
    },
    {
      id: 4,
      role: "UI/UX Designer",
      company: "Snipe",
      startDate: "Aug 2024",
      endDate: "Jan 2025",
      link: "https://snipeit.ai",
      description: "",
    },
  ],
  projects: [
    {
      title: "Engg.space",
      description: "A space for engineers to browse their next job from recently funded startups. 50 daily active users.",
      tags: ["Next.js", "TypeScript", "Turso", "Drizzle ORM", "BetterAuth", "Cloudflare Workers", "Chrome Extension"],
      Livelink: "https://engg.space/?utm_source=lokendra.tech",
      gitHubLink: null,
      imageSrc: "https://lokendrakushwah12.github.io/cdn/engg.png",
      date: "FEB 2026",
      working: true,
    },
    {
      title: "STASHR",
      description: "Organize Your Bookmarks",
      tags: ["Next.js", "React Query", "Typescript", "Tailwind CSS", "MongoDB"],
      Livelink: "https://stashr.in/?utm_source=lokendra.tech",
      gitHubLink: "https://github.com/Lokendrakushwah12/stashr",
      imageSrc: "https://lokendrakushwah12.github.io/cdn/stashr.webp",
      date: "AUG 2025",
      working: false,
    },
    {
      title: "MEET-BOT",
      description: "Real-Time Meeting Transcription Made Effortless",
      tags: ["Node.js", "WebSocket", "Redis", "Puppeteer"],
      gitHubLink: "https://github.com/Lokendrakushwah12/meet-bot",
      imageSrc: "https://lokendrakushwah12.github.io/cdn/meet-bot.webp",
      date: "MAR 2025",
      working: false,
    },
    {
      title: "ANUBHAV",
      description:
        "A web-based platform offering articles and resources focused on college placements and interview experiences. Used by 200+ students.",
      tags: [
        "React.js",
        "Tailwind CSS",
        "Framer Motion",
        "Node.js",
        "Express.js",
      ],
      Livelink: "https://anubhav.ossclub.in",
      gitHubLink: "https://github.com/aitoss/Anubhav-frontend-23",
      imageSrc: "https://lokendrakushwah12.github.io/cdn/anubhav.webp",
      date: "OCT 2024",
      working: false,
    },
    {
      title: "PIXA/UI",
      description:
        "Pixa/UI - Curated collection of versatile Next.js components.",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion", "NPM Package"],
      Livelink: "https://pixaui.com/?utm_source=lokendra.tech",
      gitHubLink: "https://github.com/Lokendrakushwah12/pixa-ui",
      imageSrc: "https://lokendrakushwah12.github.io/cdn/pixa.png",
      date: "AUG 2024",
      working: true,
    },
  ],
  lastUpdated: {
    date: "SEPTEMBER 19, 2026",
    time: "00:18 AM IST",
  },
};

export default userData;
