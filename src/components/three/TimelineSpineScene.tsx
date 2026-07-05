"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { CanvasRoot } from "./CanvasRoot";
import type { WebGLTier } from "./useWebGLCapability";

interface SpineContentProps {
  height: number;
  progressRef: MutableRefObject<number>;
}

function SpineContent({ height, progressRef }: SpineContentProps) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const points = [new THREE.Vector3(0, height / 2, 0), new THREE.Vector3(0, -height / 2, 0)];

  useFrame(() => {
    if (pulseRef.current) {
      pulseRef.current.position.y = height / 2 - progressRef.current * height;
    }
  });

  return (
    <>
      <Line points={points} color="#2dd4bf" lineWidth={2} transparent opacity={0.55} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[5, 12, 12]} />
        <meshBasicMaterial color="#5eead4" />
      </mesh>
    </>
  );
}

interface TimelineSpineSceneProps {
  tier: Extract<WebGLTier, "low" | "high">;
  height: number;
  progressRef: MutableRefObject<number>;
}

/**
 * Glowing WebGL replacement for the timeline's CSS border-l line, with a
 * scroll-driven pulse. Uses a pixel-unit orthographic camera (1 unit = 1px)
 * so positioning against the measured container height needs no conversion.
 */
export default function TimelineSpineScene({ tier, height, progressRef }: TimelineSpineSceneProps) {
  return (
    <CanvasRoot
      tier={tier}
      orthographic
      camera={{
        position: [0, 0, 10],
        left: -12,
        right: 12,
        top: height / 2,
        bottom: -height / 2,
        near: 0.1,
        far: 100,
      }}
    >
      <SpineContent height={height} progressRef={progressRef} />
    </CanvasRoot>
  );
}
