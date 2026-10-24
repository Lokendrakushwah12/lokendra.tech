"use client";

import { useEffect } from "react";

const SETTLE_MS = 5000;
const USER_INPUT = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

// images and the GitHub graph above a deep-linked section change height as they
// load, so the browser's one-off hash scroll lands short. Keep the section pinned
// while the page settles, and let go the moment the reader scrolls themselves.
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    const observer = new ResizeObserver(() =>
      target.scrollIntoView({ behavior: "instant" })
    );
    const stop = () => {
      observer.disconnect();
      clearTimeout(timer);
      USER_INPUT.forEach((e) => removeEventListener(e, stop));
    };
    const timer = setTimeout(stop, SETTLE_MS);

    observer.observe(document.body);
    USER_INPUT.forEach((e) => addEventListener(e, stop, { passive: true }));
    return stop;
  }, []);

  return null;
}
