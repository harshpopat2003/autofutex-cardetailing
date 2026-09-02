"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { proof, shop } from "@/lib/content";
import { gsap, prefersReducedMotion, revealOnScroll, scrubCount, splitLinesIn } from "@/lib/motion";

/**
 * Proof, and a rail you can throw.
 *
 * The rail scrolls natively — that is deliberate, and it is what keeps
 * it reachable by keyboard, trackpad and screen reader. The pointer
 * drag layered on top only nudges `scrollLeft`, so nothing about the
 * default behaviour is replaced, only extended for mouse users who
 * would otherwise have no way to grab it.
 */
export default function Results() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      revealOnScroll(el);
      if (heading.current) splitLinesIn(heading.current);

      // Counters run off scroll position rather than a timer, so the
      // number is always consistent with where the page is — scroll
      // back up and it counts back down.
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]", el);
      nums.forEach((n) => {
        scrubCount(
          n,
          Number(n.dataset.count),
          n.dataset.suffix ?? "",
          n.closest("li") ?? undefined,
          Number(n.dataset.decimals ?? 0),
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="reviews" className="relative py-24 md:py-32">
      <div className="shell">
        <p className="mono" data-reveal>
          05 — {proof.eyebrow}
        </p>
        <h2 ref={heading} className="t-1 split-hidden mt-4 max-w-2xl">
          The work outlasts the invoice.
        </h2>
        <p className="lede mt-5 max-w-xl" data-reveal data-reveal-delay="0.05">
          Rated {shop.rating} on Google as a car detailing service in Muscat, and an authorised 3M
          centre since {shop.since}.
        </p>

        {/* --- Stats ------------------------------------------------- */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[14px] border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
          {proof.stats.map((s) => {
            // The rating is the one stat that must not be rounded to
            // a whole number on the way up.
            const decimals = "decimal" in s && s.decimal ? 1 : 0;
            return (
            <li key={s.label} className="bg-panel p-6">
              <p className="font-display text-5xl font-bold tracking-[-0.04em] text-white-hot tabular-nums">
                <span data-count={s.value} data-suffix={s.suffix} data-decimals={decimals}>
                  {(0).toFixed(decimals)}
                  {s.suffix}
                </span>
              </p>
              <p className="body-sm mt-2 !text-[0.875rem]">{s.label}</p>
            </li>
            );
          })}
        </ul>
      </div>

      {/* --- Draggable quote rail ---------------------------------- */}
      <QuoteRail />
    </section>
  );
}

/** Apple's deceleration curve. Projects where a flick was headed. */
function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

function QuoteRail() {
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = rail.current;
      if (!el) return;

      // Touch already has native momentum; intercepting it would make
      // the rail worse, not better. Mouse is the case with no gesture.
      let dragging = false;
      let startX = 0;
      let startScroll = 0;
      let moved = 0;
      /** Last few samples, for velocity at release. */
      let history: { x: number; t: number }[] = [];

      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        dragging = true;
        moved = 0;
        startX = e.clientX;
        startScroll = el.scrollLeft;
        history = [{ x: e.clientX, t: performance.now() }];
        el.setPointerCapture(e.pointerId);
        el.style.cursor = "grabbing";
        gsap.killTweensOf(el);
      };

      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        moved = Math.abs(dx);
        // 1:1 with the pointer, the whole way through — feedback during
        // the gesture, not only at the end of it.
        el.scrollLeft = startScroll - dx;

        history.push({ x: e.clientX, t: performance.now() });
        if (history.length > 6) history.shift();
      };

      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        el.style.cursor = "";
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

        const first = history[0];
        const last = history[history.length - 1];
        const dt = last && first ? last.t - first.t : 0;
        if (!dt) return;

        const velocity = ((last.x - first.x) / dt) * 1000; // px/s
        const max = el.scrollWidth - el.clientWidth;
        // Momentum projection: land where the flick was going, not
        // where the finger happened to let go.
        const target = gsap.utils.clamp(0, max, el.scrollLeft - project(velocity));

        if (prefersReducedMotion()) {
          el.scrollLeft = target;
          return;
        }

        // Distance-scaled duration is the practical stand-in for handing
        // the spring a real initial velocity: a long throw takes longer
        // to settle, so there is no seam at the release.
        const distance = Math.abs(target - el.scrollLeft);
        gsap.to(el, {
          scrollLeft: target,
          duration: gsap.utils.clamp(0.35, 1.3, distance / 900),
          ease: "power3.out",
        });
      };

      // A drag that travelled is not a click. Swallow the click so a
      // throw doesn't also follow whatever card was under the cursor.
      const onClick = (e: MouseEvent) => {
        if (moved > 8) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      el.addEventListener("click", onClick, true);

      return () => {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("click", onClick, true);
      };
    },
    { scope: rail },
  );

  return (
    <div className="mt-6">
      <div
        ref={rail}
        className="rail flex touch-pan-y gap-4 px-[max(1.25rem,calc((100vw-82rem)/2))] py-4"
        style={{ cursor: "grab" }}
        tabIndex={0}
        role="region"
        aria-label="What customers say — scrollable"
      >
        {proof.quotes.map((q) => (
          <figure
            key={q.car}
            className="panel flex w-[19rem] shrink-0 flex-col justify-between p-5 sm:w-[22rem]"
          >
            <blockquote className="body-sm !text-chrome">“{q.body}”</blockquote>

            <figcaption className="mt-6 flex items-center gap-3 border-t border-edge pt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.image}
                alt=""
                className="size-10 shrink-0 rounded-full object-cover"
                loading="lazy"
                draggable={false}
              />
              <span className="min-w-0">
                <span className="block text-[0.875rem] font-semibold text-white-hot">{q.name}</span>
                <span className="mono-sm block">{q.car}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="shell mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="mono !text-slate">Drag, or scroll sideways</p>
        <p className="mono !text-slate">
          Sample text — pending the real Google reviews
        </p>
      </div>
    </div>
  );
}
