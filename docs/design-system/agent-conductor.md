# Agent conductor (read order & handoffs)

**This is the only conductor file** (path: `docs/design-system/agent-conductor.md`). There is **no** duplicate under `documentation/design-system/`—avoid same-name stubs that read like circular pointers.

**Purpose:** A short **if → then** workflow so the right sources are read, edits land in the right files, and **assumptions** stay in sync with **code** without silent drift.

**Hard rule (project):** `.cursor/rules/design-assumptions-confidence.mdc` — assumptions are **soft** with **confidence**; **backbone** (`design.md`, layout-rules, principles, `global.css`, `BaseLayout`, shared components) changes only when the owner asks to **codify** and items are **High** confidence.

---

## 1. Classify the task (pick one)

| Kind | Typical touch |
|------|----------------|
| **A. UI / layout / hero / header / footer** | `.astro` components, `index.astro`, `global.css` |
| **B. Motion / scroll / reduced motion** | `index.astro`, `home-prescroll.ts`, `design.md` Motion + hero notes |
| **C. Tokens / global chrome / shell** | `global.css`, `BaseLayout.astro` (incl. critical inline) |
| **D. Copy / content** | `src/site.ts`, page `.astro`, brand strings only from approved sources |
| **E. Docs only** | `documentation/design-system/*`, this folder’s mirrors |
| **F. Backbone promotion** | Owner explicit; move **High** material from assumptions → `design.md` / layout-rules / code |

---

## 2. Read order (before coding)

**Always (quick skim):**  
`documentation/design-system/assumptions.md` — **Canonical** (what code claims today) + any **Owner** section your task touches.

**Domains UI work:** If the task is the **homepage domains block**, also skim **`documentation/exercise.001.md`** (agreed scope + table schema) and **`design.md` → Section 1 — Domain Entry** before coding.

**Then, by kind:**

| Kind | Read next |
|------|-----------|
| **A** | `documentation/design-system/design.md` (Layout, Hero, Domain § as relevant), **`layout-rules.md`**, `heuristics.md`; **`documentation/exercise.001.md`** when editing **domains** |
| **B** | `design.md` → Motion System + Homepage hero / iOS; `documentation/synopsis.md` if scroll/safe-area/prescroll; `home-prescroll.ts` |
| **C** | `layout-rules.md` (shell), `design.md` (color / canvas policy), assumptions **Canonical** |
| **D** | `design.md` Voice/Tone if present; assumptions §7 (agents); **never** invent claims |
| **E** | `principles.md`, `design.md` for facts; keep **`docs/`** mirror aligned with **`documentation/`** |
| **F** | Full Owner + target backbone file; then edit code to match |

---

## 3. Write order (where changes go)

1. **Implementation** — `src/**` (prefer tokens in `global.css`, shell in `BaseLayout.astro`, page-specific in pages/components).  
2. **Implementation mirror** — If you changed defaults or shell: **`documentation/design-system/assumptions.md` → Canonical decisions** in the **same** change as code.  
3. **Domains exercise log** — If you changed the **homepage domains section**: **`documentation/exercise.001.md`** — complete or update the **grouped rationale tables** (shell + Marine / Aviation / Automotive chapters) in the **same** workstream; **no** new `exercise.*` files unless the owner instructed beforehand.  
4. **Product / UX policy** — If you changed intent (not just bugfix): **Owner** + ***Plain English*** + **confidence** in `assumptions.md`; then **`design.md`** if it is normative backbone.  
5. **Agent checklists** — Update **`docs/design-system/*.md`** when agent-facing steps or heuristics change.  
6. **Synopsis** — Update **`documentation/synopsis.md`** when hero/scroll/iOS behavior or file responsibilities change (engineering narrative). If domains structure or file layout meaningfully shifts, add a **short** synopsis note when worth it.

---

## 4. If / then (one-liners)

- **If** you edit **`BaseLayout.astro`** critical CSS or default `themeColor` / `canvasColor` → **then** update **assumptions Canonical** + verify **`global.css`** `--page-canvas` / first-paint story still match.  
- **If** you change **prescroll, `--hero-inner-vh`, or `--home-prescroll-y`** → **then** update **`home-prescroll.ts`** / inline script **and** synopsis + layout-rules payback bullets **and** assumptions if behavior changed.  
- **If** design **contradicts** a **Medium/Low** assumption → **then** note drift in PR/chat and **lower confidence** or rewrite the assumption—do not treat stale text as a blocker unless owner says backbone says so.  
- **If** owner says **“design achieved”** → **then** update **assumptions** (wording + confidence), **not** necessarily backbone.  
- **If** owner says **“codify into backbone”** → **then** move spec to **`design.md`** / **`layout-rules.md`** / code and trim duplicate **Owner** text if fully promoted.

---

## 5. Do not

- Promote assumptions into **`design.md`** without owner ask.  
- Leave **Canonical** out of date after shell/code changes.  
- Add new **assumption** bullets without a ***Plain English:*** line (see `assumptions.md` intro).

---

## 6. Related files (map)

| Need | File |
|------|------|
| Repo entry for agents | **`AGENTS.md`** (repo root) — points here + Cursor rule |
| Always-on Cursor rule | **`.cursor/rules/design-assumptions-confidence.mdc`** — mandates this conductor for scoped tasks |
| Brand + visual spec | `documentation/design-system/design.md` |
| Hypotheses + confidence | `documentation/design-system/assumptions.md` |
| Page frame, hero stack, shell | **`layout-rules.md`** (this folder) |
| Fast decisions | `heuristics.md`, `decision-trees.md` |
| Long implementation story | `documentation/synopsis.md` |
| Short agent voice + tokens recap | **`design-prompt.md`** (this folder) |
| Domains section rationale log (homepage) | **`documentation/exercise.001.md`** — update whenever domains UI changes; domains scope only |
