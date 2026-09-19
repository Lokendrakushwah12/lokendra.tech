import Link from "next/link";
import type { ReactNode } from "react";
import { getTechInfo } from "@/lib/utils";

// one tint per tag, keyed by the normalised tag name
const TAG_COLORS: Record<string, string> = {
  nextjs: "text-stone-700 bg-stone-200/70 dark:text-stone-300 dark:bg-stone-500/15",
  typescript: "text-blue-700 bg-blue-100/70 dark:text-blue-300 dark:bg-blue-500/10",
  javascript: "text-yellow-700 bg-yellow-100/70 dark:text-yellow-300 dark:bg-yellow-500/10",
  reactjs: "text-orange-700 bg-orange-100/70 dark:text-orange-300 dark:bg-orange-500/10",
  tailwindcss: "text-sky-700 bg-sky-100/70 dark:text-sky-300 dark:bg-sky-500/10",
  zustand: "text-amber-700 bg-amber-100/70 dark:text-amber-300 dark:bg-amber-500/10",
  reactquery: "text-red-700 bg-red-100/70 dark:text-red-300 dark:bg-red-500/10",
  postgresql: "text-indigo-700 bg-indigo-100/70 dark:text-indigo-300 dark:bg-indigo-500/10",
  trino: "text-fuchsia-700 bg-fuchsia-100/70 dark:text-fuchsia-300 dark:bg-fuchsia-500/10",
  metabase: "text-orange-700 bg-orange-100/70 dark:text-orange-300 dark:bg-orange-500/10",
  sentry: "text-rose-700 bg-rose-100/70 dark:text-rose-300 dark:bg-rose-500/10",
  posthog: "text-orange-700 bg-orange-100/70 dark:text-orange-300 dark:bg-orange-500/10",
  redux: "text-fuchsia-700 bg-fuchsia-100/70 dark:text-fuchsia-300 dark:bg-fuchsia-500/10",
  mui: "text-amber-700 bg-amber-100/70 dark:text-amber-300 dark:bg-amber-500/10",
  graphql: "text-pink-700 bg-pink-100/70 dark:text-pink-300 dark:bg-pink-500/10",
  git: "text-orange-700 bg-orange-100/70 dark:text-orange-300 dark:bg-orange-500/10",
  github: "text-stone-700 bg-stone-100/70 dark:text-stone-300 dark:bg-stone-500/10",
  nodejs: "text-lime-700 bg-lime-100/70 dark:text-lime-300 dark:bg-lime-500/10",
  expressjs: "text-stone-700 bg-stone-100/70 dark:text-stone-300 dark:bg-stone-500/10",
  mongodb: "text-lime-700 bg-lime-100/70 dark:text-lime-300 dark:bg-lime-500/10",
  redis: "text-red-700 bg-red-100/70 dark:text-red-300 dark:bg-red-500/10",
  framermotion: "text-yellow-700 bg-yellow-100/70 dark:text-yellow-300 dark:bg-yellow-500/10",
  turso: "text-amber-700 bg-amber-100/70 dark:text-amber-300 dark:bg-amber-500/10",
  drizzleorm: "text-lime-700 bg-lime-100/70 dark:text-lime-300 dark:bg-lime-500/10",
  betterauth: "text-stone-700 bg-stone-100/70 dark:text-stone-300 dark:bg-stone-500/10",
  cloudflareworkers: "text-orange-700 bg-orange-100/70 dark:text-orange-300 dark:bg-orange-500/10",
  chromeextension: "text-yellow-700 bg-yellow-100/70 dark:text-yellow-300 dark:bg-yellow-500/10",
  websocket: "text-stone-700 bg-stone-100/70 dark:text-stone-300 dark:bg-stone-500/10",
  puppeteer: "text-amber-700 bg-amber-100/70 dark:text-amber-300 dark:bg-amber-500/10",
  npmpackage: "text-red-700 bg-red-100/70 dark:text-red-300 dark:bg-red-500/10",
  python: "text-yellow-700 bg-yellow-100/70 dark:text-yellow-300 dark:bg-yellow-500/10",
  inducedai: "text-stone-700 bg-stone-200/70 dark:text-stone-300 dark:bg-stone-500/15",
  unolo: "text-fuchsia-700 bg-fuchsia-100/70 dark:text-fuchsia-300 dark:bg-fuchsia-500/10",
  humanbehavior: "text-lime-700 bg-lime-100/70 dark:text-lime-300 dark:bg-lime-500/10",
  keychain: "text-amber-700 bg-amber-100/70 dark:text-amber-300 dark:bg-amber-500/10",
  amogh: "text-stone-700 bg-stone-200/70 dark:text-stone-300 dark:bg-stone-500/15",
  wip: "text-orange-700 bg-orange-100/70 dark:text-orange-300 dark:bg-orange-500/10",
};

const FALLBACK = "text-muted-foreground bg-muted";

export const tagColor = (tag: string) =>
  TAG_COLORS[tag.toLowerCase().replace(/[\s.\-/]+/g, "")] ?? FALLBACK;

const TechBadge = ({
  tag,
  icon,
  href,
}: {
  tag: string;
  /** overrides the techStack logo lookup */
  icon?: ReactNode;
  /** renders the badge as a link */
  href?: string;
}) => {
  const techInfo = getTechInfo(tag);
  const className = `h-fit text-xs rounded-sm px-1.5 py-0.5 inline-flex items-center gap-1.5 align-middle ${tagColor(tag)}`;

  const content = (
    <>
      {icon ??
        (techInfo?.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={techInfo.logoUrl}
            alt={tag}
            width={14}
            height={14}
            // inline margin beats the prose plugin's `.prose img { margin: 2em 0 }`,
            // which outranks any utility class here (:where() adds no specificity)
            style={{ margin: 0 }}
            className={`size-3 object-contain ${techInfo.invertInDarkMode ? "dark:invert" : ""} ${techInfo.invertInLightMode ? "invert dark:invert-0" : ""}`}
          />
        ))}
      {tag}
    </>
  );

  if (!href) return <span className={className}>{content}</span>;

  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`${className} hover:brightness-125 transition-all`}
    >
      {content}
    </Link>
  );
};

export default TechBadge;
