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

  const upstreamBody = { access_key: accessKey };

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'botcheck' || key === 'access_key') continue;
    if (value == null) continue;
    const text = String(value).trim();
    if (text) upstreamBody[key] = text;
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(upstreamBody),
    });

    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      console.error('Web3Forms upstream returned non-JSON response', {
        status: response.status,
        contentType: response.headers.get('content-type'),
        bodyPreview: raw.slice(0, 200),
      });
      return res.status(502).json({
        success: false,
        message: 'Upstream returned an invalid response',
      });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Web3Forms upstream request failed', {
      name: error?.name,
      message: error?.message,
    });
    return res.status(502).json({ success: false, message: 'Upstream error' });
  }
}
