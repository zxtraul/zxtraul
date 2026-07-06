"use client";

import dynamic from "next/dynamic";
import { type RefObject, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useWebGLCapability } from "./useWebGLCapability";
import { HeroPhotoCardCSS } from "./HeroPhotoCardCSS";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroPhotoCardCSS />,
});

interface HeroVisualProps {
  /** The hero <section>'s ref — scroll progress is measured against its bounds. */
  sectionRef: RefObject<HTMLElement | null>;
}

/**
 * Hero visual slot: renders the original CSS tilt card unconditionally on
 * first paint (SSR-safe, zero layout shift), then swaps to the WebGL
 * hologram-globe scene once the client-side capability check resolves to
 * 'low'/'high'. Stays on the CSS card for 'none' (no WebGL, reduced-motion).
 *
 * Both paths recede slightly as the user scrolls past the hero — a subtle
 * "camera pulling back" sensation. The WebGL path drives this in Three.js
 * (see HeroScene's RecessionGroup); the CSS path uses an equivalent
 * scale/opacity transform, explicitly skipped under reduced-motion.
 */
export function HeroVisual({ sectionRef }: HeroVisualProps) {
  const tier = useWebGLCapability();
  const prefersReducedMotion = useReducedMotion();
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      scrollProgressRef.current = v;
    });
  }, [scrollYProgress]);

  const cssScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const cssOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  if (tier === "none") {
    return (
      <motion.div
        style={prefersReducedMotion ? undefined : { scale: cssScale, opacity: cssOpacity }}
      >
        <HeroPhotoCardCSS />
      </motion.div>
    );
  }

  return (
    <div className="relative aspect-[4/3] max-w-xl mx-auto">
      <HeroScene tier={tier} scrollProgressRef={scrollProgressRef} />
    </div>
  );
}
