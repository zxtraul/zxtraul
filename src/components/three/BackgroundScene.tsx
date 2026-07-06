"use client";

import { useRef, type MutableRefObject } from "react";
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

const BASE_OPACITY = 0.55;
const BASE_ROTATION_SPEED = 0.015;

interface ParticleFieldProps {
  scrollVelocityRef?: MutableRefObject<number>;
}

function ParticleField({ scrollVelocityRef }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const { positions, colors } = PARTICLE_FIELD;
  const pointerRef = useRef({ x: 0, y: 0 });

  usePointer((state: PointerState) => {
    pointerRef.current = { x: state.x, y: state.y };
  });

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    // Scroll velocity is in 0-1-progress-units/second — clamp to a sane
    // boost range so a fast flick-scroll doesn't spin the field wildly.
    const rawVelocity = scrollVelocityRef?.current ?? 0;
    const scrollBoost = Math.min(Math.abs(rawVelocity) * 0.4, 4);

    points.rotation.y += delta * (BASE_ROTATION_SPEED + scrollBoost * 0.02);

    const targetX = pointerRef.current.x * 0.6;
    const targetY = pointerRef.current.y * 0.4;
    points.position.x = THREE.MathUtils.lerp(points.position.x, targetX, 0.02);
    points.position.y = THREE.MathUtils.lerp(points.position.y, targetY, 0.02);

    if (materialRef.current) {
      const targetOpacity = Math.min(BASE_OPACITY + scrollBoost * 0.08, 0.9);
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        targetOpacity,
        0.1
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.045}
        vertexColors
        transparent
        opacity={BASE_OPACITY}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface BackgroundSceneProps {
  scrollVelocityRef?: MutableRefObject<number>;
}

/**
 * Ambient depth layer sitting under the existing scanline/grid/spotlight
 * CSS overlays in InteractiveBackground.tsx — additive, not a replacement.
 * 'high' tier only for now (always-on frameloop on every route is the
 * highest perf-risk item in the 3D plan). Reacts to scroll velocity (via
 * a ref, never React state) in addition to pointer position, so the page
 * feels alive as the reviewer scrolls, not just when they move the mouse.
 */
export default function BackgroundScene({ scrollVelocityRef }: BackgroundSceneProps) {
  return (
    <CanvasRoot
      tier="high"
      camera={{ position: [0, 0, 5], fov: 55 }}
      frameloop="always"
    >
      <ParticleField scrollVelocityRef={scrollVelocityRef} />
    </CanvasRoot>
  );
}
