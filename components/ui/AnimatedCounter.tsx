"use client";

import React, { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 1100,
  className = "",
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px 0px -20px 0px" });

  const rawString = String(value).trim();

  const isFractional = rawString.includes("/");
  let prefix = "";
  let suffix = "";
  let targetNumber = 0;
  let hasDecimal = false;

  if (isFractional) {
    const parts = rawString.split("/");
    targetNumber = parseFloat(parts[0]) || 24;
    suffix = `/${parts[1] || "7"}`;
  } else {
    const match = rawString.match(/^([^0-9.]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (match) {
      prefix = match[1] || "";
      targetNumber = parseFloat(match[2]) || 0;
      suffix = match[3] || "";
      hasDecimal = match[2].includes(".");
    } else {
      targetNumber = parseFloat(rawString) || 0;
    }
  }

  useEffect(() => {
    if (!isInView || targetNumber === 0) return;
    const el = numberRef.current;
    if (!el) return;

    let startTimestamp: number | null = null;
    let animationId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // Smooth ease-out cubic for ultra-responsive count up
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = ease * targetNumber;

      if (el) {
        el.textContent = hasDecimal
          ? val.toFixed(1)
          : Math.floor(val).toLocaleString();
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      } else if (el) {
        el.textContent = hasDecimal
          ? targetNumber.toFixed(1)
          : targetNumber.toLocaleString();
      }
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isInView, targetNumber, duration, hasDecimal]);

  return (
    <span
      ref={containerRef}
      className={`tabular-nums inline-flex items-baseline will-change-transform ${className}`}
    >
      {prefix && <span>{prefix}</span>}
      <span ref={numberRef}>{isInView ? (hasDecimal ? "0.0" : "0") : "0"}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
