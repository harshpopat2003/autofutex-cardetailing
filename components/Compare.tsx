"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { alsoDo, compare } from "@/lib/content";
import { gsap, prefersReducedMotion, revealOnScroll, splitLinesIn } from "@/lib/motion";

/**
 * The argument for paying more.
 *
 * Two columns, and the layout does the persuading before the copy does:
 * the unbranded column is flat, grey and borderless; the authorised one
 * is a lifted panel catching light along its top edge. Same information,
 * two materials — which is the point being made.
 */
export default function Compare() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      revealOnScroll(el);
      if (heading.current) splitLinesIn(heading.current);

      if (prefersReducedMotion()) return;

      // The good column's ticks land one after another, so the list
      // reads as an argument being made rather than a block appearing.
      gsap.fromTo(
        "[data-tick]",
        { autoAlpha: 0, x: -10 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-good]", start: "top 78%", once: true },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-24 md:py-32">
      <div className="shell">
        <p className="mono" data-reveal>
          04 — {compare.eyebrow}
        </p>
        <h2 ref={heading} className="t-1 split-hidden mt-4 max-w-2xl">
          {compare.title}
        </h2>
        <p className="lede mt-5 max-w-xl" data-reveal data-reveal-delay="0.05">
          {compare.body}
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
          {/* --- The cheap way ---------------------------------------- */}
          <div
            className="rounded-[14px] border border-edge/70 p-6 md:p-8"
            style={{ background: "color-mix(in oklab, var(--color-panel) 55%, transparent)" }}
            data-reveal
          >
            <p className="mono-sm !text-slate">{compare.bad.label}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {compare.bad.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Cross />
                  <span className="body-sm !text-slate">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* --- The authorised way ----------------------------------- */}
          <div data-good className="panel p-6 md:p-8" data-reveal data-reveal-delay="0.08">
            <p className="mono-sm !text-ember">{compare.good.label}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {compare.good.points.map((p) => (
                <li key={p} data-tick className="flex items-start gap-3">
                  <Tick />
                  <span className="body-sm !text-chrome">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- Everything else -------------------------------------- */}
        <div className="mt-20">
          <h3 className="t-3" data-reveal>
            Also in the bay
          </h3>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-[14px] border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {alsoDo.map((item) => (
              <li key={item.title} className="bg-panel p-5 md:p-6" data-reveal>
                <p className="text-[0.9375rem] font-semibold text-white-hot">{item.title}</p>
                <p className="body-sm mt-1.5 !text-[0.875rem]">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Tick() {
  return (
    <span
      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
      style={{ background: "color-mix(in oklab, var(--color-ember) 18%, transparent)" }}
      aria-hidden="true"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--color-ember)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6.5 4.8 9.2 10 3.4" />
      </svg>
    </span>
  );
}

function Cross() {
  return (
    <span
      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-edge"
      aria-hidden="true"
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="var(--color-slate)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5" />
      </svg>
    </span>
  );
}
