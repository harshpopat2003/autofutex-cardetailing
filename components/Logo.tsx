/**
 * The mark: a panel in section, with the protective layers stacked on
 * top of it. It is the same idea the Stack section explains at full
 * size — the logo is the diagram, compressed.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Panel */}
        <path
          d="M3 18.5 13 23l10-4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        {/* Clear coat */}
        <path
          d="M3 13.5 13 18l10-4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
        {/* The applied layer — the only one that gets the ember */}
        <path
          d="M13 3 3 8.5 13 13l10-4.5L13 3Z"
          stroke="var(--color-ember)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          fill="color-mix(in oklab, var(--color-ember) 16%, transparent)"
        />
      </svg>
      <span className="font-display text-[0.9375rem] font-bold tracking-[-0.02em] text-white-hot">
        AUTO<span className="text-ember">FUTEX</span>
      </span>
    </span>
  );
}
