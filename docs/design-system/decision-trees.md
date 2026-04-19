# Decision trees

## A. Mobile / Safari top seam reads “wrong”

**Bias:** Prefer a **soft** top edge on mobile — owned by **hero paint** (photo bleed, light scrim, neutral placeholder under the image), not by stacking extra “chrome” bands.

1. **Is the seam mostly the *system* browser UI sampling the page?**  
   - **Yes** → Align **`theme-color`** + **first-paint `html`/`body`** + optional **neutral `--page-canvas`** on that route.  
   - **Still wrong** after colors match → This is usually **not** meta-only: check **header `position` mode** (step 2) and **hero bleed / scrim** before adding **`html`/`body` gradients**.

2. **Is the seam between *site header* and hero photo (hard line / slab)?**  
   - **Yes** → **Default today:** transparent header is **`position: sticky`** site-wide in **`Header.astro`**. For the **softest** read over a **full-bleed** hero, switch that template to **`position: absolute`** over the hero; hero uses **negative top margin** so media **continues under** the bar (express payback with **`--header-bar` + `--header-safe-pad`**, not nested **`var(--header-h)`** inside `calc()` — WebKit invalidation).  
   - **Avoid** fixing sticky banding by **`overflow-y: visible`** on `.hero` unless you accept new overflow side effects — prefer absolute stacking first when softness is the priority.

3. **Is the seam a decorative overlay you added (header pseudo-elements, extra top vignette, “sky” strip)?**  
   - **Yes** → **Remove** or **simplify**; on iOS these often read as a **second** bar. Soften via **hero** layers only, **restrained** scrim, optional **charcoal placeholder** gradient on `.hero__media` while the image loads.

4. **Still need more separation from the URL / toolbar chrome?**  
   - **Yes** → Add **small pre-scroll** (mobile only) + **`--home-prescroll-y` layout payback** on hero height, content `padding-top`, and metrics `translateY` — never scroll without reinvesting the pixels.

---

## B. “Band” mid-page (trust / stats) feels like a bug

1. **Does it scroll away normally?**  
   - **Yes** but still ugly → **Restyle** only (typography, border, contrast) — keep flow.

2. **Does it *feel* sticky even when it isn’t?**  
   - **Yes** → User perception already locked — **promote** to **intentional sticky letterbox** (neutral black, under header z-index).

---

## C. Motion on the homepage hero

1. **`prefers-reduced-motion: reduce`?**  
   - **Yes** → **No** load choreography, **no** auto pre-scroll, **no** extra hero scale overrides.

2. **Otherwise, is motion carrying *luxury* or *energy*?**  
   - **Energy** → **Remove** (snappy overshoot, bounce, scale on photo load).  
   - **Luxury** → **Keep** only slow blur/opacity/translate with **overlapping** timings.

---

## D. Glass vs solid

1. **Is blur required for *readability* at this boundary?**  
   - **Yes** → Use **tokenized** blur strengths; add **solid fallback** when `@supports not (backdrop-filter)`.

2. **Is blur only *style*?**  
   - **Yes** → Prefer **solid** layers + shadow; save glass for **true** stacked-depth problems.

---

## E. Domain entry parity

1. **Does photography favor one vertical?**  
   - **Yes** → **Still** balance **grid weight** and **copy** so all three remain co-equal; do not “fix” with unequal column spans.

2. **Need richer story than a link?**  
   - **Yes, on home only** → Overlay expand is allowed; **default** remains navigable pages for Marine / Aviation / Automotive.

---

## F. Contact strategy (v1)

1. **Need structured lead capture?**  
   - **Not yet** → **Phone + email + Instagram** only; say so in copy.  
   - **Yes later** → Add provider + env endpoint; do not block v1 ship on form UX.
