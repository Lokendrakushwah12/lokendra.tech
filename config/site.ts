export const siteConfig = {
  name: "Lokendra Kushwah",
  description: "A software engineer who codes and designs with purpose.",
  url: "https://lokendra.tech",

  // Personal Information
  author: {
    name: "Lokendra Kushwah",
    email: "lokendrakushwah8051@gmail.com",
    twitter: "@lokendratwt",
    github: "lokendrakushwah12",
    linkedin: "lokendrakushwah",
  },

  // Leave empty objects or comment out sections you don't want to use
  analytics: {
    visitors: {
      token: process.env.NEXT_PUBLIC_VISITORS_TOKEN,
    },
    // Umami Analytics
    umami: {
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
      url: process.env.NEXT_PUBLIC_UMAMI_URL,
    },
    // Microsoft Clarity
    clarity: {
      projectId: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
