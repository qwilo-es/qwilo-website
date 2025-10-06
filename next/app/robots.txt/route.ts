import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `# *
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# Host
Host: https://qwilo.es

# Sitemaps
Sitemap: https://qwilo.es/sitemap.xml
Sitemap: https://qwilo.es/server-sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
