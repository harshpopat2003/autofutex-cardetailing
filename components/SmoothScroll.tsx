"use client";

import { useEffect } from "react";
import { destroyLenis, initLenis, ScrollTrigger } from "@/lib/motion";

/**
 * Owns the single Lenis instance for the page. Mounted once, at the top
 * of the tree, so every section's ScrollTrigger reads the same clock.
 *
 * Renders nothing — it is a lifecycle, not a layer.
 */
export default function SmoothScroll() {
  useEffect(() => {
    initLenis();

    // Fonts land after hydration and reflow every pinned section's
    // measurements. Without this the first scrub is off by a hundred
    // pixels or so on a cold load.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      destroyLenis();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
