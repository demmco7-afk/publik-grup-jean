import { NextResponse } from 'next/server';

// Bot/scraper user agents to block
const BOT_PATTERNS = [
  'wget', 'curl', 'python-requests', 'python-urllib', 'go-http-client',
  'java/', 'scrapy', 'axios', 'node-fetch', 'libwww', 'okhttp',
  'bot', 'spider', 'crawl', 'ganz_track', 'gethtml', 'httpclient',
  'apache-httpclient', 'ruby', 'perl', 'php', 'mechanize',
  'headless', 'phantom', 'selenium', 'puppeteer', 'playwright',
  'wget/', 'curl/', 'postman', 'insomnia', 'httpie'
];

export function middleware(request) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

  // Block bots by User-Agent
  const isBot = BOT_PATTERNS.some(pattern => ua.includes(pattern));
  if (isBot) {
    return new NextResponse(
      '<!DOCTYPE html><html><body style="background:#000;color:#f00;font-family:monospace;display:flex;height:100vh;align-items:center;justify-content:center;text-align:center"><div><h1>⛔ ACCESS DENIED</h1><p>Bot/Scraper detected. This site is protected.</p></div></body></html>',
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Block empty/missing user agents (raw HTTP clients)
  if (!ua || ua.length < 10) {
    return new NextResponse('403 Forbidden', { status: 403 });
  }

  // Block if no Accept header (bots often don't send it)
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/html') && !accept.includes('*/*') && request.nextUrl.pathname === '/') {
    return new NextResponse('403 Forbidden', { status: 403 });
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
