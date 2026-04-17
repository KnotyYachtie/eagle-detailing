

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

**Problem we were solving**  
On phones and tablets, the **system browser UI** (time, URL bar, etc.) sits above the page. Users also perceived a **hard horizontal “band”**: either the browser chrome, the **brand-navy** page canvas, or the seam between those and the hero photo. We also removed a **light-blue hero top feather** overlay — it was meant to soften the seam but often read as **extra** banding on iOS. Luxury reads better when the **hero photograph owns the first impression** and the chrome feels intentional, not like a separate strip.

**What we did (and why)**

1. **Neutral page canvas + `theme-color` on the homepage**  
   - **Why:** Safari often blends `theme-color` with the **actual `html`/`body` background`**. If that background is **`#102135`**, the top strip can look **blue-navy** even when `theme-color` is neutral.  
   - **How:** `BaseLayout` accepts optional **`canvasColor`**. When set, it sets **`--page-canvas`** on `<html>` and mirrors the same value in the **critical inline** `html`/`body` styles so first paint matches `global.css` (`background: var(--page-canvas, var(--color-navy))`). Homepage passes **`canvasColor`** and **`themeColor`** together (e.g. `#050505`).

2. **Hero image visually starts under the transparent site header**  
   - **Why:** The header is `position: absolute` on the home hero, so it does not consume layout height; we still want the **photo** to read as continuous with the nav, not “starting an inch lower.”  
   - **How:** Homepage hero uses a **negative `margin-top: -var(--header-h)`** (scoped to `html[data-home-load-intro]`) so the hero’s paint box extends **behind** the transparent header. **`top: 0` + `width: 100%`** on `.site-header--transparent` keeps the bar pinned predictably.

3. **Trust strip as a deliberate dark “letterbox” (optional product choice)**  
   - **Why:** If a mid-page band feels “sticky” on scroll, lean into it: **near-black neutral** (`#050505` → `#0a0a0b` gradient) reads as **cinema chrome**, not leftover UI.  
   - **How:** `.trust.index-atmos` uses **`position: sticky; top: var(--header-h); z-index: 45`** (under the header at `50`). **Removed `overflow-x: hidden` from `.page`** (kept clipping on `html`) so **`position: sticky` works on iOS**.

4. **“Pre-scroll” — start slightly scrolled so the hero sits under the browser chrome**  
   - **Why:** A small **initial scroll** mimics the user nudging the page down so the **photo sits below** the worst part of the system chrome, without asking them to do it.  
   - **How (earliest possible):** A **one-line inline `<script>` in `<head>`**, immediately **after** `<meta name="viewport" …>`, so `innerHeight` is usable. It:  
     - computes `y` ≈ **`clamp(44px, 8vh, 120px)`**,  
     - sets **`document.documentElement.style.setProperty('--home-prescroll-y', y + 'px')`**,  
     - sets **`history.scrollRestoration = 'manual'`** (Safari likes to “restore” scroll to `0` and undo us),  
     - calls **`window.scrollTo(0, y)`**.  
   - **Follow-up:** `src/scripts/home-prescroll.ts` re-applies on **`load`** + **`requestAnimationFrame`** if Safari reset scroll.

5. **Compensate layout so typography doesn’t ride too high after pre-scroll**  
   - **Why:** Scrolling down moves content **up** in the viewport; we re-balanced the **hero headline block** and **metrics** so the composition matches intent.  
   - **How:** CSS uses **`var(--home-prescroll-y, 0px)`**: extra **`padding-top`** on `.hero__content`, **`translateY`** on `.hero__metrics`, and **added height** on `.hero` / `.hero__media` min-heights so the **bottom doesn’t look short**.

6. **Slightly stronger hero zoom on the homepage**  
   - **Why:** Pre-scroll reveals more of the **lower** part of the frame; a touch more **`scale()`** keeps edges feeling **full-bleed**.  
   - **How:** `html[data-home-load-intro] .hero__img` overrides inside **`@media not (prefers-reduced-motion: reduce)`** so reduced-motion users are not forced into extra transform.

**`prefers-reduced-motion`**  
The head script and module **skip** auto pre-scroll when the user prefers reduced motion (avoids surprise jumps).

**Where to look in code (for future agents)**  
- `src/layouts/BaseLayout.astro` — `canvasColor`, `themeColor`, critical CSS, **inline pre-scroll script**  
- `src/styles/global.css` — `--page-canvas` on `html`/`body`  
- `src/pages/index.astro` — hero bleed, metrics, trust strip, home-only image overrides  
- `src/scripts/home-prescroll.ts` — Safari scroll restore safety net  
- `src/components/Header.astro` — transparent header pinning

**Reality check**  
We **cannot** paint web content **under** the **native** iOS Safari chrome; we can only **align colors**, **scroll**, **extend into `safe-area-inset-top`**, and **compose** so the transition feels intentional.

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