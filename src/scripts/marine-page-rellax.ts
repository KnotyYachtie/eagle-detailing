/**
 * Rellax for the marine editorial page — mirrors the home domains drift selector pattern,
 * scoped so it does not collide with `.domains-drift .rellax`.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — rellax ships without types
import Rellax from 'rellax';

type RellaxInstance = { destroy: () => void };

const ROOT = '[data-marine-page]';
const SEL = `${ROOT} .rellax`;
/** Full-bleed hero (desktop); excluded on narrow so the stacked, in-flow image is not Rellax-shifted. */
const SEL_NARROW = `${ROOT} .rellax:not(.marine-bleed__rellax)`;

let marineRellax: RellaxInstance | null = null;

function destroyMarineRellax(): void {
  marineRellax?.destroy();
  marineRellax = null;
}

function initMarinePageRellax(): void {
  destroyMarineRellax();
  if (!document.querySelector(ROOT)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const q = window.matchMedia('(max-width: 768px)').matches ? SEL_NARROW : SEL;
  if (!document.querySelectorAll(q).length) return;
  try {
    marineRellax = new Rellax(q, {
      center: true,
      round: true,
      vertical: true,
      horizontal: false,
    }) as RellaxInstance;
  } catch {
    marineRellax = null;
  }
}

/**
 * Call from `marine.astro` — one `astro:page-load` listener (survives client navigations) + first paint init.
 */
export function armMarinePageMotion(): void {
  if (typeof document === 'undefined') return;
  const w = window as Window & { __eagleMarineRellaxOnPageLoad?: () => void };
  if (!w.__eagleMarineRellaxOnPageLoad) {
    w.__eagleMarineRellaxOnPageLoad = () => queueMicrotask(() => initMarinePageRellax());
    document.addEventListener('astro:page-load', w.__eagleMarineRellaxOnPageLoad);
  }
  queueMicrotask(() => initMarinePageRellax());
}
