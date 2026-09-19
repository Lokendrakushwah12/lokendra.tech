"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Cross-fades between two icons with a blur + scale pop.
 * `swapKey` must change whenever the child changes, or nothing animates.
 *
 *   <IconSwap swapKey={copied ? "check" : "copy"}>
 *     {copied ? <Check /> : <Copy />}
 *   </IconSwap>
 */
const IconSwap = ({
  swapKey,
  children,
  className,
}: {
  swapKey: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={swapKey}
        initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
        className={`inline-flex items-center justify-center ${className ?? ""}`}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};

export default IconSwap;
