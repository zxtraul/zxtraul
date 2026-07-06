"use client";

import dynamic from "next/dynamic";
import { useWebGLCapability } from "./useWebGLCapability";
import { HeroPhotoCardCSS } from "./HeroPhotoCardCSS";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <HeroPhotoCardCSS />,
});

/**
 * Hero visual slot: renders the original CSS tilt card unconditionally on
 * first paint (SSR-safe, zero layout shift), then swaps to the WebGL
 * hologram-globe scene once the client-side capability check resolves to
 * 'low'/'high'. Stays on the CSS card for 'none' (no WebGL, reduced-motion).
 */
export function HeroVisual() {
  const tier = useWebGLCapability();

  if (tier === "none") {
    return <HeroPhotoCardCSS />;
  }

  return (
    <div className="relative aspect-[4/3] max-w-xl mx-auto">
      <HeroScene tier={tier} />
    </div>
  );
}
