# Decision trees

## A. Mobile / Safari top seam reads “wrong”

1. **Is the seam mostly the *system* chrome?**  
   - **Yes** → Align **`theme-color`** + **first-paint `html`/`body`** + optional **neutral `--page-canvas`** on that route.  
   - **Still yes** after color alignment → Add **small pre-scroll** + **`--home-prescroll-y` layout payback** (never only scroll without compensation).

2. **Is the seam between *site header* and hero photo?**  
   - **Yes** → Ensure **transparent header** is **`top:0` full width** and hero uses **negative `margin-top: -header-h`** so the image **continues under** the header.

3. **Is the seam a decorative overlay you added?**  
   - **Yes** → **Remove** the overlay; decorative bands are read as **new** problems on iOS.

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
