# Heuristics (if / then)

## Color & first paint

- **If** Safari / Chrome top UI reads **too blue** against the hero  
  **Then** match **`theme-color`** to the **actual `html`/`body` fill** (not to an aspirational sky swatch alone).  
  **And** if the fill is still brand navy, **consider** a homepage-only **neutral `--page-canvas`** so the browser does not sample `#102135` into the chrome.

- **If** you change `--color-navy` globally  
  **Then** you must also update **critical inline** `html`/`body` in `BaseLayout` or you reintroduce **one-frame stutter** and chrome mismatch.

## Hero & viewport

- **If** the home **transparent** header must meet the **soft top edge** intent (photo + island read as one field)  
  **Then** prefer **`position: absolute`** over the hero — **`position: sticky`** on that row has repeatedly composited as a **flat slab** or **hard seam** against the photo in WebKit when combined with transforms/filters/pseudo “feathers.”

- **If** the transparent header is `position: absolute` over the hero  
  **Then** pull the hero paint box up with **negative `margin-top`** using **`var(--header-bar) + var(--header-safe-pad)`** (same optical intent as `-var(--header-h)` but **valid** inside outer `calc()` in WebKit — **`--header-h` is itself a `calc()`** and must not nest inside another `calc` sum). Keep **`.site-header--transparent`**: **`top: 0; width: 100%`**.

- **If** you want a **soft** edge without fake UI chrome  
  **Then** soften on **`.hero__media` / `.hero__scrim`** (gentle scrim, optional **neutral vertical placeholder** gradient behind the image while it loads) — **not** a second horizontal “feather” band on the **header** unless explicitly art-directed and QA’d on iPhone.

- **If** the hero must read “below” the worst part of **system** chrome  
  **Then** apply a **small initial scroll** (mobile only; **`~ min/max` on `innerHeight`** in the same family as `52–132px`), set **`--home-prescroll-y`**, **`history.scrollRestoration = 'manual'`**, and run the earliest script **after** `<meta name="viewport" … viewport-fit=cover>` so `innerHeight` / `visualViewport` are sane; keep **`--hero-inner-vh`** in sync for full-bleed height.

- **If** you pre-scroll  
  **Then** **re-budget** the same pixels into **hero min-height**, **hero media min-height**, **headline `padding-top`**, and **metrics `translateY`** so composition does not ride too high and the bottom does not look short.

- **If** pre-scroll exposes more of the **lower** crop  
  **Then** bump **home-only `scale()`** on the hero image slightly — but **only** when **not** `prefers-reduced-motion: reduce`.

## Motion & iOS quirks

- **If** `prefers-reduced-motion: reduce`  
  **Then** **do not** auto-scroll on load and **do not** stack extra transform overrides for “hero polish.”

- **If** `position: sticky` fails on iOS for a band you care about  
  **Then** remove **`overflow-x: hidden`** from intermediate flex wrappers (e.g. `.page`); keep horizontal clipping on **`html`** instead.

- **If** a **header-layer** decorative feather / tint reads as a **new** band on iOS  
  **Then** **delete** it or move softness into **hero-owned** layers (scrim / media placeholder); align **canvas + `theme-color`** and **pre-scroll payback** before adding new gradients.

## Navigation & density

- **If** information architecture groups “Services” and “About”  
  **Then** mirror that grouping in the header **and** reflect flat destinations in the footer list so mental models stay aligned.

- **If** a primary CTA would stack on the hero  
  **Then** move secondary actions to **header/footer**; hero keeps **one** primary story.

## Glass & degradation

- **If** `backdrop-filter` is unsupported  
  **Then** swap to **opaque** panel fills at similar luminance — never leave content unreadable on flat color.

## Content truth

- **If** imagery could be mistaken for completed client work  
  **Then** it does not belong in proof/gallery contexts — hero “atmosphere” only.
