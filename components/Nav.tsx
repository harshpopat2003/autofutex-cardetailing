"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Logo from "./Logo";
import Cta from "./Cta";
import { nav, shop, whatsapp } from "@/lib/content";
import { gsap, scrollState, scrollTo, prefersReducedMotion } from "@/lib/motion";

/**
 * Floating chrome. Translucent, with the page scrolling underneath —
 * not an opaque strip that eats a fixed band of the viewport.
 *
 * It hides on scroll-down and returns on scroll-up. That is a frequent
 * interaction, so the motion is near-imperceptible by design: 220ms,
 * transform only, and it never animates on the way to a section the
 * user just clicked.
 */
export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const bar = root.current;
      const surface = barRef.current;
      if (!bar || !surface) return;

      // Solidify once the hero video is no longer behind the bar. The
      // variable lives on the element that reads it — driving it from
      // the parent would recalculate styles for the whole subtree.
      const setBg = gsap.quickTo(surface, "--nav-solid", { duration: 0.3, ease: "power2.out" });

      let hidden = false;
      const show = gsap.quickTo(bar, "yPercent", { duration: 0.22, ease: "power3.out" });

      const onScroll = () => {
        const y = window.scrollY;
        setBg(y > 40 ? 1 : 0);

        // Never retract while a menu is open — the user is aiming at it.
        if (open) return;

        const down = scrollState.direction === 1 && y > 220;
        if (down !== hidden) {
          hidden = down;
          show(hidden ? -130 : 0);
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: root, dependencies: [open] },
  );

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header
        ref={root}
        className="fixed inset-x-0 top-0 z-50 will-change-transform"
      >
        <div className="shell">
          <div
            ref={barRef}
            className="mt-3 flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 md:px-4"
            style={{
              "--nav-solid": 0,
              // Driven off the quickTo variable so the bar materialises
              // rather than snapping between two states.
              background:
                "color-mix(in oklab, var(--color-lacquer) calc(var(--nav-solid) * 78%), transparent)",
              backdropFilter: "blur(calc(var(--nav-solid) * 20px)) saturate(160%)",
              WebkitBackdropFilter: "blur(calc(var(--nav-solid) * 20px)) saturate(160%)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor:
                "color-mix(in oklab, var(--color-edge-lit) calc(var(--nav-solid) * 80%), transparent)",
              // Custom properties aren't in React's CSSProperties map.
            } as React.CSSProperties}
          >
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                go("#top");
              }}
              aria-label="AutoFutex — back to top"
            >
              <Logo />
            </a>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.href);
                  }}
                  className="rounded-lg px-3 py-2 text-[0.8125rem] font-medium text-steel transition-colors duration-200 hover:text-white-hot"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Cta
                href={whatsapp("Hi AutoFutex, I'd like to book an inspection for my car.")}
                external
                className="hidden sm:inline-flex"
              >
                WhatsApp
              </Cta>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="icon-btn md:hidden"
              >
                <Burger open={open} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onNavigate={go} />
    </>
  );
}

/**
 * Full-screen sheet. It enters from the top edge because that is where
 * the button that opened it lives — enter and exit share one path, so
 * the sheet reads as coming out of the trigger rather than appearing.
 */
function MobileMenu({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: (href: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const items = el.querySelectorAll("[data-menu-item]");
      const reduce = prefersReducedMotion();

      if (open) {
        gsap.set(el, { pointerEvents: "auto" });
        gsap
          .timeline()
          .to(el, { autoAlpha: 1, duration: reduce ? 0.15 : 0.3, ease: "power2.out" })
          .fromTo(
            items,
            { autoAlpha: 0, y: reduce ? 0 : 22 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.045 },
            reduce ? 0 : 0.06,
          );
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.out",
          onComplete: () => gsap.set(el, { pointerEvents: "none" }),
        });
      }
    },
    { dependencies: [open] },
  );

  return (
    <div
      ref={root}
      id="mobile-menu"
      className="glass fixed inset-0 z-40 flex flex-col justify-center px-8 opacity-0 md:hidden"
      style={{ pointerEvents: "none" }}
      aria-hidden={!open}
    >
      <nav className="flex flex-col gap-1" aria-label="Sections">
        {nav.map((item, i) => (
          <a
            key={item.href}
            data-menu-item
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(item.href);
            }}
            className="flex items-baseline gap-4 border-b border-edge py-4"
          >
            <span className="mono-sm">{String(i + 1).padStart(2, "0")}</span>
            <span className="t-3 text-white-hot">{item.label}</span>
          </a>
        ))}
      </nav>

      <a
        data-menu-item
        href={`tel:${shop.phoneRaw}`}
        className="mono mt-8 !text-steel"
      >
        {shop.phone}
      </a>
    </div>
  );
}

function Burger({ open }: { open: boolean }) {
  // Two bars that rotate into a cross. Transform-only, so it stays on
  // the compositor and can be interrupted mid-flip.
  return (
    <span className="relative block h-3.5 w-4" aria-hidden="true">
      <span
        className="absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-[220ms]"
        style={{
          top: open ? "6.25px" : "2px",
          transform: open ? "rotate(45deg)" : "none",
          transitionTimingFunction: "var(--ease-out)",
        }}
      />
      <span
        className="absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-[220ms]"
        style={{
          top: open ? "6.25px" : "10px",
          transform: open ? "rotate(-45deg)" : "none",
          transitionTimingFunction: "var(--ease-out)",
        }}
      />
    </span>
  );
}

