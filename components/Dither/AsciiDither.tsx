"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

// base texture first, then the glyphs that cluster on the crests
const GLYPHS = ["/", "%", "#", "$"];
const CELL = 12; // px per character cell
const FPS = 15;
// a continuous sweep through one narrow band rather than discrete hues:
// neighbouring cells land on near-identical colours, so it reads as a soft
// iridescent shimmer instead of clashing patches
const HUE_START = 200; // cyan-blue
const HUE_SPAN = 130; // ...through violet to magenta
const HUE_STEPS = 16; // quantised only so fillStyle switches stay cheap
// content column is max-w-3xl (768px); protect it plus a margin, then fade in
const MASK =
  "linear-gradient(to right, rgba(0,0,0,1) 0, rgba(0,0,0,1) calc(50% - 480px), rgba(0,0,0,0) calc(50% - 400px), rgba(0,0,0,0) calc(50% + 400px), rgba(0,0,0,1) calc(50% + 480px), rgba(0,0,0,1) 100%)";

/**
 * Character-grid dither: a faint dot in every cell, with `%` glyphs clustering
 * along the crests of a slow wave field. Dots are drawn as rects rather than
 * text - one fillText per cell is far too many at this density.
 */
const AsciiDither = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dark = resolvedTheme !== "light";

    let raf = 0;
    let last = 0;
    let t = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(window.innerWidth * dpr);
      canvas.height = Math.ceil(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
    };
    resize();
    window.addEventListener("resize", resize);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 1000 / FPS) return;
      last = now;
      if (!still) t += 0.01;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);

      // bucket per (hue, glyph) so fillStyle switches stay to a handful per frame
      const mk = () => Array.from({ length: HUE_STEPS }, (): number[] => []);
      const dots = mk();
      const slashes = mk();
      const marks = mk();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const u = c / cols;
          const v = r / rows;
          const n =
            Math.sin((u * 3 + v * 2) * Math.PI + t) * 0.5 +
            Math.sin((u * 7 - v * 5) * Math.PI - t * 0.7) * 0.3 +
            Math.sin((u - v) * 9 * Math.PI + t * 0.4) * 0.2;
          const lum = (n + 1) / 2;

          const x = c * CELL + CELL / 2;
          const y = r * CELL + CELL / 2;

          // separate, much slower field picks the region colour
          const region =
            Math.sin((u * 1.3 - v * 0.7) * Math.PI + t * 0.05) +
            Math.sin((u * 0.6 + v * 1.1) * Math.PI - t * 0.03);
          const hi = Math.min(
            HUE_STEPS - 1,
            Math.floor(((region + 2) / 4) * HUE_STEPS)
          );

          if (lum > 0.86) {
            marks[hi].push(x, y);
          } else if (lum > 0.42) {
            slashes[hi].push(x, y);
          } else {
            dots[hi].push(x, y);
          }
        }
      }

      ctx.font = `${CELL - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      const a = dark ? [0.04, 0.09, 0.2] : [0.035, 0.07, 0.16];
      const sat = dark ? 38 : 42;
      const light = dark ? 72 : 46;

      for (let i = 0; i < HUE_STEPS; i++) {
        const hue = HUE_START + (i / (HUE_STEPS - 1)) * HUE_SPAN;
        const tint = (alpha: number) => `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;
        // faintest cells stay as specks rather than glyphs
        const d = dots[i];
        ctx.fillStyle = tint(a[0]);
        for (let k = 0; k < d.length; k += 2) {
          ctx.fillRect(d[k], d[k + 1], 1.2, 1.2);
        }

        const sl = slashes[i];
        ctx.fillStyle = tint(a[1]);
        for (let k = 0; k < sl.length; k += 2) {
          ctx.fillText(GLYPHS[0], sl[k], sl[k + 1]);
        }

        const m = marks[i];
        ctx.fillStyle = tint(a[2]);
        for (let k = 0; k < m.length; k += 2) {
          ctx.fillText(
            GLYPHS[1 + ((k >> 1) % (GLYPHS.length - 1))],
            m[k],
            m[k + 1]
          );
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none dark:opacity-80"
      style={{
        zIndex: -1,
        // keep the texture out from behind the centred content column,
        // fading in across the gutters instead of cutting hard
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    />
  );
};

export default AsciiDither;
