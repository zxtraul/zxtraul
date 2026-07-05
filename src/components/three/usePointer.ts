"use client";

import { useEffect } from "react";

export interface PointerState {
  /** Normalized [-1, 1] range, origin center, matches Three.js NDC convention (y up). */
  x: number;
  y: number;
  /** Raw client coordinates, for CSS-side consumers (e.g. gradient positioning). */
  clientX: number;
  clientY: number;
}

type Listener = (state: PointerState) => void;

let current: PointerState = { x: 0, y: 0, clientX: 0, clientY: 0 };
const listeners = new Set<Listener>();
let attached = false;

function handleMove(e: PointerEvent) {
  current = {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -((e.clientY / window.innerHeight) * 2 - 1),
    clientX: e.clientX,
    clientY: e.clientY,
  };
  listeners.forEach((l) => l(current));
}

function ensureAttached() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  current = {
    x: 0,
    y: 0,
    clientX: window.innerWidth / 2,
    clientY: window.innerHeight / 2,
  };
  window.addEventListener("pointermove", handleMove, { passive: true });
}

/**
 * Single shared pointer-position source so CSS effects (spotlight/grid)
 * and WebGL scenes stay perfectly in sync off one listener, instead of
 * each component running its own independent mousemove handler.
 *
 * Deliberately does not return a value: consumers pass a callback that
 * writes into their own ref (read later inside useFrame/effects), since
 * returning ref.current here would mean reading a ref during render.
 */
export function usePointer(onMove: Listener): void {
  useEffect(() => {
    ensureAttached();
    listeners.add(onMove);
    return () => {
      listeners.delete(onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Non-reactive accessor for use inside useFrame loops (avoids re-renders). */
export function getPointer(): PointerState {
  return current;
}
