export default {
  async fetch(request, env) {

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Serve HTML assets (GET requests)
    if (request.method === 'GET') {
      return env.ASSETS.fetch(request);
    }

    // Only handle POST to /api/analyze
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/analyze') {

      // ════════════════════════════════════
      // GANTI API KEY DI SINI
      const API_KEY = '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';
      // ════════════════════════════════════

      let body;
      try { body = await request.json(); }
      catch { return new Response('Invalid JSON', { status: 400 }); }

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body)
      });

      const data = await resp.json();

      return new Response(JSON.stringify(data), {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
