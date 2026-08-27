import { SITE } from '../site';
import { submitInquiryToWeb3Forms } from './web3forms-submit';

function bindContactPageForm(form: HTMLFormElement): void {
  if (form.dataset.contactPageBound === '1') return;
  form.dataset.contactPageBound = '1';

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const statusEl = form.querySelector<HTMLElement>('[data-form-status]');
  if (!submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const phoneOrEmail = String(fd.get('phone_or_email') ?? '').trim();
    const serviceType = String(fd.get('service_type') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    if (!name || !phoneOrEmail || !serviceType || !message) return;

    const extra: Record<string, string> = {};
    if (phoneOrEmail.includes('@')) extra.email = phoneOrEmail;

    void submitInquiryToWeb3Forms({
      form,
      submitBtn,
      statusEl,
      subject: `Contact — ${name} (${serviceType})`,
      fromName: SITE.shortName,
      extra,
    });
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
