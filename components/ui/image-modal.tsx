"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface ImageModalProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageModal({ src, alt, className }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageRect, setImageRect] = useState<
    (DOMRect & { offsetX: number; offsetY: number }) | null
  >(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = () => {
    console.log("Image clicked, opening modal");
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      // Calculate offset from image center to viewport center
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const imageCenterX = rect.left + rect.width / 2;
      const imageCenterY = rect.top + rect.height / 2;

      setImageRect({
        ...rect,
        offsetX: imageCenterX - viewportCenterX,
        offsetY: imageCenterY - viewportCenterY,
        width: rect.width,
        height: rect.height,
      } as DOMRect & { offsetX: number; offsetY: number });
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    console.log("Closing modal");
    setIsOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Add keyboard support (ESC key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`cursor-zoom-in hover:opacity-90 transition-opacity block rounded-lg border my-6 w-full max-w-4xl mx-auto ${
          className || ""
        }`}
        onClick={handleImageClick}
        layoutId={`image-${src}`}
        style={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
              onClick={handleBackdropClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.img
                src={src}
                alt={alt}
                className="max-w-6xl cursor-zoom-out w-full max-h-full object-contain rounded-lg border border-border/20 dark:border-border shadow-2xl"
                onClick={handleClose}
                layoutId={`image-${src}`}
                initial={{
                  x: imageRect ? imageRect.offsetX : 0,
                  y: imageRect ? imageRect.offsetY : 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                }}
                exit={{
                  x: imageRect ? imageRect.offsetX : 0,
                  y: imageRect ? imageRect.offsetY : 0,
                }}
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.6,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
