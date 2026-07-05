"use client";

import { useEffect, useState } from "react";

export type WebGLTier = "none" | "low" | "high";

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function computeTier(): WebGLTier {
  if (typeof window === "undefined") return "none";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return "none";

  if (!probeWebGL()) return "none";

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;

  // Coarse pointer (touch) is the primary low-tier signal. Core/memory
  // checks only catch genuinely weak hardware — a 4-core laptop is common
  // and should still get the full experience, so the bar here is low.
  const isLowPower =
    isCoarsePointer ||
    (typeof cores === "number" && cores <= 2) ||
    (typeof memory === "number" && memory <= 2);

  return isLowPower ? "low" : "high";
}

/**
 * Client-only capability gate every 3D component depends on.
 * Resolves once on mount, then only recomputes on relevant media-query changes.
 */
export function useWebGLCapability(): WebGLTier {
  const [tier, setTier] = useState<WebGLTier>("none");

  useEffect(() => {
    setTier(computeTier());

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const recompute = () => setTier(computeTier());

    reducedMotionQuery.addEventListener("change", recompute);
    pointerQuery.addEventListener("change", recompute);

    return () => {
      reducedMotionQuery.removeEventListener("change", recompute);
      pointerQuery.removeEventListener("change", recompute);
    };
  }, []);

  return tier;
}
