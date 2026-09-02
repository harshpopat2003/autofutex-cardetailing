"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { faq } from "@/lib/content";
import { revealOnScroll, splitLinesIn } from "@/lib/motion";

/**
 * Accordion.
 *
 * The open/close uses `grid-template-rows: 0fr → 1fr`, which animates a
 * height the browser measures for us — no JS measurement, no hardcoded
 * max-height that clips a long answer. It is the one place `transform`
 * has no equivalent, which is exactly when animating a layout property
 * is allowed.
 *
 * A transition, not keyframes: these get toggled quickly and a
 * transition retargets from wherever the panel currently is.
 */
export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      revealOnScroll(el);
      if (heading.current) splitLinesIn(heading.current);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative py-24 md:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="mono" data-reveal>
            07 — Questions
          </p>
          <h2 ref={heading} className="t-2 split-hidden mt-4">
            The things people ask before they book.
          </h2>
        </div>

        <div className="border-t border-edge">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-edge">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className="text-[1.0625rem] font-semibold transition-colors duration-200"
                      style={{ color: isOpen ? "var(--color-ember)" : "var(--color-white-hot)" }}
                    >
                      {item.q}
                    </span>
                    <Chevron open={isOpen} />
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="grid transition-[grid-template-rows] duration-[280ms]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transitionTimingFunction: "var(--ease-out)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p
                      className="body-sm max-w-2xl pb-6 transition-opacity duration-200"
                      style={{ opacity: isOpen ? 1 : 0 }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className="mt-0.5 grid size-6 shrink-0 place-items-center transition-transform duration-[280ms]"
      style={{
        transform: open ? "rotate(45deg)" : "none",
        transitionTimingFunction: "var(--ease-out)",
      }}
      aria-hidden="true"
    >
      {/* A plus that turns into a cross — the state change is legible
          at a glance, and it is transform-only. */}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M7 1v12M1 7h12" />
      </svg>
    </span>
  );
}
