/**
 * Domain cards: FLIP-style expand to fullscreen overlay (home page).
 */

const CARD_SEL = '[data-domain-card]';

/**
 * FLIP “invert” transform: scale fullscreen panel as if it grew from the card’s center,
 * while keeping its axis-aligned bounds flush with the card (translate compensation).
 */
function flipInvertFromCardCenter(first: DOMRect, vw: number, vh: number): string {
  const sx = first.width / vw;
  const sy = first.height / vh;
  const cx = first.left + first.width / 2;
  const cy = first.top + first.height / 2;
  const corners: [number, number][] = [
    [cx + (0 - cx) * sx, cy + (0 - cy) * sy],
    [cx + (vw - cx) * sx, cy + (0 - cy) * sy],
    [cx + (0 - cx) * sx, cy + (vh - cy) * sy],
    [cx + (vw - cx) * sx, cy + (vh - cy) * sy],
  ];
  const minX = Math.min(...corners.map((p) => p[0]));
  const minY = Math.min(...corners.map((p) => p[1]));
  const ox = first.left - minX;
  const oy = first.top - minY;
  return `translate(${ox}px, ${oy}px) translate(${cx}px, ${cy}px) scale(${sx}, ${sy}) translate(${-cx}px, ${-cy}px)`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getThemeClass(card: HTMLElement): string {
  if (card.classList.contains('card-domain--marine')) return 'domain-expand__panel--marine';
  if (card.classList.contains('card-domain--aviation')) return 'domain-expand__panel--aviation';
  if (card.classList.contains('card-domain--automotive')) return 'domain-expand__panel--automotive';
  return 'domain-expand__panel--marine';
}

function buildOverlay(): HTMLElement {
  const root = document.createElement('div');
  root.className = 'domain-expand';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'domain-expand-title');
  root.hidden = true;
  root.innerHTML = `
    <div class="domain-expand__backdrop" data-domain-expand-dismiss></div>
    <div class="domain-expand__panel" id="domain-expand-panel">
      <button type="button" class="domain-expand__close" aria-label="Close" data-domain-expand-dismiss>&times;</button>
      <div class="domain-expand__content">
        <h2 class="domain-expand__title" id="domain-expand-title"></h2>
        <div class="domain-expand__visual" aria-hidden="true"></div>
        <p class="domain-expand__desc"></p>
        <a class="domain-expand__cta u-btn" href="#"></a>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  return root;
}

type OverlayEls = {
  root: HTMLElement;
  panel: HTMLElement;
  backdrop: HTMLElement;
  titleEl: HTMLElement;
  descEl: HTMLElement;
  ctaEl: HTMLAnchorElement;
  visualEl: HTMLElement;
};

export function initDomainCards(): void {
  const cards = document.querySelectorAll<HTMLElement>(CARD_SEL);
  if (!cards.length) return;

  /** Built on first open so init does not mutate the document after first paint (avoids a “double load” hitch). */
  let overlay: OverlayEls | null = null;

  let openCard: HTMLElement | null = null;
  let closing = false;

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;

  function populateFromCard(card: HTMLElement, els: OverlayEls): void {
    const { panel, titleEl, descEl, ctaEl, visualEl } = els;
    const h3 = card.querySelector('h3');
    const p = card.querySelector('.card-domain__body p');
    const href = card.getAttribute('href') ?? '/';

    titleEl.textContent = h3?.textContent?.trim() ?? '';
    descEl.textContent = p?.textContent?.trim() ?? '';
    ctaEl.href = href;
    ctaEl.textContent = 'Explore';

    panel.classList.remove(
      'domain-expand__panel--marine',
      'domain-expand__panel--aviation',
      'domain-expand__panel--automotive',
    );
    panel.classList.add(getThemeClass(card));

    visualEl.className = 'domain-expand__visual';
    visualEl.innerHTML = '';
    const thumb = card.querySelector<HTMLImageElement>('.card-domain__visual img');
    if (thumb) {
      const expanded = document.createElement('img');
      expanded.src = thumb.currentSrc || thumb.src;
      expanded.alt = '';
      expanded.className = 'domain-expand__visual-img';
      expanded.decoding = 'async';
      expanded.width = thumb.naturalWidth || thumb.width;
      expanded.height = thumb.naturalHeight || thumb.height;
      visualEl.appendChild(expanded);
      visualEl.classList.add('domain-expand__visual--photo');
    } else if (card.classList.contains('card-domain--marine')) {
      visualEl.classList.add('domain-expand__visual--marine');
    } else if (card.classList.contains('card-domain--aviation')) {
      visualEl.classList.add('domain-expand__visual--aviation');
    } else if (card.classList.contains('card-domain--automotive')) {
      visualEl.classList.add('domain-expand__visual--automotive');
    }
  }

  function setBodyScroll(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  function close(): void {
    if (!openCard || closing || !overlay) return;
    const { root, panel, backdrop } = overlay;
    const card = openCard;
    closing = true;

    const reduced = prefersReducedMotion();
    if (reduced) {
      root.classList.remove('domain-expand--open', 'domain-expand--instant');
      root.hidden = true;
      backdrop.style.transition = '';
      backdrop.style.opacity = '0';
      panel.style.transform = '';
      panel.style.transformOrigin = '';
      panel.style.borderRadius = '';
      panel.style.width = '';
      panel.style.height = '';
      setBodyScroll(false);
      card.focus();
      openCard = null;
      closing = false;
      return;
    }

    const first = card.getBoundingClientRect();
    const w = vw();
    const h = vh();
    const br = getComputedStyle(card).borderRadius;

    backdrop.style.transition = 'opacity 0.4s ease';
    backdrop.style.opacity = '0';

    panel.style.transition =
      'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
    panel.style.borderRadius = br;
    panel.style.transformOrigin = '0 0';
    panel.style.transform = flipInvertFromCardCenter(first, w, h);

    let finished = false;
    const finishClose = (): void => {
      if (finished) return;
      finished = true;
      window.clearTimeout(safety);
      panel.removeEventListener('transitionend', onEnd);
      root.classList.remove('domain-expand--open');
      root.hidden = true;
      panel.style.transition = '';
      panel.style.transform = '';
      panel.style.transformOrigin = '';
      panel.style.borderRadius = '';
      panel.style.width = '';
      panel.style.height = '';
      backdrop.style.transition = '';
      backdrop.style.opacity = '0';
      setBodyScroll(false);
      card.focus();
      openCard = null;
      closing = false;
    };

    const onEnd = (e: TransitionEvent): void => {
      if (e.target !== panel || e.propertyName !== 'transform') return;
      finishClose();
    };

    const safety = window.setTimeout(finishClose, 700);
    panel.addEventListener('transitionend', onEnd);
  }

  function ensureOverlay(): OverlayEls {
    if (overlay) return overlay;
    const root = document.querySelector<HTMLElement>('.domain-expand') ?? buildOverlay();
    overlay = {
      root,
      panel: root.querySelector<HTMLElement>('.domain-expand__panel')!,
      backdrop: root.querySelector<HTMLElement>('.domain-expand__backdrop')!,
      titleEl: root.querySelector<HTMLElement>('.domain-expand__title')!,
      descEl: root.querySelector<HTMLElement>('.domain-expand__desc')!,
      ctaEl: root.querySelector<HTMLAnchorElement>('.domain-expand__cta')!,
      visualEl: root.querySelector<HTMLElement>('.domain-expand__visual')!,
    };

    const { root: r } = overlay;
    r.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-domain-expand-dismiss]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && r.classList.contains('domain-expand--open')) {
        e.preventDefault();
        close();
      }
    });

    return overlay;
  }

  function open(card: HTMLElement): void {
    if (closing) return;
    const els = ensureOverlay();
    const { root, panel, backdrop } = els;
    openCard = card;
    populateFromCard(card, els);
    root.hidden = false;

    const reduced = prefersReducedMotion();
    const first = card.getBoundingClientRect();
    const w = vw();
    const h = vh();

    const br = getComputedStyle(card).borderRadius;
    panel.style.borderRadius = br;
    panel.style.transition = reduced ? 'none' : '';

    if (reduced) {
      panel.style.transformOrigin = '';
      panel.style.transform = 'none';
      panel.style.width = '100%';
      panel.style.height = '100%';
      root.classList.add('domain-expand--open', 'domain-expand--instant');
      backdrop.style.opacity = '1';
      setBodyScroll(true);
      root.querySelector<HTMLElement>('.domain-expand__close')?.focus();
      return;
    }

    panel.style.width = '100vw';
    panel.style.height = '100vh';
    panel.style.transformOrigin = '0 0';
    panel.style.transform = flipInvertFromCardCenter(first, w, h);

    root.classList.remove('domain-expand--instant');
    root.classList.add('domain-expand--open');
    backdrop.style.opacity = '0';
    void panel.offsetHeight;

    requestAnimationFrame(() => {
      backdrop.style.transition = 'opacity 0.45s ease';
      backdrop.style.opacity = '1';
      panel.style.transition =
        'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      panel.style.transform = 'none';
      panel.style.borderRadius = '1.25rem';
    });

    setBodyScroll(true);
    root.querySelector<HTMLElement>('.domain-expand__close')?.focus();
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      open(card);
    });
  });
}
