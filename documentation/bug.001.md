# Bug 001 — Marine page: dark / “empty” band at the top (notch / status-bar edge)

**Page:** `/marine` (`src/pages/marine.astro`)  
**Environment:** iOS Safari (real device) most relevant; also worth checking with transparent `header.site-header` over the hero.

## Symptom

A **dark, flat band** appears along the **top edge of the screen** (under the iOS status bar / in the “notch” region, behind the global transparent header). It reads as the **document “canvas”** or an unfilled safe-area strip, not as intentional hero art. The user wanted the full-viewport `yacht7` photo to read as **continuous** under the transparent chrome.

## Product / layout context

- **Global header** `header.site-header` is **transparent** on Marine (`transparentHeader`); it sits at high z-index (e.g. 50) over the page.
- **Hero** is **fixed** (`.marine-hero--fixed`, z ~40) with an in-flow **`.marine-hero__spacer`** so the rest of the document still scrolls. The “hero” image is not in the fixed header’s media node; the **primary photo** lives in a **separate `position: fixed` parallax** stack (Rellax on `.marine-page__parallax` → inner frame → `yacht7.png`).
- **BaseLayout** injects first-paint inline CSS on `html` / `body` with a default **`canvas` color** (`#050505` when `canvasColor` is not set) so the **initial paint** can show a solid field before images load.

## Approaches we already tried (chronological / thematic)

1. **Align shell with homepage**  
   - Prescroll / intro viewport: shared patterns with the home hero (`data-home-load-intro`, `--hero-inner-vh`, `home-prescroll.ts`, and global rules in `src/styles/global.css` that size Marine’s fixed hero and spacer to match the home intro math).  
   - **Goal:** avoid Mobile Safari layout/viewport oddities (VT, dynamic toolbar) that make the “first frame” or spacer disagree with the home baseline.

2. **Safe-area bleed on the fixed hero’s empty media**  
   - `.marine-hero__media` uses negative `top` and extended `min-height` with `env(safe-area-inset-top)` (mirroring home `.hero__media` in `index.astro`).  
   - **Rationale:** fixed layers with only `inset: 0` / `100vh` can fail to **paint** into the region above the layout viewport; bleeding matches established home behavior.

3. **Parallax as full-viewport background**  
   - Full-page image in `.marine-page__parallax` (scaled / tall inner for Rellax travel), with `.marine-page__canvas` for **non-opaque** glow + grain on top.  
   - **Later tweak:** `canvasColor="transparent"` and `themeColor="#0a1118"` on `BaseLayout` for Marine so **first-paint** `html`/`body` is not a solid dark slab behind the photo (`criticalCanvas` in `BaseLayout.astro`).

4. **“Surgical” overlays (since removed)**  
   - **Parallax matte** (gradient scrim) on top of the photo.  
   - **Hero readability** layer (tinted / masked area for type contrast).  
   - Also experimented with **removing `backdrop-filter`** from a readability path and **overflow** containment tweaks.  
   - **User feedback:** these read as an **extra top-edge treatment** or did not fix the root band; the matte and readability **nodes and CSS were removed** so the only fix path is structural (geometry + first paint + stacking), not a fake scrim.

5. **Current mitigations (as of last edit)**  
   - **`.marine-page__parallax`** and **`.marine-page__canvas`** use explicit **`top: calc(-1 * env(safe-area-inset-top, 0px))`** and **`min-height: calc(100svh + env(safe-area-inset-top, 0px))`** (same *idea* as home `.hero__media` / comments in `marine.astro`: bleed into the notch, not only the layout box).  
   - **No** `parallax-matte` or `marine-hero__readability` in the tree.

## Files to read first

| Area | Path |
|------|------|
| Marine page + scoped CSS | `src/pages/marine.astro` |
| First-paint canvas + theme | `src/layouts/BaseLayout.astro` (`canvasColor`, `themeColor`, `criticalInlineCss`) |
| Global header, Marine + intro sync | `src/styles/global.css` (search `marine-hero`, `data-home-load-intro`, `domain-marine-hero`) |
| Rellax init | `src/scripts/marine-page-rellax.ts` |
| Home reference (bleed + intro) | `src/pages/index.astro` (`.hero__media`, `data-home-load-intro` blocks) |
| Prescroll | `src/scripts/home-prescroll.ts` |
| Site header | `src/components/Header.astro` |

## What is still unknown / good second-opinion questions

1. **Is the band actually `html`/`body` (first paint, transparent showing through to something), or a compositor gap** (fixed layer not covering the visual viewport) **or a stacking** issue with `z-index: 0` parallax under `z-index: 1` canvas and fixed hero / `site-header`?  
2. On **iOS Safari**, does `position: fixed` + `top: -env(safe-area-inset-top)` always paint into the **safe area** when the page uses `viewport-fit=cover`, or is there a known edge case with **Rellax-transformed** descendants?  
3. Should the **parallax image** (not just the container) have an explicit min-height/negative margin so the **bitmapped** layer extends, vs. only the fixed wrapper?  
4. Is **view-transition** on `domain-marine-hero` (`.marine-page__parallax-frame`) contributing a flash or a clipped group during or after navigation from home?  
5. If contrast drops without the removed readability layer, is the intended follow-up only **text-shadow** on hero type, or a minimal non-full-width scrim (product decision).

## Repro notes for whoever picks this up

- Reproduce on a **notched** iPhone in **Mobile Safari**; check portrait with URL bar **shown** and **minimized** (dynamic `vh` / toolbar).  
- Compare **first navigation** to `/marine` vs **hard refresh** and vs **in-app** View Transition from the home “Marine” tile if applicable.  
- Compare `/` hero (single `.hero__media` stack) to `/marine` (split: parallax + fixed empty `marine-hero__media`).

---

*This document summarizes implementation attempts in-repo; it is intended for a second pair of eyes (e.g. another model or engineer) to suggest a root-cause read or a smaller experiment matrix.*
