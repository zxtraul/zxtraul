"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { duration, easing } from "@/lib/motion";

/**
 * Subtle route-level crossfade + vertical drift, keyed on pathname so
 * AnimatePresence treats each route as a distinct exiting/entering child.
 * Deliberately not used for in-page transitions (modals, filters) — those
 * already have their own local AnimatePresence usages and shouldn't
 * double up with this. Reduced-motion is handled by the global
 * <MotionConfig reducedMotion="user"> in layout.tsx.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: duration.fast, ease: easing.cinematicOut }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
