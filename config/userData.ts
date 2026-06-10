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
      role: "Frontend Engineer",
      company: "Keychain",
      startDate: "Sep 2025",
      endDate: "Present",
      link: "https://www.keychain.com/",
      description:
        "Shipped 20+ features across Food Safety, Inventory, Procurement, and Forms modules — including vendor items mapping, automatic lot numbering, dynamic form titles, global tagging system, bulk form actions, and storage location improvements.\nBuilt a demo account automation system reducing provisioning time from 1 full engineering day to under 30 minutes, directly accelerating sales velocity.\nImplemented the ability to change form field types in the Form Builder with dependency-aware safeguards (conditions, automations, dynamic titles, ERP links), reducing form rebuild cycles during setup.\nDrove epoch time migration across the Documents module, eliminating timezone-related date bugs and standardizing time handling across the codebase.\nWorking in the onboarding team to ingest customer data into the ERP platform, including items and SKUs, inventory data, data translation, and validation error resolution.",
    },
    {
      id: 2,
      role: "Frontend Engineer",
      company: "Induced AI",
      startDate: "Apr 2025",
      endDate: "Sep 2025",
      link: "https://www.induced.ai/",
      description:
        "Worked on the Venus codebase to ship features like AI chat, the screener page, and citations in markdown content, plus bug fixes.\nBuilt and maintained internal platforms like Tmhcc, enabling multi-agent data processing workflows.\nWorked on Validex, a rule-based document validation engine supporting custom presets for compliance checking.\nBuilt Docs, a unified documentation system using MDX, OpenAPI, and Fuma Docs with a live API playground.\nLeveraged Zustand, React Query, Next.js, and Tailwind CSS across projects to ensure state management, responsive UIs, and efficient data fetching.",
    },
    {
      id: 3,
      role: "SDE Intern",
      company: "Unolo",
      startDate: "Feb 2025",
      endDate: "Apr 2025",
      link: "https://unolo.com",
      description:
        "Led end-to-end development of a custom field feature for employee management, improving flexibility.\nIntegrated automated punch-out status functionality and timeline visualization, reducing manual tracking time.\nEnhanced UX by adding confirmation dialogs, filters, and permission attributes for improved security.",
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
      description: "A space for engineers to browse their next job from recently funded startups.",
      tags: ["Next.js", "Playwright", "TypeScript", "PostgreSQL", "Drizzle ORM", "BetterAuth", "Vercel"],
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
        "It is a web-based platform that offers articles and resources focused on college placements and interview experiences.",
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
    date: "JUNE 11, 2025",
    time: "23:12 PM IST",
  },
};

export default userData;
