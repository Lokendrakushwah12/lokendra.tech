"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageModalProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageModal({ src, alt, className }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150); // Match animation duration
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
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity block ${
          className || ""
        }`}
        onClick={handleImageClick}
      />

      {isOpen && createPortal(
        <div
          className={`fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-all duration-150 ${
            isClosing ? "animate-out fade-out" : "animate-in fade-in"
          }`}
          onClick={handleBackdropClick}
        >
          <div
            className={`relative max-w-6xl max-h-full transition-all duration-150 ${
              isClosing ? "animate-out zoom-out-95" : "animate-in zoom-in-95"
            }`}
            onClick={handleClose}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
