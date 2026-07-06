"use client";

import { useRef } from "react";
import { CanvasRoot } from "./CanvasRoot";
import { HologramGlobe } from "./HologramGlobe";
import { PhotoCard3D } from "./PhotoCard3D";
import { usePointer, type PointerState } from "./usePointer";
import type { WebGLTier } from "./useWebGLCapability";

interface HeroSceneProps {
  tier: Extract<WebGLTier, "low" | "high">;
}

/**
 * Flagship hero visual: a hologram globe with a Nepal -> USA arc (the
 * residency-journey motif) alongside a real WebGL tilt photo card.
 * Only mounted client-side once useWebGLCapability resolves to 'low'/'high' —
 * see HeroVisual.tsx for the fallback wiring.
 */
export default function HeroScene({ tier }: HeroSceneProps) {
  const pointerRef = useRef({ x: 0, y: 0 });
  usePointer((state: PointerState) => {
    pointerRef.current = { x: state.x, y: state.y };
  });

  const interactive = tier === "high";

  return (
    <CanvasRoot tier={tier} camera={{ position: [0, 0, 5.4], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 4]} intensity={0.8} color="#e0f2fe" />
      <group position={[-1.35, 0, 0]}>
        <HologramGlobe interactive={interactive} pointerRef={pointerRef} />
      </group>
      <PhotoCard3D interactive={interactive} pointerRef={pointerRef} />
    </CanvasRoot>
  );
}
