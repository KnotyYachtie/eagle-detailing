/**
 * Marine editorial window: crossfade between stacked images (below first chapter, above quote).
 * Cleans up on repeat init / client navigations.
 */

const INTERVAL_MS = 5200;

let timer: ReturnType<typeof setInterval> | null = null;
let onVisibility: (() => void) | null = null;

function destroyMarineWindowCarousel(): void {
  if (timer != null) {
    clearInterval(timer);
    timer = null;
  }
  if (onVisibility) {
    document.removeEventListener('visibilitychange', onVisibility);
    onVisibility = null;
  }
}

function initMarineWindowCarousel(): void {
  destroyMarineWindowCarousel();

  const root = document.querySelector('[data-marine-window-carousel]');
  if (!root) return;

  const slides = [...root.querySelectorAll<HTMLElement>('.marine-window-carousel__slide')];
  if (slides.length < 2) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let i = slides.findIndex((s) => s.classList.contains('is-active'));
  if (i < 0) i = 0;

  const advance = (): void => {
    const next = (i + 1) % slides.length;
    slides[i]?.classList.remove('is-active');
    slides[next]?.classList.add('is-active');
    i = next;
  };

  timer = setInterval(advance, INTERVAL_MS);

  onVisibility = (): void => {
    if (document.hidden) {
      if (timer != null) clearInterval(timer);
      timer = null;
    } else if (timer == null && root.isConnected) {
      timer = setInterval(advance, INTERVAL_MS);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);
}

/** Call from `marine.astro` — survives client navigations like `marine-page-rellax`. */
export function armMarineWindowCarousel(): void {
  if (typeof document === 'undefined') return;
  const w = window as Window & { __eagleMarineWindowCarouselOnPageLoad?: () => void };
  if (!w.__eagleMarineWindowCarouselOnPageLoad) {
    w.__eagleMarineWindowCarouselOnPageLoad = () => queueMicrotask(() => initMarineWindowCarousel());
    document.addEventListener('astro:page-load', w.__eagleMarineWindowCarouselOnPageLoad);
  }
  queueMicrotask(() => initMarineWindowCarousel());
}
