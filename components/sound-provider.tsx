"use client";

import { SOUNDS, type SoundName } from "@/lib/sound/sounds";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const KEY = "lokendra:sound";

type Ctx = { enabled: boolean; toggle: () => void; play: (n: SoundName) => void };
const SoundContext = createContext<Ctx>({
  enabled: false,
  toggle: () => {},
  play: () => {},
});

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: ReactNode }) {
  // default off: audio that starts on its own is hostile
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(KEY) === "on");
    } catch {
      /* private mode / blocked storage */
    }
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      // the player is only loaded once sound is actually switched on
      import("@/lib/sound/player")
        .then((m) => m.default(SOUNDS[name]))
        .catch(() => {});
    },
    [enabled]
  );

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      if (next) {
        import("@/lib/sound/player")
          .then((m) => m.default(SOUNDS.success))
          .catch(() => {});
      }
      return next;
    });
  }, []);

  // one delegated pair of listeners instead of handlers on every element
  useEffect(() => {
    if (!enabled) return;
    const interactive = "a, button, [role='button'], summary, input, select";

    const onClick = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.(interactive)) play("tap");
    };
    let lastHover: Element | null = null;
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element)?.closest?.(interactive) ?? null;
      if (el && el !== lastHover) {
        lastHover = el;
        play("hover");
      } else if (!el) {
        lastHover = null;
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseover", onOver, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseover", onOver, true);
    };
  }, [enabled, play]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, play }}>
      {children}
    </SoundContext.Provider>
  );
}
