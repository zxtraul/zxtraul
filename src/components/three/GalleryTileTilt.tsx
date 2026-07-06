"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { useWebGLCapability } from "./useWebGLCapability";

const GalleryTileGlintScene = dynamic(() => import("./GalleryTileGlintScene"), {
  ssr: false,
  loading: () => null,
});

interface GalleryTileTiltProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

/**
 * Drop-in replacement for a plain gallery tile <div>: adds a real CSS 3D
 * tilt (pointer-driven, same technique as the hero card) plus a WebGL
 * specular glint overlay. The glint's Canvas only mounts while this
 * specific tile is hovered, so at most one WebGL context is ever active
 * across the whole gallery at a time — never one context per tile.
 */
export function GalleryTileTilt({ className, onClick, children }: GalleryTileTiltProps) {
  const tier = useWebGLCapability();
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { damping: 20, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 20, stiffness: 300 });
  const rotateX = useTransform(smoothY, [-150, 150], [7, -7]);
  const rotateY = useTransform(smoothX, [-150, 150], [-7, 7]);

  const pointerRef = useRef({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left - rect.width / 2;
    const localY = e.clientY - rect.top - rect.height / 2;
    x.set(localX);
    y.set(localY);
    pointerRef.current = {
      x: localX / (rect.width / 2),
      y: -localY / (rect.height / 2),
    };
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className={className}
    >
      {children}
      {hovered && tier !== "none" && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70"
          style={{ filter: "blur(18px)" }}
        >
          <GalleryTileGlintScene tier={tier} pointerRef={pointerRef} />
        </div>
      )}
    </motion.div>
  );
}
