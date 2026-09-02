import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/* GitHub Pages is a dumb file host: no Node server, no image optimiser,
   and a project site lives under `/<repo>/` rather than the domain root.
   The CI workflow passes the repo name in as NEXT_PUBLIC_BASE_PATH; with
   it unset — i.e. `next dev` locally — the site behaves as before. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Emit a plain static site into `out/` instead of a server build.
  output: "export",

  // No optimiser at runtime, so the images have to ship as authored.
  images: { unoptimized: true },

  basePath,
  assetPrefix: basePath,

  // Pages resolves `/foo/` to `/foo/index.html`; writing the files that
  // way keeps future routes from 404ing.
  trailingSlash: true,

  // The repo has a lockfile at its root as well, so Turbopack has to be
  // told which directory this app actually is.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
