"use client";

import { useId, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageModalProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export default function ImageModal({
  src,
  alt,
  title,
  className,
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();

  const handleClose = () => setIsOpen(false);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <MotionConfig
      transition={{ type: "spring", stiffness: 550, damping: 35, mass: 0.6 }}
    >
      <motion.img
        src={src}
        alt={alt}
        title={title}
        layoutId={id}
        className={cn(
          "cursor-zoom-in block rounded-sm border my-6 w-full max-w-4xl mx-auto",
          className
        )}
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
      />

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Image modal"
              >
                <motion.div
                  className="absolute inset-0 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleBackdropClick}
                />
                <div className="relative z-10 flex items-center justify-center max-w-6xl max-h-full pointer-events-none">
                  <div className="pointer-events-auto relative">
                    <motion.button
                      type="button"
                      className="absolute -top-10 right-0 p-1 rounded-sm bg-black/50 text-white hover:bg-black/70 transition-colors"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { delay: 0.1 },
                      }}
                      exit={{ opacity: 0, transition: { duration: 0.05 } }}
                      transition={{ duration: 0.1 }}
                      onClick={handleClose}
                      aria-label="Close"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                    <motion.img
                      layoutId={id}
                      src={src}
                      alt={alt}
                      className="bg-sidebar w-full max-h-[85vh] object-contain rounded-sm shadow-2xl cursor-zoom-out"
                      onClick={handleClose}
                    />
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </MotionConfig>
  );
}