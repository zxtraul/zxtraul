"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CanvasRoot } from "./CanvasRoot";
import type { WebGLTier } from "./useWebGLCapability";

const TURNS = 3;
const SEGMENTS = 28;
const RADIUS = 0.55;
const HEIGHT = 4.2;
const RUNG_STEP = 3;

function useHelixStrands() {
  return useMemo(() => {
    const strandA: THREE.Vector3[] = [];
    const strandB: THREE.Vector3[] = [];

    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const angle = t * Math.PI * 2 * TURNS;
      const y = (t - 0.5) * HEIGHT;
      strandA.push(new THREE.Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS));
      strandB.push(
        new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS)
      );
    }
    return { strandA, strandB };
  }, []);
}

interface DoubleHelixProps {
  scrollVelocityRef?: MutableRefObject<number>;
}

function DoubleHelix({ scrollVelocityRef }: DoubleHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { strandA, strandB } = useHelixStrands();

  useFrame((_, delta) => {
    if (groupRef.current) {
      const rawVelocity = scrollVelocityRef?.current ?? 0;
      const scrollBoost = Math.min(Math.abs(rawVelocity) * 0.5, 3);
      groupRef.current.rotation.y += delta * (0.25 + scrollBoost * 0.15);
    }
  });

  return (
    <group ref={groupRef}>
      {strandA.map((p, i) => (
        <mesh key={`a-${i}`} position={p}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#0f766e" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {strandB.map((p, i) => (
        <mesh key={`b-${i}`} position={p}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {strandA.map((p, i) => {
        if (i % RUNG_STEP !== 0) return null;
        const q = strandB[i];
        const mid = p.clone().lerp(q, 0.5);
        const dist = p.distanceTo(q);
        const direction = q.clone().sub(p).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction
        );
        return (
          <mesh key={`rung-${i}`} position={mid} quaternion={quaternion}>
            <cylinderGeometry args={[0.015, 0.015, dist, 6]} />
            <meshBasicMaterial color="#94a3b8" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

interface HelixSceneProps {
  tier: Extract<WebGLTier, "low" | "high">;
  scrollVelocityRef?: MutableRefObject<number>;
}

/** Decorative rotating DNA double-helix accent for the Research page. */
export default function HelixScene({ tier, scrollVelocityRef }: HelixSceneProps) {
  return (
    <CanvasRoot tier={tier} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 3]} intensity={0.6} />
      <DoubleHelix scrollVelocityRef={scrollVelocityRef} />
    </CanvasRoot>
  );
}
