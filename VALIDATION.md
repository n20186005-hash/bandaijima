# Validation Report

**Project:** みなと日和｜ピアBandai旅の手帖  
**Validation date:** 2026-07-30

## Checks completed in this environment

The project passed a repository-wide structural and syntax inspection covering:

- `package.json` and other JSON syntax
- Node syntax for `astro.config.mjs`
- TypeScript syntax in data files, endpoint files, Astro frontmatter and browser scripts
- all local Astro imports
- all internal navigation targets
- all local image references
- all icon identifiers used by the component library
- GA4 measurement ID presence: `G-HXM22WWPKP`
- configured site URL kept out of visible Astro page copy
- no remote image URLs in rendered content
- all nine local WebP photographs are referenced

Validated project inventory:

- 11 `.astro` pages
- 10 Astro components
- 2 generated text/manifest endpoints
- 9 local WebP photographs
- 14 recognized public routes, including `/404.html`, `/robots.txt` and `/site.webmanifest`

The validation script reported **0 errors**.

## Full dependency build not executed here

The execution environment could not resolve or access the public npm registry, and its internal package mirror did not contain Astro. Consequently, these commands could not be completed in this environment:

```bash
pnpm install
pnpm build
```

This limitation concerns package retrieval rather than a detected project-code failure. A full Astro compiler build should still be run on a normal network-connected workstation or CI runner before production deployment.

## Recommended final verification

```bash
corepack enable
pnpm install
pnpm build
pnpm preview
```

After building, confirm:

1. `dist/index.html` and all page directories exist.
2. `dist/404.html`, `dist/robots.txt`, `dist/site.webmanifest` and sitemap files exist.
3. Mobile navigation, food filtering and course switching work in a browser.
4. GA4 Realtime receives a test visit.
5. Cloudflare Workers serves the custom 404 page.
6. Current store hours, temporary closures, transit and parking guidance have been rechecked immediately before launch.
