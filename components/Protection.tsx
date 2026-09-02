"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Cta from "./Cta";
import { asset } from "@/lib/asset";
import { services, whatsapp } from "@/lib/content";
import { gsap, prefersReducedMotion, revealOnScroll } from "@/lib/motion";

/** Settled tilt, in degrees. Alternates side to side, layer by layer. */
const SETTLE = 10;
/** Parked position: 225% of the card's own width, tipped 45°. */
const PARK_X = 225;
const PARK_ROT = 45;

/**
 * The services scene.
 *
 * Two layers move at different rates over the same scroll. The copy
 * column is a plain stack of full-height blocks that scrolls with the
 * page; the panels sit in a `sticky` layer that holds the viewport
 * while the copy passes through it. Each service's pair of panels
 * finishes arriving at exactly the scroll offset where its copy reaches
 * the centre of the screen, so the two never drift apart.
 *
 * The panels do not leave. Each pair settles at ±10° and the next lands
 * on top at the opposite angle, so the section builds into a fanned
 * deck rather than swapping one image for another. That accumulation is
 * the effect — mid-transition you see the outgoing and incoming pairs
 * overlapping at opposing tilts.
 *
 * Geometry and timing were measured off the reference implementation
 * rather than eyeballed: parked at translateX(∓225%) rotate(∓45°),
 * settling at translateX(0) rotate(±10°) on a power2.out curve, one
 * viewport of scroll per service.
 */
export default function Protection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      revealOnScroll(el);
      el.dataset.reduce = String(prefersReducedMotion());

      const pin = el.querySelector<HTMLElement>("[data-pin]");
      if (!pin) return;

      const mm = gsap.matchMedia();

      // Below `md` the pin track is `display: none`, so a ScrollTrigger
      // measured against it would be reading a zero-height element.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-pair]", pin);
        const n = layers.length;

        layers.forEach((layer, i) => {
          const [left, right] = gsap.utils.toArray<HTMLElement>("[data-card]", layer);
          // Alternating, so consecutive pairs fan against each other
          // instead of stacking into one flat slab.
          const settle = i % 2 === 0 ? -SETTLE : SETTLE;

          // The first pair is already in place when the section pins —
          // its copy is centred at offset zero, so there is no scroll
          // to animate it over.
          if (i === 0) {
            gsap.set(left, { xPercent: 0, rotate: settle });
            gsap.set(right, { xPercent: 0, rotate: -settle });
            return;
          }

          gsap.set(left, { xPercent: -PARK_X, rotate: -PARK_ROT });
          gsap.set(right, { xPercent: PARK_X, rotate: PARK_ROT });

          // One viewport of scroll per service, ending exactly where
          // this service's copy reaches the middle of the screen.
          //
          // Expressed as a fraction of the track rather than in `vh`:
          // in a ScrollTrigger offset, `top+=X%` is a percentage of the
          // *trigger's* height, not the viewport's. The track is n
          // viewports tall, so one viewport is 100/n percent of it —
          // and that stays correct when the window is resized.
          const step = 100 / n;
          const scrollTrigger = {
            trigger: pin,
            start: `top+=${(i - 1) * step}% top`,
            end: `top+=${i * step}% top`,
            scrub: 0.5,
            invalidateOnRefresh: true,
          };

          gsap.to(left, {
            xPercent: 0,
            rotate: settle,
            ease: "power2.out",
            scrollTrigger,
          });
          gsap.to(right, {
            xPercent: 0,
            rotate: -settle,
            ease: "power2.out",
            scrollTrigger,
          });
        });
      });
    },
    { scope: root },
  );

  const n = services.length;

  return (
    <section ref={root} id="services" className="relative">
      {/* --- Section head ------------------------------------------- */}
      <header className="shell pt-24 pb-14 md:pt-32">
        <p className="mono" data-reveal>
          02 — What we do
        </p>
        <h2 className="t-1 mt-4 max-w-3xl" data-reveal data-reveal-delay="0.05">
          Everything the paint needs, in the order it needs it.
        </h2>
        <p className="lede mt-5 max-w-2xl" data-reveal data-reveal-delay="0.1">
          Correction before coating, coating before film — get the sequence wrong and you seal in
          the defects you paid to remove.
        </p>
      </header>

      {/* --- The scene (md and up, motion allowed) ------------------- */}
      <div
        data-pin
        className="pin-scene relative hidden md:block"
        style={{ height: `${n * 100}vh` }}
      >
        {/* Copy column. It scrolls with the page, and that vertical
            travel is what makes the section read as one continuous
            room rather than a slideshow. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col"
          style={{ height: `${n * 100}vh` }}
        >
          {services.map((s) => (
            <div key={s.n} className="flex h-screen w-full items-center justify-center px-6">
              <div className="w-full max-w-lg text-center">
                <ServiceCopy service={s} />
              </div>
            </div>
          ))}
        </div>

        {/* Panel layer. Sticky, so it holds while the copy passes. */}
        <div className="sticky top-0 left-0 h-screen w-full overflow-hidden" aria-hidden="true">
          {services.map((s, i) => (
            <div key={s.n} data-pair className="absolute inset-0 h-screen w-full">
              <div className="shell flex h-full flex-row items-center justify-between">
                <Panel src={asset(s.left)} tag={s.short} side="left" />
                <Panel src={asset(s.right)} tag={s.n} side="right" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Stacked fallback (small screens, reduced motion) -------- */}
      <div className="pin-list shell grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3 md:hidden">
        {services.map((s) => (
          <article key={s.n} className="panel p-5">
            <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-lg sm:aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(s.left)} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <ServiceCopy service={s} align="left" />
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceCopy({
  service,
  align = "center",
}: {
  service: (typeof services)[number];
  align?: "center" | "left";
}) {
  const centred = align === "center";

  return (
    // The copy column is pointer-transparent so the panels behind it
    // stay selectable; the one thing you can click has to opt back in.
    <div className={centred ? "pointer-events-auto" : "pointer-events-auto text-left"}>
      <span className="mono inline-flex size-8 items-center justify-center rounded-full border border-edge bg-panel !text-chrome">
        {service.n}
      </span>
      <h3 className="t-2 mt-4">{service.title}</h3>
      <p className={`lede mt-4 ${centred ? "mx-auto max-w-md" : ""}`}>{service.body}</p>

      <ul
        className={`mt-5 flex flex-wrap gap-2 ${centred ? "justify-center" : ""}`}
        aria-label={`${service.title} details`}
      >
        {service.meta.map((m) => (
          <li key={m} className="mono rounded-full border border-edge px-2.5 py-1.5 !text-steel">
            {m}
          </li>
        ))}
      </ul>

      <div className={`mt-6 flex ${centred ? "justify-center" : ""}`}>
        <Cta
          href={whatsapp(`Hi AutoFutex, I'm interested in ${service.title}. My car is a `)}
          external
        >
          {service.cta}
        </Cta>
      </div>
    </div>
  );
}

/** One flying panel. Decorative — the copy layer carries the meaning. */
function Panel({ src, tag, side }: { src: string; tag: string; side: "left" | "right" }) {
  return (
    <div data-card className="panel relative h-[70vh] w-[26%] shrink-0 p-1.5 will-change-transform">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full rounded-[10px] object-cover"
        loading="lazy"
        decoding="async"
      />
      <span
        className={`mono-sm absolute bottom-3 ${side === "left" ? "left-3" : "right-3"} !text-chrome`}
      >
        {tag}
      </span>
    </div>
  );
}
