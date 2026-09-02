"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

/**
 * Motion layer.
 *
 * One Lenis instance drives ScrollTrigger from the GSAP ticker. That
 * single clock is why the pinned light-tunnel scene, the scrubbed
 * layer stack and the velocity-reactive ticker stay in lockstep
 * instead of each drifting on its own rAF loop.
 *
 * Components never touch Lenis or ScrollTrigger directly — they call
 * these primitives from useGSAP() and let the scope revert them.
 *
 * Curves are the animate skill's, not invented:
 *   ease-out     cubic-bezier(0.23, 1, 0.32, 1)  → "power4.out"
 *   ease-in-out  cubic-bezier(0.77, 0, 0.175, 1)
 */

let registered = false;
let lenis: Lenis | null = null;

/** Live scroll telemetry, read by the velocity-reactive pieces. */
export const scrollState = { velocity: 0, direction: 1 as 1 | -1, progress: 0 };

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Pointer-driven effects are meaningless on touch and fire false hovers. */
export function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Register at import time, not from a component effect.
 *
 * useGSAP runs on useLayoutEffect, which fires before every useEffect
 * on the page — so registering inside <SmoothScroll/>'s effect happens
 * after the first components have already asked for a scrollTrigger,
 * and GSAP drops those with "Missing plugin?". Doing it in the module
 * body means the plugins are in place the moment anything imports this.
 */
registerGsap();

/* ------------------------------------------------------------------ *
 * Smooth scroll
 * ------------------------------------------------------------------ */

export function initLenis() {
  if (lenis || typeof window === "undefined") return null;
  registerGsap();

  if (prefersReducedMotion()) {
    // Native scrolling only — telemetry stays live so the progress
    // rail and the ticker keep tracking.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return null;
  }

  lenis = new Lenis({
    duration: 1.05,
    // Exponential tail: quick to respond, long to settle. A workshop
    // door, not a spring.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on("scroll", (e: Lenis) => {
    scrollState.velocity = e.velocity;
    // Lenis reports 0 at rest; hold the last real direction so the
    // ticker doesn't snap to neutral every time the page pauses.
    if (e.direction === 1 || e.direction === -1) scrollState.direction = e.direction;
    scrollState.progress = e.progress;
    ScrollTrigger.update();
  });

  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

/** Freeze the page while the loader owns the screen. */
export function lockScroll(locked: boolean) {
  if (typeof document === "undefined") return;
  if (locked) {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
}

export function scrollTo(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.2 });
  else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ------------------------------------------------------------------ *
 * Text
 * ------------------------------------------------------------------ */

type SplitOpts = { delay?: number; trigger?: boolean; start?: string; stagger?: number };

/** Wrap each split part in an overflow-hidden block so it rises out of a mask. */
function mask(parts: Element[]) {
  parts.forEach((part) => {
    const wrapper = document.createElement("span");
    wrapper.style.display = "block";
    wrapper.style.overflow = "hidden";
    // Descenders clip without a little breathing room.
    wrapper.style.paddingBottom = "0.14em";
    wrapper.style.marginBottom = "-0.14em";
    part.parentNode?.insertBefore(wrapper, part);
    wrapper.appendChild(part);
    (part as HTMLElement).style.display = "block";
  });
}

/** Lines sweep up out of a mask. The workhorse for section headings. */
export function splitLinesIn(el: HTMLElement, opts: SplitOpts = {}) {
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const split = new SplitText(el, { type: "lines", linesClass: "gs-line" });
  mask(split.lines);
  gsap.set(el, { autoAlpha: 1 });

  gsap.from(split.lines, {
    yPercent: 118,
    duration: 1.05,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.075,
    delay: opts.delay ?? 0,
    scrollTrigger:
      opts.trigger === false
        ? undefined
        : { trigger: el, start: opts.start ?? "top 86%", once: true },
  });

  return split;
}

/**
 * Word-level, each word tipping up out of the page plane. Reserved for
 * the hero — used twice it stops being an event and becomes a tic.
 */
export function splitWordsIn(el: HTMLElement, opts: SplitOpts = {}) {
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const split = new SplitText(el, {
    type: "lines,words",
    linesClass: "gs-line",
    wordsClass: "gs-word",
  });
  mask(split.lines);
  gsap.set(el, { autoAlpha: 1 });

  gsap.from(split.words, {
    yPercent: 120,
    rotateX: -55,
    duration: 1.2,
    ease: "power4.out",
    stagger: opts.stagger ?? 0.055,
    delay: opts.delay ?? 0,
    transformOrigin: "50% 100% -30px",
    scrollTrigger:
      opts.trigger === false
        ? undefined
        : { trigger: el, start: opts.start ?? "top 86%", once: true },
  });

  return split;
}

/* ------------------------------------------------------------------ *
 * Scroll primitives
 * ------------------------------------------------------------------ */

/** Soft entrance for supporting copy. Deliberately quieter than headings. */
export function revealOnScroll(scope: HTMLElement, selector = "[data-reveal]") {
  const targets = gsap.utils.toArray<HTMLElement>(selector, scope);
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: Number(el.dataset.revealDelay ?? 0),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      },
    );
  });
}

/** Number that counts as the section scrolls, rather than on a timer. */
export function scrubCount(
  el: HTMLElement,
  value: number,
  suffix = "",
  trigger?: Element,
  decimals = 0,
) {
  const state = { n: 0 };
  const write = () => {
    el.textContent = `${state.n.toFixed(decimals)}${suffix}`;
  };

  if (prefersReducedMotion()) {
    state.n = value;
    write();
    return;
  }

  gsap.to(state, {
    n: value,
    ease: "none",
    onUpdate: write,
    scrollTrigger: { trigger: trigger ?? el, start: "top 88%", end: "bottom 64%", scrub: 0.6 },
  });
}

/** Scroll-linked parallax. Positive `strength` trails the page. */
export function parallax(el: HTMLElement, strength = 8) {
  if (prefersReducedMotion()) return;

  gsap.fromTo(
    el,
    { yPercent: -strength },
    {
      yPercent: strength,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

/* ------------------------------------------------------------------ *
 * 3D
 *
 * Everything here assumes an ancestor carries `.scene-3d` (which owns
 * the perspective) and the moving element carries `.layer-3d`.
 * ------------------------------------------------------------------ */

/**
 * Pointer-tracked tilt. `quickTo` retargets an in-flight tween from its
 * current value rather than restarting, so a fast cursor never produces
 * a jump — the interruptibility rule, applied to hover.
 *
 * Independent springs per axis: one tween across both desyncs the
 * moment X and Y move at different rates.
 */
export function tilt3d(
  el: HTMLElement,
  opts: { max?: number; lift?: number; glare?: HTMLElement | null } = {},
) {
  // Decorative and pointer-only. It has no meaning on touch, and
  // vestibular users should not get it at all.
  if (prefersReducedMotion() || !hasFinePointer()) return () => {};

  const max = opts.max ?? 8;
  const lift = opts.lift ?? 18;

  const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
  const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
  const tz = gsap.quickTo(el, "z", { duration: 0.5, ease: "power3.out" });

  const gx = opts.glare
    ? gsap.quickTo(opts.glare, "xPercent", { duration: 0.55, ease: "power3.out" })
    : null;
  const ga = opts.glare
    ? gsap.quickTo(opts.glare, "opacity", { duration: 0.35, ease: "power2.out" })
    : null;

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    // −0.5 … 0.5, measured from the element's centre.
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    // Y-rotation follows horizontal travel; X-rotation is inverted so
    // pushing the cursor up tips the top edge away, as a real panel would.
    ry(px * max * 2);
    rx(-py * max * 2);
    // The highlight slides against the tilt — light stays put while the
    // panel moves under it.
    gx?.(px * -140);
  };

  const onEnter = () => {
    tz(lift);
    ga?.(1);
  };

  const onLeave = () => {
    rx(0);
    ry(0);
    tz(0);
    ga?.(0);
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointerleave", onLeave);

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerenter", onEnter);
    el.removeEventListener("pointerleave", onLeave);
  };
}

/**
 * Whole-scene pointer parallax: layers drift by a per-layer `data-depth`.
 * Driven from the scene element rather than the window, so the effect
 * stops at the section boundary instead of tracking the whole page.
 */
export function pointerScene(scene: HTMLElement, selector = "[data-depth]") {
  if (prefersReducedMotion() || !hasFinePointer()) return () => {};

  const layers = gsap.utils.toArray<HTMLElement>(selector, scene);
  if (!layers.length) return () => {};

  const setters = layers.map((layer) => ({
    depth: Number(layer.dataset.depth ?? 1),
    rot: Number(layer.dataset.depthRot ?? 0),
    x: gsap.quickTo(layer, "x", { duration: 1.1, ease: "power3.out" }),
    y: gsap.quickTo(layer, "y", { duration: 1.1, ease: "power3.out" }),
    ry: gsap.quickTo(layer, "rotationY", { duration: 1.1, ease: "power3.out" }),
  }));

  const onMove = (e: PointerEvent) => {
    const r = scene.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;

    setters.forEach((s) => {
      s.x(px * s.depth * -30);
      s.y(py * s.depth * -20);
      if (s.rot) s.ry(px * s.rot);
    });
  };

  const onLeave = () => {
    setters.forEach((s) => {
      s.x(0);
      s.y(0);
      if (s.rot) s.ry(0);
    });
  };

  scene.addEventListener("pointermove", onMove);
  scene.addEventListener("pointerleave", onLeave);

  return () => {
    scene.removeEventListener("pointermove", onMove);
    scene.removeEventListener("pointerleave", onLeave);
  };
}

export { gsap, ScrollTrigger, SplitText };
