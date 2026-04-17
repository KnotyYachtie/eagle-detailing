# Eagle Detailing – Homepage Hero & Metrics Worklog

_Date range: Apr 14–16, 2026 (approx.)_

This document summarizes the sequence of changes and decisions made to the Eagle Detailing homepage hero (`index.astro`) and related layout/animation behavior.

---

## 1. Hero Image & Layout

### 1.1 Hero container

- `section.hero`:
  - `min-height: 100vh; min-height: 100svh;`
  - Flex, aligned `flex-start`, with metrics anchored near the bottom via `--hero-wave-strip-height`.
  - Horizontal overflow clipped; vertical overflow clipped or `clip` when supported:
    - `overflow-x: hidden;`
    - `overflow-y: hidden;`
    - `@supports (overflow: clip) { .hero { overflow-y: clip; } }`

### 1.2 iOS safe-area behavior (top edge)

Goal: avoid the feeling of a “navy banner” at the very top of the display on iPhone/iPad.

We tried:

1. `html/body` scrollbar stabilization and CSS import ordering.
2. Removing hero scaling and limiting blur.
3. Extending the **hero and media** into the safe-area:

```css
@supports (padding-top: env(safe-area-inset-top)) {
  .hero {
    min-height: calc(100svh + env(safe-area-inset-top));
  }

  .hero__media {
    inset: calc(-1 * env(safe-area-inset-top)) 0 0 0;
  }
}
```

This makes the hero media extend upward into the safe area, but the **Safari browser chrome** can still draw its own color above the content.

### 1.3 Top feathered blend

Because Safari’s browser bar color can’t be fully replaced in normal tab mode, we added a **feathered overlay** to soften the seam:

```css
.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: clamp(2.2rem, 8vmin, 4.25rem);
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(126, 168, 192, 0.48) 0%,
    rgba(126, 168, 192, 0.16) 48%,
    rgba(126, 168, 192, 0) 100%
  );
}
```

This makes the transition from the browser bar to the hero sky more intentional and less like a hard navy strip.

### 1.4 Hero media & image

- `.hero__media`:
  - `position: absolute; inset: 0; overflow: hidden; isolation: isolate;`
  - Background is a dark vertical gradient:
    - `background: linear-gradient(180deg, #1c1e22 0%, #141518 14%, #101114 38%, #0b0c0e 100%);`
  - Earlier we experimented with a **fallback background image** behind the PNG, but removed it because it caused a “restretch” / jitter on load.

- `.hero__img`:
  - `object-fit: cover; object-position: 46% top;`
  - Slight static transform to tune framing (no longer animated on load).
  - We explicitly removed **all scale animation** on both `.hero__media` and `.hero__img` to avoid hero “zoom” behavior.

---

## 2. Load Choreography / Animations

### 2.1 Hero image intro

We settled on a **simple blur + brightness + opacity ease-in**, with **no scale**:

```css
@keyframes homeHeroImgIntro {
  from {
    opacity: 0.25;
    filter: blur(5px) brightness(0.55);
  }

  to {
    opacity: 1;
    filter: blur(0) brightness(1);
  }
}

html[data-home-load-intro] .hero__img {
  opacity: 0;
  filter: blur(5px) brightness(0.55);
  animation: homeHeroImgIntro 2.1s cubic-bezier(0.25, 0.1, 0.25, 1) 0s forwards;
}
```

Key decisions:
- **No scaling** during intro (we removed `homeHeroMediaDescale` and all hero scale transforms).
- Blur is modest (5px) and brightness comes from 0.55 → 1.
- Duration is relatively long (2.1s) for a calm, luxury feel.

### 2.2 Headline, domains, metrics, header timing

Sequence is controlled with `html[data-home-load-intro]` selectors:

```css
/* Headline parts: “One standard.” / “Three domains.” */
html[data-home-load-intro] .hero-load-headline__part {
  display: inline-block;
  opacity: 0;
  transform: translateY(22px);
}

/* t ≈ 0.25s */
html[data-home-load-intro] .hero-load-headline__part--1 {
  animation: homeWordRise 0.75s cubic-bezier(0.25, 0.1, 0.25, 1) 0.25s forwards;
}

/* t ≈ 1.0s */
html[data-home-load-intro] .hero-load-headline__part--2 {
  animation: homeWordRise 0.75s cubic-bezier(0.25, 0.1, 0.25, 1) 1s forwards;
}

/* t ≈ 1.5s – domain links */
html[data-home-load-intro] .hero__domain-links {
  opacity: 0;
  animation: homeFadeOnly 0.62s cubic-bezier(0.25, 0.1, 0.25, 1) 1.5s forwards;
}

/* t ≈ 1.5s – metrics bar rise */
html[data-home-load-intro] .hero__metrics-inner {
  opacity: 0;
  transform: translate3d(0, calc(-1cm + 12px), 0);
  animation: homeStatRise 0.62s cubic-bezier(0.25, 0.1, 0.25, 1) 1.5s forwards;
}

/* t ≈ 2.5s – transparent header fade-in */
html[data-home-load-intro] .site-header--transparent {
  opacity: 0;
  animation: homeFadeOnly 0.62s cubic-bezier(0.25, 0.1, 0.25, 1) 2.5s forwards;
}
```

- **Ease**: all these now use the gentler `cubic-bezier(0.25, 0.1, 0.25, 1)` instead of a snappier overshoot, per your “calmer, more luxury” direction.
- Overlap:
  - Hero blur/brightness runs for 2.1s.
  - First word begins at 0.25s (intentionally overlapping the photo’s ease-in).
  - Domains and metrics begin together at 1.5s.
  - Header/nav follows at ~2.5s.

---

## 3. Metrics Layout & Typography

### 3.1 Base desktop/tablet layout

- `.hero__metrics`:
  - Absolutely positioned band near the bottom of the hero, centered, with a fixed height via `--hero-wave-strip-height`.
- `.hero__metrics-inner`:
  - Default is a **3-column grid**:

```css
.hero__metrics-inner {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: 0;
  width: 100%;
  max-width: 56rem;
  padding-inline: var(--space-sm);
  padding-bottom: 0.4rem;
  transform: translate3d(0, -1cm, 0);
}

.hero__metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.35rem 0.4rem 0.45rem;
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.hero__metric:last-child {
  border-right: none;
}
```

- Small-screen tweak at `max-width: 639px` adds a bit of padding adjustment, but keeps the grid.

### 3.2 Mobile portrait layout (one-per-row, with dividers)

For `@media (max-width: 820px) and (orientation: portrait)`:

- Switch to stacked, **one-per-row** metrics.
- Use short, centered divider lines between metrics.

Key rules:

```css
@media (max-width: 820px) and (orientation: portrait) {
  .hero {
    --hero-wave-strip-height: clamp(13.5rem, 42vw, 17.5rem);
  }

  .hero__metrics {
    bottom: clamp(5.4rem, 12vmin, 7.25rem);
    padding-bottom: 0;
  }

  .hero__metrics-inner {
    grid-template-columns: 1fr;
    gap: 0.95rem;
    max-width: 21rem;
    padding-bottom: 0.15rem;
  }

  .hero__metric {
    position: relative;
    border-right: none;
    border-bottom: none;
    padding: 0.48rem 0.25rem 0.52rem;
  }

  .hero__metric::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -0.48rem;
    width: min(70%, 14.5rem);
    transform: translateX(-50%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  }

  .hero__metric:last-child {
    padding-bottom: 0.05rem;
  }

  .hero__metric:last-child::after {
    content: none;
  }

  /* Extra space between numeric value and label for count rows */
  .hero__metric[data-count-row] {
    gap: 0.44rem;
  }

  /* Larger portrait font sizes */
  .hero__metric-value {
    font-size: 2.1rem;
    line-height: 1.02;
  }

  .hero__metric-value--text {
    font-size: 1.5rem;
    line-height: 1.1;
  }

  .hero__metric-label {
    font-size: 1.1rem;
    line-height: 1.22;
    letter-spacing: 0.06em;
  }
}
```

### 3.3 Global metric typography (all breakpoints)

We scaled up the **base** clamps so every layout (desktop/tablet/landscape/mobile) benefits from larger metrics:

```css
.hero__metric-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.4rem, 3.6vw, 2.05rem);
  /* ... */
}

.hero__metric-value--text {
  font-family: var(--font-hero);
  font-size: clamp(1.15rem, 2.7vw, 1.5rem);
}

.hero__metric-label {
  font-family: var(--font-ui);
  font-size: clamp(0.8rem, 1.6vw, 1.03rem);
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
```

Combined with the portrait overrides above, the metrics now have more presence everywhere, especially on mobile.

---

## 4. Scroll / Chrome / FOUC Issues

Key changes to combat scroll “flash” and layout jitter:

### 4.1 Global scroll behavior & hidden scrollbar

In `global.css`:

```css
html {
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
  scroll-behavior: smooth;
  background: var(--color-navy);
}

html::-webkit-scrollbar {
  display: none;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-ui);
  background: var(--color-navy);
}
```

In `<head>` (inline critical style from `BaseLayout.astro`), we mirrored this behavior to avoid a first-paint mismatch.

### 4.2 Mobile browser chrome color

We added `themeColor` support in `BaseLayout` and set the homepage to a sky-like blue:

```astro
interface Props {
  title: string;
  description?: string;
  transparentHeader?: boolean;
  dataHomeLoadIntro?: boolean;
  /** Browser chrome color on mobile (Safari/Chrome UI bars). */
  themeColor?: string;
}

const {
  title,
  description = SITE.description,
  transparentHeader = false,
  dataHomeLoadIntro = false,
  themeColor = '#102135',
} = Astro.props;
```

```astro
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content={themeColor} />
```

Homepage usage:

```astro
<BaseLayout
  title={SITE.shortName}
  transparentHeader={true}
  dataHomeLoadIntro={true}
  themeColor="#7ea8c0"
/>
```

This tells iOS/Android to tint the browser UI bars to a color sampled from the hero rather than the default navy page background.

---

## 5. Files Touched

- `src/pages/index.astro`
  - Hero markup, hero image, scrim, metrics band, domains, and CTA markup.
  - Hero CSS: layout, animations, iOS safe-area, top feather.
  - Metrics CSS: base grid, mobile portrait stacked behavior, spacing, dividers, typography.
  - Load choreography keyframes and `html[data-home-load-intro]` timing.
- `src/layouts/BaseLayout.astro`
  - Critical inline scroll/overflow CSS.
  - `dataHomeLoadIntro` → `data-home-load-intro` attribute on `<html>`.
  - `themeColor` prop and `<meta name="theme-color">`.
- `src/scripts/hero-metrics.ts`
  - Controlled when the count-up starts relative to the CSS stat reveal:
    - `METRICS_COUNT_START_AFTER_LOAD_MS` currently `1700`ms.

---

## 6. Open Questions / Future Tweaks

If you or a future assistant revisit this:

- **Top Safari bar**:
  - We’ve extended hero into the safe area, matched `theme-color`, and added a feather.  
  - Any remaining top band is purely Safari chrome behavior; further tweak is mostly about feather color and intensity.

- **Timing feel**:
  - You might want to micro-adjust the delays (e.g., `domains` + `metrics` starting slightly later or earlier, or making the hero ease-in even more subtle by lowering blur or starting opacity higher than `0.25`).

- **Metrics portrait layout**:
  - Currently one-per-row with centered dividers and enlarged typography.  
  - If it ever feels too heavy, reduce font sizes slightly or ease the gap value `0.95rem`.

---

This doc should give a future assistant or yourself everything needed to understand and further tweak the homepage hero behavior, typography, and chrome handling without rereading the entire chat.

