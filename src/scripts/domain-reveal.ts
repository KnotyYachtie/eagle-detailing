/**
 * Domain cards: scroll-into-view adds `.active` for CSS transition (opacity / scale / brightness).
 */
const SEL = '[data-domain-reveal]';

export function initDomainReveal(): void {
  const cards = document.querySelectorAll<HTMLElement>(SEL);
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach((el) => el.classList.add('active'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      }
    },
    { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );

  cards.forEach((el) => io.observe(el));

  window.addEventListener(
    'pagehide',
    () => {
      io.disconnect();
    },
    { once: true }
  );
}
