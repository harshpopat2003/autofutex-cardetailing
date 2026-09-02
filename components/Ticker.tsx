"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ticker } from "@/lib/content";
import { gsap, prefersReducedMotion, scrollState } from "@/lib/motion";

/**
 * The band between the hero and the work. It runs at a constant base
 * speed — linear, because constant motion with an eased curve reads as
 * broken — and the page's scroll velocity adds to it, so flicking down
 * the page throws the strip along with you.
 *
 * Under reduced motion it stops moving entirely and becomes a static
 * list, which is all it ever was semantically.
 */
export default function Ticker() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;

      // Two copies, so translating by exactly -50% loops seamlessly.
      const tween = gsap.to(el, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      // Velocity is added as a timeScale nudge rather than a position
      // offset — the strip speeds up and slows down, it never jumps.
      const nudge = () => {
        const boost = gsap.utils.clamp(-4, 4, scrollState.velocity * 0.22);
        gsap.to(tween, {
          timeScale: 1 + Math.abs(boost),
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      };

      // Once the page stops, ease the strip back to its base speed
      // rather than dropping it — a hard cut to 1x reads as a stall.
      let settleTimer = 0;
      const settle = () => {
        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          gsap.to(tween, { timeScale: 1, duration: 0.8, ease: "power2.out", overwrite: true });
        }, 180);
      };

      const onScroll = () => {
        nudge();
        settle();
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.clearTimeout(settleTimer);
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: root },
  );

  const items = [...ticker, ...ticker];

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-edge bg-panel py-4"
      aria-label="What AutoFutex does"
    >
      <div ref={track} className="flex w-max items-center gap-10 pl-10 will-change-transform">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10" aria-hidden={i >= ticker.length}>
            <span className="mono !text-[0.75rem] !text-chrome whitespace-nowrap">{item}</span>
            <Diamond />
          </span>
        ))}
      </div>

      {/* Edge fades, so words dissolve into the room instead of being
          guillotined by the container. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24"
        style={{ background: "linear-gradient(90deg, var(--color-panel), transparent)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24"
        style={{ background: "linear-gradient(270deg, var(--color-panel), transparent)" }}
        aria-hidden="true"
      />
    </div>
  );
}

function Diamond() {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden="true" className="shrink-0">
      <path d="M3 0l3 3-3 3-3-3z" fill="var(--color-ember)" />
    </svg>
  );
}
