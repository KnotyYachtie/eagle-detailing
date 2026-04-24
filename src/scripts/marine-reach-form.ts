import { SITE } from '../site';

function bindMarineReachForm(form: HTMLFormElement): void {
  if (form.dataset.marineReachBound === '1') return;
  form.dataset.marineReachBound = '1';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Marine inquiry — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '(not provided)'}\n\n${message}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  });
}

function initMarineReachForm(): void {
  const form = document.querySelector<HTMLFormElement>('#marine-reach-form');
  if (form) bindMarineReachForm(form);
}

export function armMarineReachForm(): void {
  if (typeof document === 'undefined') return;
  const w = window as Window & { __eagleMarineReachFormOnPageLoad?: () => void };
  if (!w.__eagleMarineReachFormOnPageLoad) {
    w.__eagleMarineReachFormOnPageLoad = () => queueMicrotask(() => initMarineReachForm());
    document.addEventListener('astro:page-load', w.__eagleMarineReachFormOnPageLoad);
  }
  queueMicrotask(() => initMarineReachForm());
}
