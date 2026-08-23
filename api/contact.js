const WEBHOOK_URL = 'https://espadana-n8n.onrender.com/webhook/espadana-cyprus-contact';

function sendJson(response, status, payload) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.status(status).json(payload);
}

module.exports = async function contactHandler(request, response) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return response.status(204).end();
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST, OPTIONS');
    return sendJson(response, 405, { ok: false, error: 'Method not allowed' });
  }

  let body;
  try {
    body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  } catch {
    return sendJson(response, 400, { ok: false, error: 'Invalid JSON' });
  }

  if (!body || !String(body.name || '').trim() || !String(body.phone || '').trim()) {
    return sendJson(response, 400, { ok: false, error: 'Missing required fields' });
  }

  const payload = {
    name: String(body.name).trim(),
    phone: String(body.phone).trim(),
    region: String(body.region || '').trim(),
    budget: String(body.budget || '').trim(),
    message: String(body.message || '').trim(),
  };

  try {
    const upstream = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(85000),
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      console.error('[cyprus-contact] n8n rejected request', {
        status: upstream.status,
        response: text.slice(0, 500),
      });
      return sendJson(response, 502, { ok: false, error: 'Workflow rejected request' });
    }

    console.log('[cyprus-contact] request accepted', { status: upstream.status });
    return sendJson(response, 200, { ok: true });
  } catch (error) {
    console.error('[cyprus-contact] request failed', { error: String(error) });
    return sendJson(response, 502, { ok: false, error: 'Workflow unavailable' });
  }
};
