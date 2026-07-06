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
