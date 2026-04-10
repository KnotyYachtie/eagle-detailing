

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