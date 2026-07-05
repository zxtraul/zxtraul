"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, RoundedBox, Edges } from "@react-three/drei";
import * as THREE from "three";

interface PhotoCard3DProps {
  interactive: boolean;
  pointerRef: MutableRefObject<{ x: number; y: number }>;
}

/**
 * Real WebGL replacement for the CSS perspective/rotateX/rotateY tilt card —
 * an actual textured plane with a perspective camera and pointer-driven
 * rotation, plus a soft teal frame-glow behind it for a "glass hologram" edge.
 */
export function PhotoCard3D({ interactive, pointerRef }: PhotoCard3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture("/profile-whitecoat.jpg");

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    if (interactive) {
      const targetRotY = pointerRef.current.x * 0.35;
      const targetRotX = -pointerRef.current.y * 0.25;
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.08);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, 0.08);
    } else {
      const t = state.clock.elapsedTime;
      group.rotation.y = Math.sin(t * 0.3) * 0.12;
      group.rotation.x = Math.cos(t * 0.25) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[1.5, 0, 0]}>
      {/* Soft outer glow silhouette, matching the site's teal glass-card halo */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[2.3, 2.8]} />
        <meshBasicMaterial color="#14b8a6" transparent opacity={0.18} />
      </mesh>

      {/* Rounded frame/bezel */}
      <RoundedBox args={[2, 2.5, 0.12]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
        <Edges color="#5eead4" threshold={15} />
      </RoundedBox>

      {/* Photo inset, flush with the frame's front face */}
      <mesh position={[0, 0, 0.061]}>
        <planeGeometry args={[1.86, 2.36]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.05} />
      </mesh>

      <pointLight position={[1, 1, 1.8]} intensity={2.2} color="#5eead4" />
    </group>
  );
}
