"use client";

import dynamic from "next/dynamic";
import { useWebGLCapability } from "./useWebGLCapability";

const HelixScene = dynamic(() => import("./HelixScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Purely decorative accent — no CSS fallback needed since 'none' tier
 * simply means the page looks exactly like it did before this existed.
 */
export function HelixAccent() {
  const tier = useWebGLCapability();

  if (tier === "none") return null;

  return (
    <div className="absolute inset-y-0 right-0 w-40 hidden lg:block pointer-events-none opacity-80">
      <HelixScene tier={tier} />
    </div>
  );
}
