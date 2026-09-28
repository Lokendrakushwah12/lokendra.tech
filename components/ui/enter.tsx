import type { CSSProperties, ReactNode } from "react";

/**
 * Staggered entrance. `stagger` multiplies the 70ms step, so siblings
 * numbered 1, 2, 3 cascade in. With `list`, the wrapper stays still and
 * only sets the base: an `.enter-list` inside cascades its own children
 * from there. Keyframes live in globals.css.
 */
const Enter = ({
  stagger = 1,
  list = false,
  className,
  children,
}: {
  stagger?: number;
  list?: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={`${list ? "" : "animate-enter"} ${className ?? ""}`}
    style={{ "--stagger": stagger } as CSSProperties}
  >
    {children}
  </div>
);

export default Enter;
