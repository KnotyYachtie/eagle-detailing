# Design-system assumptions (with clarifying questions)

This file is a **working lab**: hypotheses, tradeoffs, and open questions that **evolve** each time we ship a design instance (layout, motion, chrome, typography, etc.) and you confirm the outcome. **Nothing here is a hard boundary by default**—treat entries as **soft guides** until they are **promoted** into the **design backbone** (see below).

**Design backbone** (harder contracts, after you ask to codify): `documentation/design-system/design.md`, `documentation/design-system/principles.md`, `docs/design-system/*.md`, and stable **code** defaults (`BaseLayout.astro`, `global.css`, shared components). Promotion happens only when you explicitly say to **code an assumption into the backbone** and confidence is **High** for that material.

**How we use confidence:** After each iteration, update affected bullets **and** the confidence tag for that section. **Low** = exploratory; **Medium** = current direction until the next pass; **High** = validated in implementation / device QA and ready for backbone promotion when you give the word.

**Cursor rule:** `.cursor/rules/design-assumptions-confidence.mdc` — **`alwaysApply: true`**, so it applies to **the whole repo** (components, CSS, layouts, not just this folder). The design-system paths are where **assumptions** and **backbone** docs usually live.

**Skimming convention:** Every numbered **canonical** item, every **owner** subsection, every **implementation** numbered item, every **residual** bullet, and every **assumption** (9–31) includes a ***Plain English:*** line—same idea in everyday words so you can scan without parsing jargon.

---

## Confidence scale (quick reference)

| Level | When to use |
|-------|----------------|
| **Low** | Open questions, competing options, or copy that will likely change on the next design pass. |
| **Medium** | Agreed direction for the current era of the site; still revisable when you green-light a new instance. |
| **High** | Matches shipped behavior or repeated device QA; eligible for backbone codification **when you request it**. |

---

## Canonical decisions (implementation mirror — Apr 2026)

**Confidence: High** — Describes **what the repo actually does today** (`BaseLayout`, critical CSS, header defaults). If code changes, **update this section in the same PR** so the mirror stays true. High here means “accurate snapshot,” not “never change product.”

These mirror **`src/layouts/BaseLayout.astro`** and owner direction: **common mobile iOS/Android** get **visual + technical continuity** with home; **tablet** is explicitly “iterate later / good enough.”

*Plain English (whole section):* This block is “what the code does today” for the shared page frame—phones should feel like the same family as the homepage; we polish tablets when we get to it.

1. **Site shell defaults** — `transparentHeader={true}`, `dataHomeLoadIntro={true}`, default **`theme-color`** and first-paint **`#050505`** canvas (`criticalCanvas = canvasColor ?? '#050505'`). Per-page **opt-out:** `transparentHeader={false}` and/or `dataHomeLoadIntro={false}`.  
   *Plain English:* By default the site uses a see-through top bar, the home “viewport shell” behavior, and a very dark gray (almost black) behind the page so phone browser chrome does not pick up random colors. Any page can turn those off if it needs a different look.

2. **`data-home-load-intro` on `<html>`** (default on) — Enables: (a) inline head script → **`--hero-inner-vh`** from `visualViewport`, mobile **`--home-prescroll-y`** + initial scroll (skipped when `prefers-reduced-motion: reduce`); (b) **`global.css`** min-height floor on **`main.page__main`**; (c) **`initHomePreScroll()`** loaded once from **BaseLayout** (not duplicated in `index.astro`). **Hero load choreography** (blur intro, metrics, header fade) stays **only in `src/pages/index.astro`** and only affects elements that exist on `/`.  
   *Plain English:* A flag on the root of the page turns on “real phone height,” a tiny initial scroll on small screens (unless the user asked for less motion), a safety net so the main column is tall enough, and a script that fixes Safari scroll quirks. The fancy fade-in timing for the home hero still lives only on the homepage file.

3. **Header chrome** — Default **`transparentHeader={true}`**: **transparent** sticky bar + **vertical brand lockup** (`assets/branding/logo-lockup-transparent.png`) over hero photography — **no** `logo-light.png`. **`--header-bar`** on desktop tracks lockup height (`--header-lockup-w` × 935/1024 + chrome pad) so hero underlap stays flush to the viewport top; logo and nav share one row (`align-items: center`). **`transparentHeader={false}`** (e.g. `/contact`): **flat** `#050a14` bar — same PNG lockup. **Favicon:** eagle mark on **`#102135`** (`logo-eagle-transparent.png` composited in `public/favicon*.png` + `favicon.ico`); not the full text lockup at 32px. **`SITE.faviconVersion`** cache-bust on all icon links; **`favicon.svg` removed**.  
   *Plain English:* Header uses one stacked transparent logo image beside the nav on the same line; hero photo pulls up under the bar using the same height math as the logo; tab icon is a crisp eagle on navy.

4. **Mobile nav tap** — **System** WebKit tap dimming is suppressed via **`-webkit-tap-highlight-color: transparent`** on `.site-header__link`; **cream → white** on **`:hover` / `.is-active`** remains the intentional light feedback.  
   *Plain English:* Tapping a link on iPhone does not flash the ugly default gray box; instead you only see our deliberate lightening when you tap or open a menu item.

5. **Site footer (`Footer.astro`)** — **Responsive CSS Grid**: **desktop (`≥1024px`)** four columns — brand (**PNG** eagle + text lockup from `assets/branding/`, **`SITE.tagline`** for automotive secondary line, **Instagram** + **`SITE.googleReviewsUrl`** with `assets/google-maps.png`), **Explore** (`NAV_SERVICES` + `NAV_MAIN` only), contact (`tel` / `mailto` / locality), **Get started** (`/contact` + `sms:` secondary); **tablet (`768–1023px`)** `2×2` areas (`brand | cta` / `explore | contact`); **mobile (`<768px`)** stacked **brand → CTA → Explore (two-column link grid) → contact**, **column content horizontally centered** (`text-align`, flex/grid alignment); then **bottom legal** row centered on narrow viewports, **`≥768px`** legal uses row layout (`©` vs locality + licensed). Footer background is **flat** `var(--footer-bg)` (no gradient overlays). **Business name:** `SITE.shortName` = **Eagle Detailing Yacht & Aircraft Care**; legal **`SITE.name`** includes LLC; automotive emphasized via **`SITE.tagline`** and nav, not the primary name string.  
   *Plain English:* Footer matches the new logo art; the tagline under the mark mentions automotive so yacht/aircraft stay primary in the name; copyright uses the full legal LLC name.

6. **Service vertical shell (`ServiceEditorialPage.astro`)** — **`/marine`**, **`/automotive`**, and **`/aviation`** share one editorial layout (**`marine-page`** wrapper + hero stack + chapters + featured strip + quote + services grid + reach form) and one **`SERVICE_EDITORIAL_SHELL_COLORS`** pair in **`src/site.ts`** (`themeColor` / `canvasColor`, currently **`#0a1118`**) passed into **`BaseLayout`** with **`transparentHeader={true}`** and **`dataHomeLoadIntro={true}`**. **Marine** supplies imagery (parallax hero, chapter photos, Flowbite carousel, inline eagle SVG) and a **`services-rows`** slot with the full icon list. **`/aviation`** passes **`heroParallax`** from **`assets/aviation/jethero3.png`**, **`chapterLeftImage`** from **`assets/aviation/prop1.jpg`**, **`chapterRightImage`** from **`assets/aviation/prop2.jpg`**, **`carouselImages`** from **`assets/aviation/carousel/carousel1.png` … `carousel5.png`** (numeric order), aviation **`services-rows`** markup (Exterior / Interior sections), **`eagleSvgHtml`** from **`assets/eagle.svg`** (same watermark treatment as **`/marine`** services column), and the same Rellax hero stack as Marine. **`/automotive`** passes **`heroParallax`** from **`assets/automotive/car5.png`**, **`chapterLeftImage`** from **`assets/automotive/car3.png`**, **`chapterRightImage`** from **`assets/automotive/c2.png`**, and **`carouselImages`** from **`assets/automotive/carousel/c1.png`**, **`c2.png`**, **`c4.png`**, **`c5.png`**, **`c6.png`** (chronological set with **`c3.png`** intentionally removed); automotive services now use finalized copy + seven-row list and pass **`eagleSvgHtml`** from **`assets/eagle.svg`** with centered vertical alignment in the services split. **`editorialVertical="automotive"`** (**`marine-page--automotive`**) keeps **`object-position: 100% 0%`** with desktop **Rellax** **`top: -10%` / `bottom: -10%` / `min-height: 120%`** (lighter bleed than Marine/Aviation **`−24%` / `148%`**) and reduced-motion **`transform-origin: top right`**. Remaining Automotive sections (e.g., quote/reach refinements) can continue to evolve as copy/assets finalize. **`marine-reach-form.ts`** binds every **`form[data-eagle-service-reach]`** and reads **`data-reach-subject-prefix`** for Web3Forms subjects.  
   *Plain English:* Same template and navy chrome on all three routes; Marine is photo-complete, Aviation matches Marine’s services eagle watermark plus hero/chapters/carousel/list; Automotive now has real chapter 1 + chapter 2 images, a five-image carousel with `c3` removed, and a finalized services list with the eagle watermark centered.

---

## Owner decisions (recorded — Apr 2026)

**Confidence: Medium** for the block as a whole — product and UX policy you have signed off once; **revisit** (and bump up or down) whenever a new hero, nav, or motion pass ships. Individual bullets can move to **High** after repeated QA or explicit backbone promotion.

*Plain English (whole section):* Below is “what we agreed we want” for hero, type, nav, motion, AI docs, file formats, and engineering process—not the same thing as “already copied into every long spec doc.”

### 3 — Hero metrics vs copy when the viewport is impossibly short

- **Last resort clip:** Only **additive** chrome—something a user would not miss if absent. **Hero metrics** are in that bucket; **headline + domain links** are not.  
- **Density rule:** Prefer packing the **intended** set of elements so they **compress** (tighter gaps, token-bound `clamp()` sizing) and still fit on **≥ ~80% of common mobile viewports**, so clipping is rare.  
- **Stacking (code):** `.hero__content` paints **above** `.hero__metrics` when layers meet (`z-index` in `index.astro`).  
- *Plain English:* On a very short phone screen, if something has to get cut off, let it be the small stats strip—not the headline or the three domain links. Prefer squeezing spacing and type so that rarely happens; if copy and stats overlap, the words sit on top.

### 4 — Typography

- **Direction:** **Tokenize** font sizing in **`global.css` `:root`** (named roles: display, UI body, hero H1, metric num, metric label, nav caps, etc.) and **migrate** scattered `clamp()` values in `index.astro` / components toward those variables over time—no requirement to finish in one PR.  
- *Plain English:* Stop hard-coding font sizes in random files; give each role a shared variable on the stylesheet root and switch pages over gradually.

### 5 — Nav over photography

- **Contrast:** **Luxury legibility + device judgment** over strict **WCAG AA** on transparent nav over busy photography (acknowledged trade common in high-end marketing surfaces).  
- **Mobile submenus:** **In-flow** reflow (labels never covered by the submenu row); **layout shift** is the accepted trade vs overlap.  
- *Plain English:* We eyeball nav readability on real photos instead of chasing a textbook contrast score. On phones, opening a submenu pushes content down so nothing hides under the menu; a little jump is OK if nothing is unreadable.

### 6 — Motion

- **Normative detail** lives in **`design.md` → Motion System** (allowed hero intro, `prefers-reduced-motion`, gradient invariants). **Parallax is not ruled out** — document **scoped** use (surface, subtlety, reduced-motion, perf); avoid **gratuitous** multi-section scroll-linked stacks (risks: jank, half-accessible JS paths, noisy visual read).  
- *Plain English:* Motion stays slow and rare—mainly the home hero settling in. Fancy scroll effects everywhere are discouraged but a small, tasteful depth effect in one place is still allowed if we design and test it.

### 7 — Agent-facing documentation (content boundaries)

- **Never** in prompts or generated copy: **secrets** (API keys, private credentials), **unpublished client PII**, or **fabricated** claims not in approved source.  
- **OK:** **Public** contact and URLs already in `src/site.ts`, **token names**, **file paths**, **“change these variables”** anchors, and **patterns** copied from this repo.  
- **Marketing prose:** agents should **reuse** approved strings from `site.ts` / shipped pages—not invent new taglines in automation.  
- *Plain English:* AI helpers must not leak secrets, make up clients, or invent new marketing lines—they should copy what the site already says and only describe how the code is wired.

### 8 — Machine-readable spec

- **Default:** one **Markdown** doc set with optional **fenced `yaml` / `json` “spec” blocks** for tokens and breakpoints until a separate file is consumed by tooling.  
- **Split files** (`tokens.json`, etc.) only when **CI or another app** reads them—avoid two sources of truth without a generator.  
- *Plain English:* Keep design numbers in Markdown (maybe in little code blocks) until a robot or build step really needs a separate JSON file—then generate that file so we do not maintain two conflicting lists.

### Home hero CTA (v1)

- **No primary CTA button** on the home hero — headline, **domain text links**, and **metrics** only. Contact paths remain **header / footer** and **below-the-fold** sections. **Rationale (owner):** avoids “do not read my site—contact me now” tackiness; invites **curated** exploration first. A hero button may return later if product changes mind.  
- *Plain English:* The big photo area does not get a “Request a quote” slab; people use the nav, footer, or scroll to reach you.

### Domains & glassmorphism (direction)

- **No blanket ban** on glass / frosted treatments. **Goal:** implementations that feel **luxury-appropriate** (token-bound blur, rim, luminance), especially at **boundaries** between photo and UI. **Domains** are the **next** section to nail as the reference “done right” glass (or hybrid glass + solid) — seek inspiration, then lock a recipe in `design.md` / optional effects notes.  
- *Plain English:* Frosted cards are allowed when they look expensive, not like a generic dashboard; the three domain tiles are where we prove that next.
- **Domains drift continuity (Apr 2026):** **No** full-bleed **radials**, spine-column **washes**, or chapter **gradient overlays** on the drift grid — they **band on screen** and read as **panels**, not refinement. Cohesion is **layout**: shared **`--domains-chapter-pad-y`** (band **`padding-block`**), **`align-self: center`** spine links in each grid row, **`--domains-row-gap`**, and **≥860px** **one** two-column grid: **figure | copy** in DOM for all three chapters; **Aviation** uses **`.domains-band--flip`** (**`direction: rtl`** on **`.domains-band__layout`**, reset to **`ltr`** on fig + text) so the **visual** order is **copy | figure** without a second markup shape or per-domain pose CSS. **Entry:** **`index.astro`** inline script sets **`html.domains-drift-js`** before the bands paint; **`[data-drifts-in]`** + **`.drifts-in--visible`** (from **`domains-drift.ts`**) runs a **one-shot** **`@keyframes`** **reveal-up** on **`.domains-band__layout`**: **`opacity: 0` → `1`** and **`translateY(15%)` → `0`** (rises upward) over **1.5s** **`ease`** (not infinite); **off** under **`prefers-reduced-motion: reduce`**; **Rellax** unchanged when motion is allowed. **Spine:** **`domains-drift.ts`** sets **`data-spine-active`** only while a chapter **intersects ~20–80% of the viewport height** (whichever band’s **vertical center** is closest to mid-viewport wins); **removes** the attribute when **no** band qualifies so spine labels **do not** glow before domains enter view or after they leave. **Hash** **`/#…`** still **`scrollIntoView`** — highlight follows **`pickSpineArticle`** after scroll. **Mobile (`≤719px`):** lateral spine **hidden**; each band shows **`.domains-band__eyebrow`** (**Marine** / **Aviation** / **Automotive**) **above** the **`h3`** so section names stay visible **without** a narrow-column rail. **With all scripts disabled**, the entry class is never set → **no** pre-hidden layout. **Confidence: High** — matches shipped **`index.astro`** / **`domains-drift.ts`** until a new domains experiment ships.  
- *Plain English:* No fake lighting layers; spacing and the spine stay tidy. Photos sit on the **left** for Marine and Automotive, on the **right** for Aviation, using the same HTML pattern and a small flip class—not three bespoke layouts. **Spine labels** line up **next to the vertical middle** of each big domain block, not hugging the top edge. The **glowing spine tag** only turns on when that section is **actually in the middle of your screen**, not while it’s still above or below view. **On a phone**, you still see **Marine / Aviation / Automotive** as a **small line above each headline** because the side spine is turned off. When each chapter scrolls in, the **content fades in and rises slightly into place** (unless you asked the OS for less motion).

### Implementation & platform (recorded — Apr 2026)

**Confidence: Medium** — engineering / process defaults for v1; tighten to **High** after more landings ship without revision.

*Plain English (whole subsection):* Rules for special pages, who checks colors, which phones we test on, how picky we are about flicker, scroll bugs, photo zoom, less-motion users, and sideways scrolling—so the site stays stable as we add features.

**1 — Campaign / marketing landings**  
- **No third shell preset in v1.** Use **`BaseLayout` props** per route: **`dataHomeLoadIntro={false}`** when the route must not run prescroll / intro shell behavior; combine with **`transparentHeader`**, **`canvasColor`**, **`themeColor`** as art direction needs. If a **repeatable** campaign shell appears often, later promote a **named preset** (shared props or thin wrapper)—not required to ship landings today.  
- *Plain English:* Special promo pages do not need a whole new layout type yet—turn off the home-only scroll tricks and tweak colors per page; if we keep repeating the same combo, we can package it later.

**2 — `theme-color` / first-paint vs shipped CSS**  
- **Engineering owns** the **merge checklist**: `BaseLayout.astro` critical inline (`html`/`body` background), **`themeColor` / `canvasColor`** defaults and per-page overrides, and **`global.css`** (`--page-canvas`, shell tokens) staying aligned. **Design owns device QA sign-off** when palette, canvas, or hero chrome changes (Safari / Android sampling + composition).  
- *Plain English:* Devs keep the “first paint” colors in sync with the stylesheet; designers check on real phones when we change colors so nothing looks accidentally wrong.

**2b — Transparent header: `sticky` vs `absolute`**  
- **Default:** **`position: sticky`** when **persistent nav while scrolling** is the priority (current home). **`absolute`** is **template-level opt-in** when **softest top seam** over full-bleed photography beats sticky—**document the choice** on that template in **`docs/design-system/layout-rules.md`** (and a one-line comment on the route if non-obvious).  
- *Plain English:* Nav sticks to the top while you scroll unless a page opts in to “float over the photo” for a softer line under the notch—if we switch, write it down in layout rules.

**3 — Reference devices (“golden” hero / prescroll tuning)**  
- **Primary phones:** **notch / Dynamic Island class** (~6.1″, e.g. iPhone 13–16 Pro non-Max) and **iPhone SE (3rd gen)** (small viewport — density and clipping gate).  
- **Secondary:** **Pro Max class** when validating tall viewports.  
- **Tablet:** **iPad mini** (or smallest common iPad) as the **“iterate later”** reference—tablet is not a v1 ship gate per canonical decisions.  
- *Plain English:* We judge hero tightness on a normal Pro-size iPhone and a small SE; tall Pro Max is a bonus check; iPad can wait.

**4 — Pre-scroll first-frame flash (WebKit)**  
- **Bar for v1:** **“Mostly invisible.”** An occasional **single-frame** jump before prescroll settles is an **accepted** trade versus **deferring** scroll (worse perceived hero). **Zero flash** is aspirational, not a default blocker, unless brand later tightens the requirement.  
- *Plain English:* A one-frame flicker when the page first loads is acceptable if the hero still feels right; perfect zero flicker is nice-to-have.

**5 — `history.scrollRestoration = 'manual'` + `load` / `rAF` repair (`home-prescroll.ts`)**  
- **v1 default strategy stands.** **Watch list only:** back-forward cache restore, low-power / throttled frames—address **only if** QA reproduces a real failure (avoid speculative complexity).  
- *Plain English:* Keep the current scroll-fix script unless someone proves Safari back-button or battery saver breaks it—do not add complexity “just in case.”

**6 — Hero image `scale()` vs crop**  
- **Keep CSS guardrails** and treat **each hero asset** as **art-directed**: after any scale / crop / bleed change, **check composition** (subject, craft detail, horizon) on the **golden phones** above—not only algorithmic parity with prescroll math.  
- *Plain English:* Do not let math zoom the hero photo so hard that we crop off the yacht’s mast or the craftsman’s hands—look at each new image on real devices.

**7 — `prefers-reduced-motion: reduce` and hierarchy**  
- **Yes:** same **informational hierarchy** without motion—**layout-only** compensation so headline, domains, and metrics stay **readable and ordered**; do not rely on scroll position or transform polish for comprehension.  
- *Plain English:* If the user asked the OS for less motion, we still show title → links → stats in a clear order using spacing and layout, not tricks that depend on animation.

**8 — `overflow-x: hidden` on `html` and future horizontal patterns**  
- **Keep the current contract** until a horizontal pattern ships. **Carousels, maps, full-bleed tracks:** put **`overflow-x`** on the **component or section wrapper**, not on **`.page`** and not by **removing** `html`’s horizontal clip without an **iOS sticky regression** pass. Document the wrapper pattern when the first component lands.  
- *Plain English:* The page root clips sideways scroll for stability; if we add a sideways carousel, put the sideways scroll inside that component only and test sticky headers before changing the global rule.

### Meta — Authoritative vs rationale

**Confidence: Medium** — documentation hygiene; refine when the split between backbone and rationale files settles.

- **Split mentally (and in prose):** **Authoritative** = tokens, breakpoints, do-not-violate invariants. **Rationale** = history, tradeoffs, “why we chose jitter.” Agents and humans should **weight authoritative sections first**; rationale must not override spec. Use headings **`## Authoritative`** / **`## Rationale (non-normative)`** in long docs, or a dedicated **`design-rationale.md`** with a banner that it does not override **`design.md`**.  
- *Plain English:* Put “must follow” rules in clearly labeled sections; put backstory and tradeoffs elsewhere so nobody treats a war story as a hard spec.

---

## Implementation & platform — residual learnings (non-normative)

**Confidence: Medium** — engineering memory; superseded by explicit backbone text when you promote Owner § Implementation.

**Normative answers (until backbone absorbs them):** **Owner decisions → Implementation & platform (recorded — Apr 2026)** above.

*Plain English (whole section):* Short reminders of what we learned on real iPhones—things that are easy to forget when editing CSS.

- **Canvas + `theme-color`:** reduces **navy bleed** into mobile browser chrome; it does **not** replace **layout** for a soft top edge under the island — **hero-owned** `.hero__media` / `.hero__scrim` do.  
  *Plain English:* Matching the browser’s top bar color to dark gray helps, but the photo and its darkening overlay still do the real work of a soft edge under the camera cutout.  
- **Sticky header + extra header-layer gradients:** historically read as a **hard band**; prefer **hero-owned** softening; **`absolute`** header remains a **documented template option** for max softness.  
  *Plain English:* Piling gradients on the header made a visible “stripe”; fixing the look belongs on the hero image layers, not extra lipstick on the nav.  
- **Pre-scroll math:** lives in **`BaseLayout.astro`** (inline head) and **`src/scripts/home-prescroll.ts`**; tune against **Owner** reference devices when changing `--home-prescroll-y` behavior.  
  *Plain English:* How far we nudge the page on load is defined in the layout’s early script and the prescroll helper—tweak amounts using the same phones we already named as references.

---

## Glass, depth, and restraint

**Confidence: Medium** — owner direction: **glass not banned**; per-surface judgment. Numeric **Question** rows below may still tighten into measurable tests when domains are finalized.

*Plain English (whole section):* How much “frosted glass,” shadow, and dark bars we allow before it stops feeling minimal and high-end.

9. **Assumption:** **Subtle blur** on domain cards is **“controlled depth”** and still within “minimal luxury,” even where written guidance once said **no glassmorphism** for domain entry.  
   *Plain English:* We are asking whether a slight frosted-glass look on the three domain tiles still feels “quiet luxury” or reads as trendy UI chrome.  
   **Resolved (Apr 2026):** **No blanket “no glass” rule** — glassmorphism stays **on the table** when execution reads **high-end** (see **Owner decisions → Domains & glassmorphism** and **`design.md` → Section 1**). Prefer treatments that help **legibility at boundaries**; avoid gratuitous frosted chrome. **Optional later:** a measurable line (contrast over busy vs flat) if we need stricter QA.

10. **Assumption:** If blur is **only decorative**, **solid** panels + shadow are preferred over glass.  
    *Plain English:* If the blur is not helping you read text over a busy photo, skip the glass and use a solid panel with a soft shadow instead.  
    **Question:** What **measurable** test defines “only decorative” (contrast ratio over a busy photo vs over flat navy)?

11. **Assumption:** **Trust strip “letterbox”** should read as **cinema chrome** using **near-black neutrals**, not **brand navy**, when promoted to sticky.  
    *Plain English:* The thin sticky strip under the nav should feel like a movie letterbox (almost black), not a slab of brand blue.  
    **Question:** Should any brand-tinted strip ever appear **between** hero and content, or must that transition always stay **neutral-to-navy**?

---

## Hero, CTA, and chrome

**Confidence: Medium** — hero CTA policy **resolved** for v1; wave / legibility questions remain.

*Plain English (whole section):* What belongs in the big top story, whether we put a button on the hero, how the photo meets the nav, and optional wave decoration.

12. **Assumption:** The hero carries **one primary story**; secondary actions belong in **header/footer**, not stacked on the hero.  
    *Plain English:* The big photo area should tell one story; extra buttons live in the header or footer, not cluttering the hero.  
    **Resolved (Apr 2026):** **v1 ships without a hero primary CTA button** — intentional; headline + domain links + metrics only (see **Owner decisions → Home hero CTA (v1)** and **`design.md` → Hero**). Optional hero button is a **later** product choice, not a v1 requirement.

13. **Assumption:** **Transparent header** over hero requires **negative `margin-top: -var(--header-h)`** so photography **continues under** the nav.  
    *Plain English:* We pull the hero up so the picture continues underneath the see-through navigation bar.  
    **Question:** Is there a **minimum** safe legibility standard (contrast over **which** hero grades) for links on transparent chrome?

14. **Assumption:** **Wave / SVG motion** between hero and body is **optional** and should stay **paused** when it competes with metrics or clarity.  
    *Plain English:* A decorative wave divider between hero and the next section is optional and should be turned off if it fights the stats or readability.  
    **Question:** Is the wave **ever** part of brand recognition (logo-level), or permanently **nice-to-have**?

---

## Layout, grid, and type

**Confidence: Low** to **Medium** (mixed): container and interior band lean **Medium** where already reflected in layout rules; font split and eyebrows **Low** until copy/brand pass.

*Plain English (whole section):* How wide text runs, what color band follows interior heroes, which serif fonts go where, what tiny labels are allowed to say, and keeping the three domain columns fair.

15. **Assumption:** **`.u-container` max ~1120px** is the correct reading width for this brand’s editorial mix.  
    *Plain English:* Main text columns stay about as wide as a nice magazine page for comfortable reading.  
    **Question:** Should **long-form** (e.g. future case studies) ever break out to a **wider** measure, or stay inside the same container?

16. **Assumption:** Interior pages use a **flat `#0a1628` body band** after the page hero to separate “air” from structured content.  
    *Plain English:* After the interior page hero, the next band is a flat dark blue-gray so the page does not feel like one endless airy gradient.  
    **Question:** Is `#0a1628` a **canonical token** (named in the system) or an allowed **one-off**—should it merge with navy scale?

17. **Assumption:** **Butler** for the **home hero H1** and **Playfair** for display elsewhere is a **stable** split.  
    *Plain English:* The home main headline uses one fancy serif; other big titles use another serif we already use sitewide.  
    **Question:** Is that split **homepage-only forever**, or should **campaign** heroes ever use Butler on inner routes?

18. **Assumption:** **Eyebrows** only **label** sections; they never carry the persuasive thesis.  
    *Plain English:* Small caps labels above section titles say what section you are in—they are not where we hide the sales pitch.  
    **Question:** Who enforces that in copy—**brand**, **web**, or both—and what happens if marketing wants a longer “eyebrow”?

19. **Assumption:** **Domain grid** stays **three equal columns** at `≥640px` even when photography temporarily favors one vertical.  
    *Plain English:* Marine / Aviation / Automotive stay three equal cards on tablet-up; we do not make one column bigger because one photo is prettier.  
    **Question:** Is **copy-only** balancing enough, or do we ever allow **temporary** visual emphasis (e.g. launch vertical) without breaking parity?

---

## Navigation, IA, and motion

**Confidence: Low** to **Medium**: breakpoint and reduced-motion behavior are closer to **Medium** (implemented); IA and overlay UX **Low**.

*Plain English (whole section):* How menus are grouped, how you know what page you are on, when desktop vs mobile nav kicks in, the home domain-card preview, and submenu animation tastes.

20. **Assumption:** **Grouped** header nav (Services / About) pairs with a **structured site footer**: **Explore** lists **Marine / Aviation / Automotive / Projects** only (`NAV_SERVICES` + `NAV_MAIN`); **About** and **Contact** stay in the header and primary CTAs—not duplicated as footer nav rows. **Confidence: Medium** for IA pairing until another footer experiment ships.  
    *Plain English:* Top nav still groups items; the footer uses columns (brand, key destinations, contact, get started) instead of repeating every header link in one long list.

21. **Assumption:** **Active route** styling is a **tone shift toward white**, not a pill—quiet luxury over app patterns.  
    *Plain English:* The current page link gets slightly brighter text, not a rounded “app button” background.  
    **Question:** Has **accessibility / wayfinding** been validated for color-blind users with that subtlety?

22. **Assumption:** **Desktop breakpoint `≥961px` / mobile `≤960px`** for nav behavior is final for v1.  
    *Plain English:* Anything 961px wide or more gets desktop nav; 960 and below gets the mobile menu pattern.  
    **Question:** Should **tablet landscape** ever get a **third** interaction model (e.g. visible subnav)?

23. **Assumption:** **Home domains “A closer look”** favors **explore-before-navigate** on plain click: **Aviation** and **Automotive** still use the **FLIP fullscreen overlay**; **Marine (Apr 2026 pilot)** expands **in-place** under **`#marine`** (scoped panel, **no** overlay). Marine mini CTA uses **`href="#marine"`** (same chapter; no separate “full marine page” affordance in the expand block while v1 copy lives here). **`/marine`** may still exist for bookmarks/SEO; **no-JS** falls through to hash. **Modifier** + click on the CTA opens the hash in a new tab (native).  
    *Plain English:* Two domains still open the big preview layer; Marine opens more detail under its band and stays on the home chapter anchor. Command-click still opens a new tab like a normal link.  
    **Question:** On repeat visits, does **overlay-first** (where it remains) feel **slow**—should there be a “skip preview” or direct-link pattern? If the Marine pilot wins, do we **match** all three to in-place, or keep overlay for “cinematic” domains only?

24. **Assumption:** **Staggered** submenu motion on desktop reads as **luxury**; reduced motion users get **instant** appearance.  
    *Plain English:* Desktop dropdown children fade in one after another for polish; people who asked for reduced motion see all items appear at once.  
    **Question:** Is **instant** for reduced motion identical to **no animation at all**, or should we still allow **opacity** fades that are not spatial?

---

## Content, proof, and contact

**Confidence: Low** — policy and analytics triggers still open.

*Plain English (whole section):* Where AI-looking imagery is OK vs where only real job photos count, how serious we are about matching future photos, phone-first contact, and how loud “trust” numbers should be.

25. **Assumption:** **Hero imagery** may be **atmospheric** (including AI) while **gallery** remains **real work only**.  
    *Plain English:* The top big image can be moody or even AI-assisted; the gallery of actual work must be real photos of real jobs.  
    **Question:** Where exactly does **“proof”** start—Projects page, Instagram embed, PDF—so the **AI = atmosphere / Real = authority** rule cannot be misread?

26. **Assumption:** **Composition rules** (shared horizon, angle, lighting, crop) across domain heroes are **achievable** with future real shoots.  
    *Plain English:* Eventually we want jet / yacht / car hero shots to feel like one family of photos, not three random stock images.  
    **Question:** Until then, is **single static hero** (per design.md) the official stance, or is **imperfect multi-domain** rotation acceptable?

27. **Assumption:** Inquiry forms (Contact page + Marine / Aviation / Automotive reach) **POST to Web3Forms**; inbox is **`SITE.email`** (`info@eagledetailingcorp.com`). Key lives in **`PUBLIC_WEB3FORMS_ACCESS_KEY`**. Phone / Instagram remain first-class. Chat may replace the static form later.  
    *Plain English:* Filling out a form now emails the business inbox; no more “opens your mail app.” The API key stays in `.env`, not in the repo.  
    **Confidence: Medium** — wired in code; confirm a real submit on production and that Vercel has the same env var.

28. **Assumption:** **Trust copy** stays **quiet** (no loud stat walls); subtle lines are enough credibility.  
    *Plain English:* Credibility is a thin line of sober facts, not a dashboard of huge numbers.  
    **MVP (Apr 2026):** Current quiet trust strip + metrics context is **acceptable** until client info arrives in bursts; **no** mandatory above-fold license wall or stat grid for v1. Revisit when legal/sales requires specific proof on-page.

---

## Global UX details

**Confidence: Medium** — matches current global CSS behavior; lower if we add a discoverability fallback.

*Plain English (whole section):* Hidden scrollbars vs usability and smooth scrolling vs jump-to-section behavior.

29. **Assumption:** **Hiding scrollbars** while keeping `overflow-y: scroll` avoids layout jitter when chrome shows/hides.  
    *Plain English:* You can still scroll normally, but the scrollbar is invisible so the layout does not jump when the browser shows or hides UI.  
    **Question:** Is **scrollbar-free** acceptable for **all** audiences, or do we need a **system preference** fallback for discoverability?

30. **Assumption:** **Smooth scroll** globally is on-brand; it is disabled when reduced motion is requested.  
    *Plain English:* Scrolling eases gently for the luxury feel unless the user asked their OS for less motion—then jumps are instant.  
    **Question:** Should **in-page anchor** jumps (e.g. future FAQ) use **instant** jump for precision even when smooth scroll is on?

---

## Meta (documentation)

**Confidence: Medium** — two-path doc layout is stable until you collapse or automate sync.

*Plain English (whole section):* Whether we keep two documentation folders forever or merge them later.

31. **Partially resolved:** **`documentation/design-system/`** is the **human-first** canonical for narrative + decisions; **`docs/design-system/`** is the **agent prompt / checklist** mirror — **must not** drift silently from the same facts (e.g. **Canonical decisions** above). Engineering defaults live in **`src/layouts/BaseLayout.astro`** + **`src/styles/global.css`** + critical inline in BaseLayout.  
    *Plain English:* Humans read the long docs folder; AI helpers read the shorter `docs/` mirror; both must say the same facts, and the real behavior still lives in the layout and CSS files.  
    **Question:** Should one repo path be **deprecated** with a single redirect note in README, or keep both until v2?
