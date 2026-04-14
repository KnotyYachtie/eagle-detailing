/**
 * Hero metrics: count-up after the homepage load choreography (stats bar timing).
 */
const SEL = '.hero__metrics [data-count-to]';
/** Start counts once the stat bar begins its rise (kept slightly after CSS delay). */
const METRICS_COUNT_START_AFTER_LOAD_MS = 3520;

function formatInt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function animateCount(
  numEl: HTMLElement,
  target: number,
  durationMs: number,
  delayMs: number
): void {
  const suffixEl = numEl.nextElementSibling;
  const hasSuffix =
    suffixEl instanceof HTMLElement && suffixEl.classList.contains('hero__metric-suffix');

  const start = performance.now() + delayMs;

  const tick = (now: number): void => {
    if (now < start) {
      requestAnimationFrame(tick);
      return;
    }
    const t = Math.min(1, (now - start) / durationMs);
    const eased = easeOutCubic(t);
    const v = Math.round(eased * target);
    numEl.textContent = formatInt(v);
    if (hasSuffix) (suffixEl as HTMLElement).style.opacity = String(0.25 + 0.75 * eased);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      numEl.textContent = formatInt(target);
      if (hasSuffix) (suffixEl as HTMLElement).style.opacity = '1';
    }
  };

  requestAnimationFrame(tick);
}

export function initHeroMetrics(): void {
  const nums = document.querySelectorAll<HTMLElement>(SEL);
  if (!nums.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countDelayMs = reduced ? 0 : METRICS_COUNT_START_AFTER_LOAD_MS;

  const run = (): void => {
    nums.forEach((el, i) => {
      const raw = el.getAttribute('data-count-to');
      const target = raw ? parseInt(raw, 10) : 0;
      const suffixEl = el.nextElementSibling;
      const hasSuffix =
        suffixEl instanceof HTMLElement && suffixEl.classList.contains('hero__metric-suffix');

      if (reduced) {
        el.textContent = formatInt(target);
        if (hasSuffix) suffixEl.style.opacity = '1';
        return;
      }

      el.textContent = '0';
      if (hasSuffix) suffixEl.style.opacity = '0.25';

      animateCount(el, target, 2000, i * 110);
    });
  };

  const pending: ReturnType<typeof setTimeout>[] = [];

  const scheduleRun = (): void => {
    const id = window.setTimeout(() => requestAnimationFrame(run), countDelayMs);
    pending.push(id);
  };

  if (document.readyState === 'complete') {
    scheduleRun();
  } else {
    window.addEventListener('load', scheduleRun, { once: true });
  }

  window.addEventListener(
    'pagehide',
    () => {
      pending.forEach((t) => window.clearTimeout(t));
    },
    { once: true }
  );
}
