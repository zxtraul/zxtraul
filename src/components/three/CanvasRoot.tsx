"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import type { WebGLTier } from "./useWebGLCapability";

interface CanvasRootProps extends Omit<CanvasProps, "dpr" | "gl"> {
  tier: Extract<WebGLTier, "low" | "high">;
  children: ReactNode;
}

/**
 * Shared <Canvas> wrapper applying the project's perf policy in one place:
 * capped DPR, alpha compositing over existing glass/gradient backgrounds,
 * and a Suspense boundary so texture/geometry loads never block content
 * that's already server-rendered around the canvas.
 *
 * frameloop policy: every current scene (hero globe/card, background
 * particles, DNA helix, timeline spine pulse, gallery glint) drives its
 * motion via per-frame lerp/easing toward a target, which needs several
 * continuous frames to settle after each input (pointer/scroll) event —
 * frameloop="demand" only renders one frame per invalidate() call, which
 * would make these snap instead of ease. Default "always" is intentional
 * here, not an oversight; revisit only if a future scene has no idle-time
 * easing (e.g. a purely event-driven static overlay).
 */
export function CanvasRoot({ tier, children, ...props }: CanvasRootProps) {
  return (
    <Canvas
      dpr={tier === "high" ? [1, 2] : 1}
      gl={{
        antialias: tier === "high",
        alpha: true,
        powerPreference: "high-performance",
      }}
      {...props}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
