import { Skills } from "@/components/sections/skills";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills",
  description: "Agent skills I use, mine and other creators'.",
};

export default function SkillsPage() {
  return <Skills />;
}
