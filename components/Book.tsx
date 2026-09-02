"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Cta from "./Cta";
import { book, shop, whatsapp } from "@/lib/content";
import { prefersReducedMotion, revealOnScroll, splitLinesIn } from "@/lib/motion";

/**
 * The booking step.
 *
 * There is no backend and there should not be one: a Muscat workshop
 * runs on WhatsApp, and a form that emails into a void is worse than no
 * form. So this composes the message and hands it over — the customer
 * still sees, and can still edit, exactly what they are about to send.
 *
 * Validation is inline and on blur, never on submit, so nobody
 * discovers a problem only after pressing the button.
 */
export default function Book() {
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const [name, setName] = useState("");
  const [car, setCar] = useState("");
  const [service, setService] = useState<string>(book.services[0]);
  const [branch, setBranch] = useState<string>(book.branches[0]);
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = {
    name: name.trim().length < 2 ? "Tell us who to ask for." : "",
    car: car.trim().length < 2 ? "Make and model, so we can quote it." : "",
  };
  const valid = !errors.name && !errors.car;

  const bay = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      revealOnScroll(el);
      if (heading.current) splitLinesIn(heading.current);

      // Gating the `autoPlay` attribute on a media query would render
      // differently on the server than on the client. Pause after mount
      // instead — same outcome, no hydration mismatch.
      if (prefersReducedMotion()) bay.current?.pause();
    },
    { scope: root },
  );

  const message = [
    `Hi AutoFutex — I'd like to book.`,
    ``,
    `Name: ${name.trim() || "—"}`,
    `Car: ${car.trim() || "—"}`,
    `Service: ${service}`,
    `Branch: ${branch}`,
    notes.trim() ? `Notes: ${notes.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, car: true });
    if (!valid) return;
    window.open(whatsapp(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section ref={root} id="book" className="relative py-24 md:py-32">
      <div className="shell">
        <div className="panel grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
          {/* --- The bay --------------------------------------------- */}
          <div className="relative min-h-[16rem] p-8 md:p-10">
            <video
              ref={bay}
              src="/assets/reel-ppf.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "50% 26%" }}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in oklab, var(--color-lacquer) 62%, transparent), color-mix(in oklab, var(--color-lacquer) 94%, transparent))",
              }}
              aria-hidden="true"
            />

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <p className="mono" data-reveal>
                  08 — {book.eyebrow}
                </p>
                <h2 ref={heading} className="t-2 split-hidden mt-4 max-w-sm">
                  {book.title}
                </h2>
                <p className="lede mt-5 max-w-sm !text-[1rem]" data-reveal data-reveal-delay="0.06">
                  {book.body}
                </p>
              </div>

              <div data-reveal data-reveal-delay="0.1">
                <p className="mono">Or just call the workshop</p>
                <a
                  href={`tel:${shop.phoneRaw}`}
                  className="font-display mt-1 block text-2xl font-bold tracking-[-0.03em] text-white-hot transition-colors duration-200 hover:text-ember"
                >
                  {shop.phone}
                </a>
              </div>
            </div>
          </div>

          {/* --- The form -------------------------------------------- */}
          <form
            onSubmit={submit}
            noValidate
            className="border-t border-edge bg-lacquer/40 p-8 md:p-10 lg:border-t-0 lg:border-l"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Your name"
                value={name}
                onChange={setName}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                error={touched.name ? errors.name : ""}
                autoComplete="name"
                placeholder="Khalid"
              />
              <Field
                label="Car"
                value={car}
                onChange={setCar}
                onBlur={() => setTouched((t) => ({ ...t, car: true }))}
                error={touched.car ? errors.car : ""}
                placeholder="Land Cruiser 2023"
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Select label="Service" value={service} onChange={setService} options={book.services} />
              <Select label="Branch" value={branch} onChange={setBranch} options={book.branches} />
            </div>

            <label className="mt-5 block">
              <span className="mono">Anything else</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Front-end only, or full body? Any existing damage?"
                className="mt-2 w-full resize-none rounded-lg border border-edge bg-panel px-3.5 py-3 text-[0.9375rem] text-white-hot placeholder:text-slate focus:border-edge-lit focus:outline-none"
              />
            </label>

            {/* The message is shown before it is sent. Nobody should
                have to guess what a button is about to say on their
                behalf. */}
            <details className="mt-5 rounded-lg border border-edge bg-panel/60">
              <summary className="mono cursor-pointer px-3.5 py-3 select-none">
                Preview the message
              </summary>
              <pre className="body-sm overflow-x-auto px-3.5 pb-3.5 font-mono text-[0.75rem] whitespace-pre-wrap">
                {message}
              </pre>
            </details>

            <Cta type="submit" className="mt-6 flex w-full">
              {book.submit}
            </Cta>

            <p className="mono-sm mt-4 text-center">
              Opens WhatsApp · no deposit · reply the same day
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = `f-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label htmlFor={id} className="block">
      <span className="mono">{label}</span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className="mt-2 w-full rounded-lg border bg-panel px-3.5 py-3 text-[0.9375rem] text-white-hot placeholder:text-slate focus:outline-none"
        style={{
          borderColor: error ? "var(--color-ember)" : "var(--color-edge)",
          transition: "border-color 200ms ease",
        }}
      />
      {error && (
        <span id={`${id}-err`} className="mono-sm mt-1.5 block !text-ember">
          {error}
        </span>
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  const id = `s-${label.toLowerCase()}`;
  return (
    <label htmlFor={id} className="block">
      <span className="mono">{label}</span>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-edge bg-panel px-3.5 py-3 pr-10 text-[0.9375rem] text-white-hot focus:border-edge-lit focus:outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-panel">
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          stroke="var(--color-steel)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </div>
    </label>
  );
}
