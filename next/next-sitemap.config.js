/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://qwilo.es',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/server-sitemap.xml', '/api/*', '/admin/*', '/*.png', '/*.jpg', '/*.jpeg', '/*.svg', '/*.ico'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://qwilo.es'}/server-sitemap.xml`,
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
  transform: async (config, path) => {
    // Skip image files and icons
    if (path.match(/\.(png|jpg|jpeg|svg|ico|gif|webp)$/i)) {
      return null;
    }

    // Custom priority for different pages
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '/' || path === '/es' || path === '/en') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/blog/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.includes('/products/')) {
      priority = 0.9;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
