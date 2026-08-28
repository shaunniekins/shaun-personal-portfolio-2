# AGENTS.md

Single-page personal portfolio. SvelteKit 2 + Svelte 5 (runes) + Tailwind CSS v4. Dark theme only.

## Commands

```bash
npm run dev      # vite dev
npm run check    # svelte-check — must report 0 errors, 0 warnings
npm run build    # production build
```

## Architecture

All content lives in `src/lib/portfolio-data.json`. Components read it directly; there are no loaders.

| Path | Role |
|---|---|
| `src/lib/sections.ts` | **Source of truth for page sections.** See contract #1. |
| `src/lib/reveal.ts` | `use:reveal` action — one shared IntersectionObserver for the whole page |
| `src/lib/components/IndexRail.svelte` | Navigation: desktop left rail, mobile bar + sheet. Owns active-section and scroll-progress state. |
| `src/lib/components/Icon.svelte` | Every SVG on the site. Add new icons here, never inline. |
| `src/lib/components/SectionHeading.svelte` | Numbered `<h2>` for each section |
| `src/lib/components/{Hero,About,Timeline,Projects,Contact}.svelte` | One section each |
| `src/routes/+page.svelte` | Composition, `<svelte:head>`, skip link, footer. Keep it thin. |
| `src/app.css` | Design tokens (`@theme`) + base styles + reveal CSS |

## Design system

Tokens are defined in the `@theme` block of `src/app.css`. **Never write a raw hex or a
raw font stack in a component** — add a token instead.

Colors: `ink` (page), `surface` / `raised` (elevated), `line` / `line-strong` (hairlines),
`text` / `muted` (type), `violet` / `violet-soft` (primary), `amber` (see below).

Type has three roles, and they are not interchangeable:
- `font-display` (Space Grotesk) — headings and the email address
- `font-body` (Archivo) — prose
- `font-mono` (JetBrains Mono) — **data only**: dates, stack names, counts, section indices,
  labels. The `.eyebrow` component class is the uppercase mono label.

### Amber is reserved

`--color-amber` means exactly one thing: **current / live**. Its only uses are the `Now`
badge and dot on the in-progress role, the "Open to opportunities" status, the matched
technology chip under an active filter, and one corner tick in About.

Do not use amber as a general second accent, a hover color, or decoration. It is a signal,
and using it elsewhere destroys the signal.

## Load-bearing contracts

These break silently — no error, no failing test. Verify them by hand if you touch the files.

1. **`sections.ts` drives the rail.** Adding a `<section id="...">` to the page without
   registering it in `sections.ts` means the index rail ignores it entirely. No warning.

2. **The `.js` class contract.** `src/app.html` has an inline script adding `.js` to
   `<html>`. `src/app.css` hides `[data-reveal]` **only** under `.js`, so visitors without
   JavaScript always see the content. Delete that script and every reveal animation stops
   working while the page still looks fine — nothing will tell you.

3. **Image dimensions must match the file.** `static/images/portrait.jpg` and `about.jpg`
   are derived assets: 760×950, 4:5, EXIF rotation baked in. The `width`/`height`
   attributes and `imageWidth`/`imageHeight` in the JSON must match the file exactly, or
   CLS returns. The full-resolution originals are no longer tracked, so these two files
   are the only copies — replace one only from a fresh high-res source, and regenerate with
   PIL: `ImageOps.exif_transpose` then `ImageOps.fit` to 760×950, then update both the
   attributes and the JSON.

4. **Reveal is progressive enhancement, not a requirement.** Markup carries `data-reveal`;
   the action adds `data-revealed`. Content must be readable with JS off.

## Deliberate absences — do not "fix" these

- **Project cards are not numbered.** Their order carries no meaning, so numbering would
  assert a sequence that does not exist. The timeline *is* numbered by period, because
  chronology is real information.
- **Hero subtitles have no dividers.** The four roles never fit on one line at any width,
  so any separator orphans at the wrap. Space separates them instead.
- **No light mode.** The design commits to dark; `color-scheme: dark` and `theme-color`
  are set explicitly.
- **No animation library.** Scroll reveal is one IntersectionObserver plus CSS transitions.
  Do not add GSAP or similar.
- **No pagination on projects.** Filtering by stack replaced it, and the filter lives in
  the URL (`?stack=`) so views are linkable.

## UI expectations

Any UI change should hold these, all currently true and measured in a real browser:

- CLS ≈ 0 and no horizontal overflow at 375 / 768 / 1024 / 1440
- Every text/background pair meets 4.5:1 (3:1 for large text)
- Visible `:focus-visible` on every interactive element; no `outline-none` without a replacement
- No interactive target under 24px in either dimension
- `prefers-reduced-motion` renders the final state with no transition
- Transitions list properties explicitly — never `transition: all`
- Stateful UI (the project filter) stays reflected in the URL
- Text stays selectable; do not add `user-select: none`

## Note on graft

`graft/` indexes only 6 files in this repo and **no `.svelte` files at all** —
`graft grep "IndexRail"` returns nothing. Despite the graft skill's general guidance, graft
cannot answer questions about this project's UI. Read the components under
`src/lib/components/` directly.
