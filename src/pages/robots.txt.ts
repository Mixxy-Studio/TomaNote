// src/pages/robots.txt.js
export async function GET() {
  const isDev = import.meta.env.DEV;
  const siteUrl = 'https://tomanote.app';
  
  const robotsTxt = `# ============================================
  # TomaNote App - Robots.txt
  # Generated: ${new Date().toISOString()}
  # ============================================

  User-agent: *
  Allow: /

  # Sitemap
  Sitemap: ${siteUrl}/sitemap.xml

  # API and admin sections (if they exist)
  Disallow: /admin/
  Disallow: /api/
  Disallow: /private/
  Disallow: /tmp/

  # Block AI crawlers that might use content for training
  # Note: Google-Extended is allowed to appear in Google AI Overviews
  User-agent: GPTBot
  Disallow: /

  User-agent: ChatGPT-User
  Disallow: / 

  # User-agent: Google-Extended
  # Allow: /  # Uncomment to appear in Google AI Overviews

  User-agent: anthropic-ai
  Disallow: /

  User-agent: FacebookBot
  Allow: /

  # ============================================
  # Development environment - BLOCK ALL
  # ============================================
  ${isDev ? `User-agent: *
  Disallow: /` : ''}`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': isDev ? 'no-cache' : 'public, max-age=3600, s-maxage=7200'
    }
  });
}