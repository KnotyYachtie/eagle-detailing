/**
 * Domains: each header line reveals on its own IO. Cards stay idle until the intro line
 * (`.domains__intro`) has started its reveal, so “The same inspection…” leads the grid.
 */
const CARD_SEL = '[data-domain-reveal]';
const ABYSS_SEL = '[data-domains-abyss]';
const INTRO_SEL = '.domains__intro[data-domains-abyss]';

const ABYSS_REVEAL_DELAY_MS = 100;
/** After intro gets `domains-abyss-in`, wait this long before cards can intersect-reveal */
const INTRO_HEAD_START_BEFORE_CARDS_MS = 520;
const CARD_REVEAL_DELAY_MS = 80;

export function initDomainReveal(): void {
  const cards = document.querySelectorAll<HTMLElement>(CARD_SEL);
  const abyssEls = document.querySelectorAll<HTMLElement>(ABYSS_SEL);
  const introEl = document.querySelector<HTMLElement>(INTRO_SEL);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    cards.forEach((el) => el.classList.add('active'));
    abyssEls.forEach((el) => el.classList.add('domains-abyss-in'));
    return;
  }

  const disconnectors: Array<() => void> = [];
  const pendingTimeouts: ReturnType<typeof setTimeout>[] = [];
  let cardsArmed = false;

  function armCardReveal(): void {
    if (cardsArmed || !cards.length) return;
    cardsArmed = true;

    const cardObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          cardObserver.unobserve(el);
          const id = window.setTimeout(() => {
            el.classList.add('active');
          }, CARD_REVEAL_DELAY_MS);
          pendingTimeouts.push(id);
        }
      },
      { root: null, rootMargin: '0px 0px 16% 0px', threshold: 0.06 }
    );

    cards.forEach((el) => cardObserver.observe(el));
    disconnectors.push(() => cardObserver.disconnect());
  }

  if (abyssEls.length > 0) {
    const abyssObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          abyssObserver.unobserve(el);
          const id = window.setTimeout(() => {
            el.classList.add('domains-abyss-in');
            if (el.matches(INTRO_SEL)) {
              const armId = window.setTimeout(() => {
                armCardReveal();
              }, INTRO_HEAD_START_BEFORE_CARDS_MS);
              pendingTimeouts.push(armId);
            }
          }, ABYSS_REVEAL_DELAY_MS);
          pendingTimeouts.push(id);
        }
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.22 }
    );

    abyssEls.forEach((el) => abyssObserver.observe(el));
    disconnectors.push(() => abyssObserver.disconnect());
  }

  if (!introEl) {
    armCardReveal();
  }

  window.addEventListener(
    'pagehide',
    () => {
      pendingTimeouts.forEach((id) => clearTimeout(id));
      disconnectors.forEach((fn) => fn());
    },
    { once: true }
  );
}
