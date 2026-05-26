"use client";

import { useEffect, useCallback } from "react";

export default function Lightbox({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const src = images[index];

  return (
    <div
      data-lightbox-restore
      className="fixed z-[10000] flex items-center justify-center"
      style={{ top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-[32px] leading-none opacity-60 hover:opacity-100 transition-opacity select-none"
          aria-label="Previous image"
        >
          ←
        </button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        data-no-greyscale
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", display: "block" }}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-[32px] leading-none opacity-60 hover:opacity-100 transition-opacity select-none"
          aria-label="Next image"
        >
          →
        </button>
      )}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-[24px] leading-none opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        ×
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-[13px] opacity-50"
          style={{ fontFamily: "monospace" }}>
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
