

# Eagle Detailing — MVP Design System (v1)

## Core Direction
Cinematic Minimal Luxury — surface-focused, restrained, high-end.

We are not a detailing shop UI.
We are a precision service brand for high-value assets.

Primary signal:
→ control, restraint, surface perfection

---

## Brand Pillars (Design Translation)

**Luxury**
- Negative space
- Editorial typography
- Minimal UI

**Precision**
- Clean alignment
- Consistent spacing
- Controlled motion

**Three Domains (Marine · Aviation · Automotive)**
- One brand, one visual system — not three different microsites
- Same composition rules across imagery for every domain

---

## Visual Language

### Imagery
- Macro / surface-focused
- Gloss, reflections, curvature
- Controlled lighting (studio-style even outdoors)
- No busy environments

Subjects:
- Jet fuselage (reflection + curvature)
- Yacht hull (gloss + waterline)
- Automotive paint (gloss, curvature, tight crop)

Avoid:
- lifestyle scenes
- cluttered marinas
- people-heavy shots

---

### Composition Rules (CRITICAL)
All hero visuals must share:
- Same horizon / framing
- Same camera angle
- Same lighting intensity
- Same crop ratio

This enables seamless transitions.

**Mobile edges (default bias)**  
Where the layout meets **system chrome** (status bar, island, safe areas), prefer **soft transitions**: photography and **restrained** scrims lead; avoid **hard** horizontal UI slabs and avoid **stacking** decorative “feather” bands on the **header** unless art-directed and device-QA’d. Implementation detail lives in **Homepage hero — iOS / Safari** below.

---

### Color System
Primary (dark field / backgrounds):
- Deep navy / near-black — **canonical:** `#102135` (logo sample); compatible range `#0B1A2B`–`#102135`

Primary ink (type & marks on light backgrounds):
- `#072b53` (logo sample)

Secondary (type on dark):
- Off-white / cream — **canonical:** `#EFECE7` (logo sample); avoid pure `#FFFFFF` unless a specific lockup requires it

Accent:
- ONE tone only:
  - muted champagne OR
  - soft silver

Rules:
- No bright colors
- No neon
- No gradients everywhere

**Homepage canvas vs brand navy (engineering):**  
Brand backgrounds remain **`#102135`** (`--color-navy`) for most of the site. On the **homepage only**, we may set a **neutral near-black page canvas** (e.g. `#050505`) via `canvasColor` + `--page-canvas` so **`html` / `body` first-paint** matches **`theme-color`**. That reduces the iOS/Android browser chrome reading as an **inky navy band** when Safari samples or blends with the page background. It does **not** replace the brand palette for UI surfaces that intentionally use navy.

---

### Typography

Display (Headlines):
- High-end serif (editorial feel)

UI (Body):
- Clean sans-serif

Tone:
- Short
- Controlled
- Specific

Examples:
- "Precision Detailing for Yachts, Aircraft & Exceptional Automobiles"
- "Correction · Protection · Maintenance"

Avoid:
- hype
- fluff
- generic phrases

---

## Layout System

### Hero (Signature Section)

Full-bleed, minimal, cinematic.

**Visual:**
- Surface-based imagery across domains (jet · yacht · automobile) — same grading, framing, and crop language when multiple shots exist
- Subtle transition (slow lateral or crossfade) when using a sequence; **v1 may use a single static hero** if copy still names all three domains

**Content:**
- Headline (serif)
- Subhead (short)
- 1 primary CTA

**CTA (hero):**
- One primary on the hero (e.g. "Request a quote" → Contact, or "Call")

**Also site-wide (header/footer — not stacked on the hero):**
- Phone (click-to-call)
- Instagram (`@eagledetailingfl`)
- Email: `info@eagledetailing.com` (footer + Contact page)

**Rules:**
- No clutter on the hero
- No busy UI overlays on the hero
- **One** primary button on the hero; secondary actions live in chrome (nav/footer)

---

### Section 1 — Domain Entry

Three **co-equal** entry points (Home + top-level nav):
- Marine
- Aviation
- Automotive

Each links to its own page; visual weight on Home should feel **balanced**, not aviation- or marine-only unless photography temporarily favors one subject (copy must still signal all three).

Style:
- Minimal
- Image-backed or subtle background
- No glassmorphism (per restraint rules)

---

### Section 2 — Trust / Grounding

Keep subtle:
- "Serving South Florida"
- "Private Clients"
- "Fully Insured"

No loud stats grids.

---

### Section 3 — Gallery

- REAL images only
- Focus on surfaces
- Tight crops preferred

---

### Section 4 — Process

Short + structured:

- Inspection
- Correction
- Protection
- Maintenance

No long paragraphs.

---

### Section 5 — Contact

**v1 (current):**
- Phone-first + Instagram + **`info@eagledetailing.com`** (`mailto` / visible address)
- **No form submission backend** yet (no Formspree / API wiring) — add in a later pass when delivery is chosen

**Later:**
- Short quote form + provider (env-based endpoint)

Frictionless.

---

## Motion System

Principles:
- Slow
- Controlled
- Cinematic

NOT:
- bouncy
- flashy
- playful

Hero:
- scroll-linked transitions
- subtle movement only

---

## Homepage hero — iOS / Safari chrome & “pre-scroll” (implementation notes)

**Product bias (mobile)**  
Layouts should **lean toward a soft top edge** where possible: the photograph and a **gentle** scrim own the transition into the status bar / island — not a flat UI slab, not a hard horizontal “seam,” and not a second decorative bar that reads as *new* chrome.

**Problem we were solving**  
On phones, users perceived a **hard band** at the top: flat **page canvas** (`#050505`), **sticky** transparent header compositing, or **extra** header-layer gradients fighting WebKit. Separately, **brand-navy** `html`/`body` can tint Safari’s UI when sampled.

**Learnings (do not repeat the regression)**

1. **`theme-color` + `canvasColor` alone do not “feather” the edge.**  
   Matching or splitting meta vs canvas can help **toolbar tint**, but the **premium** read (hero bleeding under the Dynamic Island with a soft scrim) comes from **stacking**: transparent header **`position: absolute`** over the hero, hero **`margin-top`** pulling the paint box up, **`.hero__media`** bleeding with **`env(safe-area-inset-top)`**, and a **subtle** scrim — not from meta-tag-only experiments or `html`/`body` sky gradients alone.

2. **`position: sticky` vs `absolute` on `.site-header--transparent`.**  
   **`absolute`** prioritizes the **softest** top edge (photo composites cleanly under the island). **`sticky`** prioritizes **persistent** logo + nav while scrolling; use when product asks for it, then **re-QA** the top edge on a real iPhone. Avoid stacking **extra** header-layer gradients on sticky — those tended to read as a **hard band**.

3. **Soft edge = hero-owned, not header-owned.**  
   Prefer: **charcoal vertical gradient** on `.hero__media` while the image resolves (so the top is not raw `#050505`), **restrained** scrim (avoid stacking an aggressive **top** vignette on mobile *and* a separate header gradient). Avoid: painting another “feather” as a **sibling band** above the photo unless art-directed — it tends to read as **banding** on iOS.

4. **Do not “fix” sticky banding by setting `overflow-y: visible` on `.hero` unless you accept new scroll/overflow bugs.**  
   With an **absolute** header, the hero can keep **`overflow-y: hidden` / `clip`** as intended; upward safe-area bleed is visible without unclipping the whole hero.

5. **WebKit `calc()` trap:** **`var(--header-h)` is itself a `calc()`** — do **not** nest it inside another `calc(... + var(--header-h) + ...)`**. Use **`var(--header-bar) + var(--header-safe-pad)`** in outer `calc()` expressions (see `index.astro` + `global.css` home floors).

**What we did (and why)**

1. **Neutral page canvas + `theme-color` on the homepage**  
   - **Why:** Safari blends UI with the **actual `html`/`body` background**. Navy `#102135` can read as an **inky strip** if left as the default canvas.  
   - **How:** `BaseLayout` optional **`canvasColor`** → **`--page-canvas`** + critical inline match. Homepage typically passes **`canvasColor`** and **`themeColor`** together (e.g. both `#050505`).

2. **Hero image visually starts under the transparent site header**  
   - **Why:** The transparent header does not consume layout height; the **photo** should read continuous with the nav.  
   - **How:** Negative **`margin-top`** on the home hero using **`--header-bar` + `--header-safe-pad`** (not nested `var(--header-h)` inside `calc`). **`.site-header--transparent`**: **`position: absolute`**, **`top: 0`**, **`width: 100%`**.

3. **Trust strip as a deliberate dark “letterbox” (optional product choice)**  
   - Same as before: intentional **near-black** sticky strip under the header if product wants “cinema chrome.”  
   - **Layout:** keep **`overflow-x` off `.page`**; clip on **`html`** so unrelated stickies still work.

4. **“Pre-scroll” + `--hero-inner-vh`**  
   - Small initial **scroll** on **mobile only** (after `<meta viewport>`), **`--home-prescroll-y`**, **`history.scrollRestoration = 'manual'`**, **`visualViewport` / inner height** for **`--hero-inner-vh`** so the hero height tracks **chrome-aware** viewport.  
   - **`home-prescroll.ts`** repairs Safari scroll resets on **`load`**.

5. **Compensate layout for every prescroll pixel**  
   - **`padding-top`** on `.hero__content`, **`translateY`** on `.hero__metrics`, extra **min-height** on `.hero` / `.hero__media` (see narrow **`max-width: 768px`** clamps in `index.astro`).

6. **Homepage hero image scale**  
   - Slightly stronger **`scale()`** when motion is OK; skip for **`prefers-reduced-motion`**.

**`prefers-reduced-motion`**  
Skip auto pre-scroll and heavy transform polish.

**Where to look in code (for future agents)**  
- `src/layouts/BaseLayout.astro` — `canvasColor`, `themeColor`, critical CSS, inline home viewport + prescroll script  
- `src/styles/global.css` — `--page-canvas`, `--header-h` / safe-area tokens, `.page` shell  
- `src/pages/index.astro` — hero bleed, scrim, metrics, prescroll payback  
- `src/scripts/home-prescroll.ts` — scroll restore + `--hero-inner-vh`  
- `src/components/Header.astro` — **absolute** transparent home header

**Reality check**  
We **cannot** paint web content **under** the **native** iOS status bar; we **can** make the **hero** read continuous under it via bleed, scrim, and **absolute** stacking so the edge feels **soft** and intentional.

---

## What We Explicitly Avoid

- Pricing tables
- Service grids with icons
- "Add to cart" patterns
- Busy UI stacking
- Bright accent colors
- Overuse of cards

---

## AI Imagery Usage (Midjourney)

Allowed:
- Hero visuals
- Concept imagery
- Surface-focused scenes

Not allowed:
- Gallery / proof
- Anything implying real completed work

Rule:
AI = Atmosphere
Real = Authority

---

## MVP Build Priorities

1. Hero (core identity; photo-first, minimal motion)
2. Domain entry + pages: **Marine**, **Aviation**, **Automotive**
3. Contact surfaces (phone, IG, email) — **no form POST in v1**
4. Basic gallery (real images when available)

Everything else can come later.

**Optional embellishment (not required for v1):** CSS SVG wave divider (e.g. Goodkatz-style) between hero and next section — only if it stays subtle and respects `prefers-reduced-motion`.

---

## One Guiding Principle

If it feels like we're adding more…
we're probably going in the wrong direction.

Luxury = restraint.