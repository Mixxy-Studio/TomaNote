// src/pages/sitemap.xml.js
export async function GET() {
  const siteUrl = 'https://tomanote.app';
  
  const pages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    // { url: '/about', changefreq: 'monthly', priority: 0.7 },
    // { url: '/privacy', changefreq: 'yearly', priority: 0.5 },
    // { url: '/terms', changefreq: 'yearly', priority: 0.5 }
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${siteUrl}${page.url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}