import type { ReactNode } from "react";

/**
 * Every call to action on the site.
 *
 * The three inner elements are structural, not decorative: the label
 * and icon sit above a fill that is parked off to the right, and the
 * circle behind the icon is simply the part of that fill still on
 * screen. Hovering slides the fill across, so the pill reads as one
 * surface moving rather than two colours cross-fading.
 *
 * Renders an `<a>` when given an `href` and a `<button>` otherwise, so
 * links stay links and the submit button stays a submit button — the
 * markup follows the behaviour rather than the appearance.
 */
type Props = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit";
  className?: string;
  "aria-label"?: string;
};

export default function Cta({
  children,
  variant = "primary",
  href,
  external,
  onClick,
  type = "button",
  className = "",
  ...rest
}: Props) {
  const classes = `btn btn-${variant} ${className}`.trim();

  const inner = (
    <>
      {/* Parked fill. Purely presentational, so it stays out of the
          accessibility tree and out of the pointer's way. */}
      <span className="btn-fill" aria-hidden="true">
        <span />
      </span>
      <span className="btn-label">{children}</span>
      <span className="btn-icon" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...rest}>
      {inner}
    </button>
  );
}

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
