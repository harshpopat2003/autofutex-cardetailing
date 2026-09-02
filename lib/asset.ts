/**
 * GitHub Pages serves a project site from a subpath —
 * `https://<user>.github.io/<repo>/` — so every absolute URL the page
 * emits has to carry that prefix. Next rewrites the ones it owns
 * (`_next/*`, `next/image`, `next/link`) from `basePath` in the config,
 * but a hand-written `<img src="/assets/…">` is invisible to it. This is
 * that missing prefix, applied at the point of use.
 *
 * The value is inlined at build time, so it works in client components
 * too. Locally it is empty and every path stays exactly as authored.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public asset with the deploy base path. */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
