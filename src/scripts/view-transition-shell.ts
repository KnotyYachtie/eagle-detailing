/**
 * View Transitions (Astro): after swap, align scroll with `data-home-load-intro` shell (mobile prescroll)
 * or snap to top — see `syncScrollAfterViewTransition` in `home-prescroll.ts`.
 */

import { syncScrollAfterViewTransition } from './home-prescroll';

export function initViewTransitionShell(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener('astro:after-swap', () => {
    requestAnimationFrame(() => {
      syncScrollAfterViewTransition();
      requestAnimationFrame(() => syncScrollAfterViewTransition());
    });
  });
}
