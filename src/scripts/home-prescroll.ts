/**
 * Homepage: head inline script already sets `--home-prescroll-y` + initial scroll.
 * This re-applies if Safari resets scroll on load, and backfills the CSS var if missing.
 */
const MIN_PX = 44;
const MAX_PX = 120;

function offsetPx(): number {
  return Math.round(Math.min(MAX_PX, Math.max(MIN_PX, window.innerHeight * 0.08)));
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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
