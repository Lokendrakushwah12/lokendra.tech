"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { animate, motion, MotionConfig } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; src: string; alt: string; el: HTMLImageElement };
type Gallery = { register: (item: Item) => () => void; open: (id: string) => void };
type View = { items: Item[]; index: number };

const GalleryContext = createContext<Gallery | null>(null);
const spring = { type: "spring", stiffness: 550, damping: 35, mass: 0.6 } as const;

/** x/y/scale that draw a box laid out at `at` exactly over the box `over` (transform origin: centre) */
const flip = (at: DOMRect, over: DOMRect) => ({
  x: over.left + over.width / 2 - (at.left + at.width / 2),
  y: over.top + over.height / 2 - (at.top + at.height / 2),
  scaleX: over.width / at.width,
  scaleY: over.height / at.height,
});

/** the element's box as laid out, ignoring its own transform */
const layoutRect = (el: HTMLElement) => {
  const t = el.style.transform;
  el.style.transform = "none";
  const r = el.getBoundingClientRect();
  el.style.transform = t;
  return r;
};

/**
 * One lightbox for the page: every ImageModal under it joins the gallery, in DOM order.
 * The zoom is an explicit FLIP (viewer image drawn over the page image, then sprung to its
 * own box, and back on close) rather than motion's shared layoutId: that crossfades the two
 * copies, which dips mid-zoom, and unmounting through AnimatePresence flashes the backdrop.
 */
export function ImageGalleryProvider({ children }: { children: React.ReactNode }) {
  const registry = useRef(new Map<string, Item>());
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const slides = useRef<(HTMLImageElement | null)[]>([]);
  const hidden = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const isOpen = view !== null;

  // the page copy of the image in flight is hidden, so there's only ever one on screen
  const hide = useCallback((el: HTMLElement | null) => {
    if (hidden.current) hidden.current.style.visibility = "";
    hidden.current = el;
    if (el) el.style.visibility = "hidden";
  }, []);

  const register = useCallback((item: Item) => {
    registry.current.set(item.id, item);
    return () => void registry.current.delete(item.id);
  }, []);

  const open = useCallback((id: string) => {
    const items = [...registry.current.values()]
      .filter((i) => i.el.isConnected)
      .sort((a, b) =>
        a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
    setView({ items, index: Math.max(0, items.findIndex((i) => i.id === id)) });
  }, []);

  // zoom in: before paint, draw the viewer image over the page image, then spring it home.
  // Runs once per open (`items` is a new array each open; navigating keeps it).
  useLayoutEffect(() => {
    if (!view) return;
    const source = view.items[view.index].el;
    const img = slides.current[view.index];
    if (!img) return;
    hide(source);
    img.style.opacity = "0"; // until its size is known
    const run = () => {
      const f = flip(layoutRect(img), source.getBoundingClientRect());
      img.style.transform = `translate(${f.x}px, ${f.y}px) scale(${f.scaleX}, ${f.scaleY})`;
      img.style.opacity = "";
      animate(img, { x: [f.x, 0], y: [f.y, 0], scaleX: [f.scaleX, 1], scaleY: [f.scaleY, 1] }, spring);
    };
    if (img.complete && img.naturalWidth) run();
    else img.decode().then(run, run);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per open, see above
  }, [view?.items]);

  // zoom out onto whichever image is showing; if its page copy is off-screen, fade instead.
  // The viewer unmounts only once the image has landed.
  const close = useCallback(() => {
    // a ref, not the `closing` state: two Escapes in one tick both see the stale state,
    // and a second animation would cut the first short and unmount mid-flight
    if (!view || closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    const done = () => {
      hide(null);
      setView(null);
      setClosing(false);
      closingRef.current = false;
    };
    const target = view.items[view.index].el;
    const img = slides.current[view.index];
    if (!img) return done();
    const to = target.getBoundingClientRect();
    const onScreen = target.isConnected && to.width > 0 && to.bottom > 0 && to.top < innerHeight;
    if (!onScreen) {
      animate(img, { opacity: 0, scale: 0.96 }, { duration: 0.15 }).then(done);
      return;
    }
    hide(target);
    animate(img, flip(layoutRect(img), to), spring).then(done);
  }, [view, hide]);

  // `to` gets the current index and may run past either end; it wraps around
  const go = useCallback(
    (to: (index: number) => number) => {
      if (closingRef.current) return;
      hide(null); // the opened image's page copy comes back once the viewer moves off it
      setView((v) => v && { ...v, index: (to(v.index) + v.items.length) % v.items.length });
    },
    [hide]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go((i) => i + 1);
      if (e.key === "ArrowLeft") go((i) => i - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close, go]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => void (document.body.style.overflow = "unset");
  }, [isOpen]);

  // keep the active thumbnail in view as the index moves
  useEffect(() => {
    if (view) thumbs.current[view.index]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [view]);

  const value = useMemo(() => ({ register, open }), [register, open]);
  const many = (view?.items.length ?? 0) > 1;
  const chrome = { opacity: closing ? 0 : 1, transition: closing ? { duration: 0.1 } : { delay: 0.1 } };

  return (
    <GalleryContext.Provider value={value}>
      {children}
      {view &&
        createPortal(
          <MotionConfig transition={spring}>
            <div
              // above the layout's bottom blur (z-500) and the TOC pill (z-510); toasts (z-9999) stay on top
              className="fixed inset-0 z-1000 flex flex-col items-center gap-3 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Image viewer"
            >
              <motion.div
                className="absolute inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: closing ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                onClick={close}
              />

              <motion.button
                type="button"
                className="absolute top-4 right-4 z-10 p-1 rounded-sm bg-black/50 text-white hover:bg-black/70 transition-colors"
                initial={{ opacity: 0 }}
                animate={chrome}
                onClick={close}
                aria-label="Close"
              >
                <X className="size-6" />
              </motion.button>

              <div className="relative flex-1 min-h-0 w-full pointer-events-none">
                {/* carousel: each slide sits one full width from its neighbour and they all move
                    together. Not clipped, so the zoom can fly in from anywhere; px-6 keeps the
                    neighbours off-screen. */}
                {view.items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="absolute inset-0 flex items-center justify-center px-6"
                    initial={false}
                    animate={{ x: `${(i - view.index) * 100}%` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- same remote src as the page copy, already cached */}
                    <img
                      ref={(el) => void (slides.current[i] = el)}
                      src={item.src}
                      alt={item.alt}
                      aria-hidden={i !== view.index}
                      className="pointer-events-auto max-h-full max-w-[min(100%,72rem)] object-contain bg-sidebar rounded-sm shadow-2xl cursor-zoom-out"
                      onClick={close}
                    />
                  </motion.div>
                ))}

                {many &&
                  ([
                    ["Previous image", -1, ChevronLeft, "left-0"],
                    ["Next image", 1, ChevronRight, "right-0"],
                  ] as const).map(([label, step, Icon, side]) => (
                    <motion.button
                      key={label}
                      type="button"
                      aria-label={label}
                      className={cn(
                        "pointer-events-auto absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors",
                        side
                      )}
                      initial={{ opacity: 0 }}
                      animate={chrome}
                      onClick={() => go((i) => i + step)}
                    >
                      <Icon className="size-6" />
                    </motion.button>
                  ))}
              </div>

              {many && (
                <motion.div
                  className="relative flex max-w-full gap-2 overflow-x-auto p-1 [scrollbar-width:none]"
                  initial={{ opacity: 0 }}
                  animate={chrome}
                >
                  {view.items.map((item, i) => (
                    <button
                      key={item.id}
                      ref={(b) => void (thumbs.current[i] = b)}
                      type="button"
                      aria-label={`Show image ${i + 1} of ${view.items.length}`}
                      aria-current={i === view.index}
                      onClick={() => go(() => i)}
                      className={cn(
                        "shrink-0 h-12 overflow-hidden rounded-xs ring-2 transition",
                        i === view.index
                          ? "ring-white"
                          : // brightness, not opacity: a see-through thumb shows the page behind it
                            "ring-transparent brightness-50 hover:brightness-100"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- tiny thumb of an already-cached image */}
                      <img src={item.src} alt="" className="h-full w-auto object-cover" />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </MotionConfig>,
          document.body
        )}
    </GalleryContext.Provider>
  );
}

interface ImageModalProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export default function ImageModal({ src, alt, title, className }: ImageModalProps) {
  const gallery = useContext(GalleryContext);
  if (!gallery) throw new Error("ImageModal must be rendered inside ImageGalleryProvider");
  const [loaded, setLoaded] = useState(false);
  const id = useId();
  const el = useRef<HTMLImageElement | null>(null);

  // a cached image can finish before hydration, so onLoad never fires for it
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    el.current = img;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  useEffect(
    () => (el.current ? gallery.register({ id, src, alt, el: el.current }) : undefined),
    [gallery, id, src, alt]
  );

  return (
    <motion.img
      ref={imgRef}
      src={src}
      alt={alt}
      title={title}
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={cn(
        "cursor-zoom-in block rounded-sm border my-6 w-full max-w-4xl mx-auto transition-opacity duration-300",
        className,
        // until it arrives: a pulsing box at a typical screenshot ratio, not a zero-height gap.
        // Last, so a caller's own background can't hide it.
        !loaded && "aspect-[16/10] animate-pulse bg-muted text-transparent"
      )}
      onClick={() => gallery.open(id)}
      whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
    />
  );
}
