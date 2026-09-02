"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { stack } from "@/lib/content";
import {
  gsap,
  hasFinePointer,
  prefersReducedMotion,
  revealOnScroll,
} from "@/lib/motion";

const N = stack.layers.length;
/**
 * Separation between plates when fully exploded, in px.
 *
 * The group is tipped back 56°, so a plate pushed `d` along Z rises
 * `d · sin(56°)` ≈ 0.83d up the screen. Five gaps at the desktop value
 * is ~215px of upward travel, which a 60vh column swallows easily and a
 * phone does not — hence the second, tighter value.
 */
const GAP = 52;
const GAP_SM = 32;

/**
 * The cross-section.
 *
 * A detailing shop's hardest sales problem is that nobody can see what
 * they bought. This section is the answer: the paint stack, exploded on
 * scroll, with the two layers AutoFutex actually adds marked out from
 * the four that came from the factory.
 *
 * It is a genuine 3D scene, not an illustration of one — six plates in
 * a shared perspective, separated along Z. Which means hovering a row
 * can lift its plate, and the whole thing stays legible while it moves.
 */
export default function Stack() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      revealOnScroll(el);

      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", el);
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", el);
      const track = el.querySelector<HTMLElement>("[data-track]");
      const group = el.querySelector<HTMLElement>("[data-group]");
      if (!plates.length || !track || !group) return;

      const exploded = (i: number, gap: number) => (N - 1 - i) * gap;

      const mm = gsap.matchMedia();

      // Below lg, or with motion reduced: no pin, no scrub. The diagram
      // still has to make its point, so it arrives already exploded
      // rather than not at all.
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        plates.forEach((p, i) => gsap.set(p, { z: exploded(i, GAP_SM) }));
        gsap.set(rows, { autoAlpha: 1 });
        gsap.set(group, { rotationX: 56, rotation: -38 });
      });

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Stacked flush: this is what a panel looks like from outside.
          plates.forEach((p, i) => gsap.set(p, { z: (N - 1 - i) * 0.001 }));
          gsap.set(rows, { autoAlpha: 0.25 });

          // Hand the whole transform to GSAP. The inline rotateX/rotateZ
          // exists only so the first paint is already isometric; leaving
          // GSAP to animate one axis of a transform it doesn't own is how
          // you lose the other axis on the first tick. Note `rotation`,
          // not `rotateZ` — the latter is not a GSAP alias.
          gsap.set(group, { rotationX: 56, rotation: -46 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: track,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          // The stack breaks apart from the outside in — the way it would
          // come off the car.
          plates.forEach((plate, i) => {
            tl.to(
              plate,
              { z: exploded(i, GAP), duration: 0.5, ease: "power2.out" },
              i * 0.28,
            );
            if (rows[i]) {
              tl.to(
                rows[i],
                { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
                i * 0.28 + 0.1,
              );
            }
          });

          // A slow quarter-turn across the section, so the plates reveal
          // their thickness rather than staying a flat diagram.
          tl.to(
            group,
            { rotation: -28, duration: tl.duration(), ease: "none" },
            0,
          );
        },
      );
    },
    { scope: root },
  );

  /** Hover lift. Pointer-only — there is no hover to speak of on touch. */
  const lift = (i: number | null) => {
    if (!hasFinePointer() || prefersReducedMotion()) return;
    setActive(i);
    const el = root.current;
    if (!el) return;
    const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", el);
    plates.forEach((p, idx) => {
      gsap.to(p, {
        // Only the hovered plate moves, and only a little: this is a
        // pointer hint, not a second animation competing with the scrub.
        x: i === idx ? 26 : 0,
        y: i === idx ? -26 : 0,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  return (
    <section ref={root} id="stack" className="relative">
      <div data-track className="stack-track relative lg:h-[300vh]">
        <div className="stack-sticky flex items-center overflow-hidden py-20 md:py-24 lg:sticky lg:top-0 lg:min-h-screen">

          <div className="shell grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
            {/* --- The scene --------------------------------------- */}
            <div
              className="scene-3d order-2 flex h-[22rem] items-end justify-center pb-4 sm:h-[26rem] lg:order-1 lg:h-[60vh] lg:items-center lg:pb-0"
              aria-hidden="true"
            >
              <div
                data-group
                className="layer-3d relative aspect-[7/5] w-full max-w-[15rem] sm:max-w-[19rem] lg:max-w-[26rem]"
                style={{ transform: "rotateX(56deg) rotateZ(-46deg)" }}
              >
                {stack.layers.map((layer, i) => (
                  <div
                    key={layer.name}
                    data-plate
                    className="layer-3d absolute inset-0 rounded-lg border"
                    style={{
                      // Applied layers take the accent; factory layers are inert
                      // material. The distinction is the whole point of
                      // the diagram, so it is carried by colour, not
                      // by a label alone.
                      borderColor: layer.applied
                        ? "color-mix(in oklab, var(--color-ember) 55%, transparent)"
                        : "var(--color-edge-lit)",
                      background: layer.applied
                        ? "linear-gradient(135deg, color-mix(in oklab, var(--color-ember) 20%, transparent), color-mix(in oklab, var(--color-ember) 5%, transparent))"
                        : `linear-gradient(135deg, var(--color-panel-3), var(--color-panel))`,
                      // A cast shadow, not a bloom — the plates are
                      // lit objects in a dark room, not light sources.
                      boxShadow: "0 18px 40px -20px rgba(0,0,0,0.95)",
                    }}
                  >
                    {/* The light bar, again — here it reads as the
                        specular line along a wet-looking plate. */}
                    <div
                      className="streak absolute inset-x-6"
                      style={{
                        top: "22%",
                        height: 2,
                        opacity: layer.applied ? 0.6 : 0.25,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* --- The legend --------------------------------------- */}
            <div className="order-1 lg:order-2">
              <p className="mono" data-reveal>
                03 — {stack.eyebrow}
              </p>
              <h2 className="t-2 mt-4" data-reveal data-reveal-delay="0.05">
                {stack.title}
              </h2>
              <p
                className="lede mt-5 max-w-lg"
                data-reveal
                data-reveal-delay="0.1"
              >
                {stack.body}
              </p>

              <ol className="mt-8 flex flex-col">
                {stack.layers.map((layer, i) => (
                  <li
                    key={layer.name}
                    data-row
                    onPointerEnter={() => lift(i)}
                    onPointerLeave={() => lift(null)}
                    className="flex items-baseline gap-4 border-t border-edge py-3.5 transition-colors duration-200"
                    style={{
                      backgroundColor:
                        active === i
                          ? "color-mix(in oklab, var(--color-panel-2) 60%, transparent)"
                          : "transparent",
                    }}
                  >
                    <span
                      className="mono-unit w-14 shrink-0"
                      style={{
                        color: layer.applied ? "var(--color-ember)" : undefined,
                      }}
                    >
                      {layer.depth}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.9375rem] font-semibold text-white-hot">
                          {layer.name}
                        </span>
                        {layer.applied && (
                          <span className="mono-sm rounded-full border border-ember/40 px-2 py-0.5 !text-ember">
                            We apply this
                          </span>
                        )}
                      </span>
                      <span className="body-sm mt-1 block !text-[0.875rem]">
                        {layer.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
