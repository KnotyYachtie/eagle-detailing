import { SITE } from '../site';
import { setFormStatus, submitInquiryToWeb3Forms } from './web3forms-submit';

function bindContactPageForm(form: HTMLFormElement): void {
  if (form.dataset.contactPageBound === '1') return;
  form.dataset.contactPageBound = '1';

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const statusEl = form.querySelector<HTMLElement>('[data-form-status]');
  if (!submitBtn) return;

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      form.reportValidity();
      setFormStatus(statusEl, 'Please fill in all required fields.', 'err');
      return;
    }

    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const serviceType = String(fd.get('service_type') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();

    if (!name || !email || !serviceType || !message) {
      setFormStatus(statusEl, 'Please fill in all required fields.', 'err');
      return;
    }

    const extra: Record<string, string> = { email };
    if (phone) extra.phone = phone;

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
