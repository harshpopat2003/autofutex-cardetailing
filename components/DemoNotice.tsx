"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./DemoNotice.module.css";

const EMAIL = "hello@theaurenstudio.com";
const STUDIO = "The Auren Studio";

/**
 * The disclosure bar every Auren Studio demo carries.
 *
 * It is chrome, not content: a neutral dark material that reads as
 * system UI over any brand palette, pinned to the top edge and given
 * real space in the layout (see the module's `html body` padding) so
 * that nothing of the site below ever sits underneath it.
 *
 * The bar itself is deliberately one line — the full notice lives in a
 * disclosure that opens from the button that asked for it, so the
 * legal detail is one tap away rather than four lines of chrome on
 * every screen. Closing it puts the page back exactly as it would have
 * been without the bar; it returns on the next load, which is the
 * point of a notice.
 */
export default function DemoNotice({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();

  /* Escape and a click outside are the two ways people reach for "get
     me out of this", so neither can be the only one that works. The
     pointer listener runs on the capture phase so a click on the page
     dismisses the panel without also being swallowed by it. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open]);

  /* Closing hands the page back the strip it was lending us. The height
     lives in a registered custom property on <html>, so setting it to
     zero animates the body's padding and the site's own fixed header
     together, off one transition, without this component knowing
     anything about the header.

     The page is a different height afterwards, so anything that
     measured the document on load — pinned scroll scenes, smooth-scroll
     engines — has to measure again. A resize event is the one signal
     every library of that kind already listens for, and it goes out
     once the motion has settled rather than during it. */
  useEffect(() => {
    if (!closed) return;

    const el = document.documentElement;
    el.setAttribute("data-auren-demo", "closed");

    const settled = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 440);

    return () => {
      window.clearTimeout(settled);
      el.removeAttribute("data-auren-demo");
    };
  }, [closed]);

  const mailto =
    `mailto:${EMAIL}` +
    `?subject=${encodeURIComponent(`Demo site enquiry — ${brand}`)}` +
    `&body=${encodeURIComponent(
      `Hello ${STUDIO},\n\nI'm writing about the ${brand} demo site.\n\n`,
    )}`;

  return (
    <div
      ref={root}
      className={styles.root}
      data-closed={closed || undefined}
      inert={closed}
    >
      <aside className={styles.bar} aria-label="Demo site notice">
        <span className={styles.badge}>Demo</span>

        <p className={styles.copy}>
          <span>
            Design demo by <strong className={styles.studio}>{STUDIO}</strong>
          </span>
          <span className={styles.tail}>
            {" "}
            — an independent concept site, not affiliated with or endorsed by {brand}.
          </span>
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.action}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
          >
            <span className={styles.actionLabel}>Details</span>
            {/* The chevron points where the panel will come from, and
                turns to point back the way it leaves. */}
            <svg
              className={styles.chevron}
              viewBox="0 0 12 12"
              width="11"
              height="11"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M2.5 4.5 6 8l3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.action} ${styles.close}`}
            onClick={() => {
              setOpen(false);
              setClosed(true);
            }}
            aria-label="Close this notice"
            title="Close this notice"
          >
            <svg
              viewBox="0 0 12 12"
              width="11"
              height="11"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M3 3 9 9M9 3 3 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      <div
        id={panelId}
        className={styles.panel}
        data-open={open || undefined}
        aria-hidden={!open}
        inert={!open}
      >
        <h2 className={styles.panelTitle}>About this demo</h2>

        <p className={styles.panelText}>
          This site was designed and built by <strong>{STUDIO}</strong> as an independent
          demonstration of our work. It is not affiliated with, endorsed by, or operated
          by {brand}, and it is not a live service — nothing here can be booked, ordered
          or relied on.
        </p>
        <p className={styles.panelText}>
          All brand names, logos, photography and copy remain the property of their
          respective owners and appear here only to illustrate design.
        </p>
        <p className={styles.panelText}>
          If you represent {brand} and would like this taken down, write to us and we
          will remove it promptly.
        </p>

        <a className={styles.mail} href={mailto}>
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
            <rect
              x="1.75"
              y="3.25"
              width="12.5"
              height="9.5"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
            <path
              d="M2.5 4.75 8 8.75l5.5-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {EMAIL}
        </a>
      </div>
    </div>
  );
}
