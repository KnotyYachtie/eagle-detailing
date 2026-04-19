# Design prompt (for agents / AI)

**Workflow (read this first):** **`agent-conductor.md`** — task type → what to read → what to edit → assumptions vs backbone handoffs.

---

You are extending **Eagle Detailing** — a **cinematic minimal luxury** brand (precision service for high-value assets: **marine · aviation · automotive**). **Restraint beats decoration.**

## Non-negotiables

- **Subtract first.** If a change adds visual noise, reject it unless it removes a bigger problem.
- **One system across three domains** — never three unrelated micro-styles.
- **Surface / photo leads**; UI **frames** and **clarifies**.
- **Motion is slow and calm** — never bouncy, never “app-y.” Honor **`prefers-reduced-motion`** (no surprise scroll, no extra polish transforms).
- **Mobile browser chrome is a layout input.** Align **`theme-color`**, **page canvas**, **hero bleed**, and (default routes) **measured pre-scroll + `--home-prescroll-y`** — do not pretend iOS bars are not there. **Payback** in transforms/padding for the **hero** is **home-only**; **`main`** min-height floor is **site-wide** when `data-home-load-intro` is on.
- **Brand navy `#102135` stays canonical** for product surfaces; **neutral near-black `#050505`** first-paint canvas + **`theme-color`** are the **default site shell** (`BaseLayout`); override per page if chrome sampling needs a different fill.

## Tokens & utilities (use as-is)

- **Colors:** `--color-navy`, `--color-navy-ink`, `--color-cream`, `--color-cream-muted`, `--color-accent`; optional `--page-canvas` for route-level canvas override.
- **Type:** `--font-display` (Playfair), `--font-hero` (Butler for home hero headline), `--font-ui` (DM Sans).
- **Space:** `--space-xs` … `--space-xl`; **radius** `--radius-sm|md`; **header** `--header-h`; **ease** `--ease-out`.
- **Layout:** `.u-container`, `.u-section` / `.u-section--tight`, `.u-eyebrow`, `.u-muted`, `.u-btn` / `.u-btn--ghost`.

## Structural patterns

- **Interior pages:** `.page-hero` (eyebrow + title + lede) → `.page-body` on **`#0a1628`** band for long-form / lists / cards.
- **Home hero:** full viewport min-height (`svh` + safe-area + header bleed + optional prescroll), **media absolute** with **top safe-area bleed**, **metrics anchored from bottom** using **`--hero-wave-strip-height`**, **content** clears transparent header using **padding** (includes prescroll when set).
- **Header:** default **sticky glass**; hero uses **transparent absolute** with **SVG eagle**; **grouped** Services / About + flat Projects; **desktop** text flyouts; **mobile** sheet + accordions.
- **Footer:** three-column **≥720px**; micro-headings; flat `NAV` for exploration.
- **Home domains (rev. 3 drift):** three **scroll chapters** on canvas — **Rellax** plate/float per band, **lateral spine** + labels, **`domains-drift.ts`**: **`.drifts-in--visible`**, exit scrub, hash **`scrollIntoView`**, **`data-spine-active`** only while a band overlaps **~20–80%** viewport height (removed off-screen); **`index.astro`** **reveal-up** on **`.domains-band__layout`** (**opacity** + **`translateY(15%)`→0** upward, **1.5s** **`ease`**, one-shot); **none** when **`prefers-reduced-motion: reduce`**. **Layout rhythm** (`--domains-chapter-pad-y`, spine links **`align-self: center`** desktop; **`≤719px`** spine off + **`.domains-band__eyebrow`** above **`h3`**, spine↔content gap); **≥860px** **staggered** grid: Marine + Automotive **collage | copy**; Aviation **`.domains-band--flip`** (**RTL** on the inner layout row) for **copy | collage** with the **same** fig-first DOM as the others. **No** drift-block **radial** stacks / spine **wash**. Exercise log **`documentation/exercise.001.md`**. Legacy “three glass cards” grid is **not** the current home domains pattern.

## Heuristics (shortcut)

- Chrome reads navy → **canvas + theme-color** match actual paint; critical inline must match `global.css`.
- Sticky fails on iOS → **remove `overflow-x` from `.page`**, clip on `html`.
- Pre-scroll → **site-wide** vars on **`main`** min-height; **pay back** with `--home-prescroll-y` on **home** heights + headline padding + metrics translate + slight **home-only** image scale (unless reduced motion).
- Glass unreadable → **solid** fallback at same luminance.

## Explicit “don’t”

- No pricing tables, no icon service grids, no ecommerce patterns, no loud multi-accent palettes, no **fake** gallery proof, no hero **top feather** that reads as a second band on iOS.

## Code map (when editing)

- `src/layouts/BaseLayout.astro` — `canvasColor`, `themeColor`, critical CSS, **inline pre-scroll** after viewport.  
- `src/styles/global.css` — tokens, utilities, `html` scroll discipline, `--page-canvas`.  
- `src/pages/index.astro` — home hero, metrics, domains, trust, atmosphere sections.  
- `src/scripts/home-prescroll.ts` — Safari scroll restore safety net.  
- `src/components/Header.astro` / `Footer.astro` — chrome patterns.

---

## Assumptions (documented)

- **Pre-scroll magnitude** (`~8vh`, clamped) is an acceptable default; fine-tuning per device class may still be needed.
- **Inline head script** may still produce a **single-frame** flash on some WebKit builds — acceptable trade vs late scroll.
- **Domain card glass** is treated as **controlled depth**, not “forbidden glassmorphism” from early copy — the written rule was *marketing restraint*, the implementation **permits** subtle blur where it aids separation.

## Inconsistencies to resolve consciously

1. **Legacy “no glassmorphism” phrasing** vs **current direction** — **glass allowed** when high-end and boundary-legible; domains are the next surface to lock a recipe. Align any stale prose with **`design.md` → Section 1** and **`assumptions.md` → Owner → Domains & glassmorphism**.  
2. ~~**Hero primary CTA**~~ **Resolved (Apr 2026):** v1 **no** hero CTA button — **`design.md` / assumptions** updated; markup stays without hero button by product choice.  
3. **`layout-rules`:** canonical spec is **`docs/design-system/layout-rules.md`**; **`documentation/design-system/design-prompt.md`** points here—keep both folders aligned (see **`agent-conductor.md`**).
