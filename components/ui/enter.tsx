import type { CSSProperties, ReactNode } from "react";

/**
 * Staggered entrance. `stagger` multiplies the 80ms step, so siblings
 * numbered 1, 2, 3 cascade in. Keyframes live in globals.css.
 */
const Enter = ({
  stagger = 1,
  className,
  children,
}: {
  stagger?: number;
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={`animate-enter ${className ?? ""}`}
    style={{ "--stagger": stagger } as CSSProperties}
  >
    {children}
  </div>
);

export default Enter;
