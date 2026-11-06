"use client";

import { useEffect, useRef, useState } from "react";

export type ImageSlide = {
  src: string;
  alt: string;
  label: string;
};

type ImageSlideshowProps = {
  slides: ImageSlide[];
  label: string;
  className?: string;
  autoPlayMs?: number;
  onSlideChange?: (slide: ImageSlide) => void;
};

export function ImageSlideshow({
  slides,
  label,
  className = "",
  autoPlayMs,
  onSlideChange,
}: ImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeSlide = slides[activeIndex];
  const onSlideChangeRef = useRef(onSlideChange);

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  useEffect(() => {
    if (!autoPlayMs || paused || slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, autoPlayMs);

    return () => window.clearInterval(timer);
  }, [autoPlayMs, paused, slides.length]);

  useEffect(() => {
    onSlideChangeRef.current?.(activeSlide);
  }, [activeSlide]);

  const showSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <div
      className={`image-slideshow ${className}`.trim()}
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="image-slideshow__media" aria-live="polite">
        <img key={activeSlide.src} src={activeSlide.src} alt={activeSlide.alt} />
        {slides.length > 1 && (
          <>
            <button
              type="button"
              className="image-slideshow__arrow image-slideshow__arrow--previous"
              onClick={() => showSlide(activeIndex - 1)}
              aria-label="Image précédente"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="image-slideshow__arrow image-slideshow__arrow--next"
              onClick={() => showSlide(activeIndex + 1)}
              aria-label="Image suivante"
            >
              <span aria-hidden="true">›</span>
            </button>
            <span className="image-slideshow__count">
              {activeIndex + 1} / {slides.length}
            </span>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="image-slideshow__dots" aria-label="Choisir une image">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => showSlide(index)}
              aria-label={`Afficher l’image ${index + 1} : ${slide.label}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
