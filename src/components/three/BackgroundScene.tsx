"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CanvasRoot } from "./CanvasRoot";
import { usePointer, type PointerState } from "./usePointer";

const PARTICLE_COUNT = 500;
const FIELD_WIDTH = 16;
const FIELD_HEIGHT = 10;
const FIELD_DEPTH = 6;

/**
 * Computed once at module load (not per-render/per-mount) — keeps the
 * random field generation out of any component's render path entirely,
 * since the field never needs to change between mounts.
 */
function createParticleField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const teal = new THREE.Color("#2dd4bf");
  const blue = new THREE.Color("#3b82f6");

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH;
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HEIGHT;
    positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_DEPTH - 2;

    const mixed = teal.clone().lerp(blue, Math.random());
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }
  return { positions, colors };
}

const PARTICLE_FIELD = createParticleField(PARTICLE_COUNT);

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, colors } = PARTICLE_FIELD;
  const pointerRef = useRef({ x: 0, y: 0 });

  usePointer((state: PointerState) => {
    pointerRef.current = { x: state.x, y: state.y };
  });

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    points.rotation.y += delta * 0.015;

    const targetX = pointerRef.current.x * 0.6;
    const targetY = pointerRef.current.y * 0.4;
    points.position.x = THREE.MathUtils.lerp(points.position.x, targetX, 0.02);
    points.position.y = THREE.MathUtils.lerp(points.position.y, targetY, 0.02);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Ambient depth layer sitting under the existing scanline/grid/spotlight
 * CSS overlays in InteractiveBackground.tsx — additive, not a replacement.
 * 'high' tier only for now (always-on frameloop on every route is the
 * highest perf-risk item in the 3D plan).
 */
export default function BackgroundScene() {
  return (
    <CanvasRoot
      tier="high"
      camera={{ position: [0, 0, 5], fov: 55 }}
      frameloop="always"
    >
      <ParticleField />
    </CanvasRoot>
  );
}
