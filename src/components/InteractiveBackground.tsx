"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, useVelocity } from "framer-motion";
import { useWebGLCapability } from "./three/useWebGLCapability";

const BackgroundScene = dynamic(() => import("./three/BackgroundScene"), {
  ssr: false,
  loading: () => null,
});

export default function InteractiveBackground() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const webglTier = useWebGLCapability();
  const isHome = pathname === "/";
  const { scrollYProgress } = useScroll();
  
  // Smooth scroll parallax using progress so it never runs out of bounds
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100, mass: 0.5 });
  const yOffset = useTransform(smoothProgress, [0, 1], ["0vh", "-150vh"]);
  const scale = useTransform(smoothProgress, [0, 1], [1.02, 1.05]);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 150 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 150 });

  // Hologram Glitch Physics (Velocity-based)
  const velX = useVelocity(smoothMouseX);
  const velY = useVelocity(smoothMouseY);
  
  // Create an absolute magnitude of velocity for fluid warping
  // @ts-ignore
  const warpIntensity = useTransform([velX, velY], ([x, y]: number[]) => {
    const magnitude = Math.sqrt(x * x + y * y);
    // Map cursor speed to SVG displacement scale (max 80)
    return Math.min(magnitude * 0.06, 80);
  });
  
  const smoothWarp = useSpring(warpIntensity, { damping: 15, stiffness: 100 });

  const parallaxX = useTransform(smoothMouseX, (x) => {
    if (typeof window === "undefined") return 0;
    return -((x / window.innerWidth) * 2 - 1) * 24;
  });
  
  const parallaxY = useTransform(smoothMouseY, (y) => {
    if (typeof window === "undefined") return 0;
    return -((y / window.innerHeight) * 2 - 1) * 24;
  });

  // RGB Split offsets based on velocity
  const rgbOffsetX = useTransform(velX, [-3000, 3000], [-50, 50]);
  const rgbOffsetY = useTransform(velY, [-3000, 3000], [-50, 50]);

  const spotlight = useMotionTemplate`radial-gradient(circle 600px at ${smoothMouseX}px ${smoothMouseY}px, rgba(20, 184, 166, 0.35), transparent 80%), radial-gradient(circle 300px at ${smoothMouseX}px ${smoothMouseY}px, rgba(59, 130, 246, 0.25), transparent 75%)`;
  
  const bgX = useMotionTemplate`calc(-50% + ${parallaxX}px)`;
  const bgY = useMotionTemplate`calc(${yOffset} + ${parallaxY}px)`;
  
  // Grid Overlay (Reacts strongly to cursor)
  const gridX = useTransform(smoothMouseX, x => (typeof window !== "undefined" ? -((x / window.innerWidth) * 2 - 1) * 100 : 0));
  const gridY = useTransform(smoothMouseY, y => (typeof window !== "undefined" ? -((y / window.innerHeight) * 2 - 1) * 100 : 0));

  // Cyan Layer
  const cyanX = useMotionTemplate`calc(-50% + ${parallaxX}px + ${rgbOffsetX}px)`;
  const cyanY = useMotionTemplate`calc(${yOffset} + ${parallaxY}px + ${rgbOffsetY}px)`;

  // Red Layer
  const redX = useMotionTemplate`calc(-50% + ${parallaxX}px - ${rgbOffsetX}px)`;
  const redY = useMotionTemplate`calc(${yOffset} + ${parallaxY}px - ${rgbOffsetY}px)`;

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    if (typeof window !== "undefined") {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-2] bg-slate-950 transition-colors duration-500">
      {/* WebGL ambient particle depth layer — 'high' tier only, additive under the CSS overlays below */}
      {webglTier === "high" && (
        <div className="absolute inset-0">
          <BackgroundScene />
        </div>
      )}

      {/* Scanlines Overlay for Hologram Texture */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)",
          backgroundSize: "100% 4px"
        }}
      />

      {/* Grid Overlay */}
      <motion.div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0),
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px, 160px 160px, 160px 160px",
          color: "rgb(45, 212, 191)",
          x: gridX,
          y: gridY,
        }}
      />

      {/* Double-layered spotlighting overlay following cursor */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-300"
        style={{ background: spotlight }}
      />

      <div className="absolute inset-0 bg-slate-950/20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/10 to-slate-950 pointer-events-none" />
    </div>
  );
}
