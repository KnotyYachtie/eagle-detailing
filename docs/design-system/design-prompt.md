# Design prompt (for agents / AI)

You are extending **Eagle Detailing** — a **cinematic minimal luxury** brand (precision service for high-value assets: **marine · aviation · automotive**). **Restraint beats decoration.**

## Non-negotiables

- **Subtract first.** If a change adds visual noise, reject it unless it removes a bigger problem.
- **One system across three domains** — never three unrelated micro-styles.
- **Surface / photo leads**; UI **frames** and **clarifies**.
- **Motion is slow and calm** — never bouncy, never “app-y.” Honor **`prefers-reduced-motion`** (no surprise scroll, no extra polish transforms).
- **Mobile browser chrome is a layout input.** Align **`theme-color`**, **page canvas**, **hero bleed**, and (on home) **measured pre-scroll + `--home-prescroll-y` payback** — do not pretend iOS bars are not there.
- **Brand navy `#102135` stays canonical** for product surfaces; **neutral near-black canvas** is a **homepage-only** tool when Safari re-tints chrome from the page background.

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
- **Home domains:** responsive **1 → 3** grid; cards use **subtle glass + Camden clip**; **IO reveal**; **home-only** expand overlay on click.

## Heuristics (shortcut)

- Chrome reads navy → **canvas + theme-color** match actual paint; critical inline must match `global.css`.
- Sticky fails on iOS → **remove `overflow-x` from `.page`**, clip on `html`.
- Pre-scroll → **always** pay back with `--home-prescroll-y` on heights + headline padding + metrics translate + slight **home-only** image scale (unless reduced motion).
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

1. **Written “no glassmorphism” for domain entry** vs **implementation** using **blur-backed domain cards** on the homepage — decide whether to **tighten copy** or **reduce blur** toward solids.  
2. **Hero primary CTA** is sometimes **commented out** in markup while design doc still prescribes **one** hero CTA — either restore the CTA or update the rule to “hero CTA optional in v1.”  
3. **`layout-rules` file** in `documentation/design-system/` had **no extension** in the repo; canonical file here is **`layout-rules.md`** under `docs/design-system/`.
