import { SITE } from '../site';

function bindContactPageForm(form: HTMLFormElement): void {
  if (form.dataset.contactPageBound === '1') return;
  form.dataset.contactPageBound = '1';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const phoneOrEmail = String(fd.get('phone_or_email') ?? '').trim();
    const serviceType = String(fd.get('service_type') ?? '').trim();
    const vessel = String(fd.get('vessel') ?? '').trim();
    const location = String(fd.get('location') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    if (!name || !phoneOrEmail || !serviceType || !message) return;

    const subject = encodeURIComponent(`Contact — ${name} (${serviceType})`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Phone or email: ${phoneOrEmail}`,
        `Service type: ${serviceType}`,
        `Vessel / type: ${vessel || '(not provided)'}`,
        `Location: ${location || '(not provided)'}`,
        '',
        message,
      ].join('\n')
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  });
}

function initContactPageForm(): void {
  const form = document.querySelector<HTMLFormElement>('#contact-page-form');
  if (form) bindContactPageForm(form);
}

export function armContactPageForm(): void {
  if (typeof document === 'undefined') return;
  const w = window as Window & { __eagleContactPageFormOnPageLoad?: () => void };
  if (!w.__eagleContactPageFormOnPageLoad) {
    w.__eagleContactPageFormOnPageLoad = () => queueMicrotask(() => initContactPageForm());
    document.addEventListener('astro:page-load', w.__eagleContactPageFormOnPageLoad);
  }
  queueMicrotask(() => initContactPageForm());
}
