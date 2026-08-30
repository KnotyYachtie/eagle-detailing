import { SITE } from '../site';
import { setFormStatus, submitInquiryToWeb3Forms } from './web3forms-submit';

function bindMarineReachForm(form: HTMLFormElement): void {
  if (form.dataset.marineReachBound === '1') return;
  form.dataset.marineReachBound = '1';

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
    const message = String(fd.get('message') ?? '').trim();
    if (!name || !email || !message) {
      setFormStatus(statusEl, 'Please fill in all required fields.', 'err');
      return;
    }

    const prefix = (form.dataset.reachSubjectPrefix ?? 'Marine').trim() || 'Marine';
    void submitInquiryToWeb3Forms({
      form,
      submitBtn,
      statusEl,
      subject: `${prefix} inquiry — ${name}`,
      fromName: SITE.shortName,
    });
  });
}

function initMarineReachForm(): void {
  document.querySelectorAll<HTMLFormElement>('form[data-eagle-service-reach]').forEach((form) => {
    bindMarineReachForm(form);
  });
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
