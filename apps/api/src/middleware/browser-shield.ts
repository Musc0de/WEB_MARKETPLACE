import { Context, Next } from 'hono';

function isTopLevelDocumentNavigation(request: Request): boolean {
  const method = request.method.toUpperCase();

  if (method !== 'GET' && method !== 'HEAD') {
    return false;
  }

  const accept = request.headers.get('accept')?.toLowerCase() ?? '';
  const fetchMode = request.headers.get('sec-fetch-mode')?.toLowerCase() ?? '';
  const fetchDest = request.headers.get('sec-fetch-dest')?.toLowerCase() ?? '';

  return (
    fetchMode === 'navigate' ||
    fetchDest === 'document' ||
    accept.includes('text/html')
  );
}

const EXEMPT_PREFIXES = [
  '/v1/webhooks',
  '/webhooks',
  '/storage',
  '/health',
  '/ready',
];

const EXEMPT_SUFFIXES = [
  '/stream',
];

function isExempt(path: string): boolean {
  for (const prefix of EXEMPT_PREFIXES) {
    if (path.startsWith(prefix) || path.startsWith(`/api${prefix}`)) {
      return true;
    }
  }
  for (const suffix of EXEMPT_SUFFIXES) {
    if (path.endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

const storefrontUrl = typeof Deno !== 'undefined'
  ? Deno.env.get('VITE_STOREFRONT_URL')
  : process?.env?.['VITE_STOREFRONT_URL'];

const GENERIC_404_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,nosnippet">
  <title>Akses Ditolak | StarSuperScare</title>
  <style>
    :root {
      --bg: #0f172a;
      --text: #f8fafc;
      --accent: #3b82f6;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    .container {
      text-align: center;
      padding: 3rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      max-width: 90%;
      width: 500px;
    }
    h1 {
      font-size: 8rem;
      margin: 0;
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    h2 {
      font-size: 1.5rem;
      margin-top: 1rem;
      font-weight: 600;
    }
    p {
      color: #94a3b8;
      margin-top: 0.5rem;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--accent);
      color: white;
      text-decoration: none;
      border-radius: 9999px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .btn:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <h2>Halaman Tidak Ditemukan</h2>
    <p>Halaman tidak Ditemukan.</p>
    <a href="${storefrontUrl}" class="btn">Kembali ke Beranda</a>
  </div>
</body>
</html>`;

export const browserNavigationShield = async (c: Context, next: Next) => {
  const path = c.req.path;

  // 1. If it's an exempt path, proceed normally.
  if (isExempt(path)) {
    await next();
    return;
  }

  // 2. If it is NOT a top-level document navigation, proceed normally.
  if (!isTopLevelDocumentNavigation(c.req.raw)) {
    await next();
    return;
  }

  // 3. Otherwise, it is a direct browser navigation to an API endpoint.
  // Return a generic HTML 404 response.
  c.header('Content-Type', 'text/html; charset=utf-8');
  c.header('Cache-Control', 'no-store');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Robots-Tag', 'noindex, nofollow, nosnippet');
  c.header('Referrer-Policy', 'no-referrer');
  c.header(
    'Content-Security-Policy',
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  );

  return c.html(GENERIC_404_HTML, 404);
};
