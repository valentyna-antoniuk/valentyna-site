# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

## Project overview

A personal portfolio/CV website for Valentyna Antoniuk, built with Astro + React islands + CSS/SCSS modules. Static by default with SSR available on demand, deployed to Netlify with automated builds on push to `main`.

## Commands

- `npm run dev` — start the Astro dev server
- `npm run build` — build for production
- `npm run preview` — run via `netlify dev --context production` (use this instead of `astro preview` to get Netlify functions/forms behavior locally)
- `npx prettier . --write` — format the codebase (also runs automatically via the husky pre-commit hook, see `.husky/pre-commit`)

There is no lint script and no test suite configured in this repo.

## Architecture

- **Rendering model**: `astro.config.mjs` sets `output: "server"` with the `@astrojs/netlify` adapter. Pages are `.astro` files; interactive pieces are React components hydrated as islands (e.g. `client:load` on `ReactContactForm` in `src/components/Footer/Footer.astro`).
- **Page structure**: `src/pages/` — `index.astro` (home), `pet-projects.astro` (project list), `pet-project/[name].astro` (dynamic project detail page), `my-process.astro`, `404.astro`.
- **Layout**: every page wraps content in `src/layouts/CommonLayout.astro`, which composes `Head`, `Header`, `<slot />`, and an optional `Footer` (toggle via `isFooterAvailable` prop).
- **Feature-based organization**: `src/features/` groups page-specific sections by feature rather than by type, e.g. `features/index/{banner,path,skills,certificates,recommendations}` for the homepage, `features/projects` for the pet-projects page. Each feature folder holds its own `.astro`/`.tsx` components, styles, and local assets/data.
- **Cross-repo README fetching**: `src/helpers/fetchMd.ts` fetches raw README content from `https://raw.githubusercontent.com/valentyna-antoniuk/<repo>/refs/heads/main/` at build/request time to source pet-project descriptions and full project pages. It rewrites relative `public/`-prefixed image paths to absolute GitHub raw URLs, extracts a specific `## <heading>` section via `extractMarkdownSection`, and renders sanitized HTML via `renderMarkdownSafe` (remark → rehype → `rehype-sanitize` → stringify). `src/pages/pet-project/[name].astro` fetches the full README and renders it with `marked` instead, wrapped in `src/components/Markdown.astro` for styling. Both paths depend on those external repos being reachable and structured with the expected headings/paths.
- **Forms**: `ReactContactForm.tsx` submits to Netlify Forms (`form-name` hidden field, `netlify-honeypot` bot field) via a `fetch` POST to `/` with `application/x-www-form-urlencoded` — this only works correctly when served through Netlify (hence `npm run preview` uses `netlify dev`, not plain `astro preview`). **Edge case**: Netlify detects forms by scanning static HTML at deploy time, but the contact form is a JS-rendered React island on a fully SSR site (`output: "server"`), so it's invisible to that scan. Detection relies on the static stub `public/netlify-form-hack/__forms.html`, which lists the form's fields and is copied verbatim into the build (never linked/shown). Keep its field `name`s in sync with `ReactContactForm.tsx` — any field missing from the stub is dropped from submissions. Note `netlify dev` never persists submissions, so a successful capture can only be verified on a real deploy.
- **Styling**: mix of global CSS (`src/styles/`), CSS Modules (`*.module.css`), and SCSS Modules (`*.module.scss`) colocated with components/features. Prettier is configured with `prettier-plugin-astro` for `.astro` file formatting.
- **Animation**: `framer-motion` is used for interactive/animated pieces (e.g. `features/index/path/HorizontalPath.tsx`).
