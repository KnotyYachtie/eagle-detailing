/**
 * Homepage: keep `--hero-inner-vh` in sync with the visible viewport (Safari chrome, rotation).
 * Pre-scroll was removed — it made the hero read as a short strip after `window.scrollTo`.
 */
function readVisualHeight(): number {
  const vv = window.visualViewport;
  if (vv?.height) return Math.round(vv.height);
  return Math.round(window.innerHeight || 0);
}

function applyHeroInnerVh(): void {
  const h = readVisualHeight();
  if (h <= 0) return;
  document.documentElement.style.setProperty('--hero-inner-vh', `${h}px`);
}

export function initHomePreScroll(): void {
  if (typeof window === 'undefined') return;
  if (!document.documentElement.hasAttribute('data-home-load-intro')) return;

  document.documentElement.style.setProperty('--home-prescroll-y', '0px');

  applyHeroInnerVh();
  window.addEventListener('resize', applyHeroInnerVh, { passive: true });
  window.visualViewport?.addEventListener('resize', applyHeroInnerVh, { passive: true });
  window.visualViewport?.addEventListener('scroll', applyHeroInnerVh, { passive: true });
}
