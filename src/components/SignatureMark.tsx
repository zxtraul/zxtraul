"use client";

import { useMotionValue, useTransform, useSpring, motion } from "framer-motion";
import Image from "next/image";

/**
 * Personal-touch brand mark: Dr. Parajuli's actual signature, with a soft
 * parallax tilt on hover for a "signed document" feel. Plain CSS/Framer
 * Motion (no WebGL) — decorative footer detail, not worth a Canvas context.
 */
export function SignatureMark() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { damping: 18, stiffness: 220 });
  const smoothY = useSpring(y, { damping: 18, stiffness: 220 });
  const rotateX = useTransform(smoothY, [-30, 30], [10, -10]);
  const rotateY = useTransform(smoothX, [-60, 60], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 400 }}
      className="mx-auto w-32 h-16 relative opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
    >
      <Image
        src="/signature.png"
        alt="Dr. Rahul Parajuli's signature"
        fill
        className="object-contain dark:invert"
      />
    </motion.div>
  );
}
