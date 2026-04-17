# Components (behavior + rules)

## Site header

- **Default state**  
  - Sticky, **glass** (`backdrop-filter` + translucent navy), **bottom hairline**, fixed height **`var(--header-h)`**.

- **Transparent variant (hero pages)**  
  - `position: absolute`, **no** glass fill, **text/shadow** legibility treatments on links and wordmark.  
  - Brand mark switches to **inline SVG eagle** (`currentColor`) instead of raster — **reason:** crisp on any background.

- **Navigation model**  
  - **Grouped:** “Services” → Marine / Aviation / Automotive; “About” → Service area + Contact + (About page lives in group logic).  
  - **Flat items:** e.g. Projects.  
  - **Active route** styling is **tone shift to white**, not a loud pill.

- **Desktop (`≥961px`)**  
  - Submenus: **no card chrome** — text-only flyout, **hover + focus-within** bridge, **staggered** enter/exit.  
  - **Reduced motion:** stagger becomes **instant visibility**.

- **Mobile (`≤960px`)**  
  - Full-height **sheet** under header, **translate** open/close.  
  - **Services / About** become **accordion toggles** when sheet is open; **auto-expand** if current route is inside that group.

## Footer

- **Grid:** 1 column → **3 columns ≥720px** (brand / contact / explore).  
- **Micro-headings:** uppercase, **accent**, wide tracking — same language as contact cards.  
- **Explore** uses the **flat `NAV` list** so grouped header IA still resolves to **every destination**.

## Buttons

- **Primary (`.u-btn`)**  
  - Cream fill, **navy text**, uppercase, **sm** radius, **ease-out** hover to pure white fill.

- **Ghost (`.u-btn--ghost`)**  
  - Transparent, **cream border**, hover **slight white wash** — for secondary actions on dark bands.

- **Focus**  
  - **Accent** outline, **3px** offset — never remove; luxury still means usable.

## Eyebrow (`.u-eyebrow`)

- Always: **small caps**, **wide letter-spacing**, **accent** color, **tight margin** to following title.  
- **Rule:** one eyebrow per section max; it **names** the section, it does not persuade.

## Homepage domain cards

- **Shell:** subtle border, **soft blur** panel, **Camden-style clip** frame on hover (geometry animates, not color fireworks).  
- **Imagery:** two cards use **real crops**; third may be **placeholder** — parity is structural (card chrome), not forced fake photography.  
- **Motion in:** intersection observer + **delay** so intro copy leads the grid (`prefers-reduced-motion` → instant visible).  
- **Interaction (home):** click opens **FLIP overlay** “expand” (modal semantics) instead of immediate navigation — **reason:** cinematic preview without leaving page; **guard** modifier keys so power users still get native new-tab behavior.

## Trust strip (homepage)

- **When styled as letterbox:** near-black **neutral** gradient (not brand navy) + **sticky** under header.  
- **Copy:** short caps lines — **quiet** grounding, not a dashboard.

## Contact cards

- **Layout:** 1 → **3-up at `640px`**.  
- **Card:** bordered, **tinted navy wash** on `#0a1628` body band.  
- **Heading:** same **micro-heading** pattern as footer (accent, tracking).

## Process list (`.process-list`)

- **Two-column row:** fixed-width **strong** label + muted explanation — **scannable**, not paragraphic.

## Wave strip (component exists)

- **Rule:** infinite SVG wave layers are **optional** and **paused** when they compete with metrics legibility or hero clarity. If re-enabled: respect **`prefers-reduced-motion`** (motion off).
