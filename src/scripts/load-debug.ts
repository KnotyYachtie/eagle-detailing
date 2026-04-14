/**
 * Optional homepage load diagnostics. Enable with either:
 *   • URL: `?loaddebug=1` (or `loaddebug=true`)
 *   • Console: `localStorage.setItem('eagle_load_debug', '1')` then reload (disable: remove item or set to `0`)
 *
 * Open DevTools → Console. Look for `[eagle-load]` lines, layout-shift / longtask warnings, and the summary on `load`.
 */

function isEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem('eagle_load_debug') === '1') return true;
  } catch {
    /* private mode */
  }
  const q = new URLSearchParams(window.location.search);
  return q.get('loaddebug') === '1' || q.get('loaddebug') === 'true';
}

function vwSnapshot(): Record<string, number | string | undefined> {
  const d = document.documentElement;
  const vv = window.visualViewport;
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    clientWidth: d.clientWidth,
    clientHeight: d.clientHeight,
    scrollWidth: d.scrollWidth,
    scrollHeight: d.scrollHeight,
    vvWidth: vv?.width,
    vvHeight: vv?.height,
    vvOffsetTop: vv?.offsetTop,
    vvScale: vv?.scale,
  };
}

export function initLoadDebug(): void {
  if (!isEnabled()) return;

  const tScript = performance.now();
  const tag = '[eagle-load]';

  const log = (msg: string, data?: unknown) => {
    const dt = (performance.now() - tScript).toFixed(1);
    if (data !== undefined) console.log(`${tag} +${dt}ms`, msg, data);
    else console.log(`${tag} +${dt}ms`, msg);
  };

  log('script running', vwSnapshot());

  requestAnimationFrame(() => log('rAF 1 (pre-paint chain)', vwSnapshot()));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => log('rAF 2 (after next paint)', vwSnapshot()));
  });

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => log('DOMContentLoaded', vwSnapshot()),
      { once: true }
    );
  } else {
    log('DOMContentLoaded (already past)', vwSnapshot());
  }

  window.addEventListener(
    'load',
    () => {
      log('window load', vwSnapshot());
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        log('NavigationTiming', {
          type: nav.type,
          domInteractive: Math.round(nav.domInteractive),
          domContentLoadedEventEnd: Math.round(nav.domContentLoadedEventEnd),
          domComplete: Math.round(nav.domComplete),
          loadEventEnd: Math.round(nav.loadEventEnd),
        });
      }
      const paints = performance.getEntriesByType('paint');
      if (paints.length) log('paint entries', paints.map((p) => ({ name: p.name, startTime: Math.round(p.startTime) })));
      const lcp = performance.getEntriesByType('largest-contentful-paint').pop();
      if (lcp) {
        const el = (lcp as PerformanceEntry & { element?: Element; url?: string }).element;
        log('LCP (last)', {
          startTime: Math.round(lcp.startTime),
          tag: el instanceof HTMLElement ? el.tagName + (el.className ? '.' + String(el.className).slice(0, 60) : '') : undefined,
        });
      }
    },
    { once: true }
  );

  document.fonts.ready.then(() => log('document.fonts.ready', { status: document.fonts.status }));

  const heroImg = document.querySelector<HTMLImageElement>('.hero__img');
  if (heroImg?.decode) {
    heroImg
      .decode()
      .then(() => log('hero img decode()', vwSnapshot()))
      .catch((e) => log('hero img decode() rejected', e));
  }

  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.entryType === 'layout-shift') {
          const ls = e as PerformanceEntry & { value: number; hadRecentInput?: boolean; sources?: unknown };
          if (!ls.hadRecentInput && ls.value > 0.0001) {
            console.warn(`${tag} layout-shift`, { value: ls.value.toFixed(4), sources: ls.sources });
          }
        }
      }
    });
    po.observe({ type: 'layout-shift', buffered: true });
  } catch {
    log('layout-shift observer not supported');
  }

  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.entryType === 'longtask') {
          const lt = e as PerformanceEntry & { duration: number };
          console.warn(`${tag} longtask`, { duration: Math.round(lt.duration), name: lt.name });
        }
      }
    });
    po.observe({ type: 'longtask', buffered: true });
  } catch {
    /* Chromium-only in practice */
  }

  try {
    const po = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.entryType === 'paint') {
          log(`paint: ${e.name}`, { startTime: Math.round(e.startTime) });
        }
      }
    });
    po.observe({ type: 'paint', buffered: true });
  } catch {
    log('paint observer not supported');
  }

  let ticks = 0;
  const id = window.setInterval(() => {
    ticks += 1;
    log(`tick ${ticks}/30 viewport`, vwSnapshot());
    if (ticks >= 30) window.clearInterval(id);
  }, 100);

  log('tip: keep this tab open; filter console for', tag);
}
