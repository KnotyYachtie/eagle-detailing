const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export function web3formsAccessKey(): string {
  return String(import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? '').trim();
}

type StatusTone = 'ok' | 'err' | '';

export function setFormStatus(el: HTMLElement | null, message: string, tone: StatusTone): void {
  if (!el) return;
  el.textContent = message;
  if (tone) el.dataset.tone = tone;
  else delete el.dataset.tone;
}

type SubmitInquiryOptions = {
  form: HTMLFormElement;
  submitBtn: HTMLButtonElement;
  statusEl: HTMLElement | null;
  subject: string;
  fromName: string;
  extra?: Record<string, string>;
  sendingLabel?: string;
};

export async function submitInquiryToWeb3Forms({
  form,
  submitBtn,
  statusEl,
  subject,
  fromName,
  extra,
  sendingLabel = 'Sending…',
}: SubmitInquiryOptions): Promise<boolean> {
  const accessKey = web3formsAccessKey();
  if (!accessKey) {
    setFormStatus(statusEl, 'Form is not configured. Please call or email us.', 'err');
    return false;
  }

  const labelEl = submitBtn.querySelector<HTMLElement>('[data-submit-label]');
  const originalLabel = (labelEl?.textContent ?? submitBtn.textContent ?? '').trim();
  const formData = new FormData(form);
  formData.append('access_key', accessKey);
  formData.append('subject', subject);
  formData.append('from_name', fromName);
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      formData.set(key, value);
    }
  }

  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-busy', 'true');
  if (labelEl) labelEl.textContent = sendingLabel;
  else submitBtn.textContent = sendingLabel;
  setFormStatus(statusEl, '', '');

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: formData });
    const data = (await response.json()) as { success?: boolean };
    if (response.ok && data.success) {
      setFormStatus(statusEl, 'Thank you — we’ll be in touch shortly.', 'ok');
      form.reset();
      return true;
    }
    setFormStatus(statusEl, 'We couldn’t send that. Please call or email us.', 'err');
    return false;
  } catch {
    setFormStatus(statusEl, 'We couldn’t send that. Please call or email us.', 'err');
    return false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    if (labelEl) labelEl.textContent = originalLabel;
    else submitBtn.textContent = originalLabel;
  }
}
