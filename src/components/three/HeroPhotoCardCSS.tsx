"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

/**
 * The original CSS-transform tilt card (perspective + rotateX/rotateY).
 * This is the guaranteed fallback for prefers-reduced-motion, no-WebGL,
 * and the dynamic-import loading state of HeroScene — never delete this.
 */
export function HeroPhotoCardCSS() {
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const smoothCardX = useSpring(cardX, { damping: 20, stiffness: 300 });
  const smoothCardY = useSpring(cardY, { damping: 20, stiffness: 300 });
  const rotateX = useTransform(smoothCardY, [-150, 150], [12, -12]);
  const rotateY = useTransform(smoothCardX, [-150, 150], [-12, 12]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleCardMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  return (
    <div className="relative" style={{ perspective: 1000 }}>
      <motion.div
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="aspect-square max-w-md mx-auto relative rounded-3xl glass-card p-2 shadow-2xl cursor-pointer will-change-transform"
      >
        <div
          className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-2xl overflow-hidden relative"
          style={{ transform: "translateZ(40px)" }}
        >
          <img
            src="/profile-whitecoat.jpg"
            alt="Dr. Rahul Parajuli"
            className="absolute inset-0 w-full h-full object-cover object-top hover:scale-[1.05] transition-transform duration-700 ease-out"
            style={{ filter: "brightness(1.15) contrast(1.05)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6" style={{ transform: "translateZ(20px)" }}>
            <p className="text-white font-medium italic drop-shadow-md">
              &quot;Advancing critical care through rigorous research and compassionate clinical practice.&quot;
            </p>
          </div>
        </div>
      </motion.div>

      <div className="absolute -top-6 -right-6 h-24 w-24 bg-teal-400/20 rounded-full blur-2xl -z-10 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-400/20 rounded-full blur-2xl -z-10 pointer-events-none" />
    </div>
  );
}
