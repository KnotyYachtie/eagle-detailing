const WEB3FORMS_PROXY = '/api/web3forms';

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

function payloadFromForm(form: HTMLFormElement, extra?: Record<string, string>): Record<string, string> {
  const payload: Record<string, string> = {};
  const formData = new FormData(form);
  for (const [key, value] of formData.entries()) {
    if (key === 'access_key') continue;
    const text = String(value).trim();
    if (text) payload[key] = text;
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      const text = value.trim();
      if (text) payload[key] = text;
    }
  }
  return payload;
}

export async function submitInquiryToWeb3Forms({
  form,
  submitBtn,
  statusEl,
  subject,
  fromName,
  extra,
  sendingLabel = 'Sending…',
}: SubmitInquiryOptions): Promise<boolean> {
  const labelEl = submitBtn.querySelector<HTMLElement>('[data-submit-label]');
  const originalLabel = (labelEl?.textContent ?? submitBtn.textContent ?? '').trim();
  const payload = payloadFromForm(form, {
    subject,
    from_name: fromName,
    ...extra,
  });

  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-busy', 'true');
  if (labelEl) labelEl.textContent = sendingLabel;
  else submitBtn.textContent = sendingLabel;
  setFormStatus(statusEl, '', '');

  try {
    const response = await fetch(WEB3FORMS_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { success?: boolean; message?: string };
    if (response.ok && data.success) {
      setFormStatus(statusEl, 'Thank you — we’ll be in touch shortly.', 'ok');
      form.reset();
      return true;
    }
    if (response.status === 503) {
      setFormStatus(statusEl, 'Form is not configured. Please call or email us.', 'err');
      return false;
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
