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
      role: "FDE Intern",
      company: "Keychain",
      startDate: "Sep 2025",
      endDate: "Present",
      link: "https://www.keychain.com/",
    },
    {
      id: 2,
      role: "Frontend Engineer",
      company: "Induced AI",
      startDate: "Apr 2025",
      endDate: "Sep 2025",
      link: "https://www.induced.ai/",
    },
    {
      id: 3,
      role: "SDE Intern",
      company: "Unolo",
      startDate: "Feb 2025",
      endDate: "Apr 2025",
      link: "https://unolo.com",
    },
    {
      id: 4,
      role: "UI/UX Designer",
      company: "Snipe",
      startDate: "Aug 2024",
      endDate: "Jan 2025",
      link: "https://snipeit.ai",
    },
  ],
  projects: [
    {
      title: "STASHR",
      description: "Organize Your Bookmarks",
      tags: ["Next.js", "React Query", "Typescript", "Tailwind CSS", "MongoDB"],
      Livelink: "https://stashr.in",
      gitHubLink: "https://github.com/Lokendrakushwah12/stashr",
      imageSrc: "/projects/stashr.webp",
      date: "AUG 2025",
      working: false,
    },
    {
      title: "MEET-BOT",
      description: "Real-Time Meeting Transcription Made Effortless",
      tags: ["Node.js", "WebSocket", "Redis", "Puppeteer"],
      gitHubLink: "https://github.com/Lokendrakushwah12/meet-bot",
      imageSrc: "/projects/meet-bot.webp",
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
      imageSrc: "/projects/anubhav.webp",
      date: "OCT 2024",
      working: false,
    },
    {
      title: "PIXA/UI",
      description:
        "Pixa/UI - Curated collection of versatile Next.js components.",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion", "NPM Package"],
      Livelink: "https://pixaui.com",
      gitHubLink: "https://github.com/Lokendrakushwah12/pixa-ui",
      imageSrc: "/projects/pixa.webp",
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
