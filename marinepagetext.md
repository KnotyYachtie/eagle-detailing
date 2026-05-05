# Marine page — text inventory (for Automotive / Aviation parity)

Reference for generating **`src/pages/automotive.astro`** and **`src/pages/aviation.astro`** props so they mirror **`src/pages/marine.astro`** + **`ServiceEditorialPage.astro`**.

**Shell:** All three routes use `ServiceEditorialPage.astro`. Copy is passed as **props** (and optionally a **`services-rows` slot** on Marine). The **site header and footer** come from `BaseLayout` and are **not** listed below—they are global chrome.

**IDs:** Each vertical needs **unique** `chapterLeftLabelId`, `chapterRightLabelId`, `servicesEyebrowId`, `servicesHeadlineId`, `reachHeadingId`, and **`formFieldPrefix`** (drives form field `id`s). Marine uses `marine-*`; automotive uses `automotive-*`; aviation uses `aviation-*`.

---

## 1. Document & browser chrome (not visible in the main column as body copy)

| Field / source | Purpose | Marine content |
|----------------|---------|----------------|
| `title` (prop → `<title>`) | Browser tab + shared title pattern | `Marine` (renders as `Marine · Eagle Detailing`) |
| `description` (prop → meta) | SEO / social description | `High-end mobile marine detailing in South Florida — gelcoat correction, ceramic coating, brightwork, interiors, and boat show prep.` |

---

## 2. Hero (fixed / stacked depending on viewport)

| Element | Prop name | Purpose | Marine content |
|---------|-----------|---------|----------------|
| Eyebrow | `heroEyebrow` | Vertical label; small caps styling | `Marine` |
| Headline | `heroTitle` | Primary H1 | `Gelcoat to brightwork` |
| Supporting line | `heroLede` | Hero body / value proposition (user-visible paragraph under H1) | `Luxury center consoles to superyachts; we correct, protect, and maintain finishes in salt-air environments with a disciplined, inspection-first process.` |

**Images (not prose):** Parallax hero uses `heroParallax` image; auto/aviation omit it (gradient placeholder).

---

## 3. First editorial chapter (split: copy left / photo right on wide screens)

| Element | Prop name | Purpose | Marine content |
|---------|-----------|---------|----------------|
| Section label | `chapterLeftLabel` | Uppercase chapter eyebrow; `id` = `chapterLeftLabelId` | `Condition-based approach` |
| Body copy | `chapterLeftParagraphs` | One or more paragraphs (`string[]`) | (1) `Marine finishes don't age evenly. Gelcoat oxidizes, paint fades, varnish breaks down, and brightwork dulls and rusts.` (2) `Each surface needs a different approach. We assess first, then match the correction and protection to the material and its condition.` |
| Photo alt | `chapterLeftAlt` | Accessible description for chapter image | `Motor yacht — exterior detailing` |

**Marine ID:** `chapterLeftLabelId="marine-ch-1"`.

---

## 4. Featured strip (carousel or placeholder)

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| Carousel ID | `carouselId` | DOM id for the carousel widget | `marine-featured-carousel` |
| Accessible name | `carouselAriaLabel` | `aria-label` on the strip section | `Featured vessel` |
| Slide alt text | `carouselSlideAlt` | `alt` on **every** carousel slide (same string repeated) | `Luxury yacht at sea — mobile marine detailing` |

**If no images:** Component shows a dashed placeholder box with **fixed copy** (not a prop): **`Image gallery — placeholder`** (`marine-window__placeholder-label`).

---

## 5. Pull quote

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| Quote | `quoteText` | Single testimonial / editorial quote in styled block | `The first call every time we need the boat dialed in.` |

---

## 6. Second editorial chapter (split; mirrored layout on wide screens)

| Element | Prop name | Purpose | Marine content |
|---------|-----------|---------|----------------|
| Section label | `chapterRightLabel` | Chapter eyebrow | `We're at your service` |
| Body copy | `chapterRightParagraphs` | `string[]` (marine uses one paragraph) | `Dockside, between trips, or at one of South Florida's prestigious boat shows. We work whenever and wherever the project demands. Professionalism, integrity and discretion are at the heart of our values.` |
| Photo alt | `chapterRightAlt` | Chapter image description | `Yacht deck and detailing` |

**Marine ID:** `chapterRightLabelId="marine-ch-2"`.

---

## 7. “Services we offer” block

### Intro copy

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| Eyebrow | `servicesEyebrow` | Matches Marine nav tone; ID ties `aria-labelledby` | `Services we offer` |
| Headline | `servicesHeadline` | H2 | `Meticulous care. Exceptional results.` |
| Deck / lede | `servicesLede` | Supporting paragraph under H2 | `Comprehensive detailing and restoration services for vessels that deserve nothing less.` |

**Marine IDs:** `servicesEyebrowId="marine-services-label"`, `servicesHeadlineId="marine-services-headline"`.

### Service rows

On **Marine**, rows are passed via the **`services-rows` slot** (custom icons + text). On **Automotive / Aviation**, rows come from the **`serviceRows`** prop (same strings rendered with a generic icon).

**Marine row labels (7 rows), top to bottom:**

1. `Wash programs & ongoing care`
2. `Gelcoat & paint correction`
3. `Teak sanding, restoration & sealing`
4. `Coatings & protective systems`
5. `Brightwork, glass & non-skid restoration`
6. `Interior & cabin detailing`
7. `Dockside, emergency & boat show support`

### Phone CTA (under the list)

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| CTA title | `servicesCtaTitle` | Bold line above phone | `Need immediate dockside support?` |
| CTA subline | `servicesCtaSub` | Supporting line next to / above mobile CTA | `Call or text anytime — we're here to help!` |

**Hardcoded in `ServiceEditorialPage` (same on all verticals):** phone button shows **`SITE.phoneDisplay`** and label **`Call or text`**; `aria-label` is `Call or text {phone}`.

**Visual:** Marine passes **`eagleSvgHtml`** (inline eagle SVG). Auto/Aviation omit → dashed **placeholder** silhouette (no copy).

---

## 8. “Get in touch” / reach form

### Intro

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| Heading | `reachTitle` | H2 | `Get in touch` |
| Lede | `reachLede` | Explains the form | `New clients, please use the form below. We'll review your message and reach out as soon as possible.` |

**Marine ID:** `reachHeadingId="marine-reach-h"`.

### Mailto subject line

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| Prefix | `reachSubjectPrefix` | Used in `data-reach-subject-prefix`; mail subject like `{prefix} inquiry — {name}` | `Marine` |

### Message field (vertical-specific)

| Field | Prop name | Purpose | Marine content |
|-------|-----------|---------|----------------|
| Label | `reachMessageLabel` | Label for textarea | `Tell us about your vessel` |
| Hint | `reachMessageHint` | Helper line under label | `e.g. vessel name, size, location, service needed, preferred timing` |

### Form labels / placeholders **shared across verticals** (hardcoded in `ServiceEditorialPage`)

These are **not** props—same English on Marine / Auto / Aviation unless you later refactor:

| UI | Text |
|----|------|
| Name label | `Your name` |
| Name placeholder | `Jane Smith` |
| Email label | `Email address` |
| Email placeholder | `you@example.com` |
| Phone label | `Phone (optional)` |
| Phone placeholder | `+1 (555) 000-0000` |
| Message textarea placeholder | `Your message…` |
| Submit button | `Send message` (with → glyph) |
| Disclaimer | `Existing clients, emergency or overnight service please call or text` + linked `{SITE.phoneDisplay}` |

**Form id prefix:** `formFieldPrefix` → Marine uses `marine` → e.g. `marine-reach-form`, `marine-reach-name`, …

---

## 9. Placeholder pages — prop checklist (Automotive / Aviation)

Every item below should be filled with **domain-appropriate** copy; structure stays the same.

| Prop | Automotive / Aviation notes |
|------|-----------------------------|
| `title` | Page name only (`Automotive`, `Aviation`) |
| `description` | Meta description TBD |
| `heroEyebrow` | `Automotive` / `Aviation` |
| `heroTitle`, `heroLede` | Full headline + supporting paragraph |
| `chapterLeftLabelId`, `chapterRightLabelId`, … | Unique IDs per route (already patterned in `.astro` files) |
| `chapterLeftLabel`, `chapterLeftParagraphs` | Process / philosophy chapter |
| `chapterRightLabel`, `chapterRightParagraphs` | Logistics / service-area chapter |
| `quoteText` | Approved testimonial-style quote |
| `servicesEyebrow`, `servicesHeadline`, `servicesLede` | Services section intro |
| `serviceRows` **or** slot | Same count/style as marine (marine uses 7 rows); auto/aviation use string array |
| `servicesCtaTitle`, `servicesCtaSub` | Urgent-contact framing for that vertical |
| `reachTitle`, `reachLede` | Usually keep “Get in touch” + vertical-specific lede |
| `reachSubjectPrefix` | `Automotive` / `Aviation` |
| `reachMessageLabel`, `reachMessageHint` | Vehicle- or aircraft-specific prompts |
| `formFieldPrefix` | `automotive` / `aviation` |
| `carouselId`, `carouselAriaLabel`, `carouselSlideAlt` | Until real carousel assets exist, placeholders are fine |

---

## 10. Current placeholder snapshots (for diffing)

**Automotive** (`serviceRows` length 6): exterior wash, paint correction, ceramic coating, wheels & glass, interior detailing, maintenance plans.

**Aviation** (`serviceRows` length 5): exterior wash & gloss, paint refinement, protective coatings, brightwork & accents, cabin surfaces & leather.

Align row **count** and **topics** with final service offering lists when copy is ready.

---

*Generated from `src/pages/marine.astro` and `src/components/ServiceEditorialPage.astro`.*
