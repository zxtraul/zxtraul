"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CanvasRoot } from "./CanvasRoot";
import type { WebGLTier } from "./useWebGLCapability";

interface GlintProps {
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

function Glint({ pointerRef }: GlintProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, pointerRef.current.x * 1.4, 0.18);
    mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, pointerRef.current.y * 1.4, 0.18);
  });

  return (
    <mesh ref={meshRef}>
      <circleGeometry args={[0.5, 32]} />
      <meshBasicMaterial color="#e0f2fe" transparent opacity={0.6} />
    </mesh>
  );
}

interface GalleryTileGlintSceneProps {
  tier: Extract<WebGLTier, "low" | "high">;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

/**
 * Soft specular highlight that tracks the pointer within a gallery tile,
 * blurred via a CSS filter on the wrapping element and mix-blend-screen'd
 * on top of the real next/image tile — a real WebGL light source that a
 * CSS gradient can't easily reproduce, without ever touching the actual
 * <Image> element underneath (kept indexable/optimized as-is).
 */
export default function GalleryTileGlintScene({ tier, pointerRef }: GalleryTileGlintSceneProps) {
  return (
    <CanvasRoot
      tier={tier}
      orthographic
      camera={{ position: [0, 0, 5], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 }}
    >
      <Glint pointerRef={pointerRef} />
    </CanvasRoot>
  );
}
