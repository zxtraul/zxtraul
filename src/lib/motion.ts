import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion design system. Every section should source its
 * entrance/hover/stagger timing from here instead of inline ad-hoc
 * transition objects, so the whole site reads as one consistent motion
 * language rather than a collection of independently-tuned animations.
 *
 * Reduced-motion handling is global, not per-variant: <MotionConfig
 * reducedMotion="user"> in layout.tsx automatically strips transform-based
 * animation (the x/y/scale/rotate values below) when the OS requests
 * reduced motion, leaving simple opacity fades — no per-component logic
 * needed.
 */

export const easing = {
  /** Expo-out — entrances, section reveals, anything "arriving". */
  cinematicOut: [0.16, 1, 0.3, 1] as const,
  /** Default in/out — small UI state changes (toggles, hovers). */
  standard: [0.4, 0, 0.2, 1] as const,
  /** Slight overshoot — hover/tap feedback, chevrons, playful accents. */
  snappy: [0.34, 1.56, 0.64, 1] as const,
};

export const duration = {
  /** Matches existing card/filter/AnimatePresence timings. */
  fast: 0.3,
  /** Matches the existing hero/section fade-up default. */
  base: 0.6,
  /** New — section header "settle" reveals. */
  slow: 0.9,
  /** New — hero intro sequence, route transitions. */
  cinematic: 1.2,
};

export const springs = {
  soft: { type: "spring", stiffness: 120, damping: 20, mass: 0.6 } as const,
  /** Matches the values already used for the gallery tile tilt. */
  snappy: { type: "spring", stiffness: 300, damping: 20 } as const,
};

/** Anticipatory viewport trigger — reveals feel like arrival, not reaction. */
export const viewportOnce = { once: true, margin: "-80px" } as const;

const fadeUpTransition: Transition = { duration: duration.base, ease: easing.cinematicOut };
const fadeUpSmTransition: Transition = { duration: duration.fast, ease: easing.cinematicOut };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: fadeUpTransition },
};

export const fadeUpSm: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: fadeUpSmTransition },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: fadeUpTransition },
};

/** Child variant for use inside a staggerContainer — same easing as fadeUp. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: fadeUpTransition },
};

/**
 * Parent variant driving staggered children. Apply to a container with
 * `initial="hidden" whileInView="visible" viewport={viewportOnce}`, and
 * `variants={staggerItem}` on each child (no initial/whileInView needed
 * on the children themselves — they inherit from the parent).
 *
 * Do NOT use this for AnimatePresence-filtered lists (e.g. the timeline,
 * publication registry) — staggerChildren doesn't reliably re-trigger
 * per-item through AnimatePresence re-filters; keep those on independent
 * index-based delays, just sourced from these same duration/easing tokens.
 */
export function staggerContainer(stagger = 0.08, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}
