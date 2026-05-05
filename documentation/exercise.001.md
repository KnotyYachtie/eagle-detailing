# Exercise 001 — Domains (sandbox + debrief)

**Scope:** Homepage **domains** block only — structure, motion, synergy narrative, tokens, and how we **arrived here**. This file is a **sandbox**: *where we started → where we landed*, so future passes can align taste without re-deriving intent from chat history.

**Why this exercise exists (meta):** Some outcomes are **non-negotiable in a shipped product** — for example, **timeline spine labels that are visually and geometrically consistent across every row**. When the first implementation falls short of that bar, the cost is **iteration in the wrong layer** (layout hacks, repeated Q&A, user distrust) instead of **correct structure up front**. This document’s job is to record **(a)** what *should* have been true on day one, **(b)** what *actually* happened and why, and **(c)** what we added (spec, tokens, tests, doc) so the **gap is explicit** and the same class of oversight is **easier to prevent** next time — not to justify the detour, but to **close it** for anyone touching domains later.

**No new exercise files** (`exercise.002.md`, etc.) unless you say so first.

**Maintainer:** Update in the **same workstream** as domains code changes.

**Related:** `documentation/design-system/design.md` · `assumptions.md` · `docs/design-system/agent-conductor.md`

---

## Sandbox convention (how to read this)

| Column / section | Use |
|------------------|-----|
| **Where we started** | Snapshot of the prior direction (what shipped or was drafted). |
| **Where we landed** | Current behavior + structure. |
| **Empathy signal** | What you *felt* you wanted (synergy, calm, Gulfstream formality, etc.) — short, plain language. |
| **Design system tie** | Which doc/owner line we leaned on. |
| **Tension / gap** | Mismatch, missing spec, or follow-up for you or the next agent. |

**Grouped rows** are OK; one row per *decision surface*, not per DOM node.

When a row documents a **mistake path**, prefer an explicit **“Should have been (ship bar)”** line so “where we landed” is not mistaken for “what was good enough at first cut.”

---

## Current — long scroll drift on canvas (Apr 2026, rev. 3)

| | |
|--|--|
| **Where we started (this beat)** | Rev. 2: one **sticky bordered** “synergy frame” inside a tall **runway**, morphing Marine → Aviation → Automotive in the same card. Felt **compartmentalized**; imagery could disagree with the active label; everything had to read in **one viewport**. |
| **Where we landed** | **Native document scroll**: three tall **`article` chapters** (`#marine` · `#aviation` · `#automotive`) on the **`index-atmos`** canvas — **no outer card shell**. Each chapter uses **plate + float** + **Rellax** (`.domains-drift .rellax`) **plus** **`IntersectionObserver`**-gated **reveal-up** on **`.domains-band__layout`**: **`opacity` 0→1** + **`translateY(15%)`→0** (upward), **1.5s** **`ease`**, **`forwards`** (one-shot, not infinite); gated by **`html.domains-drift-js`** (inline **`<script>`** before the section); **no** entry motion under **`prefers-reduced-motion: reduce`**. **≥860px** **one** grid recipe: **figure | copy** in DOM for every band; **Aviation** adds **`domains-band--flip`** (**`direction: rtl`** on **`.domains-band__layout`**, **`ltr`** reset on fig + text) for **copy | figure** without copy-first DOM or **`order`** hacks — avoids per-chapter pose CSS and **overlap** between bands. **`domains-drift.ts`**: `IntersectionObserver` adds **`drifts-in--visible`** on **`[data-drifts-in]`**; scroll scrub sets **`--drift-exit`** on **`[data-drift-scrub]`** (parent **`.domains-band__stage`**) for **opacity + brightness** as the band exits upward; **`prefers-reduced-motion`** skips Rellax, IO reveal, and exit scrub listeners. **Hash** `/#marine` etc. → **`scrollIntoView({ behavior: 'smooth' })`**. **Explore** = text-only **underline CTA** (`.domains-drift__explore.card-domain--mini`); hidden **`.card-domain__title` / body / img** still feed **`domain-cards.ts`**. **Automotive** plate/float uses **`assets/car.1.png`** + **`assets/car.2.png`**; **mini CTA** hidden thumb uses **`car.1`**. **Flow without overlays (Apr 2026):** **rejected** stacked **radials** / spine **wash** / chapter **gradient handoffs**. **Layout rhythm:** shared **`--domains-chapter-pad-y`** on **`.domains-band`** **`padding-block`**; **`--domains-row-gap`** + **`row-gap`** on **`.domains-drift__grid`** (block flow **`≤719px`**; **`#aviation` / `#automotive`** **`margin-top`** matches). **`≤719px`:** **`.domains-band__eyebrow`** (Marine / Aviation / Automotive) above each **`h3`**. |
| **Empathy signal** | **Drift downward** with **infinite vertical space** — Apple / Gulfstream-style **calm**; layers feel **3D** via parallax; content **de-emphasizes** as it leaves the stage; **never** “everything in one frame at once.” |
| **Design system tie** | `design.md` Motion — **scoped** parallax + scroll-linked treatment; `assumptions.md` L73: parallax **allowed when scoped**; still avoid gratuitous multi-section stacks — here it is **one section**, three sequential chapters. |
| **Tension / gap vs assumptions** | Assumptions warn against **noisy multi-section scroll-linked stacks** and gratuitous motion — this implementation is **narrower** (domains only) but **more** scroll-story than the earlier “bounded surface only” mental model. If we add **more** scrubbed bands site-wide, revisit L73 explicitly. **Assumption #23** “card overlay” language: overlay **dialog** unchanged; on-page “cards” are gone — wording may still say “card” for the **mini FLIP source**; optional doc rename later. |

---

## Current — Marine in-place expand (Apr 2026 pilot)

| | |
|--|--|
| **Where we started** | All three **Explore** links used **`data-domain-card`** → **`domain-cards.ts`** FLIP overlay on primary click. |
| **Where we landed** | **Marine only:** **`data-domain-inplace="marine"`**; **`href="#marine"`**; **`#marine-expand`** **`role="region"`** **sibling after** **`.domains-band__stage`** (full-width strip under the band). Inner **`u-container`** + **`max-width: min(42rem, …)`**. **Desktop (`≥860px`):** **`.domains-band__text`** uses **`align-self: end`** on the two-column grid so the headline/lede/CTA sit **lower** with the collage’s visual weight (less dead space under “A closer look”). Panel motion: **`max-height` + `clip-path`**, gradient, stagger; **`hidden`** ~**1.1s**. **`prefers-reduced-motion`:** instant panel / no stagger. **Stage `overflow: hidden`** when expanded. **Contact** only. **Aviation / Automotive** unchanged (overlay). |
| **Empathy signal** | Read more **without leaving the scroll story** — less “modal interrupt,” more **chapter depth**. |
| **Design system tie** | `assumptions.md` #23 (pilot split); `design.md` Domain Entry when we consolidate post-pilot. |
| **Tension / gap** | **`overflow: hidden`** on the stage while expanded can **trim** a sliver of collage if parallax pushes art past the box — watch on tall / narrow viewports. **Scroll:** panel may sit **below the fold** on short viewports — consider **`scrollIntoView`** on expand if testing says users miss it. **Parity:** if pilot ships long-term, decide overlay vs in-place for **all three** or **hybrid** by domain. |

---

## Current — timeline spine (Apr 2026)

### F. Lateral rail + chapter anchors

| | |
|--|--|
| **Should have been (ship bar — first implementation)** | **Three** chapter labels on a **vertical spine** must **never** read as misaligned: **same** label→rail→dot **geometry** on every row; **DOM order = reading order** (label, then rail, then marker) for **accessibility and predictability**; **longest copy** (here **AUTOMOTIVE** + **`letter-spacing: 0.2em`**) + **narrow desktop** must **not** collide with the rail or **negative-overflow** left; any **full-height decorative rail** must be positioned from the **same layout tokens** as the tracks (count **every** `gap` between columns — here **two** flanks on a **1px** bar); ship with a **regression guard** (e.g. **`tests/spine-layout.spec.ts`**: bbox distance **label → node** within tolerance across **all** rows, or equivalent visual diff). **Per-domain CSS hacks** should be unnecessary if the layout model assumes **variable intrinsic width** from day one. |
| **Where we started (what actually shipped first)** | Section context **duplicated** as eyebrows inside each band while the spine was still being figured out. Early spine work used a **pseudo-element dot** and **padding-inferred** space between label and dot — under **wide `letter-spacing`** and **Safari**, the gap between the **last glyph** and the **dot** was **not reliably equal** across Marine / Aviation / Automotive; the **longest** string read **tight** even when informal measurements looked “close.” A **separate** full-height rail was **offset** relative to the dot cluster (**dot left of rail** vs intended **dot right of rail**) because layout was **not** yet expressed as **explicit tracks**. |
| **Where we landed** | **Column 1** of **`.domains-drift__grid`**: three **`a.domains-spine__link`** (`href` `#marine` · `#aviation` · `#automotive`, **`data-spine="…"`**) each contains **`.domains-spine__label`** + **`.domains-spine__bar`** (transparent **1px** slot) + **`.domains-spine__node`**. Layout is **CSS Grid**: **`grid-template-columns: minmax(0, 1fr) 1px auto`** and **`column-gap: var(--spine-gap)`** so the **first track** absorbs **variable label width** while the **bar column** and **node** stay **anchored to the inner right** of the spine track (**`justify-self: end`** on the label). **Read order:** label → **spine** → **dot** (dot sits **to the right** of the painted rail). **Continuous** vertical gradient = **`.domains-drift__grid::before`** at **`z-index: 0`**; horizontal position uses **`calc(var(--spine-col) - var(--spine-link-pad-r) - var(--spine-node) - 2 * var(--spine-gap) - 1px)`** — the **`2 *`** matters because **two** equal gaps flank the **1px** bar. **`.domains-spine__link`** **`z-index: 1`** above the rail; **`align-self: center`** in the shared grid row so each label cluster **sits vertically centered** beside its **`article.domains-band`** ( **`--domains-chapter-pad-y`** still drives band **`padding-block`** only). **Tokens:** **`--spine-col`**, **`--spine-link-pad-r`**, **`--spine-gap`**, **`--spine-node`**, **`--domains-chapter-pad-y`** on the grid; **`domains-drift.ts`** sets or clears **`data-spine-active`** on **`.domains-drift`** from **`pickSpineArticle`** (viewport **~20–80%** band + closest band center; attribute **removed** when off-screen). **Desktop:** **`.domains-band__eyebrow`** **hidden** (`display: none`); spine carries **Marine / Aviation / Automotive**. **`≤719px`:** spine links + **`::before`** **hidden**; **`.domains-band__eyebrow`** **shown** in the copy column **above** **`h3`** so narrow viewports still get section tags **without** a squeezed rail. |
| **Empathy signal** | One quiet **timeline** at the canvas edge; **equal** air between each label and the rail; **Automotive** must not **crash** the rail optically; dots feel **intentional**, not cramped against the line. |
| **Design system tie** | Spine accent aligned with **“A closer look”** / **`--color-accent`**; motion and scroll behavior remain **scoped to the domains block**; hashes reinforce **IA** (in-page chapter anchors vs full routes on CTAs). |
| **Tension / gap** | **`--spine-gap`** is **one** token: nudging it widens **label ↔ rail** and **rail ↔ dot** **symmetrically**. To add space **only** on the label side, introduce a **second** gap variable and wire grid / `::before` math separately. **`--spine-col`** must stay wide enough for **AUTOMOTIVE** + **`letter-spacing: 0.2em`** + two gaps + node + right padding — if the clamp is tightened, watch for **negative `left`** on label boxes (overflow past the column). **Regression:** **`tests/spine-layout.spec.ts`** — **`node.left - label.right`** equal for all three rows on desktop (tolerance **0.15px**). |

### G. What went wrong (root causes) — so we do not repeat it

These are **process / modeling** gaps, not “user picky about pixels”:

1. **Layout model did not assume variable-length labels + tracking** — inferring space from **padding** or **pseudo-only** dots couples optics to **font stack** and **letter-spacing** in ways that **flex shorthand** does not fix. **Ship-ready** rule: treat the label as **intrinsic-width content in a flexible track**, not as “whatever fits after we pad.”
2. **Decorative rail (`::before`) was not derived from the same grid algebra as the flex/grid tracks** — a one-term **`calc`** omitted **one** of the two **`column-gap`**s, so the **painted spine** and the **layout spine** could disagree. **Ship-ready** rule: one **source of truth** for horizontal spine position (either **only** per-row bars in flow, or **`::before` `left:` rewritten whenever `gap` or padding changes** — and verify with **measurement**, not eyeball).
3. **Flex + `justify-content: flex-end`** packed a **whole cluster** to the inner right — correct for “dots line up,” wrong for “**longest** word may need **left** growth without changing **glyph→rail** feel” until **`minmax(0,1fr)` + end-aligned text** existed. **Ship-ready** rule: for **N** labels beside a **shared rail**, use **grid** (or explicit subgrid) from the first PR, not flex iteration.
4. **No automated cross-row metric before the spine stabilized** — misalignment was caught through **conversation and screenshots**, not CI. **Ship-ready** rule: add **`spine-layout.spec.ts`** (or similar) **with the first spine merge**, using the **longest** label string you expect in production.
5. **Column width (`--spine-col`) was tuned for shorter strings first** — at desktop widths, **AUTOMOTIVE** could sit at **negative `left`** (overflow) while the rail stayed put, which **reads** as “word hits spine.” **Ship-ready** rule: size **`--spine-col`** from **`max(intrinsic widths)` + mandatory gutters + node + padding**, then **measure** at **~720–1280px** width.

### H. Iteration chronology (facts only)

| Step | Change |
|------|--------|
| 1 | Spine labels + markers; **uneven** label→dot feel with **pseudo / padding** approach under caps + Safari. |
| 2 | **Flex** + real **DOM node** + shared **`gap`** — equal **bbox** label→node across rows, but **rail vs dot** order still wrong for the product intent (**dot left of rail**). |
| 3 | **DOM order** label → **bar slot** → node; **full-height** rail as **`.domains-drift__grid::before`**; **`left:`** later corrected to **`2 * var(--spine-gap)`**. |
| 4 | **“Automotive scooch”** discussion — clarified **flex-end** economics (wider column ≠ more **E→dot** without **`--spine-gap`** change); rejected **automotive-only** hacks. |
| 5 | **Grid** `minmax(0,1fr) 1px auto` + **`justify-self: end`** on label — length-agnostic; widened **`--spine-col`** / **`--spine-gap`** clamps for real **AUTOMOTIVE** fit + equal **“notch”** toward rail. |

### I. Forward guidance — any future “rail + N labels” (checklist)

Use this as a **preflight** before merging lateral timelines, chapter rails, or stepped nav:

- [ ] **Track model:** Use **CSS Grid** (or subgrid) with a **dedicated column** for the **1px rail** and a **dedicated column** for the **marker**; label column **`minmax(0, 1fr)`** + **end-aligned** text if labels hug the rail.
- [ ] **DOM = visual order** for the spine sequence (label → rail → marker).
- [ ] **One gap token or two?** If **`column-gap`** applies **between all columns**, **`::before` `left:`** must include **every** gap term (here **two** gaps around the bar).
- [ ] **Longest string** in the design + **`letter-spacing`** + **target breakpoints** — open the page at **~1200px** and **~768px** and confirm **no negative overflow** on label boxes.
- [ ] **Regression test** on merge: **Playwright** (or equivalent) comparing **cross-row** metrics — same tolerance idea as **`spine-layout.spec.ts`**.
- [ ] **Document the ship bar** in this file when behavior changes — one **“Should have been”** row per risky surface.

---

## Archive — unified floating runway (rev. 2)

### A. Compartmentalized chapters → unified floating synergy

| | |
|--|--|
| **Where we started** | Three **separate** editorial `<section>` chapters (Marine / Aviation / Automotive), each its own bordered band, zigzag layout, hero hashes scrolling to distinct blocks. Synergy was *implied* by copy, not by **one** continuous surface. |
| **Where we landed** | **One** tall **scroll runway** (`[data-domains-scroll]`) with a **single sticky floating panel** (`.domains-float`) that **crossfades** three full-bleed **image stacks** + three **copy stacks** as scroll progress advances — Marine → Aviation → Automotive. **Rellax** on wash + plate/float frames for calm parallax. **Horizontal touch swipe** nudges scroll (optional “swipe reveal” rhythm). **Progress rail** (three dots) jumps scroll position. Bottom **mini CTAs** keep the FLIP overlay + `/marine` etc. without visually splitting the hero frame into three “cards.” |
| **Empathy signal** | You wanted **synergy**: one craft story that **evolves**, not three boxes that compete. Formal, Gulfstream-adjacent **calm** — slow opacity/transform handoffs, not snappy carousel energy. |
| **Design system tie** | `design.md` §1 Domain Entry — co-equal domains, photography-led, glass optional; Motion §6 — discrete, bounded choreography. Owner **Domains & glassmorphism** — restraint on frosted chrome; depth from **layering + scroll** here. |
| **Tension / gap** | **Assumption #23** still describes “card” overlay — behavior is now **mini CTA** tiles; consider renaming in `assumptions.md` when you debrief. Rellax + sticky is sensitive on **low-end Android** — watch jank; `prefers-reduced-motion` shortens runway and disables Rellax init. |

### B. Scroll physics & “where am I?”

| | |
|--|--|
| **Where we started** | Scroll only moved the page; domain identity = which chapter was in view. |
| **Where we landed (archived)** | **`domains-scroll-phase.ts`** (removed in rev. 3) mapped viewport position through the runway to `0…1`, set **`--o-*`** on the runway. **`/#marine`** etc. scrolled the runway to tuned progress values. |
| **Empathy signal** | Land **exactly** on the chapter you mean when linking from the hero; no guesswork. |
| **Design system tie** | `design.md` §1 IA note (anchors vs routes) — hashes are **progress**, routes stay on CTAs + overlay. |
| **Tension / gap** | Thresholds are **tuned constants** in TS — if copy or runway height changes, re-QA handoff points; could later expose as CSS vars or config. |

### C. Motion stack (reveal + parallax + reduced motion)

| | |
|--|--|
| **Where we started** | `data-domain-reveal` on each chapter `<a>`; per-card IO reveal. |
| **Where we landed (archived)** | **`data-domain-reveal` on `.domains-float`** — one IO-driven entrance after intro. **Rellax** scoped to the float. Rev. 3: **`[data-drifts-in]`** per band in **`domains-drift.ts`**; homepage may have **zero** `[data-domain-reveal]` nodes. |
| **Empathy signal** | Cinematic but **legible**; never “fight” the user’s scroll. |
| **Design system tie** | Motion §6 + `prefers-reduced-motion` policy in `design.md` / assumptions. |
| **Tension / gap** | Rellax uses **window scroll** — correct for our sticky runway; if layout changes (e.g. nested scroll), revisit `relativeToWrapper` options in Rellax docs. |

### D. FLIP overlay + thumbnails

| | |
|--|--|
| **Where we started** | Full chapter `<a>` as FLIP source. |
| **Where we landed** | Three **`card-domain--mini`** links; **visually hidden** `.card-domain__visual img` preserves **`domain-cards.ts`** population + theme class. CTA label still read from `.card-domain__cta`. |
| **Empathy signal** | Same “closer look” ritual without implying three separate hero products. |
| **Design system tie** | Overlay pattern unchanged technically; UX is closer to **ghost CTA** per §1. |
| **Tension / gap** | FLIP animates from a **small** rect — more modal, less “theater curtain”; acceptable trade for unified frame. |

### E. Automotive imagery

| | |
|--|--|
| **Where we started** | Wrong-domain pairing risk (`yacht5` under “Automotive” in rev. 2 stacks). |
| **Where we landed** | **Dedicated automotive band** with **`assets/automotive/car1.png`** (plate) **`+ car.2.png`** (float) on the homepage drift collage (replaced earlier **`inspo*`** stand-ins). |
| **Empathy signal** | At minimum, **no yacht labeled automotive** in the primary collage. |
| **Tension / gap** | Swap when **real automotive** assets exist; confirm `inspo*` brand fit. |

---

## Open question (owner)

- **Nav vs hashes:** Hero uses **`/#…`**; primary nav may still use **`/marine`** etc. Confirm one story for first-time visitors vs returning deep-linkers.

---

## How entries were written (field reference)

For *new* rows outside the sandbox tables above, you can still use:

| Field | Content |
|--------|---------|
| **What** | Name / role. |
| **Should have been (ship bar)** | Non-negotiable acceptance criteria **had the feature shipped correctly on the first pass** — especially for optics that read as “broken” if wrong (e.g. **aligned spine labels**). |
| **Structure** | Layout / DOM pattern. |
| **Choices** | Concrete tokens, motion, libs. |
| **Why** | Plain language. |
| **Design system** | Doc cite. |
| **A vs B** | Fork + rejection. |
| **Tension / gap** | Doc or product follow-up. |

---

*Last updated: **rev. 3 + spine + mobile eyebrows** — domains as **three scroll chapters** on canvas (**`domains-drift.ts`** + **`--drift-exit`**); **timeline spine** desktop + **`≤719px`** **`.domains-band__eyebrow`**; **§ F** (ship bar vs first ship vs landed; spine links **row-centered** beside chapters), **§ G**–**§ I**; **§ Current** — stagger **flip** layout; rev. 2 runway archived above; **sandbox** documents **gaps to prevent repeat oversights**.*
