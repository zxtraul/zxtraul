"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CanvasRoot } from "./CanvasRoot";
import { HologramGlobe } from "./HologramGlobe";
import { PhotoCard3D } from "./PhotoCard3D";
import { usePointer, type PointerState } from "./usePointer";
import type { WebGLTier } from "./useWebGLCapability";

interface HeroSceneProps {
  tier: Extract<WebGLTier, "low" | "high">;
  /** 0 = hero fully in view, 1 = scrolled past — read inside useFrame, never via state. */
  scrollProgressRef?: MutableRefObject<number>;
}

interface RecessionGroupProps {
  interactive: boolean;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  scrollProgressRef?: MutableRefObject<number>;
}

/** Wraps the globe + photo card so both recede together as the user scrolls past the hero — a camera-pulling-back sensation. */
function RecessionGroup({ interactive, pointerRef, scrollProgressRef }: RecessionGroupProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || !scrollProgressRef) return;
    const t = scrollProgressRef.current;
    group.position.z = THREE.MathUtils.lerp(group.position.z, -2.5 * t, 0.08);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0.25 * t, 0.08);
  });

  return (
    <group ref={groupRef}>
      <group position={[-1.35, 0, 0]}>
        <HologramGlobe interactive={interactive} pointerRef={pointerRef} />
      </group>
      <PhotoCard3D interactive={interactive} pointerRef={pointerRef} />
    </group>
  );
}

/**
 * Flagship hero visual: a hologram globe with a Nepal -> USA arc (the
 * residency-journey motif) alongside a real WebGL tilt photo card.
 * Only mounted client-side once useWebGLCapability resolves to 'low'/'high' —
 * see HeroVisual.tsx for the fallback wiring.
 */
export default function HeroScene({ tier, scrollProgressRef }: HeroSceneProps) {
  const pointerRef = useRef({ x: 0, y: 0 });
  usePointer((state: PointerState) => {
    pointerRef.current = { x: state.x, y: state.y };
  });

  const interactive = tier === "high";

  return (
    <CanvasRoot tier={tier} camera={{ position: [0, 0, 5.4], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 4]} intensity={0.8} color="#e0f2fe" />
      <RecessionGroup
        interactive={interactive}
        pointerRef={pointerRef}
        scrollProgressRef={scrollProgressRef}
      />
    </CanvasRoot>
  );
}
