"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CompassCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 25, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25, mass: 0.5 });

  const dotX = useSpring(mouseX, { stiffness: 600, damping: 30 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 30 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 20);
      mouseY.set(e.clientY - 20);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* Compass outer ring */}
      <motion.div
        ref={cursorRef}
        className="absolute w-10 h-10"
        style={{ x: springX, y: springY }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="rgba(212,92,51,0.35)" strokeWidth="1" />
          <circle cx="20" cy="20" r="14" stroke="rgba(212,92,51,0.15)" strokeWidth="0.5" />
          {/* N */}
          <line x1="20" y1="2" x2="20" y2="8" stroke="rgba(212,92,51,0.6)" strokeWidth="1.5" strokeLinecap="round" />
          {/* S */}
          <line x1="20" y1="32" x2="20" y2="38" stroke="rgba(15,118,110,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          {/* E */}
          <line x1="32" y1="20" x2="38" y2="20" stroke="rgba(212,92,51,0.4)" strokeWidth="1" strokeLinecap="round" />
          {/* W */}
          <line x1="2" y1="20" x2="8" y2="20" stroke="rgba(212,92,51,0.4)" strokeWidth="1" strokeLinecap="round" />
          {/* Needle */}
          <polygon points="20,6 18,20 20,22 22,20" fill="rgba(212,92,51,0.7)" />
          <polygon points="20,22 18,20 20,34 22,20" fill="rgba(15,118,110,0.5)" />
        </svg>
      </motion.div>

      {/* Dot center */}
      <motion.div
        ref={dotRef}
        className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "13px",
          translateY: "13px",
        }}
      />
    </div>
  );
}
