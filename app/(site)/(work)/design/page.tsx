import { Work, type WorkItem } from "@/components/sections/work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Work",
  description: "Selected design and frontend engineering work.",
};

const data: WorkItem[] = [
  {
    src: "/work/pin-it.png",
    alt: "Pin It - Events management and content scheduling platform",
    title: "Pin It",
    description: "Events management platform",
  },
  {
    src: "/work/visa.png",
    alt: "Visa Friendly - Visa-Sponsored Jobs & Internships, All In One Place.",
    title: "Visa Friendly",
    description: "Visa sponsorship job platform",
  },
  {
    src: "/work/kalyxa.png",
    alt: "Kalyxa - Transform your style with AI & Expert Stylist",
    title: "Kalyxa",
    description: "Transform your style with AI & Expert Stylist",
  },
  {
    src: "/work/cauldron.png",
    alt: "Cauldron - Faceless Video Engine",
    title: "Cauldron",
    description: "Faceless video generation and editing platform",
  },
  {
    src: "/work/karigar.png",
    alt: "Karigar - Skilled worker marketplace and architect platform",
    title: "Karigar",
    description: "AI-powered skilled worker marketplace",
  },
  {
    src: "/work/litmus.png",
    alt: "Litmus - Advanced AI-powered content analysis to detect misinformation and assess credibility with precision",
    title: "Litmus",
    description: "AI-powered content analysis platform",
  },
  {
    src: "/work/meet-bot.png",
    alt: "Meet Bot - Automated meeting scheduling for zoom",
    title: "Meet Bot",
    description: "AI meeting scheduling and management assistant",
  },
  {
    src: "/work/breethr.png",
    alt: "Breethr - Wellness and breathing exercise application with air quality tracking",
    title: "Breethr",
    description: "Personalized wellness and breathing exercise app",
  },
  {
    src: "/work/bounce-daily.png",
    alt: "Bounce Daily - Rent your vehicle by the day, week, or month",
    title: "Bounce Daily",
    description: "Vehicle rental platform",
  },
];

export default function DesignPage() {
  return <Work title="Design Work" data={data} />;
}
