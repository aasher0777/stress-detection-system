import React, { useEffect, useRef, useState } from 'react';

/**
 * High-performance smooth custom cursor trailing the mouse with subtle lag
 * Expands dynamically on hover over buttons and interactive elements
 */
export const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const checkHover = (e) => {
      try {
        const target = e.target;
        if (!target) return;
        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          (target.closest && (target.closest('button') || target.closest('a') || target.closest('.clickable')));
        setIsHovered(!!isInteractive);
      } catch (err) {
        setIsHovered(false);
      }
    };

    // Smooth 60/120fps ring lag interpolation (lerp)
    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', checkHover, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 1. Fast Sharp Center Dot with mix-blend-difference for light/dark contrast */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full bg-[#ff6a00] pointer-events-none shadow-[0_0_8px_rgba(255,106,0,0.8)] mix-blend-difference"
      />

      {/* 2. Lagging Trailing Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 rounded-full border border-[#ff6a00]/70 pointer-events-none transition-[width,height,margin,background-color] duration-200 ease-out mix-blend-difference ${
          isHovered
            ? '-ml-6 -mt-6 w-12 h-12 bg-[#ff6a00]/20 border-[#ff6a00] scale-110 shadow-[0_0_20px_rgba(255,106,0,0.5)]'
            : '-ml-4 -mt-4 w-8 h-8'
        }`}
      />
    </div>
  );
};
