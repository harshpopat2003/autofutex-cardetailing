"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Cta from "./Cta";
import { asset } from "@/lib/asset";
import { hero, shop, whatsapp } from "@/lib/content";
import { gsap, prefersReducedMotion, scrollTo, splitWordsIn } from "@/lib/motion";

/**
 * Centred hero, matching the reference layout: badge, headline, lede,
 * two calls to action, then one wide clip carrying a floating stat.
 *
 * The clip is AutoFutex's own reel, which is shot 9:16. Cropped into a
 * 16:9 frame that loses most of the height, so `object-position` is
 * pulled up to 42% — that keeps the car and the technician in frame and
 * crops out the burned-in caption band across the lower third.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!root.current) return;
      const reduce = prefersReducedMotion();

      // The one place words tip up out of the page. Used twice on a
      // site it becomes a tic; used once it's an event.
      if (headline.current) splitWordsIn(headline.current, { trigger: false, delay: 0.15 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-hero-badge]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.05)
        .fromTo(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
          0.45,
        )
        .fromTo(
          "[data-hero-frame]",
          // A shutter opening on the bay, not a fade.
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.03 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: reduce ? 0.4 : 1.25 },
          0.55,
        )
        .fromTo("[data-hero-chip]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.1)
        .fromTo(
          "[data-hero-spec]",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 },
          1.2,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-16 md:pt-36"
    >
      {/* The tunnel's lamps, just out of frame above the fold. Behind
          everything and inert to the pointer. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="top-light" />
        <div className="top-beam" style={{ transform: "translateX(-50%) rotate(-17deg)" }} />
        <div className="top-beam" style={{ transform: "translateX(-50%) rotate(15deg)" }} />
        <div className="grid-lines" />
        <div className="noise" />
      </div>

      <div className="shell flex flex-col items-center gap-10">
        {/* --- Type ------------------------------------------------- */}
        <div className="flex flex-col items-center text-center">
          <span
            data-hero-badge
            className="panel inline-flex items-center gap-2.5 !rounded-full px-3.5 py-2 text-[0.8125rem] font-medium text-chrome opacity-0"
          >
            <Pulse />
            {hero.badge}
          </span>

          <h1 ref={headline} className="t-hero split-hidden mt-6 max-w-5xl text-white-hot">
            Paint is temporary.{" "}
            <span className="text-ember">Protection is not.</span>
          </h1>

          <p data-hero-fade className="lede mt-7 max-w-2xl opacity-0">
            {hero.lede}
          </p>

          <div data-hero-fade className="mt-8 flex flex-wrap justify-center gap-3 opacity-0">
            <Cta
              href={whatsapp("Hi AutoFutex, I'd like to book an inspection. My car is a ")}
              external
            >
              {hero.primary}
            </Cta>
            <Cta
              variant="ghost"
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#services");
              }}
            >
              {hero.secondary}
            </Cta>
          </div>
        </div>

        {/* --- The bay ---------------------------------------------- */}
        <div
          data-hero-frame
          className="panel relative w-full p-2 xl:p-3"
          style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
          <BayVideo />

          <div
            data-hero-chip
            className="glass absolute top-3 right-3 z-10 flex max-w-[10.5rem] flex-col gap-1 rounded-xl p-3 opacity-0 sm:top-5 sm:right-5 sm:max-w-[15rem] sm:gap-1.5 sm:p-4 xl:top-7 xl:right-7"
          >
            <Star />
            <p className="text-sm leading-snug font-semibold text-white-hot sm:text-base">
              {hero.badgeCard.value}
            </p>
            <p className="mono-sm !tracking-[0.08em] !text-steel sm:!text-[0.6875rem] sm:!tracking-[0.16em]">
              {hero.badgeCard.label}
            </p>
          </div>
        </div>

        {/* --- Spec rail -------------------------------------------- */}
        <ul className="grid w-full grid-cols-2 gap-4 border-t border-edge pt-6 md:grid-cols-4">
          {[
            ["Genuine 3M film", "Product"],
            ["Certified installers", "Fitting"],
            ["Ghala & Qurm", "Branches"],
            [shop.phone, "Workshop"],
          ].map(([value, label]) => (
            <li key={label} data-hero-spec className="opacity-0">
              <p className="text-[0.9375rem] font-semibold text-white-hot">{value}</p>
              <p className="mono mt-1">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Decorative background video, so it is muted, inline and looping — but
 * anything that moves for more than five seconds needs a way to stop
 * it, and reduced-motion users should never have it start.
 */
function BayVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useGSAP(() => {
    const v = ref.current;
    if (!v) return;
    if (prefersReducedMotion()) {
      v.pause();
      setPlaying(false);
    }
  });

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[10px] md:aspect-video">
        <video
          ref={ref}
          src={asset("/assets/reel-workshop.mp4")}
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 34%" }}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="A car being prepared in the AutoFutex workshop"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in oklab, var(--color-lacquer) 70%, transparent) 0%, transparent 45%)",
          }}
          aria-hidden="true"
        />
      </div>

      <button
        type="button"
        onClick={toggle}
        className="glass absolute bottom-5 left-5 z-10 grid size-9 place-items-center rounded-full text-white-hot transition-opacity duration-200 hover:opacity-80"
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <rect x="1" y="0.5" width="2.5" height="9" rx="0.6" />
            <rect x="6.5" y="0.5" width="2.5" height="9" rx="0.6" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M1.5 0.8 9 5l-7.5 4.2V0.8Z" />
          </svg>
        )}
      </button>
    </>
  );
}

function Star() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-ember)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35 6.19 20.4l1.11-6.47L2.6 9.35l6.5-.95z" />
    </svg>
  );
}

/**
 * The booking light. The ping is the only looping animation on the page,
 * and it earns it by reporting a live state — the shop is taking work.
 * The halo is a shadow on the dot itself rather than a third element,
 * so there is nothing extra to keep in sync.
 */
function Pulse() {
  return (
    <span className="relative flex size-1.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
      <span
        className="relative inline-flex size-1.5 rounded-full bg-ember"
        style={{ boxShadow: "0 0 8px 1px color-mix(in oklab, var(--color-ember) 70%, transparent)" }}
      />
    </span>
  );
}
