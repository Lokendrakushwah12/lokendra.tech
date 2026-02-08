import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { techStack } from "@/config/techStack"
import type { TechStack } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get tech info by name (case-insensitive, handles variations)
export const getTechInfo = (tagName: string): TechStack | undefined => {
  const normalized = tagName.toLowerCase().replace(/\s+/g, "");
  return techStack.find(tech => 
    tech.name.toLowerCase().replace(/\s+/g, "") === normalized ||
    tech.name.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "") === normalized
  );
};

export function reverseArray<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

export function playClickSound() {
  const audio = new Audio("/sfx/click.wav");
  audio.volume = 0.5;
  audio.play().catch((e) => console.error("Audio play failed", e));
}