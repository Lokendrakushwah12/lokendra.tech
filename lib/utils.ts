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
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tocFromMdx(source: string) {
  const items: { title: string; url: string; depth: number }[] = [];

  for (const line of source.split("\n")) {
    const role = line.match(/<RoleHeading\s+title="([^"]+)"/);
    if (role) {
      items.push({ title: role[1], url: `#${slugify(role[1])}`, depth: 2 });
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (heading) {
      const title = heading[2].replace(/[*_`]/g, "");
      items.push({
        title,
        url: `#${slugify(title)}`,
        depth: heading[1].length,
      });
      continue;
    }

    // bold lead-ins ("**Splitting the monolith.** …") are the real sub-topics
    const lead = line.match(/^\*\*([^*]+)\*\*/);
    if (lead) {
      const title = lead[1].replace(/\.$/, "").trim();
      items.push({ title, url: `#${slugify(title)}`, depth: 3 });
    }
  }

  return items;
}
