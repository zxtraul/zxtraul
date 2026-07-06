"use client";

import { type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Subtle header "settle" drift as a section scrolls into view — cheap,
 * CSS-only (no WebGL), applied uniformly across section headings so
 * scrolling reads as directed motion rather than a series of independent
 * fade-ins. Transform-based, so <MotionConfig reducedMotion="user"> in
 * layout.tsx handles the reduced-motion case automatically.
 */
export function useSectionParallax(ref: RefObject<HTMLElement | null>): {
  y: MotionValue<number>;
} {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return { y };
}
