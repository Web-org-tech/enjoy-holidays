"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  scale?: boolean;
  className?: string;
  duration?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  scale = false,
  className = "",
  duration = 0.45,
  distance = 18,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger smoothly right as element enters the viewport
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20px 0px" });

  const getInitial = () => {
    const initial: { opacity: number; x?: number; y?: number; scale?: number } = {
      opacity: 0,
    };

    if (direction === "up") initial.y = distance;
    if (direction === "down") initial.y = -distance;
    if (direction === "left") initial.x = distance;
    if (direction === "right") initial.x = -distance;
    if (scale) initial.scale = 0.96;

    return initial;
  };

  const getAnimate = () => {
    if (!isInView) return getInitial();
    const animate: { opacity: number; x?: number; y?: number; scale?: number } = {
      opacity: 1,
    };
    if (direction === "up" || direction === "down") animate.y = 0;
    if (direction === "left" || direction === "right") animate.x = 0;
    if (scale) animate.scale = 1;
    return animate;
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={getAnimate()}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Ultra-smooth cubic bezier ease-out
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
