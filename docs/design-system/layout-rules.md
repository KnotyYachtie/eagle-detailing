# Layout rules

## Global frame

- **Scroll container discipline**  
  - `html`: `overflow-y: scroll`, `overflow-x: hidden`, **scrollbar hidden**, `scroll-behavior: smooth` (disabled under reduced motion).  
  - **Rationale:** stable scrollbox + no visible bar avoids layout “hiccups” when chrome appears/disappears.

- **Page shell**  
  - `.page`: column flex, `min-height: 100vh`, **no** `overflow-x: hidden` (breaks iOS sticky).  
  - `.page__main`: `flex: 1` so footer pins to bottom on short pages.

- **Content width**  
  - `.u-container`: `width: min(1120px, 100% - 2 * var(--space-md))`, centered.  
  - **Rule:** all primary reading columns live inside this gutter unless full-bleed is intentional.

## Vertical rhythm

- **Sections**  
  - Default: `padding-block: var(--space-xl)` (`.u-section`).  
  - Tight band: `var(--space-lg)` (`.u-section--tight`) — use for trust / thin separators.

- **Interior page template**  
  - **Hero block:** `.page-hero` → eyebrow + `h1` + `.u-muted` lede, `padding-block` starting at `xl`.  
  - **Body band:** following section with **flat** dark ground (`#0a1628` pattern) to separate “air” of hero from structured content.

## Homepage hero (signature)

- **Height stack** (mobile-first intent)  
  - Baseline: `100vh` then `100svh`.  
  - Home + load intro: add **`env(safe-area-inset-top)`**, header bleed (**`var(--header-bar) + var(--header-safe-pad)`** in `calc` sums — do **not** nest **`var(--header-h)`** inside outer `calc()`; WebKit treats nested `calc` as invalid), **`var(--home-prescroll-y, 0px)`**, and live height **`var(--hero-inner-vh, 100svh)`** from `visualViewport` / resize.  
  - **Avoid** shipping **`100dvh` / `100lvh`** overrides that **replace** `--hero-inner-vh` on iOS home — they fight chrome-aware height and can **shorten** the hero.

- **Layering**  
  - `.hero__media`: absolute fill, **bleed top** with `-env(safe-area-inset-top)`, min-height extends safe-area + prescroll budget; optional **soft neutral placeholder** gradient on the media layer (not the header) while the image resolves.  
  - `.hero__content`: relative, **high z-index** over media.  
  - `.hero__metrics`: absolute **from bottom**, height tied to **`--hero-wave-strip-height`** so stats share one optical band with any future wave strip.

- **Header overlap**  
  - Home: transparent header **`position: absolute`**; hero **negative `margin-top`** using **`--header-bar` + `--header-safe-pad`** so the paint box **extends under** the bar.  
  - Content still clears the header via **padding-top** that includes **`header-bar` + `header-safe-pad` + space + optional prescroll**.

- **Pre-scroll compensation** (when active)  
  - `--home-prescroll-y` on `<html>` drives:  
    - extra **`padding-top`** on `.hero__content`  
    - **`translateY`** on `.hero__metrics`  
    - extra **min-height** on `.hero` and `.hero__media`  
  - **Invariant:** every pixel scrolled is **re-invested** in layout so scroll position ≠ broken composition.

## Below-the-fold home sections

- **Atmosphere sections**  
  - Shared pattern: section + **`index-atmos`** (stacked gradients + optional grain) → **one** “night field” language, not per-page random backgrounds.

- **Domain grid**  
  - **Mobile:** single column.  
  - **`min-width: 640px`:** three equal columns.  
  - **Rule:** cards are **peers** — equal grid, not one hero column.

- **Trust strip (when used as “cinema bar”)**  
  - **Sticky** under header: `top: var(--header-h)`, `z-index` **below** header, **above** scrolling content.  
  - **Visual:** near-black neutral gradient + hairline borders — reads as **designed chrome**, not accidental divider.

## Typography hierarchy (structural)

- **Hero H1** uses **`var(--font-hero)`** (Butler) on the homepage; other pages use display serif (`Playfair`) for `h1–h3`.  
- **Eyebrows** are always UI caps: small, **wide tracking**, **accent** color — they **label** a section, they never carry the thesis.

## Spacing tokens (use, don’t invent)

- `--space-xs` through `--space-xl` are the **only** vertical rhythm steps unless a component documents an exception (e.g. hero metrics band).
