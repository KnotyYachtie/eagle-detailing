# Design-system assumptions (with clarifying questions)

Each entry states something the current language **treats as true** without full proof. Answering the **question** would tighten what “cinematic minimal luxury” means in practice.

---

## Implementation & platform

1. **Assumption:** A **homepage-only** neutral page canvas (e.g. `#050505`) plus matching `theme-color` is the right tradeoff so system browser chrome does not read as **brand navy** sampled from `#102135`.  
   **Learning:** That pairing **reduces navy tinting** of UI chrome but does **not** by itself create a **feathered** hero under the island — compositing (**absolute** transparent header, safe-area bleed, scrim) does.  
   **Question:** Should **any** other routes (campaign landings, booking flows) ever get the same canvas override, or is **strictly home** a hard rule for brand recognition?

2. **Assumption:** **`theme-color` and first-paint `html`/`body`** should track **actual paint**, not an “aspirational” swatch that differs from what ships in CSS.  
   **Question:** Who owns the checklist when tokens change—**design** or **engineering**—so critical inline CSS and `global.css` never drift?

2b. **Learning (home hero / iOS, verified in implementation):** Aligning **`theme-color`** with canvas helps **browser UI sampling**, but it does **not** replace **layout compositing** for a soft top edge. **`position: sticky`** on the transparent header **plus** extra header-layer gradients regressed toward a **hard band**; **`position: absolute`** + hero-owned softening restored the **feathered** read. **Sticky** is valid when **persistent nav** is the priority—then **re-QA** top-edge on **notch + Dynamic Island** and avoid stacking synthetic header feathers.  
   **Question:** Per route, do we default to **softest top** (`absolute`) or **sticky chrome**—or do we **document the choice** per major template (home vs interior)?

3. **Assumption:** **Pre-scroll** magnitude (`~ clamp(44px, 8vh, 120px)`) is a **good enough global default** without per-device tuning in v1.  
   **Question:** Which **reference devices** (e.g. iPhone 14 Pro, SE, iPad mini) should define “golden” hero composition so scroll distance can be tuned intentionally?

4. **Assumption:** A possible **single-frame flash** before pre-scroll applies on some WebKit builds is an **acceptable** cost versus scrolling later (worse perceived hero).  
   **Question:** Is **any** visible first-frame jump unacceptable for brand perception, or is “mostly invisible” the bar?

5. **Assumption:** **`history.scrollRestoration = 'manual'`** plus **`load` + `requestAnimationFrame`** repair in `home-prescroll.ts` is **sufficient** for Safari undoing scroll.  
   **Question:** Have we observed **failure modes** (e.g. back-forward cache, low-power mode) that would require a different strategy?

6. **Assumption:** **Every pixel** of pre-scroll is **re-invested** in min-heights, content `padding-top`, metrics `translateY`, and optional image `scale()` so composition stays intentional.  
   **Question:** Should **image scale** be capped or art-directed per **hero asset** so we never crop “wrong” detail for the sake of bleed?

7. **Assumption:** **`prefers-reduced-motion: reduce`** users should get **no** auto pre-scroll and **no** extra hero transform polish—calm beats parity of “first paint.”  
   **Question:** For reduced motion, do we still owe the **same informational hierarchy** (e.g. metrics visibility) without scroll, meaning **layout-only** compensation?

8. **Assumption:** **`overflow-x: hidden` on `html` but not on `.page`** is the stable pattern for **horizontal clip + working iOS sticky**.  
   **Question:** Are there **future** full-bleed horizontal patterns (carousels, maps) that would force a different overflow contract?

---

## Glass, depth, and restraint

9. **Assumption:** **Subtle blur** on domain cards is **“controlled depth”** and still within “minimal luxury,” even where written guidance once said **no glassmorphism** for domain entry.  
   **Question:** Is the line **“blur allowed only when it improves legibility at a boundary”** or **“no blur on marketing panels at all”**?

10. **Assumption:** If blur is **only decorative**, **solid** panels + shadow are preferred over glass.  
    **Question:** What **measurable** test defines “only decorative” (contrast ratio over a busy photo vs over flat navy)?

11. **Assumption:** **Trust strip “letterbox”** should read as **cinema chrome** using **near-black neutrals**, not **brand navy**, when promoted to sticky.  
    **Question:** Should any brand-tinted strip ever appear **between** hero and content, or must that transition always stay **neutral-to-navy**?

---

## Hero, CTA, and chrome

12. **Assumption:** The hero carries **one primary story**; secondary actions belong in **header/footer**, not stacked on the hero.  
    **Question:** With the hero CTA **sometimes absent in markup**, is **“no hero button”** an allowed shipped state, or must v1 **always** ship one primary CTA?

13. **Assumption:** **Transparent header** over hero requires **negative `margin-top: -var(--header-h)`** so photography **continues under** the nav.  
    **Question:** Is there a **minimum** safe legibility standard (contrast over **which** hero grades) for links on transparent chrome?

14. **Assumption:** **Wave / SVG motion** between hero and body is **optional** and should stay **paused** when it competes with metrics or clarity.  
    **Question:** Is the wave **ever** part of brand recognition (logo-level), or permanently **nice-to-have**?

---

## Layout, grid, and type

15. **Assumption:** **`.u-container` max ~1120px** is the correct reading width for this brand’s editorial mix.  
    **Question:** Should **long-form** (e.g. future case studies) ever break out to a **wider** measure, or stay inside the same container?

16. **Assumption:** Interior pages use a **flat `#0a1628` body band** after the page hero to separate “air” from structured content.  
    **Question:** Is `#0a1628` a **canonical token** (named in the system) or an allowed **one-off**—should it merge with navy scale?

17. **Assumption:** **Butler** for the **home hero H1** and **Playfair** for display elsewhere is a **stable** split.  
    **Question:** Is that split **homepage-only forever**, or should **campaign** heroes ever use Butler on inner routes?

18. **Assumption:** **Eyebrows** only **label** sections; they never carry the persuasive thesis.  
    **Question:** Who enforces that in copy—**brand**, **web**, or both—and what happens if marketing wants a longer “eyebrow”?

19. **Assumption:** **Domain grid** stays **three equal columns** at `≥640px` even when photography temporarily favors one vertical.  
    **Question:** Is **copy-only** balancing enough, or do we ever allow **temporary** visual emphasis (e.g. launch vertical) without breaking parity?

---

## Navigation, IA, and motion

20. **Assumption:** **Grouped** header nav (Services / About) **plus** **flat** footer `NAV` is the correct pairing for mental models.  
    **Question:** Should footer someday **mirror** groups visually, or is **flat + complete** always the rule?

21. **Assumption:** **Active route** styling is a **tone shift toward white**, not a pill—quiet luxury over app patterns.  
    **Question:** Has **accessibility / wayfinding** been validated for color-blind users with that subtlety?

22. **Assumption:** **Desktop breakpoint `≥961px` / mobile `≤960px`** for nav behavior is final for v1.  
    **Question:** Should **tablet landscape** ever get a **third** interaction model (e.g. visible subnav)?

23. **Assumption:** **Home-only** domain card **expand overlay** (vs immediate navigation) is the right cinematic trade; modifier keys preserve native open-in-new-tab.  
    **Question:** On repeat visits, does **overlay-first** feel **slow**—should there be a “skip preview” or direct-link pattern?

24. **Assumption:** **Staggered** submenu motion on desktop reads as **luxury**; reduced motion users get **instant** appearance.  
    **Question:** Is **instant** for reduced motion identical to **no animation at all**, or should we still allow **opacity** fades that are not spatial?

---

## Content, proof, and contact

25. **Assumption:** **Hero imagery** may be **atmospheric** (including AI) while **gallery** remains **real work only**.  
    **Question:** Where exactly does **“proof”** start—Projects page, Instagram embed, PDF—so the **AI = atmosphere / Real = authority** rule cannot be misread?

26. **Assumption:** **Composition rules** (shared horizon, angle, lighting, crop) across domain heroes are **achievable** with future real shoots.  
    **Question:** Until then, is **single static hero** (per design.md) the official stance, or is **imperfect multi-domain** rotation acceptable?

27. **Assumption:** **v1 contact** without a form—**phone-first**, email, Instagram—is intentional and not a conversion liability for this clientele.  
    **Question:** What **signal** (analytics, call volume) would trigger prioritizing a **short quote form**?

28. **Assumption:** **Trust copy** stays **quiet** (no loud stat walls); subtle lines are enough credibility.  
    **Question:** Are there **hard proof** elements (license numbers, years in business) that must appear **above the fold** for legal or sales reasons?

---

## Global UX details

29. **Assumption:** **Hiding scrollbars** while keeping `overflow-y: scroll` avoids layout jitter when chrome shows/hides.  
    **Question:** Is **scrollbar-free** acceptable for **all** audiences, or do we need a **system preference** fallback for discoverability?

30. **Assumption:** **Smooth scroll** globally is on-brand; it is disabled when reduced motion is requested.  
    **Question:** Should **in-page anchor** jumps (e.g. future FAQ) use **instant** jump for precision even when smooth scroll is on?

---

## Meta (documentation)

31. **Assumption:** **`docs/design-system/`** and **`documentation/design-system/`** may coexist during migration; principles should not fork silently.  
    **Question:** Which path is **canonical** for humans and for AI prompts going forward?
