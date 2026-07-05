"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3, NEPAL_COORDS, USA_COORDS } from "./geo";

const GLOBE_RADIUS = 1.3;
const DOT_COUNT = 900;

function useDotSpherePositions(count: number, radius: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return positions;
  }, [count, radius]);
}

interface HologramGlobeProps {
  interactive: boolean;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

/**
 * Stylized wireframe/dotted "hologram" globe with a glowing arc from
 * Biratnagar, Nepal to the USA — the residency-journey motif for the hero.
 * Deliberately abstract (no textured map) to stay lightweight and match
 * the site's existing sci-fi hologram aesthetic.
 */
export function HologramGlobe({ interactive, pointerRef }: HologramGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const dotPositions = useDotSpherePositions(DOT_COUNT, GLOBE_RADIUS);

  const start = useMemo(
    () => latLngToVector3(NEPAL_COORDS[0], NEPAL_COORDS[1], GLOBE_RADIUS),
    []
  );
  const end = useMemo(
    () => latLngToVector3(USA_COORDS[0], USA_COORDS[1], GLOBE_RADIUS),
    []
  );

  const arcCurve = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(GLOBE_RADIUS * 1.55);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const arcPoints = useMemo(() => arcCurve.getPoints(64), [arcCurve]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (group) {
      group.rotation.y += delta * 0.12;
      if (interactive) {
        const targetX = pointerRef.current.y * 0.25;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.05);
      }
    }
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime * 0.22) % 1;
      pulseRef.current.position.copy(arcCurve.getPointAt(t));
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dotPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#2dd4bf" size={0.02} transparent opacity={0.5} sizeAttenuation />
      </points>

      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.99, 32, 32]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.25} />
      </mesh>

      <Line points={arcPoints} color="#5eead4" lineWidth={1.5} transparent opacity={0.85} />

      <mesh position={start}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#14b8a6" />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
