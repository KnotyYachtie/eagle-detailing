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

let marineRellax: RellaxInstance | null = null;

function destroyMarineRellax(): void {
  marineRellax?.destroy();
  marineRellax = null;
}

function initMarinePageRellax(): void {
  destroyMarineRellax();
  if (!document.querySelector(ROOT)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!document.querySelectorAll(SEL).length) return;
  try {
    marineRellax = new Rellax(SEL, {
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
