"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Cta from "./Cta";
import { branches, hours, shop } from "@/lib/content";
import { parallax, revealOnScroll, splitLinesIn, tilt3d } from "@/lib/motion";

/**
 * Where to actually go.
 *
 * Two branches doing different work is the single most useful thing a
 * visitor can learn here, so the split is the layout rather than a line
 * of small print — each branch gets its own panel, its own photo and
 * its own map link.
 */
export default function Branches() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      revealOnScroll(el);
      if (heading.current) splitLinesIn(heading.current);

      el.querySelectorAll<HTMLElement>("[data-branch-card]").forEach((card) => {
        tilt3d(card, { max: 4, lift: 12 });
      });

      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => parallax(img, 6));
    },
    { scope: root },
  );

  return (
    <section ref={root} id="branches" className="relative py-24 md:py-32">
      <div className="shell">
        <p className="mono" data-reveal>
          06 — Where we are
        </p>
        <h2 ref={heading} className="t-1 split-hidden mt-4 max-w-2xl">
          Two branches. Send the car to the right one.
        </h2>

        <div className="scene-3d mt-12 grid gap-5 lg:grid-cols-2">
          {branches.map((b) => (
            <article key={b.name} data-branch-card className="panel layer-3d" data-reveal>
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-parallax
                  src={b.image}
                  alt=""
                  className="h-[112%] w-full object-cover"
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--color-panel) 4%, transparent 70%)",
                  }}
                />
                <span className="mono absolute top-4 left-4 rounded-full border border-edge-lit bg-lacquer/70 px-2.5 py-1.5 !text-chrome backdrop-blur-sm">
                  {b.role}
                </span>
              </div>

              <div className="p-6">
                <h3 className="t-2">{b.name}</h3>
                <p className="mono mt-2">{b.address}</p>
                <p className="body-sm mt-4">{b.note}</p>

                <Cta variant="ghost" href={b.map} external className="mt-6">
                  Open in Maps
                </Cta>
              </div>
            </article>
          ))}
        </div>

        {/* --- Hours and phones ------------------------------------- */}
        <div className="mt-5 grid gap-px overflow-hidden rounded-[14px] border border-edge bg-edge md:grid-cols-2">
          <div className="bg-panel p-6" data-reveal>
            <p className="mono">Opening hours</p>
            <dl className="mt-4 flex flex-col gap-3">
              {hours.map((h) => (
                <div key={h.days} className="flex flex-wrap items-baseline justify-between gap-2">
                  <dt className="text-[0.9375rem] font-medium text-white-hot">{h.days}</dt>
                  <dd className="mono !text-steel">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-panel p-6" data-reveal data-reveal-delay="0.06">
            <p className="mono">Talk to the workshop</p>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`tel:${shop.phoneRaw}`}
                className="flex items-baseline justify-between gap-2 text-[0.9375rem] font-medium text-white-hot transition-colors duration-200 hover:text-ember"
              >
                {shop.phone}
                <span className="mono !text-steel">Ghala</span>
              </a>
              <a
                href={`tel:${shop.phoneAltRaw}`}
                className="flex items-baseline justify-between gap-2 text-[0.9375rem] font-medium text-white-hot transition-colors duration-200 hover:text-ember"
              >
                {shop.phoneAlt}
                <span className="mono !text-steel">Qurm</span>
              </a>
              <a
                href={shop.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-2 text-[0.9375rem] font-medium text-white-hot transition-colors duration-200 hover:text-ember"
              >
                @autofutex_oman
                <span className="mono !text-steel">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
