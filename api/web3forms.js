/**
 * Vercel serverless proxy — keeps Web3Forms access key off the client bundle.
 * Set WEB3FORMS_ACCESS_KEY in Vercel env (same value as the live Web3Forms key).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return res.status(503).json({ success: false, message: 'Form is not configured' });
  }

  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  if (payload.botcheck) {
    return res.status(200).json({ success: true });
  }

  const formData = new FormData();
  formData.append('access_key', accessKey);

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'botcheck' || key === 'access_key') continue;
    if (value == null) continue;
    const text = String(value).trim();
    if (text) formData.append(key, text);
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({ success: false, message: 'Upstream error' });
  }
}
