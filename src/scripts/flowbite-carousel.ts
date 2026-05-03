/**
 * Flowbite-aligned carousel (https://flowbite.com/docs/components/carousel/)
 * — data-carousel, data-carousel-item, data-carousel-prev/next, data-carousel-slide-to.
 * Vanilla TS; no Flowbite package. Supports multiple roots per page + Astro view transitions.
 */

const DESTROY_KEY = '__eagleFlowbiteCarouselDestroy' as const;

type CarouselMode = 'slide' | 'static';

function parseMode(value: string | null): CarouselMode {
  return value === 'static' ? 'static' : 'slide';
}

function initOne(root: HTMLElement): () => void {
  const prevDestroy = (root as HTMLElement & { [DESTROY_KEY]?: () => void })[DESTROY_KEY];
  prevDestroy?.();

  const mode = parseMode(root.getAttribute('data-carousel'));
  const rawInterval = root.dataset.carouselInterval;
  const intervalMs = Math.max(0, Number.parseInt(rawInterval ?? '5000', 10) || 5000);

  /* Class is stable; `data-carousel-item` toggles between "" and "active" so Flowbite parity stays queryable. */
  const items = [...root.querySelectorAll<HTMLElement>('.fb-carousel__item')];
  if (items.length === 0) return () => {};

  const prevBtn = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
  const indicators = [...root.querySelectorAll<HTMLButtonElement>('[data-carousel-slide-to]')];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = items.findIndex((el) => el.getAttribute('data-carousel-item') === 'active');
  if (active < 0) active = 0;

  let timer: ReturnType<typeof setInterval> | null = null;
  let onVisibility: (() => void) | null = null;
  const ac = new AbortController();
  const { signal } = ac;

  const applyActive = (index: number): void => {
    const n = items.length;
    const i = ((index % n) + n) % n;
    items.forEach((el, j) => {
      if (j === i) {
        el.setAttribute('data-carousel-item', 'active');
      } else {
        el.setAttribute('data-carousel-item', '');
      }
    });
    indicators.forEach((btn, j) => {
      btn.setAttribute('aria-current', j === i ? 'true' : 'false');
    });
    active = i;
  };

  const next = (): void => applyActive(active + 1);
  const prev = (): void => applyActive(active - 1);

  const slideTo = (position: number): void => {
    const n = items.length;
    if (n === 0) return;
    const p = Math.min(Math.max(0, position), n - 1);
    applyActive(p);
  };

  const clearTimer = (): void => {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  };

  const startTimer = (): void => {
    clearTimer();
    if (reduceMotion || mode !== 'slide' || intervalMs <= 0) return;
    timer = setInterval(next, intervalMs);
  };

  prevBtn?.addEventListener('click', () => prev(), { signal });
  nextBtn?.addEventListener('click', () => next(), { signal });

  indicators.forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const pos = Number.parseInt(btn.getAttribute('data-carousel-slide-to') ?? '0', 10);
        slideTo(Number.isFinite(pos) ? pos : 0);
      },
      { signal },
    );
  });

  root.addEventListener('mouseenter', clearTimer, { signal });
  root.addEventListener('mouseleave', startTimer, { signal });
  root.addEventListener('focusin', clearTimer, { signal });
  root.addEventListener('focusout', startTimer, { signal });

  applyActive(active);
  startTimer();

  onVisibility = (): void => {
    if (document.hidden) clearTimer();
    else if (root.isConnected) startTimer();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const destroy = (): void => {
    ac.abort();
    clearTimer();
    if (onVisibility) {
      document.removeEventListener('visibilitychange', onVisibility);
      onVisibility = null;
    }
    delete (root as HTMLElement & { [DESTROY_KEY]?: () => void })[DESTROY_KEY];
  };

  (root as HTMLElement & { [DESTROY_KEY]?: () => void })[DESTROY_KEY] = destroy;
  return destroy;
}

function initAllCarousels(): void {
  document.querySelectorAll<HTMLElement>('[data-carousel="slide"], [data-carousel="static"]').forEach(initOne);
}

/** Idempotent: safe for Astro client navigations. */
export function armFlowbiteCarousel(): void {
  if (typeof document === 'undefined') return;
  const w = window as Window & { __eagleFlowbiteCarouselOnPageLoad?: () => void };
  if (!w.__eagleFlowbiteCarouselOnPageLoad) {
    w.__eagleFlowbiteCarouselOnPageLoad = () => queueMicrotask(() => initAllCarousels());
    document.addEventListener('astro:page-load', w.__eagleFlowbiteCarouselOnPageLoad);
  }
  queueMicrotask(() => initAllCarousels());
}
