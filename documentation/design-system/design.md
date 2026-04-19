

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

### Gradients & hero scrims (policy)

**Ownership** — Gradients that touch the **hero photograph** live on **hero-owned** layers only: **`.hero__media`** (placeholder ramp while the image resolves) and **`.hero__scrim`** (readability + depth over the image). Do **not** add extra top “feathers” on the **site header**; WebKit often reads that as a **second** hard band.

**Brand kit** — Bottom vignette **strength and color** are judged against the **same** kit as the rest of the site (navy field, cream type, champagne accent, `#050505` canvas—see **Color system** and `global.css` tokens). The hero asset grade and the kit should reinforce each other; if they clash, **retune the asset or the scrim stops**, not ad-hoc hues outside the palette.

**Default stack (reference implementation: `src/pages/index.astro`)**  
1. **`.hero__media` `background`** — charcoal **vertical** ramp so the top edge is softer than flat canvas while the image loads.  
2. **`.hero__scrim`** — **vertical** darken for headline / metrics legibility.  
3. **Optional horizontal layer on `.hero__scrim`** — use **only** when the frame is **asymmetric** or **materially light** on one side (bright sky, strong one-sided reflection). **Omit** the horizontal pass when the image is **symmetric** or **already dark** enough that detail is not fighting a hot side.

**Tablet** — Policy is **mobile-first** QA (iPhone + common Android). **Tablet inherits** the same CSS until a dedicated tablet pass is scheduled (“good enough” by explicit decision).

**Hero asset checklist (ship / swap hero still)**  
- [ ] **Composition:** still matches **Composition rules** (horizon, angle, lighting, crop).  
- [ ] **Exposure:** no blown storytelling highlights; no mud where the eye should read detail.  
- [ ] **Horizontal scrim gate:** symmetric or globally dark → **off**. Asymmetric or one-sided hot → **on**; tune or mirror stops to the frame.  
- [ ] **Vertical ramp + vignette:** defaults unless this asset has a **documented** art-direction exception.  
- [ ] **Device QA:** safe-area + island; metrics and headline legible.  
- [ ] **Brand pass:** vignette compared to kit swatches—must feel **luxury**, not heavy filter.

**Brand kit in the repo (efficiency)** — Treat **`documentation/design-system/design.md` → Color system** plus **`src/styles/global.css` `:root`** as the **canonical token list**. Optional **Figma / PDF** “brand kit” link: add **one** pointer file (e.g. `documentation/brand-kit.md` with URL only) when available—avoid duplicating long palettes across many markdown files.

**`prefers-reduced-motion: reduce` (gradients)** — **Static** gradients and scrims **stay** for legibility. What **stops** is **time-based** hero treatment: auto pre-scroll, blur/opacity **animations**, and related transform choreography (see `index.astro` + `home-prescroll.ts`). **Invariant:** do **not** animate gradient stop positions or scrim opacity over time—that reads as instability, not accessibility. If a future effect needs motion, prefer **opacity on discrete UI** that is not the global scrim.

**Interior pages & future photo bands** — Recipe is **home-reference**: neutral **placeholder** on the media layer + **scrim** with the **same horizontal inclusion rule**. Until a second template exists, code may live only on `/`; when another full-bleed photo band ships, **extract shared CSS** (partial or tokens) so stops do not fork. This section remains the **spec**; implementation should converge to **one** maintainable stack.

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
- No **ad-hoc** gradients on random UI chrome — structured ramps only on **documented** surfaces (hero `.hero__media` / `.hero__scrim`, atmosphere sections such as `.index-atmos`, approved cards)

**Page canvas vs brand navy (engineering):**  
Brand backgrounds remain **`#102135`** (`--color-navy`) for **surfaces** (sections, cards, bands). **First-paint** **`html` / `body`** and **`theme-color`** default to **neutral near-black `#050505`** site-wide via **`BaseLayout.astro`** (`canvasColor` / `themeColor` defaults; override per page when needed). That reduces iOS/Android browser chrome reading as an **inky navy band** sampled from the page. It does **not** replace the brand palette for UI that intentionally uses navy.

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

### Typography tokens (approved direction — Apr 2026)

**Goal:** Move from **bespoke `clamp()` per block** toward a **small set of CSS variables** on `:root` in `global.css` (e.g. `--type-display-lg`, `--type-ui-sm`, `--type-hero-title`, `--type-metric-value`, `--type-metric-label`, `--type-nav-link` / mobile variants). **Families stay** as today: `--font-display` (Playfair), `--font-hero` (Butler for home H1), `--font-ui` (DM Sans).

**Migration:** replace literals in `index.astro` and components **incrementally** when touching a section—no big-bang required.

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
- **v1:** **No primary CTA button on the hero** — domain text links + metrics carry exploration; a hero button is optional later if product wants it. Rationale: avoid “skip the curated story, contact me now” tackiness.

**CTA (hero) — optional later:**
- If added someday: at most **one** primary (e.g. “Request a quote” → Contact, or “Call”); never stack multiple hero CTAs.

**Also site-wide (header/footer — not stacked on the hero):**
- Phone (click-to-call)
- Instagram (`@eagledetailingfl`)
- Email: `info@eagledetailing.com` (footer + Contact page)

**Rules:**
- No clutter on the hero
- No busy UI overlays on the hero
- **v1:** **No** hero primary button; secondary / contact actions live in **chrome** (nav/footer) and in sections below
- If a hero button returns later: **one** primary only; secondary actions stay in chrome

---

### Section 1 — Domain Entry

Three **co-equal** entry points (Home + top-level nav):
- Marine
- Aviation
- Automotive

Each entry should feel **balanced** across Marine / Aviation / Automotive (copy must signal all three even if one photograph leads visually). **IA (exploring):** may stay **multi-route** or move toward **one-page** nav → **in-page sections** (`#marine` / `#aviation` / `#automotive`) — decide before locking nav behavior.

**Glass / depth:** **Glassmorphism is not banned** — when it reads **high-end** (legibility, restraint, token-bound blur/rim), it is in play. Domains are the **next** surface to prove that recipe; avoid gratuitous frosted “app chrome” that fights photography.

**Inspiration (non-binding — browsing):** **Gulfstream-style** editorial bands — **one full-width section per domain**, split layout: **layered / offset photography** (tall plate + overlapping square, or similar) for depth **without** requiring frosted glass; **quiet headline** + short body + **single ghost CTA** (“Watch video” / “A closer look” analog) if product wants one soft action per domain. Eagle palette stays **navy / cream** or **dark field + light type** per brand; do not copy Gulfstream copy or marks. If you commit reference screenshots for the team, put them under e.g. **`documentation/design-system/references/`** (not shipped to `public/`).

Style:
- Minimal, spacious, **editorial** (magazine-like negative space)
- **Photography-led** — overlap and crop as a deliberate composition tool
- Glass **optional** per **Glass / depth** above — not required for this Gulfstream direction, which leans on **image layering** instead

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

### 6 — What we allow (normative)

- **Discrete choreography** on **high-value surfaces** only (e.g. home hero **load intro**: opacity, short **`translateY`**, optional **blur** settle — already gated in code).  
- **Image** transitions: slow **crossfade** or **lateral** drift between hero frames when a sequence exists; **static** hero is always valid.  
- **Layout compensation** tied to **one** known behavior (pre-scroll, safe-area) — not decorative scroll storytelling.  
- **`prefers-reduced-motion: reduce`:** drop **time-based** animation and auto pre-scroll; keep **static** scrims/gradients for legibility (see gradients policy above).

### Parallax (not ruled out — scope it)

**Parallax** means **scroll position drives one or more layers at a different rate than normal document scroll** (e.g. background moves slower than foreground). It remains **on the table** when **product** wants depth—just not as a **default** site-wide gimmick.

If we add it, prefer:

- **One bounded surface** (e.g. hero **only**, or **one** atmospheric band), not every section.  
- **Subtle** deltas (small `translateY` range, no scroll-linked **blur** / **rotate** stacks unless art-directed).  
- **`prefers-reduced-motion: reduce`:** **static** composition or **no** scroll-linked offset—JS-driven parallax must **explicitly** disable, not only CSS keyframes.  
- **Performance:** minimize listeners, prefer **`transform` + `will-change` sparingly**, QA on a mid-tier phone; avoid fighting the main thread during hero image work.

### What “gratuitous parallax everywhere” would entail (avoid this pattern)

**Gratuitous** means applying scroll-linked depth **across sections** (hero, mid-page bands, footer) or stacking **extra** effects on each scroll tick: **scale**, **rotate**, **blur tied to `scrollY`**, **sticky “reveal”** choreography on every block.

That style usually implies:

- **Many** `transform` / `filter` updates per frame from a **single scroll listener** or several competing observers → jank on mid-tier phones, **main-thread** contention with image decode and WebKit compositing.  
- **Constant motion** while the user is trying to **read** — the default read should stay **still** until something *earns* attention.  
- **Broken expectations** for **`prefers-reduced-motion`**: turning off CSS keyframes does not fix **JS-driven** scroll parallax unless every path is explicitly disabled — easy to ship half-accessible.  
- **Visual noise** that reads **template / SaaS marketing**, not **editorial restraint**.

**Default ceiling (until product expands):** one **restrained** hero intro + **static** typography elsewhere; **optional** scoped parallax only where the checklist above is satisfied.

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

1. **Neutral page canvas + `theme-color` site-wide**  
   - **Why:** Safari blends UI with the **actual `html`/`body` background**. Navy `#102135` can read as an **inky strip** if left as the default canvas.  
   - **How:** **`BaseLayout.astro`** defaults **`#050505`** for first-paint fill + **`theme-color`**; optional **`canvasColor`** / **`themeColor`** override per route. **`--page-canvas`** must stay aligned with critical inline CSS.

2. **Hero image visually starts under the transparent site header (home only)**  
   - **Why:** The photograph should read continuous with the nav.  
   - **How:** Negative **`margin-top`** on the home **`section.hero`** using **`--header-bar` + `--header-safe-pad`** (not nested `var(--header-h)` inside `calc`). **`.site-header--transparent`** is **`position: sticky`** in **`Header.astro`** today; use **`position: absolute`** when a template needs the **softest** seam (see **Learnings** §2).

3. **Trust strip as a deliberate dark “letterbox” (optional product choice)**  
   - Same as before: intentional **near-black** sticky strip under the header if product wants “cinema chrome.”  
   - **Layout:** keep **`overflow-x` off `.page`**; clip on **`html`** so unrelated stickies still work.

4. **“Pre-scroll” + `--hero-inner-vh` (default routes)**  
   - When **`data-home-load-intro`** is on `<html>` (default): small initial **scroll** on **mobile only** (after `<meta viewport>`), **`--home-prescroll-y`**, **`history.scrollRestoration = 'manual'`**, **`visualViewport` / inner height** for **`--hero-inner-vh`**. **`main.page__main`** min-height floor is **site-wide**; hero-specific height payback stays in **`index.astro`**.  
   - **`home-prescroll.ts`** (loaded from **BaseLayout**) repairs Safari scroll resets on **`load`**.

5. **Compensate layout for every prescroll pixel (home hero)**  
   - **`padding-top`** on `.hero__content`, **`translateY`** on `.hero__metrics`, extra **min-height** on `.hero` / `.hero__media` (see **`index.astro`**).

6. **Homepage hero image scale**  
   - Slightly stronger **`scale()`** when motion is OK; skip for **`prefers-reduced-motion`**.

**`prefers-reduced-motion`**  
Skip auto pre-scroll and heavy transform polish.

**Where to look in code (for future agents)**  
- `src/layouts/BaseLayout.astro` — defaults, `canvasColor`, `themeColor`, critical CSS, inline viewport + prescroll script, **`initHomePreScroll()`** script  
- `src/styles/global.css` — `--page-canvas`, `--header-h` / safe-area tokens, **`html[data-home-load-intro]`** `main` floor, `.page` shell  
- `src/pages/index.astro` — hero bleed, scrim, metrics, prescroll payback, load choreography  
- `src/scripts/home-prescroll.ts` — scroll restore + `--hero-inner-vh`  
- `src/components/Header.astro` — transparent header (**`sticky`** today; **`absolute`** when a template opts in for max softness)

**Reality check**  
We **cannot** paint web content **under** the **native** iOS status bar; we **can** make the **hero** read continuous under it via bleed, scrim, and intentional stacking (**`sticky`** by default; **`absolute`** when softness beats persistent header compositing).

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