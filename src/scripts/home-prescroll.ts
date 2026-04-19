/**
 * Site shell when `<html data-home-load-intro>` (default in BaseLayout):
 * - Mobile (≤960px): `--home-prescroll-y` + `scrollTo` so Safari’s chrome settles; matches head inline.
 * - All viewports: `--hero-inner-vh` from `visualViewport` / `innerHeight` (Safari URL bar).
 */

const MIN_PX = 52;
const MAX_PX = 132;

function offsetPx(): number {
  return Math.round(Math.min(MAX_PX, Math.max(MIN_PX, window.innerHeight * 0.092)));
}

function readVisualHeight(): number {
  const vv = window.visualViewport;
  if (vv?.height) return Math.round(vv.height);
  return Math.round(window.innerHeight || 0);
}

/** Only write when height changes — avoids layout thrash / “breathing” hero on `visualViewport` scroll. */
let lastHeroInnerVhPx = -1;

function applyHeroInnerVh(): void {
  const h = readVisualHeight();
  if (h <= 0 || h === lastHeroInnerVhPx) return;
  lastHeroInnerVhPx = h;
  document.documentElement.style.setProperty('--hero-inner-vh', `${h}px`);
}

function readPrescrollY(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--home-prescroll-y').trim();
  const parsed = parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return offsetPx();
  return Math.round(parsed);
}

export function initHomePreScroll(): void {
  if (typeof window === 'undefined') return;
  if (!document.documentElement.hasAttribute('data-home-load-intro')) return;

  applyHeroInnerVh();
  window.addEventListener('resize', applyHeroInnerVh, { passive: true });
  /* `resize` only — not `visualViewport` `scroll` (fires during page scroll; was reapplying CSS and read as a subtle “scale”). */
  window.visualViewport?.addEventListener('resize', applyHeroInnerVh, { passive: true });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* Desktop: no pre-scroll (matches head inline + layout breakpoint). */
  if (!window.matchMedia('(max-width: 960px)').matches) {
    document.documentElement.style.setProperty('--home-prescroll-y', '0px');
    return;
  }

  const apply = (): void => {
    const y = readPrescrollY();
    if (y <= 0) return;
    document.documentElement.style.setProperty('--home-prescroll-y', `${y}px`);
    try {
      if ('scrollRestoration' in history) {
        const h = history as History & { scrollRestoration?: string };
        h.scrollRestoration = 'manual';
      }
    } catch {
      /* ignore */
    }
    if (window.scrollY <= 2) window.scrollTo(0, y);
  };

  if (document.readyState === 'complete') {
    apply();
    requestAnimationFrame(apply);
  } else {
    window.addEventListener(
      'load',
      () => {
        apply();
        requestAnimationFrame(apply);
      },
      { once: true }
    );
  }
}
