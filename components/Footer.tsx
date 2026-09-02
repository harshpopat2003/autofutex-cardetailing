"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Cta, { ArrowUpRight } from "./Cta";
import { branches, footer, hours, services, shop, whatsapp } from "@/lib/content";
import { revealOnScroll, scrollTo } from "@/lib/motion";

/**
 * The footer is built like the shop's own signage rather than as a
 * sitemap: a closing call to action, then the practical block a person
 * actually scrolls down here for — which branch, when it's open, what
 * number to ring — and finally the wordmark across the full width, set
 * in the dark so it reads as embossed lettering above a door.
 *
 * The columns are deliberately unequal. Branches and hours get the
 * space because that is the information with consequences; the link
 * lists are secondary and sized accordingly.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (root.current) revealOnScroll(root.current);
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative border-t border-edge">
      {/* --- Closing call ------------------------------------------- */}
      <div className="shell border-b border-edge py-16 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div data-reveal>
            <h2 className="t-1 max-w-xl">{footer.cta}</h2>
            <p className="lede mt-4 max-w-md">{footer.ctaBody}</p>
          </div>

          <div data-reveal data-reveal-delay="0.06" className="flex shrink-0 flex-col gap-3">
            <Cta
              href={whatsapp("Hi AutoFutex, I'd like to book an inspection. My car is a ")}
              external
              className="flex"
            >
              Book on WhatsApp
            </Cta>
            <Cta variant="ghost" href={`tel:${shop.phoneRaw}`} className="flex">
              {shop.phone}
            </Cta>
          </div>
        </div>
      </div>

      {/* --- The practical block ------------------------------------ */}
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_0.8fr_0.8fr] lg:gap-8">
        {branches.map((b) => (
          <div key={b.name} data-reveal>
            <p className="mono">{b.name}</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed font-medium text-white-hot">
              {b.role}
            </p>
            <p className="body-sm mt-1.5 !text-[0.875rem]">{b.address}</p>
            <a
              href={b.map}
              target="_blank"
              rel="noopener noreferrer"
              className="mono mt-3 inline-flex items-center gap-1.5 !text-ember transition-opacity duration-200 hover:opacity-75"
            >
              Directions
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        ))}

        <div data-reveal>
          <p className="mono">Hours</p>
          <dl className="mt-3 flex flex-col gap-2.5">
            {hours.map((h) => (
              <div key={h.days}>
                <dt className="text-[0.875rem] font-medium text-white-hot">{h.days}</dt>
                <dd className="mono mt-0.5 !normal-case">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal>
          <p className="mono">Services</p>
          <ul className="mt-3 flex flex-col gap-2">
            {services.map((s) => (
              <li key={s.n}>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#services");
                  }}
                  className="text-[0.875rem] text-steel transition-colors duration-200 hover:text-white-hot"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- Signage ------------------------------------------------
          Full-bleed and clipped by the footer, so the wordmark reads as
          lettering mounted on the building rather than as a heading. */}
      <div className="relative overflow-hidden border-t border-edge pt-10">
        <p
          aria-hidden="true"
          className="font-display block px-4 text-center leading-[0.95] font-bold tracking-[-0.05em] whitespace-nowrap select-none"
          style={{ fontSize: "clamp(3.5rem, 17vw, 15rem)", color: "var(--color-panel-3)" }}
        >
          AUTO<span style={{ color: "color-mix(in oklab, var(--color-ember) 26%, transparent)" }}>FUTEX</span>
        </p>
        <p className="mono-sm mt-2 pb-8 text-center !tracking-[0.4em] !text-slate">
          Cars&rsquo; Spa · Muscat
        </p>
      </div>

      {/* --- Legal --------------------------------------------------- */}
      <div className="shell flex flex-col gap-3 border-t border-edge py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-sm">{footer.line}</p>

        <div className="flex flex-wrap items-center gap-2">
          <Social href={shop.social.instagram} label="Instagram" />
          <Social href={shop.social.facebook} label="Facebook" />
          <Social href={shop.mapUrl} label={`${shop.rating}★ Google`} />
        </div>
      </div>

      {/* This is a pitch, not a live site. Saying so on the page is
          cheaper than explaining it later. */}
      <p className="shell mono-sm pb-8 !text-slate">{footer.note}</p>
    </footer>
  );
}

function Social({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mono rounded-full border border-edge px-3 py-1.5 transition-colors duration-200 hover:border-steel hover:!text-white-hot"
    >
      {label}
    </a>
  );
}
