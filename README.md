# autofutex-cardetailing

A one-page site for AutoFutex — 3M paint protection and ceramic coating,
Muscat. Next.js App Router, Tailwind v4, GSAP, Lenis.

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

The site is exported as static HTML and published by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every
push to `main`.

**One-time setup:** in the repo on GitHub, go to **Settings → Pages →
Build and deployment** and set **Source** to **GitHub Actions**. That is
the only manual step — there is no `gh-pages` branch to create and no
secrets to add.

Push to `main`, watch the run in the **Actions** tab, and the site lands
at:

```
https://harshpopat2003.github.io/autofutex-cardetailing/
```

### How the subpath is handled

A GitHub Pages project site is served from `/<repo>/`, not the domain
root. The workflow passes the repo name to the build as
`NEXT_PUBLIC_BASE_PATH`, which feeds `basePath`/`assetPrefix` in
[`next.config.mjs`](next.config.mjs) — that covers everything Next emits
itself (`_next/*`, fonts, chunks). Hand-written `<img>` and `<video>`
sources are invisible to Next, so those go through `asset()` from
[`lib/asset.ts`](lib/asset.ts). Renaming the repo needs no code change.

With the variable unset — i.e. `npm run dev` — the prefix is empty and
every path stays as authored.

### Notes

- `public/.nojekyll` stops Pages from discarding the `_next` directory,
  which Jekyll would otherwise skip for starting with an underscore.
- `output: "export"` rules out anything needing a server at runtime:
  route handlers, server actions, ISR, middleware, and the `next/image`
  optimiser (images ship unoptimised, so keep committing them sized).

### Using a custom domain instead

Point the domain at Pages in **Settings → Pages**, then drop the
`NEXT_PUBLIC_BASE_PATH` env block from the build step in the workflow —
a custom domain serves from the root, so the prefix must be empty. Add
your domain in `public/CNAME` so the export carries it through.
