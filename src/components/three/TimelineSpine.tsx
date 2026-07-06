"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useScroll } from "framer-motion";
import dynamic from "next/dynamic";
import { useWebGLCapability } from "./useWebGLCapability";

const TimelineSpineScene = dynamic(() => import("./TimelineSpineScene"), {
  ssr: false,
  loading: () => null,
});

interface TimelineSpineProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Overlays a glowing WebGL line + scroll-driven pulse on top of the
 * timeline's existing CSS border-l line (left as-is underneath — additive,
 * matching the project's non-destructive fallback pattern). Recomputes
 * height via ResizeObserver so expand/collapse and filter changes (which
 * change the timeline's content height) keep the spine in sync.
 */
export function TimelineSpine({ containerRef }: TimelineSpineProps) {
  const tier = useWebGLCapability();
  const [height, setHeight] = useState(0);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      progressRef.current = v;
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, [containerRef]);

  if (tier === "none" || height === 0) return null;

  return (
    <div className="absolute -left-px top-0 w-6 pointer-events-none" style={{ height }}>
      <TimelineSpineScene tier={tier} height={height} progressRef={progressRef} />
    </div>
  );
}
