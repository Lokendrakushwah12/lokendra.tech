"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const RAIL_X = 1;
const INDENT = 12;
const STEP = 6;
const READING_LINE = 120;

type TocItem = {
  title?: React.ReactNode;
  url: string;
  depth: number;
};

type Segment = { top: number; height: number };

type Geometry = {
  d: string;
  width: number;
  height: number;
  segments: Record<string, Segment>;
};

function levelOf(depth: number) {
  return Math.max(0, Math.min(2, depth - 2));
}

function railX(level: number) {
  return RAIL_X + level * INDENT;
}

function outline(
  items: { url: string; level: number; top: number; bottom: number }[],
): Geometry {
  const parts: string[] = [];
  const segments: Record<string, Segment> = {};
  let deepest = 0;

  items.forEach((item, i) => {
    const previous = items[i - 1];
    const next = items[i + 1];
    const x = railX(item.level);
    const start =
      item.top + (previous && previous.level !== item.level ? STEP : 0);
    const end = item.bottom - (next && next.level !== item.level ? STEP : 0);

    deepest = Math.max(deepest, item.level);
    segments[item.url] = { height: Math.max(1, end - start), top: start };

    if (i === 0) {
      parts.push(`M${x} ${start}`);
    } else if (previous && previous.level !== item.level) {
      parts.push(`L${x} ${start}`);
    }
    parts.push(`L${x} ${end}`);
  });

  return {
    d: parts.join(" "),
    height: items.at(-1)?.bottom ?? 0,
    segments,
    width: railX(deepest) + 1,
  };
}

function maskUrl(geometry: Geometry) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${geometry.width} ${geometry.height}"><path d="${geometry.d}" stroke="white" stroke-width="1" fill="none"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const key = itemIds.join("|");

  React.useEffect(() => {
    const ids = key ? key.split("|") : [];
    if (ids.length === 0) {
      return;
    }

    let queued = false;

    const pick = () => {
      const passed = ids.filter((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top <= READING_LINE : false;
      });
      setActiveId(passed.at(-1) ?? ids[0] ?? null);
    };

    const schedule = () => {
      if (queued) {
        return;
      }
      queued = true;
      // Microtask-ish coalescing that still runs when the tab is hidden.
      setTimeout(() => {
        queued = false;
        pick();
      }, 0);
    };

    pick();
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
    };
  }, [key]);

  return activeId;
}

export function DocsTableOfContents({
  toc,
  className,
}: {
  toc: TocItem[];
  className?: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = React.useState<Geometry | null>(null);

  const itemIds = React.useMemo(
    () => toc.map((item) => item.url.replace("#", "")),
    [toc],
  );
  const activeHeading = useActiveItem(itemIds);

  // Layout effect, not a frame callback: requestAnimationFrame never fires in
  // a background tab, so a TOC opened in one would render no outline at all
  // until the tab was focused.
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || toc.length === 0) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    let tries = 0;

    const measure = () => {
      const items = toc.map((item, i) => {
        const child = list.children[i] as HTMLElement | undefined;
        return {
          bottom: child ? child.offsetTop + child.offsetHeight : 0,
          level: levelOf(item.depth),
          top: child?.offsetTop ?? 0,
          url: item.url,
        };
      });

      if (!items.at(-1)?.bottom) {
        if (tries++ < 20) {
          timer = setTimeout(measure, 50);
        }
        return;
      }

      setGeometry(outline(items));
    };

    measure();
    const observer = new ResizeObserver(() => {
      tries = 0;
      measure();
    });
    observer.observe(list);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      observer.disconnect();
    };
  }, [toc]);

  if (!toc?.length) {
    return null;
  }

  const thumb =
    geometry && activeHeading
      ? geometry.segments[`#${activeHeading}`]
      : undefined;

  return (
    <div
      className={cn(
        "z-10 flex flex-col gap-1 py-2 ps-6 pe-4 text-sm",
        className,
      )}
    >
      <p className="animate-enter flex h-7 items-center font-medium text-xs" style={{ "--stagger": 2 } as React.CSSProperties}>
        On This Page
      </p>
      <div className="relative ms-3.5">
        {geometry ? (
          <div className="animate-enter" style={{ "--stagger": 3 } as React.CSSProperties}>
            <svg
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 text-border"
              fill="none"
              height={geometry.height}
              viewBox={`0 0 ${geometry.width} ${geometry.height}`}
              width={geometry.width}
            >
              <path d={geometry.d} stroke="currentColor" strokeWidth="1" />
            </svg>
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 overflow-hidden"
              style={{
                height: geometry.height,
                maskImage: maskUrl(geometry),
                maskRepeat: "no-repeat",
                maskSize: "100% 100%",
                width: geometry.width,
              }}
            >
              <div
                className="w-full bg-primary transition-[transform,height] duration-300 ease-out"
                style={{
                  height: thumb?.height ?? 0,
                  opacity: thumb ? 1 : 0,
                  transform: `translateY(${thumb?.top ?? 0}px)`,
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="relative flex flex-col" ref={listRef}>
          {toc.map((item, i) => (
            <a
              className={cn(
                "animate-enter py-1 text-[.8125rem] leading-4.5 no-underline transition-colors",
                "text-muted-foreground hover:bg-transparent hover:text-foreground",
                "data-[active=true]:bg-transparent data-[active=true]:text-foreground",
                // one line per entry; the rail reads as a list, not a paragraph
                "block truncate whitespace-nowrap",
              )}
              title={typeof item.title === "string" ? item.title : undefined}
              data-active={item.url === `#${activeHeading}`}
              data-depth={item.depth}
              href={item.url}
              key={item.url}
              style={{ paddingInlineStart: railX(levelOf(item.depth)) + 11, "--stagger": 3 + i * 0.6 } as React.CSSProperties}
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Where the gutter has no room: one pill, pinned to the bottom, that
 * names the section you are in and fills its ring as you read. It sits
 * above the layout's bottom ProgressiveBlur (z-500), which would blur it. */
export function DocsTocPill({ toc, className }: { toc: TocItem[]; className?: string }) {
  const itemIds = React.useMemo(() => toc.map((item) => item.url.replace("#", "")), [toc]);
  const activeHeading = useActiveItem(itemIds);
  const [progress, setProgress] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // a tap anywhere else closes the list
  React.useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  if (!toc?.length) return null;

  const active = toc.find((item) => item.url === `#${activeHeading}`) ?? toc[0];
  const r = 8;
  const c = 2 * Math.PI * r;

  return (
    <div
      ref={ref}
      className={cn("fixed inset-x-0 bottom-4 z-[510] flex justify-center px-4 pointer-events-none", className)}
    >
      <div className="animate-enter pointer-events-auto relative max-w-full" style={{ "--stagger": 4 } as React.CSSProperties}>
        {open ? (
          <nav
            aria-label="On this page"
            className="absolute bottom-full left-1/2 mb-2 max-h-[60vh] w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 overflow-y-auto rounded-2xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur"
          >
            {toc.map((item) => (
              <a
                key={item.url}
                href={item.url}
                onClick={() => setOpen(false)}
                data-active={item.url === active.url}
                className="block truncate rounded-lg px-2.5 py-1.5 text-[.8125rem] text-muted-foreground no-underline transition-colors hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
                style={{ paddingInlineStart: 10 + levelOf(item.depth) * 12 }}
              >
                {item.title}
              </a>
            ))}
          </nav>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex max-w-full cursor-pointer items-center gap-2.5 rounded-full border border-border bg-background/85 py-2 ps-2.5 pe-4 text-[.8125rem] text-foreground shadow-lg backdrop-blur"
        >
          <svg viewBox="0 0 20 20" className="size-5 shrink-0 -rotate-90" aria-hidden>
            <circle cx="10" cy="10" r={r} fill="none" strokeWidth="2" className="stroke-border" />
            <circle
              cx="10"
              cy="10"
              r={r}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="stroke-foreground transition-[stroke-dashoffset] duration-150"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - progress)}
            />
          </svg>
          <span className="truncate">{active.title}</span>
        </button>
      </div>
    </div>
  );
}
