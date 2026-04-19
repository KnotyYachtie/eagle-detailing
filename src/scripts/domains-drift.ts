/**
 * Domains “drift” layout: long native scroll — bands reveal on intersection (CSS `reveal-up` on
 * `.domains-band__layout`: opacity + translateY from below → 0, one-shot), Rellax depth, exit scrub,
 * hash → scrollIntoView, spine `data-spine-active` only while a chapter overlaps the viewport focus band.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error — rellax ships without types
import Rellax from 'rellax';

const DRIFT_ROOT = '.domains-drift';
const DRIFT_IN = '[data-drifts-in]';
const DRIFT_SCRUB = '[data-drift-scrub]';

function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

type RellaxInstance = { destroy: () => void; refresh: () => void };

/**
 * Pick which chapter “owns” the spine highlight — only while that chapter meaningfully overlaps
 * the viewport’s central band (no default active tag when domains are off-screen).
 */
function pickSpineArticle(articles: HTMLElement[]): string | null {
  const vh = window.innerHeight;
  /** Require overlap with this vertical slice of the viewport (field of view). */
  const bandTop = vh * 0.2;
  const bandBottom = vh * 0.8;
  const midY = vh * 0.5;
  let bestId: string | null = null;
  let bestDist = Infinity;

  for (const el of articles) {
    const r = el.getBoundingClientRect();
    if (r.bottom <= bandTop || r.top >= bandBottom) continue;
    const cy = (r.top + r.bottom) * 0.5;
    const d = Math.abs(cy - midY);
    if (d < bestDist) {
      bestDist = d;
      bestId = el.id;
    }
  }
  return bestId;
}

function createSpineSync(root: HTMLElement): { tick: () => void; dispose: () => void } {
  const ids = ['marine', 'aviation', 'automotive'] as const;
  const articles = ids.map((id) => document.getElementById(id)).filter((n): n is HTMLElement => !!n);
  if (!articles.length) {
    return { tick: () => {}, dispose: () => {} };
  }

  const tick = (): void => {
    const id = pickSpineArticle(articles);
    if (id) {
      root.setAttribute('data-spine-active', id);
    } else {
      root.removeAttribute('data-spine-active');
    }
  };

  const io = new IntersectionObserver(() => tick(), {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.05, 0.12, 0.22, 0.38, 0.55, 0.72, 0.88, 1],
  });
  articles.forEach((a) => io.observe(a));

  queueMicrotask(tick);

  return {
    tick,
    dispose: () => {
      io.disconnect();
    },
  };
}

function applyHashScroll(): void {
  const pth = window.location.pathname;
  if (pth !== '/' && pth !== '/index.html') return;
  const hash = window.location.hash.replace('#', '');
  if (hash !== 'marine' && hash !== 'aviation' && hash !== 'automotive') return;
  const el = document.getElementById(hash);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  /* Spine highlight comes from `pickSpineArticle` on scroll (viewport band), not forced here. */
}

export function initDomainsDrift(): void {
  const root = document.querySelector(DRIFT_ROOT);
  if (!root) return;

  const rootEl = root as HTMLElement;
  const spine = createSpineSync(rootEl);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0;
  let rellax: RellaxInstance | null = null;

  /** Fade + darken as block moves above viewport (leaving stage). */
  function scrubExit(): void {
    if (reduce) return;
    document.querySelectorAll<HTMLElement>(DRIFT_SCRUB).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const zone = vh * 0.38;
      let exit = 0;
      if (rect.bottom < zone) {
        exit = clamp(1 - rect.bottom / zone, 0, 1);
      }
      el.style.setProperty('--drift-exit', exit.toFixed(4));
    });
  }

  function onScroll(): void {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      scrubExit();
      spine.tick();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  if (!reduce) {
    scrubExit();
  }

  let driftIo: IntersectionObserver | null = null;

  if (!reduce) {
    const els = document.querySelectorAll(`${DRIFT_ROOT} .rellax`);
    if (els.length) {
      requestAnimationFrame(() => {
        try {
          rellax = new Rellax(`${DRIFT_ROOT} .rellax`, {
            center: true,
            round: true,
            vertical: true,
            horizontal: false,
          }) as RellaxInstance;
        } catch {
          rellax = null;
        }
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.add('drifts-in--visible');
          io.unobserve(entry.target);
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    driftIo = io;

    document.querySelectorAll<HTMLElement>(DRIFT_IN).forEach((el) => {
      io.observe(el);
    });
  } else {
    document.querySelectorAll<HTMLElement>(DRIFT_IN).forEach((el) => {
      el.classList.add('drifts-in--visible');
    });
  }

  window.addEventListener('hashchange', applyHashScroll);
  queueMicrotask(() => applyHashScroll());
  window.addEventListener('load', applyHashScroll, { once: true });

  window.addEventListener(
    'pagehide',
    () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      driftIo?.disconnect();
      driftIo = null;
      rellax?.destroy();
      rellax = null;
      spine.dispose();
    },
    { once: true }
  );
}
